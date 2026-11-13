import React from "react";
import { BookA, BookOpen, MessageSquare, PenTool, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import type { SubmissionType } from "@/types/submission";

interface TypeMeta {
  label: string;
  icon: LucideIcon;
  /** Text color class for the icon */
  text: string;
  /** Soft background class */
  bg: string;
}

export const SUBMISSION_TYPE_META: Record<SubmissionType, TypeMeta> = {
  writing: { label: "כתיבה", icon: PenTool, text: "text-type-writing", bg: "bg-type-writing/10" },
  unseen: { label: "אנסין", icon: BookOpen, text: "text-type-unseen", bg: "bg-type-unseen/10" },
  vocab: { label: "אוצר מילים", icon: BookA, text: "text-type-vocab", bg: "bg-type-vocab/10" },
  conversation: { label: "שיחה", icon: MessageSquare, text: "text-type-conversation", bg: "bg-type-conversation/10" },
};

export function getTypeMeta(type: string | undefined): TypeMeta {
  return SUBMISSION_TYPE_META[(type as SubmissionType) ?? "unseen"] ?? SUBMISSION_TYPE_META.unseen;
}

export function TypeIcon({ type, className }: { type: string | undefined; className?: string }) {
  const meta = getTypeMeta(type);
  const Icon = meta.icon;
  return (
    <span
      className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-md", meta.bg, meta.text, className)}
      aria-label={meta.label}
    >
      <Icon className="size-3.5" />
    </span>
  );
}

export function TypeBadge({ type, className }: { type: string | undefined; className?: string }) {
  const meta = getTypeMeta(type);
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-full px-2 text-2xs font-medium",
        meta.bg,
        meta.text,
        className
      )}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}
