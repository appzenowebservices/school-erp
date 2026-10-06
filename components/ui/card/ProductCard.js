import React from "react";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { LuClock } from "react-icons/lu"; // Lucide icon (Blinkit uses similar minimal styles)

export default function ProductCard() {
  return (
    <div className="w-44 p-2 bg-white rounded-xl shadow-sm border border-gray-100 relative">

      {/* Image Box */}
      <div className="bg-gray-100 h-[150px] rounded-2xl p-2 flex items-center justify-center relative">
        <img
          src="/products/pepsi.png"
          alt="Pepsi"
          className="h-28 object-contain"
        />

        {/* ADD Button */}
        <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2">
          <button className="border border-green-600 text-green-600 text-xs px-4 py-1 rounded-full font-semibold bg-white shadow-sm">
            ADD
          </button>
        </div>
      </div>

      {/* "2 options" Text */}
      <div className="text-center mt-4 text-xs text-gray-500">2 options</div>

      {/* Weight & Fresh Tag */}
      <div className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
        <span className="bg-gray-100 text-[#484d7c] text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
          125 g
        </span>

        <span className="bg-gray-100 text-[#484d7c] text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
          Fresh
        </span>      </div>

      {/* Product Name */}
      <div className="text-sm font-bold text-gray-800 mt-1 leading-tight">
        Himalaya Cucumber & Coconut Soap 125g
      </div>
      <div className="flex items-center mt-1 space-x-1">
        <ReactStars
          count={5}
          value={4.5}
          size={16}
          isHalf={true}
          edit={false}
          activeColor="#facc15" // Tailwind yellow-400
          emptyIcon={<FaStar className="text-gray-300" />}
          halfIcon={<FaStar className="text-yellow-400" />}
          filledIcon={<FaStar className="text-yellow-400" />}
        />
        <span className="text-gray-500 text-xs">(1,446)</span>
      </div>

      {/* ETA */}
      <div className="flex items-center text-xs text-gray-600 mt-1">
        <LuClock className="w-3.5 h-3.5 mr-1" />
        <span>11 MINS</span>
      </div>
      {/* Price Section */}
      <div className="mt-1">
        {/* Discount Tag */}
        <div className="text-[10px] text-blue-700 font-semibold bg-blue-100 inline-block px-1.5 py-[1px] rounded-md mb-[2px]">
          <p className="">

            10% OFF
          </p>
        </div>

        {/* Prices */}
        <div className="flex items-baseline space-x-2">
          <span className="text-sm text-gray-400 line-through">₹72</span>
          <span className="text-base font-semibold text-gray-800">₹64</span>
        </div>
      </div>

    </div>
  );
}
