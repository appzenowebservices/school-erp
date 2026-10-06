import { cookies } from "next/headers";
import { memIdentity, storeMemory, memConfigured } from "../../../../lib/memory";

const ROLES = new Set(["teacher", "student", "parent", "principal", "admin", "staff"]);

// POST /api/memory/add { client_id, text, role?, surface?, run_id? }
// Explicit manual write (the chat route writes turns itself). Student writes
// require tutor consent allowlist membership — same lock as tutor chat.
export async function POST(req) {
  const cookieStore = await cookies();
  const id = cookieStore.get("id")?.value;
  if (!cookieStore.get("guid")?.value || !id) {
    return Response.json({ error: "not_authenticated" }, { status: 401 });
  }
  if (!memConfigured()) return Response.json({ error: "memory_disabled" }, { status: 503 });
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, text, role, surface, run_id } = body;
  if (!client_id || !String(text || "").trim()) {
    return Response.json({ error: "client_text_required" }, { status: 400 });
  }
  const r = ROLES.has(String(role || "").toLowerCase()) ? String(role).toLowerCase() : "staff";
  if (r === "student") {
    const raw = (process.env.TUTOR_CONSENT_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (!(raw.includes("*") || raw.includes(String(id)))) {
      return Response.json({ error: "tutor_consent_required" }, { status: 403 });
    }
  }
  storeMemory({
    identity: memIdentity({
      tenant: client_id, role: r, loginId: id,
      surface: String(surface || "copilot").slice(0, 40),
      runId: run_id ? String(run_id).slice(0, 120) : undefined,
    }),
    userText: text,
    role: r,
  });
  return Response.json({ queued: true });
}
