"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ReceiptText,
  Calendar,
  IndianRupee,
  Clock,
  CreditCard
} from "lucide-react";
import { getSessionCache } from "../../utils/sessionCache";



export default function PaidFeeCard({ fee, isPaid }) {



  const [expanded, setExpanded] = useState(null);

  const getStatusConfig = (isPaid, status) => {
    if (isPaid) {
      return {
        badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        button: "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100",
        accent: "border-l-emerald-500"
      };
    }
    return {
      badge: "bg-rose-50 text-rose-700 border border-rose-200",
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      button: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
      accent: "border-l-rose-500"
    };
  };

  const statusConfig = getStatusConfig(isPaid, fee.payment_status);

  return (
    <div className={` group relative overflow-hidden rounded-xl bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 ${statusConfig.accent} border-l-4`}>
      {/* Card Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
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
                  <>Due by <span className="font-medium text-rose-600">{fee.due_date}</span></>
                )}
              </span>
            </div>
          </div>

          {/* Status Badge & Icon */}
          <div className="flex items-center space-x-3 ml-4">
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusConfig.badge}`}>
              {fee.payment_status}
            </span>
            {statusConfig.icon}
          </div>
        </div>

        {/* Amount & Action Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">
              ₹{fee.fee_amount.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-500">INR</span>
          </div>

          <button
            onClick={() => {
              if (isPaid && fee?.fee_receipt?.url) {
                window.open(fee.fee_receipt.url, "_blank");
              } 
            }} className={`cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${statusConfig.button}`}
          >
            {isPaid ? (
              <>
                <ReceiptText className="cursor-pointer  w-4 h-4" />
                <span>View Receipt</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay Now</span>
              </>
            )}
          </button>
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

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
}