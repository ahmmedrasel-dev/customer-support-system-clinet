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

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-zinc-800"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="https://placehold.co/100x100/orange/white?text=A"
            alt="Admin"
          />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
      <DropdownMenu open={isOpen} onClose={() => setIsOpen(false)} align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setIsOpen(false)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsOpen(false)}>
          <LogOut className="mr-2 h-4 w-4 text-red-500" />
          <span className="text-red-500">Logout</span>
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
};
