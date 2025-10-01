"use client";

import React, { useEffect } from "react";

export const Avatar = ({ children, className }: any) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
  >
    {children}
  </div>
);
export const AvatarImage = ({ src, alt }: any) => (
  <img src={src} alt={alt} className="aspect-square h-full w-full" />
);
export const AvatarFallback = ({ children }: any) => (
  <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
    {children}
  </span>
);

export const Button = ({
  variant,
  size,
  className,
  children,
  ...props
}: any) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    ghost: "hover:bg-zinc-700 hover:text-accent-foreground",
  };
  const sizes: Record<string, string> = { icon: "h-10 w-10" };
  const variantClass = variants[variant] || "";
  const sizeClass = sizes[size] || "px-4 py-2";
  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
