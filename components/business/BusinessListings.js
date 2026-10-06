import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

import { useBusinessById } from '../../controllers/business';
import { useBusinessModuleStore } from '../../controllers/business';
import Loader from '../ui/status/Loader';
import Store from '../store/Store';

//==========================================
// Subcomponent: handles dynamic store loading
function StoreLoader({ moduleId }) {
  const { stores, isStoreLoading } = useBusinessModuleStore(moduleId);

  if (isStoreLoading) return <Loader />;
  if (!stores || !stores.length) return <div>No stores found.</div>;

  return <Store storesData={stores} />;
}

//==========================================
export default function BiznessListings() {
  const [filter, setFilter] = useState("all");
  const [businessModules, setBusinessModules] = useState([]);

  const router = useRouter();
  const params = useParams();

  const { business, isLoading } = useBusinessById(params?.id);

  useEffect(() => {
    if (business?.modules?.length) {
      setBusinessModules(business.modules);
    }
  }, [business?.modules]);

  if (isLoading) return <div>Loading business modules...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Business Listings</h2>

      <div className="space-y-10">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold">Apni Bazaar</h3>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
          {businessModules.map((opt) => (
            <button
              key={opt._id}
              onClick={() => setFilter(opt._id)}
              className={`px-3 sm:px-4 py-2 rounded-full border transition ${
                filter === opt._id
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        {/* Show the stores only when a filter (module) is selected */}
        {filter !== "all" && (
          <StoreLoader moduleId={filter} />
        )}
      </div>
    </div>
  );
}
