"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NAV_ITEMS, isNavItemActive, type NavKey } from "./nav-items";

interface DashboardNavProps {
  isAdmin: boolean;
  counts: Partial<Record<NavKey, number>>;
  /** Highlighted counts (e.g. pending turn-ins) get an attention color */
  attention: Partial<Record<NavKey, boolean>>;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function DashboardNav({ isAdmin, counts, attention, collapsed = false, onNavigate }: DashboardNavProps) {
  const pathname = usePathname() ?? "";
  const main = NAV_ITEMS.filter((i) => !i.admin);
  const admin = isAdmin ? NAV_ITEMS.filter((i) => i.admin) : [];

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => {
    const active = isNavItemActive(item, pathname);
    const count = counts[item.key];
    const Icon = item.icon;
    const link = (
      <Link
        key={item.key}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        <Icon className={cn("size-4 shrink-0", active && "text-sidebar-foreground")} />
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        {count !== undefined && count > 0 && (
          <span
            className={cn(
              "rounded-full text-3xs font-semibold tabular-nums",
              collapsed ? "absolute top-1 left-1 size-2 p-0 text-transparent" : "min-w-5 px-1.5 py-0.5 text-center",
              attention[item.key] ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {count}
          </span>
        )}
      </Link>
    );
    if (!collapsed) return link;
    return (
      <Tooltip key={item.key}>
        <TooltipTrigger render={link} />
        <TooltipContent side="left">{item.label}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <nav className="flex flex-col gap-1" aria-label="ניווט לוח מורה">
      {main.map(renderItem)}
      {admin.length > 0 && (
        <>
          <div className={cn("mt-4 mb-1 px-2.5 text-3xs font-semibold tracking-wide text-muted-foreground uppercase", collapsed && "sr-only")}>
            ניהול מערכת
          </div>
          {collapsed && <div className="my-2 h-px bg-sidebar-border" />}
          {admin.map(renderItem)}
        </>
      )}
    </nav>
  );
}
