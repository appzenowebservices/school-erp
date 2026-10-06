import { useState } from 'react';
import PreviewCard from '../card/PreviewCard';

const VendorsTabs = ({ tabs ,selectedProduct}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Tab headers */}
      <div className="flex border-b border-border-color overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`relative py-3 px-5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 
              ${activeTab === idx ? 'text-accent' : 'text-secondary-text hover:text-accent'}
            `}
          >
            {tab.label}
            {activeTab === idx && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent transition-all duration-300 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 p-4 bg-background-section border border-border-color rounded-xl shadow">
        {tabs[activeTab]?.content}
        <PreviewCard
              selectedProduct={selectedProduct}
              title={selectedProduct?.name}
              subtitle={`Interested Vendor • Region : ${selectedProduct?.region} `}
              image="cafe-bg.jpg"
              details={[
                { label: "Business Type", value: "Wholesale" },
                { label: "Address", value: `${selectedProduct?.address}` },
                { label: "Contact", value: `+91 - ${selectedProduct?.phone}` },

              ]} />
      </div>
    </div>
  );
};

export default VendorsTabs;
