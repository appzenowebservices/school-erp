
import StaffMangementDashboard from '../../../components/staffManagement/dashboard';
import { getStudentList } from '../../../api/student';
import { cookies } from 'next/headers';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import Layout from '../../../layouts/Layout';
// =============================================================

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Staff" },
];

// =============================================================
export default async function StudentProfile({ params }) {
  // =============================================================
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value
  // -----------------------------------------------------------
  const standardListData = await getStudentList(
    resolvedParams.profile,
    resolvedParams.session,
    cookyGuid,
    cookyId
  )
  // =============================================================
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
        <StaffMangementDashboard
          students={standardListData?.results?.students}
          profile={resolvedParams?.profile}
          session={resolvedParams?.session}
          school={resolvedParams?.school}
          cookyGuid={cookyGuid}
          cookyId={cookyId}
        />
      </div>
    </Layout>
  );
};
// =============================================================