"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SiteSuggestion, SuggestionType } from "@/types/suggestion";
import {
  Bug,
  Edit3,
  Lightbulb,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
} from "lucide-react";

interface SuggestEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: {
  type: SuggestionType;
  label: string;
  hebrewLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    type: "edit",
    label: "Edit / Improvement",
    hebrewLabel: "הצעת עריכה",
    icon: Edit3,
    color: "text-blue-500 border-blue-500/30 bg-blue-500/10",
  },
  {
    type: "bug",
    label: "Bug / Glitch",
    hebrewLabel: "דיווח על באג",
    icon: Bug,
    color: "text-red-500 border-red-500/30 bg-red-500/10",
  },
  {
    type: "content",
    label: "Content / Text Fix",
    hebrewLabel: "תיקון תוכן / טקסט",
    icon: BookOpen,
    color: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  },
  {
    type: "feature",
    label: "New Idea / Feature",
    hebrewLabel: "רעיון חדש",
    icon: Lightbulb,
    color: "text-purple-500 border-purple-500/30 bg-purple-500/10",
  },
];

export function SuggestEditDialog({ open, onOpenChange }: SuggestEditDialogProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const [selectedType, setSelectedType] = useState<SuggestionType>("edit");
  const [message, setMessage] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setError(null);
      setMessage("");
      if (typeof document !== "undefined") {
        setPageTitle(document.title || pathname || "");
      }
    }
  }, [open, pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter your note or suggestion before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const suggestionId = `sugg_${Date.now()}`;
    const newSuggestion: SiteSuggestion = {
      id: suggestionId,
      teacherId: user?.id || "guest-teacher",
      teacherName: user?.name || "Teacher",
      teacherEmail: user?.email || "",
      schoolName: user?.schoolName || "Ben Gurion Middle School",
      type: selectedType,
      message: message.trim(),
      pageUrl: pathname || "/",
      pageTitle: pageTitle || undefined,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Save to Firestore
      if (db) {
        try {
          await setDoc(doc(db, "site_suggestions", suggestionId), newSuggestion);
        } catch (dbErr) {
          console.warn("Firestore save suggestion note:", dbErr);
        }
      }

      // 2. Save to local storage for offline / sync resilience
      try {
        const storedRaw = localStorage.getItem("ett_site_suggestions");
        const list: SiteSuggestion[] = storedRaw ? JSON.parse(storedRaw) : [];
        list.unshift(newSuggestion);
        localStorage.setItem("ett_site_suggestions", JSON.stringify(list));
      } catch (storageErr) {
        console.warn("LocalStorage save suggestion note:", storageErr);
      }

      setIsSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err: unknown) {
      console.error("Error submitting suggestion:", err);
      setError("Failed to save suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 bg-card border-border shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-1.5 pb-2 text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground tracking-tight">
                Suggest Edit or Report Bug
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Your feedback goes directly to the site admin to plan and implement changes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in-95">
            <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">Thank you for your feedback!</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Your suggestion has been logged and sent to the administrator.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Category chips */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Feedback Type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedType === cat.type;
                  return (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() => setSelectedType(cat.type)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition cursor-pointer text-center gap-1 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/20"
                          : "border-border/70 hover:border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Page Context (read only pill) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-[11px] text-muted-foreground font-mono">
              <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">Page: {pathname || "/"}</span>
            </div>

            {/* Note Textarea */}
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Your Note / Suggestion:
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what should be added, changed, or fixed. Feel free to include exact wording, question numbers, or instructions..."
                rows={4}
                className="resize-none text-sm leading-relaxed"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-muted-foreground">
                Sent as: <span className="font-semibold text-foreground">{user?.name || "Teacher"}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !message.trim()}
                  className="gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? "Sending..." : "Submit"}</span>
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
