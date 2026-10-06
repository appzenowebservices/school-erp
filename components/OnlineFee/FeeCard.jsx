// "use client";

// import { useState } from "react";
// import {
//   CheckCircle,
//   XCircle,
//   ChevronDown,
//   ReceiptText,
//   Calendar,
//   IndianRupee,
//   Clock,
//   CreditCard
// } from "lucide-react";
// import { getSessionCache } from "../../utils/sessionCache";

// interface FeeCardProps {
//   fee: {
//     id: string;
//     name: string;
//     fee_amount: number;
//     payment_status: string;
//     payment_date?: string;
//     due_date: string;
//     amount_per_param: Array<{
//       id: string;
//       name: string;
//       amount: number;
//     }>;
//   };
//   isPaid: boolean;
// }

// export default function FeeCard({ fee, isPaid, setShowPay, setSelectedFee }: FeeCardProps) {



//   const [expanded, setExpanded] = useState<string | null>(null);

//   const getStatusConfig = (isPaid: boolean, status: string) => {
//     if (isPaid) {
//       return {
//         badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
//         icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
//         button: "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100",
//         accent: "border-l-emerald-500"
//       };
//     }
//     return {
//       badge: "bg-rose-50 text-rose-700 border border-rose-200",
//       icon: <XCircle className="w-5 h-5 text-rose-600" />,
//       button: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
//       accent: "border-l-rose-500"
//     };
//   };

//   const statusConfig = getStatusConfig(isPaid, fee.payment_status);

//   return (
//     <div className={` group relative overflow-hidden rounded-xl bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 ${statusConfig.accent} border-l-4`}>
//       {/* Card Content */}
//       <div className="p-6">
//         {/* Header Section */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center space-x-2 mb-2">
//               <div className="p-1.5 bg-blue-50 rounded-lg">
//                 <IndianRupee className="w-4 h-4 text-blue-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 truncate">
//                 {fee.name}
//               </h3>
//             </div>

//             <div className="flex items-center space-x-1 text-sm text-gray-600">
//               <Calendar className="w-4 h-4" />
//               <span>
//                 {isPaid ? (
//                   <>Paid on <span className="font-medium">{fee.payment_date}</span></>
//                 ) : (
//                   <>Due by <span className="font-medium text-rose-600">{fee.due_date}</span></>
//                 )}
//               </span>
//             </div>
//           </div>

//           {/* Status Badge & Icon */}
//           <div className="flex items-center space-x-3 ml-4">
//             <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusConfig.badge}`}>
//               {fee.payment_status}
//             </span>
//             {statusConfig.icon}
//           </div>
//         </div>

//         {/* Amount & Action Section */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-baseline space-x-1">
//             <span className="text-2xl font-bold text-gray-900">
//               ₹{fee.fee_amount.toLocaleString('en-IN')}
//             </span>
//             <span className="text-sm text-gray-500">INR</span>
//           </div>

//           <button
//             onClick={() => {
//               setShowPay(true);
//               setSelectedFee(fee)
//             }} className={`cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${statusConfig.button}`}
//           >
//             {isPaid ? (
//               <>
//                 <ReceiptText className="cursor-pointer  w-4 h-4" />
//                 <span>View Receipt</span>
//               </>
//             ) : (
//               <>
//                 <CreditCard className="w-4 h-4" />
//                 <span>Pay Now</span>
//               </>
//             )}
//           </button>
//         </div>

//         {/* Expandable Breakdown */}
//         <div className="border-t border-gray-100 pt-4">
//           <button
//             className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 -m-1"
//             onClick={() => setExpanded(expanded === fee.id ? null : fee.id)}
//           >
//             <span>Fee Breakdown</span>
//             <ChevronDown
//               className={`w-4 h-4 transition-transform duration-200 ${expanded === fee.id ? "rotate-180" : ""
//                 }`}
//             />
//           </button>

//           {/* Breakdown Content */}
//           {expanded === fee.id && (
//             <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <div className="space-y-3">
//                 {fee.amount_per_param.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className={`flex items-center justify-between text-sm ${index !== fee.amount_per_param.length - 1 ? 'pb-3 border-b border-gray-200' : ''
//                       }`}
//                   >
//                     <span className="font-medium text-gray-700">{item.name}</span>
//                     <span className="font-semibold text-gray-900">
//                       ₹{item.amount.toLocaleString('en-IN')}
//                     </span>
//                   </div>
//                 ))}

//                 {/* Total */}
//                 <div className="pt-3 border-t-2 border-gray-300">
//                   <div className="flex items-center justify-between text-base font-bold">
//                     <span className="text-gray-900">Total Amount</span>
//                     <span className="text-blue-600">
//                       ₹{fee.fee_amount.toLocaleString('en-IN')}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Subtle Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ReceiptText,
  Calendar,
  IndianRupee,
  CreditCard
} from "lucide-react";
import SuccessStatus from "../ui/status/Success";
import { markStudentFee } from "../../api/fees";

