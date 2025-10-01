"use client";

import React, { useRef } from "react";
import { useClickOutside } from "./primitives";

export const DropdownMenu = ({ children, align, open, onClose }: any) => {
  const dropdownRef = useRef<HTMLElement | null>(null);
  useClickOutside(dropdownRef as React.RefObject<HTMLElement>, onClose);

  if (!open) return null;

  return (
    <div
      ref={dropdownRef as any}
      className={`origin-top-right absolute ${
        align === "end" ? "right-0" : "left-0"
      } mt-2 w-48 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-center gap-2 text-gray-300 px-4 py-2 text-sm hover:bg-zinc-700"
    role="menuitem"
  >
    {children}
  </button>
);

export const DropdownMenuSeparator = () => (
  <hr className="border-zinc-700 my-1" />
);
export const DropdownMenuLabel = ({ children }: any) => (
  <div className="px-4 py-2 text-sm text-gray-400">{children}</div>
);
