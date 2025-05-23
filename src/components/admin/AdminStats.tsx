import React from 'react';
import { Users, Calendar, Building, Rocket, Brain, Mail } from 'lucide-react';

interface CategoryStats {
  total: number;
  approved: number;
  pending: number;
  paused: number;
  rejected: number;
}

interface AdminStatsProps {
  advisors: CategoryStats;
  events: CategoryStats;
  companies: CategoryStats;
  consortiums: CategoryStats;
  innovations: CategoryStats;
  newsletterCount: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  advisors,
  events,
  companies,
  consortiums,
  innovations,
  newsletterCount
}) => {
  const categories = [
    { name: 'Advisors', stats: advisors, icon: Users, color: 'blue' },
    { name: 'Events', stats: events, icon: Calendar, color: 'green' },
    { name: 'Companies', stats: companies, icon: Building, color: 'purple' },
    { name: 'Consortiums', stats: consortiums, icon: Rocket, color: 'red' },
    { name: 'Innovations', stats: innovations, icon: Brain, color: 'amber' }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(({ name, stats, icon: Icon, color }) => (
          <div key={name} className={`bg-${color}-50 rounded-lg p-4`}>
            <div className="flex items-center mb-2">
              <Icon className={`w-5 h-5 text-${color}-600 mr-2`} />
              <h3 className="font-medium">{name}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Total</p>
                <p className="font-semibold">{stats.total}</p>
              </div>
              <div>
                <p className="text-green-600">Approved</p>
                <p className="font-semibold">{stats.approved}</p>
              </div>
              <div>
                <p className="text-yellow-600">Pending</p>
                <p className="font-semibold">{stats.pending}</p>
              </div>
              <div>
                <p className="text-blue-600">Paused</p>
                <p className="font-semibold">{stats.paused}</p>
              </div>
              <div>
                <p className="text-red-600">Rejected</p>
                <p className="font-semibold">{stats.rejected}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Mail className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="font-medium">Newsletter Subscribers</h3>
          </div>
          <div className="text-sm">
            <p className="text-gray-600">Total Subscribers</p>
            <p className="font-semibold text-xl">{newsletterCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;