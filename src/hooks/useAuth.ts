import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("useAuth: Checking authentication status...");
      
      // Try to get authentication status from authService
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // If authenticated, get the current user
      if (authenticated) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        console.log("useAuth: User is authenticated");
      } else {
        // Check if we have a session stored locally
        const session = localStorage.getItem('auth_session');
        if (session) {
          try {
            const sessionData = JSON.parse(session);
            if (sessionData?.user) {
              setIsAuthenticated(true);
              setUser(sessionData.user);
              console.log("useAuth: User authenticated from local session");
            }
          } catch (parseError) {
            console.error("useAuth: Error parsing local session:", parseError);
          }
        }
      }
    } catch (error) {
      console.error("useAuth: Error checking authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("useAuth: Attempting login...");
      setIsLoading(true);
      
      const { data, error } = await authService.login(email, password);
      
      if (error) {
        console.error("useAuth: Login error:", error);
        return { data: null, error };
      }
      
      console.log("useAuth: Login successful");
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { data, error: null };
    } catch (error) {
      console.error("useAuth: Login error:", error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("useAuth: Logging out...");
      setIsLoading(true);
      
      await authService.logout();
      
      // Clear state regardless of whether the logout succeeds
      setUser(null);
      setIsAuthenticated(false);
      
      console.log("useAuth: Logout successful");
      return { error: null };
    } catch (error) {
      console.error("useAuth: Logout error:", error);
      
      // Clear state even if logout fails
      setUser(null);
      setIsAuthenticated(false);
      
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
}