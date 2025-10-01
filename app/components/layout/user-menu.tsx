"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback, Button } from "./primitives";
import { ChevronDown, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown";

import { useAuth } from "@/components/auth/AuthContext";

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  // Get initials from user's name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-zinc-800"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://placehold.co/100x100/orange/white?text=${getInitials(
              user.name
            )}`}
            alt={user.name}
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left mr-2">
          <div className="text-sm font-medium text-gray-200">{user.name}</div>
          <div className="text-xs text-gray-400 capitalize">{user.role}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
      <DropdownMenu open={isOpen} onClose={() => setIsOpen(false)} align="end">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setIsOpen(false)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4 text-red-500" />
          <span className="text-red-500">Logout</span>
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
};
