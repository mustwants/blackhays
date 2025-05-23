import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RefreshCw, Download, Trash2 } from 'lucide-react';

interface NewsletterSubscribersProps {
  initialData?: any[];
}

const NewsletterSubscribers: React.FC<NewsletterSubscribersProps> = ({ initialData = [] }) => {
  const [subscribers, setSubscribers] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all subscribers ordered by creation date
      const { data, error: fetchError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

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
  }, []); // Empty dependency array for initial load only

  const deleteSubscriber = async (id: string) => {
    try {
      setError(null);
      
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

  const exportToCSV = () => {
    if (!subscribers.length) {
      setError('No data to export');
      return;
    }

    const headers = ['First Name', 'Last Name', 'Email', 'Subscribed Date'];
    const csvData = subscribers.map(sub => [
      sub.first_name || '',
      sub.last_name || '',
      sub.email,
      new Date(sub.created_at).toLocaleDateString()
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

  const formatDate = (dateString: string) => {
    try {
      // Handle ISO date strings
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString();
      }
      // Handle Unix timestamps (in seconds)
      if (!isNaN(Number(dateString))) {
        return new Date(Number(dateString) * 1000).toLocaleDateString();
      }
      // Handle other date formats
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                Subscribed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-bhgray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-bhgray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
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
                      {subscriber.first_name} {subscriber.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-bhgray-600">{subscriber.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-bhgray-600">
                      {formatDate(subscriber.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => deleteSubscriber(subscriber.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-bhgray-500">
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