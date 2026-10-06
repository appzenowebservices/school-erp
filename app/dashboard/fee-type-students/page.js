
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import { cookies } from 'next/headers';
import FeeTypeStudents from '../../../components/OnlineFee/FeeTypeStudents';
// ========================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Student Fee Type" },
];
// ========================================================================================

export default async function FeeTypesManagement({ params }) {


  // =============================================================
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value
  // -----------------------------------------------------------





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
        <FeeTypeStudents />
      </div>
    </Layout>
  );
};

