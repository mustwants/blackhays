import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { RefreshCw, Trash2, Edit2, Check, X, PauseCircle } from 'lucide-react';

interface EventSubmissionsProps {
  initialData?: any[];
}

const EventSubmissions: React.FC<EventSubmissionsProps> = ({ initialData = [] }) => {
  const [submissions, setSubmissions] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    if (initialData.length > 0) {
      setSubmissions(initialData);
      setLoading(false);
    } else {
      fetchSubmissions();
    }
  }, [initialData]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Get both events and event_submissions
      const [eventsResult, submissionsResult] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('event_submissions')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      let allEvents = [];

      // Process events
      if (!eventsResult.error && eventsResult.data) {
        allEvents = [...eventsResult.data.map(event => ({
          ...event,
          isEvent: true // Flag to identify regular events
        }))];
      }

      // Process submissions
      if (!submissionsResult.error && submissionsResult.data) {
        allEvents = [...allEvents, ...submissionsResult.data];
      }

      // Sort by date
      allEvents.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSubmissions(allEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('event_submissions')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setSubmissions(prev => prev.filter(item => item.id !== id));
        setActionSuccess('Successfully deleted submission');
      } else {
        const status = action === 'approve' ? 'approved' : 
                      action === 'pause' ? 'paused' : 'rejected';
        
        const { error } = await supabase
          .from('event_submissions')
          .update({ status })
          .eq('id', id);
          
        if (error) throw error;
        
        setSubmissions(prev => 
          prev.map(item => item.id === id ? { ...item, status } : item)
        );
        
        setActionSuccess(`Successfully updated status to: ${status}`);
      }
    } catch (err) {
      console.error('Error handling action:', err);
      setError('Failed to perform action. Please try again.');
    } finally {
      setLoading(false);
      
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      paused: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Event Submissions</h3>
        <button 
          onClick={fetchSubmissions}
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

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
        </div>
      ) : submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900 mr-3">
                      {submission.name}
                    </h3>
                    {!submission.isEvent && getStatusBadge(submission.status || 'pending')}
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Date:</strong> {new Date(submission.start_date).toLocaleDateString()} - 
                      {new Date(submission.end_date).toLocaleDateString()}
                    </p>
                    <p><strong>Location:</strong> {submission.location}</p>
                    {submission.website && (
                      <p>
                        <strong>Website:</strong>{' '}
                        <a 
                          href={submission.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {submission.website}
                        </a>
                      </p>
                    )}
                    {submission.about && (
                      <p><strong>About:</strong> {submission.about}</p>
                    )}
                    {submission.submitter_email && (
                      <p><strong>Submitter:</strong> {submission.submitter_email}</p>
                    )}
                  </div>
                </div>

                {!submission.isEvent && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAction(submission.id, 'approve')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAction(submission.id, 'pause')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Pause"
                    >
                      <PauseCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAction(submission.id, 'reject')}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                      title="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAction(submission.id, 'delete')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No events found
        </div>
      )}
    </div>
  );
};

export default EventSubmissions;