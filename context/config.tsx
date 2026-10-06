// "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { fetchDashboardConfig } from "@/lib/api";

// type DashboardConfig = any; // later replace with proper types

// const ConfigContext = createContext<DashboardConfig | null>(null);

// export function ConfigProvider({ children }: { children: React.ReactNode }) {
//     const [config, setConfig] = useState<DashboardConfig | null>(null);

//     useEffect(() => {
//         async function loadConfig() {
//             const data = await fetchDashboardConfig();
//             setConfig(data.results);
//             // 🔑 cache locally
//             localStorage.setItem("dashboard_config", JSON.stringify(data.results));
//         }
//         loadConfig();
//     }, []);

//     return (
//         <ConfigContext.Provider value={config}>
//             {children}
//         </ConfigContext.Provider>
//     );
// }

// export function useConfig() {
//     const ctx = useContext(ConfigContext);
//     if (!ctx) throw new Error("useConfig must be inside ConfigProvider");
//     return ctx;
// }
