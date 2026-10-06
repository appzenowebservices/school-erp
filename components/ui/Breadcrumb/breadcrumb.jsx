"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

/**
 * Enhanced Breadcrumbs
 * @param {Array} items - Array of objects: { label: string, href?: string }
 */
export const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center">
              {/* Separator: Show for all except the first item */}
              {!isFirst && (
                <ChevronRight 
                  className="mx-1 h-4 w-4 text-gray-400 flex-shrink-0" 
                  strokeWidth={2}
                />
              )}

              <div className="flex items-center">
                {!isLast && item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors duration-200 group"
                  >
                    {isFirst && (
                      <Home className="mr-1.5 h-4 w-4 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="max-w-[120px] sm:max-w-[200px] truncate">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <span 
                    className="flex items-center text-indigo-900 font-bold"
                    aria-current="page"
                  >
                    {isFirst && <Home className="mr-1.5 h-4 w-4" />}
                    <span className="max-w-[150px] sm:max-w-md truncate">
                      {item.label}
                    </span>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;