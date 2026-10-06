import { Suspense } from 'react';
import Layout from '../../../../layouts/Layout';
import { Breadcrumbs } from '../../../../components/ui/Breadcrumb/breadcrumb';
import MasteryTool from '../../../../components/learning/teach/MasteryTool';
// ========================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Hub", href: "/dashboard" },
  { label: "Class Mastery Map" },
];
// ========================================================================================
export default async function MasteryPage() {
  // ========================================================================================
  return (
    <Layout>
      <div className="min-h-[calc(100vh-100px)] space-y-5">
        <Breadcrumbs items={breadcrumbs} />

        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)] p-4 sm:p-5">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 border border-blue-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] text-sm font-extrabold">
              MM
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">AI HUB • TEACH WITH AI</p>
              <h1 className="mt-1 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Class Mastery Map
              </h1>
              <p className="mt-1 text-[13px] font-medium text-slate-500 leading-snug">
                Bucket your class by mastery, get a reteach move per bucket — roll numbers only.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-400">Loading…</div>}>
          <MasteryTool />
        </Suspense>
      </div>
    </Layout>
  );
};
// ========================================================================================
