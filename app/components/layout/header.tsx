"use client";

import React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme";
import { UserMenu } from "./user-menu";

export const Header = ({ onMenuClick, pageTitle }: any) => (
  <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
    <button
      className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
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
        className="w-full rounded-lg border border-input bg-background pl-8 pr-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring md:w-[200px] lg:w-[320px]"
      />
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-muted-foreground hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <ThemeToggle />
      <UserMenu />
    </div>
  </header>
);
