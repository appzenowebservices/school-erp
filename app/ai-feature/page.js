"use client";

import Link from "next/link";

const LIVE = "Live now";
const PILOT = "Pilot";

const FEATURES = [
  {
    n: "01",
    status: LIVE,
    title: "Ask ERP Copilot",
    pain: "Staff can't find features; every answer needs a support ticket.",
    fix: "Floating assistant inside the ERP. Shows Active/Disabled itself, answers from your live data, drafts what you approve.",
    points: ["Active/Disabled status with reason", "Ask ERP + Tutor modes", "Deep-links you to the screen"],
    reads: "Scoped per school/session, audited per turn",
  },
  {
    n: "02",
    status: LIVE,
    title: "Learning Surfaces — Real Data",
    pain: "Homework, quizzes, notices and library had backends but zero screens — staff lived in Excel and word of mouth.",
    fix: "New LEARNING menu: Homework, Quizzes, Notices, Library — thin, fast lists over the real ERP APIs.",
    points: ["/dashboard/homework", "/dashboard/quizzes", "/dashboard/notices", "/dashboard/library"],
    reads: "homeworkReminder.getList · quiz.getList · notice.getList · book.getList",
  },
  {
    n: "03",
    status: LIVE,
    title: "Teacher Copilot",
    pain: "Lesson plans, worksheets, remarks and circulars eat evenings.",
    fix: "Drafts grounded in your board and your class — lesson plans with exit tickets, worksheets with keys, remarks from real marks, circulars + 160-char SMS.",
    points: ["Board-aligned lesson plans", "Worksheets with step-marked keys", "Remarks from actual results"],
    reads: "Curriculum files · student.getResult · notice tone",
  },
  {
    n: "04",
    status: PILOT,
    title: "Student Tutor (Socratic)",
    pain: "Generic chatbots give answers; students copy, learn nothing.",
    fix: "Study mode that guides step by step, quizzes back, adapts difficulty, plans revision from marks weaknesses. Consent-gated, 1 school pilot.",
    points: ["Questions before answers", "Homework help from real homework", "Revision plans from weak chapters"],
    reads: "student.getResult · homeworkReminder.getList · curriculum node",
  },
  {
    n: "05",
    status: LIVE,
    title: "Curriculum Graph — CBSE + ICSE",
    pain: "AI invents chapters and objectives; teachers stop trusting it.",
    fix: "Versioned board→grade→subject→chapter→objective files teachers can correct. Every draft cites its chapter.",
    points: ["CBSE + ICSE grade 7 seeded", "Objectives + misconceptions per chapter", "Teacher corrections logged"],
    reads: "ai-agent/curriculum/ (file-backed, no DB needed)",
  },
  {
    n: "06",
    status: LIVE,
    title: "Classroom Intelligence",
    pain: "After every test: who got it, who didn't, what to reteach — all manual.",
    fix: "One class+subject read becomes a mastery map: % mastered, support vs advanced groups, one reteach activity. Names stay in teacher channel.",
    points: ["Mastered / near / support buckets", "De-identified outside staff", "Reteach brief included"],
    reads: "classRoom.getResult (one capped page per run)",
  },
  {
    n: "07",
    status: LIVE,
    title: "Ops Backbone — 16 Read-Only Tools",
    pain: "Duplicate parents, fee defaulters, Excel proof-reading, login triage — all manual support load.",
    fix: "Central AI core with 16 tools that can only read (or compute locally). No writes exist — grades and fees can't be touched by AI, by design.",
    points: ["Ticket solver + reply drafts", "Excel audit with zero API calls", "Fee defaulters + letter drafts"],
    reads: "Same ERP RPCs, paged + capped (max 100 rows)",
  },
  {
    n: "08",
    status: LIVE,
    title: "Safety Layer for Minors",
    pain: "Student AI without guardrails is a non-starter for principals and parents.",
    fix: "Consent gate enforced server-side, Socratic rules injected per turn, phones masked, full audit log, 90-day prune. Learner data derived fresh — nothing stored.",
    points: ["Opt-in consent lock (403 without it)", "PII minimization + audit trail", "No stored minor profiles in v1"],
    reads: "Enforced in proxy, not promised in prompts",
  },
];

