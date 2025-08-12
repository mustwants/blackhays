// src/components/AdminPanel.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  CheckCircle2,
  Shield,
  RefreshCw,
  UserPlus,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

// Local types (kept minimal & resilient)
type Profile = {
  id: string;
  email: string | null;
  is_admin: boolean;
  // status may or may not exist in your schema; we handle it defensively
  status?: string | null;
};

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pending, setPending] = useState<Profile[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pendingOnly'>('pendingOnly');

  // -------- helpers --------
  function toastOK(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(null), 3500);
  }
  function toastErr(text: string) {
    setErr(text);
    // keep error visible until next action
  }

  async function assertSession(): Promise<boolean> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      toastErr(`auth.getSession error: ${error.message}`);
      return false;
    }
    if (!data.session) {
      toastErr('Not signed in.');
      return false;
    }
    return true;
  }

  // -------- data load --------
  async function refreshAll() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    if (!(await assertSession())) {
      setLoading(false);
      return;
    }

    // 1) am I admin?
    const { data: adminVal, error: adminErr } = await supabase.rpc('me_is_admin');
    if (adminErr) {
      toastErr(`me_is_admin error: ${adminErr.message}`);
      setLoading(false);
      return;
    }
    setIsAdmin(!!adminVal);

    // 2) me profile (RLS-respecting)
    const { data: meProfile, error: meErr } = await supabase.rpc('me_profile');
    if (meErr) {
      toastErr(`me_profile error: ${meErr.message}`);
      setLoading(false);
      return;
    }
    setMe(meProfile ?? null);

    // 3) pending list (admin only)
    if (adminVal) {
      const { data: pend, error: pendErr } = await supabase.rpc('list_pending_profiles');
      if (pendErr) {
        // not fatal to admin view; just show warning
        toastErr(`list_pending_profiles error: ${pendErr.message}`);
        setPending([]);
      } else {
        setPending(Array.isArray(pend) ? pend : []);
      }
    } else {
      setPending([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    refreshAll();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, _s) => {
      // When auth changes (sign-in/out), re-load
      refreshAll();
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------- actions --------
  async function handleAddAdmin() {
    setErr(null);
    setMsg(null);
    const email = newAdminEmail.trim();
    if (!email) {
      toastErr('Enter an email address.');
      return;
    }
    const { error } = await supabase.rpc('add_admin_by_email', { target_email: email });
    if (error) {
      toastErr(`add_admin_by_email error: ${error.message}`);
      return;
    }
    toastOK(`Admin added/allowlisted: ${email}`);
    setNewAdminEmail('');
    await refreshAll();
  }

  async function handleApprove(email: string | null) {
    setErr(null);
    setMsg(null);
    if (!email) {
      toastErr('Missing email for approval.');
      return;
    }
    const { error } = await supabase.rpc('approve_user_by_email', { target_email: email });
    if (error) {
      toastErr(`approve_user_by_email error: ${error.message}`);
      return;
    }
    toastOK(`Approved: ${email}`);
    await refreshAll();
  }

  // -------- filtered view --------
  const filteredPending = useMemo(() => {
    if (filter === 'pendingOnly') {
      return pending.filter((p) => (p as any).status === 'pending' || (p as any).status == null);
    }
    return pending;
  }, [pending, filter]);

  // -------- renders --------
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Route should be gated by <LoginGate requireAdmin />, but keep a safe fallback.
    return (
      <div className="p-6">
        <div className="border border-amber-300 bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div>
            <div className="font-semibold">Not authorized.</div>
            <div className="text-sm">Admin access required.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-4xl mx-auto p-6">
      {/* Alerts */}
      {err && (
        <div className="border border-red-300 bg-red-50 text-red-800 p-4 rounded-xl">
          <div className="font-semibold mb-1">Error</div>
          <div className="text-sm whitespace-pre-wrap">{err}</div>
        </div>
      )}
      {msg && (
        <div className="border border-emerald-300 bg-emerald-50 text-emerald-800 p-4 rounded-xl">
          <div className="font-semibold mb-1">Success</div>
          <div className="text-sm whitespace-pre-wrap">{msg}</div>
        </div>
      )}

      {/* Me */}
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Profile</h2>
          <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Admin</span>
          </div>
        </div>
        <div className="mt-3 text-sm">
          <div><span className="font-medium">Email:</span> {me?.email ?? '—'}</div>
          <div><span className="font-medium">is_admin:</span> {me?.is_admin ? 'true' : 'false'}</div>
          {'status' in (me || {}) && (
            <div><span className="font-medium">status:</span> {(me as any)?.status ?? '—'}</div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-2 btn-ghost"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      {/* Add Admin */}
      <section className="card p-5">
        <h2 className="text-xl font-semibold mb-3">Add Admin</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="email@domain.com"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="form-input"
          />
          <button onClick={handleAddAdmin} className="btn-primary inline-flex gap-2">
            <UserPlus className="h-4 w-4" />
            Add
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Adds email to the allowlist immediately; if the user already exists, their profile becomes admin now.
        </p>
      </section>

      {/* Pending Users */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Pending Users</h2>
          <div className="flex items-center gap-2">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="pendingOnly">Pending only</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {filteredPending.length === 0 ? (
          <div className="text-sm text-gray-600">No users to show.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-sm border-b">
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">is_admin</th>
                  <th className="py-2 pr-3">status</th>
                  <th className="py-2 pr-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPending.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">{p.email ?? '—'}</td>
                    <td className="py-2 pr-3">{p.is_admin ? 'true' : 'false'}</td>
                    <td className="py-2 pr-3">{(p as any).status ?? '—'}</td>
                    <td className="py-2 pr-3">
                      <button
                        className="inline-flex items-center gap-2 btn-secondary"
                        onClick={() => handleApprove(p.email ?? null)}
                        disabled={!p.email}
                        title="Approve user"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
