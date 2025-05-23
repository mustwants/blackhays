import React, { useState } from 'react';
import AdminPanel from '../components/AdminPanel';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for admin session in localStorage (simplest and most reliable method)
        const authSession = localStorage.getItem('auth_session');
        const authToken = localStorage.getItem('auth_token');
        
        // Set authenticated if we have local auth data
        setIsAuthenticated(!!authSession || !!authToken);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhred"></div>
      </div>
    );
  }

  // Always render the AdminPanel - it will show login form if not authenticated
  return <AdminPanel />;
};

export default AdminPage;