import { supabase } from '../../supabaseClient';
import { isConnected } from '../../supabaseClient';

// Hardcoded admin credentials for direct comparison
const ADMIN_CREDENTIALS = {
  'admin@example.com': 'Admin1967',
  'scott@blackhaysgroup.com': 'Admin1967!'
};

export interface AuthService {
  login(email: string, password: string): Promise<any>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<any>;
  isAuthenticated(): Promise<boolean>;
}

class SupabaseAuthService implements AuthService {
  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
   if (!isConnected()) {
      console.error('Database connection unavailable');
           return {
        data: null,
        error: {
         message: 'Database connection is currently unavailable. Please try again later.',
          code: 'connection_unavailable'
        }
      };
    }

    console.log('Attempting Supabase login');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return { data: null, error };
    }
    // Persist session for subsequent requests
    try {
      if (data.session) {
        localStorage.setItem('auth_session', JSON.stringify(data));
        localStorage.setItem('auth_token', data.session.access_token);
      }
    } catch (storageError) {
      console.warn('Failed to store session in localStorage:', storageError);
    }
    return { data, error: null };
  }

  async logout() {
    // Clear local storage first
    try {
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_session');
    } catch (storageError) {
      console.warn('Failed to clear session from storage:', storageError);
    }

    // Sign out from Supabase (might fail, but local logout still works)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during Supabase signOut:', error);
    }
  }

  async getCurrentUser() {
  // Check for stored session in localStorage
    try {
      const sessionData = localStorage.getItem('auth_session');
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        if (parsedSession?.user) {
          return parsedSession.user;
        }
      }
    } catch (storageError) {
      console.warn('Failed to get session from localStorage:', storageError);
    }

    // Fallback to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user from Supabase:', error);
      return null;
    }
  }

  async isAuthenticated() {
    // First check for stored session in localStorage
    try {
      const hasLocalAuth =
        localStorage.getItem('auth_session') !== null ||
        localStorage.getItem('auth_token') !== null;
      if (hasLocalAuth) {
        return true;
      }
    } catch (storageError) {
      console.warn('Failed to check local auth status:', storageError);
    }

    // Fallback to Supabase session
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Error checking Supabase authentication:', error);
      return false;
    }
  }
}

export const authService = new SupabaseAuthService();
