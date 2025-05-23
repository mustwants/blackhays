import { supabase } from '../../lib/supabaseClient';

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface ApiService {
  get<T>(endpoint: string): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  delete(endpoint: string): Promise<ApiResponse<void>>;
}

class SupabaseApiService implements ApiService {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .select('*');

      if (error) throw error;
      return { data: data as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: responseData, error } = await supabase
        .from(endpoint)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { data: responseData as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: responseData, error } = await supabase
        .from(endpoint)
        .update(data)
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return { data: responseData as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async delete(endpoint: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(endpoint)
        .delete();

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const apiService = new SupabaseApiService();