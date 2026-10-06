import { ragAuth, ragBackend, runRag } from "../../../../lib/rag";

// GET /api/rag/status?client_id=... → { backend, topK, docs, chunks }
export async function GET(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  const client_id = new URL(req.url).searchParams.get("client_id");
  const status = await ragBackend();
  let docs = null, chunks = 0;
  if (client_id) {
    try {
      const data = await runRag(["list", "--school", client_id]);
      const list = Array.isArray(data.docs) ? data.docs : [];
      docs = list.length;
      chunks = list.reduce((n, d) => n + (d.chunks || 0), 0);
    } catch { /* counts optional */ }
  }
  return Response.json({
    ...status,
    topK: Number(process.env.RAG_TOP_K || 3),
    docs,
    chunks,
  });
}
