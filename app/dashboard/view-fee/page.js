
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import ViewFee from '../../../components/OnlineFee/viewFee';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ========================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "View Fee" },
];
// ========================================================================================

export default async function ViewFeeManagement() {
  const cookieStore = cookies();

  const cookyGuid = cookieStore.get('guid')?.value;
  const cookyId = cookieStore.get('id')?.value;

  if (!cookyGuid || !cookyId) {
    redirect('/login');
  }

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
        <ViewFee />
      </div>
    </Layout>
  );
};

// ========================================================================================
