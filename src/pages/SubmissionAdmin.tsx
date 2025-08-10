import LoginGate from '../components/LoginGate'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Submission, SubmissionStatus } from '../types'

export default function SubmissionsAdmin() { return <LoginGate requireAdmin><AdminInner/></LoginGate> }

function AdminInner() {
  const [items, setItems] = useState<Submission[]>([])
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('pending')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    setItems(data ?? []); setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let arr = items
    if (statusFilter !== 'all') arr = arr.filter(i => i.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      arr = arr.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    }
    return arr
  }, [items, statusFilter, search])

  const act = async (submission: Submission, action: 'approve'|'deny'|'pause'|'resume'|'delete') => {
    const { data: session } = await supabase.auth.getSession()
    const uid = session.session?.user.id!
    let newStatus: SubmissionStatus | null = null
    if (action === 'approve') newStatus = 'approved'
    if (action === 'deny') newStatus = 'denied'
    if (action === 'pause') newStatus = 'paused'
    if (action === 'resume') newStatus = 'pending'

    if (action === 'delete') {
      const { error } = await supabase.from('submissions').delete().eq('id', submission.id)
      if (error) return alert(error.message)
      await supabase.from('submission_actions').insert([{ submission_id: submission.id, actor_user_id: uid, action: 'delete', details: { prev: submission.status } }])
      return load()
    }

    if (newStatus) {
      const { data, error } = await supabase.from('submissions').update({ status: newStatus }).eq('id', submission.id).select().single()
      if (error) return alert(error.message)
      await supabase.from('submission_actions').insert([{ submission_id: submission.id, actor_user_id: uid, action, details: { from: submission.status, to: newStatus } }])
      setItems(prev => prev.map(p => p.id === data.id ? data : p))
    }
  }

  const edit = async (submission: Submission) => {
    const title = prompt('New title', submission.title) ?? submission.title
    const description = prompt('New description', submission.description) ?? submission.description
    const { data: session } = await supabase.auth.getSession()
    const uid = session.session?.user.id!
    const { data, error } = await supabase.from('submissions').update({ title, description }).eq('id', submission.id).select().single()
    if (error) return alert(error.message)
    await supabase.from('submission_actions').insert([{ submission_id: submission.id, actor_user_id: uid, action: 'edit', details: { fields: ['title','description'] } }])
    setItems(prev => prev.map(p => p.id === data.id ? data : p))
  }

  return (
    <div className="card">
      <h2>Submissions Admin</h2>
      <div className="row" style={{gap:8, marginBottom:12}}>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="paused">Paused</option>
        </select>
        <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</button>
      </div>

      {filtered.map(s => (
        <div key={s.id} className="card" style={{marginBottom:12}}>
          <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <strong>{s.title}</strong>
              <div style={{opacity:.7, fontSize:12}}>by {s.user_id} • {new Date(s.created_at).toLocaleString()}</div>
            </div>
            <span className={`badge ${s.status}`}>{s.status}</span>
          </div>
          <p style={{whiteSpace:'pre-wrap'}}>{s.description}</p>
          <div className="row">
            {s.status !== 'approved' && <button onClick={()=>act(s,'approve')}>Approve</button>}
            {s.status !== 'denied' && <button onClick={()=>act(s,'deny')}>Deny</button>}
            {s.status !== 'paused' && <button onClick={()=>act(s,'pause')}>Pause</button>}
            {s.status === 'paused' && <button onClick={()=>act(s,'resume')}>Resume</button>}
            <button onClick={()=>edit(s)}>Edit</button>
            <button onClick={()=>act(s,'delete')}>Delete</button>
          </div>
        </div>
      ))}
      {!loading && filtered.length === 0 && <p>No items match.</p>}
    </div>
  )
}
