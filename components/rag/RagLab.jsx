'use client';

/**
 * RAG Lab — standalone, portable test surface for the tenant vector store.
 * No ERP imports: tenant id + /api/rag/* contract only, so this folder lifts
 * into other projects (e.g. coaching centres) with the backend script.
 */

import { useEffect, useState } from 'react';
import {
  Activity, BookOpen, Search, FlaskConical, ClipboardCheck,
  Upload, Trash2, Loader2, AlertCircle, CheckCircle2, FileText, Sparkles,
} from 'lucide-react';
import { getSessionCache } from '../../utils/sessionCache';

const MAX_TEXT = 200_000;
const MAX_PDF_PAGES = 60;
const TABS = [
  { key: 'status', label: 'Status', icon: Activity },
  { key: 'library', label: 'Library', icon: BookOpen },
  { key: 'search', label: 'Search test', icon: Search },
  { key: 'ground', label: 'Grounding test', icon: FlaskConical },
  { key: 'eval', label: 'Eval gate', icon: ClipboardCheck },
];

function useTenant() {
  const ctx = typeof window === 'undefined' ? {} : (getSessionCache('dashboardContext') || {});
  return ctx.session?.clientId || ctx.session || '';
}

const label = "block text-[11px] font-extrabold tracking-[0.14em] text-slate-500";
const inp = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const sel = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const btnPrimary = "flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-extrabold tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50";

function Err({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
      <p className="text-[12px] font-semibold leading-snug text-red-700">{msg}</p>
    </div>
  );
}

async function api(path, opts) {
  const r = await fetch(path, opts);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || `request_${r.status}`);
  return data;
}

/* ---------------- Status ---------------- */
function StatusTab({ tenant }) {
  const [st, setSt] = useState(null);
  const [mem, setMem] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    api(`/api/rag/status?client_id=${encodeURIComponent(tenant)}`)
      .then(setSt).catch((e) => setErr(String(e?.message || e)));
    api('/api/memory/status').then(setMem).catch(() => setMem({ status: 'disabled', reason: 'unreachable' }));
  }, [tenant]);
  if (err) return <Err msg={err} />;
  if (!st) return <div className="h-24 animate-pulse rounded-xl bg-slate-100" />;
  const pg = String(st.backend || '').startsWith('postgres');
  const memOn = mem?.status === 'active';
  return (
    <div className="grid gap-2.5 sm:grid-cols-5">
      {[
        { k: 'BACKEND', v: pg ? 'Postgres (central)' : st.backend, hot: pg },
        { k: 'MEMORY LAYER', v: mem ? (memOn ? 'Active' : `Off (${mem.reason || 'down'})`) : '…', hot: memOn },
        { k: 'TOP-K', v: String(st.topK ?? '—') },
        { k: 'DOCS', v: st.docs ?? '—' },
        { k: 'CHUNKS', v: st.chunks ?? '—' },
      ].map((s) => (
        <div key={s.k} className={`rounded-xl border px-3 py-3 ${s.hot ? 'border-blue-600 bg-blue-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]' : 'border-slate-200 bg-white'}`}>
          <p className={`text-[11px] font-extrabold tracking-[0.18em] ${s.hot ? 'text-white/70' : 'text-slate-400'}`}>{s.k}</p>
          <p className={`mt-1 truncate text-[14px] font-extrabold ${s.hot ? 'text-white' : 'text-slate-900'}`} title={String(s.v)}>{s.v}</p>
        </div>
      ))}
      {!pg && (
        <p className="sm:col-span-5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] font-semibold text-amber-800">
          SQLite fallback active — set server-only `vector_DB` (Supabase Postgres) for the centralised cloud store.
        </p>
      )}
    </div>
  );
}

