import { cookies } from "next/headers";

// GET /api/ai/status → { status: 'active' | 'disabled', provider, model, reason }
// Server-side only. Never exposes keys (core returns env var NAMES at most).
// Short timeout + 30s cache so every dashboard render doesn't hammer the core.

let cache = { at: 0, data: null };
const TTL = 30_000;

export async function GET() {
  const cookieStore = await cookies();
  if (!cookieStore.get("guid")?.value || !cookieStore.get("id")?.value) {
    return Response.json({ status: "disabled", reason: "not_authenticated" }, { status: 401 });
  }
  if (Date.now() - cache.at < TTL && cache.data) {
    return Response.json(cache.data);
  }

  const base = (process.env.AI_CORE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "");
  const mode = process.env.AI_CORE_MODE || "hermes";
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    if (mode === "openai") {
      const r = await fetch(`${base}/v1/models`, {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${process.env.AI_CORE_KEY || ""}` },
      });
      const data = r.ok
        ? { status: "active", provider: process.env.AI_CORE_MODEL || "hermes-agent", model: "", reason: "" }
        : { status: "disabled", provider: "", model: "", reason: r.status === 401 ? "no_provider" : "core_offline" };
      cache = { at: Date.now(), data };
      return Response.json(data);
    }
    const r = await fetch(`${base}/api/v1/provider-status`, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`core_${r.status}`);
    const data = await r.json();
    const out = data?.configured
      ? { status: "active", provider: data.provider || "", model: data.model || "", reason: "" }
      : { status: "disabled", provider: data?.provider || "", model: data?.model || "", reason: "no_provider" };
    cache = { at: Date.now(), data: out };
    return Response.json(out);
  } catch {
    const out = { status: "disabled", provider: "", model: "", reason: "core_offline" };
    cache = { at: Date.now(), data: out };
    return Response.json(out);
  } finally {
    clearTimeout(t);
  }
}
