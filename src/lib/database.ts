// src/lib/database.ts
import { supabase } from './supabaseClient';

// This object wraps Supabase client calls in a centralized API
export const db = {
  // Generic query builder
  from: (table: string) => supabase.from(table),

  // Example of inserting data
  insert: (table: string, values: any) => supabase.from(table).insert(values),

  // Example of selecting all data
  selectAll: (table: string) => supabase.from(table).select('*'),

  // Example of selecting with filter
  selectWhere: (table: string, column: string, value: any) =>
    supabase.from(table).select('*').eq(column, value),

  // Example of updating data
  updateWhere: (table: string, match: Record<string, any>, values: any) =>
    supabase.from(table).update(values).match(match),

  // Example of deleting data
  deleteWhere: (table: string, match: Record<string, any>) =>
    supabase.from(table).delete().match(match),
};

