"use client";

import React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "./primitives";
import { ThemeToggle } from "./theme";
import { UserMenu } from "./user-menu";

export const Header = ({ onMenuClick, pageTitle }: any) => (
  <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-900/80 px-4 backdrop-blur-sm sm:px-6">
    <button
      className="rounded-full p-2 text-gray-400 hover:bg-zinc-800 hover:text-white md:hidden"
      onClick={onMenuClick}
      aria-label="Open sidebar"
    >
      <Menu className="h-6 w-6" />
    </button>
    <h1 className="hidden text-xl font-semibold md:block">{pageTitle}</h1>
    <div className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <input
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg border border-zinc-800 bg-zinc-800/50 pl-8 pr-2 py-2 text-sm text-gray-300 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 md:w-[200px] lg:w-[320px]"
      />
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-gray-400 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <ThemeToggle />
      <UserMenu />
    </div>
  </header>
);
