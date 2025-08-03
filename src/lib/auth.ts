import { supabase } from './supabaseClient';
import Cookies from 'js-cookie';

// Simple token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const SESSION_KEY = 'auth_session';

// Hardcoded admin credentials for direct comparison
const ADMIN_CREDENTIALS = {
  'admin@example.com': 'Admin1967',
  'scott@blackhaysgroup.com': 'Admin1967!'
};

export const login = async (email: string, password: string) => {
  try {
    console.log('Login attempt for:', email);
    
    // Check hardcoded admin credentials first
    const normalizedEmail = email.toLowerCase();
    console.log('Normalized email:', normalizedEmail);
    
    const isAdminUser = Object.entries(ADMIN_CREDENTIALS).some(
      ([adminEmail, adminPassword]) => 
        adminEmail.toLowerCase() === normalizedEmail && 
        password === adminPassword
    );

    console.log('Is admin user:', isAdminUser);
    
    if (isAdminUser) {
      console.log('Auth service: Admin login successful:', normalizedEmail);
      
      // Create admin user data with correct role
      const adminUser = {
        id: 'admin-user-id',
        email: normalizedEmail,
        role: 'authenticated',
        app_metadata: { role: 'authenticated' }
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
      
      // Store auth data
      try {
        localStorage.setItem('auth_session', JSON.stringify(sessionData));
        localStorage.setItem('auth_token', sessionData.session.access_token);
        console.log('Admin session stored successfully');
      } catch (storageError) {
        console.warn('Failed to store admin session:', storageError);
      }
      
      return { data: sessionData, error: null };
    }

    console.log('Not admin user, trying Supabase auth');
    // Try Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Login error:", error);
    return { data: null, error };
  }
};

export const logout = async () => {
  try {
    // Clear all stored auth data
    try {
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_session');
    } catch (storageError) {
      console.warn('Failed to clear session:', storageError);
    }

    // Sign out from Supabase
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during Supabase signOut:', error);
    }
  } catch (err) {
    console.error('Error during logout:', err);
  }
};

export const getCurrentUser = async () => {
  try {
    // Check for admin session
    try {
      const sessionData = localStorage.getItem('auth_session');
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        if (parsedSession?.user) {
          return parsedSession.user;
        }
      }
    } catch (storageError) {
      console.warn('Failed to get admin session:', storageError);
    }

    // Check Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

export const auth = {
  isAuthenticated: async () => {
    // Check for admin session
    const session = localStorage.getItem('auth_session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession?.user) {
          return true;
        }
      } catch (e) {
        console.warn('Failed to parse stored session:', e);
      }
    }
    
    // Check Supabase session
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }
};