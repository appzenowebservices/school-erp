import { cookies } from "next/headers";
// import FeeDetails from "@/components/fees/FeeDetails";
// import { getFeeDetails } from "@/api/fees";
import FeeDetails from "../../../../components/OnlineFee/FeeDetails";
import { getFeeTypeDetail } from "../../../../api/fees";
import Layout from "../../../../layouts/Layout";
import Breadcrumbs from "../../../../components/ui/Breadcrumb/breadcrumb";
// =====================================================================================
const breadcrumbs = [
  { label: "Dashboard", href: "/" },
  { label: "Fee Types", href: "/dashboard/view-fee" },
  { label: "Fee Type Details" },
];
export default async function FeeDetailsPage({ params }) {
  const { id } = params;



  return (
    <>
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

          <FeeDetails id={id} />
        </div>
      </Layout>

    </>
  );
}
