import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import VariantBadge from "../Badges/variantBadge";
import AddonItem from "../counter/addonItem";
import { AddButton } from "../button/addButton";
import { PriceButton } from "../button/priceButton";
import POSCounter from "../counter/posCounter";
import Layout from "../../../layouts/Layout";
//=========================================================================================

const Backdrop = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50"
    onClick={onClose}
  />
);
//=========================================================================================

const ModalContent = ({ onClose, product }) => {



  const [selected, setSelected] = useState("Medium");

  return (


      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-20">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-xl p-6 relative transform transition-all duration-300 animate-slide-down">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <IoClose size={22} />
          </button>

          <h2 className="text-xl font-semibold text-primary-text mb-4">
            {product.name}
          </h2>

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <POSCounter />


          {product.variants?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Variants</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <VariantBadge
                    key={v}
                    label={v.label}
                    price={v.price}

                    active={selected === v}
                    onClick={() => setSelected(v)}
                  />
                ))}
              </div>
            </div>
          )}
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Addons</h4>

          <AddonItem title="Extra Cheese" price={1.5} onChange={(val) => console.log("Cheese Qty:", val)} />
          <AddonItem title="Pepsi" price={2.0} />


          <div className="mt-6 flex justify-between items-center">
            {/* <span className="text-lg font-semibold text-green-700">${product.price}</span> */}

            <PriceButton
              label='Proceed to Checkout'
              price={product.price}
              fullwidth='true'
              onClick={() => console.log("Added to cart")}
            />

          </div>
        </div>
      </div>
  )
}


//=========================================================================================

export default function ProductDetailsPos({ isOpen, onClose, product }) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <Backdrop onClose={onClose} />
      <ModalContent onClose={onClose} product={product} />
    </>,
    document.body
  );
}
//=========================================================================================
