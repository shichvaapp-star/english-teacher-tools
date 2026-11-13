"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "cn";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
  "aria-label"?: string;
}

/** Compact select bound to a list of {value,label} options, so the trigger shows the label. */
export function FilterSelect({ value, onChange, options, className, ...rest }: FilterSelectProps) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => {
        if (typeof v === "string") onChange(v);
      }}
    >
      <SelectTrigger size="sm" className={cn("min-w-32 text-xs", className)} aria-label={rest["aria-label"]}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-xs">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
