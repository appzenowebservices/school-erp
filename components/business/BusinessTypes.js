'use client';

import { useRouter } from 'next/navigation';
import { useBusiness } from '../../controllers/business';
import { Card, CardContent } from '../ui/card/card';
import Image from 'next/image';
import { IconButton } from '../ui/button/iconButton';
import { RiExternalLinkFill } from "react-icons/ri";
import { FaStore } from 'react-icons/fa';

export default function BusinessTypes() {
  const { businessData, isLoading } = useBusiness();
  const router = useRouter();

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!businessData || businessData.length === 0) {
    return <div className="p-6 text-center text-gray-500">No business types found.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary">Explore Business Types</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
        {businessData?.map((biz) => (
          <Card
            key={biz._id}

            className="bg-background   rounded-2xl shadow  hover:shadow-lg hover:scale-[1.02] transition-transform"
          >
            <CardContent className="p-6 text-center flex flex-col items-center bg-background">
              {/* Business logo */}
              <div

                className="w-16 h-16 mb-4 relative rounded-full overflow-hidden border bg-white">
                <Image
                  src={biz.logo || '/default-business-icon.png'}
                  alt={biz.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Business name & description */}
              <h3 className="text-lg font-semibold text-primary mb-1">{biz.name}</h3>
              <p className="text-sm text-muted-foreground">{biz.description}</p>

              {/* Modules list */}
              {biz.modules?.length > 0 ? (
                <div

                  className="cursor-pointer mt-4 w-full text-left">
                  <div className='flex items-center justify-between'>

                    <p className="text-xs font-semibold text-gray-600 mb-1">Modules:</p>

                    <RiExternalLinkFill
                      size={22}
                      className='text-white bg-accent p-1 rounded cursor-pointer'
                      onClick={() => router.push(`/modules/${biz._id}`)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {biz.modules.map((mod, i) => (
                      <>
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300"
                        >
                          {mod.name}
                        </span>
                       
                      </>
                    ))}
                     <FaStore
                          size={22}
                          className='text-white bg-accent p-1 rounded cursor-pointer'
                          onClick={() => router.push(`/business-details/${biz._id}`)}
                        />
                  </div>
                </div>
              ) : (
                <div className="mt-4 w-full text-left flex flex-col items-center">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    No modules available
                  </p>
                  <IconButton
                    onClick={() => router.push(`/modules/${biz._id}`)}
                    variant="outline"
                    size="icon"
                    icon="MdOutlineError" className="text-red-500">
                    <RiExternalLinkFill />
                    <span className="text-xs font-bold ml-2">Add </span>
                  </IconButton>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div >
  );
}
