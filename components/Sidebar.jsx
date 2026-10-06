import SchoolBadgeCard from "./ui/card/SchoolBadgeCard";
import { TbLayoutSidebarRightExpand } from "react-icons/tb";
import { ChevronDown, ChevronRight, Star, } from 'lucide-react';
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { getSessionCache } from "../utils/sessionCache";
import { PORTAL_BASE_URL } from "../config/server";
// ===============================================================
const context = getSessionCache("dashboardContext");

// ===============================================================
// AI HUB — one mapped menu for every AI + learning feature.
// Route-backed items navigate; preset items open the Copilot (components/ai)
// and auto-send via the `ai-hub:ask` window event. Deliberately un-gated for
// now (sidebar has no permission filtering yet) — gate later per profile.
const fireAsk = (text, audience) => {
  window.dispatchEvent(new CustomEvent('ai-hub:ask', { detail: { text, audience: audience || 'staff' } }));
};

const aiHubMenu = {
  name: "AI HUB",
  icon: <Image
    src="/icons/support-center.png"
    alt="AI Hub Icon"
    width={20}
    height={20}
    className="w-8 h-8"
  />,
  subMenu: [
    {
      name: "Ask ERP",
      quickLink: true,
      onClick: () => fireAsk("", "staff"),
    },
    {
      name: "AI Feature Tour",
      url: "/ai-feature",
      quickLink: true,
    },
    {
      name: "Learn",
      subMenu: [
        { name: "Homework", url: "/dashboard/homework" },
        { name: "Quizzes", url: "/dashboard/quizzes" },
        { name: "Notices", url: "/dashboard/notices" },
        { name: "Library", url: "/dashboard/library" },
      ]
    },
    {
      name: "Teach with AI",
      subMenu: [
        { name: "Worksheet Builder", url: "/dashboard/worksheets", quickLink: true },
        { name: "Lesson plan draft", url: "/dashboard/teach/lesson-plan" },
        { name: "Class remarks", url: "/dashboard/teach/remarks" },
        { name: "Parent circular", url: "/dashboard/teach/circular" },
        { name: "Class mastery map", url: "/dashboard/teach/mastery" },
      ]
    },
    {
      name: "Study with AI",
      subMenu: [
        { name: "Tutor Studio", url: "/dashboard/tutor", quickLink: true },
        { name: "Start tutoring", url: "/dashboard/tutor?task=learn" },
        { name: "Revision plan", url: "/dashboard/tutor?task=plan" },
        { name: "Practice me", url: "/dashboard/tutor?task=practice" },
      ]
    },
    {
      name: "Insights",
      subMenu: [
        { name: "Fee defaulters + letter", onClick: () => fireAsk("Show fee defaulters and draft the reminder letter. Ask me for class and minimum amount first.", "staff") },
        { name: "Excel audit guide", onClick: () => fireAsk("Audit my setup Excel for mistakes. Tell me how to paste the rows.", "staff") },
        { name: "Duplicate parents", onClick: () => fireAsk("Find duplicate parent records. Ask me for the class scope first.", "staff") },
        { name: "Ticket triage", onClick: () => fireAsk("Triage a support ticket. I will paste the school message next.", "staff") },
      ]
    },
    {
      name: "Records",
      subMenu: [
        { name: "Students", url: "/dashboard/student-management?tab=list" },
        { name: "Staff", url: "/dashboard/staff-management?tab=list" },
        { name: "Standards & Classes", url: "/dashboard/standard-management" },
        { name: "Attendance", url: "/dashboard/attendance-management" },
        { name: "Report Cards", url: "/dashboard/report-cards" },
        { name: "Fee Summary", url: "/dashboard/fee-summary" },
        { name: "Calendar", url: "/dashboard/calendar" },
        { name: "Profile", url: "/dashboard/profile" },
      ]
    },
  ]
};

