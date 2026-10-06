
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import { cookies } from 'next/headers';
import FeeManagementDashboard from '../../../components/OnlineFee/dashboard';
// ========================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Fee Summary" },
];
// ========================================================================================
export default async function FeeSummaryManagement({ params }) {
  // ========================================================================================
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value
  // ========================================================================================
  return (
    <Layout>
      <div
        className="min-h-[calc(100vh-100px)] p-6 space-y-6"
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Breadcrumbs items={breadcrumbs} />
        <FeeManagementDashboard
          profile={resolvedParams.profile}
          session={resolvedParams.session}
          school={resolvedParams.school}
          cookyGuid={cookyGuid}
          cookyId={cookyId}
        />
      </div>
    </Layout>
  );
};
// ========================================================================================