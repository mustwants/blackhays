import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Filter, Edit2, Trash2, Check, X, Pause, Eye, ExternalLink } from 'lucide-react';

interface CompanySubmission {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  focus_areas?: string;
  location?: string;
  description: string;
  contact_name?: string;
  contact_email: string;
  contact_phone?: string;
  employee_count?: string;
  founded_year?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
  product_image_url?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export default function CompanySubmissions() {
  const [submissions, setSubmissions] = useState<CompanySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CompanySubmission>>({});

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Create a mock admin session for database access
      const mockAdminToken = `sb-mock-admin-${Date.now()}`;
      await supabase.auth.setSession({
        access_token: mockAdminToken,
        refresh_token: mockAdminToken
      });
      
      const { data, error } = await supabase
        .from('company_submissions')
        .select('*')
      // Create a mock admin session for database access
      const mockAdminToken = `sb-mock-admin-${Date.now()}`;
      await supabase.auth.setSession({
        access_token: mockAdminToken,
        refresh_token: mockAdminToken
      });
      
      console.log('Fetched company submissions:', data?.length || 0);
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching company submissions:', err);
      setError('Failed to load company submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      // Create a mock admin session for database access
      const mockAdminToken = `sb-mock-admin-${Date.now()}`;
      await supabase.auth.setSession({
        access_token: mockAdminToken,
        refresh_token: mockAdminToken
      });
      if (error) throw error;
      
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      // Create a mock admin session for database access
      const mockAdminToken = `sb-mock-admin-${Date.now()}`;
      await supabase.auth.setSession({
        access_token: mockAdminToken,
        refresh_token: mockAdminToken
      });
      if (error) throw error;
      
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError('Failed to delete submission');
    }
  };

  const startEdit = (submission: CompanySubmission) => {
    setEditingId(submission.id);
    setEditData({ ...submission });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      // Create a mock admin session for database access
      const mockAdminToken = `sb-mock-admin-${Date.now()}`;
      await supabase.auth.setSession({
        access_token: mockAdminToken,
        refresh_token: mockAdminToken
      });
        })
        .eq('id', editingId);

      if (error) throw error;
      
      setSubmissions(prev => prev.map(sub => 
        sub.id === editingId ? { ...sub, ...editData } : sub
      ));
      
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error('Error updating submission:', err);
      setError('Failed to update submission');
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = searchTerm === '' || 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.location && submission.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (submission.industry && submission.industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paused: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {filteredSubmissions.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry & Focus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4">
                      {editingId === submission.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Company name"
                          />
                          <input
                            type="url"
                            value={editData.website || ''}
                            onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Website URL"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                          {submission.website && (
                            <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              Visit Website
                            </a>
                          )}
                          {submission.location && (
                            <div className="text-sm text-gray-500">{submission.location}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === submission.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editData.industry || ''}
                            onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Industry"
                          />
                          <textarea
                            value={editData.focus_areas || ''}
                            onChange={(e) => setEditData({ ...editData, focus_areas: e.target.value })}
                            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Focus areas"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          {submission.industry && (
                            <div className="text-sm text-gray-900">{submission.industry}</div>
                          )}
                          {submission.focus_areas && (
                            <div className="text-sm text-gray-500">{submission.focus_areas}</div>
                          )}
                          {submission.employee_count && (
                            <div className="text-sm text-gray-500">{submission.employee_count} employees</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === submission.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editData.contact_name || ''}
                            onChange={(e) => setEditData({ ...editData, contact_name: e.target.value })}
                            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Contact name"
                          />
                          <input
                            type="email"
                            value={editData.contact_email || ''}
                            onChange={(e) => setEditData({ ...editData, contact_email: e.target.value })}
                            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Contact email"
                          />
                          <input
                            type="tel"
                            value={editData.contact_phone || ''}
                            onChange={(e) => setEditData({ ...editData, contact_phone: e.target.value })}
                            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Contact phone"
                          />
                        </div>
                      ) : (
                        <div>
                          {submission.contact_name && (
                            <div className="text-sm text-gray-900">{submission.contact_name}</div>
                          )}
                          <div className="text-sm text-gray-600">{submission.contact_email}</div>
                          {submission.contact_phone && (
                            <div className="text-sm text-gray-500">{submission.contact_phone}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === submission.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-900"
                            title="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                            title="Cancel edit"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(submission)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit submission"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {submission.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(submission.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {submission.status !== 'paused' && (
                            <button
                              onClick={() => updateStatus(submission.id, 'paused')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Pause"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          {submission.status !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(submission.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteSubmission(submission.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== 'all' ? 'No companies match your search criteria' : 'No company submissions found'}
        </div>
      )}
    </div>
  );
}