# Phase 3 — K-12 LLM product inside the ERP (IMPLEMENTED, uncommitted)

> Direction: Student Tutor + Teacher Copilot + Curriculum engine, ERP-data-moated.
> Constraints honored: backend API read-only (16/16 erp-mcp tools are reads or
> local compute), no direct DB, restricted agent access, drafts-only writes.

## Shipped

- **Thin read surfaces** (had backends, zero UI): `/dashboard/homework`,
  `/dashboard/quizzes`, `/dashboard/notices`, `/dashboard/library` — server
  pages + `api/{homework,quiz,notices,library}.js` + shared
  `components/learning/ReadList.jsx`; `LEARNING` menu in Sidebar.
- **erp-mcp 7 → 16 tools**: +homework/quiz/notice/result/class-result/
  attendance/book/borrower/meeting. Single-page capped reads, `_slim`
  projection keeps prompts small (cost guard).
- **11 skills** (descriptions ≤60c verified): teacher 4 (lesson-planner,
  worksheet-quiz-gen, remarks-writer, circular-drafter) + learning 4
  (tutor-socratic, study-planner, classroom-analyzer, curriculum-aligner)
  + ops 3 (Phase 2).
- **Curriculum graph v1**: `ai-agent/curriculum/{cbse,icse}/grade-7/`
  (science+maths, 2 chapters each, objectives/competencies/misconceptions),
  schema in README, `corrections.log`, file-grep RAG (`erp-ops/RAG.md`).
- **Tutor mode + safety**: Copilot Ask/Tutor toggle, consent checkbox,
  proxy consent gate (403 without opt-in), server-injected Socratic rules,
  phone masking in tutor turns, audience-scoped skills, tutor max_turns 8.
- **Specs**: `erp-ops/learner-model.md` (v1 derived-fresh, no stored minor
  profiles), `erp-ops/SAFETY.md` (gates, boundaries, audit, incidents).

## Deliberately NOT built

SSO, Drive/365/Canva integrations, voice, games/simulations, auto-publishing
to quizzes/notices (human click only), vision UI (path documented in RAG.md),
persisted learner profiles (needs consent framework sign-off first).

## Pilot gates (both tracks run parallel)

- Teacher track: any pilot school now. Measure drafts accepted/edited,
  time saved vs manual planning.
- Student track: 1 school, 1–2 grades, written opt-in, tutor transcript audit
  weekly, 90-day prune on. No v2 stored profiles until SAFETY sign-off.
- Cost: watch per-school tokens (tutor ~20–30k in-context per turn);
  semantic cache + small-model routing before scaling grades.
