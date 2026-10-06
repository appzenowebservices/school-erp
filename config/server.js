// ERP endpoints — env-driven so the app never hard-codes the live host and can
// point at the local test stub during development.
//
//   NEXT_PUBLIC_API_BASE_URL     e.g. http://127.0.0.1:4010  (POST /api RPCs)
//   NEXT_PUBLIC_PORTAL_BASE_URL  e.g. http://127.0.0.1:4010  (file downloads)
//
// Defaults are LOCAL: no traffic can reach production unless the env sets it.
const trim = (v) => String(v || "").replace(/\/+$/, "");

export const API_BASE_URL =
  trim(process.env.NEXT_PUBLIC_API_BASE_URL) || "http://127.0.0.1:4010";

export const PORTAL_BASE_URL =
  trim(process.env.NEXT_PUBLIC_PORTAL_BASE_URL) || API_BASE_URL;
