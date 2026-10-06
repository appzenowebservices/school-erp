import { ragAuth, searchDocs } from "../../../../lib/rag";

// POST /api/rag/search { client_id, query, top_k?, board?, subject?, audience?, doc_ids? }
// → { results: [{ doc_id, title, chunk, score, text }] }
export async function POST(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, query, top_k, board, subject, audience, doc_ids } = body;
  if (!client_id || !String(query || "").trim()) {
    return Response.json({ error: "client_query_required" }, { status: 400 });
  }
  const results = await searchDocs({
    school_id: client_id,
    query,
    audience: audience || undefined,
    doc_ids: Array.isArray(doc_ids) ? doc_ids.filter((d) => typeof d === "string").slice(0, 12) : undefined,
    board: board || undefined,
    subject: subject || undefined,
    top_k: Math.max(1, Math.min(Number(top_k) || 3, 8)),
  });
  return Response.json({ results });
}
