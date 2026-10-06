import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import { cookies } from 'next/headers';
import { getNoticeList } from '../../../api/notices';
import ReadList from '../../../components/learning/ReadList';
// ========================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Notices" },
];
// ========================================================================================
export default async function NoticesPage({ params }) {
  // ========================================================================================
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid')?.value;
  const cookyId = cookieStore.get('id')?.value;
  // ========================================================================================
  let payload = null;
  let error = null;
  try {
    payload = await getNoticeList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId);
  } catch (e) {
    error = e?.message || "Load failed";
  }
  // ========================================================================================
  return (
    <Layout>
      <div className="min-h-[calc(100vh-100px)] p-6 space-y-6">
        <Breadcrumbs items={breadcrumbs} />
        <ReadList title="Notices" subtitle="School notices and circulars." payload={payload} error={error} />
      </div>
    </Layout>
  );
};
// ========================================================================================
