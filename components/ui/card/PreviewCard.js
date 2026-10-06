import React from 'react';
import clsx from 'clsx';
import { IconButton } from '../button/iconButton';
import { MdDeleteForever } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import { ImProfile } from "react-icons/im";
import { useRouter } from 'next/navigation';

const StatusBadge = ({ value }) => {
  const statusClass = clsx(
    "inline-block px-3 py-1 text-xs font-semibold rounded-full",
    {
      "bg-green-100 text-green-700": value === "Active",
      "bg-yellow-100 text-yellow-700": value === "Pending",
      "bg-red-100 text-red-700": value === "Inactive",
      "bg-gray-200 text-gray-600": !["Active", "Pending", "Inactive"].includes(value),
    }
  );

  return <span className={statusClass}>{value}</span>;
};

const PreviewCard = ({ title, subtitle, image, details, selectedProduct }) => {


  const router = useRouter();
  if (!selectedProduct) {
    return (
      <div className="w-full  bg-white  rounded  p-6 text-center shadow border border-gray-300">
        <p className="text-primary-text ">No item selected. Please choose a product to see the preview.</p>
      </div>
    );
  }

  return (

    <>
      <div className="flex gap-4 mb-4">

        <IconButton
          // onClick={handleConfirmation}
          disabled={!selectedProduct}
          title="Modify Product">
          <MdDeleteForever size={20} />
        </IconButton>
        <IconButton
          onClick={() => {
            router.push(`/view-profile`)
          }}
          disabled={!selectedProduct}
          title="Modify Product">
          <ImProfile size={20} />
        </IconButton>

      </div>


      <div className="w-full bg-[#28282B] rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start shadow-lg border border-gray-300 ">
        {/* Left: Image */}
        {image && (
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title || 'Preview'}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Right: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
              <StatusBadge value={'Pending'} />
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {details?.length > 0 && (
            <div className="space-y-4">
              {details.map((item, index) => (
                <div key={index}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-200">
                    {item.value}
                  </p>
                  {index !== details.length - 1 && (
                    <hr className="my-4 border-gray-300 dark:border-gray-700" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PreviewCard;
