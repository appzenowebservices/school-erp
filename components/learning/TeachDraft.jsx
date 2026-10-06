'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles, Printer, Copy, Check, Loader2, AlertCircle, FileText,
} from 'lucide-react';
import { getSessionCache } from '../../utils/sessionCache';
import Markdown from './Markdown';
import DocPicker from './DocPicker';
import { newRunId, sessionRole } from '../ai/memoryContext';
import { loadDemoDraft } from './demoDraft';

/**
 * TeachDraft — shared spec→draft→print page for Teach with AI items
 * (lesson-plan, remarks, circular, mastery). Staff audience, draft-only:
 * publishing/sending stays a human click. Same bold professional UI as
 * WorksheetBuilder.
 *
 * Props: tile, eyebrow, title, sub, badges[], route, requireNote,
 *   fields: [{key,label,type:'text'|'select'|'textarea',options?,placeholder?}],
 *   initial: {key: value}, brief(values)->string, outputTitle(values),
 *   emptySteps[3], cta
 */
export default function TeachDraft(cfg) {
  const [values, setValues] = useState(cfg.initial || {});
  const [draft, setDraft] = useState('');
  const [docIds, setDocIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Filled sample on first open (cleared by Generate / Clear).
  useEffect(() => {
    let live = true;
    loadDemoDraft(cfg.demo).then((t) => {
      if (live && t) { setDraft((d) => d || t); setIsDemo((v) => v || true); }
    });
    return () => { live = false; };
  }, [cfg.demo]);

  const label = "block text-[11px] font-extrabold tracking-[0.14em] text-slate-500";
  const inp = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const sel = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  function set(k, v) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function generate() {
    const missing = (cfg.fields || []).filter((f) => f.required && !String(values[f.key] || '').trim());
    if (missing.length > 0) {
      setError(`Fill ${missing.map((f) => f.label.toLowerCase()).join(', ')} first.`);
      return;
    }
    const c = getSessionCache('dashboardContext') || {};
    const profileId = c.profileId;
    const client_id = c.session?.clientId || c.session;
    if (!profileId || !client_id) {
      setError('Open a school session first (profile-selection → dashboard).');
      return;
    }
    setError('');
    setLoading(true);
    setDraft('');
    setIsDemo(false);
    const rid = newRunId();
    try {
      let r = null, data = {};
      for (let attempt = 0; attempt < 2; attempt++) {
        r = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: cfg.brief(values), profileId, client_id,
            route: cfg.route, audience: 'staff',
            role: sessionRole('teacher'), run_id: rid,
            doc_ids: docIds, doc_board: values.board, doc_subject: values.subject,
          }),
        });
        data = await r.json().catch(() => ({}));
        if (r.status !== 429 || attempt === 1) break;
        await new Promise((res) => setTimeout(res, 2000));
      }
      if (!r.ok) {
        if (data?.error === 'rate_limited') throw new Error('AI is busy (rate limit) — wait a few seconds and try again.');
        throw new Error(data?.error || `request_${r.status}`);
      }
      setDraft(data.response || '');
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* Spec panel */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5 pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 text-[13px] font-extrabold text-white shadow-sm">
            {cfg.tile || 'AI'}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">{cfg.eyebrow}</p>
            <h2 className="truncate text-[14px] font-extrabold tracking-wide text-slate-900">{cfg.title}</h2>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-800">
            <Sparkles className="h-3 w-3" strokeWidth={2.75} /> AI
          </span>
        </div>

        <div className="space-y-4 p-5">
          {(cfg.fields || []).map((f) => (
            <div key={f.key}>
              <label className={label}>{f.label}</label>
              {f.type === 'select' ? (
                <select value={values[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} className={sel}>
                  {(f.options || []).map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  value={values[f.key] || ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  className={`${inp} resize-y`}
                />
              ) : (
                <input
                  value={values[f.key] || ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inp}
                />
              )}
            </div>
          ))}

          <DocPicker selected={docIds} onChange={setDocIds} audience="staff" />

          <button
            onClick={generate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[13px] font-extrabold tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <Sparkles className="h-4 w-4" strokeWidth={2.75} />}
            {loading ? 'Drafting…' : (cfg.cta || 'Generate draft')}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
              <p className="text-[12px] font-semibold leading-snug text-red-700">{error}</p>
            </div>
          )}
          {cfg.requireNote && (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] font-semibold leading-snug text-slate-600">
              {cfg.requireNote}
            </p>
          )}
        </div>
      </section>

      {/* Draft panel */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
              <FileText className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">DRAFT • REVIEW BEFORE USE</p>
              <h2 className="truncate text-[14px] font-extrabold text-slate-900">
                {draft ? cfg.outputTitle(values) : 'Draft preview'}
              </h2>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={copy}
              disabled={!draft}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-extrabold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} /> : <Copy className="h-3.5 w-3.5" strokeWidth={2.75} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => window.print()}
              disabled={!draft}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[12px] font-extrabold text-white transition hover:bg-slate-800 disabled:opacity-40"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={2.75} /> Print
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {!draft && !loading && (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[15px] font-extrabold text-blue-600">
                {cfg.tile || 'AI'}
              </span>
              <h3 className="mt-4 text-[15px] font-extrabold tracking-tight text-slate-900">{cfg.title}</h3>
              <p className="mt-1.5 max-w-sm text-[13px] font-medium leading-relaxed text-slate-500">{cfg.sub}</p>
              <div className="mt-5 grid w-full max-w-md grid-cols-3 gap-2">
                {(cfg.emptySteps || ['Fill spec', 'Generate', 'Review + print']).map((t, i) => (
                  <div key={t} className="rounded-xl border border-slate-200 bg-slate-50/70 px-2 py-2.5">
                    <p className="text-[11px] font-extrabold text-slate-400">STEP {i + 1}</p>
                    <p className="mt-0.5 text-[12px] font-bold text-slate-700">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading && (
            <div className="min-h-[320px] space-y-3">
              {[96, 100, 88, 94, 70].map((w, i) => (
                <div key={i} className="h-3.5 animate-pulse rounded-lg bg-slate-100" style={{ width: `${w}%` }} />
              ))}
              <div className="h-32 animate-pulse rounded-xl border border-slate-100 bg-slate-50" />
            </div>
          )}
          {draft && isDemo && (
            <div className="no-print mb-4 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5">
              <p className="text-[12px] font-bold leading-snug text-blue-800">
                SAMPLE DRAFT — from the CBSE Class 10 Physics test set, exactly how a live draft renders.
                Press &ldquo;{cfg.cta || 'Generate draft'}&rdquo; for your own.
              </p>
              <button
                onClick={() => { setDraft(''); setIsDemo(false); }}
                className="shrink-0 rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-blue-800 transition hover:bg-blue-100"
              >
                Clear
              </button>
            </div>
          )}
          {draft && (
            <div className="print-area">
              <Markdown text={draft} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
