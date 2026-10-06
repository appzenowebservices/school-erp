'use client';
import React, { useState } from 'react';
import { ChevronDown, CheckCircle, XCircle, ReceiptIndianRupee } from "lucide-react";
import FeesWithSummary from './FeeCard';
import Loader from '../ui/status/Loader';
import PayFeeModal from './MarkFee';
import { getSessionCache } from '../../utils/sessionCache';
import PaidFeeCard from './PaidFeeCard';

export default function FeeSection({
  isLoading,
  paidFees,
  dueFees,
  studentId

}) {
  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");


  const [activeTab, setActiveTab] = useState("due");
  const [showPay, setShowPay] = useState(false);
  const [selectedFee, setSelectedFee] = useState([]);

  // console.log('selectedFee',selectedFee);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("due")}
          className={`cursor-pointer  px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "due" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Due Fees
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "paid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
        >
          Paid Fees
        </button>
      </div>
      <div className="space-y-4">

        {/* DUE TAB */}
        {activeTab === "due" && (
          isLoading ? (
            <Loader />
          ) : dueFees?.length > 0 ? (
            <FeesWithSummary
              studentId={studentId}
              fees={dueFees}
              isPaid={false}
              context={context}
              config={config}
              setShowPay={setShowPay}
              setSelectedFees={setSelectedFee}
              selectedFees={selectedFee}
            />

          ) : (
            <p className="text-center text-gray-500">No due fees </p>
          )
        )}

        {/* PAID TAB */}
        {activeTab === "paid" && (
          isLoading ? (
            <Loader />
          ) : paidFees?.length > 0 ? (
            paidFees.map(fee => (
              <PaidFeeCard

                key={fee.id}
                fee={fee}
                isPaid={true}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No payments yet</p>
          )
        )}

      </div>
      {/* <button onClick={() => setShowPay(true)}>
        Pay Now
      </button> */}
      <PayFeeModal
        context={context}
        open={showPay}
        selectedFee={selectedFee}
        onClose={() => setShowPay(false)}
        paymentModes={config?.payment_modes}
        onSubmit={data => {
          console.log("Payment submitted:", data);
        }}
      />
    </div>
  );
}
