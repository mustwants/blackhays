import React, { useState } from 'react';
import { Lock, Shield, LogOut, Users, Calendar, Building, Rocket, Brain, Mail, BarChart3, Database } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminUserManagement from './AdminUserManagement';
import EventSubmissions from './EventSubmissions';
import CompanySubmissions from './CompanySubmissions';
import ConsortiumSubmissions from './ConsortiumSubmissions';
import InnovationSubmissions from './InnovationSubmissions';
import NewsletterSubscribers from '../NewsletterSubscribers';
import AdminDashboard from './AdminDashboard';
import TestDataGenerator from './TestDataGenerator';
import AdvisorApplications from './AdvisorApplications';

interface AdminPanelProps {
  onClose?: () => void;
}

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataGenerated = () => {
    // Force refresh all admin components
    setRefreshKey(prev => prev + 1);
    
    // Add a longer delay to ensure all data is inserted before refreshing
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      // If dashboard is active, trigger another refresh after stats are calculated
      if (activeTab === 'dashboard') {
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
        }, 500);
      }
    }, 1500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await login(email, password);
      if (error) {
        throw new Error(error.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'testdata', label: 'Test Data', icon: Database },
    { id: 'advisors', label: 'Advisor Applications', icon: Users },
    { id: 'events', label: 'Event Submissions', icon: Calendar },
    { id: 'companies', label: 'Company Submissions', icon: Building },
    { id: 'consortiums', label: 'Consortium Submissions', icon: Rocket },
    { id: 'innovations', label: 'Innovation Submissions', icon: Brain },
    { id: 'newsletter', label: 'Newsletter Subscribers', icon: Mail },
    { id: 'users', label: 'Admin Users', icon: Shield }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhred mx-auto"></div>
          <p className="mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-bhred mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred px-3 py-2"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}

            <div className="flex justify-between">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="px-4 py-2 bg-bhred text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="text-blue-800">
              <strong>Demo credentials:</strong><br />
              Email: admin@example.com<br />
              Password: Admin1967
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email || 'Admin'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-2 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-bhred text-bhred'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && <AdminDashboard onCategoryClick={setActiveTab} />}
          {activeTab === 'testdata' && <TestDataGenerator onDataGenerated={handleDataGenerated} />}
          {activeTab === 'advisors' && (
            <AdvisorApplications key={`advisors-${refreshKey}`} />
          )}
          {activeTab === 'events' && <EventSubmissions key={`events-${refreshKey}`} />}
          {activeTab === 'companies' && <CompanySubmissions key={`companies-${refreshKey}`} />}
          {activeTab === 'consortiums' && <ConsortiumSubmissions key={`consortiums-${refreshKey}`} />}
          {activeTab === 'innovations' && <InnovationSubmissions key={`innovations-${refreshKey}`} />}
          {activeTab === 'newsletter' && <NewsletterSubscribers key={`newsletter-${refreshKey}`} />}
          {activeTab === 'users' && <AdminUserManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;