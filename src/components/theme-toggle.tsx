"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Toggle theme" disabled>
        <Sun className="h-4 w-4" />
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
