'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap, Sparkles, Send, Printer, Loader2,
  CheckCircle2, AlertCircle, ShieldCheck, BookOpen,
  CalendarDays, Target,
} from 'lucide-react';
import { getSessionCache } from '../../utils/sessionCache';
import Markdown from './Markdown';
import DocPicker from './DocPicker';
import { newRunId } from '../ai/memoryContext';
import { loadDemoDraft } from './demoDraft';

const SEEDED = [
  { board: 'CBSE', grade: '7', subject: 'Science', chapter: 'Nutrition in Plants' },
  { board: 'CBSE', grade: '7', subject: 'Science', chapter: 'Nutrition in Animals' },
  { board: 'CBSE', grade: '7', subject: 'Mathematics', chapter: 'Fractions and Decimals' },
  { board: 'CBSE', grade: '7', subject: 'Mathematics', chapter: 'Perimeter and Area' },
  { board: 'ICSE', grade: '7', subject: 'Science', chapter: 'Nutrition in Plants' },
  { board: 'ICSE', grade: '7', subject: 'Science', chapter: 'Physical and Chemical Changes' },
  { board: 'ICSE', grade: '7', subject: 'Mathematics', chapter: 'Fractions, Decimals and Rational Numbers' },
  { board: 'ICSE', grade: '7', subject: 'Mathematics', chapter: 'Perimeter and Area' },
];

const TASKS = {
  learn: {
    key: 'learn',
    label: 'Start tutoring',
    short: 'Learn',
    href: '/dashboard/tutor?task=learn',
    icon: BookOpen,
    badge: 'SOCRATIC • STEP BY STEP',
    headline: 'Teach me step by step',
    sub: 'The tutor asks — you answer. That is how it sticks.',
    placeholder: 'Answer, or ask your doubt…',
    startLabel: 'Start learning',
    steps: ['Pick chapter', 'Tick consent', 'Start learning'],
    followups: [
      'Got it — make the next one harder.',
      'Explain that differently, with an example.',
      'Give me a hint, not the answer.',
      'Quiz me on what we just covered.',
    ],
    opener: ({ grade, subject, chapter, board }) =>
      `I am Class ${grade} ${subject}, chapter "${chapter.trim()}" (${board}). Teach me step by step — ask me questions, don't just give answers.`,
  },
  plan: {
    key: 'plan',
    label: 'Revision plan',
    short: 'Plan',
    href: '/dashboard/tutor?task=plan',
    icon: CalendarDays,
    badge: 'PLAN • EXAM DATE + HOURS',
    headline: 'Make my revision plan',
    sub: 'Tell the exam date + daily hours — get a day-wise table you can print.',
    placeholder: 'e.g. Exam on 12 Oct, I can study 1 hour daily…',
    startLabel: 'Build my plan',
    steps: ['Pick chapter', 'Share exam date', 'Get day-wise plan'],
    followups: [
      'My exam is in 2 weeks.',
      'I can study 1 hour daily.',
      'Make a 7-day table.',
      'Quiz me on week 1.',
    ],
    opener: ({ grade, subject, chapter, board }) =>
      `I am Class ${grade} ${subject}, chapter "${chapter.trim()}" (${board}). Make my revision plan: ask my exam date and daily hours first.`,
  },
  practice: {
    key: 'practice',
    label: 'Practice me',
    short: 'Practice',
    href: '/dashboard/tutor?task=practice',
    icon: Target,
    badge: 'PRACTICE • ONE Q AT A TIME',
    headline: 'Quiz me one by one',
    sub: 'One question at a time, hints before answers, harder as you improve.',
    placeholder: 'Type your answer to the question above…',
    startLabel: 'Start practice',
    steps: ['Pick chapter', 'Answer Q1', 'Level up harder'],
    followups: [
      'Make it harder.',
      'Give me a hint.',
      'Show the solution steps.',
      'Next question.',
    ],
    opener: ({ grade, subject, chapter, board }) =>
      `I am Class ${grade} ${subject}, chapter "${chapter.trim()}" (${board}). Quiz me step by step, one question at a time.`,
  },
};

