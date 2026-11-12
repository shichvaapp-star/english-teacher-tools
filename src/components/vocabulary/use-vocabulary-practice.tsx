"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  MIDDLE_SCHOOL_EASY,
  MIDDLE_SCHOOL_MEDIUM,
  MIDDLE_SCHOOL_HARD,
  loadSavedWords,
  syncSavedWordsFromFirestore,
  saveWordToBuilder,
  removeWordFromBuilder,
  loadWordStatusOverrides,
  saveWordStatusOverride,
  toggleWordStarred,
  toggleWordMastered,
  inferVocabSource,
  formatVocabSourceLabel,
  formatExerciseDisplayTitle,
  VocabSourceType,
  VocabItem,
} from "@/lib/vocab-storage";
import { submitTaskToDavid } from "@/lib/tutor-engine";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";
import { TeacherAssignment } from "@/types/assignment";
import { SubmissionItem } from "@/types/submission";
import { saveDraft, deleteDraft, getDraftById } from "@/lib/drafts-storage";
import type { InProgressWorkItem, VocabDraftPayload } from "@/types/draft";
import { deterministicShuffle } from "@/components/vocabulary/vocabulary-helpers";

export function useVocabularyPractice() {
  const router = useRouter();
  const { user } = useAuth();

  // Load words saved from reading unseens & manual inputs
  const [savedUnseenWords, setSavedUnseenWords] = useState<VocabItem[]>(() =>
    loadSavedWords(user?.id)
  );

  // Sync saved words whenever active user changes
  useEffect(() => {
    setSavedUnseenWords(loadSavedWords(user?.id));
    if (user?.id) {
      syncSavedWordsFromFirestore(user.id).then((merged) => {
        setSavedUnseenWords(merged);
      });
    }
  }, [user?.id]);

  const [activeCategory, setActiveCategory] = useState<
    "saved" | "grade7" | "grade8" | "grade9" | "assignment"
  >("saved");
  const [isFromDavid, setIsFromDavid] = useState(false);
  const [isTurningInToDavid, setIsTurningInToDavid] = useState(false);
  const [returnToUnseen, setReturnToUnseen] = useState<{
    storyTitle?: string;
    hebrewTitle?: string;
  } | null>(null);

  // Active Teacher Assignment State
  const [activeAssignment, setActiveAssignment] = useState<TeacherAssignment | null>(null);
  const [assignmentWords, setAssignmentWords] = useState<VocabItem[]>([]);
  const [turnInModalOpen, setTurnInModalOpen] = useState(false);
  const [isSubmittingTurnIn, setIsSubmittingTurnIn] = useState(false);
  const [submissionSuccessReceipt, setSubmissionSuccessReceipt] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [completedModes, setCompletedModes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat === "grade7" || cat === "grade8" || cat === "grade9") {
        setActiveCategory(cat);
      }
      if (params.get("from") === "david") {
        setIsFromDavid(true);
      }

      const cameFromUnseen =
        params.get("from") === "unseen" ||
        (typeof document !== "undefined" && document.referrer.includes("/unseen"));
      if (cameFromUnseen) {
        let storyTitle: string | undefined;
        let hebrewTitle: string | undefined;
        try {
          const rawSnap = sessionStorage.getItem("ett_unseen_return_snapshot");
          if (rawSnap) {
            const snap = JSON.parse(rawSnap);
            storyTitle = snap?.currentStory?.title;
            hebrewTitle = snap?.currentStory?.hebrewTitle;
          }
        } catch {}
        setReturnToUnseen({ storyTitle, hebrewTitle });
      }

      // Check if launched from a Teacher Assignment
      const assignId = params.get("assignmentId");
      if (assignId) {
        let found: TeacherAssignment | null = null;
        try {
          const raw = localStorage.getItem("ett_teacher_assignments");
          if (raw) {
            const list = JSON.parse(raw) as TeacherAssignment[];
            found = list.find((a) => a.id === assignId) || null;
          }
        } catch {}

        const applyAssignment = (a: TeacherAssignment) => {
          setActiveAssignment(a);
          if (a.vocabWords && a.vocabWords.length > 0) {
            const items: VocabItem[] = a.vocabWords.map((w, idx) => ({
              id: w.id || `assign-word-${idx}`,
              english: w.english,
              hebrew: w.hebrew,
              // The practice deck has no "preposition" category; show those as phrases.
              partOfSpeech: w.partOfSpeech === "preposition" ? "phrase" : w.partOfSpeech || "noun",
              example: w.example || "",
              level: "Personal Word",
              mastered: false,
              addedAt: new Date().toISOString(),
            }));
            setAssignmentWords(items);
            setActiveCategory("assignment");
          }
        };

        if (found) {
          applyAssignment(found);
        } else if (db) {
          getDoc(doc(db, "assignments", assignId))
            .then((snap) => {
              if (snap.exists()) {
                applyAssignment({ ...(snap.data() as TeacherAssignment), id: snap.id });
              }
            })
            .catch((err) => console.warn("Error fetching assignment:", err));
        }
      }
    }
  }, []);
  const [studyMode, setStudyMode] = useState<"flashcards" | "match" | "quiz" | "bank">("flashcards");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting & Filtering State
  const [sortOption, setSortOption] = useState<
    | "starred_first"
    | "source_type"
    | "source_title"
    | "alpha_asc"
    | "alpha_desc"
    | "hebrew_asc"
    | "unlearned_first"
    | "learned_first"
    | "newest"
  >("starred_first");
  const [filterOption, setFilterOption] = useState<"all" | "starred" | "unlearned" | "learned">("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [exerciseFilter, setExerciseFilter] = useState<string>("all");
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, { starred?: boolean; mastered?: boolean }>
  >({});

  // Flashcard "mastered" set (declared here because the effect below seeds it)
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Sync status overrides when user changes
  useEffect(() => {
    const overrides = loadWordStatusOverrides(user?.id);
    setStatusOverrides(overrides);
    const masteredSet = new Set<string>();
    Object.entries(overrides).forEach(([id, ov]) => {
      if (ov.mastered) masteredSet.add(id);
    });
    savedUnseenWords.forEach((w) => {
      if (w.mastered) masteredSet.add(w.id);
    });
    setMasteredIds((prev) => new Set([...prev, ...masteredSet]));
  }, [user?.id, savedUnseenWords]);

  // Manual Word Input Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWordEng, setNewWordEng] = useState("");
  const [newWordHeb, setNewWordHeb] = useState("");
  const [newWordSentence, setNewWordSentence] = useState("");
  const [newWordPos, setNewWordPos] = useState<"noun" | "verb" | "adjective" | "adverb" | "phrase">("noun");
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Speed Match state
  const [selectedEng, setSelectedEng] = useState<string | null>(null);
  const [selectedHeb, setSelectedHeb] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [matchError, setMatchError] = useState(false);
  const [matchRound, setMatchRound] = useState(1);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Draft Auto-Save & Resumption State
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedTimeText, setLastSavedTimeText] = useState<string | null>(null);
  const [activeDraftPrompt, setActiveDraftPrompt] = useState<InProgressWorkItem | null>(null);

  // Check for saved draft for current vocab category or assignment and auto-restore by default
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const draftIdParam = params.get("draftId");
    let matched: InProgressWorkItem | null = null;

    if (draftIdParam) {
      matched = getDraftById(draftIdParam);
    } else {
      const targetDraftId = activeAssignment
        ? `draft_vocab_assign_${activeAssignment.id}`
        : `draft_vocab_${activeCategory}`;
      matched = getDraftById(targetDraftId);
    }

    if (matched && matched.type === "vocab") {
      const payload = matched.payload as VocabDraftPayload;
      if (
        ((payload.cardIndex ?? 0) > 0 || (payload.masteredIds && payload.masteredIds.length > 0) || (payload.quizIndex ?? 0) > 0) &&
        cardIndex === 0 &&
        masteredIds.size === 0 &&
        quizIndex === 0
      ) {
        if (payload.category && !params.get("assignmentId")) {
          setActiveCategory(payload.category);
        }
        if (payload.cardIndex !== undefined) setCardIndex(payload.cardIndex);
        if (payload.masteredIds && Array.isArray(payload.masteredIds)) {
          setMasteredIds(new Set(payload.masteredIds));
        }
        if (payload.quizIndex !== undefined) setQuizIndex(payload.quizIndex);
        if (payload.quizScore !== undefined) setQuizScore(payload.quizScore);
        if (payload.studyMode) setStudyMode(payload.studyMode);
        if (payload.completedModes && Array.isArray(payload.completedModes)) {
          setCompletedModes(new Set(payload.completedModes));
        }
        setActiveDraftPrompt(matched);
      }
    }
  }, [activeCategory, activeAssignment?.id]);

  // Discard draft and reset progress to start fresh
  const handleDiscardDraft = (draft: InProgressWorkItem) => {
    deleteDraft(draft.id, user?.id);
    setCardIndex(0);
    setMasteredIds(new Set());
    setQuizIndex(0);
    setQuizScore(0);
    setCompletedModes(new Set());
    setActiveDraftPrompt(null);
  };

  // Active word list based on category
  const activePool = useMemo(() => {
    if (activeCategory === "assignment") {
      return assignmentWords;
    }
    if (activeCategory === "saved") {
      return savedUnseenWords;
    }
    if (activeCategory === "grade7") return MIDDLE_SCHOOL_EASY;
    if (activeCategory === "grade8") return MIDDLE_SCHOOL_MEDIUM;
    return MIDDLE_SCHOOL_HARD;
  }, [activeCategory, savedUnseenWords, assignmentWords]);

  // Debounced auto-save hook for vocabulary practice
  useEffect(() => {
    const hasProgress = cardIndex > 0 || masteredIds.size > 0 || quizIndex > 0;
    if (!hasProgress) return;

    setDraftStatus("saving");
    const timer = setTimeout(async () => {
      const draftId = activeAssignment
        ? `draft_vocab_assign_${activeAssignment.id}`
        : `draft_vocab_${activeCategory}`;
      const totalWords = activePool.length || 10;
      const progressCount = Math.max(cardIndex, masteredIds.size, quizIndex);
      const progressPercent = Math.min(100, Math.round((progressCount / totalWords) * 100));

      await saveDraft({
        id: draftId,
        type: "vocab",
        studentId: user?.id || "guest",
        studentName: user?.name,
        title: activeAssignment?.title || `Vocabulary Practice (${activeCategory})`,
        hebrewTitle: activeAssignment?.hebrewTitle || `אוצר מילים (${activeCategory === "saved" ? "מילון אישי" : activeCategory})`,
        progressPercent,
        summaryText: `${masteredIds.size} מילים נשלטו מתוך ${totalWords}`,
        resumeUrl: `/vocabulary?category=${activeCategory}&studyMode=${studyMode}&draftId=${draftId}${
          activeAssignment ? `&assignmentId=${activeAssignment.id}` : ""
        }`,
        assignmentId: activeAssignment?.id || undefined,
        payload: {
          category: activeCategory,
          studyMode,
          cardIndex,
          masteredIds: Array.from(masteredIds),
          quizIndex,
          quizScore,
          completedModes: Array.from(completedModes),
        },
      });
      setDraftStatus("saved");
      setLastSavedTimeText(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }));
    }, 1200);

    return () => clearTimeout(timer);
  }, [cardIndex, masteredIds, quizIndex, quizScore, studyMode, activeCategory, activeAssignment?.id, activePool.length, completedModes, user?.id, user?.name]);

  // Save and exit back to student portal
  const handleSaveAndExit = async () => {
    const hasProgress = cardIndex > 0 || masteredIds.size > 0 || quizIndex > 0;
    if (hasProgress) {
      const draftId = activeAssignment
        ? `draft_vocab_assign_${activeAssignment.id}`
        : `draft_vocab_${activeCategory}`;
      const totalWords = activePool.length || 10;
      const progressCount = Math.max(cardIndex, masteredIds.size, quizIndex);
      const progressPercent = Math.min(100, Math.round((progressCount / totalWords) * 100));

      await saveDraft({
        id: draftId,
        type: "vocab",
        studentId: user?.id || "guest",
        studentName: user?.name,
        title: activeAssignment?.title || `Vocabulary Practice (${activeCategory})`,
        hebrewTitle: activeAssignment?.hebrewTitle || `אוצר מילים (${activeCategory === "saved" ? "מילון אישי" : activeCategory})`,
        progressPercent,
        summaryText: `${masteredIds.size} מילים נשלטו מתוך ${totalWords}`,
        resumeUrl: `/vocabulary?category=${activeCategory}&studyMode=${studyMode}&draftId=${draftId}${
          activeAssignment ? `&assignmentId=${activeAssignment.id}` : ""
        }`,
        assignmentId: activeAssignment?.id || undefined,
        payload: {
          category: activeCategory,
          studyMode,
          cardIndex,
          masteredIds: Array.from(masteredIds),
          quizIndex,
          quizScore,
          completedModes: Array.from(completedModes),
        },
      });
    }
    router.push("/student");
  };

  // Enrich words with persistent status overrides (starred & mastered)
  const enrichedWords = useMemo(() => {
    return activePool.map((w) => {
      const override = statusOverrides[w.id];
      const isMastered =
        override?.mastered !== undefined ? override.mastered : Boolean(w.mastered);
      const isStarred =
        override?.starred !== undefined ? override.starred : Boolean(w.starred);
      return {
        ...w,
        mastered: isMastered,
        starred: isStarred,
      };
    });
  }, [activePool, statusOverrides]);

  // Word statistics for filter pills
  const wordStats = useMemo(() => {
    const total = enrichedWords.length;
    const starred = enrichedWords.filter((w) => w.starred).length;
    const learned = enrichedWords.filter((w) => w.mastered).length;
    const unlearned = total - learned;
    return { total, starred, learned, unlearned };
  }, [enrichedWords]);

  // Distinct exercises (Unseen stories, Writing tasks, Tutor sessions) present in current word pool
  const availableExercises = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        sourceType: VocabSourceType;
        sourceTitle: string;
        displayLabel: string;
        shortLabel: string;
        count: number;
      }
    >();

    enrichedWords.forEach((w) => {
      const src = inferVocabSource(w);
      if (
        src.sourceTitle &&
        (src.sourceType === "unseen" || src.sourceType === "writing" || src.sourceType === "tutor" || src.sourceType === "conversation")
      ) {
        const cleanTitle = src.sourceTitle.trim();
        if (!cleanTitle) return;
        const key = `${src.sourceType}::${cleanTitle.toLowerCase()}`;
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          const formattedTitle = formatExerciseDisplayTitle(src.sourceType, cleanTitle);
          const icon =
            src.sourceType === "unseen"
              ? "📖"
              : src.sourceType === "writing"
              ? "✍️"
              : src.sourceType === "conversation"
              ? "💬"
              : "🤖";
          map.set(key, {
            key,
            sourceType: src.sourceType,
            sourceTitle: cleanTitle,
            displayLabel: `${icon} ${formattedTitle}`,
            shortLabel: formattedTitle,
            count: 1,
          });
        }
      }
    });

    return Array.from(map.values());
  }, [enrichedWords]);

  // Exercises matching the currently selected general sourceFilter (or all if sourceFilter is 'all')
  const exercisesForCurrentSource = useMemo(() => {
    if (
      sourceFilter === "unseen" ||
      sourceFilter === "writing" ||
      sourceFilter === "tutor"
    ) {
      return availableExercises.filter((ex) => ex.sourceType === sourceFilter);
    }
    return availableExercises;
  }, [availableExercises, sourceFilter]);

  // Filter and Sort Active Words
  const filteredWords = useMemo(() => {
    let list = enrichedWords;

    // Filter by status pill
    if (filterOption === "starred") {
      list = list.filter((w) => w.starred);
    } else if (filterOption === "learned") {
      list = list.filter((w) => w.mastered);
    } else if (filterOption === "unlearned") {
      list = list.filter((w) => !w.mastered);
    }

    // Filter by source type or specific exercise when in Personal Word Bank
    if (activeCategory === "saved") {
      if (sourceFilter !== "all") {
        list = list.filter((w) => inferVocabSource(w).sourceType === sourceFilter);
      }

      if (exerciseFilter !== "all") {
        list = list.filter((w) => {
          const src = inferVocabSource(w);
          const wKey = `${src.sourceType}::${(src.sourceTitle || "").trim().toLowerCase()}`;
          return wKey === exerciseFilter;
        });
      }
    }

    // Search query filter (matches English, Hebrew, example sentence, or source title)
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter((w) => {
        const src = inferVocabSource(w);
        const formattedTitle = formatExerciseDisplayTitle(src.sourceType, src.sourceTitle);
        return (
          w.english.toLowerCase().includes(q) ||
          w.hebrew.includes(q) ||
          (w.example && w.example.toLowerCase().includes(q)) ||
          (src.sourceTitle && src.sourceTitle.toLowerCase().includes(q)) ||
          (formattedTitle && formattedTitle.toLowerCase().includes(q)) ||
          (src.sourceCategory && src.sourceCategory.toLowerCase().includes(q))
        );
      });
    }

    const SOURCE_ORDER: Record<VocabSourceType, number> = {
      unseen: 1,
      writing: 2,
      conversation: 3,
      tutor: 4,
      manual: 5,
      curriculum: 6,
    };

    // Sorting
    const sorted = [...list].sort((a, b) => {
      switch (sortOption) {
        case "starred_first":
          if (a.starred && !b.starred) return -1;
          if (!a.starred && b.starred) return 1;
          return a.english.localeCompare(b.english);
        case "source_type": {
          const srcA = inferVocabSource(a);
          const srcB = inferVocabSource(b);
          const orderDiff = (SOURCE_ORDER[srcA.sourceType] || 99) - (SOURCE_ORDER[srcB.sourceType] || 99);
          if (orderDiff !== 0) return orderDiff;
          const catCompare = (srcA.sourceCategory || "").localeCompare(srcB.sourceCategory || "");
          if (catCompare !== 0) return catCompare;
          const titleCompare = (srcA.sourceTitle || "").localeCompare(srcB.sourceTitle || "");
          if (titleCompare !== 0) return titleCompare;
          return a.english.localeCompare(b.english);
        }
        case "source_title": {
          const srcA = inferVocabSource(a);
          const srcB = inferVocabSource(b);
          const titleA = srcA.sourceTitle || formatVocabSourceLabel(a);
          const titleB = srcB.sourceTitle || formatVocabSourceLabel(b);
          const titleCompare = titleA.localeCompare(titleB);
          if (titleCompare !== 0) return titleCompare;
          return a.english.localeCompare(b.english);
        }
        case "alpha_asc":
          return a.english.localeCompare(b.english);
        case "alpha_desc":
          return b.english.localeCompare(a.english);
        case "hebrew_asc":
          return a.hebrew.localeCompare(b.hebrew, "he");
        case "unlearned_first":
          if (!a.mastered && b.mastered) return -1;
          if (a.mastered && !b.mastered) return 1;
          return a.english.localeCompare(b.english);
        case "learned_first":
          if (a.mastered && !b.mastered) return -1;
          if (!a.mastered && b.mastered) return 1;
          return a.english.localeCompare(b.english);
        case "newest":
          return (
            new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [enrichedWords, filterOption, activeCategory, sourceFilter, exerciseFilter, searchQuery, sortOption]);

  // Star & Mastered Handlers
  const handleToggleStar = (wordId: string, currentVal?: boolean) => {
    const nextVal = toggleWordStarred(wordId, Boolean(currentVal), user?.id);
    setStatusOverrides((prev) => ({
      ...prev,
      [wordId]: {
        ...prev[wordId],
        starred: nextVal,
      },
    }));
    setSavedUnseenWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, starred: nextVal } : w))
    );
  };

  const handleToggleMastered = (wordId: string, currentVal?: boolean) => {
    const nextVal = toggleWordMastered(wordId, Boolean(currentVal), user?.id);
    setStatusOverrides((prev) => ({
      ...prev,
      [wordId]: {
        ...prev[wordId],
        mastered: nextVal,
      },
    }));
    setSavedUnseenWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, mastered: nextVal } : w))
    );
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (nextVal) next.add(wordId);
      else next.delete(wordId);
      return next;
    });
  };

  const markCardMastered = (id: string, mastered: boolean) => {
    saveWordStatusOverride(id, { mastered }, user?.id);
    setStatusOverrides((prev) => ({
      ...prev,
      [id]: { ...prev[id], mastered },
    }));
    setSavedUnseenWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, mastered } : w))
    );
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (mastered) next.add(id);
      else next.delete(id);
      return next;
    });
    handleNextCard();
  };

  const currentCard = filteredWords[cardIndex % (filteredWords.length || 1)] || null;

  // Real-time check if English word appears in the example sentence
  const isWordInSentence = useMemo(() => {
    const cleanWord = newWordEng.trim().toLowerCase();
    const cleanSentence = newWordSentence.trim().toLowerCase();
    if (!cleanWord || !cleanSentence) return false;
    return cleanSentence.includes(cleanWord);
  }, [newWordEng, newWordSentence]);

  // Handle saving manually entered word
  const handleSaveCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEng = newWordEng.trim().toLowerCase();
    const cleanHeb = newWordHeb.trim();
    const cleanSent = newWordSentence.trim();

    if (!cleanEng) {
      setFormError("אנא הזינו את המילה באנגלית.");
      return;
    }

    if (!/^[a-zA-Z\s\-']+$/.test(cleanEng)) {
      setFormError("המילה באנגלית צריכה להכיל אותיות באנגלית בלבד.");
      return;
    }

    if (!cleanHeb) {
      setFormError("אנא הזינו תרגום לעברית.");
      return;
    }

    if (!cleanSent) {
      setFormError("חובה להציב את המילה בתוך משפט לדוגמה באנגלית.");
      return;
    }

    if (!cleanSent.toLowerCase().includes(cleanEng)) {
      setFormError(`המשפט חייב להכיל את המילה באנגלית: "${cleanEng}".`);
      return;
    }

    const res = saveWordToBuilder(
      {
        english: cleanEng,
        hebrew: cleanHeb,
        example: cleanSent,
        partOfSpeech: newWordPos,
        level: "Personal Word",
        sourceType: "manual",
        sourceTitle: "הזנה ידנית",
        sourceCategory: "Personal Word",
      },
      user?.id
    );

    if (!res.added) {
      setFormError("המילה כבר קיימת באוצר המילים שלך!");
      return;
    }

    const updated = loadSavedWords(user?.id);
    setSavedUnseenWords(updated);
    setActiveCategory("saved");
    setShowAddModal(false);
    setNewWordEng("");
    setNewWordHeb("");
    setNewWordSentence("");
    setFormError(null);
    setSuccessToast(`✓ המילה "${cleanEng}" נוספה בהצלחה לאוצר המילים האישי שלך!`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // Remove word from personal collection
  const handleDeleteWord = (wordId: string, englishWord: string) => {
    if (confirm(`האם למחוק את המילה "${englishWord}" מאוצר המילים האישי שלך?`)) {
      removeWordFromBuilder(wordId, user?.id);
      const updated = loadSavedWords(user?.id);
      setSavedUnseenWords(updated);
    }
  };

  // Speech pronunciation
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    } catch {}

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;

      const allVoices = window.speechSynthesis.getVoices();
      const preferred = allVoices.find(
        (v) =>
          (v.lang.startsWith("en") || v.lang.startsWith("EN")) &&
          !v.name.toLowerCase().includes("siri") &&
          (v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("enhanced") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("google"))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      const w = window;
      w.__vocabUtterance = utterance;
      setSpeakingWord(text);

      utterance.onend = () => {
        w.__vocabUtterance = null;
        setSpeakingWord((prev) => (prev === text ? null : prev));
      };
      utterance.onerror = (e) => {
        w.__vocabUtterance = null;
        setSpeakingWord((prev) => (prev === text ? null : prev));
        if (e.error !== "canceled" && e.error !== "interrupted" && utterance.voice) {
          const fallback = new SpeechSynthesisUtterance(text);
          fallback.lang = "en-US";
          fallback.rate = 0.9;
          window.speechSynthesis.speak(fallback);
        }
      };
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setSpeakingWord(null);
      console.warn("[vocabulary] handleSpeak error:", err);
    }
  };

  // Flashcard controls
  const handleNextCard = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  // Speed Match Pool
  const matchPool = useMemo(() => {
    return filteredWords.slice(0, 6);
  }, [filteredWords]);

  const shuffledHebrew = useMemo(() => {
    return deterministicShuffle(matchPool, matchRound * 13);
  }, [matchPool, matchRound]);

  const handleMatchClickEng = (id: string) => {
    if (matchedPairs.has(id)) return;
    setSelectedEng(id);
    if (selectedHeb) checkMatch(id, selectedHeb);
  };

  const handleMatchClickHeb = (id: string) => {
    if (matchedPairs.has(id)) return;
    setSelectedHeb(id);
    if (selectedEng) checkMatch(selectedEng, id);
  };

  const checkMatch = (engId: string, hebId: string) => {
    if (engId === hebId) {
      setMatchedPairs((prev) => new Set([...prev, engId]));
      setMasteredIds((prev) => new Set(prev).add(engId));
      setCompletedModes((prev) => new Set(prev).add("match"));
      setSelectedEng(null);
      setSelectedHeb(null);
      setMatchError(false);
    } else {
      setMatchError(true);
      setTimeout(() => {
        setSelectedEng(null);
        setSelectedHeb(null);
        setMatchError(false);
      }, 700);
    }
  };

  // Quiz Pool & Options
  const currentQuizWord = filteredWords[quizIndex % (filteredWords.length || 1)] || null;

  const quizOptions = useMemo(() => {
    if (!currentQuizWord) return [];
    const pool = activePool.length >= 4 ? activePool : MIDDLE_SCHOOL_EASY;
    const others = pool.filter((w) => w.id !== currentQuizWord.id);
    const shuffledOthers = deterministicShuffle(others, (quizIndex + 1) * 7).slice(0, 3);
    const combined = [...shuffledOthers, currentQuizWord];
    return deterministicShuffle(combined, (quizIndex + 1) * 11);
  }, [activePool, currentQuizWord, quizIndex]);

  const handleQuizAnswer = (hebrewChoice: string) => {
    if (!currentQuizWord) return;
    setCompletedModes((prev) => new Set(prev).add("quiz"));
    setSelectedQuizOption(hebrewChoice);
    if (hebrewChoice === currentQuizWord.hebrew) {
      setQuizScore((s) => s + 10);
      setMasteredIds((prev) => new Set(prev).add(currentQuizWord.id));
    }
  };

  const handleTurnInAssignment = async () => {
    if (!activeAssignment) return;
    setIsSubmittingTurnIn(true);

    const pool = assignmentWords.length > 0 ? assignmentWords : activePool;
    const totalWords = pool.length;
    const masteredCount = masteredIds.size;
    const accuracy = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 100;
    const calculatedScore = quizScore > 0 ? Math.min(100, Math.round((quizScore + accuracy) / 2)) : Math.max(80, accuracy);
    const receiptCode = `VOCAB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newSubmission: SubmissionItem = {
      id: `sub-vocab-${Date.now()}`,
      type: "vocab",
      studentId: user?.id || "guest-student",
      studentName: user?.name || "תלמיד/ה",
      studentClass: user?.fullClass || user?.classGrade || activeAssignment.targetClass || "חטיבת ביניים",
      studentGroup: user?.group || activeAssignment.targetGroup || undefined,
      teacherId: activeAssignment.teacherId,
      teacherName: activeAssignment.teacherName,
      assignmentId: activeAssignment.id,
      taskId: activeAssignment.id,
      taskTitle: activeAssignment.title,
      hebrewTitle: activeAssignment.hebrewTitle,
      score: calculatedScore,
      grade: calculatedScore,
      vocabSummary: {
        totalWords,
        masteredCount,
        quizScore: quizScore > 0 ? quizScore : undefined,
        completedModes: Array.from(completedModes),
        wordsPracticed: pool.map((w) => ({
          english: w.english,
          hebrew: w.hebrew,
          partOfSpeech: w.partOfSpeech,
          mastered: masteredIds.has(w.id),
        })),
      },
      submittedAt: new Date().toLocaleString("he-IL"),
      receiptCode,
      status: "submitted",
    };

    // 1. Save to local storage
    try {
      const raw = localStorage.getItem("ett_writing_submissions");
      const list: SubmissionItem[] = raw ? JSON.parse(raw) : [];
      list.unshift(newSubmission);
      localStorage.setItem("ett_writing_submissions", JSON.stringify(list));
    } catch (err) {
      console.warn("Error saving submission locally:", err);
    }

    // 2. Save to Firestore
    if (db) {
      try {
        const payload = cleanForFirestore({
          ...newSubmission,
          timestamp: new Date().toISOString(),
        });
        await setDoc(doc(db, "submissions", newSubmission.id), payload, { merge: true });
      } catch (err) {
        console.warn("Error saving submission to Firestore:", err);
      }
    }

    setIsSubmittingTurnIn(false);
    setTurnInModalOpen(false);
    setSubmissionSuccessReceipt(receiptCode);
    setShowConfetti(true);

    // Clean up in-progress draft
    const draftId = activeAssignment
      ? `draft_vocab_assign_${activeAssignment.id}`
      : `draft_vocab_${activeCategory}`;
    deleteDraft(draftId, user?.id);
  };

  const handleTurnInToDavid = async () => {
    setIsTurningInToDavid(true);
    const pool = activePool.length > 0 ? activePool : MIDDLE_SCHOOL_EASY;
    const vocabToReview = pool.slice(0, 8).map((w) => ({
      word: w.english,
      hebrew: w.hebrew,
      pos: w.partOfSpeech,
      exampleSentence: w.example,
    }));

    const finalScore = studyMode === "quiz" && quizScore > 0 ? Math.min(100, Math.max(75, quizScore)) : 90;

    await submitTaskToDavid(user?.id || "guest", {
      id: `turnin-vocab-${Date.now()}`,
      type: "vocab",
      taskId: activeCategory,
      taskTitle: `Vocabulary Practice (${activeCategory === "saved" ? "Personal Dictionary" : activeCategory})`,
      taskTitleHebrew: "אימון אוצר מילים ממוקד",
      score: finalScore,
      completedAt: new Date().toISOString(),
      strengths: [
        `תרגלת ${Math.max(masteredIds.size, matchedPairs.size, 6)} מילים חדשות בכרטיסיות ובמשחקי הזיכרון!`,
        "חיזקת את הזיכרון החזותי ואת ההקשר של המילים בתוך משפטים.",
      ],
      improvements: [
        {
          suggestion: "Active Recall Practice",
          explanationHebrew: "כעת נערוך מבדק קצר על 5-8 מילים מתוך התרגול כדי לוודא שהן יושבות היטב בזיכרון.",
        },
      ],
      vocabToReview,
    });

    if (typeof window !== "undefined") {
      router.push("/tutor?turnIn=1");
    }
  };


  return {
    router,
    user,
    savedUnseenWords,
    setSavedUnseenWords,
    activeCategory,
    setActiveCategory,
    isFromDavid,
    setIsFromDavid,
    isTurningInToDavid,
    setIsTurningInToDavid,
    returnToUnseen,
    setReturnToUnseen,
    activeAssignment,
    setActiveAssignment,
    assignmentWords,
    setAssignmentWords,
    turnInModalOpen,
    setTurnInModalOpen,
    isSubmittingTurnIn,
    setIsSubmittingTurnIn,
    submissionSuccessReceipt,
    setSubmissionSuccessReceipt,
    showConfetti,
    setShowConfetti,
    copiedReceipt,
    setCopiedReceipt,
    completedModes,
    setCompletedModes,
    studyMode,
    setStudyMode,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    sourceFilter,
    setSourceFilter,
    exerciseFilter,
    setExerciseFilter,
    statusOverrides,
    setStatusOverrides,
    masteredIds,
    setMasteredIds,
    showAddModal,
    setShowAddModal,
    newWordEng,
    setNewWordEng,
    newWordHeb,
    setNewWordHeb,
    newWordSentence,
    setNewWordSentence,
    newWordPos,
    setNewWordPos,
    formError,
    setFormError,
    successToast,
    setSuccessToast,
    cardIndex,
    setCardIndex,
    isFlipped,
    setIsFlipped,
    selectedEng,
    setSelectedEng,
    selectedHeb,
    setSelectedHeb,
    matchedPairs,
    setMatchedPairs,
    matchError,
    setMatchError,
    matchRound,
    setMatchRound,
    quizIndex,
    setQuizIndex,
    selectedQuizOption,
    setSelectedQuizOption,
    quizScore,
    setQuizScore,
    draftStatus,
    setDraftStatus,
    lastSavedTimeText,
    setLastSavedTimeText,
    activeDraftPrompt,
    setActiveDraftPrompt,
    handleDiscardDraft,
    activePool,
    handleSaveAndExit,
    enrichedWords,
    wordStats,
    availableExercises,
    exercisesForCurrentSource,
    filteredWords,
    handleToggleStar,
    handleToggleMastered,
    markCardMastered,
    currentCard,
    isWordInSentence,
    handleSaveCustomWord,
    handleDeleteWord,
    speakingWord,
    setSpeakingWord,
    handleSpeak,
    handleNextCard,
    handlePrevCard,
    matchPool,
    shuffledHebrew,
    handleMatchClickEng,
    handleMatchClickHeb,
    checkMatch,
    currentQuizWord,
    quizOptions,
    handleQuizAnswer,
    handleTurnInAssignment,
    handleTurnInToDavid,
  };
}

export type VocabularyPracticeController = ReturnType<typeof useVocabularyPractice>;
