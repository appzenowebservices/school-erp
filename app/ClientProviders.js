"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/auth";
// import { ConfigProvider } from "../context/config";
import { useRef } from "react";

export default function ClientProviders({ children }) {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>

      <AuthProvider>
        {/* <ConfigProvider> */}
          {children}
        {/* </ConfigProvider> */}
      </AuthProvider>
    </QueryClientProvider>  
  );
}