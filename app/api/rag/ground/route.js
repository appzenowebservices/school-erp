import { ragAuth, searchDocs, buildDocsBlock } from "../../../../lib/rag";
import { memIdentity, recallMemories, buildMemoryBlock } from "../../../../lib/memory";

// POST /api/rag/ground { client_id, query, audience?, doc_ids?, board?, subject?, memory? }
// → { block, hits, memoryBlock } — the exact [my-docs] (+ optional [memory])
// blocks /api/ai/chat would inject. Lets the Lab preview grounding without
// spending an LLM turn.
export async function POST(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, query, audience, doc_ids, board, subject, memory } = body;
  if (!client_id || !String(query || "").trim()) {
    return Response.json({ error: "client_query_required" }, { status: 400 });
  }
  const hits = await searchDocs({
    school_id: client_id,
    query,
    audience: audience || undefined,
    doc_ids: Array.isArray(doc_ids) ? doc_ids.filter((d) => typeof d === "string").slice(0, 12) : undefined,
    board: board || undefined,
    subject: subject || undefined,
  });
  let memoryBlock = "";
  if (memory) {
    const role = audience === "student" ? "student" : "staff";
    const memories = await recallMemories({
      identity: memIdentity({ tenant: client_id, role, loginId: auth.id, surface: "lab" }),
      query,
      top_k: 5,
    });
    memoryBlock = buildMemoryBlock(memories);
  }
  const parts = [buildDocsBlock(hits), memoryBlock].filter(Boolean);
  return Response.json({ block: parts.join("\n"), hits, memoryBlock });
}
