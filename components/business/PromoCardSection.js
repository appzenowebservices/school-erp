import React from 'react';
import Image from 'next/image';
import { FaChevronRight, FaPencilAlt, FaPlus } from 'react-icons/fa';
import { IconButton } from '../ui/button/iconButton';

const promoData = {
  title: 'Super Sonic Deals',
  subtitle: 'UP TO 90% OFF',
  bannerImage: '/frontend.png', // Main hero image
  brands: ['Philips', 'boAt', 'Zlade'],        // Optional co-branding
  cards: [
    {
      id: 1,
      discount: 'UP TO 90% OFF',
      title: 'Audio Gear & Watches',
      icon: '/icons/books.ico',
    },
    {
      id: 2,
      discount: 'UP TO 80% OFF',
      title: 'Home & Kitchen Appliances',
      icon: '/icons/books.ico',
    },
    {
      id: 3,
      discount: 'UP TO 75% OFF',
      title: 'Tech Accessories',
      icon: '/icons/books.ico',
    },
    {
      id: 4,
      discount: 'UP TO 80% OFF',
      title: 'Charging Needs',
      icon: '/icons/bd.ico',
    },
    {
      id: 5,
      discount: 'UP TO 80% OFF',
      title: 'Personal Care & Grooming',
      icon: '/icons/office.ico',
    },
  ],
};

export default function PromoCardSection() {
  return (
    <section className="bg-black text-white rounded-2xl p-6 overflow-hidden">
      {/* Header */}
      <IconButton >



        Edit Banner <FaPencilAlt size={14} className="text-white-500 ml-2" />
      </IconButton>
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-3xl font-bold">{promoData.title}</h2>
          <p className="text-xl">{promoData.subtitle}</p>
          <div className="flex space-x-2 mt-2">
            {promoData.brands.map((brand, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-white text-black rounded-md font-medium"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
        <Image
          src={promoData.bannerImage}
          alt="Banner"
          width={280}
          height={180}
          className="object-contain hidden md:block"
        />
      </div>

      {/* Scrollable Cards */}
      <div className="mt-6 overflow-x-auto">
        <IconButton >



          Add  <FaPlus size={14} className="text-white-500 ml-2" />
        </IconButton>
        <div className="flex space-x-4 pb-2 p-4">

          {promoData?.cards.map((card) => (
            <div className="w-[100px] h-[110px] bg-gradient-to-b from-gray-700 shadow-white to-black rounded-2xl flex flex-col items-center justify-between text-white px-2 py-3 shadow hover:scale-105 transition-all">
              <p className="text-[10px] text-center font-bold text-gray-200">{card?.discount}</p>
              <div className="relative w-8 h-8 mt-1">
                <Image
                  src={card?.icon}
                  // alt={title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p className="text-[11px] text-center font-medium leading-tight">{card?.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional CTA */}
      <div className="flex justify-end mt-4">
        <button className="text-white flex items-center gap-2 text-sm hover:underline">
          View All <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
