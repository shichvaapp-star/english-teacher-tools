"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" aria-label="Toggle theme" disabled>
        <Sun className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to Comfort Reading Mode (Light)" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-medium">Comfort Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-slate-700" />
          <span className="text-xs font-medium">Dark Mode</span>
        </>
      )}
    </Button>
  );
}
