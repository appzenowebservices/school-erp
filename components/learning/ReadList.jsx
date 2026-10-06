'use client';

// Shared thin read-surface: renders any ERP list payload as a plain table.
// Best-effort columns from row keys (first 6 scalar fields). No writes.
function rowsOf(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const k of ["results", "data", "list", "rows", "items"]) {
    const v = payload[k];
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") {
      for (const k2 of ["results", "list", "data", "rows"]) {
        if (Array.isArray(v[k2])) return v[k2];
      }
    }
  }
  return [];
}

function cell(v) {
  if (v == null) return "—";
  if (typeof v === "object") return Array.isArray(v) ? `${v.length} items` : "…";
  const s = String(v);
  return s.length > 80 ? s.slice(0, 80) + "…" : s;
}

export default function ReadList({ title, subtitle, payload, error }) {
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-6 text-sm text-red-600">
        Could not load {title}: {error}
      </div>
    );
  }
  const rows = rowsOf(payload).filter((r) => r && typeof r === "object");
  if (!rows.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-[#0f345a]">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        <p className="text-sm text-gray-400 mt-4">No records found.</p>
      </div>
    );
  }
  const cols = Object.keys(rows[0]).filter((k) => {
    const v = rows[0][k];
    return v == null || ["string", "number", "boolean"].includes(typeof v);
  }).slice(0, 6);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden">
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-[#0f345a]">{title}</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#e7f2fe] text-[#15487d] font-semibold">
          {rows.length} shown
        </span>
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              {cols.map((c) => (
                <th key={c} className="py-2 pr-4 font-semibold capitalize">{c.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((r, i) => (
              <tr key={i} className="border-b border-gray-50 text-gray-700">
                {cols.map((c) => (
                  <td key={c} className="py-2 pr-4">{cell(r[c])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
