import {
  BookA,
  ClipboardList,
  Home,
  Inbox,
  MessageSquarePlus,
  Share2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export const DASHBOARD_BASE = "/teacher/dashboard";

export type NavKey = "home" | "turnIns" | "assignments" | "students" | "banks" | "shared" | "adminTeachers" | "suggestions";

export interface NavItem {
  key: NavKey;
  href: string;
  label: string;
  icon: LucideIcon;
  admin?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: DASHBOARD_BASE, label: "סקירה", icon: Home },
  { key: "turnIns", href: `${DASHBOARD_BASE}/turn-ins`, label: "הגשות", icon: Inbox },
  { key: "assignments", href: `${DASHBOARD_BASE}/assignments`, label: "משימות", icon: ClipboardList },
  { key: "students", href: `${DASHBOARD_BASE}/students`, label: "תלמידים", icon: Users },
  { key: "banks", href: `${DASHBOARD_BASE}/banks`, label: "מאגרי מילים", icon: BookA },
  { key: "shared", href: `${DASHBOARD_BASE}/shared`, label: "מאגר משותף", icon: Share2 },
  { key: "adminTeachers", href: `${DASHBOARD_BASE}/admin/teachers`, label: "ניהול מורים", icon: ShieldCheck, admin: true },
  { key: "suggestions", href: `${DASHBOARD_BASE}/admin/suggestions`, label: "הצעות ומשוב", icon: MessageSquarePlus, admin: true },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === DASHBOARD_BASE) return pathname === DASHBOARD_BASE;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export const turnInHref = (id: string) => `${DASHBOARD_BASE}/turn-ins?id=${encodeURIComponent(id)}`;
export const assignmentHref = (id: string) => `${DASHBOARD_BASE}/assignments/${encodeURIComponent(id)}`;
