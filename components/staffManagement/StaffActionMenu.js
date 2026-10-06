import { UserMinus, Shield, FileSignature } from 'lucide-react';
import React from 'react';

export default function StaffActionMenu({
  setOpenActionMenu,
  openActionMenu
}) {

  const staff = { id: 1, name: "John Doe" };

  const menuItems = [
    {
      label: "Remove From Client",
      action: () => console.log("Remove From Client", staff),
      icon: UserMinus,
      variant: "danger"
    },
    {
      label: "Edit Class Permissions",
      action: () => console.log("Edit Class Permissions", staff),
      icon: Shield,
      variant: "default"
    },
    {
      label: "Upload Signature",
      action: () => console.log("Upload Signature", staff),
      icon: FileSignature,
      variant: "default"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
      <div className="relative">
        {/* <button
          className="px-6 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all font-medium text-slate-700"
          onClick={() => setOpenActionMenu(openActionMenu ? null : staff.id)}
        >
          Open Menu
        </button> */}

        {openActionMenu === staff.id && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenActionMenu(null)}
            />

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200/60 rounded-xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm font-medium
                      transition-all duration-150 flex items-center gap-3
                      ${item.variant === 'danger'
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        : 'text-slate-700 hover:bg-slate-50'
                      }
                      ${i !== menuItems.length - 1 ? '' : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                      setOpenActionMenu(null);
                    }}
                  >
                    <Icon className="w-4 h-4 opacity-70" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}