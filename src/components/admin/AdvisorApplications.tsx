import React, { useState, useEffect } from 'react';
import { useAdvisors } from '../../hooks/useAdvisors';
import { supabase } from '../../lib/supabaseClient';
import { Search, Filter, Edit2, Trash2, Check, X, Pause, Eye, ExternalLink, MapPin, Phone, Mail } from 'lucide-react';

const AdvisorApplications = () => {
  const { advisors, isLoading, error, approveAdvisor, rejectAdvisor, deleteAdvisor, refreshAdvisors } = useAdvisors();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directFetchData, setDirectFetchData] = useState([]);
  const [directLoading, setDirectLoading] = useState(true);

  useEffect(() => {
    fetchDirectly();
  }, []);

  const fetchDirectly = async () => {
    try {
      setDirectLoading(true);
      
      const { data, error } = await supabase
        .from('advisor_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Direct fetch error:', error);
      } else {
        console.log('Direct fetch success:', data?.length || 0, 'advisors');
        setDirectFetchData(data || []);
      }
    } catch (err) {
      console.error('Error in direct fetch:', err);
    } finally {
      setDirectLoading(false);
    }
  };

  useEffect(() => {
    refreshAdvisors();
  }, []);

  // Use direct fetch data if available, otherwise use hook data
  const dataSource = directFetchData.length > 0 ? directFetchData : advisors;
  
  const filteredAdvisors = dataSource.filter(advisor => {
    const matchesSearch = searchTerm === '' || 
      advisor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.about?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || advisor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDirectApprove = async (id: string) => {
    try {
      
      const { error } = await supabase
        .from('advisor_applications')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
      await fetchDirectly();
    } catch (err) {
      console.error('Error approving advisor:', err);
    }
  };

  const handleDirectReject = async (id: string) => {
    try {
     
      const { error } = await supabase
        .from('advisor_applications')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      await fetchDirectly();
    } catch (err) {
      console.error('Error rejecting advisor:', err);
    }
  };

  const handleDirectDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advisor?')) return;
    
    try {
      
      const { error } = await supabase
        .from('advisor_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchDirectly();
    } catch (err) {
      console.error('Error deleting advisor:', err);
    }
  };

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

  if (isLoading || directLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
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
            placeholder="Search advisors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bhred focus:border-transparent w-full"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bhred focus:border-transparent appearance-none bg-white"
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
          {error.message}
        </div>
      )}

      {filteredAdvisors.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advisor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Background</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdvisors.map((advisor) => (
                  <tr key={advisor.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {advisor.headshot_url && (
                          <img
                            src={advisor.headshot_url}
                            alt={`${advisor.first_name} ${advisor.last_name}`}
                            className="h-10 w-10 rounded-full mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {advisor.name}
                          </div>
                          {advisor.professional_title && (
                            <div className="text-sm text-gray-500">{advisor.professional_title}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {advisor.military_branch && (
                          <div className="text-sm text-gray-900 capitalize">{advisor.military_branch}</div>
                        )}
                        {advisor.years_of_service && (
                          <div className="text-sm text-gray-500">{advisor.years_of_service} years service</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {advisor.email}
                        </div>
                        {advisor.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {advisor.phone}
                          </div>
                        )}
                        {(advisor.city || advisor.state) && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {advisor.city ? `${advisor.city}, ` : ''}{advisor.state}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(advisor.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {advisor.status !== 'approved' && (
                          <button
                            onClick={() => handleDirectApprove(advisor.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {advisor.status !== 'rejected' && (
                          <button
                            onClick={() => handleDirectReject(advisor.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDirectDelete(advisor.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== 'all' ? 'No advisors match your search criteria' : 'No advisor applications found'}
        </div>
      )}
    </div>
  );
};

export default AdvisorApplications;
