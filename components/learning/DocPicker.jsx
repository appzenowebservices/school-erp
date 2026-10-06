'use client';

import { useEffect, useState } from 'react';
import { BookOpen, CheckSquare, Loader2, Square } from 'lucide-react';
import { getSessionCache } from '../../utils/sessionCache';

/**
 * DocPicker — "Ground in my docs": multi-select over the school's uploaded
 * RAG docs (/api/ai/library). Selected doc_ids ride along in /api/ai/chat
 * bodies; the server fetches chunks itself (clients can't inject context).
 */
export default function DocPicker({ selected = [], onChange, audience = 'staff', compact = false }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    async function load() {
      const c = getSessionCache('dashboardContext') || {};
      const client_id = c.session?.clientId || c.session;
      if (!client_id) return;
      setLoading(true);
      setError('');
      try {
        const r = await fetch(`/api/ai/library?client_id=${encodeURIComponent(client_id)}`, { cache: 'no-store' });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error || `request_${r.status}`);
        if (live) setDocs(Array.isArray(data.docs) ? data.docs : []);
      } catch (e) {
        if (live) setError(String(e?.message || e));
      } finally {
        if (live) setLoading(false);
      }
    }
    load();
    return () => { live = false; };
  }, []);

  function toggle(id) {
    const next = selected.includes(id) ? selected.filter((d) => d !== id) : [...selected, id];
    onChange && onChange(next);
  }

  // Hide staff-only docs from student audiences client-side too
  // (server re-enforces in rag_store + proxy).
  const visible = docs.filter((d) => (audience === 'student' ? d.audience !== 'staff' : true));

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] font-bold text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> Loading my docs…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] font-semibold text-slate-500">
        My docs unavailable ({error}). Continue without grounding.
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <a
        href="/dashboard/my-docs"
        className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-2.5 text-[12px] font-bold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-800"
      >
        <BookOpen className="h-4 w-4" strokeWidth={2.5} />
        No uploaded docs yet — add books/PDFs in My Docs to ground this in your material.
      </a>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-extrabold tracking-[0.14em] text-slate-500">
        GROUND IN MY DOCS {selected.length > 0 ? `• ${selected.length} SELECTED` : ''}
      </p>
      <div className={`mt-1.5 space-y-1.5 overflow-y-auto ${compact ? 'max-h-[140px]' : 'max-h-[180px]'} pr-0.5`}>
        {visible.map((d) => {
          const on = selected.includes(d.doc_id);
          return (
            <button
              key={d.doc_id}
              onClick={() => toggle(d.doc_id)}
              className={`flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all ${on
                ? 'border-blue-600 bg-blue-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
            >
              {on
                ? <CheckSquare className="h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.5} />
                : <Square className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2.5} />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-bold text-slate-800">{d.title}</span>
                <span className="block truncate text-[11px] font-semibold text-slate-500">
                  {[d.board, d.grade && `Class ${d.grade}`, d.subject, `${d.chunks} chunks`].filter(Boolean).join(' • ')}
                </span>
              </span>
              <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide ${d.audience === 'staff' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {String(d.audience || 'both').toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