function normalizeTask(v) {
  return v === 'plan' || v === 'practice' ? v : 'learn';
}

/**
 * Tutor Studio — dedicated Socratic tutoring screen (student audience).
 * Consent-gated via the proxy allowlist; turns audited; print revision sheet.
 * Learner level is tracked in-session from self-checks (no stored profiles v1).
 * Task tabs: ?task=learn | ?task=plan | ?task=practice
 */
export default function TutorStudio() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const task = normalizeTask(params.get('task'));
  const active = TASKS[task];

  const [board, setBoard] = useState(params.get('board') || 'CBSE');
  const [grade, setGrade] = useState(params.get('grade') || '7');
  const [subject, setSubject] = useState(params.get('subject') || 'Science');
  const [chapter, setChapter] = useState(params.get('chapter') || '');
  const [consent, setConsent] = useState(false);
  const [started, setStarted] = useState(false);
  const [turns, setTurns] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checks, setChecks] = useState(0);
  const [docIds, setDocIds] = useState([]);
  const [runId, setRunId] = useState(() => newRunId());
  const [demoText, setDemoText] = useState('');

  // Reset session when switching ?task= via sidebar / URL (keeps setup, clears chat)
  useEffect(() => {
    setStarted(false);
    setTurns([]);
    setChecks(0);
    setError('');
    setInput('');
  }, [task]);

  // Sample session per tab (hidden once a real session starts).
  useEffect(() => {
    let live = true;
    setDemoText('');
    loadDemoDraft(`tutor-${task}`).then((t) => { if (live && t) setDemoText(t); });
    return () => { live = false; };
  }, [task]);

  function switchTask(next) {
    if (next === task) return;
    setStarted(false);
    setTurns([]);
    setChecks(0);
    setError('');
    setInput('');
    const q = new URLSearchParams();
    q.set('task', next);
    if (board) q.set('board', board);
    if (grade) q.set('grade', grade);
    if (subject) q.set('subject', subject);
    if (chapter.trim()) q.set('chapter', chapter.trim());
    router.push(`${pathname || '/dashboard/tutor'}?${q.toString()}`);
  }

  function ctx() {
    const c = getSessionCache('dashboardContext') || {};
    return { profileId: c.profileId, client_id: c.session?.clientId || c.session };
  }

  async function send(text, opts = {}) {
    const clean = (text || '').trim();
    if (!clean || loading) return;
    const { profileId, client_id } = ctx();
    if (!profileId || !client_id) {
      setError('Open a school session first (profile-selection → dashboard).');
      return;
    }
    setError('');
    setLoading(true);
    if (!opts.silent) setTurns((t) => [...t, { role: 'user', text: clean }]);
    setInput('');
    try {
      // Retry once on 429 (tutor bucket is 10/min) after a short backoff.
      let r = null, data = {};
      for (let attempt = 0; attempt < 2; attempt++) {
        r = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: clean, profileId, client_id,
            route: '/dashboard/tutor',
            audience: 'student', tutor_allowed: true,
            role: 'student', run_id: opts.runId || runId,
            doc_ids: docIds, doc_board: board, doc_subject: subject,
          }),
        });
        data = await r.json().catch(() => ({}));
        if (r.status !== 429 || attempt === 1) break;
        await new Promise((res) => setTimeout(res, 2000));
      }
      if (!r.ok) {
        if (data?.error === 'tutor_consent_required') {
          throw new Error('No tutor consent on file for this login — the school office must add your ID to the pilot allowlist first.');
        }
        if (data?.error === 'rate_limited') {
          throw new Error('Tutor is busy (10 turns/min limit) — wait a few seconds and try again.');
        }
        throw new Error(data?.error || `request_${r.status}`);
      }
      setTurns((t) => [...t, { role: 'assistant', text: data.response || '(empty)' }]);
      if (opts.check) setChecks((c) => c + 1);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  function start() {
    if (!consent) {
      setError('Tick the consent box first — tutor mode needs opt-in on file.');
      return;
    }
    if (!chapter.trim()) {
      setError('Pick or type a chapter to begin.');
      return;
    }
    setError('');
    setTurns([]);
    setChecks(0);
    setStarted(true);
    const rid = newRunId();
    setRunId(rid);
    send(active.opener({ grade, subject, chapter, board }), { silent: false, runId: rid });
  }

  const lastIsAssistant = turns.length > 0 && turns[turns.length - 1].role === 'assistant';

  const label = "block text-[11px] font-extrabold tracking-[0.14em] text-slate-500";
  const inp = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const sel = "mt-1.5 w-full text-[13px] font-semibold text-slate-800 rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const ActiveIcon = active.icon;

  return (
    <div className="space-y-5">
      {/* Task tabs — the three ?task= sections now exist as bold professional tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
        <div className="grid gap-2 sm:grid-cols-3">
          {Object.values(TASKS).map((t) => {
            const Icon = t.icon;
            const isActive = t.key === task;
            return (
              <button
                key={t.key}
                onClick={() => switchTask(t.key)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_8px_20px_-10px_rgba(15,23,42,0.8)]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                  }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border transition-colors ${isActive
                  ? 'border-white/25 bg-white/15 text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-600 group-hover:bg-white'
                  }`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[13px] font-extrabold tracking-wide leading-tight ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {t.label}
                  </span>
                  <span className={`block truncate text-[11px] font-bold tracking-wide ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                    /dashboard/tutor?task={t.key}
                  </span>
                </span>
                {isActive && <CheckCircle2 className="h-4 w-4 shrink-0 text-white" strokeWidth={2.75} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Setup panel */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
          <div className="flex items-center gap-3 border-b border-slate-100 p-5 pb-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">SESSION SETUP • {active.short.toUpperCase()}</p>
              <h2 className="truncate text-[14px] font-extrabold tracking-wide text-slate-900">{active.headline}</h2>
            </div>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-800">
              <Sparkles className="h-3 w-3" strokeWidth={2.75} /> AI
            </span>
          </div>

          <div className="space-y-4 p-5">
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] font-semibold leading-snug text-slate-600">
              {active.sub} Pilot: chats are safety-reviewed.
            </p>

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
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inp} placeholder="Science" />
              </div>
            </div>

            <div>
              <label className={label}>Chapter</label>
              <input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="e.g. Fractions and Decimals" className={inp} />
            </div>

            <div>
              <p className={label}>Seeded chapters • one tap</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SEEDED.map((s) => {
                  const isActive = chapter === s.chapter && subject === s.subject;
                  return (
                    <button
                      key={`${s.board}-${s.subject}-${s.chapter}`}
                      onClick={() => { setBoard(s.board); setGrade(s.grade); setSubject(s.subject); setChapter(s.chapter); }}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-extrabold tracking-wide transition-all ${isActive ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm'}`}
                    >
                      {s.board} · {s.chapter}
                    </button>
                  );
                })}
              </div>
            </div>

            <DocPicker selected={docIds} onChange={setDocIds} audience="student" />

          <label className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 transition ${consent ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'}`}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-blue-600" />
              <span className="flex items-start gap-1.5 text-[12px] font-bold leading-snug text-slate-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" strokeWidth={2.5} />
                Parent/teacher consent for AI tutoring is on file for this login.
              </span>
            </label>

            <button
              onClick={start}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-[13px] font-extrabold tracking-wide text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> : <ActiveIcon className="h-4 w-4" strokeWidth={2.75} />}
              {started ? `Restart ${active.short.toLowerCase()} session` : active.startLabel}
            </button>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
                <p className="text-[12px] font-semibold leading-snug text-red-700">{error}</p>
              </div>
            )}

            {checks > 0 && (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] font-extrabold tracking-wide text-emerald-700">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.75} />
                {checks} check{checks > 1 ? 's' : ''} passed this session
              </div>
            )}
          </div>
        </section>

        {/* Conversation panel */}
        <section className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
                <ActiveIcon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">TUTOR SESSION • {active.short.toUpperCase()}</p>
                <h2 className="truncate text-[14px] font-extrabold text-slate-900">
                  {started ? `${subject} · ${chapter || 'Untitled'}` : active.headline}
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-800">{active.badge}</span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold text-slate-600">Class {grade}</span>
              <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-extrabold ${started ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full ${started ? 'animate-ping bg-emerald-400 opacity-60' : 'bg-slate-300'}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${started ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </span>
                {started ? 'LIVE' : 'IDLE'}
              </span>
              {checks > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-extrabold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={3} /> {checks} PASSED
                </span>
              )}
            </div>
          </div>

          {!started ? (
            demoText ? (
              <div className="space-y-3 p-5">
                <div className="no-print flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5">
                  <p className="text-[12px] font-bold leading-snug text-blue-800">
                    SAMPLE SESSION — live tutor turns look exactly like this.
                    Press &ldquo;{active.startLabel}&rdquo; to start a real one.
                  </p>
                  <button
                    onClick={() => setDemoText('')}
                    className="shrink-0 rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-blue-800 transition hover:bg-blue-100"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex justify-start">
                  <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                    <Markdown text={demoText} />
                  </div>
                </div>
              </div>
            ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <ActiveIcon className="h-7 w-7" strokeWidth={2.25} />
              </span>
              <h3 className="mt-4 text-[15px] font-extrabold tracking-tight text-slate-900">{active.headline}</h3>
              <p className="mt-1.5 max-w-sm text-[13px] font-medium leading-relaxed text-slate-500">
                {active.sub}
              </p>
              <div className="mt-5 grid w-full max-w-md grid-cols-3 gap-2">
                {active.steps.map((t, i) => (
                  <div key={t} className="rounded-xl border border-slate-200 bg-slate-50/70 px-2 py-2.5">
                    <p className="text-[11px] font-extrabold text-slate-400">STEP {i + 1}</p>
                    <p className="mt-0.5 text-[12px] font-bold text-slate-700">{t}</p>
                  </div>
                ))}
              </div>
            </div>
            )
          ) : (
            <>
              <div className="print-area max-h-[52dvh] flex-1 space-y-3 overflow-y-auto p-5">
                {turns.map((t, i) => (
                  <div key={i} className={t.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                    <div className={`max-w-[92%] rounded-2xl px-4 py-3 ${t.role === 'user' ? 'bg-blue-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]' : 'w-full border border-slate-200 bg-slate-50/70'}`}>
                      {t.role === 'user' ? (
                        <span className="text-[13px] font-semibold leading-relaxed">{t.text}</span>
                      ) : (
                        <Markdown text={t.text} />
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-[12px] font-extrabold text-blue-800">
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} /> Tutor is thinking…
                  </div>
                )}
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2.5} />
                    <p className="text-[12px] font-semibold leading-snug text-red-700">{error}</p>
                  </div>
                )}
              </div>

              {lastIsAssistant && !loading && (
                <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-5 pt-3">
                  {active.followups.map((f) => (
                    <button
                      key={f}
                      onClick={() => send(f, { check: task === 'learn' ? f.startsWith('Got it') : task === 'practice' ? f.startsWith('Make it') : false })}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[12px] font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-100"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}

              <div className="no-print flex gap-2 border-t border-slate-100 bg-slate-50/50 p-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send(input)}
                  placeholder={active.placeholder}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={() => send(input)}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" strokeWidth={2.75} /> Send
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-extrabold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Printer className="h-4 w-4" strokeWidth={2.75} /> Print
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
