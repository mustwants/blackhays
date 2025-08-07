import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RefreshCw, Download, Trash2, Upload, Edit2, Check, PauseCircle, X } from 'lucide-react';

interface Subscriber {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status?: string;
  created_at?: string;
}

interface NewsletterSubscribersProps {
  initialData?: Subscriber[];
}

const NewsletterSubscribers: React.FC<NewsletterSubscribersProps> = ({ initialData = [] }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Set up admin session for authenticated requests
      const authSession = localStorage.getItem('auth_session');
      if (authSession) {
        try {
          const session = JSON.parse(authSession);
          if (session?.session) {
            await supabase.auth.setSession(session.session);
          }
        } catch (e) {
          console.warn('Failed to set admin session:', e);
        }
      }
      
      // Fetch all subscribers ordered by creation date
      const { data, error: fetchError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Newsletter fetch error:', fetchError);
        if (fetchError.message.includes('Not authenticated')) {
          setError('Authentication required to view subscribers');
        } else {
          setError('Failed to load subscribers. Please try again.');
        }
        setSubscribers([]);
        return;
      }

      console.log('Fetched newsletter subscribers:', data?.length || 0);
      // Update state with fetched data
      setSubscribers(data || []);
      
      // Only set error if no data was found
      if (!data || data.length === 0) {
        setError('No subscribers found');
      }

    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError('Failed to load subscribers. Please try again.');
      // Keep any existing subscribers in state
    } finally {
      setLoading(false);
    }
  };

    // Initial load
    useEffect(() => {
      if (initialData.length > 0) {
        setSubscribers(initialData);
        setLoading(false);
      } else {
        fetchSubscribers();
      }
    }, [initialData]);

  const deleteSubscriber = async (id: string) => {
    try {
      setError(null);
      
      // Set up admin session for authenticated requests
      const authSession = localStorage.getItem('auth_session');
      if (authSession) {
        try {
          const session = JSON.parse(authSession);
          if (session?.session) {
            await supabase.auth.setSession(session.session);
          }
        } catch (e) {
          console.warn('Failed to set admin session:', e);
        }
      }
      
      const { error: deleteError } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state after successful deletion
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      
      // If this was the last subscriber, show the empty message
      if (subscribers.length === 1) {
        setError('No subscribers found');
      }
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      setError('Failed to delete subscriber');
    }
  };

    const updateStatus = async (id: string, status: 'approved' | 'paused' | 'denied') => {
    try {
      setError(null);
      
      // Set up admin session for authenticated requests
      const authSession = localStorage.getItem('auth_session');
      if (authSession) {
        try {
          const session = JSON.parse(authSession);
          if (session?.session) {
            await supabase.auth.setSession(session.session);
          }
        } catch (e) {
          console.warn('Failed to set admin session:', e);
        }
      }
      
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({ status })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      setSubscribers(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, status } : sub))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const editSubscriber = async (subscriber: Subscriber) => {
    const first_name =
      prompt('First Name', subscriber.first_name) ?? subscriber.first_name;
    const last_name =
      prompt('Last Name', subscriber.last_name) ?? subscriber.last_name;
    const email = prompt('Email', subscriber.email) ?? subscriber.email;

    try {
      // Set up admin session for authenticated requests
      const authSession = localStorage.getItem('auth_session');
      if (authSession) {
        try {
          const session = JSON.parse(authSession);
          if (session?.session) {
            await supabase.auth.setSession(session.session);
          }
        } catch (e) {
          console.warn('Failed to set admin session:', e);
        }
      }
      
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim().toLowerCase()
        })
        .eq('id', subscriber.id);

      if (updateError) {
        throw updateError;
      }

      setSubscribers(prev =>
        prev.map(sub =>
          sub.id === subscriber.id
            ? { ...sub, first_name, last_name, email }
            : sub
        )
      );
    } catch (err) {
      console.error('Error editing subscriber:', err);
      setError('Failed to edit subscriber');
    }
  };

  const exportToCSV = () => {
    if (!subscribers.length) {
      setError('No data to export');
      return;
    }

    const headers = ['First Name', 'Last Name', 'Email', 'Status'];
    const csvData = subscribers.map(sub => [
      sub.first_name || '',
      sub.last_name || '',
      sub.email,
      sub.status || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Handle ISO date strings
      setLoading(true);
      
      // Set up admin session for authenticated requests
      const authSession = localStorage.getItem('auth_session');
      if (authSession) {
        try {
          const session = JSON.parse(authSession);
          if (session?.session) {
            await supabase.auth.setSession(session.session);
          }
        } catch (e) {
          console.warn('Failed to set admin session:', e);
        }
      }
      
      const text = await file.text();
      const lines = text.trim().split(/\r?\n/).slice(1); // remove header
      const toInsert = lines
        .map(line => line.split(',').map(cell => cell.trim()))
        .filter(cols => cols.length >= 3 && cols[2])
        .map(cols => ({
          first_name: cols[0],
          last_name: cols[1],
          email: cols[2].toLowerCase(),
          status: (cols[3] && ['approved','paused','denied','pending'].includes(cols[3].toLowerCase())) ? cols[3].toLowerCase() : 'pending'
        }));

      if (toInsert.length > 0) {
        const { error: uploadError } = await supabase
          .from('newsletter_subscribers')
          .upsert(toInsert, { onConflict: 'email' });

        if (uploadError) {
          throw uploadError;
        }
        fetchSubscribers();
      }
    } catch (err) {
      console.error('Error uploading CSV:', err);
      setError('Failed to upload CSV');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setLoading(false);
    }
  };

    const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      paused: 'bg-blue-100 text-blue-800',
      denied: 'bg-red-100 text-red-800'
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-bhgray-900">Newsletter Subscribers</h3>
        <div className="flex space-x-4">
          <button
            onClick={fetchSubscribers}
            className="flex items-center text-bhgray-600 hover:text-bhgray-900"
          >
            <RefreshCw className="w-5 h-5 mr-1" />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center text-bhgray-600 hover:text-bhgray-900"
            disabled={!subscribers.length}
          >
            <Download className="w-5 h-5 mr-1" />
            Export CSV
          </button>
                    <div>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleCSVUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center text-bhgray-600 hover:text-bhgray-900"
            >
              <Upload className="w-5 h-5 mr-1" />
              Upload CSV
            </button>
          </div>
          
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-bhgray-200">
          <thead className="bg-bhgray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-bhgray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
                  </div>
                </td>
              </tr>
            ) : subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-bhgray-900">
                      {subscriber.first_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-bhgray-900">
                      {subscriber.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-bhgray-600">{subscriber.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(subscriber.status || 'pending')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => updateStatus(subscriber.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateStatus(subscriber.id, 'paused')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Pause"
                      >
                        <PauseCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateStatus(subscriber.id, 'denied')}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Deny"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => editSubscriber(subscriber)}
                        className="text-bhgray-600 hover:text-bhgray-900"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-bhgray-500">
                  No subscribers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsletterSubscribers;
