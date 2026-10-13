"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { HeaderTooltip } from "@/components/ui/header-tooltip";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" aria-label="Toggle theme" disabled>
        <Sun className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "מעבר למצב יום (בהיר)" : "מעבר למצב לילה (כהה)";

  return (
    <HeaderTooltip label={label}>
      <Button
        variant="outline"
        size="icon"
        className="flex items-center justify-center cursor-pointer h-9 w-9 shrink-0"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={label}
        aria-label={label}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 shrink-0" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300 shrink-0" />
        )}
      </Button>
    </HeaderTooltip>
  );
}
