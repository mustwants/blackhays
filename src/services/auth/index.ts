import { supabase } from '../../lib/supabaseClient';

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
    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase();
    
    // Check admin credentials first
    const isAdminUser = Object.entries(ADMIN_CREDENTIALS).some(
      ([adminEmail, adminPassword]) => 
        adminEmail.toLowerCase() === normalizedEmail && 
        password === adminPassword
    );
    
    if (isAdminUser) {
      console.log('Auth service: Admin login successful:', normalizedEmail);
      
      // Create admin user data
      const adminUser = {
        id: 'admin-user-id',
        email: normalizedEmail,
        role: 'admin',
        app_metadata: { role: 'admin' }
      };
      
      // Session data
      const sessionData = {
        user: adminUser,
        session: {
          access_token: `admin-token-${Date.now()}`,
          refresh_token: `admin-refresh-${Date.now()}`,
          expires_at: Date.now() + 3600000 // 1 hour
        }
      };
      
      // Store auth data in localStorage
      try {
        localStorage.setItem('auth_session', JSON.stringify(sessionData));
        localStorage.setItem('auth_token', sessionData.session.access_token);
      } catch (storageError) {
        console.warn('Failed to store admin session in localStorage:', storageError);
      }
      
      return { 
        user: adminUser,
        session: sessionData.session
      };
    }

    // If not admin, try Supabase auth
    console.log("Attempting Supabase login");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    return data;
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
    // Check for admin session in localStorage
    try {
      const sessionData = localStorage.getItem('auth_session');
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        if (parsedSession?.user) {
          return parsedSession.user;
        }
      }
    } catch (storageError) {
      console.warn('Failed to get admin session from localStorage:', storageError);
    }

    // If no admin session, check Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user from Supabase:', error);
      return null;
    }
  }

  async isAuthenticated() {
    // First check for admin session in localStorage
    try {
      const hasLocalAuth = localStorage.getItem('auth_session') !== null || 
                          localStorage.getItem('auth_token') !== null;
      if (hasLocalAuth) {
        return true;
      }
    } catch (storageError) {
      console.warn('Failed to check local auth status:', storageError);
    }

    // If no admin session, check Supabase
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