/* ---------------- Library ---------------- */
function LibraryTab({ tenant, docs, refresh, busy, setBusy }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [grade, setGrade] = useState('7');
  const [board, setBoard] = useState('CBSE');
  const [audience, setAudience] = useState('both');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [datasets, setDatasets] = useState([]);
  const [seeding, setSeeding] = useState('');
  const [seedMsg, setSeedMsg] = useState('');

  useEffect(() => {
    api('/api/rag/seed')
      .then((d) => setDatasets(Array.isArray(d.datasets) ? d.datasets : []))
      .catch(() => setDatasets([]));
  }, []);

  async function seedDataset(ds) {
    setErr(''); setOk(''); setSeedMsg('');
    setSeeding(ds.id);
    try {
      const data = await api('/api/rag/seed', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: tenant, dataset: ds.id }),
      });
      setSeedMsg(`Loaded "${ds.label}": ${data.ingested} indexed, ${data.skipped} already present${data.failed ? `, ${data.failed} failed` : ''}.`);
      refresh();
    } catch (e) { setErr(String(e?.message || e)); }
    finally { setSeeding(''); }
  }

  async function handleFile(file) {
    setErr(''); setOk('');
    if (!file) return;
    setFileName(file.name);
    try {
      if (/\.pdf$/i.test(file.name)) {
        const buf = await file.arrayBuffer();
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        const pdf = await pdfjs.getDocument({ data: buf, isEvalSupported: false }).promise;
        const pages = Math.min(pdf.numPages, MAX_PDF_PAGES);
        const parts = [];
        for (let p = 1; p <= pages; p++) {
          const page = await pdf.getPage(p);
          const tc = await page.getTextContent();
          parts.push(tc.items.map((it) => it.str).join(' '));
          if (parts.join(' ').length > MAX_TEXT) break;
        }
        const extracted = parts.join('\n\n').replace(/[ \t]+/g, ' ').trim();
        if (!extracted) throw new Error('No text layer — scanned PDF. Paste the text instead.');
        setText(extracted.slice(0, MAX_TEXT));
        if (!title) setTitle(file.name.replace(/\.pdf$/i, ''));
      } else if (/\.(txt|md|markdown|csv)$/i.test(file.name)) {
        setText((await file.text()).slice(0, MAX_TEXT));
        if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
      } else {
        throw new Error('Use .pdf, .txt, .md — or paste text.');
      }
    } catch (e) { setErr(String(e?.message || e)); }
  }

  async function upload() {
    setErr(''); setOk('');
    if (!title.trim() || !text.trim()) { setErr('Title + text required.'); return; }
    setBusy(true);
    try {
      const data = await api('/api/rag/library', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: tenant, title: title.trim(), text, subject, grade, board, audience }),
      });
      setOk(`Indexed — ${data.chunks} chunks, dim ${data.dim}.`);
      setTitle(''); setText(''); setFileName('');
      refresh();
    } catch (e) { setErr(String(e?.message || e)); }
    finally { setBusy(false); }
  }

  async function remove(doc_id) {
    setErr(''); setOk('');
    try {
      await api('/api/rag/library', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: tenant, doc_id }),
      });
      setOk('Deleted.');
      refresh();
    } catch (e) { setErr(String(e?.message || e)); }
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div>
          <label className={label}>File (parsed in browser)</label>
          <label className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-2.5 transition hover:border-blue-400 hover:bg-blue-50/50">
            <FileText className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2.5} />
            <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-slate-700">{fileName || 'Choose .pdf / .txt / .md'}</span>
            <input type="file" accept=".pdf,.txt,.md,.markdown,.csv" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
        </div>
        <div>
          <label className={label}>Or paste text</label>
          <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))} rows={4} className={`${inp} resize-y`} placeholder="Paste chapter text…" />
        </div>
        <div>
          <label className={label}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inp} placeholder="Doc title" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={label}>Board</label>
            <select value={board} onChange={(e) => setBoard(e.target.value)} className={sel}><option>CBSE</option><option>ICSE</option></select>
          </div>
          <div><label className={label}>Class</label><input value={grade} onChange={(e) => setGrade(e.target.value)} className={inp} /></div>
          <div><label className={label}>Subject</label><input value={subject} onChange={(e) => setSubject(e.target.value)} className={inp} /></div>
          <div><label className={label}>Visible to</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className={sel}>
              <option value="both">Teachers + students</option><option value="staff">Teachers only</option><option value="student">Students only</option>
            </select>
          </div>
        </div>
        <button onClick={upload} disabled={busy} className={btnPrimary}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <Upload className="h-4 w-4" strokeWidth={2.75} />} Upload + index
        </button>
        <Err msg={err} />
        {ok && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-bold text-emerald-700">{ok}</p>}

        {datasets.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <p className={`${label} flex items-center gap-1.5`}>
              <Sparkles className="h-3 w-3 text-blue-600" strokeWidth={2.75} /> SAMPLE DATA — ONE-CLICK
            </p>
            <div className="mt-1.5 space-y-2">
              {datasets.map((ds) => (
                <div key={ds.id} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                  <p className="text-[12px] font-extrabold text-slate-800">{ds.label}</p>
                  <p className="mt-0.5 text-[11px] font-medium leading-snug text-slate-500">{ds.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => seedDataset(ds)}
                      disabled={Boolean(seeding)}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-extrabold tracking-wide text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {seeding === ds.id
                        ? <Loader2 className="h-3 w-3 animate-spin" strokeWidth={3} />
                        : <BookOpen className="h-3 w-3" strokeWidth={2.75} />}
                      {seeding === ds.id ? 'Loading…' : `Load into this school (${ds.docs} docs)`}
                    </button>
                    <span className="text-[11px] font-bold text-slate-400">{ds.board} • Class {ds.grade} • {ds.subject}</span>
                  </div>
                </div>
              ))}
            </div>
            {seedMsg && (
              <p className="mt-2 flex items-start gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-bold leading-snug text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.75} /> {seedMsg}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {docs.length === 0 && <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-[13px] font-semibold text-slate-500">No docs yet — upload on the left.</p>}
        {docs.map((d) => (
          <div key={d.doc_id} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-extrabold text-slate-800">{d.title}</p>
              <p className="truncate font-mono text-[11px] font-semibold text-slate-400">{d.doc_id} • {d.chunks} chunks • {String(d.audience).toUpperCase()}</p>
            </div>
            <button onClick={() => remove(d.doc_id)} aria-label="Delete" className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Search test ---------------- */
function SearchTab({ tenant, docs }) {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(3);
  const [audience, setAudience] = useState('');
  const [board, setBoard] = useState('');
  const [subject, setSubject] = useState('');
  const [docIds, setDocIds] = useState([]);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function run() {
    setErr('');
    if (!query.trim()) { setErr('Enter a query.'); return; }
    setBusy(true);
    try {
      const data = await api('/api/rag/search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: tenant, query, top_k: topK, audience: audience || undefined, board: board || undefined, subject: subject || undefined, doc_ids: docIds }),
      });
      setRes(data.results || []);
    } catch (e) { setErr(String(e?.message || e)); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_90px_150px]">
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} placeholder="e.g. how do leaves make food from sunlight" className="rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
        <select value={topK} onChange={(e) => setTopK(Number(e.target.value))} className={sel} style={{ marginTop: 0 }}>
          {[1, 2, 3, 5, 8].map((k) => <option key={k} value={k}>top-{k}</option>)}
        </select>
        <button onClick={run} disabled={busy} className={btnPrimary}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <Search className="h-4 w-4" strokeWidth={2.75} />} Run
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        <div><label className={label}>Audience</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value)} className={sel}><option value="">any</option><option value="student">student</option><option value="staff">staff</option></select>
        </div>
        <div><label className={label}>Board</label>
          <select value={board} onChange={(e) => setBoard(e.target.value)} className={sel}><option value="">any</option><option>CBSE</option><option>ICSE</option></select>
        </div>
        <div className="sm:col-span-2"><label className={label}>Subject contains</label><input value={subject} onChange={(e) => setSubject(e.target.value)} className={inp} placeholder="Science" /></div>
      </div>
      {docs.length > 0 && (
        <div>
          <p className={label}>Scope to docs</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {docs.map((d) => (
              <button key={d.doc_id} onClick={() => setDocIds((s) => s.includes(d.doc_id) ? s.filter((x) => x !== d.doc_id) : [...s, d.doc_id])}
                className={`rounded-lg border px-2 py-1 font-mono text-[11px] font-bold transition ${docIds.includes(d.doc_id) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                {d.doc_id}
              </button>
            ))}
          </div>
        </div>
      )}
      <Err msg={err} />
      {res && (
        <div className="space-y-2">
          {res.length === 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] font-bold text-amber-800">No hits — drafts would show UNALIGNED for this query.</p>}
          {res.map((r, i) => (
            <div key={`${r.doc_id}-${r.chunk}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[11px] font-extrabold text-white">#{i + 1}</span>
                <p className="min-w-0 flex-1 truncate text-[12px] font-extrabold text-slate-800">{r.title}</p>
                <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[11px] font-extrabold text-blue-700">{r.score}</span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-slate-400">{r.doc_id}:{r.chunk}</p>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">{String(r.text).slice(0, 400)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Grounding test ---------------- */
function GroundTab({ tenant, docs }) {
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState('staff');
  const [docIds, setDocIds] = useState([]);
  const [withMemory, setWithMemory] = useState(true);
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function run() {
    setErr('');
    if (!query.trim()) { setErr('Enter a query.'); return; }
    setBusy(true);
    try {
      const data = await api('/api/rag/ground', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: tenant, query, audience, doc_ids: docIds, memory: withMemory }),
      });
      setOut(data);
    } catch (e) { setErr(String(e?.message || e)); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_150px_150px_130px]">
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} placeholder="Draft brief, e.g. worksheet on photosynthesis" className="rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className={sel} style={{ marginTop: 0 }}>
          <option value="staff">audience: staff</option><option value="student">audience: student</option>
        </select>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] font-extrabold text-slate-700">
          <input type="checkbox" checked={withMemory} onChange={(e) => setWithMemory(e.target.checked)} className="h-4 w-4 rounded accent-blue-600" />
          + memory
        </label>
        <button onClick={run} disabled={busy} className={btnPrimary}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <FlaskConical className="h-4 w-4" strokeWidth={2.75} />} Preview
        </button>
      </div>
      <div>
        <p className={label}>Ground in docs (empty = whole tenant)</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {docs.map((d) => (
            <button key={d.doc_id} onClick={() => setDocIds((s) => s.includes(d.doc_id) ? s.filter((x) => x !== d.doc_id) : [...s, d.doc_id])}
              className={`rounded-lg border px-2 py-1 font-mono text-[11px] font-bold transition ${docIds.includes(d.doc_id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
              {d.doc_id}
            </button>
          ))}
          {docs.length === 0 && <span className="text-[12px] font-semibold text-slate-400">Upload docs in the Library tab first.</span>}
        </div>
      </div>
      <Err msg={err} />
      {out && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-extrabold tracking-[0.14em] text-slate-500">
            INJECTED BLOCK • {out.hits?.length || 0} DOC HITS{out.memoryBlock ? ' + MEMORY' : ''} (no LLM turn spent)
          </p>
          <pre className="max-h-[320px] overflow-auto bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-100 whitespace-pre-wrap">
            {out.block || '(empty — chat would proceed UNALIGNED)'}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ---------------- Eval gate ---------------- */
const SAMPLE_CASES = `{"query": "how do leaves make food from sunlight", "expected_doc": "doc_PASTE_ID"}
{"query": "where are nutrients absorbed in digestion", "expected_doc": "doc_PASTE_ID"}`;

function EvalTab({ tenant }) {
  const [cases, setCases] = useState(SAMPLE_CASES);
  const [topK, setTopK] = useState(3);
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function run() {
    setErr(''); setOut(null);
    let parsed;
    try {
      parsed = cases.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
      if (!parsed.length) throw new Error('empty');
    } catch { setErr('Cases must be JSONL: one {"query","expected_doc"} per line.'); return; }
    setBusy(true);
    try {
      const data = await api('/api/rag/eval', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: tenant, cases: parsed, top_k: topK }),
      });
      setOut(data);
    } catch (e) { setErr(String(e?.message || e)); }
    finally { setBusy(false); }
  }

  const pass = out && out.accuracy >= 0.95;
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className={label}>Cases (JSONL — copy real doc_ids from the Library tab)</label>
        <textarea value={cases} onChange={(e) => setCases(e.target.value)} rows={5} spellCheck={false}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-900 px-3 py-2.5 font-mono text-[12px] text-slate-100 outline-none focus:border-blue-500" />
        <div className="mt-2 flex items-center gap-2">
          <select value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="rounded-xl border border-slate-200 px-3 py-2 text-[13px] font-bold">
            {[1, 2, 3, 5].map((k) => <option key={k} value={k}>top-{k}</option>)}
          </select>
          <button onClick={run} disabled={busy} className={btnPrimary}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <ClipboardCheck className="h-4 w-4" strokeWidth={2.75} />} Run eval
          </button>
          <span className="text-[12px] font-bold text-slate-500">Gate: ≥ 0.95 to roll out wider</span>
        </div>
      </div>
      <Err msg={err} />
      {out && (
        <div className={`rounded-2xl border p-4 ${pass ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          <div className="flex items-center gap-2">
            {pass
              ? <CheckCircle2 className="h-5 w-5 text-emerald-600" strokeWidth={2.5} />
              : <AlertCircle className="h-5 w-5 text-amber-600" strokeWidth={2.5} />}
            <p className={`text-[15px] font-extrabold ${pass ? 'text-emerald-800' : 'text-amber-800'}`}>
              {out.hits}/{out.cases} hits • accuracy {out.accuracy} {pass ? '— PASS' : '— BELOW GATE'}
            </p>
          </div>
          <div className="mt-2 space-y-1">
            {out.detail.map((d, i) => (
              <p key={i} className="font-mono text-[11px] text-slate-600">
                <span className={d.hit ? 'font-extrabold text-emerald-700' : 'font-extrabold text-red-600'}>{d.hit ? 'HIT ' : 'MISS'}</span> {d.query} → [{d.got.join(', ') || '—'}]
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Lab shell ---------------- */
export default function RagLab() {
  const tenant = useTenant();
  const [tab, setTab] = useState('status');
  const [docs, setDocs] = useState([]);
  const [busy, setBusy] = useState(false);

  async function refreshDocs() {
    if (!tenant) return;
    try {
      const data = await api(`/api/rag/library?client_id=${encodeURIComponent(tenant)}`);
      setDocs(Array.isArray(data.docs) ? data.docs : []);
    } catch { /* surfaced per-tab */ }
  }
  useEffect(() => { refreshDocs(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tenant]);

  if (!tenant) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-[13px] font-bold text-amber-800">
        Open a school session first (profile-selection → dashboard) — the Lab is scoped per tenant.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)] sm:grid-cols-5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${on ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              <span className="text-[12px] font-extrabold tracking-wide">{t.label}</span>
            </button>
          );
        })}
      </div>

      {tab === 'status' && <StatusTab tenant={tenant} />}
      {tab === 'library' && <LibraryTab tenant={tenant} docs={docs} refresh={refreshDocs} busy={busy} setBusy={setBusy} />}
      {tab === 'search' && <SearchTab tenant={tenant} docs={docs} />}
      {tab === 'ground' && <GroundTab tenant={tenant} docs={docs} />}
      {tab === 'eval' && <EvalTab tenant={tenant} />}

      <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
        <Sparkles className="h-3 w-3" strokeWidth={2.5} />
        Portable surface — this folder + lib/rag.js + /api/rag/* + rag_store.py lift into other projects as one unit.
      </p>
    </div>
  );
}
