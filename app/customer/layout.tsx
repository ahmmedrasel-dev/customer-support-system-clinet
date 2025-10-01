"use client";

import { CustomerDashboardLayout } from "../components/layout/customer-dashboard-layout";
import { ThemeProvider } from "../components/theme-provider";
import "../globals.css";

export default function CustomerRootLayout({
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
          <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
