import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { login, logout } from '../lib/auth';
import { Lock, User, Settings, LogOut, Search, Filter, RefreshCw, Download, Trash2, Edit2, Check, X, Mail, PlusCircle, UserPlus, Database, Calendar, LayoutDashboard } from 'lucide-react';
import NewsletterSubscribers from './NewsletterSubscribers';
import CompanySubmissions from './admin/CompanySubmissions';
import ConsortiumSubmissions from './admin/ConsortiumSubmissions';
import InnovationSubmissions from './admin/InnovationSubmissions';
import AdminUserManagement from './admin/AdminUserManagement';
import MockDataGenerator from './admin/MockDataGenerator';
import EventSubmissions from './admin/EventSubmissions';
import AdminDashboard from './admin/AdminDashboard';
import { useNavigate } from 'react-router-dom';

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'advisors' | 'newsletter' | 'companies' | 'consortiums' | 'innovations' | 'admins' | 'mockdata'>('dashboard');
  const [eventSubmissions, setEventSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First try Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Also check localStorage for admin session
      const authSession = localStorage.getItem('auth_session');
      const authToken = localStorage.getItem('auth_token');
      
      const hasLocalAuth = authSession || authToken;
      
      setIsAuthenticated(!!session || !!hasLocalAuth);
      
      if (session || hasLocalAuth) {
        console.log("User is authenticated");
      }
    } catch (err) {
      console.error("Error checking authentication:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with email:', email);
      const { data, error } = await login(email, password);
      
      console.log('Login response:', { data, error });
      
      if (error) {
        console.error('Login failed with error:', error);
        setError('Invalid credentials. Please try again.');
        return;
      }

      if (!data?.session && !data?.user) {
        console.error('No session or user data returned');
        setError('Authentication failed. Please try again.');
        return;
      }
      
      console.log('Login successful, setting authenticated');
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Login error:", err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      if (onClose) {
        onClose();
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Error during logout:", err);
      // Even if there's an error, still log them out of the UI
      setIsAuthenticated(false);
      if (onClose) {
        onClose();
      } else {
        navigate('/');
      }
    }
  };

  const handleMockDataGenerated = (type: string, data: any[]) => {
    switch (type) {
      case 'event':
        setEventSubmissions(prev => [...prev, ...data]);
        setActiveTab('events'); // Switch to events tab after generating mock data
        break;
      // Add other cases as needed
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-bhred" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bhred text-white rounded-md py-2 px-4 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-bhred text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:text-red-200"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
            <button
              onClick={onClose || (() => navigate('/'))}
              className="text-white hover:text-red-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-bhgray-200">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              <div className="flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'events'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Event Submissions
              </div>
            </button>
            <button
              onClick={() => setActiveTab('advisors')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'advisors'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Advisor Applications
              </div>
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'companies'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              Companies
            </button>
            <button
              onClick={() => setActiveTab('consortiums')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'consortiums'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              Consortiums
            </button>
            <button
              onClick={() => setActiveTab('innovations')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'innovations'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              Innovations
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'newsletter'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Newsletter
              </div>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'admins'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              <div className="flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Admins
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mockdata')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'mockdata'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Test Data
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === 'dashboard' && (
            <AdminDashboard />
          )}
          
          {activeTab === 'events' && (
            <EventSubmissions initialData={eventSubmissions} />
          )}
          
          {activeTab === 'companies' && (
            <CompanySubmissions />
          )}
          
          {activeTab === 'consortiums' && (
            <ConsortiumSubmissions />
          )}
          
          {activeTab === 'innovations' && (
            <InnovationSubmissions />
          )}
          
          {activeTab === 'newsletter' && (
            <NewsletterSubscribers />
          )}

          {activeTab === 'admins' && (
            <AdminUserManagement />
          )}
          
          {activeTab === 'mockdata' && (
            <MockDataGenerator onDataGenerated={handleMockDataGenerated} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;