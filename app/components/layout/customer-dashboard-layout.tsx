"use client";

import React, { useState } from "react";
import { Header } from "./header";
import { usePathname } from "next/navigation";
import { CustomerSidebar } from "./customer-sidebar";

interface Props {
  children: React.ReactNode;
}

export function CustomerDashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
      : "Dashboard";
  };

  return (
    <div className="min-h-screen w-full bg-zinc-700 text-gray-50 dark:bg-zinc-800 dark:text-gray-50">
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-col md:pl-64 h-screen">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={getPageTitle()}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
