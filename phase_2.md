# Phase 2 — Central AI Agentic Infra Core + ERP Integration

> Status: IMPLEMENTED (P0+P1 done, P2 pilot-ready, P3 guardrails documented).
> Live-API safety: read-only paged tools, 4 zero-API tools, user-triggered runs.
> School ERP talks to it API-only. No direct DB calls — existing backend API (`https://api.infoeight.com/api`) stays the security boundary.

## Topology

```
Schools (ERP SaaS, embedded Copilot)
Sales/Ops (Hermes web/ :9119, internal/VPN only)  ─┐
                                                   ├→ Next.js Route Handler app/api/ai/* (injects guid/profileId/client_id)
                                                   └→ ai-agent standalone (gateway + :8642 Bearer + :8765 localhost)
                                                        ├→ state.db (agent memory only: transcripts, skills use, cron, kanban)
                                                        ├→ opencode-go/muse-spark (config.yaml today, full gateway, all tools gated)
                                                        └→ erp-mcp (stdio) → https://api.infoeight.com/api {api:"student.getList"...}
```

## P0 — erp-mcp (API-only, no DB)

* New `erp-mcp/` stdio MCP server. Env only: `ERP_API_BASE=https://api.infoeight.com/api`, timeouts. No secrets in `config.yaml`.
* 7 tools (JSON-string returns, per Hermes registry rule). Auth (`guid`, `logged_in_user_account_id`, `user_account_id=profileId`, `client_id=session`) passed per-call from Next.js, never stored:
  1. `erp_student_duplicates` — same parent name + phone matches (fixes sheet 2a).
  2. `erp_excel_audit` — missing SMS numbers, duplicate names, setup gaps (fixes sheet 5a).
  3. `erp_working_days_check` — per-class working-days mismatch (fixes sheet 5b).
  4. `erp_fee_defaulters` — defaulters + draft letter/SMS Hindi/English (sheet 2b).
  5. `erp_login_issues` — parent login triage (sheet 6a).
  6. `erp_ticket_diagnose` — generic support ticket → diagnosis + fix steps + school reply draft.
  7. `erp_navigate` — natural-language → ERP deep-link (reduces clicks, sheet 1 header + 4a/4b).
* Register in `ai-agent/config.yaml`:
  ```yaml
  mcp_servers:
    erp:
      command: "node"   # or "python"
      args: ["<abs-path>/erp-mcp/dist/index.js", "--stdio"]
      timeout: 180
      intent_domains: ["student duplicate", "fee defaulter", "working days", "parent login", "excel audit", "where is"]
  ```
* Verify: `hermes mcp serve` lists erp tools; `hermes tools` shows `erp` toolset.

## P1 — Skills + proxy + internal demo

* 3 skills first (1+2+5 priority), `SKILL.md` standard (description ≤60c, `house`+`domains`, When-to-Use / Prerequisites naming MCP `erp` / Procedure / Verification; scripts in `scripts/`, refs in `references/`):
  * `skills/erp-ticket-solver/SKILL.md`
  * `skills/erp-excel-audit/SKILL.md`
  * `skills/erp-morning-digest/SKILL.md`
* Next.js bridge (new, ERP repo side):
  * `app/api/ai/chat/route.js` — server-side proxy to `http://ai-core:8642/v1/chat/completions` (Bearer `API_SERVER_KEY`) or `:8765/api/v1/chat/sync`; injects `guid/profileId/client_id` from cookies + `dashboardContext`; streams SSE to UI; redacts PII in logs; per-school rate/cost headers.
  * `components/ai/Copilot.jsx` — embedded Ask box + Cmd-K, context = `dashboardConfig` + route; actions: navigate, explain, draft.
* Internal console: keep Hermes `web/` as-is (`Chat/Sessions/Skills/Models/Cron/Mcp/Analytics/Logs`) on `:9119` localhost + VPN, ephemeral token + basic-auth. Sales demos on `Chat`, ops debugs on `Sessions/Logs`.

## P2 — Cron / Kanban pilot (1 school)

* Cron morning-digest per school: `skills:[erp-morning-digest]`, `model: opencode-go/muse-spark`, delivery to ops channel + school inbox. 3-min hard interrupt respected.
* Kanban board for March changeover: promotion preview + optional-subject carry (IX-A maths case) + fee-link check, `failure_limit:2`, human approve.
* Delegation as configured today: `max_concurrent_children:3`, `max_spawn_depth:1`.
* Eval set built from `LLM integration.xlsx` rows 1+2+5; pilot 1 school, thumbs + cost tracked.

## P3 — Harden + expand to all 6

* Ports: `:8765` localhost only (open auth, `CORS *` today) → never public. `:8642` Bearer + `CORS_ORIGINS=[erp domain]`. `:9119` localhost + VPN + session token.
* Tools: keep all Hermes tools installed but prod-gated via `config.yaml` — `terminal.backend: docker`, `approvals.mode: manual`, `command_allowlist` ERP-safe only, `security.redact_secrets:true`, `tirith_enabled:true`, `allow_private_urls:false`.
* State: `state.db` agent-only; `sessions.auto_prune retention_days:90` + vacuum; ERP rows never persisted in agent DB (stateless re ERP).
* Cost: `prompt_caching` sacred (no mid-loop toolset swap), `compression` on, `tool_output` caps (50kB/2000 lines as today), `show_cost:true`, per-school budgets in Analytics.
* Add remaining skills same pattern: `erp-promotion-carry`, `erp-marks-guardian`, `erp-fee-recovery`.

## Non-goals

* No direct Postgres/Mongo access from AI core. No secrets in `config.yaml` (`.env`/env only). No school feature pages built inside Hermes `web/` — schools use embedded ERP UI only.
