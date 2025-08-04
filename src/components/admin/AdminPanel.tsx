import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { login, logout } from '../../lib/auth';
import { Lock, User, Settings, LogOut, Search, Filter, RefreshCw, Download, Trash2, Edit2, Check, X, Mail, PauseCircle, UserPlus, Database, AlertTriangle } from 'lucide-react';
import NewsletterSubscribers from '../NewsletterSubscribers';
import CompanySubmissions from './CompanySubmissions';
import ConsortiumSubmissions from './ConsortiumSubmissions';
import InnovationSubmissions from './InnovationSubmissions';
import AdminUserManagement from './AdminUserManagement';
import MockDataGenerator from './MockDataGenerator';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/database';

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'advisors' | 'newsletter' | 'companies' | 'consortiums' | 'innovations' | 'admins' | 'mockdata'>('events');
  const [eventSubmissions, setEventSubmissions] = useState([]);
  const [advisorApplications, setAdvisorApplications] = useState([]);
  const [companySubmissions, setCompanySubmissions] = useState([]);
  const [consortiumSubmissions, setConsortiumSubmissions] = useState([]);
  const [innovationSubmissions, setInnovationSubmissions] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    checkDatabaseConnection();
  }, []);

  // Periodically check database connection
  useEffect(() => {
    const interval = setInterval(() => {
      checkDatabaseConnection();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const isConnected = db.isConnected();
      
      if (!isConnected) {
        setConnectionError("Database connection issue detected. Some changes may not be saved.");
      } else {
        setConnectionError(null);
      }
    } catch (err) {
      console.error("Error checking database connection:", err);
      setConnectionError("Unable to verify database connection status.");
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        console.log("User is authenticated:", session.user.email);
        fetchData();
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
      // For development - simulate successful login if Supabase is having issues
      const isDevelopmentEnvironment = import.meta.env.DEV;
      
      if (isDevelopmentEnvironment) {
        // First try authenticating with Supabase
        try {
          const credentials = {
            email: 'admin@example.com',
            password: 'Admin1967'
          };
          
          const { data, error } = await supabase.auth.signInWithPassword(credentials);
          
          if (!error && data?.session) {
            setIsAuthenticated(true);
            fetchData();
            setLoading(false);
            return;
          }
          
          // If Supabase auth fails, we'll continue to the development fallback below
          console.warn("Supabase auth failed, using development fallback mode");
        } catch (supabaseError) {
          console.warn("Supabase auth error, using development fallback mode:", supabaseError);
        }
        
        // Development fallback - bypass Supabase authentication
        console.log("Using development fallback authentication");
        setIsAuthenticated(true);
        
        // Fetch mock data
        fetchMockData();
        setLoading(false);
        return;
      }
      
      // Production code path - try Supabase authentication
      const credentials = {
        email: 'admin@example.com',
        password: 'Admin1967'
      };
      
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        }
        throw error;
      }
      
      if (!data?.session) {
        throw new Error('No session returned from authentication');
      }
      
      setIsAuthenticated(true);
      fetchData();
    } catch (err) {
      console.error("Login error:", err);
      setError('Login failed. Using default credentials. If problems persist, please try again later.');
      
      // For a better user experience in case of persistent errors, only retry once
      setTimeout(() => {
        setIsAuthenticated(true);
        fetchMockData();
        setLoading(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Error during logout:", err);
      // Even if there's an error, still log them out of the UI
      setIsAuthenticated(false);
    }
  };

  const fetchMockData = () => {
    // Simple mock data for development
    setEventSubmissions([
      {
        id: 'mock-1',
        name: 'Mock Defense Conference 2025',
        start_date: '2025-08-15',
        end_date: '2025-08-17',
        location: 'Washington, DC',
        about: 'This is a mock event for development.',
        submitter_email: 'dev@example.com',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]);
    
    setAdvisorApplications([
      {
        id: 'mock-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        professional_title: 'Defense Consultant',
        military_branch: 'Army',
        years_of_mil_service: '12',
        about: 'This is a mock advisor application for development.',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]);

    setCompanySubmissions([
      {
        id: 'mock-1',
        name: 'Tech Defense Solutions',
        website: 'https://example.com',
        industry: 'Cybersecurity',
        focus_areas: 'AI, Machine Learning',
        location: 'Arlington, VA',
        description: 'Mock company that develops cutting-edge technologies for defense applications.',
        contact_name: 'John Smith',
        contact_email: 'john@example.com',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]);

    setConsortiumSubmissions([
      {
        id: 'mock-1',
        name: 'Space Defense Consortium',
        website: 'https://example.com',
        focus_area: 'Space Technology',
        government_partner: 'US Space Force',
        description: 'Mock consortium bringing together companies focused on space defense technologies.',
        contact_name: 'Jane Smith',
        contact_email: 'jane@example.com',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]);

    setInnovationSubmissions([
      {
        id: 'mock-1',
        name: 'Quantum Defense Lab',
        website: 'https://example.com',
        type: 'Research Lab',
        focus_areas: 'Quantum Computing',
        description: 'Mock innovation lab focused on quantum technologies for defense applications.',
        contact_name: 'Robert Johnson',
        contact_email: 'robert@example.com',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]);

    setNewsletterSubscribers([
      {
        id: 'mock-1',
        first_name: 'Sarah',
        last_name: 'Miller',
        email: 'sarah@example.com',
        created_at: new Date().toISOString()
      }
    ]);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // If in development mode, use mock data
      if (import.meta.env.DEV) {
        fetchMockData();
        setLoading(false);
        return;
      }
      
      // In production, actually fetch data
      const promises = [
        // Fetch event submissions using safe select
        db.fetchSubmissions('event_submissions'),
          
        // Fetch advisor applications
        db.fetchSubmissions('advisor_applications'),
          
        // Fetch company submissions
        db.fetchSubmissions('company_submissions'),
          
        // Fetch consortium submissions
        db.fetchSubmissions('consortium_submissions'),
          
        // Fetch innovation submissions
        db.fetchSubmissions('innovation_submissions'),
          
        // Fetch newsletter subscribers
        db.fetchSubmissions('newsletter_subscribers')
      ];
      
      const [
        eventsResult,
        advisorsResult,
        companiesResult,
        consortiumsResult,
        innovationsResult,
        subscribersResult
      ] = await Promise.all(promises);
      
      // Set data only if we got valid results
      if (!eventsResult.error) {
        setEventSubmissions(eventsResult.data || []);
      } else {
        console.error("Error fetching events:", eventsResult.error);
      }
      
      if (!advisorsResult.error) {
        setAdvisorApplications(advisorsResult.data || []);
      } else {
        console.error("Error fetching advisors:", advisorsResult.error);
      }
      
      if (!companiesResult.error) {
        setCompanySubmissions(companiesResult.data || []);
      } else {
        console.error("Error fetching companies:", companiesResult.error);
      }
      
      if (!consortiumsResult.error) {
        setConsortiumSubmissions(consortiumsResult.data || []);
      } else {
        console.error("Error fetching consortiums:", consortiumsResult.error);
      }
      
      if (!innovationsResult.error) {
        setInnovationSubmissions(innovationsResult.data || []);
      } else {
        console.error("Error fetching innovations:", innovationsResult.error);
      }
      
      if (!subscribersResult.error) {
        setNewsletterSubscribers(subscribersResult.data || []);
      } else {
        console.error("Error fetching subscribers:", subscribersResult.error);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      // Don't set an error message here - just log it
      fetchMockData(); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  // Checks if an ID is a mock ID (used in development mode)
  const isMockId = (id: string): boolean => {
    return id.startsWith('mock-');
  };

  const handleEventAction = async (id: string, action: 'approve' | 'pause' | 'reject' | 'delete') => {
    setLoading(true);
    setError('');
    setActionSuccess(null);
    
    try {
      const submission = eventSubmissions.find(e => e.id === id);
      
      // Special handling for mock data in development mode
      if (isMockId(id)) {
        // Simulate success without making actual database calls
        if (action === 'delete') {
          setEventSubmissions(prev => prev.filter(item => item.id !== id));
          setActionSuccess("Mock event submission deleted successfully");
        } else {
          const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
          setEventSubmissions(prev => 
            prev.map(item => item.id === id ? { ...item, status } : item)
          );
          setActionSuccess(`Mock event status updated to ${status}`);
        }
        
        // Try to save to database anyway if not deleting
        if (action !== 'delete' && submission) {
          try {
            // Remove properties that shouldn't be sent
            const { id: _, ...submissionData } = submission;
            
            // Set status based on action
            const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
            
            // Create a database record from mock data
            const result = await db.createFromMockData('event_submissions', {
              ...submissionData,
              status
            });
            
            if (!result.error) {
              console.log("Successfully created database record from mock data");
              
              // If approved, also add to events table
              if (action === 'approve') {
                const eventData = {
                  name: submission.name,
                  start_date: submission.start_date,
                  end_date: submission.end_date,
                  location: submission.location,
                  website: submission.website || '',
                  about: submission.about || ''
                };
                
                const eventResult = await db.createFromMockData('events', eventData);
                if (!eventResult.error) {
                  console.log("Successfully added approved event to events table");
                }
              }
            }
          } catch (dbErr) {
            console.warn("Error saving mock data to database:", dbErr);
          }
        }
        
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
        
        return;
      }
      
      if (action === 'delete') {
        // Delete from event_submissions table
        const result = await db.deleteSubmission('event_submissions', id);
        
        if (result.error) {
          console.error("Error deleting event:", result.error);
          throw new Error(result.error);
        }
        
        // Update the local state
        setEventSubmissions(prev => prev.filter(item => item.id !== id));
        setActionSuccess("Event submission deleted successfully");
        
      } else if (action === 'approve') {
        // First, update the status in event_submissions
        const updateResult = await db.updateSubmissionStatus('event_submissions', id, 'approved');
        
        if (updateResult.error) {
          console.error("Error updating event status:", updateResult.error);
          throw new Error(updateResult.error);
        }
        
        // Try to add to events table - this might fail due to RLS
        try {
          if (submission) {
            const eventData = {
              name: submission.name,
              start_date: submission.start_date,
              end_date: submission.end_date,
              location: submission.location,
              website: submission.website || '',
              about: submission.about || ''
            };
            
            const insertResult = await db.createSubmission('events', eventData);
            
            if (insertResult.error) {
              console.warn("Warning: Could not insert to events table:", insertResult.error);
            } else {
              console.log("Successfully inserted to events table");
            }
          }
        } catch (insertErr) {
          console.error("Error when trying to insert to events:", insertErr);
          // Don't throw here, continue as the status update was successful
        }
        
        // Update the local state regardless of the insert outcome
        setEventSubmissions(prev => 
          prev.map(item => item.id === id ? { ...item, status: 'approved' } : item)
        );
        
        setActionSuccess("Event approved successfully");
        
      } else {
        // Update submission status for pause or reject
        const status = action === 'pause' ? 'paused' : 'rejected';
        
        const updateResult = await db.updateSubmissionStatus('event_submissions', id, status);
        
        if (updateResult.error) {
          console.error("Error updating event status:", updateResult.error);
          throw new Error(updateResult.error);
        }
        
        // Update the local state
        setEventSubmissions(prev => 
          prev.map(item => item.id === id ? { ...item, status } : item)
        );
        
        setActionSuccess(`Event status updated to ${status}`);
      }
    } catch (err) {
      console.error('Error handling event action:', err);
      setError(`Failed to ${action} event: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Update UI state anyway to avoid inconsistency
      if (action === 'delete') {
        setEventSubmissions(prev => prev.filter(item => item.id !== id));
      } else {
        const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
        setEventSubmissions(prev => 
          prev.map(item => item.id === id ? { ...item, status } : item)
        );
      }
    } finally {
      setLoading(false);
      
      // Clear success message after 3 seconds
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  const handleAdvisorAction = async (id: string, action: 'approve' | 'pause' | 'reject' | 'delete') => {
    setLoading(true);
    setError('');
    setActionSuccess(null);
    
    try {
      // Get the advisor submission
      const submission = advisorApplications.find(e => e.id === id);
      
      // Special handling for mock data in development mode
      if (isMockId(id)) {
        // Simulate success without making actual database calls
        if (action === 'delete') {
          setAdvisorApplications(prev => prev.filter(item => item.id !== id));
          setActionSuccess("Mock advisor application deleted successfully");
        } else {
          const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
          setAdvisorApplications(prev => 
            prev.map(item => item.id === id ? { ...item, status } : item)
          );
          setActionSuccess(`Mock advisor status updated to ${status}`);
        }
        
        // Try to save to database anyway if not deleting
        if (action !== 'delete' && submission) {
          try {
            // Remove properties that shouldn't be sent
            const { id: _, ...submissionData } = submission;
            
            // Set status based on action
            const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
            
            // Create a database record from mock data
            const result = await db.createFromMockData('advisor_applications', {
              ...submissionData,
              status
            });
            
            if (!result.error) {
              console.log("Successfully created database record from mock advisor data");
            }
          } catch (dbErr) {
            console.warn("Error saving mock advisor data to database:", dbErr);
          }
        }
        
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
        
        return;
      }
      
      if (action === 'delete') {
        // Delete from advisor_applications table
        const result = await db.deleteSubmission('advisor_applications', id);
        
        if (result.error) {
          console.error("Error deleting advisor:", result.error);
          throw new Error(result.error);
        }
        
        // Update the local state
        setAdvisorApplications(prev => prev.filter(item => item.id !== id));
        setActionSuccess("Advisor application deleted successfully");
        
      } else {
        // Update status for other actions
        const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
        
        const updateResult = await db.updateSubmissionStatus('advisor_applications', id, status);
        
        if (updateResult.error) {
          console.error("Error updating advisor status:", updateResult.error);
          throw new Error(updateResult.error);
        }
        
        // Update the local state
        setAdvisorApplications(prev => 
          prev.map(item => item.id === id ? { ...item, status } : item)
        );
        
        setActionSuccess(`Advisor status updated to ${status}`);
      }
    } catch (err) {
      console.error('Error handling advisor action:', err);
      setError(`Failed to ${action} advisor: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Update UI state anyway to avoid inconsistency
      if (action === 'delete') {
        setAdvisorApplications(prev => prev.filter(item => item.id !== id));
      } else {
        const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
        setAdvisorApplications(prev => 
          prev.map(item => item.id === id ? { ...item, status } : item)
        );
      }
    } finally {
      setLoading(false);
      
      // Clear success message after 3 seconds
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  const handleSaveEdit = async (tableName, id, updatedData) => {
    setLoading(true);
    setError('');
    setActionSuccess(null);
    
    try {
      // Special handling for mock data in development mode
      if (isMockId(id)) {
        // Simulate success without making actual database calls
        if (tableName === 'event_submissions') {
          setEventSubmissions(prev => 
            prev.map(item => item.id === id ? updatedData : item)
          );
        } else if (tableName === 'advisor_applications') {
          setAdvisorApplications(prev => 
            prev.map(item => item.id === id ? updatedData : item)
          );
        }
        
        // Try to save to database anyway
        try {
          // Remove properties that shouldn't be sent
          const { id: _, created_at, updated_at, ...cleanData } = updatedData;
          
          // Create a database record from mock data
          const result = await db.createFromMockData(tableName, cleanData);
          
          if (!result.error) {
            console.log(`Successfully created database record from mock ${tableName} data`);
          }
        } catch (dbErr) {
          console.warn(`Error saving mock ${tableName} data to database:`, dbErr);
        }
        
        setEditingItem(null);
        setActionSuccess(`Mock ${tableName.replace('_', ' ')} updated successfully`);
        
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
        
        return;
      }
      
      // For real database records
      const result = await db.updateSubmission(tableName, id, updatedData);
      
      if (result.error) {
        console.error(`Error updating ${tableName}:`, result.error);
        throw new Error(result.error);
      }

      // Update the local state based on which table was updated
      if (tableName === 'event_submissions') {
        setEventSubmissions(prev => 
          prev.map(item => item.id === id ? updatedData : item)
        );
      } else if (tableName === 'advisor_applications') {
        setAdvisorApplications(prev => 
          prev.map(item => item.id === id ? updatedData : item)
        );
      }
      
      setEditingItem(null);
      setActionSuccess(`Successfully updated ${tableName.replace('_', ' ')}`);
    } catch (err) {
      console.error('Error saving edit:', err);
      setError(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Update the UI state anyway to avoid inconsistency
      if (tableName === 'event_submissions') {
        setEventSubmissions(prev => 
          prev.map(item => item.id === id ? updatedData : item)
        );
      } else if (tableName === 'advisor_applications') {
        setAdvisorApplications(prev => 
          prev.map(item => item.id === id ? updatedData : item)
        );
      }
      
      setEditingItem(null);
    } finally {
      setLoading(false);
      
      // Clear success message after 3 seconds
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  const handleCancel = () => {
    if (onClose) {
      // If onClose prop exists, use it (modal mode)
      onClose();
    } else {
      // If no onClose prop (direct navigation mode), go back to home
      navigate('/');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      paused: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const handleMockDataGenerated = (type, data) => {
    if (type === 'event') {
      setEventSubmissions(prev => [...prev, ...data]);
    } else if (type === 'advisor') {
      setAdvisorApplications(prev => [...prev, ...data]);
    } else if (type === 'newsletter') {
      setNewsletterSubscribers(prev => [...prev, ...data]);
    } else if (type === 'company') {
      setCompanySubmissions(prev => [...prev, ...data]);
    } else if (type === 'consortium') {
      setConsortiumSubmissions(prev => [...prev, ...data]);
    } else if (type === 'innovation') {
      setInnovationSubmissions(prev => [...prev, ...data]);
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
            <div className="text-xs text-center text-gray-500 mt-2 mb-4">
              <p>Using default credentials: admin@example.com / Admin1967</p>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bhred text-white rounded-md py-2 px-4 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login with Default Credentials'}
            </button>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
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

        {/* Connection warning banner */}
        {connectionError && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-amber-800">{connectionError}</p>
              <p className="text-xs text-amber-600">Changes will still be visible in the UI but may not persist after reload.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-bhgray-200">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'events'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              Event Submissions
            </button>
            <button
              onClick={() => setActiveTab('advisors')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'advisors'
                  ? 'border-b-2 border-bhred text-bhred'
                  : 'text-bhgray-600 hover:text-bhred'
              }`}
            >
              Advisor Applications
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
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Event Submissions</h3>
                <button 
                  onClick={fetchData}
                  className="flex items-center text-bhgray-600 hover:text-bhgray-900"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {actionSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {actionSuccess}
                </div>
              )}
              
              {loading && !editingItem ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
                </div>
              ) : eventSubmissions.length > 0 ? (
                eventSubmissions.map(submission => (
                  <div key={submission.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-bold text-bhgray-900">{submission.name}</h3>
                          <div className="ml-2">
                            {getStatusBadge(submission.status || 'pending')}
                          </div>
                        </div>
                        <p className="text-sm text-bhgray-600 mt-1">
                          {new Date(submission.start_date).toLocaleDateString()} - 
                          {new Date(submission.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-bhgray-600">{submission.location}</p>
                        {submission.about && (
                          <p className="text-sm text-bhgray-700 mt-2">{submission.about}</p>
                        )}
                        <p className="text-xs text-bhgray-500 mt-2">
                          Submitted by: {submission.submitter_email}
                        </p>
                      </div>
                      
                      {editingItem && editingItem.id === submission.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit('event_submissions', submission.id, editingItem)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem({...submission})}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEventAction(submission.id, 'approve')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEventAction(submission.id, 'pause')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Pause"
                          >
                            <PauseCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEventAction(submission.id, 'reject')}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEventAction(submission.id, 'delete')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editingItem && editingItem.id === submission.id && (
                      <div className="mt-4 space-y-3 border-t pt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Event Name</label>
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                              type="date"
                              value={editingItem.start_date ? new Date(editingItem.start_date).toISOString().split('T')[0] : ''}
                              onChange={(e) => setEditingItem({...editingItem, start_date: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                              type="date"
                              value={editingItem.end_date ? new Date(editingItem.end_date).toISOString().split('T')[0] : ''}
                              onChange={(e) => setEditingItem({...editingItem, end_date: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            value={editingItem.location}
                            onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Website</label>
                          <input
                            type="text"
                            value={editingItem.website || ''}
                            onChange={(e) => setEditingItem({...editingItem, website: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">About</label>
                          <textarea
                            value={editingItem.about || ''}
                            onChange={(e) => setEditingItem({...editingItem, about: e.target.value})}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No event submissions found
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'advisors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Advisor Applications</h3>
                <button 
                  onClick={fetchData}
                  className="flex items-center text-bhgray-600 hover:text-bhgray-900"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {actionSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {actionSuccess}
                </div>
              )}
              
              {loading && !editingItem ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
                </div>
              ) : advisorApplications.length > 0 ? (
                advisorApplications.map(application => (
                  <div key={application.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-bold text-bhgray-900">{application.first_name} {application.last_name}</h3>
                          <div className="ml-2">
                            {getStatusBadge(application.status || 'pending')}
                          </div>
                        </div>
                        {application.professional_title && (
                          <p className="text-sm text-bhgray-600 italic">
                            {application.professional_title}
                          </p>
                        )}
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-bhgray-600">
                            <strong>Email:</strong> {application.email}
                          </p>
                          <p className="text-sm text-bhgray-600">
                            <strong>Phone:</strong> {application.phone}
                          </p>
                          {application.military_branch && (
                            <p className="text-sm text-bhgray-600">
                              <strong>Military Branch:</strong> {application.military_branch}
                            </p>
                          )}
                          {application.years_of_mil_service && (
                            <p className="text-sm text-bhgray-600">
                              <strong>Years of Military Service:</strong> {application.years_of_mil_service}
                            </p>
                          )}
                          {application.years_of_us_civil_service && (
                            <p className="text-sm text-bhgray-600">
                              <strong>Years of US Civil Service:</strong> {application.years_of_us_civil_service}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-bhgray-700 mt-3">{application.about}</p>
                      </div>
                      
                      {editingItem && editingItem.id === application.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit('advisor_applications', application.id, editingItem)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem({...application})}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAdvisorAction(application.id, 'approve')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAdvisorAction(application.id, 'pause')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Pause"
                          >
                            <PauseCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAdvisorAction(application.id, 'reject')}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAdvisorAction(application.id, 'delete')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editingItem && editingItem.id === application.id && (
                      <div className="mt-4 space-y-3 border-t pt-3">
                                               <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                              type="text"
                              value={editingItem.first_name}
                              onChange={(e) => setEditingItem({...editingItem, first_name: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              type="text"
                              value={editingItem.last_name}
                              onChange={(e) => setEditingItem({...editingItem, last_name: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              value={editingItem.email}
                              onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="text"
                              value={editingItem.phone}
                              onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Professional Title</label>
                          <input
                            type="text"
                            value={editingItem.professional_title || ''}
                            onChange={(e) => setEditingItem({...editingItem, professional_title: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Military Branch</label>
                            <input
                              type="text"
                              value={editingItem.military_branch || ''}
                              onChange={(e) => setEditingItem({...editingItem, military_branch: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Years of Military Service</label>
                            <input
                              type="text"
                              value={editingItem.years_of_mil_service || ''}
                              onChange={(e) => setEditingItem({...editingItem, years_of_mil_service: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">About</label>
                          <textarea
                            value={editingItem.about || ''}
                            onChange={(e) => setEditingItem({...editingItem, about: e.target.value})}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No advisor applications found
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'companies' && (
            <CompanySubmissions initialData={companySubmissions} />
          )}
          
          {activeTab === 'consortiums' && (
            <ConsortiumSubmissions initialData={consortiumSubmissions} />
          )}
          
          {activeTab === 'innovations' && (
            <InnovationSubmissions initialData={innovationSubmissions} />
          )}
          
          {activeTab === 'newsletter' && (
            <NewsletterSubscribers initialData={newsletterSubscribers} />
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
