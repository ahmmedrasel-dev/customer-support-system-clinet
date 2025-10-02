"use client";

import { CustomerDashboardLayout } from "../components/layout/customer-dashboard-layout";

export default function CustomerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>;
}
