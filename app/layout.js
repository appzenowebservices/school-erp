// "use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState, useEffect } from "react";
import { AuthProvider } from "../context/auth";
import ClientProviders from "./ClientProviders";
import { StudentProvider } from "../context/studentContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ensure QueryClient is created outside the component to avoid recreation on every render
const queryClient = new QueryClient();

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <head>
        <title>infoEIGHT - Web Portal</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          <StudentProvider>

            {children}
          </StudentProvider>
        </ClientProviders>
        {/* <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider> */}
      </body>
    </html>
  );
}