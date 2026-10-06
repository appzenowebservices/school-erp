'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { getSessionCache } from '../../utils/sessionCache';
import { newRunId, sessionRole } from './memoryContext';

/**
 * Embedded Ask ERP copilot. Schools use this — never the raw Hermes dashboard.
 * Sends {message, profileId, client_id} to /api/ai/chat; the server injects
 * guid/id from cookies and scopes the agent to this school/session.
 * Shows AI Active/Disabled from /api/ai/status (core reachability + LLM key).
 */
export default function Copilot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [turns, setTurns] = useState([]);
  // null = checking, true = active, false = disabled
  const [aiOn, setAiOn] = useState(null);
  const [aiDetail, setAiDetail] = useState('');
  // Audience: 'staff' (default copilot) or 'student' (Socratic tutor, consent-gated).
  const [audience, setAudience] = useState('staff');
  const [consent, setConsent] = useState(false);
  const [runId, setRunId] = useState(() => newRunId());

  async function refreshStatus() {
    try {
      const r = await fetch('/api/ai/status', { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      const on = data?.status === 'active';
      setAiOn(on);
      setAiDetail(
        on
          ? [data.provider, data.model].filter(Boolean).join(' / ')
          : data?.reason === 'core_offline'
            ? 'AI core offline'
            : data?.reason === 'no_provider'
              ? 'No LLM provider configured on the core'
              : 'AI disabled'
      );
    } catch {
      setAiOn(false);
      setAiDetail('AI core offline');
    }
  }

  useEffect(() => {
    refreshStatus();
  }, []);
  useEffect(() => {
    if (open) refreshStatus();
  }, [open]);

  // AI Hub presets: Sidebar dispatches `ai-hub:ask` {text, audience} —
  // panel opens and the question auto-sends. Ref avoids stale closures.
  const askRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail || {};
      if (detail.audience === 'student' || detail.audience === 'staff') {
        setAudience(detail.audience);
        setError('');
      }
      setOpen(true);
      refreshStatus();
      if (detail.text) setRunId(newRunId()); // preset = new memory run
      if (detail.text && askRef.current) {
        const t = setTimeout(() => askRef.current(detail.text), 60);
        return () => clearTimeout(t);
      }
    };
    window.addEventListener('ai-hub:ask', handler);
    return () => window.removeEventListener('ai-hub:ask', handler);
  }, []);

  async function ask(preset) {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    if (aiOn === false) {
      setError('AI is disabled — no LLM provider configured on the core. Ask your admin to set it up.');
      return;
    }
    setError('');
    const ctx = getSessionCache('dashboardContext') || {};
    const profileId = ctx.profileId;
    const client_id = ctx.session?.clientId || ctx.session;
    if (!profileId || !client_id) {
      setError('Open a school session first (profile-selection → dashboard).');
      return;
    }
    setLoading(true);
    setTurns((t) => [...t, { role: 'user', text }]);
    setInput('');
    try {
      // Retry once on 429 after a short backoff.
      let r = null, data = {};
      for (let attempt = 0; attempt < 2; attempt++) {
        r = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            profileId,
            client_id,
            route: pathname,
            audience,
            role: audience === 'student' ? 'student' : sessionRole('staff'),
            run_id: runId,
            tutor_allowed: audience === 'student' ? consent === true : undefined,
          }),
        });
        data = await r.json().catch(() => ({}));
        if (r.status !== 429 || attempt === 1) break;
        await new Promise((res) => setTimeout(res, 2000));
      }
      if (!r.ok) {
        if (data?.providerConfigured === false) {
          setAiOn(false);
          setAiDetail('No LLM provider configured on the core');
        }
        if (data?.error === 'tutor_consent_required') {
          throw new Error('Tutor mode needs opt-in consent first — tick the consent box AND ask the school office to add your ID to the pilot allowlist.');
        }
        if (data?.error === 'rate_limited') {
          throw new Error('AI is busy (rate limit) — wait a few seconds and try again.');
        }
        throw new Error(data?.error || `request_${r.status}`);
      }
      setTurns((t) => [...t, { role: 'assistant', text: data.response || '(empty)' }]);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }
  askRef.current = ask;

  // Portalled to document.body so no ancestor transform/layout can hijack
  // the viewport anchoring — stays bottom-right and responsive on every page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dotColor = aiOn === null ? '#fbbf24' : aiOn ? '#00C853' : '#D32F2F';

  return createPortal(
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[100]">
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative block w-14 h-14 rounded-2xl text-white font-bold shadow-lg"
          style={{ background: aiOn === false ? '#9ca3af' : 'linear-gradient(135deg,#1981ee,#15487d)' }}
          aria-label={aiOn === false ? 'Ask ERP (AI disabled)' : 'Ask ERP'}
          title={aiOn === null ? 'Checking AI status…' : aiDetail || (aiOn ? 'AI active' : 'AI disabled')}
        >
          AI
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
            style={{ background: dotColor }}
          />
        </button>
      </div>
      {open && (
        <div className="fixed z-[100] bottom-[5.5rem] sm:bottom-24 right-4 sm:right-5 w-[380px] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-8rem)] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 text-white" style={{ background: aiOn === false ? '#6b7280' : 'linear-gradient(135deg,#1981ee,#15487d)' }}>
            <div className="flex items-center gap-2">
              <div className="font-bold text-sm">Ask ERP</div>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: aiOn === null ? 'rgba(255,255,255,.25)' : aiOn ? '#00C853' : '#D32F2F' }}
              >
                {aiOn === null ? 'Checking…' : aiOn ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div className="text-xs opacity-80">
              {aiOn === false ? aiDetail || 'AI disabled.' : audience === 'student'
                ? 'Study mode — I guide, you solve. Pilot: chats are safety-reviewed.'
                : 'Navigate, explain, draft — scoped to your school.'}
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 pt-3">
            <div className="flex rounded-full bg-gray-100 p-0.5 text-xs font-semibold">
              {['staff', 'student'].map((a) => (
                <button
                  key={a}
                  onClick={() => { setAudience(a); setTurns([]); setError(''); }}
                  className={`px-3 py-1 rounded-full capitalize ${audience === a ? 'bg-white shadow text-[#15487d]' : 'text-gray-500'}`}
                >
                  {a === 'staff' ? 'Ask ERP' : 'Tutor'}
                </button>
              ))}
            </div>
            {audience === 'student' && (
              <label className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="accent-[#007aff]" />
                Parent/teacher consent on file
              </label>
            )}
          </div>
          <div className="flex gap-2 px-3 pt-2 flex-wrap">
            {(audience === 'student'
              ? ['Explain photosynthesis step by step', 'Quiz me on fractions', 'Plan my revision']
              : ['Where is concession fee?', 'Draft PTA circular', 'Why is total wrong?']).map((p) => (
              <button key={p} onClick={() => ask(p)} className="text-xs px-2.5 py-1.5 rounded-full bg-[#e7f2fe] text-[#15487d] font-semibold">
                {p}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-[120px] max-h-[40dvh]">
            {turns.length === 0 && (
              <div className="text-xs text-gray-400">{audience === 'student'
                ? 'Tell me your class + chapter, e.g. “Class 7 fractions”. I ask, you answer — that is how it sticks.'
                : 'Example: “Show defaulters above ₹5000 in X-A and draft the letter.”'}</div>
            )}
            {turns.map((t, i) => (
              <div key={i} className={`text-sm rounded-xl px-3 py-2 whitespace-pre-wrap ${t.role === 'user' ? 'bg-gray-100 text-gray-800' : 'bg-[#f3f9ff] text-[#0f345a]'}`}>
                {t.text}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400">Thinking…</div>}
            {error && <div className="text-xs text-red-600">{error}</div>}
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder={aiOn === false ? 'AI disabled — provider not configured' : audience === 'student' ? 'Ask to learn (I will quiz you back)…' : 'Ask in plain words…'}
              disabled={aiOn === false}
              className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1981ee] disabled:bg-gray-100"
            />
            <button onClick={() => ask()} disabled={loading || aiOn === false} className="text-sm font-semibold px-4 rounded-xl text-white disabled:opacity-50" style={{ background: '#007aff' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
