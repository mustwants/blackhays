import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, Calendar, Building, Rocket, Brain, Mail, ArrowUp, ArrowDown } from 'lucide-react';

interface CategoryStats {
  total: number;
  approved: number;
  pending: number;
  paused: number;
  rejected: number;
}

interface DashboardStats {
  advisors: CategoryStats;
  events: CategoryStats;
  companies: CategoryStats;
  consortiums: CategoryStats;
  innovations: CategoryStats;
  newsletterCount: number;
}

interface AdminDashboardProps {
  onCategoryClick?: (category: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCategoryClick }) => {
  const [stats, setStats] = useState<DashboardStats>({
    advisors: { total: 0, approved: 0, pending: 0, paused: 0, rejected: 0 },
    events: { total: 0, approved: 0, pending: 0, paused: 0, rejected: 0 },
    companies: { total: 0, approved: 0, pending: 0, paused: 0, rejected: 0 },
    consortiums: { total: 0, approved: 0, pending: 0, paused: 0, rejected: 0 },
    innovations: { total: 0, approved: 0, pending: 0, paused: 0, rejected: 0 },
    newsletterCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get date range
      const now = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Fetch all stats in parallel
      const [
        advisorStats,
        eventStats,
        companyStats,
        consortiumStats,
        innovationStats,
        newsletterStats
      ] = await Promise.all([
        fetchCategoryStats('advisor_applications', startDate),
        fetchCategoryStats('event_submissions', startDate),
        fetchCategoryStats('company_submissions', startDate),
        fetchCategoryStats('consortium_submissions', startDate),
        fetchCategoryStats('innovation_submissions', startDate),
        fetchNewsletterStats(startDate)
      ]);

      setStats({
        advisors: advisorStats,
        events: eventStats,
        companies: companyStats,
        consortiums: consortiumStats,
        innovations: innovationStats,
        newsletterCount: newsletterStats
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryStats = async (table: string, startDate: Date): Promise<CategoryStats> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const stats = {
        total: data ? data.length : 0,
        approved: data ? data.filter(item => item.status === 'approved').length : 0,
        pending: data ? data.filter(item => item.status === 'pending').length : 0,
        paused: data ? data.filter(item => item.status === 'paused').length : 0,
        rejected: data ? data.filter(item => item.status === 'rejected').length : 0
      };

      return stats;
    } catch (err) {
      console.error(`Error fetching ${table} stats:`, err);
      return { total: 0, approved: 0, pending: 0, paused: 0, rejected: 0 };
    }
  };

  const fetchNewsletterStats = async (startDate: Date): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ? data.length : 0;
    } catch (err) {
      console.error('Error fetching newsletter stats:', err);
      return 0;
    }
  };

  const StatCard = ({ 
    title, 
    stats, 
    icon: Icon,
    color,
    onClick
  }: { 
    title: string;
    stats: CategoryStats;
    icon: React.ElementType;
    color: string;
    onClick?: () => void;
  }) => {
    const cardClasses = `bg-white rounded-lg shadow-md p-6 border-l-4 ${color} ${
      onClick ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all' : ''
    }`;
    
    return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <Icon className="w-6 h-6 text-gray-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Paused</p>
          <p className="text-2xl font-bold text-blue-600">{stats.paused}</p>
        </div>
      </div>
    </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhred"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-bhred focus:border-bhred"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Advisors"
          stats={stats.advisors}
          icon={Users}
          color="border-blue-500"
          onClick={() => onCategoryClick?.('advisors')}
        />
        <StatCard
          title="Events"
          stats={stats.events}
          icon={Calendar}
          color="border-green-500"
          onClick={() => onCategoryClick?.('events')}
        />
        <StatCard
          title="Companies"
          stats={stats.companies}
          icon={Building}
          color="border-purple-500"
          onClick={() => onCategoryClick?.('companies')}
        />
        <StatCard
          title="Consortiums"
          stats={stats.consortiums}
          icon={Rocket}
          color="border-red-500"
          onClick={() => onCategoryClick?.('consortiums')}
        />
        <StatCard
          title="Innovations"
          stats={stats.innovations}
          icon={Brain}
          color="border-amber-500"
          onClick={() => onCategoryClick?.('innovations')}
        />
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all"
             onClick={() => onCategoryClick?.('newsletter')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Newsletter Subscribers</h3>
            <Mail className="w-6 h-6 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Subscribers</p>
            <p className="text-3xl font-bold text-gray-900">{stats.newsletterCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;