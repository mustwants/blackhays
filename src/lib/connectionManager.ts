// src/lib/connectionManager.ts
export class ConnectionManager {
  private static instance: ConnectionManager;
  private _connected: boolean = false;
  private _queue: Array<() => Promise<void>> = [];
  private _listeners: Array<(connected: boolean) => void> = [];
  private _retryTimeout: NodeJS.Timeout | null = null;
  private _retryCount: number = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ConnectionManager();
    }
    return this.instance;
  }

  addListener(listener: (connected: boolean) => void) {
    this._listeners.push(listener);
    listener(this._connected);
  }

  removeListener(listener: (connected: boolean) => void) {
    this._listeners = this._listeners.filter(l => l !== listener);
  }

  isConnected() {
    return this._connected;
  }

  setConnected(isConnected: boolean) {
    if (this._connected !== isConnected) {
      this._connected = isConnected;
      this._listeners.forEach(listener => listener(isConnected));
      
      if (isConnected) {
        this._retryCount = 0;
        if (this._retryTimeout) {
          clearTimeout(this._retryTimeout);
          this._retryTimeout = null;
        }
        this.processQueue();
      } else {
        this.scheduleRetry();
      }
    }
  }

  private scheduleRetry() {
    if (this._retryCount < this.MAX_RETRIES) {
      this._retryCount++;
      const delay = this.RETRY_DELAY * Math.pow(2, this._retryCount - 1);
      
      if (this._retryTimeout) {
        clearTimeout(this._retryTimeout);
      }
      
      this._retryTimeout = setTimeout(() => {
        this.attemptReconnect();
      }, delay);
    }
  }

  private async attemptReconnect() {
    try {
      // Try to validate connection
      const response = await fetch('/api/health');
      if (response.ok) {
        this.setConnected(true);
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
      this.scheduleRetry();
    }
  }

  queueOperation(operation: () => Promise<void>) {
    this._queue.push(operation);
    if (this._connected) {
      this.processQueue();
    }
  }

  private async processQueue() {
    while (this._queue.length > 0 && this._connected) {
      const operation = this._queue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Failed to process queued operation:', error);
          // If operation fails due to connection, trigger reconnection
          if (this.isConnectionError(error)) {
            this.setConnected(false);
            break;
          }
        }
      }
    }
  }

  private isConnectionError(error: any): boolean {
    return error?.message?.includes('network') || 
           error?.message?.includes('connection') ||
           error?.message?.includes('timeout');
  }
}