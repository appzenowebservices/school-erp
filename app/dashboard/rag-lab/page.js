import { Suspense } from 'react';
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import RagLab from '../../../components/rag/RagLab';
// ========================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "RAG Lab" },
];
// ========================================================================================
export default async function RagLabPage() {
  // ========================================================================================
  return (
    <Layout>
      <div className="min-h-[calc(100vh-100px)] space-y-5">
        <Breadcrumbs items={breadcrumbs} />

        {/* Page header — same bold professional language as sidebar */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-900 text-white shadow-[0_8px_20px_-10px_rgba(15,23,42,0.8)] text-lg font-extrabold">
                RL
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">STANDALONE • PORTABLE RAG</p>
                <h1 className="mt-1 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  RAG Lab
                </h1>
                <p className="mt-1 text-[13px] font-medium text-slate-500 leading-snug">
                  Upload, index, search-test, grounding-test and eval-gate the tenant vector store — no LLM turn spent until you draft.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-extrabold tracking-wide text-blue-800">CENTRAL POSTGRES</span>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold tracking-wide text-slate-600">BROWSER-SIDE PARSING</span>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-extrabold tracking-wide text-slate-600">EVAL GATE ≥ 0.95</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {[
                { n: '1', t: 'Upload' },
                { n: '2', t: 'Test' },
                { n: '3', t: 'Ground' },
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

        <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-400">Loading lab…</div>}>
          <RagLab />
        </Suspense>
      </div>
    </Layout>
  );
};
// ========================================================================================
