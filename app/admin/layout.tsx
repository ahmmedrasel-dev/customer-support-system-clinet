"use client";

import { AuthProvider } from "@/components/auth/AuthContext";
import { AdminDashboardLayout } from "../components/layout/admin-dashboard-layout";
import { ThemeProvider } from "../components/theme-provider";
import "../globals.css";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AdminDashboardLayout>{children}</AdminDashboardLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