const menuItems = [
  {
    name: "DASHBOARD",
    icon: <Image
      src="/icons/online_fee.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    url: "/dashboard",
    active: true
  },

  aiHubMenu,

  {
    name: "RAG LAB",
    icon: <Image
      src="/icons/erp.png"
      alt="RAG Lab Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    subMenu: [
      { name: "Lab Dashboard", url: "/dashboard/rag-lab", quickLink: true },
      { name: "My Docs (AI)", url: "/dashboard/my-docs" },
      { name: "Worksheet Builder", url: "/dashboard/worksheets" },
      { name: "Tutor Studio", url: "/dashboard/tutor" },
    ]
  },

  {
    name: "STANDARD MANAGEMENT",
    icon: <Image
      src="/icons/standard_managment.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    subMenu: [
      {
        name: "All Standards & Classes",
        url: "/dashboard/standard-management",

      },
      // {
      //   name: "All Classes",
      //   url: "/dashboard/standard-management",


      // },
      {
        name: "Class Details",
        subMenu: [
          {
            name: "All",
            url: "/class-details",
            onClick: (item) => handleDownload(item, 'classDetailsAll')

          },
          // {
          //   name: "With App Users",
          //   url: "/class-details",
          //   onClick: (item) => handleDownload(item, 'classDetailsWithAppUsers')

          // },

          // {
          //   name: "More Levels",
          //   subMenu: [
          //     { name: "Level 3 Item A", url: "/l3/a" },
          //     {
          //       name: "Level 3 deeper",
          //       subMenu: [
          //         { name: "Level 4 Item A", url: "/l4/a" }
          //       ]
          //     }
          //   ]
          // }
        ]
      },


      {
        name: "Class Change",
        subMenu: [
          {
            name: ".xls",

            url: "/class-details",
            onClick: (item) => handleDownload(item, 'classCHangeXls')

          },
          {
            name: "Student Renew",
            url: "/dashboard/standard-management",
          },

        ]
      },
      {
        name: "Shuffle Sections",
        url: "/dashboard/standard-management",


      },

    ]
  },
  {
    name: "STUDENT MANAGEMENT",
    icon: <Image
      src="/icons/student_managment.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />,
    subMenu: [
      {
        name: "All Students",
        url: "/dashboard/student-management?tab=list",
      },
      {
        name: "Add Student",
        url: "/dashboard/student-management?tab=add",
        quickLink: true
      },

      {
        name: "Houses",
        url: "/dashboard/student-management?tab=houses"
      },
      // {
      //   name: "Uploads",
      //   url: "/dashboard/student-management?tab=birthdays"
      // },
      {
        name: "Download Student Data",
        url: "/dashboard/student-management/downloads"
      },
      // {
      //   name: "Verify Image",
      //   url: "/dashboard/student-management?tab=birthdays"
      // },
      {
        name: "Proof Reading",
        url: "/dashboard/student-management/proof-reading"
      },
      {
        name: "Parents",
        url: "/dashboard/student-management?tab=parents"
      },
      {
        name: "Siblings",
        url: "/dashboard/student-management?tab=siblings"
      },
      {
        name: "Birthdays",
        url: "/dashboard/student-management?tab=birthdays"
      },


    ]
  },
  {
    name: "STAFF MANAGEMENT",
    icon: <Image
      src="/icons/staff_management.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />, subMenu: [
      {
        name: "All Staff",
        url: "/dashboard/staff-management?tab=list",
      },
      {
        name: "Add Staff",
        url: "/dashboard/staff-management?tab=add",
        quickLink: true
      },

      {
        name: "Departments",
        url: "/dashboard/staff-management?tab=departments",
        quickLink: false
      },

      {
        name: "School Roles",
        url: "/dashboard/staff-management?tab=schoolRoles",
        quickLink: false
      },

      {
        name: "School Designations",
        url: "/dashboard/staff-management?tab=schoolDesignation",
        quickLink: false
      },
      {
        name: "Titles",
        url: "/dashboard/staff-management?tab=schoolTitles",
        quickLink: false
      },

      {
        name: "Subject Class Mapping",
        url: "/dashboard/staff-management?tab=subjectClassMapping",
        quickLink: true
      },
      {
        name: "Revoke School Designation Permission",
        url: "/dashboard/staff-management?tab=designationPermission",
        quickLink: false
      },

    ]
  },

  {
    name: "MOBITENDANCE",
    icon: <Image
      src="/icons/mobiTENDANCE.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />, subMenu: [
      {
        name: "Take Attendance",
        url: "/dashboard/attendance-management",
        quickLink: true
      },

    ]
  },

  {
    name: "LEARNING",
    icon: <Image
      src="/icons/online_exam.png"
      alt="Learning Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />, subMenu: [
      { name: "Homework", url: "/dashboard/homework", quickLink: true },
      { name: "Quizzes", url: "/dashboard/quizzes", quickLink: true },
      { name: "Notices", url: "/dashboard/notices", quickLink: true },
      { name: "Library", url: "/dashboard/library", quickLink: true },
      { name: "My Docs (AI)", url: "/dashboard/my-docs", quickLink: true },
    ]
  },

  {
    name: "ONLINE FEE",
    icon: <Image
      src="/icons/online_fee.png"
      alt="Standards Icon"
      width={20}
      height={20}
      className="w-8 h-8"
    />, subMenu: [
      { name: "View Fees", url: "/dashboard/view-fee", quickLink: true, },
      { name: "Mark Student Fees", url: "/dashboard/mark-student-fee", quickLink: true },
      { name: "Fee Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Datewise Fee Collection Summary", url: "/dashboard/datewise-fee-summary", quickLink: true },
      { name: "Sessionwise Fee Collection Summary", url: "/dashboard/datewise-fee-summary", quickLink: true },
      { name: "Standardwise Fee Collection Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Periodwise Fee Collection Summary", url: "/dashboard/fee-summary", quickLink: true },
      { name: "Payouts", url: "/dashboard/payouts", quickLink: true },
      { name: "Concession/Optional Fees", url: "/dashboard/concession-optional-fee", quickLink: true },
      { name: "Variable Fees Students", url: "/dashboard/variable-fee", quickLink: true },
      { name: "Late Fees ", url: "/dashboard/late-fee", quickLink: true },
      { name: "Wave Off Late Fees", url: "/dashboard/waive-off-late-fee", quickLink: true },
      { name: "Fee Defaulter", url: "/dashboard/fee-defaulter", quickLink: true },
      { name: "View School Buses", url: "/dashboard/school-buses", quickLink: true },
      { name: "Transport Location", url: "/dashboard/transport-location", quickLink: true },
      { name: "Fee Types ", url: "/dashboard/fee-types", quickLink: true },
      { name: "Fee Type Students ", url: "/dashboard/fee-type-students", quickLink: true },
      { name: "Fee Category Concession", url: "/dashboard/fee-category-concession", quickLink: true },

      {
        name: "Student Ledger",
        subMenu: [
          {
            name: "Soft Copy (.xls)",

            url: "/class-details",
            onClick: (item) => handleDownload(item, 'classCHangeXls')

          }

        ]
      },
    ]
  },

];

