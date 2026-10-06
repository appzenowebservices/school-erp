// Core memory layer bridge — ai-memory (Hindsight server) for every role.
// RAG uploads stay the verbatim grounding layer; this is the longitudinal
// layer (learner weaknesses, teacher preferences, parent comms, incidents).
//
// Identity IS the isolation: one BANK per (tenant, role, login):
//   bank = t-{tenant}-r-{role}-u-{loginId}   ([a-z0-9-], max 64 chars)
// Items carry tags [role, surface, run]; recall needs no tag filter because
// the bank itself is the boundary. Clients never send banks or tags — the
// server builds them from the session.
//
// Hindsight contract (canonical /v1/default prefix):
//   PUT  /v1/default/banks/{bank}                  (ensure, disposition per role)
//   POST /v1/default/banks/{bank}/memories         (retain, async:true = background)
//   POST /v1/default/banks/{bank}/memories/recall  (recall, budget-capped)
//   GET  /health                                   (public status)
//
// Graceful-off: every helper returns safe empties when HINDSIGHT_BASE_URL is
// unset or the server is unreachable, so pages work with memory disabled.

const MEM_TIMEOUT = Number(process.env.HINDSIGHT_TIMEOUT_MS || 12000);
const API_PREFIX = (process.env.HINDSIGHT_API_PREFIX || "/v1/default").replace(/\/$/, "");

export function memConfigured() {
  return Boolean((process.env.HINDSIGHT_BASE_URL || "").replace(/\/$/, ""));
}

function memHeaders() {
  const h = { "Content-Type": "application/json" };
  if (process.env.HINDSIGHT_API_KEY) h["Authorization"] = `Bearer ${process.env.HINDSIGHT_API_KEY}`;
  return h;
}

function memBase() {
  return (process.env.HINDSIGHT_BASE_URL || "").replace(/\/$/, "");
}

