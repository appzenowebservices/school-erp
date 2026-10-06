'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal, FileText, Sparkles, Printer, Save, Trash2,
  Loader2, Lock, CheckCircle2, AlertCircle, KeyRound,
} from 'lucide-react';
import { getSessionCache } from '../../utils/sessionCache';
import Markdown from './Markdown';
import DocPicker from './DocPicker';
import { newRunId, sessionRole } from '../ai/memoryContext';
import { loadDemoDraft } from './demoDraft';

const MIXES = {
  Balanced: { easy: 40, medium: 40, hard: 20 },
  'Easy-heavy': { easy: 60, medium: 30, hard: 10 },
  'Exam-hard': { easy: 20, medium: 40, hard: 40 },
};

function draftKey() {
  const c = getSessionCache('dashboardContext') || {};
  return `ws-drafts:${c.session?.clientId || c.session || 'nosession'}`;
}

function splitPaperKey(text) {
  const m = String(text || '').split(/\n##\s+Answer Key\b/i);
  if (m.length >= 2) return { paper: m[0].trim(), key: m.slice(1).join('\n## Answer Key').trim() };
  return { paper: String(text || '').trim(), key: '' };
}

/**
 * Worksheet Builder — teacher screen. Form → AI paper + key → review →
 * save draft (browser only) → print. Publishing to ERP quizzes stays a
 * human click (no write RPC used by agents).
 */
export default function WorksheetBuilder() {
  const params = useSearchParams();
  const [board, setBoard] = useState(params.get('board') || 'CBSE');
  const [grade, setGrade] = useState(params.get('grade') || '7');
  const [subject, setSubject] = useState(params.get('subject') || 'Mathematics');
  const [chapter, setChapter] = useState(params.get('chapter') || '');
  const [count, setCount] = useState(10);
  const [mix, setMix] = useState('Balanced');
  const [marks, setMarks] = useState(20);
  const [minutes, setMinutes] = useState(40);
  const [variant, setVariant] = useState('A');
  const [paper, setPaper] = useState('');
  const [key, setKey] = useState('');
  const [includeKey, setIncludeKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [docIds, setDocIds] = useState([]);
  const [isDemo, setIsDemo] = useState(false);

  // Show a filled sample draft on first open (cleared by Generate / Clear).
  useEffect(() => {
    let live = true;
    loadDemoDraft('worksheet').then((t) => {
      if (live && t) { setPaper(t); setIsDemo(true); }
    });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    try {
      setDrafts(JSON.parse(localStorage.getItem(draftKey()) || '[]'));
    } catch {
      setDrafts([]);
    }
  }, []);

  function persist(list) {
    setDrafts(list);
    try {
      localStorage.setItem(draftKey(), JSON.stringify(list));
    } catch { /* storage full — print still works */ }
  }

  async function generate() {
    if (!chapter.trim()) {
      setError('Enter a chapter first.');
      return;
    }
    const c = getSessionCache('dashboardContext') || {};
    const profileId = c.profileId;
    const client_id = c.session?.clientId || c.session;
    if (!profileId || !client_id) {
      setError('Open a school session first (profile-selection → dashboard).');
      return;
    }
    const m = MIXES[mix];
    const brief = [
      `Make a Class ${grade} ${subject} worksheet on chapter "${chapter.trim()}" (${board}).`,
      `${count} questions: ${m.easy}% easy, ${m.medium}% medium, ${m.hard}% hard.`,
      `Total ${marks} marks, ${minutes} minutes, variant ${variant}.`,
      `Format exactly: a "## Question Paper" section (numbered, each tagged with its objective)`,
      `then a "## Answer Key" section with step marking for every question.`,
      `Grade-level language. Verify facts against the chapter; never invent.`,
    ].join(' ');
    setError('');
    setLoading(true);
    setPaper('');
    setKey('');
    setIsDemo(false);
    const rid = newRunId();
    try {
      const r = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: brief, profileId, client_id,
          route: '/dashboard/worksheets', audience: 'staff',
          role: sessionRole('teacher'), run_id: rid,
          doc_ids: docIds, doc_board: board, doc_subject: subject,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || `request_${r.status}`);
      const split = splitPaperKey(data.response || '');
      setPaper(split.paper);
      setKey(split.key);
      if (!split.key) setError('Answer key section was not detected — full output shown as paper. Regenerate or split manually.');
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  function saveDraft() {
    if (!paper) return;
    const d = {
      id: Date.now(),
      name: `${subject} · ${chapter} · ${new Date().toLocaleDateString()}`,
      at: new Date().toISOString(),
      form: { board, grade, subject, chapter, count, mix, marks, minutes, variant },
      paper, key,
    };
    persist([d, ...drafts].slice(0, 30));
  }

  function loadDraft(d) {
    setBoard(d.form.board); setGrade(d.form.grade); setSubject(d.form.subject);
    setChapter(d.form.chapter); setCount(d.form.count); setMix(d.form.mix);
    setMarks(d.form.marks); setMinutes(d.form.minutes); setVariant(d.form.variant);
    setPaper(d.paper); setKey(d.key || '');
    setIsDemo(false);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const sel = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const inp = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const label = "block text-[11px] font-extrabold tracking-[0.14em] text-slate-500";

  const status = loading ? 'working' : paper ? 'ready' : 'empty';

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* Spec panel */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5 pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 text-white shadow-sm">
            <SlidersHorizontal className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">WORKSHEET SPEC</p>
            <h2 className="truncate text-[14px] font-extrabold tracking-wide text-slate-900">Build specification</h2>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-800">
            <Sparkles className="h-3 w-3" strokeWidth={2.75} /> AI
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className={label}>Board</label>
            <select value={board} onChange={(e) => setBoard(e.target.value)} className={sel}>
              <option>CBSE</option>
              <option>ICSE</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={label}>Class</label>
              <input value={grade} onChange={(e) => setGrade(e.target.value)} className={inp} placeholder="7" />
            </div>
            <div>
              <label className={label}>Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inp} placeholder="Mathematics" />
            </div>
          </div>

          <div>
            <label className={label}>Chapter</label>
            <input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="e.g. Fractions and Decimals" className={inp} />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className={label}>Questions</label>
              <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} className={inp} />
            </div>
            <div>
              <label className={label}>Marks</label>
              <input type="number" min={1} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className={inp} />
            </div>
            <div>
              <label className={label}>Minutes</label>
              <input type="number" min={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className={inp} />
            </div>
          </div>

          <div>
            <label className={label}>Difficulty mix</label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
              {Object.keys(MIXES).map((k) => (
                <button
                  key={k}
                  onClick={() => setMix(k)}
                  className={`rounded-lg px-2 py-2 text-[12px] font-extrabold tracking-wide transition-all ${mix === k ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'}`}
                >
                  {k}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-slate-500">
              {MIXES[mix].easy}% easy • {MIXES[mix].medium}% medium • {MIXES[mix].hard}% hard
            </p>
          </div>

          <div>
            <label className={label}>Variant</label>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
              {['A', 'B'].map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`rounded-lg px-2 py-2 text-[12px] font-extrabold tracking-wide transition-all ${variant === v ? 'bg-blue-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'}`}
                >
                  Variant {v}
                </button>
              ))}
            </div>
          </div>

          <DocPicker selected={docIds} onChange={setDocIds} audience="staff" />

          <button
            onClick={generate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[13px] font-extrabold tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <Sparkles className="h-4 w-4" strokeWidth={2.75} />}
            {loading ? 'Generating…' : 'Generate worksheet'}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
              <p className="text-[12px] font-semibold leading-snug text-red-700">{error}</p>
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:border-slate-300 hover:bg-white">
            <input type="checkbox" checked={includeKey} onChange={(e) => setIncludeKey(e.target.checked)} className="h-4 w-4 rounded accent-blue-600" />
            <span className="text-[12px] font-bold text-slate-700">Include answer key in print</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={saveDraft}
              disabled={!paper}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-[12px] font-extrabold tracking-wide text-white transition-all hover:bg-slate-800 disabled:opacity-40"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={2.75} /> Save draft
            </button>
            <button
              onClick={() => window.print()}
              disabled={!paper}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12px] font-extrabold tracking-wide text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={2.75} /> Print
            </button>
          </div>

          {drafts.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">SAVED DRAFTS • {drafts.length}</p>
              <div className="mt-2 max-h-[220px] space-y-1.5 overflow-y-auto pr-0.5">
                {drafts.map((d) => (
                  <div key={d.id} className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm">
                    <button onClick={() => loadDraft(d)} className="min-w-0 flex-1 truncate text-left text-[12px] font-bold text-slate-800">{d.name}</button>
                    <button
                      onClick={() => persist(drafts.filter((x) => x.id !== d.id))}
                      aria-label="Delete draft"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Output panel */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
              <FileText className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">QUESTION PAPER</p>
              <h2 className="truncate text-[14px] font-extrabold text-slate-900">
                {paper ? `${subject} · ${chapter || 'Untitled'}` : 'Paper preview'}
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-600">Class {grade}</span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-600">{board}</span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-600">{marks} marks</span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-600">{minutes} min</span>
            <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-extrabold ${status === 'ready' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : status === 'working' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'}`}>
              {status === 'ready' ? <><CheckCircle2 className="h-3 w-3" strokeWidth={3} /> READY</> : status === 'working' ? <><Loader2 className="h-3 w-3 animate-spin" strokeWidth={3} /> DRAFTING</> : 'EMPTY'}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {paper && isDemo && (
            <div className="no-print mb-4 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5">
              <p className="text-[12px] font-bold leading-snug text-blue-800">
                SAMPLE DRAFT — from the CBSE Class 10 Physics test set, exactly how a live draft renders.
                Press &ldquo;Generate worksheet&rdquo; for your own.
              </p>
              <button
                onClick={() => { setPaper(''); setKey(''); setIsDemo(false); }}
                className="shrink-0 rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-blue-800 transition hover:bg-blue-100"
              >
                Clear
              </button>
            </div>
          )}
          {!paper && !loading && (
            <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <FileText className="h-7 w-7" strokeWidth={2.25} />
              </span>
              <h3 className="mt-4 text-[15px] font-extrabold tracking-tight text-slate-900">Fill the spec, then generate</h3>
              <p className="mt-1.5 max-w-sm text-[13px] font-medium leading-relaxed text-slate-500">
                Paper appears here with the answer key below it. Review on screen, then publish to quizzes by hand.
              </p>
              <div className="mt-5 grid w-full max-w-md grid-cols-3 gap-2">
                {['Set chapter', 'Pick mix', 'Generate'].map((t, i) => (
                  <div key={t} className="rounded-xl border border-slate-200 bg-slate-50/70 px-2 py-2.5">
                    <p className="text-[11px] font-extrabold text-slate-400">STEP {i + 1}</p>
                    <p className="mt-0.5 text-[12px] font-bold text-slate-700">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="min-h-[380px] space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-[12px] font-extrabold text-blue-800">
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> Drafting paper + key…
              </div>
              {[92, 100, 84, 96, 70].map((w, i) => (
                <div key={i} className="h-3.5 animate-pulse rounded-lg bg-slate-100" style={{ width: `${w}%` }} />
              ))}
              <div className="h-32 animate-pulse rounded-xl bg-slate-50 border border-slate-100" />
            </div>
          )}

          {paper && (
            <div className="print-area">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b-2 border-slate-900 pb-3">
                <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">{subject} · {chapter}</h2>
                <span className="text-[12px] font-semibold text-slate-500">Class {grade} · {board} · Variant {variant} · {marks} marks · {minutes} min</span>
              </div>
              <div className="mt-2">
                <Markdown text={paper} />
              </div>

              {key && includeKey && (
                <>
                  <hr className="my-5 border-slate-200" />
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <KeyRound className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <h2 className="text-[14px] font-extrabold tracking-wide text-slate-900">Answer Key <span className="font-semibold text-slate-500">(teachers only)</span></h2>
                  </div>
                  <div className="mt-2">
                    <Markdown text={key} />
                  </div>
                </>
              )}

              {key && !includeKey && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/70">
                  <div className="flex items-center gap-2 border-b border-amber-200/70 px-4 py-2.5">
                    <Lock className="h-3.5 w-3.5 text-amber-700" strokeWidth={2.75} />
                    <p className="text-[12px] font-extrabold tracking-wide text-amber-900">ANSWER KEY READY • EXCLUDED FROM PRINT</p>
                  </div>
                  <div className="px-4 py-3">
                    <Markdown text={key} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