export default function AiFeaturePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#1981ee,#15487d)" }}
          >
            AI
          </div>
          <div className="font-bold text-[#0f345a]">infoEIGHT ERP <span className="font-normal text-gray-400">+ AI · what shipped</span></div>
          <div className="ml-auto flex gap-2">
            <a href="#features" className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#e7f2fe] text-[#15487d]">
              See features
            </a>
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-xl text-white" style={{ background: "#007aff" }}>
              Open ERP
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-white" style={{ background: "linear-gradient(135deg,#1981ee 0%,#15487d 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-block text-xs font-semibold tracking-wide bg-white/20 rounded-full px-4 py-1.5 mb-4">
            SHIPPED IN THIS BUILD — NOT SLIDES
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
            An ERP that plans lessons, tutors students, and explains itself.
          </h1>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto text-sm md:text-base">
            Every feature below reads your school's real data — marks, homework, attendance, library —
            through 16 read-only tools. AI that can't touch grades or fees, by design.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="#features" className="font-semibold text-sm bg-[#fea613] text-[#3E2723] px-6 py-3 rounded-xl">
              Explore 8 features
            </a>
            <Link href="/dashboard" className="font-semibold text-sm bg-white/15 border border-white/30 px-6 py-3 rounded-xl">
              Try the Copilot inside
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
            {["16 read-only tools", "CBSE + ICSE aligned", "Consent-gated tutor", "Human approves everything"].map((t) => (
              <span key={t} className="bg-white/15 rounded-full px-3 py-1.5">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Status strip */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["16", "read-only AI tools live"],
            ["11", "skills (teacher + tutor + ops)"],
            ["4", "new Learning routes with real data"],
            ["0", "write paths — AI can't alter records"],
          ].map(([big, small]) => (
            <div key={small} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#15487d]">{big}</div>
              <div className="text-xs text-gray-500 mt-1">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-[1200px] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f345a] text-center">What shipped</h2>
        <p className="text-center text-gray-500 text-sm mt-2">Each card names the real data it reads — that is the moat.</p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {FEATURES.map((f) => (
            <div key={f.n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#1981ee]">{f.n}</span>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${f.status === LIVE ? "bg-[#00C853]/10 text-[#008000]" : "bg-[#fea613]/20 text-[#7c2d12]"}`}>
                  {f.status}
                </span>
              </div>
              <h3 className="font-bold text-[#0f345a] text-lg mt-1">{f.title}</h3>
              <div className="mt-3 text-sm">
                <div className="text-xs font-semibold text-red-500 uppercase tracking-wide">Pain</div>
                <p className="text-gray-600 mt-1">{f.pain}</p>
              </div>
              <div className="mt-3 text-sm">
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">Now</div>
                <p className="text-gray-700 mt-1 font-medium">{f.fix}</p>
              </div>
              <ul className="mt-3 space-y-1.5">
                {f.points.map((p) => (
                  <li key={p} className="text-[13px] text-gray-600 flex gap-2">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-[#e7f2fe] text-[#15487d] text-[11px] flex items-center justify-center font-bold">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-xs font-mono bg-[#0f345a] text-white/90 rounded-xl px-3 py-2">
                reads: {f.reads}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="bg-[#f3f9ff] border-y border-[#e2e8f0]">
        <div className="max-w-[1200px] mx-auto px-4 py-12 grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wide">Before</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>— Homework, quizzes, notices: backend existed, no screens</li>
              <li>— Lesson plans and remarks written from scratch nightly</li>
              <li>— Tutors that hand out answers; teachers stop trusting AI</li>
              <li>— Support drowns in duplicates, defaulters, login tickets</li>
              <li>— No one can say what the AI may touch</li>
            </ul>
          </div>
          <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg,#1981ee,#15487d)" }}>
            <h3 className="font-bold text-sm uppercase tracking-wide opacity-80">After</h3>
            <ul className="mt-3 space-y-2 text-sm font-medium">
              <li>✓ LEARNING menu with live homework, quizzes, notices, books</li>
              <li>✓ Drafts grounded in board chapters and real marks</li>
              <li>✓ Socratic tutor, consent-gated, audited</li>
              <li>✓ 16 read-only tools carry the ops load</li>
              <li>✓ Answer: reads only — zero write paths, human approves</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="max-w-[1200px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#0f345a] text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            ["1", "It reads your school", "Marks, homework, attendance, library — one capped page at a time, scoped to your session."],
            ["2", "It drafts, never acts", "Lesson, worksheet, remark, circular, mastery map — ready text, you hit approve. No write API exists."],
            ["3", "It teaches, not tells", "Tutor mode guides step by step and quizzes back — under consent, logged, and pruned."],
          ].map(([n, t, d]) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-full text-white font-bold flex items-center justify-center" style={{ background: "#007aff" }}>{n}</div>
              <div className="font-bold text-[#0f345a] mt-3">{t}</div>
              <div className="text-sm text-gray-500 mt-1">{d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl text-center text-white p-8" style={{ background: "linear-gradient(135deg,#15487d,#1981ee)" }}>
          <h3 className="text-xl md:text-2xl font-bold">The ERP that knows your school.</h3>
          <p className="text-white/80 text-sm mt-2">Live copilot today. Tutor pilot next. Ask for a demo on your own data.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/login" className="text-sm font-semibold bg-white text-[#15487d] px-6 py-3 rounded-xl">
              Try the ERP
            </Link>
            <a href="#features" className="text-sm font-semibold bg-white/15 border border-white/30 px-6 py-3 rounded-xl">
              Re-read features
            </a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-6">/ai-feature • Live build showcase • Same ERP theme</div>
      </section>
    </div>
  );
}