async function hsFetch(path, { method = "POST", body, timeout = MEM_TIMEOUT } = {}) {
  const base = memBase();
  if (!base) throw new Error("hindsight_unconfigured");
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(`${base}${API_PREFIX}${path}`, {
      method,
      signal: ctrl.signal,
      headers: memHeaders(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.detail || data?.error || `hindsight_${r.status}`);
    return data;
  } finally {
    clearTimeout(t);
  }
}

function slug(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "x";
}

/** Canonical identity for a login. role: teacher|student|parent|principal|admin|staff */
export function memIdentity({ tenant, role, loginId, surface, runId }) {
  const r = (role || "staff").toLowerCase();
  const bank = `t-${slug(tenant)}-r-${slug(r)}-u-${slug(loginId)}`.slice(0, 64);
  return {
    bank,
    role: r,
    surface: String(surface || "copilot").slice(0, 40),
    runId: runId ? String(runId).slice(0, 120) : undefined,
    tags: [`role:${r}`, `surface:${String(surface || "copilot").slice(0, 40)}`],
  };
}

// DispositionTraits are integers 0-5: skepticism, literalism, empathy.
const ROLE_DISPOSITION = {
  student: { skepticism: 2, literalism: 3, empathy: 5 },
  teacher: { skepticism: 3, literalism: 4, empathy: 3 },
  parent: { skepticism: 3, literalism: 3, empathy: 4 },
  principal: { skepticism: 4, literalism: 4, empathy: 2 },
  admin: { skepticism: 4, literalism: 4, empathy: 2 },
  staff: { skepticism: 3, literalism: 3, empathy: 3 },
};
const ROLE_MISSION = {
  student: "Socratic tutoring memory: what the student knows, where they stumble, and how they learn best.",
  teacher: "Teaching memory: class preferences, correction history, and reusable style.",
  parent: "Parent communication memory: digest-level notes about their own child only.",
  principal: "School leadership memory: de-identified aggregates, roll numbers and counts only.",
  admin: "Operations memory: school setup, pilot scope, and rollout notes.",
  staff: "Staff working memory: ops context and drafts.",
};

// Best-effort bank ensure (server auto-creates on first retain; this only
// sets the role disposition traits + mission). Cached per process.
const _ensured = new Set();
async function ensureBank(identity) {
  if (_ensured.has(identity.bank)) return;
  _ensured.add(identity.bank);
  try {
    await hsFetch(`/banks/${encodeURIComponent(identity.bank)}`, {
      method: "PUT",
      body: {
        disposition: ROLE_DISPOSITION[identity.role] || ROLE_DISPOSITION.staff,
        mission: ROLE_MISSION[identity.role] || ROLE_MISSION.staff,
      },
      timeout: 8000,
    });
  } catch {
    // Auto-create on first retain covers us.
  }
}

/** Recall: memories for this bank + query. Never throws. */
export async function recallMemories({ identity, query, top_k = 5, threshold } = {}) {
  if (!memConfigured() || !identity?.bank) return [];
  void threshold; // Hindsight ranks by budget; threshold kept for signature compat.
  try {
    const k = Math.max(1, Math.min(Number(top_k) || 5, 10));
    const data = await hsFetch(`/banks/${encodeURIComponent(identity.bank)}/memories/recall`, {
      body: {
        query: String(query || "").slice(0, 2000),
        budget: k <= 3 ? "low" : "mid",
        max_tokens: 1500,
      },
    });
    const results = Array.isArray(data?.results) ? data.results : [];
    return results
      .map((m) => ({
        id: m.id,
        text: m.text || m.memory || "",
        score: m.score ?? m.relevance ?? undefined,
        created_at: m.occurred_start || m.created_at,
      }))
      .filter((m) => m.text);
  } catch (e) {
    console.log("memory-recall-skip", String(e?.message || e).slice(0, 120));
    return [];
  }
}

/** Build the [memory] injection block. "" when nothing recalled. */
export function buildMemoryBlock(memories) {
  if (!memories?.length) return "";
  const lines = memories.slice(0, 5).map((m) => `- ${String(m.text).slice(0, 500)}`);
  return [
    "[memory] Long-term context about this user from prior sessions. Use it to",
    "personalize (weaknesses first, preferences honored). If it conflicts with",
    "uploaded docs or the chapter, docs/chapter win. Never reveal other users.",
    ...lines,
  ].join("\n");
}

/**
 * Store a turn. Fire-and-forget from routes (don't await on the hot path).
 * mode: HINDSIGHT_WRITE_MODE=all → synchronous retain; batched (default) →
 * background retain (async:true); off → no writes. Student items are tagged
 * retention:90d for the prune job (tutor retention policy).
 */
export function storeMemory({ identity, userText, assistantText, role } = {}) {
  if (!memConfigured() || !identity?.bank) return;
  if (process.env.HINDSIGHT_WRITE_MODE === "off") return;
  const r = role || identity.role;
  const content = [
    `User (${r}): ${String(userText || "").slice(0, 2000)}`,
    assistantText ? `Assistant: ${String(assistantText).slice(0, 2000)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  if (!content.trim()) return;
  const tags = [...identity.tags];
  if (identity.runId) tags.push(`run:${identity.runId.slice(0, 24)}`);
  if (r === "student") tags.push("retention:90d");
  ensureBank(identity)
    .catch(() => {})
    .then(() =>
      hsFetch(`/banks/${encodeURIComponent(identity.bank)}/memories`, {
        body: {
          items: [
            {
              content,
              context: identity.surface,
              ...(identity.runId ? { document_id: identity.runId } : {}),
              metadata: { tenant_role: r },
              tags,
            },
          ],
          async: process.env.HINDSIGHT_WRITE_MODE !== "all",
        },
        timeout: 8000,
      })
    )
    .catch((e) => console.log("memory-store-skip", String(e?.message || e).slice(0, 120)));
}

/** Status for badges. Never throws. */
export async function memStatus() {
  const base = memBase();
  if (!base) return { configured: false, status: "disabled", reason: "unconfigured" };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(`${base}/health`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(`health_${r.status}`);
    return { configured: true, status: "active", base };
  } catch (e) {
    return { configured: true, status: "disabled", reason: "core_offline", detail: String(e?.message || e).slice(0, 120) };
  }
}
