import { ragAuth, isStudentLogin, runRag, RAG_MAX_TEXT } from "../../../../lib/rag";
import { memIdentity, storeMemory } from "../../../../lib/memory";

// Portable library contract (tenant = school client_id).
// Students (consented IDs, non-"*" mode) may only ingest audience=student.

// GET /api/rag/library?client_id=... → { docs: [...] }
export async function GET(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  const client_id = new URL(req.url).searchParams.get("client_id");
  if (!client_id) return Response.json({ error: "context_required_client" }, { status: 400 });
  try {
    const data = await runRag(["list", "--school", client_id]);
    if (data?.error) throw new Error(data.error);
    return Response.json({ docs: data.docs || [] });
  } catch (e) {
    return Response.json({ error: String(e?.message || e).slice(0, 200) }, { status: 502 });
  }
}

// POST /api/rag/library { client_id, title, text, subject?, grade?, board?, audience? }
export async function POST(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, title, text, subject, grade, board, audience } = body;
  if (!client_id || !String(title || "").trim() || !String(text || "").trim()) {
    return Response.json({ error: "client_title_text_required" }, { status: 400 });
  }
  if (String(text).length > RAG_MAX_TEXT) {
    return Response.json({ error: "text_too_large" }, { status: 413 });
  }
  let aud = (audience || "both").toLowerCase();
  if (!["staff", "student", "both"].includes(aud)) aud = "both";
  if (isStudentLogin(auth.id) && aud !== "student") aud = "student";
  try {
    const data = await runRag(["ingest"], JSON.stringify({
      school_id: client_id,
      title: String(title).slice(0, 200),
      text,
      subject: subject || "",
      grade: grade || "",
      board: board || "",
      audience: aud,
      owner_id: auth.id,
    }));
    if (data?.error) throw new Error(data.error);
    // Awareness memory: staff channel learns what entered the library, so
    // future drafts know it exists. Fire-and-forget; memory off = skipped.
    storeMemory({
      identity: memIdentity({ tenant: client_id, role: "staff", loginId: auth.id, surface: "lab" }),
      userText: `School library published "${String(title).slice(0, 200)}" `
        + `(${(board || "").trim()} class ${(grade || "").trim()} ${(subject || "").trim()}, `
        + `audience ${aud}, ${data.chunks} chunks, doc ${data.doc_id}). `
        + `Ground relevant drafts in it and cite doc_id:chunk.`,
      role: "staff",
    });
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: String(e?.message || e).slice(0, 200) }, { status: 502 });
  }
}

// DELETE /api/rag/library { client_id, doc_id }
export async function DELETE(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, doc_id } = body;
  if (!client_id || !doc_id) return Response.json({ error: "client_doc_required" }, { status: 400 });
  try {
    const data = await runRag(["delete", "--school", client_id, "--doc", doc_id]);
    if (data?.error) throw new Error(data.error);
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: String(e?.message || e).slice(0, 200) }, { status: 502 });
  }
}
