// Database helper functions
import { supabase, supabaseAdmin, isConnected as supabaseIsConnected } from './supabaseClient';

const client = supabaseAdmin ?? supabase;

// Generic type for all submission types
export interface Submission {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'paused';
  created_at: string;
  [key: string]: any;
}

// Table names
export const TABLES = {
  EVENTS: 'events',
  EVENT_SUBMISSIONS: 'event_submissions',
  ADVISOR_APPLICATIONS: 'advisor_applications',
  COMPANY_SUBMISSIONS: 'company_submissions',
  CONSORTIUM_SUBMISSIONS: 'consortium_submissions',
  INNOVATION_SUBMISSIONS: 'innovation_submissions',
  NEWSLETTER_SUBSCRIBERS: 'newsletter_subscribers'
} as const;

// Database helper functions
class DatabaseHelpers {
  // Helper function to safely select data
  static async safeSelect<T>(
    table: string,
    options: {
      columns?: string;
      filters?: { column: string; value: any }[];
      orderBy?: { column: string; ascending?: boolean };
    } = {}
  ): Promise<{ data: T[] | null; error: string | null }> {
    try {
      let query = client.from(table).select(options.columns || '*');
      
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.eq(filter.column, filter.value);
        });
      }
      
      if (options.orderBy) {
        query = query.order(
          options.orderBy.column,
          { ascending: options.orderBy.ascending ?? true }
        );
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error selecting from ${table}:`, error);
        throw error;
      }
      return { data: data as T[], error: null };
    } catch (err) {
      console.error(`Error selecting from ${table}:`, err);
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }

  // Helper function to safely insert data
  static async safeInsert<T>(
    table: string,
    data: any,
    options: { 
      returnData?: boolean;
      maxRetries?: number;
    } = {}
  ): Promise<{ data: T | null; error: string | null }> {
    const maxRetries = options.maxRetries || 1;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        let query = client.from(table).insert(data);
        
        if (options.returnData) {
          query = query.select().single();
        }
        
        const { data: result, error } = await query;
        
        if (error) {
          console.error(`Error inserting into ${table}:`, error);
          throw error;
        }
        return { data: result as T, error: null };
      } catch (err) {
        attempt++;
        console.warn(`Insert attempt ${attempt} failed for ${table}:`, err);
        
        if (attempt === maxRetries) {
          console.error(`Error inserting into ${table} after ${maxRetries} attempts:`, err);
          return { 
            data: null, 
            error: err instanceof Error ? 
              err.message : 
              `Failed to insert into ${table} after ${maxRetries} attempts` 
          };
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return { data: null, error: 'Max retries exceeded' };
  }

  // Helper function to safely update data
  static async safeUpdate<T>(
    table: string,
    query: { column: string; value: any },
    data: any,
    options: { returnData?: boolean } = {}
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      console.log(`Updating ${table} where ${query.column} = ${query.value} with data:`, data);
      
      let updateQuery = client
        .from(table)
        .update(data)
        .eq(query.column, query.value);
      
      if (options.returnData) {
        updateQuery = updateQuery.select().maybeSingle();
      }
      
      const { data: result, error } = await updateQuery;
      
      if (error) {
        console.error(`Error updating ${table}:`, error);
        throw error;
      }
      
      if (options.returnData && !result) {
        console.error(`No rows updated in ${table}`);
        return { data: null, error: 'No rows updated' };
      }

      return { data: result as T, error: null };
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }

  // Helper function to safely delete data
  static async safeDelete(
    table: string,
    query: { column: string; value: any }
  ): Promise<{ error: string | null }> {
    try {
      console.log(`Deleting from ${table} where ${query.column} = ${query.value}`);
      
      const { error } = await client
        .from(table)
        .delete()
        .eq(query.column, query.value);
      
      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }
      return { error: null };
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err);
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }
}

// Database operations
export const db = {
  // Check connection status
  isConnected: () => supabaseIsConnected(),
  
  // Generic fetch function for submissions
  async fetchSubmissions<T extends Submission>(table: string) {
    console.log(`Fetching submissions from ${table}`);
    return DatabaseHelpers.safeSelect<T>(table, {
      orderBy: { column: 'created_at', ascending: false }
    });
  },

  // Generic fetch function for approved submissions
  async fetchApprovedSubmissions<T extends Submission>(table: string) {
    console.log(`Fetching approved submissions from ${table}`);
    return DatabaseHelpers.safeSelect<T>(table, {
      filters: [{ column: 'status', value: 'approved' }],
      orderBy: { column: 'created_at', ascending: false }
    });
  },

  // Generic submission status update
  async updateSubmissionStatus(
    table: string,
    id: string,
    status: Submission['status']
  ) {
    console.log(`Updating status to "${status}" for item ${id} in ${table}`);
    return DatabaseHelpers.safeUpdate(
      table,
      { column: 'id', value: id },
      { status },
      { returnData: true }
    );
  },

  // Generic submission delete
  async deleteSubmission(table: string, id: string) {
    console.log(`Deleting item ${id} from ${table}`);
    return DatabaseHelpers.safeDelete(table, { column: 'id', value: id });
  },

  // Generic submission update
  async updateSubmission<T extends Submission>(
    table: string,
    id: string,
    data: Partial<T>
  ) {
    console.log(`Updating item ${id} in ${table}`);
    return DatabaseHelpers.safeUpdate<T>(
      table,
      { column: 'id', value: id },
      data,
      { returnData: true }
    );
  },

  // Generic submission create
  async createSubmission<T extends Submission>(
    table: string,
    data: Omit<T, 'id' | 'created_at'>
  ) {
    console.log(`Creating new submission in ${table}:`, data);
    
    // Remove empty string, undefined or null fields to avoid schema errors
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) =>
        value !== undefined && value !== null && value !== ''
      )
    );

    const submissionData = {
      ...sanitizedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return DatabaseHelpers.safeInsert<T>(table, submissionData, {
      returnData: true,
      maxRetries: 3
    });
  },
  
  // Create a real record from mock data - useful for syncing mock data to database
  async createFromMockData<T extends Submission>(
    table: string,
    mockData: Omit<T, 'id'>
  ) {
    console.log(`Creating from mock data in ${table}`);
    
    // Strip any potential mock ID and timestamps
    const { id, created_at, updated_at, ...dataWithoutId } = mockData as any;
    

    // Remove empty or undefined fields and ensure timestamps
    const sanitizedData = Object.fromEntries(
      Object.entries(dataWithoutId).filter(([, value]) =>
        value !== undefined && value !== null && value !== ''
      )
    );

    const data = {
      ...sanitizedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Attempt to insert with retry logic
    return DatabaseHelpers.safeInsert<T>(table, data, {
      returnData: true,
      maxRetries: 3
    });
  }
};

// Export database helper functions
export const {
  safeSelect,
  safeInsert,
  safeUpdate,
  safeDelete
} = DatabaseHelpers;
