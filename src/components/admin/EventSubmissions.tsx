import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { RefreshCw, Trash2, Edit2, Check, X, PauseCircle, Search } from 'lucide-react';

interface EventSubmissionsProps {
  initialData?: any[];
}

const EventSubmissions: React.FC<EventSubmissionsProps> = ({ initialData = [] }) => {
  const [submissions, setSubmissions] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    setError(null);
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
        console.log(`Found ${eventsResult.data.length} events in events table`);
        allEvents = [...eventsResult.data.map(event => ({
          ...event,
          isEvent: true // Flag to identify regular events
        }))];
      }

      // Process submissions
      if (!submissionsResult.error && submissionsResult.data) {
        console.log(`Found ${submissionsResult.data.length} events in event_submissions table`);
        allEvents = [...allEvents, ...submissionsResult.data];
      }

      // Sort by date
      allEvents.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSubmissions(allEvents);
      console.log(`Total events loaded: ${allEvents.length} (${submissionsResult.data?.length || 0} submissions + ${eventsResult.data?.length || 0} events)`);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(`Failed to load events: ${err.message}`);
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

  // Filter submissions based on search and status  
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !searchTerm || 
      submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submitter_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      submission.status === statusFilter ||
      (statusFilter === 'approved' && submission.isEvent); // Show regular events as approved
    
    return matchesSearch && matchesStatus;
  });

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
      
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by name, location, or submitter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-bhred focus:border-bhred"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-bhred focus:border-bhred"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paused">Paused</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
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
          {filteredSubmissions.map((submission) => (
            <React.Fragment key={submission.id}>
              <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                         <div className="flex items-start">
                  {submission.logo_url && (
                    <img
                      src={submission.logo_url}
                      alt={`${submission.name} logo`}
                      className="h-12 w-12 object-contain mr-4"
                    />
                  )}
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
                </div>

                {!submission.isEvent ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem({...submission})}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
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
                ) : (
                  <div className="text-xs text-gray-500 italic">
                    Regular Event
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
                        type="datetime-local"
                        value={editingItem.start_date ? new Date(editingItem.start_date).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setEditingItem({...editingItem, start_date: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="datetime-local"
                        value={editingItem.end_date ? new Date(editingItem.end_date).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setEditingItem({...editingItem, end_date: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={editingItem.location || ''}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitter Email</label>
                    <input
                      type="email"
                      value={editingItem.submitter_email || ''}
                      onChange={(e) => setEditingItem({...editingItem, submitter_email: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                    />
                  </div>
                </div>
              )}
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== 'all' ? 'No events match your search criteria' : 'No events found'}
        </div>
      )}
    </div>
  );
};

export default EventSubmissions;
