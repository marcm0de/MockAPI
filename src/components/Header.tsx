"use client";

import { useStore } from "@/lib/store";
import { Sun, Moon, Zap } from "lucide-react";

export function Header() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <header className="border-b border-gray-800 dark:border-gray-800 light:border-gray-200 bg-[#1a1a2e] dark:bg-[#1a1a2e] light:bg-white">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white dark:text-white light:text-gray-900 tracking-tight">
              MockAPI
            </h1>
            <p className="text-xs text-gray-500">Local Mock Server Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            v1.0.0
          </a>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100 transition-colors text-gray-400"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
