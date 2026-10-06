'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen, Upload, Trash2, Loader2, AlertCircle, CheckCircle2,
  FileText, Sparkles, ArrowRight,
} from 'lucide-react';
import { getSessionCache } from '../../utils/sessionCache';

const MAX_TEXT = 200_000;
const MAX_PDF_PAGES = 60;

/**
 * My Docs — upload books / PDFs / docs into the school's vector RAG store.
 * Text is extracted + sanitized in the BROWSER (PDF text layer via pdf.js;
 * images are never uploaded). Server ingests text only (/api/ai/library).
 */
export default function MyDocs() {
  const ctx = getSessionCache('dashboardContext') || {};
  const client_id = ctx.session?.clientId || ctx.session || '';

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [grade, setGrade] = useState('7');
  const [board, setBoard] = useState('CBSE');
  const [audience, setAudience] = useState('both');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const label = "block text-[11px] font-extrabold tracking-[0.14em] text-slate-500";
  const inp = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const sel = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  async function refresh() {
    if (!client_id) return;
    setLoading(true);
    setError('');
    try {
      const r = await fetch(`/api/ai/library?client_id=${encodeURIComponent(client_id)}`, { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || `request_${r.status}`);
      setDocs(Array.isArray(data.docs) ? data.docs : []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function handleFile(file) {
    setError('');
    setOk('');
    if (!file) return;
    setFileName(file.name);
    try {
      if (/\.pdf$/i.test(file.name)) {
        const buf = await file.arrayBuffer();
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url
        ).toString();
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
        if (!extracted) {
          throw new Error('No text layer found — this looks like a scanned PDF. Paste the text instead (photo/OCR lands with the vision upgrade).');
        }
        setText(extracted.slice(0, MAX_TEXT));
        if (!title) setTitle(file.name.replace(/\.pdf$/i, ''));
        if (pdf.numPages > MAX_PDF_PAGES) {
          setError(`Large PDF: first ${MAX_PDF_PAGES} of ${pdf.numPages} pages extracted. Split bigger books into parts.`);
        }
      } else if (/\.(txt|md|markdown|csv)$/i.test(file.name)) {
        const t = await file.text();
        setText(t.slice(0, MAX_TEXT));
        if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
      } else {
        throw new Error('Unsupported file — use .pdf, .txt, .md, or paste text directly.');
      }
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function upload() {
    setError('');
    setOk('');
    if (!client_id) {
      setError('Open a school session first (profile-selection → dashboard).');
      return;
    }
    if (!title.trim() || !text.trim()) {
      setError('Give the doc a title and some text first.');
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/ai/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id, title: title.trim(), text,
          subject, grade, board, audience,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || `request_${r.status}`);
      setOk(`Indexed "${title.trim()}" — ${data.chunks} chunks ready for grounding.`);
      setTitle('');
      setText('');
      setFileName('');
      refresh();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function remove(doc_id) {
    setError('');
    setOk('');
    try {
      const r = await fetch('/api/ai/library', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id, doc_id }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || `request_${r.status}`);
      setOk('Doc deleted from the school library.');
      refresh();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
      {/* Upload panel */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5 pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 text-white shadow-sm">
            <Upload className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">ADD TO LIBRARY</p>
            <h2 className="truncate text-[14px] font-extrabold tracking-wide text-slate-900">Upload a book or doc</h2>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-800">
            <Sparkles className="h-3 w-3" strokeWidth={2.75} /> RAG
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className={label}>File (.pdf text layer, .txt, .md)</label>
            <label className="mt-1.5 flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-3 transition hover:border-blue-400 hover:bg-blue-50/50">
              <FileText className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={2.25} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-slate-700">
                {fileName || 'Choose a file — parsed in your browser, never raw-uploaded'}
              </span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.markdown,.csv"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            <p className="mt-1.5 text-[12px] font-medium text-slate-500">
              Scanned-image PDFs have no text layer — paste the text instead.
            </p>
          </div>

          <div>
            <label className={label}>Or paste text directly</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
              rows={5}
              placeholder="Paste chapter text, notes, or worksheets here…"
              className={`${inp} resize-y`}
            />
            <p className="mt-1 text-right text-[11px] font-bold text-slate-400">{text.length.toLocaleString()} / {MAX_TEXT.toLocaleString()}</p>
          </div>

          <div>
            <label className={label}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Honeycomb Ch.1 — The Best Christmas Present" className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={label}>Board</label>
              <select value={board} onChange={(e) => setBoard(e.target.value)} className={sel}>
                <option>CBSE</option>
                <option>ICSE</option>
              </select>
            </div>
            <div>
              <label className={label}>Class</label>
              <input value={grade} onChange={(e) => setGrade(e.target.value)} className={inp} placeholder="7" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={label}>Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inp} placeholder="English" />
            </div>
            <div>
              <label className={label}>Visible to</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} className={sel}>
                <option value="both">Teachers + students</option>
                <option value="staff">Teachers only</option>
                <option value="student">Students only</option>
              </select>
            </div>
          </div>

          <button
            onClick={upload}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[13px] font-extrabold tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <Upload className="h-4 w-4" strokeWidth={2.75} />}
            {busy ? 'Indexing…' : 'Upload + index'}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
              <p className="text-[12px] font-semibold leading-snug text-red-700">{error}</p>
            </div>
          )}
          {ok && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
              <p className="text-[12px] font-semibold leading-snug text-emerald-700">{ok}</p>
            </div>
          )}
        </div>
      </section>

      {/* Library list + workflows */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
              <BookOpen className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">SCHOOL RAG LIBRARY • {docs.length}</p>
              <h2 className="text-[14px] font-extrabold text-slate-900">Indexed docs</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { t: 'Worksheet from docs', href: '/dashboard/worksheets' },
              { t: 'Tutor from docs', href: '/dashboard/tutor' },
            ].map((w) => (
              <a
                key={w.t}
                href={w.href}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[12px] font-extrabold text-blue-800 transition hover:bg-blue-100"
              >
                {w.t} <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.75} />
              </a>
            ))}
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-2">
              {[100, 92, 96].map((w, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <BookOpen className="h-7 w-7" strokeWidth={2.25} />
              </span>
              <h3 className="mt-4 text-[15px] font-extrabold tracking-tight text-slate-900">Nothing indexed yet</h3>
              <p className="mt-1.5 max-w-sm text-[13px] font-medium leading-relaxed text-slate-500">
                Upload a book or paste chapter text — then tick it under “Ground in my docs”
                in Worksheet Builder or Tutor Studio for custom workflows.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map((d) => (
                <div key={d.doc_id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-slate-300 hover:shadow-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600">
                    <FileText className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-extrabold text-slate-800">{d.title}</p>
                    <p className="truncate text-[11px] font-semibold text-slate-500">
                      {[d.board, d.grade && `Class ${d.grade}`, d.subject, `${d.chunks} chunks`].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide ${d.audience === 'staff' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {String(d.audience || 'both').toUpperCase()}
                  </span>
                  <button
                    onClick={() => remove(d.doc_id)}
                    aria-label={`Delete ${d.title}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
