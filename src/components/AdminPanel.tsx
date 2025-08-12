import React, { useEffect, useState } from 'react';
+ import { supabase } from '../supabaseClient';

type Profile = {
  id: string;
  email: string | null;
  is_admin: boolean;
  status?: string | null; // may not exist in your schema; handled defensively
};

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [me, setMe] = useState<Profile | null>(null);
  const [pending, setPending] = useState<Profile[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function refreshAll() {
    setErr(null);
    setMsg(null);
    setIsLoading(true);

    // 1) ensure we have a session
    const { data: auth } = await supabase.auth.getSession();
    if (!auth?.session) {
      setErr('Not signed in.');
      setIsLoading(false);
      return;
    }

    // 2) am I admin?
    const { data: isAdminData, error: isAdminErr } = await supabase.rpc('me_is_admin');
    if (isAdminErr) {
      setErr(`me_is_admin error: ${isAdminErr.message}`);
      setIsLoading(false);
      return;
    }
    setIsAdmin(!!isAdminData);

    // 3) my profile (for display)
    const { data: meProfile, error: meErr } = await supabase.rpc('me_profile');
    if (meErr) {
      setErr(`me_profile error: ${meErr.message}`);
      setIsLoading(false);
      return;
    }
    setMe(meProfile ?? null);

    // 4) pending list (admin-only RPC; will error if not admin)
    if (isAdminData) {
      const { data: pend, error: pendErr } = await supabase.rpc('list_pending_profiles');
      if (pendErr) {
        setErr(`list_pending_profiles error: ${pendErr.message}`);
      } else {
        setPending(Array.isArray(pend) ? pend : []);
      }
    } else {
      setPending([]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    refreshAll();
    // also react to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_e, _s) => {
      refreshAll();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleAddAdmin() {
    setErr(null); setMsg(null);
    if (!newAdminEmail.trim()) {
      setErr('Enter an email address.');
      return;
    }
    const { error } = await supabase.rpc('add_admin_by_email', { target_email: newAdminEmail.trim() });
    if (error) {
      setErr(`add_admin_by_email error: ${error.message}`);
      return;
    }
    setMsg(`Admin added/allowlisted: ${newAdminEmail.trim()}`);
    setNewAdminEmail('');
    await refreshAll();
  }

  async function handleApprove(email: string) {
    setErr(null); setMsg(null);
    const { error } = await supabase.rpc('approve_user_by_email', { target_email: email });
    if (error) {
      setErr(`approve_user_by_email error: ${error.message}`);
      return;
    }
    setMsg(`Approved: ${email}`);
    await refreshAll();
  }

  if (isLoading) return <div>Loading…</div>;
  if (err) return (
    <div style={{border:'1px solid #f00', padding:12, borderRadius:8}}>
      <b>Error:</b> {err}
    </div>
  );

  return (
    <div style={{display:'grid', gap:16, maxWidth:800}}>
      <div style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
        <h2>My Profile</h2>
        {me ? (
          <ul>
            <li><b>Email:</b> {me.email ?? '—'}</li>
            <li><b>is_admin:</b> {me.is_admin ? 'true' : 'false'}</li>
            {'status' in me && <li><b>status:</b> {(me as any).status ?? '—'}</li>}
          </ul>
        ) : <div>Profile not found.</div>}
      </div>

      <div style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
        <h2>Admin Status</h2>
        <div>You are {isAdmin ? 'an ADMIN ✅' : 'NOT an admin ❌'}</div>
      </div>

      {isAdmin && (
        <>
          <div style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
            <h2>Add Admin</h2>
            <div style={{display:'flex', gap:8}}>
              <input
                type="email"
                placeholder="email@domain.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                style={{flex:1, padding:8}}
              />
              <button onClick={handleAddAdmin}>Add</button>
            </div>
            <p style={{fontSize:12, color:'#666', marginTop:8}}>
              Adds email to allowlist immediately; if the user already exists, flips their profile to admin now.
            </p>
          </div>

          <div style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
            <h2>Pending Users</h2>
            {pending.length === 0 ? <div>No pending users.</div> : (
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left', borderBottom:'1px solid #ccc', padding:6}}>Email</th>
                    <th style={{textAlign:'left', borderBottom:'1px solid #ccc', padding:6}}>is_admin</th>
                    <th style={{textAlign:'left', borderBottom:'1px solid #ccc', padding:6}}>status</th>
                    <th style={{textAlign:'left', borderBottom:'1px solid #ccc', padding:6}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p.id}>
                      <td style={{padding:6}}>{p.email ?? '—'}</td>
                      <td style={{padding:6}}>{p.is_admin ? 'true' : 'false'}</td>
                      <td style={{padding:6}}>
                        {'status' in p ? ((p as any).status ?? '—') : '—'}
                      </td>
                      <td style={{padding:6}}>
                        <button onClick={() => handleApprove(p.email ?? '')} disabled={!p.email}>
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {msg && (
        <div style={{border:'1px solid #0a0', padding:12, borderRadius:8, background:'#f6fff6'}}>
          {msg}
        </div>
      )}
    </div>
  );
}

