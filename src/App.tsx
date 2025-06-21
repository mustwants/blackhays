import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import FloatingActionMenu from './components/FloatingActionMenu';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/common/Toaster';

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial resources loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Check if current route is login/register to hide navigation
  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname === '/reset-password';

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <ProjectProvider>
        <div className="min-h-screen bg-white flex flex-col">
          {!isAuthPage && <NavBar />}
          <main className="flex-grow">
            <Outlet />
          </main>
          {!isAuthPage && <FloatingActionMenu />}
          <Toaster />
        </div>
      </ProjectProvider>
    </AuthProvider>
  );
}
