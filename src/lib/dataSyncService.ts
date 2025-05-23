// src/lib/dataSyncService.ts
import { LocalStorageService } from './localStorageService';
import { ConnectionManager } from './connectionManager';
import { supabase } from './supabaseClient';

export class DataSyncService {
  private static readonly PENDING_CHANGES_KEY = 'pendingChanges';
  private connectionManager = ConnectionManager.getInstance();

  async syncPendingChanges() {
    const pendingChanges = LocalStorageService.getItem<Array<any>>(DataSyncService.PENDING_CHANGES_KEY) || [];
    
    for (const change of pendingChanges) {
      try {
        await this.applyChange(change);
        this.removePendingChange(change);
      } catch (error) {
        console.error('Failed to sync change:', error);
      }
    }
  }

  queueChange(change: any) {
    const pendingChanges = LocalStorageService.getItem<Array<any>>(DataSyncService.PENDING_CHANGES_KEY) || [];
    pendingChanges.push(change);
    LocalStorageService.setItem(DataSyncService.PENDING_CHANGES_KEY, pendingChanges);
    
    this.connectionManager.queueOperation(() => this.syncPendingChanges());
  }

  private async applyChange(change: any) {
    const { table, operation, data } = change;
    
    switch (operation) {
      case 'insert':
        await supabase.from(table).insert(data);
        break;
      case 'update':
        await supabase.from(table).update(data).eq('id', data.id);
        break;
      case 'delete':
        await supabase.from(table).delete().eq('id', data.id);
        break;
    }
  }

  private removePendingChange(change: any) {
    const pendingChanges = LocalStorageService.getItem<Array<any>>(DataSyncService.PENDING_CHANGES_KEY) || [];
    const filtered = pendingChanges.filter(c => c !== change);
    LocalStorageService.setItem(DataSyncService.PENDING_CHANGES_KEY, filtered);
  }
}