export default function FeesWithSummary({ fees, isPaid, context, config, selectedFees, setSelectedFees, studentId }) {

  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log('loading', loading);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

  // toggle multi-select
  const toggleSelectFee = (fee) => {
    const exists = selectedFees?.find(f => f.id === fee.id);
    if (exists) {
      setSelectedFees(selectedFees?.filter(f => f.id !== fee.id));
    } else {
      setSelectedFees([...selectedFees, fee]);
    }
  };

  const totalAmount = selectedFees?.reduce(
    (sum, f) => sum + Number(f.fee_amount),
    0
  );


  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      fee_ids: selectedFees?.map(fee => fee.id),
      payment_mode_id: Number(paymentMode),
      amount: Number(totalAmount),
      student_id: studentId,
      date: paymentDate

    };

    try {
      // Actual API call
      console.log('============================', selectedFees, context?.profileId, context?.session, payload);
      const resp = await markStudentFee(context?.profileId, context?.session, payload);
      console.log('resp==================', resp?.data?.results?.message);
      if (resp?.data?.success) {
        setShowSuccess(true)
        setApiResponse(resp?.data?.results?.message);
      }
      // onSubmit?.(resp); // send response back to parent
      // onClose?.();

    } catch (err) {
      console.error('Payment failed:', err);
      // alert('Payment failed. Try again.');

    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="space-y-4">

      {/* ALL FEE CARDS */}
      {fees.map(fee => {
        const isPaid = fee.payment_status === "paid";

        const statusConfig = isPaid
          ? {
            badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
            button: "bg-gray-50 text-gray-700 border border-gray-200",
            accent: "border-l-emerald-500"
          }
          : {
            badge: "bg-rose-50 text-rose-700 border border-rose-200",
            icon: <XCircle className="w-5 h-5 text-rose-600" />,
            button: "bg-blue-600 text-white hover:bg-blue-700",
            accent: "border-l-rose-500"
          };

        return (
          <div
            key={fee.id}
            className={`relative overflow-hidden rounded-xl bg-white border-2 border-gray-100 transition-all duration-200 ${statusConfig.accent} hover:shadow-md`}
          >
            {/* Multi-select checkbox */}
            <div className="absolute top-4 right-4">
              <input
                type="checkbox"
                className="w-5 h-5 accent-blue-600 cursor-pointer"
                checked={selectedFees?.some(f => f?.id === fee?.id)}
                onChange={() => toggleSelectFee(fee)}
              />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <IndianRupee className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {fee.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isPaid ? (
                        <>Paid on <span className="font-medium">{fee.payment_date}</span></>
                      ) : (
                        <>Due by <span className="text-rose-600 font-medium">{fee.due_date}</span></>
                      )}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusConfig.badge}`}>
                    {fee.payment_status}
                  </span>
                  {statusConfig.icon}
                </div>
              </div>

              {/* Amount & button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">₹{fee.fee_amount}</span>
                  <span className="text-sm text-gray-500">INR</span>
                </div>
{/* 
                <button
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${statusConfig.button}`}
                >
                  {isPaid ? (
                    <>
                      <ReceiptText className="w-4 h-4" />
                      <span>View Receipt</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Now</span>
                    </>
                  )}
                </button> */}
              </div>

              {/* Expandable Breakdown */}
        <div className="border-t border-gray-100 pt-4">
          <button
            className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 -m-1"
            onClick={() => setExpanded(expanded === fee.id ? null : fee.id)}
          >
            <span>Fee Breakdown</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${expanded === fee.id ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Breakdown Content */}
          {expanded === fee.id && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-3">
                {fee.amount_per_param.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between text-sm ${index !== fee.amount_per_param.length - 1 ? 'pb-3 border-b border-gray-200' : ''
                      }`}
                  >
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="font-semibold text-gray-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div className="pt-3 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between text-base font-bold">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-blue-600">
                      ₹{fee.fee_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
            </div>
          </div>
        );
      })}

      {/* INLINE BILL SUMMARY */}
      {selectedFees?.length > 0 && (
        <div className="mt-6 p-6 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Summary</h2>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              className="w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>


          {/* Mode of Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Payment
            </label>
            <select
              value={paymentMode}
              onChange={e => setPaymentMode(e.target.value)}
              className="w-full rounded-lg border p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select mode</option>
              {config?.payment_modes?.map(mode => (
                <option key={mode.id} value={mode.id}>
                  {mode.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {selectedFees?.map(fee => (
              <div
                key={fee.id}
                className="flex justify-between bg-gray-50 p-3 rounded-lg border"
              >
                <span>{fee.name}</span>
                <span className="font-semibold">₹{fee.fee_amount}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold">
            <span>Total Payable</span>
            <span className="text-blue-600">₹{totalAmount}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="cursor-pointer mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg shadow"
          >
            {!loading ? "Proceed to Pay" : "Paying ₹" + totalAmount + "..."}
          </button>
        </div>
      )}

      {showSuccess && (
        <SuccessStatus  message={apiResponse?.message} />
      )}

    </div>
  );
}
