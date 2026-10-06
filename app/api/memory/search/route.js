import { cookies } from "next/headers";
import { memIdentity, recallMemories } from "../../../../lib/memory";

const ROLES = new Set(["teacher", "student", "parent", "principal", "admin", "staff"]);

// POST /api/memory/search { client_id, query, role?, surface?, top_k? }
// Identity + filters are built server-side from the session — the client
// only names a role, which is validated here.
export async function POST(req) {
  const cookieStore = await cookies();
  const id = cookieStore.get("id")?.value;
  if (!cookieStore.get("guid")?.value || !id) {
    return Response.json({ error: "not_authenticated" }, { status: 401 });
  }
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, query, role, surface, top_k } = body;
  if (!client_id || !String(query || "").trim()) {
    return Response.json({ error: "client_query_required" }, { status: 400 });
  }
  const r = ROLES.has(String(role || "").toLowerCase()) ? String(role).toLowerCase() : "staff";
  const identity = memIdentity({
    tenant: client_id,
    role: r,
    loginId: id,
    surface: String(surface || "copilot").slice(0, 40),
  });
  const results = await recallMemories({ identity, query, top_k });
  return Response.json({ results });
}
