"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ThemeProviderLocal } from "./theme";

export function AdminDashboardLayout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = "Dashboard";

  return (
    <div className="min-h-screen w-full bg-zinc-700 text-gray-50 dark:bg-zinc-800 dark:text-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col md:pl-64 h-screen">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
