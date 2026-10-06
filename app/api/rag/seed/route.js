import fs from "node:fs";
import path from "node:path";
import { ragAuth, isStudentLogin, runRag } from "../../../../lib/rag";

// Sample-dataset seeding for demos: reads the curated docs under
// `ai-agent/testdata/<dir>/` and ingests them into the CURRENT tenant
// through the same contract as /api/rag/library. Titles already present
// in the tenant are skipped, so clicking twice is harmless.

const TESTDATA_DIR = path.join(process.cwd(), "ai-agent", "testdata");

function readManifest() {
  try {
    const raw = fs.readFileSync(path.join(TESTDATA_DIR, "manifest.json"), "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data?.datasets) ? data.datasets : [];
  } catch {
    return [];
  }
}

function parseFrontmatter(text) {
  const meta = {};
  let body = text;
  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1) {
      for (const line of text.slice(3, end).trim().split("\n")) {
        const i = line.indexOf(":");
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      }
      body = text.slice(end + 4).trim();
    }
  }
  return { meta, body };
}

// GET /api/rag/seed → { datasets: [{id,label,description,board,grade,subject,docs}] }
export async function GET() {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  const datasets = readManifest().map((d) => {
    let docs = 0;
    try {
      docs = fs.readdirSync(path.join(TESTDATA_DIR, d.dir)).filter((f) => f.endsWith(".md")).length;
    } catch { /* dir missing */ }
    return {
      id: d.id, label: d.label, description: d.description,
      board: d.board, grade: d.grade, subject: d.subject, docs,
    };
  });
  return Response.json({ datasets });
}

// POST /api/rag/seed { client_id, dataset } → ingest into that tenant
export async function POST(req) {
  const auth = await ragAuth();
  if (!auth) return Response.json({ error: "not_authenticated" }, { status: 401 });
  if (isStudentLogin(auth.id)) {
    return Response.json({ error: "staff_only" }, { status: 403 });
  }
  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { client_id, dataset } = body;
  if (!client_id || !dataset) {
    return Response.json({ error: "client_dataset_required" }, { status: 400 });
  }
  const ds = readManifest().find((d) => d.id === dataset);
  if (!ds) return Response.json({ error: "unknown_dataset" }, { status: 404 });

  const dir = path.join(TESTDATA_DIR, ds.dir);
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  } catch {
    return Response.json({ error: "dataset_missing_on_disk" }, { status: 404 });
  }

  // Skip docs whose title already exists for this tenant (idempotent seeding).
  const existingTitles = new Set();
  try {
    const list = await runRag(["list", "--school", client_id]);
    for (const d of list.docs || []) existingTitles.add(d.title);
  } catch { /* list failure shouldn't block seeding */ }

  const ingested = [];
  const skipped = [];
  const failed = [];
  for (const fname of files) {
    const { meta, body: text } = parseFrontmatter(fs.readFileSync(path.join(dir, fname), "utf-8"));
    const title = meta.title || fname;
    if (existingTitles.has(title)) {
      skipped.push(title);
      continue;
    }
    try {
      const out = await runRag(["ingest"], JSON.stringify({
        school_id: client_id,
        title,
        text,
        subject: meta.subject || ds.subject || "",
        grade: meta.grade || ds.grade || "",
        board: meta.board || ds.board || "",
        audience: meta.audience || "both",
        owner_id: auth.id,
      }));
      if (out?.error) throw new Error(out.error);
      ingested.push({ file: fname, title, doc_id: out.doc_id, chunks: out.chunks });
    } catch (e) {
      failed.push({ file: fname, error: String(e?.message || e).slice(0, 200) });
    }
  }

  return Response.json({
    dataset: ds.id,
    ingested: ingested.length,
    skipped: skipped.length,
    failed: failed.length,
    detail: { ingested, skipped, failed },
  });
}
