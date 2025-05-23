import React from 'react';
import AdminPanelComponent from '../components/AdminPanel';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AdminPanel = () => {
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);
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

  if (isAuthenticated === false) {
    // If not authenticated, show the admin panel but it will display the login form
    return <AdminPanelComponent />;
  }

  return <AdminPanelComponent />;
};

export default AdminPanel;