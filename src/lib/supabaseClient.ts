import { createClient } from '@supabase/supabase-js';
import { ConnectionManager } from './connectionManager';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'implicit'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-application-name': 'blackhays-group-v3'
    }
  },
  db: {
    schema: 'public'
  }
});

// Create Supabase admin client when service role key is available
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    })
  : null;

// Get connection manager instance
const connectionManager = ConnectionManager.getInstance();

// Helper function to check if an error is a Supabase error
export const isSupabaseError = (error: any): boolean => {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
};

// Helper function to format Supabase errors
export const formatSupabaseError = (error: any): string => {
  if (isSupabaseError(error)) {
    return `Database error: ${error.message}`;
  }
  return error?.message || 'An unknown error occurred';
};

// Maximum number of connection attempts
const MAX_CONNECTION_ATTEMPTS = 3;
let connectionAttempts = 0;

// Function to validate Supabase connection with retry logic
export const validateSupabaseConnection = async (retryCount = 0): Promise<boolean> => {
  try {
    console.log(`Validating Supabase connection (attempt ${retryCount + 1}/${MAX_CONNECTION_ATTEMPTS})...`);
    
    // Try to make a simple query to test the connection
    const { data, error } = await supabase
      .from('events')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Retry logic
      if (retryCount < MAX_CONNECTION_ATTEMPTS - 1) {
        console.log(`Retrying connection in 2 seconds... (${retryCount + 1}/${MAX_CONNECTION_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return validateSupabaseConnection(retryCount + 1);
      }
      
      connectionManager.setConnected(false);
      console.error('Failed to connect to Supabase after multiple attempts');
      return false;
    }
    
    console.log('Successfully connected to Supabase');
    connectionManager.setConnected(true);
    return true;
  } catch (err) {
    console.error('Failed to validate Supabase connection:', err);
    
    // Retry logic for unexpected errors
    if (retryCount < MAX_CONNECTION_ATTEMPTS - 1) {
      console.log(`Retrying connection in 2 seconds... (${retryCount + 1}/${MAX_CONNECTION_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return validateSupabaseConnection(retryCount + 1);
    }
    
    connectionManager.setConnected(false);
    return false;
  }
};

// Function to check if Supabase is connected
export const isConnected = (): boolean => {
  return connectionManager.isConnected();
};

// Initialize connection validation
validateSupabaseConnection().then(isConnected => {
  if (isConnected) {
    console.log('Successfully connected to Supabase');
  } else {
    console.error('Failed to connect to Supabase');
  }
});

// Set up periodic health checks every 5 minutes
setInterval(validateSupabaseConnection, 300000);

// Export other functions and types
export * from './database';
