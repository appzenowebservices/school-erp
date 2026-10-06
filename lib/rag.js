// Shared RAG bridge — portable contract for the RAG Lab and ERP pages.
// Browser -> Next route -> `ai-agent/erp-ops/rag_store.py` (CLI over stdio).
// Backend picks itself: `vector_DB` set = central Postgres, else SQLite file.
// Tenant = school (client_id); coaching-centre reuse maps tenant 1:1.
//
// All functions are server-only (node:child_process, cookies).

import { cookies } from "next/headers";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

/**
 * spawn-based capture. NOTE: execFile's `input` option is broken in some
 * Windows environments (fails for every binary, empty stderr), so stdin is
 * written manually — verified working where execFile+input is not.
 */
function runCapture(bin, args, { input, timeout, maxBuffer }) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "", stderr = "", killed = false;
    const timer = setTimeout(() => {
      killed = true;
      child.kill();
      const e = new Error(`rag_store timeout after ${timeout}ms`);
      e.stdout = stdout; e.stderr = stderr;
      reject(e);
    }, timeout);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxBuffer) { child.kill(); }
    });
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("error", (e) => {
      clearTimeout(timer);
      e.stdout = stdout; e.stderr = stderr;
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (killed) return; // timeout already rejected
      if (code === 0) return resolve({ stdout, stderr });
      const e = new Error(`Command failed: ${bin} ${args.join(" ")}\n${stderr}`);
      e.code = code; e.stdout = stdout; e.stderr = stderr;
      reject(e);
    });
    if (input !== undefined) {
      child.stdin.on("error", () => {}); // EPIPE after kill is expected
      child.stdin.end(input);
    }
  });
}

export const RAG_SCRIPT = path.join(process.cwd(), "ai-agent", "erp-ops", "rag_store.py");
export const RAG_MAX_TEXT = 200_000;
export const RAG_TIMEOUT = 60_000;

export function pyCandidates() {
  // NOTE: real python binaries first. The Windows `py` launcher is LAST —
  // it mishandles piped stdin when spawned by Node (hangs / empty failures).
  if (process.platform === "win32") return [["python", []], ["python3", []], ["py", ["-3"]]];
  return [["python3", []], ["python", []]];
}

// Cached: first interpreter that actually runs (Store stubs exit non-zero).
let _probed = null;
async function pickPython() {
  if (_probed) return _probed;
  for (const [bin, prefix] of pyCandidates()) {
    try {
      const { stdout } = await execFileAsync(bin, [...prefix, "--version"], { timeout: 15000 });
      if (/Python 3\./.test(String(stdout))) {
        _probed = [bin, prefix];
        console.log(`rag: python interpreter -> ${(bin + " " + prefix.join(" ")).trim()}`);
        return _probed;
      }
    } catch { /* try next candidate */ }
  }
  throw new Error("rag_python_missing (no working python3 found)");
}

export function storeArgs() {
  return process.env.RAG_STORE_DIR ? ["--store", process.env.RAG_STORE_DIR] : [];
}

/** Run a rag_store.py subcommand. Returns parsed JSON. Throws on failure. */
export async function runRag(args, stdin, timeout = RAG_TIMEOUT) {
  const [bin, prefix] = await pickPython();
  try {
    const { stdout } = await runCapture(bin, [...prefix, RAG_SCRIPT, ...storeArgs(), ...args], {
      input: stdin,
      timeout,
      maxBuffer: 16 * 1024 * 1024,
    });
    return JSON.parse(stdout || "{}");
  } catch (e) {
    // execFile rejects on non-zero exit even when the CLI printed a JSON
    // error payload — surface that (plus stderr tail) instead of a bare
    // "Command failed", which hides the real cause.
    const out = String(e?.stdout || "");
    const errTail = String(e?.stderr || "").slice(-500);
    try {
      const data = JSON.parse(out || "{}");
      if (data?.error) throw new Error(String(data.error).slice(0, 300));
    } catch (parseErr) {
      if (parseErr?.message && !/Unexpected token|is not valid JSON/i.test(parseErr.message)) throw parseErr;
    }
    const detail = errTail || String(e?.message || e).slice(0, 300);
    throw new Error(`rag_store ${args[0] || ""} failed: ${detail}`.slice(0, 500));
  }
}

/** Cookie auth shared by all RAG routes. Returns { guid, id } or null. */
export async function ragAuth() {
  const cookieStore = await cookies();
  const guid = cookieStore.get("guid")?.value;
  const id = cookieStore.get("id")?.value;
  if (!guid || !id) return null;
  return { guid, id };
}

/** True when this login is a consented student (tutor pilot allowlist, non-"*" mode). */
export function isStudentLogin(id) {
  const raw = (process.env.TUTOR_CONSENT_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (raw.includes("*")) return false;
  return raw.includes(String(id));
}

/** Vector search scoped to one tenant. Never throws — returns [] on failure. */
export async function searchDocs({ school_id, query, audience, doc_ids, board, subject, top_k }) {
  const args = ["search",
    "--school", school_id,
    "--query", String(query || "").slice(0, 2000),
    "--top-k", String(top_k || process.env.RAG_TOP_K || 3),
    ...(audience ? ["--audience", audience] : []),
    ...(board ? ["--board", board] : []),
    ...(subject ? ["--subject", subject] : []),
    ...(doc_ids?.length ? ["--doc-ids", doc_ids.join(",")] : []),
  ];
  try {
    const data = await runRag(args, undefined, 15000);
    if (data?.error) return [];
    return Array.isArray(data?.results) ? data.results : [];
  } catch (e) {
    console.log("rag-search-skip", String(e?.message || e).slice(0, 120));
    return [];
  }
}

/** Build the [my-docs] injection block from retrieved hits. "" when none. */
export function buildDocsBlock(hits, budget = 4000) {
  if (!hits?.length) return "";
  const lines = [];
  for (const h of hits) {
    const text = String(h.text || "").slice(0, budget);
    if (!text) continue;
    budget -= text.length;
    const chunkNo = h.chunk ?? h.idx ?? 0;
    lines.push(`(doc:${h.doc_id} chunk:${chunkNo} from "${String(h.title || "").slice(0, 80)}")\n${text}`);
    if (budget <= 0) break;
  }
  if (!lines.length) return "";
  return [
    "[my-docs] Grounded context from the tenant's uploaded books/docs. Use it where",
    "relevant and cite doc_id:chunk for claims drawn from it. If it is irrelevant,",
    "ignore it and say UNALIGNED rather than forcing it in.",
    ...lines,
  ].join("\n");
}

/** Backend descriptor for status badges. { backend } e.g. postgres:host or sqlite:path. */
export async function ragBackend() {
  try {
    const data = await runRag(["init"]);
    return { backend: data?.backend || "unknown" };
  } catch (e) {
    return { backend: "unavailable", error: String(e?.message || e).slice(0, 160) };
  }
}
