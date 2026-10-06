import React from "react";

export default function DrinksAndJuicesCard() {
  return (
    <div className="w-45 p-2  bg-gray-200 rounded-2xl shadow text-center">
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        < div className="bg-white rounded-2xl p-2">
          <img
            src="/products/pepsi.png"
            alt="Pepsi"
            className="w-full h-20 object-contain"
          />
        </div>
        < div className="bg-white rounded-2xl p-2">
          <img
            src="/products/pepsi.png"
            alt="Pepsi"
            className="w-full h-20 object-contain"
          />
        </div>
        < div className="bg-white rounded-2xl p-2">
          <img
            src="/products/pepsi.png"
            alt="Pepsi"
            className="w-full h-20 object-contain"
          />
        </div>
        < div className="bg-white rounded-2xl p-2">
          <img
            src="/products/pepsi.png"
            alt="Pepsi"
            className="w-full h-20 object-contain"
          />
        </div>

      </div>
      <div className="text-sm text-gray-600 shadow w-fit m-auto p-1 rounded-full bg-gray-100 relative bottom-5">+74 more</div>
      <div className="font-bold text-gray-800 ">Drinks & Juices</div>
    </div>
  );
}