const downloadRoutes = {
  classDetailsAll: classId => {
    const portal = getPortalParams();

    return `${PORTAL_BASE_URL}/class/folder`
      + `?client_id=${portal.client_id}`
      + `&guid=${portal.guid}`
      + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
      + `&user_account_id=${portal.user_account_id}`
      + `&id=${classId}`;
  },

  classDetailsWithAppUsers: classId => {
    const portal = getPortalParams();

    return `${PORTAL_BASE_URL}`

      + `/client/classes?&app_users=1`
      ;
  },

  classCHangeXl: classId => {
    const portal = getPortalParams();

    return `${PORTAL_BASE_URL}`

      + `/client/class-change?id=${portal.client_id}&format=SOFT COPY`
      ;
  },


  classCHangeXls: classId => {
    const portal = getPortalParams();

    return `${PORTAL_BASE_URL}`

      + `/client/download-students-image?id=${portal.client_id}`
      ;
  },




};
const getPortalParams = () => {
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  return {
    client_id: context?.session,
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: context?.profileId,
  };
};

const handleDownload = (classData, action) => {

  console.log('classData, action=======', classData, action);


  const classId = classData.id;

  const routeFn = downloadRoutes[action];
  if (!routeFn) {
    console.warn("Unknown download action:", action);
    return;
  }

  const url = routeFn(classId);
  window.open(url, "_blank");
};
// ===============================================================

