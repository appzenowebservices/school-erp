import { Suspense } from 'react';
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import WorksheetBuilder from '../../../components/learning/WorksheetBuilder';
// ========================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Hub", href: "/dashboard" },
  { label: "Worksheet Builder" },
];
// ========================================================================================
export default async function WorksheetsPage() {
  // ========================================================================================
  return (
    <Layout>
      <div className="min-h-[calc(100vh-100px)] space-y-5">
        <Breadcrumbs items={breadcrumbs} />

        {/* Page header — same bold professional language as sidebar */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 border border-blue-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] text-lg font-extrabold">
                WS
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">AI HUB • TEACH WITH AI</p>
                <h1 className="mt-1 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Worksheet Builder
                </h1>
                <p className="mt-1 text-[13px] font-medium text-slate-500 leading-snug">
                  Set the spec, generate a balanced paper + answer key, review on screen, then save or print.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-extrabold tracking-wide text-blue-800">AI PAPER + KEY</span>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold tracking-wide text-slate-600">CLASS • SUBJECT • CHAPTER</span>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold tracking-wide text-slate-600">PRINT READY</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {[
                { n: '1', t: 'Spec' },
                { n: '2', t: 'Generate' },
                { n: '3', t: 'Print' },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  {i > 0 && <span className="h-px w-4 bg-slate-200" />}
                  <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-extrabold ${i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{s.n}</span>
                    <span className="text-[12px] font-bold text-slate-700">{s.t}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-400">Loading builder…</div>}>
          <WorksheetBuilder />
        </Suspense>
      </div>
    </Layout>
  );
};
// ========================================================================================
