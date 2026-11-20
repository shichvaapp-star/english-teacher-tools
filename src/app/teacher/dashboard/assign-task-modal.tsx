"use client";

import React from "react";
import { Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useViewMode } from "@/components/shared/wizard/view-mode";
import { ViewModeToggle } from "@/components/shared/wizard/view-mode-toggle";
import { useAssignTaskForm, type AssignTaskFormProps } from "@/components/teacher-dashboard/assign/use-assign-task-form";
import { AssignTaskClassicForm } from "@/components/teacher-dashboard/assign/assign-task-classic-form";
import { AssignTaskWizard } from "@/components/teacher-dashboard/assign/assign-task-wizard";

/** "Assign a task" dialog: step-by-step by default, or everything on one screen. */
export function AssignTaskModal(props: AssignTaskFormProps) {
  const { open, onOpenChange } = props;
  const f = useAssignTaskForm(props);
  const [mode, setMode] = useViewMode("assignTask");
  const wizard = mode === "wizard";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-h-[90vh] overflow-y-auto", wizard ? "sm:max-w-3xl" : "max-w-xl")} dir="rtl">
        <DialogHeader className="text-right">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-admin/10 text-admin">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-black text-foreground">
                הקצאת משימה לתלמידים
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                הקצו מטלת כתיבה או מבחן הבנת הנקרא לכיתה, להקבצה או לתלמידים בודדים.
              </DialogDescription>
            </div>
          </div>
          <ViewModeToggle mode={mode} onChange={setMode} className="self-start" />
        </DialogHeader>

        {wizard ? (
          <AssignTaskWizard f={f} startAt={f.hasTemplate ? "audience" : "type"} />
        ) : (
          <AssignTaskClassicForm f={f} onCancel={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
