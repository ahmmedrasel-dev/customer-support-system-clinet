"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Home,
  Users,
  Ticket,
  Settings,
  Settings2,
  ShieldUser,
} from "lucide-react";

export const Sidebar = ({ isOpen, onClose }: any) => {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/tickets", icon: Ticket, label: "Support Tickets" },
    { href: "/admin/customers", icon: Users, label: "Customers" },
    { href: "/admin/profile", icon: Settings2, label: "Profile" },
    { href: "/admin/all-admin", icon: ShieldUser, label: "Admins" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-800 px-6">
          <Package className="h-7 w-7 text-orange-500" />
          <span className="text-xl font-semibold">Support Admin</span>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-zinc-700 hover:text-white ${
                  isActive
                    ? "bg-zinc-700 text-white font-semibold"
                    : "text-gray-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
