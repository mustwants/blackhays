// src/components/admin/AdvisorApplications.tsx
import React, { useEffect, useState } from 'react';
import advisorService, { Advisor, AdvisorStatus } from '../../services/advisors';

export default function AdvisorApplications() {
  const [items, setItems] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AdvisorStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data =
        statusFilter === 'all'
          ? await advisorService.getAll({ search })
          : await advisorService.getAll({ status: statusFilter, search });

      setItems(data);
    } catch (e: any) {
      console.error('Failed to load advisors', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const onApprove = async (id: string) => {
    await advisorService.updateStatus(id, 'approved');
    await load();
  };

  const onPause = async (id: string) => {
    await advisorService.updateStatus(id, 'paused');
    await load();
  };

  const onReject = async (id: string) => {
    await advisorService.updateStatus(id, 'rejected');
    await load();
  };

  const onDelete = async (id: string) => {
    await advisorService.remove(id);
    await load();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paused">Paused</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Search name / email / city / state"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void load()}
        />

        <button className="btn btn-primary" onClick={() => void load()}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {a.headshot_url ? (
                      <img
                        src={a.headshot_url}
                        alt={a.name || 'Advisor headshot'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : null}
                    <div className="font-medium">{a.name}</div>
                    {a.professional_title ? (
                      <span className="text-gray-500">— {a.professional_title}</span>
                    ) : null}
                  </div>
                </td>
                <td className="p-2">{a.email}</td>
                <td className="p-2">
                  {[a.city, a.state, a.zip_code].filter(Boolean).join(', ')}
                </td>
                <td className="p-2 capitalize">{a.status}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={() => onApprove(a.id)}>
                      Approve
                    </button>
                    <button className="px-2 py-1 rounded bg-yellow-600 text-white" onClick={() => onPause(a.id)}>
                      Pause
                    </button>
                    <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => onReject(a.id)}>
                      Reject
                    </button>
                    <button className="px-2 py-1 rounded border" onClick={() => onDelete(a.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={5}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
