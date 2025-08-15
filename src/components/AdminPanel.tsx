// src/components/AdminPanel.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  CheckCircle2, Shield, RefreshCw, UserPlus, Loader2, AlertTriangle,
  XCircle, PauseCircle, PlayCircle, Pencil, Trash2, Search,
} from 'lucide-react';

type Profile = { id: string; email: string | null; is_admin: boolean; status?: string | null; };
type SubmissionStatus = 'pending' | 'approved' | 'denied' | 'paused';
type Submission = {
  id: string; user_id: string; title: string; description: string;
  attachment_url?: string | null; status: SubmissionStatus; created_at: string; updated_at?: string;
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

  const [subsLoading, setSubsLoading] = useState(true);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('pending');
  const [search, setSearch] = useState('');

  const toastOK = (t: string) => { setMsg(t); setTimeout(() => setMsg(null), 3500); };
  const toastErr = (t: string) => setErr(t);

  async function assertSession(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session) { toastErr('Not signed in.'); return null; }
    return data.session.user.id;
  }

  async function refreshHeader() {
    setLoading(true); setErr(null); setMsg(null);
    const uid = await assertSession(); if (!uid) { setLoading(false); return; }

    const { data: adminVal, error: adminErr } = await supabase.rpc('me_is_admin');
    if (adminErr) { toastErr(`me_is_admin error: ${adminErr.message}`); setLoading(false); return; }
    setIsAdmin(!!adminVal);

    const { data: meProfile, error: meErr } = await supabase.rpc('me_profile');
    if (meErr) { toastErr(`me_profile error: ${meErr.message}`); setLoading(false); return; }
    setMe(meProfile ?? null);

    if (adminVal) {
      const { data: pend, error: pendErr } = await supabase.rpc('list_pending_profiles');
      if (pendErr) { toastErr(`list_pending_profiles error: ${pendErr.message}`); setPending([]); }
      else { setPending(Array.isArray(pend) ? pend : []); }
    } else {
      setPending([]);
    }
    setLoading(false);
  }

  async function handleAddAdmin() {
    setErr(null); setMsg(null);
    const email = newAdminEmail.trim();
    if (!email) return toastErr('Enter an email address.');
    const { error } = await supabase.rpc('add_admin_by_email', { target_email: email });
    if (error) return toastErr(`add_admin_by_email error: ${error.message}`);
    setNewAdminEmail(''); toastOK(`Admin added/allowlisted: ${email}`);
    await refreshHeader();
  }

  async function handleApprove(email: string | null) {
    setErr(null); setMsg(null);
    if (!email) return toastErr('Missing email for approval.');
    const { error } = await supabase.rpc('approve_user_by_email', { target_email: email });
    if (error) return toastErr(`approve_user_by_email error: ${error.message}`);
    toastOK(`Approved: ${email}`); await refreshHeader();
  }

  async function loadSubmissions() {
    setSubsLoading(true); setErr(null);
    const uid = await assertSession(); if (!uid) { setSubsLoading(false); return; }
    const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    if (error) { toastErr(`submissions load error: ${error.message}`); setSubs([]); }
    else { setSubs((data ?? []) as Submission[]); }
    setSubsLoading(false);
  }

  async function logAction(uid: string, submission: Submission,
    action: 'approve'|'deny'|'pause'|'resume'|'delete'|'edit', details: any) {
    const { error } = await supabase.from('submission_actions').insert([{
      submission_id: submission.id, actor_user_id: uid, action, details,
    } as any]);
    if (error) toastErr(`submission_actions insert error: ${error.message}`);
  }

  async function act(submission: Submission, action: 'approve'|'deny'|'pause'|'resume'|'delete') {
    const uid = await assertSession(); if (!uid) return;
    let newStatus: SubmissionStatus | null =
      action === 'approve' ? 'approved' :
      action === 'deny' ? 'denied' :
      action === 'pause' ? 'paused' :
      action === 'resume' ? 'pending' : null;

    if (action === 'delete') {
      const { error } = await supabase.from('submissions').delete().eq('id', submission.id);
      if (error) return toastErr(error.message);
      await logAction(uid, submission, 'delete', { prev: submission.status });
      setSubs(prev => prev.filter(s => s.id !== submission.id));
      return toastOK('Submission deleted.');
    }

    if (newStatus) {
      const { data, error } = await supabase.from('submissions')
        .update({ status: newStatus }).eq('id', submission.id).select().single();
      if (error) return toastErr(error.message);
      await logAction(uid, submission, action as any, { from: submission.status, to: newStatus });
      setSubs(prev => prev.map(s => s.id === (data as Submission).id ? (data as Submission) : s));
      toastOK(`Status set to ${newStatus}.`);
    }
  }

  async function edit(submission: Submission) {
    const title = window.prompt('New title', submission.title) ?? submission.title;
    const description = window.prompt('New description', submission.description) ?? submission.description;
    const uid = await assertSession(); if (!uid) return;

    const { data, error } = await supabase.from('submissions')
      .update({ title, description }).eq('id', submission.id).select().single();
    if (error) return toastErr(error.message);

    await logAction(uid, submission, 'edit', { fields: ['title','description'] });
    setSubs(prev => prev.map(s => s.id === (data as Submission).id ? (data as Submission) : s));
    toastOK('Submission updated.');
  }

  const filteredPending = useMemo(() => (
    filter === 'pendingOnly'
      ? pending.filter(p => (p as any).status === 'pending' || (p as any).status == null)
      : pending
  ), [pending, filter]);

  const filteredSubs = useMemo(() => {
    let arr = subs;
    if (statusFilter !== 'all') arr = arr.filter(i => i.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(i =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q));
    }
    return arr;
  }, [subs, statusFilter, search]);

  useEffect(() => {
    refreshHeader();
    loadSubmissions();
    const { data } = supabase.auth.onAuthStateChange(() => { refreshHeader(); loadSubmissions(); });
    const subscription = data.subscription;
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-6"><div className="flex items-center gap-2 text-gray-700">
      <Loader2 className="h-5 w-5 animate-spin" /><span>Loading…</span></div></div>;
  }

  if (!isAdmin) {
    return <div className="p-6">
      <div className="border border-amber-300 bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5" />
        <div><div className="font-semibold">Not authorized.</div><div className="text-sm">Admin access required.</div></div>
      </div></div>;
  }

  return (
    <div className="grid gap-6 max-w-6xl mx-auto p-6">
      {err && <div className="border border-red-300 bg-red-50 text-red-800 p-4 rounded-xl">
        <div className="font-semibold mb-1">Error</div><div className="text-sm whitespace-pre-wrap">{err}</div></div>}
      {msg && <div className="border border-emerald-300 bg-emerald-50 text-emerald-800 p-4 rounded-xl">
        <div className="font-semibold mb-1">Success</div><div className="text-sm whitespace-pre-wrap">{msg}</div></div>}

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Profile</h2>
          <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Shield className="h-4 w-4" /><span className="text-sm">Admin</span>
          </div>
        </div>
        <div className="mt-3 text-sm">
          <div><span className="font-medium">Email:</span> {me?.email ?? '—'}</div>
          <div><span className="font-medium">is_admin:</span> {me?.is_admin ? 'true' : 'false'}</div>
          {'status' in (me || {}) && <div><span className="font-medium">status:</span> {(me as any)?.status ?? '—'}</div>}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={refreshHeader} className="inline-flex items-center gap-2 btn-ghost" title="Refresh profile">
            <RefreshCw className="h-4 w-4" />Refresh</button>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-semibold mb-3">Add Admin</h2>
        <div className="flex gap-2">
          <input type="email" placeholder="email@domain.com" value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)} className="form-input" />
          <button onClick={handleAddAdmin} className="btn-primary inline-flex gap-2">
            <UserPlus className="h-4 w-4" />Add</button>
        </div>
        <p className="text-xs text-gray-600 mt-2">Adds email to the allowlist immediately; if the user already exists, their profile becomes admin now.</p>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Pending Users</h2>
          <div className="flex items-center gap-2">
            <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
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
              <thead><tr className="text-left text-sm border-b">
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">is_admin</th>
                <th className="py-2 pr-3">status</th>
                <th className="py-2 pr-3">Action</th>
              </tr></thead>
              <tbody className="text-sm">
                {filteredPending.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">{p.email ?? '—'}</td>
                    <td className="py-2 pr-3">{p.is_admin ? 'true' : 'false'}</td>
                    <td className="py-2 pr-3">{(p as any).status ?? '—'}</td>
                    <td className="py-2 pr-3">
                      <button className="inline-flex items-center gap-2 btn-secondary"
                        onClick={() => handleApprove(p.email ?? null)} disabled={!p.email}>
                        <CheckCircle2 className="h-4 w-4" />Approve</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Submissions</h2>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="all">All</option><option value="pending">Pending</option>
            <option value="approved">Approved</option><option value="denied">Denied</option>
            <option value="paused">Paused</option>
          </select>
          <div className="relative">
            <input className="form-input pr-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Search className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          <button onClick={loadSubmissions} className="btn-ghost inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />Refresh</button>
        </div>

        {subsLoading ? (
          <div className="flex items-center gap-2 text-gray-700">
            <Loader2 className="h-5 w-5 animate-spin" /><span>Loading submissions…</span>
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="text-sm text-gray-600">No submissions match.</div>
        ) : (
          <div className="grid gap-4">
            {filteredSubs.map((s) => (
              <div key={s.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-xs text-gray-600">by {s.user_id} • {new Date(s.created_at).toLocaleString()}</div>
                  </div>
                  <span className={`status-badge ${
                    s.status === 'pending' ? 'status-pending' :
                    s.status === 'approved' ? 'status-approved' :
                    s.status === 'paused' ? 'status-paused' : 'status-rejected'
                  }`}>{s.status}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{s.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {s.status !== 'approved' && <button className="btn-secondary inline-flex items-center gap-2"
                    onClick={() => act(s, 'approve')}><CheckCircle2 className="h-4 w-4" />Approve</button>}
                  {s.status !== 'denied' && <button className="btn-ghost inline-flex items-center gap-2"
                    onClick={() => act(s, 'deny')}><XCircle className="h-4 w-4" />Deny</button>}
                  {s.status !== 'paused' && <button className="btn-ghost inline-flex items-center gap-2"
                    onClick={() => act(s, 'pause')}><PauseCircle className="h-4 w-4" />Pause</button>}
                  {s.status === 'paused' && <button className="btn-ghost inline-flex items-center gap-2"
                    onClick={() => act(s, 'resume')}><PlayCircle className="h-4 w-4" />Resume</button>}
                  <button className="btn-ghost inline-flex items-center gap-2" onClick={() => edit(s)}>
                    <Pencil className="h-4 w-4" />Edit</button>
                  <button className="btn-ghost inline-flex items-center gap-2" onClick={() => act(s, 'delete')}>
                    <Trash2 className="h-4 w-4" />Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
