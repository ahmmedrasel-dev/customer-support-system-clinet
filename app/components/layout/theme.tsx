"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./primitives";
import { DropdownMenu, DropdownMenuItem } from "./dropdown";

const ThemeContext = createContext<any>({ theme: "dark", setTheme: () => {} });

export const ThemeProviderLocal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeLocal = () => useContext(ThemeContext);

export const ThemeToggle = () => {
  const { setTheme } = useThemeLocal();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-gray-400 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <DropdownMenu open={isOpen} onClose={() => setIsOpen(false)} align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
            setIsOpen(false);
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
            setIsOpen(false);
          }}
        >
          Dark
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
};
