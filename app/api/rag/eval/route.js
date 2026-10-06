import { ragAuth, searchDocs } from "../../../../lib/rag";

// POST /api/rag/eval { client_id, top_k?, cases: [{ query, expected_doc, board?, subject?, audience? }] }
// → { cases, hits, accuracy, detail } — pilot gate is accuracy ≥ 0.95.
export async function POST(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, cases, top_k } = body;
  if (!client_id || !Array.isArray(cases) || cases.length === 0 || cases.length > 50) {
    return Response.json({ error: "client_cases_required" }, { status: 400 });
  }
  let hits = 0;
  const detail = [];
  for (const c of cases.slice(0, 50)) {
    const res = await searchDocs({
      school_id: client_id,
      query: c.query || "",
      top_k: Math.max(1, Math.min(Number(top_k) || 3, 8)),
      board: c.board || undefined,
      subject: c.subject || undefined,
      audience: c.audience || undefined,
    });
    const ok = res.some((r) => r.doc_id === c.expected_doc);
    if (ok) hits++;
    detail.push({
      query: String(c.query || "").slice(0, 80),
      expected: c.expected_doc,
      got: res.map((r) => r.doc_id),
      hit: ok,
    });
  }
  return Response.json({
    cases: detail.length,
    hits,
    accuracy: detail.length ? Math.round((hits / detail.length) * 10000) / 10000 : 0,
    detail,
  });
}
