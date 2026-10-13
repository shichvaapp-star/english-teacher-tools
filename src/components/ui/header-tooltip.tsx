"use client";

import React from "react";

interface HeaderTooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "bottom" | "top";
  align?: "center" | "end" | "start";
  className?: string;
}

export function HeaderTooltip({
  label,
  children,
  side = "bottom",
  align = "center",
  className = "",
}: HeaderTooltipProps) {
  return (
    <div className={`relative group/ht inline-flex items-center justify-center ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background shadow-md opacity-0 group-hover/ht:opacity-100 transition-all duration-150 ease-out select-none ${
          side === "bottom"
            ? "top-full mt-2 translate-y-0.5 group-hover/ht:translate-y-0"
            : "bottom-full mb-2 -translate-y-0.5 group-hover/ht:translate-y-0"
        } ${
          align === "center"
            ? "left-1/2 -translate-x-1/2"
            : align === "end"
            ? "right-0"
            : "left-0"
        }`}
      >
        {label}
        <div
          className={`absolute h-1.5 w-1.5 rotate-45 bg-foreground ${
            side === "bottom" ? "-top-0.5" : "-bottom-0.5"
          } ${
            align === "center"
              ? "left-1/2 -translate-x-1/2"
              : align === "end"
              ? "right-3"
              : "left-3"
          }`}
        />
      </div>
    </div>
  );
}
