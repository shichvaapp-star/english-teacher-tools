"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Dice5,
  X,
  Check,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenLibraryGrid({ c }: { c: UnseenPracticeController }) {
  const {
    currentStory,
    filteredLibraryStories,
    handleRandomStorySelect,
    handleStorySelect,
    levelStories,
    librarySearchQuery,
    setLibrarySearchQuery,
    storySourceTab,
  } = c;
  return (
    <>
      {/* Library Stories Grid */}
      {storySourceTab === "library" && (
        <div className="space-y-2.5 pt-1">
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="חיפוש קטע קריאה לפי כותרת או מילים..."
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                className="pr-8 text-xs h-8 text-right rtl font-hebrew bg-background/70 border-border/70"
              />
              {librarySearchQuery && (
                <button
                  type="button"
                  onClick={() => setLibrarySearchQuery("")}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <span className="text-[11px] text-muted-foreground font-hebrew">
                מוצגים {filteredLibraryStories.length} מתוך {levelStories.length} קטעים
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRandomStorySelect}
                className="h-8 text-xs gap-1.5 cursor-pointer border-primary/30 text-primary hover:bg-primary/10 font-hebrew shrink-0"
              >
                <Dice5 className="h-3.5 w-3.5" />
                <span>בחירה אקראית</span>
              </Button>
            </div>
          </div>

          {/* Grid */}
          {filteredLibraryStories.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-border/80 text-center space-y-2">
              <p className="text-xs text-muted-foreground font-hebrew">
                לא נמצאו קטעי קריאה התואמים לחיפוש &quot;{librarySearchQuery}&quot;
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLibrarySearchQuery("")}
                className="text-xs text-primary font-hebrew h-7"
              >
                איפוס חיפוש
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-84 overflow-y-auto pr-1">
              {filteredLibraryStories.map((story) => {
                const isSelected = story.id === currentStory.id;
                const storyIndex = levelStories.findIndex((s) => s.id === story.id) + 1;
                const wordCount = story.paragraphs.join(" ").split(/\s+/).length;

                return (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => handleStorySelect(story.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2.5 text-right ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                        : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="min-w-0 flex-1">
                        {/* English Title with explicit LTR */}
                        <div
                          className="text-left font-sans font-semibold text-xs sm:text-sm text-foreground line-clamp-1"
                          dir="ltr"
                        >
                          {story.title}
                        </div>
                        {/* Hebrew Subtitle */}
                        <div
                          className="text-right font-hebrew text-xs text-muted-foreground mt-0.5 line-clamp-1"
                          dir="rtl"
                        >
                          {story.hebrewTitle}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono px-1.5 py-0 h-5 text-muted-foreground border-border/80"
                        >
                          #{storyIndex}
                        </Badge>
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Meta */}
                    <div
                      className="flex items-center justify-between text-[10px] text-muted-foreground/80 pt-1.5 border-t border-border/40 font-hebrew"
                      dir="rtl"
                    >
                      <span>
                        {wordCount} מילים • {story.questions.length} שאלות
                      </span>
                      <span className="text-primary font-medium">100 נקודות</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