export default function Sidebar(props) {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL path (no query)
  const [expandedMenus, setExpandedMenus] = useState({});
  const [query, setQuery] = useState('');

  // Track ?task= / ?tab= etc so tabs like /dashboard/tutor?task=plan highlight correctly.
  // Uses window.location (no useSearchParams → no Suspense requirement).
  // Patches pushState/replaceState so same-path query switches (tutor tabs) also sync.
  useEffect(() => {
    const sync = () => setQuery(window.location.search || '');
    sync();
    window.addEventListener('popstate', sync);
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      const ret = origPush.apply(this, args);
      sync();
      return ret;
    };
    window.history.replaceState = function (...args) {
      const ret = origReplace.apply(this, args);
      sync();
      return ret;
    };
    return () => {
      window.removeEventListener('popstate', sync);
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
    };
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') setQuery(window.location.search || '');
  }, [pathname]);

  const getParam = (name) => {
    try {
      return new URLSearchParams(query).get(name);
    } catch {
      return null;
    }
  };

  const splitUrl = (url) => {
    if (!url) return { path: '', params: {} };
    const [path, qs] = String(url).split('?');
    const params = {};
    if (qs) {
      qs.split('&').forEach((pair) => {
        const [k, v] = pair.split('=');
        if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return { path, params };
  };

  // Active when path matches AND every query param defined in item.url matches current URL.
  // Plain urls (no query) are active only when the discriminator param is absent,
  // e.g. "/dashboard/tutor" is NOT active when ?task=plan is present.
  const isUrlActive = (url) => {
    if (!url) return false;
    const { path, params } = splitUrl(url);
    if (path !== pathname) return false;
    const keys = Object.keys(params);
    if (keys.length === 0) {
      if (path === '/dashboard/tutor' && getParam('task')) return false;
      if (getParam('tab') && keys.length === 0) {
        // paths like /dashboard/student-management have ?tab= variants — plain should not win
        return false;
      }
      return true;
    }
    return keys.every((k) => getParam(k) === params[k]);
  };

  // Helper to check if a menu or any of its children are active
  const isItemActive = (item) => {
    if (item.url && isUrlActive(item.url)) return true;
    if (item.subMenu) {
      return item.subMenu.some(sub => isItemActive(sub));
    }
    return false;
  };

  // Automatically expand parent menus if a child is active on initial load
  useEffect(() => {
    const newExpanded = { ...expandedMenus };
    menuItems.forEach(item => {
      if (item.subMenu && isItemActive(item)) {
        newExpanded[`${item.name}-0`] = true;
        // Check second level
        item.subMenu.forEach(sub => {
          if (sub.subMenu && isItemActive(sub)) {
            newExpanded[`${sub.name}-1`] = true;
          }
        });
        // Check third level (AI HUB → Study with AI → task tabs)
        item.subMenu.forEach(sub => {
          if (sub.subMenu) {
            sub.subMenu.forEach(deep => {
              if (deep.subMenu && isItemActive(deep)) {
                newExpanded[`${sub.name}-1`] = true;
              }
            });
          }
        });
      }
    });
    setExpandedMenus(newExpanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, query]); // Runs when route or ?task= / ?tab= changes

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMenu = (item, level = 0) => {
    const key = `${item.name}-${level}`;
    const isExpanded = expandedMenus[key];
    const hasChildren = item.subMenu && item.subMenu.length > 0;

    const isActive = item.url ? isUrlActive(item.url) : false;
    const containsActiveChild = hasChildren && item.subMenu.some((sub) => isItemActive(sub));
    const isOpenParent = hasChildren && isExpanded;
    const isTop = level === 0;

    // ---- Bold, professional state styles ----
    const topStyle = isActive
      ? "bg-blue-600 text-white border-blue-600 shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]"
      : isOpenParent && containsActiveChild
        ? "bg-slate-900 text-white border-slate-900 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.8)]"
        : containsActiveChild
          ? "bg-blue-50 text-blue-800 border-blue-200 shadow-sm"
          : "bg-white text-slate-800 border-slate-200/70 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm";

    const subStyle = isActive
      ? "bg-blue-600 text-white border-blue-600 shadow-[0_6px_16px_-8px_rgba(37,99,235,0.8)]"
      : containsActiveChild
        ? "bg-blue-50/80 text-blue-800 border-blue-200/70"
        : "bg-transparent text-slate-600 border-transparent hover:bg-white hover:text-slate-900 hover:border-slate-200 hover:shadow-sm";

    return (
      <div key={key} className={isTop ? "mb-1.5" : "mb-0.5"}>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            if (hasChildren) toggleMenu(key);
            else if (item.onClick) item.onClick(item);
            else if (item.url) router.push(item.url);
          }}
          className={`group relative flex items-center justify-between gap-2 rounded-xl border cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white
            ${isTop ? `px-2.5 py-2 ${topStyle}` : `px-3 py-2 ${subStyle}`}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(key);
            } else if (item.onClick) {
              item.onClick(item);
            } else if (item.url) {
              router.push(item.url);
            }
          }}
        >
          {/* Active left bar for top-level */}
          {isTop && (isActive || (isOpenParent && containsActiveChild)) && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white/90" />
          )}

          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {isTop ? (
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border transition-colors [&_img]:!h-5 [&_img]:!w-5 [&_img]:object-contain
                  ${isActive || (isOpenParent && containsActiveChild)
                    ? "bg-white/15 border-white/25 text-white [&_img]:brightness-0 [&_img]:invert"
                    : containsActiveChild
                      ? "bg-blue-600 border-blue-600 text-white [&_img]:brightness-0 [&_img]:invert"
                      : "bg-slate-100 border-slate-200 text-slate-600 group-hover:bg-white group-hover:shadow-sm group-hover:border-slate-300"
                  }`}
              >
                {item.icon}
              </span>
            ) : (
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors
                  ${isActive ? "bg-white" : containsActiveChild ? "bg-blue-600" : "bg-slate-300 group-hover:bg-slate-500"}`}
              />
            )}

            <span
              className={`truncate leading-tight
                ${isTop
                  ? "text-[13px] font-extrabold tracking-[0.02em]"
                  : "text-[13px] font-semibold tracking-[0.01em]"
                }
                ${!isTop && isActive ? "font-bold" : ""}
              `}
            >
              {item.name}
            </span>

            {item.quickLink && !hasChildren && (
              <Star className={`h-3 w-3 shrink-0 ${isActive ? "fill-amber-300 text-amber-300" : "fill-amber-400 text-amber-400"}`} />
            )}
          </div>

          {hasChildren && (
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors
                ${isActive || (isOpenParent && containsActiveChild)
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                }`}
            >
              {isExpanded
                ? <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.75} />
                : <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.75} />
              }
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className={`${isTop ? "ml-[22px] mt-1.5 border-l-2 border-slate-200/80 pl-2 space-y-1" : "ml-3 mt-1 border-l border-slate-200 pl-2 space-y-0.5"}`}>
            {item.subMenu.map((sub, idx) => (
              <div key={`${sub.name}-${idx}`}>
                {renderMenu(sub, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`w-72 h-full bg-white flex flex-col border-r border-slate-200 shadow-[4px_0_24px_-12px_rgba(15,23,42,0.25)]
            transition-transform duration-300 transform fixed top-0 left-0 z-50 lg:relative
            ${props?.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Header */}
      <div className="border-b border-slate-100 bg-white px-3 pt-3 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-[11px] font-extrabold tracking-[0.18em] text-slate-400">WORKSPACE</p>
          <button
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
            onClick={() => props?.setSidebarOpen(!props?.sidebarOpen)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <TbLayoutSidebarRightExpand className="h-[18px] w-[18px]" />
          </button>
        </div>

        <SchoolBadgeCard
          schoolName={props?.config?.school?.full_name}
          schoolBranch={props?.config?.school?.board?.name}
          schoolImage={props?.config?.school?.img_logo}
          smsBalance={props?.config?.sms_balance?.count}
        />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <p className="px-5 pt-4 pb-2 text-[11px] font-extrabold tracking-[0.18em] text-slate-400">MAIN NAVIGATION</p>
        <nav className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
          {menuItems.map((item) => renderMenu(item))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/70">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-slate-800 leading-none">System Online</p>
            <p className="text-[11px] font-medium text-slate-500 mt-1 leading-none">v1.0 • ERP Ready</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
// ===============================================================
