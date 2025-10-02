"use client";

import { AdminDashboardLayout } from "../components/layout/admin-dashboard-layout";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
