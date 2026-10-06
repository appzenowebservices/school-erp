"use client";

import { CalendarDays, DollarSign, Clock, ArrowRight } from "lucide-react";

type Fee = {
  id: string;
  name: string;
  due_date: {
    label: string;
    text: string;
    value: string;
  };
};

interface FeeCardsProps {
  fees: Fee[];
}

export default function FeeCards({ fees = [] }: FeeCardsProps) {

  // console.log("fees ======sds===== :", fees);

  if (!fees || fees.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
        <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No fees available</p>
      </div>
    );
  }

  const getDueDateStatus = (dueDateValue: string) => {
    const dueDate = new Date(dueDateValue);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'overdue', color: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700' };
    if (diffDays <= 7) return { status: 'urgent', color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700' };
    if (diffDays <= 30) return { status: 'due-soon', color: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' };
    return { status: 'upcoming', color: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700' };
  };

  return (
    <>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
  {fees?.map((fee) => {
    const dueDateInfo = getDueDateStatus(fee.due_date.value);

    return (
      <div
        key={fee.id}
        className={`flex items-center justify-between rounded border text-xs px-2.5 py-1.5 bg-white hover:bg-gray-50 transition-colors ${dueDateInfo.color}`}
      >
        <div className="flex items-center space-x-1.5">
          <DollarSign className="w-3 h-3 text-blue-600" />
          <span className="font-medium text-gray-800 truncate">{fee.name}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <CalendarDays className="w-3 h-3 text-gray-400" />
          <span className="text-gray-600">{fee.due_date.text}</span>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${dueDateInfo.badge}`}
          >
            {fee.due_date.label}
          </span>
        </div>
      </div>
    );
  })}
</div>

    </>
  );
}