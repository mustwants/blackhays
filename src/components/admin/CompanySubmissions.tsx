import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { RefreshCw, Trash2, Edit2, Check, X, PauseCircle } from 'lucide-react';

interface CompanySubmissionsProps {
  initialData?: any[];
}

const CompanySubmissions: React.FC<CompanySubmissionsProps> = ({ initialData = [] }) => {
  const [submissions, setSubmissions] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('company_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSubmissions(data || []);
      if (!data?.length) {
        setError('No company submissions found');
      }
    } catch (err) {
      console.error("Error fetching company submissions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (initialData.length > 0) {
      setSubmissions(initialData);
      setLoading(false);
    } else {
      fetchSubmissions();
    }
  }, [initialData]);

  const isMockId = (id: string) => id.startsWith('mock-');

  const handleAction = async (id: string, action: string) => {
    setLoading(true);
    setError(null);
    setActionSuccess(null);
    
    try {
      if (isMockId(id)) {
        if (action === 'delete') {
          setSubmissions(prev => prev.filter(item => item.id !== id));
          setActionSuccess('Mock submission deleted');
        } else {
          const status = action === 'approve' ? 'approved' : action === 'pause' ? 'paused' : 'rejected';
          setSubmissions(prev =>
            prev.map(item => item.id === id ? { ...item, status } : item)
          );
          setActionSuccess(`Mock status updated to: ${status}`);
        }
      } else if (action === 'delete') {
        const { error } = await supabase
          .from('company_submissions')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setSubmissions(prev => prev.filter(item => item.id !== id));
        setActionSuccess('Successfully deleted submission');
      } else {
        const status = action === 'approve' ? 'approved' :
                      action === 'pause' ? 'paused' : 'rejected';
        
        const { error } = await supabase
          .from('company_submissions')
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
      setError(err.message);
    } finally {
      setLoading(false);
      
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  const handleSaveEdit = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isMockId(id)) {
        setSubmissions(prev =>
          prev.map(item => item.id === id ? editingItem : item)
        );
        setEditingItem(null);
        setActionSuccess('Mock submission updated');
      } else {
        const { error } = await supabase
          .from('company_submissions')
          .update(editingItem)
          .eq('id', id);

        if (error) throw error;

        setSubmissions(prev =>
          prev.map(item => item.id === id ? editingItem : item)
        );

        setEditingItem(null);
        setActionSuccess("Successfully updated submission details");
      }
    } catch (err) {
      console.error('Error saving edit:', err);
      setError(err.message);
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Company Submissions</h3>
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
      
      {loading && !editingItem ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
        </div>
      ) : submissions.length > 0 ? (
        submissions.map(submission => (
          <div key={submission.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="text-lg font-bold text-bhgray-900">{submission.name}</h3>
                  <div className="ml-2">
                    {getStatusBadge(submission.status || 'pending')}
                  </div>
                </div>
                <p className="text-sm text-bhgray-600">{submission.industry}</p>
                <p className="text-sm text-bhgray-600">{submission.location}</p>
                <p className="text-sm text-bhgray-600">
                  <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {submission.website}
                  </a>
                </p>
                <div className="mt-2">
                  <p className="text-sm text-bhgray-700">{submission.description}</p>
                </div>
                <div className="mt-2 text-xs text-bhgray-500">
                  <p>Contact: {submission.contact_name} | {submission.contact_email}</p>
                </div>
              </div>
              
              {editingItem && editingItem.id === submission.id ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(submission.id)}
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
            
            {editingItem && editingItem.id === submission.id && (
              <div className="mt-4 space-y-3 border-t pt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <input
                      type="text"
                      value={editingItem.industry || ''}
                      onChange={(e) => setEditingItem({...editingItem, industry: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                    />
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
                  <label className="block text-sm font-medium text-gray-700">Focus Areas</label>
                  <input
                    type="text"
                    value={editingItem.focus_areas || ''}
                    onChange={(e) => setEditingItem({...editingItem, focus_areas: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <input
                      type="text"
                      value={editingItem.contact_name || ''}
                      onChange={(e) => setEditingItem({...editingItem, contact_name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <input
                      type="email"
                      value={editingItem.contact_email || ''}
                      onChange={(e) => setEditingItem({...editingItem, contact_email: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No company submissions found
        </div>
      )}
    </div>
  );
};

export default CompanySubmissions;
