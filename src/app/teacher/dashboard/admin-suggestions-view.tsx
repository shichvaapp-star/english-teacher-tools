"use client";

import React, { useState } from "react";
import { SiteSuggestion, SuggestionStatus, SuggestionType } from "@/types/suggestion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/teacher-dashboard/shared-ui/filter-select";
import {
  Search,
  Check,
  Trash2,
  ExternalLink,
  Sparkles,
  Bug,
  Edit3,
  BookOpen,
  Lightbulb,
  Clock,
  User,
  School,
  CheckCircle2,
  RefreshCw,
  MessageSquarePlus,
} from "lucide-react";
import Link from "next/link";

interface AdminSuggestionsViewProps {
  suggestions: SiteSuggestion[];
  onRefresh: () => void;
  isLoading: boolean;
  onUpdateSuggestion: (id: string, updates: Partial<SiteSuggestion>) => Promise<void>;
  onDeleteSuggestion: (id: string) => Promise<void>;
}

export function AdminSuggestionsView({
  suggestions,
  onRefresh,
  isLoading,
  onUpdateSuggestion,
  onDeleteSuggestion,
}: AdminSuggestionsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Filtered list
  const filteredSuggestions = suggestions.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (s.message || "").toLowerCase();
      const matchName = (s.teacherName || "").toLowerCase();
      const matchSchool = (s.schoolName || "").toLowerCase();
      const matchPage = (s.pageUrl || "").toLowerCase();
      if (!matchText.includes(q) && !matchName.includes(q) && !matchSchool.includes(q) && !matchPage.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const newCount = suggestions.filter((s) => s.status === "new").length;

  // Generate single prompt for AI
  const handleCopySingle = (s: SiteSuggestion) => {
    const prompt = `User suggestion from teacher ${s.teacherName}${s.teacherEmail ? ` (${s.teacherEmail})` : ""}${s.schoolName ? ` [${s.schoolName}]` : ""} on page \`${s.pageUrl}\` (type: ${s.type}):
"""
${s.message}
"""

Please figure out a plan to implement this suggestion.`;

    navigator.clipboard.writeText(prompt);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate batch prompt for all "new" suggestions
  const handleCopyAllNew = () => {
    const newItems = suggestions.filter((s) => s.status === "new");
    if (newItems.length === 0) return;

    let batch = `Here are ${newItems.length} unedited site suggestion(s) and bug report(s) from teachers:\n\n`;
    newItems.forEach((item, index) => {
      batch += `### Suggestion ${index + 1} (${item.type.toUpperCase()}) by ${item.teacherName} on \`${item.pageUrl}\`\n`;
      batch += `Date: ${new Date(item.createdAt).toLocaleDateString()}\n`;
      batch += `"""\n${item.message}\n"""\n\n`;
    });
    batch += `Please review these suggestions and figure out an implementation plan for them.`;

    navigator.clipboard.writeText(batch);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  const getTypeBadge = (type: SuggestionType) => {
    switch (type) {
      case "bug":
        return (
          <Badge variant="outline" className="gap-1 border-destructive/30 bg-destructive/10 text-destructive">
            <Bug className="h-3 w-3" />
            <span>Bug</span>
          </Badge>
        );
      case "edit":
        return (
          <Badge variant="outline" className="gap-1 border-info/30 bg-info/10 text-info">
            <Edit3 className="h-3 w-3" />
            <span>Edit</span>
          </Badge>
        );
      case "content":
        return (
          <Badge variant="outline" className="gap-1 border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning">
            <BookOpen className="h-3 w-3" />
            <span>Content</span>
          </Badge>
        );
      case "feature":
        return (
          <Badge variant="outline" className="gap-1 border-admin/30 bg-admin/10 text-admin">
            <Lightbulb className="h-3 w-3" />
            <span>Feature</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <span>{type}</span>
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: SuggestionStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-warning/15 text-warning-foreground dark:text-warning border border-warning/30">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
            New
          </span>
        );
      case "planned":
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-info/15 text-info border border-info/30">
            Planned
          </span>
        );
      case "implemented":
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
            <CheckCircle2 className="h-3 w-3" />
            Done
          </span>
        );
      case "dismissed":
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Dismissed
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border/70 rounded-2xl p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Site Suggestions & Edits
            </h2>
            {newCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-warning/15 text-warning-foreground dark:text-warning font-semibold border border-warning/30">
                {newCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quick notes, edit suggestions, and bug reports sent by teachers. Copy prompts to AI to generate implementation plans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={handleCopyAllNew}
              className="gap-1.5 cursor-pointer bg-primary text-primary-foreground shadow-xs text-xs"
            >
              {copiedBatch ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied All {newCount} Suggestions!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Copy All New ({newCount}) for AI</span>
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1 text-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-card/60 p-2 rounded-xl border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suggestions, teachers, pages..."
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <FilterSelect
            aria-label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: `All Statuses (${suggestions.length})` },
              { value: "new", label: `New (${newCount})` },
              { value: "planned", label: "Planned" },
              { value: "implemented", label: "Implemented" },
              { value: "dismissed", label: "Dismissed" },
            ]}
          />
          <FilterSelect
            aria-label="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "All Types" },
              { value: "edit", label: "Edits" },
              { value: "bug", label: "Bugs" },
              { value: "content", label: "Content" },
              { value: "feature", label: "Features" },
            ]}
          />
        </div>
      </div>

      {/* Suggestion list */}
      {filteredSuggestions.length === 0 ? (
        <Card className="p-8 text-center bg-card/50 border-dashed border-border/70 rounded-2xl">
          <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-foreground">No suggestions found</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filters."
                : "No teacher notes or bug reports have been submitted yet."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredSuggestions.map((item) => {
            const isCopied = copiedId === item.id;
            const formattedDate = new Date(item.createdAt).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={item.id}
                className={`transition-all border rounded-xl overflow-hidden ${
                  item.status === "new"
                    ? "border-warning/40 bg-card shadow-xs"
                    : "border-border/70 bg-card/70"
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Top row: Type, Status, Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeBadge(item.type)}
                      {getStatusBadge(item.status)}

                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Copy for AI button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopySingle(item)}
                        className={`h-7 px-2.5 text-xs gap-1 cursor-pointer transition ${
                          isCopied
                            ? "bg-success/10 border-success/30 text-success"
                            : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        }`}
                        title="Copy unedited prompt for Antigravity AI"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Copied Prompt!</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span>Copy for AI</span>
                          </>
                        )}
                      </Button>

                      {/* Status select */}
                      <select
                        value={item.status}
                        onChange={(e) =>
                          onUpdateSuggestion(item.id, {
                            status: e.target.value as SuggestionStatus,
                          })
                        }
                        className="h-7 px-2 text-2xs rounded-md border border-border bg-background text-foreground cursor-pointer"
                      >
                        <option value="new">Status: New</option>
                        <option value="planned">Status: Planned</option>
                        <option value="implemented">Status: Implemented</option>
                        <option value="dismissed">Status: Dismissed</option>
                      </select>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteSuggestion(item.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete suggestion"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Teacher & Page Context */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {item.teacherName}
                      {item.teacherEmail && (
                        <span className="text-muted-foreground font-normal">({item.teacherEmail})</span>
                      )}
                    </span>

                    {item.schoolName && (
                      <span className="flex items-center gap-1">
                        <School className="h-3 w-3" />
                        {item.schoolName}
                      </span>
                    )}

                    <span className="flex items-center gap-1 font-mono text-2xs">
                      <ExternalLink className="h-3 w-3" />
                      Page: <Link href={item.pageUrl} className="text-primary hover:underline">{item.pageUrl}</Link>
                    </span>
                  </div>

                  {/* Unedited Raw Message */}
                  <div className="bg-background/80 border border-border/80 rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed select-text font-sans">
                    {item.message}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
