"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import {
  MIDDLE_SCHOOL_EASY,
  MIDDLE_SCHOOL_MEDIUM,
  MIDDLE_SCHOOL_HARD,
  loadSavedWords,
  saveWordToBuilder,
  removeWordFromBuilder,
  loadWordStatusOverrides,
  saveWordStatusOverride,
  toggleWordStarred,
  toggleWordMastered,
  VocabItem,
} from "@/lib/vocab-storage";
import { submitTaskToDavid } from "@/lib/tutor-engine";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { cleanForFirestore, cn } from "@/lib/utils";
import { TeacherAssignment } from "@/types/assignment";
import { SubmissionItem } from "@/types/submission";
import { saveDraft, deleteDraft, getDraftById, findDraft } from "@/lib/drafts-storage";
import type { InProgressWorkItem } from "@/types/draft";
import { Confetti } from "@/components/confetti";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookA,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  Printer,
  BookMarked,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Sparkles,
  Check,
  BookOpen,
  GraduationCap,
  Send,
  Copy,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCheck,
  Bookmark,
  Save,
  Clock,
} from "lucide-react";

// Pure deterministic shuffle helper
function deterministicShuffle<T extends { id: string }>(items: T[], seed: number): T[] {
  return [...items].sort((a, b) => {
    const scoreA = (a.id.charCodeAt(a.id.length - 1) * 7 + seed) % 13;
    const scoreB = (b.id.charCodeAt(b.id.length - 1) * 7 + seed) % 13;
    return scoreA - scoreB;
  });
}

export default function VocabularyPage() {
  const { user } = useAuth();

  // Load words saved from reading unseens & manual inputs
  const [savedUnseenWords, setSavedUnseenWords] = useState<VocabItem[]>(() =>
    loadSavedWords(user?.id)
  );

  // Sync saved words whenever active user changes
  useEffect(() => {
    setSavedUnseenWords(loadSavedWords(user?.id));
  }, [user?.id]);

  const [activeCategory, setActiveCategory] = useState<
    "saved" | "grade7" | "grade8" | "grade9" | "assignment"
  >("saved");
  const [isFromDavid, setIsFromDavid] = useState(false);
  const [isTurningInToDavid, setIsTurningInToDavid] = useState(false);

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
              partOfSpeech: (w.partOfSpeech as any) || "noun",
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
    | "alpha_asc"
    | "alpha_desc"
    | "hebrew_asc"
    | "unlearned_first"
    | "learned_first"
    | "newest"
  >("starred_first");
  const [filterOption, setFilterOption] = useState<"all" | "starred" | "unlearned" | "learned">("all");
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, { starred?: boolean; mastered?: boolean }>
  >({});

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
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

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

  // Check for saved draft for current vocab category or assignment
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
      const payload = matched.payload as any;
      if (
        (payload?.cardIndex > 0 || (payload?.masteredIds && payload.masteredIds.length > 0) || payload?.quizIndex > 0) &&
        cardIndex === 0 &&
        masteredIds.size === 0 &&
        quizIndex === 0
      ) {
        setActiveDraftPrompt(matched);
      }
    }
  }, [activeCategory, activeAssignment?.id]);

  // Restore draft handler
  const handleRestoreDraft = (draft: InProgressWorkItem) => {
    const payload = draft.payload as any;
    if (payload) {
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
      setActiveDraftPrompt(null);
    }
  };

  // Discard draft handler
  const handleDiscardDraft = (draft: InProgressWorkItem) => {
    deleteDraft(draft.id, user?.id);
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
    window.location.href = "/student";
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

    // Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (w) =>
          w.english.toLowerCase().includes(q) ||
          w.hebrew.includes(q) ||
          (w.example && w.example.toLowerCase().includes(q))
      );
    }

    // Sorting
    const sorted = [...list].sort((a, b) => {
      switch (sortOption) {
        case "starred_first":
          if (a.starred && !b.starred) return -1;
          if (!a.starred && b.starred) return 1;
          return a.english.localeCompare(b.english);
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
  }, [enrichedWords, filterOption, searchQuery, sortOption]);

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
      const w = window as any;
      w.__vocabUtterance = utterance;
      utterance.onend = () => {
        w.__vocabUtterance = null;
      };
      utterance.onerror = () => {
        w.__vocabUtterance = null;
      };
      window.speechSynthesis.speak(utterance);
    } catch (err) {
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

  const toggleMastered = (id: string) => {
    const isCurrentlyMastered = statusOverrides[id]?.mastered ?? masteredIds.has(id);
    markCardMastered(id, !isCurrentlyMastered);
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

  // Save self-practice session to completed history
  const handleSavePracticeToHistory = async () => {
    const pool = activePool.length > 0 ? activePool : MIDDLE_SCHOOL_EASY;
    const totalWords = pool.length;
    const masteredCount = masteredIds.size;
    const accuracy = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 100;
    const calculatedScore = quizScore > 0 ? Math.min(100, Math.round((quizScore + accuracy) / 2)) : Math.max(80, accuracy);
    const receiptCode = `PRACTICE-VOCAB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newSubmission: SubmissionItem = {
      id: `sub-vocab-${Date.now()}`,
      type: "vocab",
      mode: "practice",
      status: "completed",
      studentId: user?.id || "guest-student",
      studentName: user?.name || "תלמיד/ה",
      studentClass: user?.fullClass || user?.classGrade || "חטיבת ביניים",
      studentGroup: user?.group || undefined,
      teacherId: "",
      teacherName: "תרגול עצמאי",
      taskId: `vocab-${activeCategory}`,
      taskTitle: `Vocabulary Practice (${activeCategory})`,
      hebrewTitle: `אוצר מילים (${activeCategory === "saved" ? "מילון אישי" : activeCategory})`,
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
    };

    try {
      const raw = localStorage.getItem("ett_writing_submissions");
      const list: SubmissionItem[] = raw ? JSON.parse(raw) : [];
      list.unshift(newSubmission);
      localStorage.setItem("ett_writing_submissions", JSON.stringify(list));
    } catch (err) {
      console.warn("Error saving practice locally:", err);
    }

    if (db) {
      try {
        const payload = cleanForFirestore({
          ...newSubmission,
          timestamp: new Date().toISOString(),
        });
        await setDoc(doc(db, "submissions", newSubmission.id), payload, { merge: true });
      } catch (err) {
        console.warn("Error saving practice to Firestore:", err);
      }
    }

    const draftId = activeAssignment
      ? `draft_vocab_assign_${activeAssignment.id}`
      : `draft_vocab_${activeCategory}`;
    deleteDraft(draftId, user?.id);

    setSubmissionSuccessReceipt(receiptCode);
    setShowConfetti(true);
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
      window.location.href = "/tutor?turnIn=1";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <HeaderTooltip label="חזרה לדף הראשי">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                aria-label="ראשי"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </HeaderTooltip>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <BookA className="h-4 w-4" />
              </div>
              <span className="font-bold text-xs sm:text-base truncate">
                <span>בנק מילים אישי ואימון אוצר מילים</span>
                <span className="hidden sm:inline"> &bull; חטיבת ביניים בן גוריון</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {draftStatus === "saving" ? (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-hebrew">
                <Clock className="h-3 w-3 animate-spin text-amber-500" />
                <span className="hidden sm:inline">שומר טיוטה...</span>
              </span>
            ) : draftStatus === "saved" ? (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-hebrew">
                <Check className="h-3 w-3" />
                <span className="hidden sm:inline">נשמר {lastSavedTimeText || ""}</span>
              </span>
            ) : null}

            {(cardIndex > 0 || masteredIds.size > 0 || quizIndex > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveAndExit}
                className="h-8 text-xs font-bold gap-1 cursor-pointer border-border/80 font-hebrew"
                title="שמור טיוטה וחזור לאזור התלמיד"
              >
                <Save className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">שמור וצא</span>
              </Button>
            )}

            {activeAssignment && (
              <Button
                type="button"
                size="sm"
                onClick={() => setTurnInModalOpen(true)}
                className="h-9 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1.5 shadow-xs shrink-0 animate-pulse"
                dir="rtl"
              >
                <Send className="h-3.5 w-3.5" />
                <span>הגש למורה</span>
              </Button>
            )}

            {/* Quick Add Word Button in Navbar */}
            <HeaderTooltip label="הוספת מילה חדשה לפנקס">
              <Button
                onClick={() => {
                  setShowAddModal(true);
                  setFormError(null);
                }}
                size="icon"
                className="h-9 w-9 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0"
                aria-label="הוספת מילה"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </HeaderTooltip>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Active In-Progress Draft Banner */}
      {activeDraftPrompt && (
        <div className="bg-primary/10 border-b border-primary/25 px-4 py-3 print:hidden" dir="rtl">
          <div className="container mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span className="font-bold text-foreground">
                נמצא תרגול אוצר מילים שלא הושלם ({activeDraftPrompt.summaryText}):
              </span>
              <span className="text-muted-foreground font-medium">{activeDraftPrompt.hebrewTitle || activeDraftPrompt.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleRestoreDraft(activeDraftPrompt)}
                className="h-7 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>המשך תרגול</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDiscardDraft(activeDraftPrompt)}
                className="h-7 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
              >
                התחל מחדש
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 print:p-0 print:m-0">
        {/* Active Class Assignment Banner */}
        {activeAssignment && (
          <div
            className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-foreground shadow-md animate-in slide-in-from-top duration-300"
            dir="rtl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5 animate-bounce">
                  <BookA className="h-5 w-5" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                      🔔 משימת כיתה פעילה מהמורה {activeAssignment.teacherName || "לאנגלית"}
                    </span>
                    <Badge variant="outline" className="text-3xs font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10">
                      {assignmentWords.length} מילים לתרגול
                    </Badge>
                    {activeAssignment.dueDate && (
                      <Badge variant="outline" className="text-3xs font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10">
                        יעד להגשה: {activeAssignment.dueDate}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-3xs font-bold">
                      {masteredIds.size} / {assignmentWords.length} מילים בשליטה
                    </Badge>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-foreground">
                    {activeAssignment.hebrewTitle} <span className="font-normal text-xs text-muted-foreground" dir="ltr">({activeAssignment.title})</span>
                  </h2>
                  {activeAssignment.instructions && (
                    <p className="text-xs text-foreground/90 font-medium bg-background/60 p-2.5 rounded-xl border border-border/50 max-w-2xl leading-relaxed">
                      💬 הנחיית המורה: &ldquo;{activeAssignment.instructions}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Button
                  size="sm"
                  onClick={() => setTurnInModalOpen(true)}
                  className="text-xs font-black gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs px-4 h-9"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>הגש משימה למורה</span>
                </Button>
              </div>
            </div>
          </div>
        )}


        {/* Success Toast Banner */}
        {successToast && (
          <div
            className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in"
            dir="rtl"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Category Picker & Actions Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4 print:hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full sm:w-auto" dir="rtl">
            <span className="text-xs font-semibold text-muted-foreground ml-1 shrink-0">מאגר:</span>

            {activeAssignment && (
              <Button
                variant={activeCategory === "assignment" ? "default" : "outline"}
                size="sm"
                className={`text-xs h-8 cursor-pointer gap-1.5 shrink-0 ${
                  activeCategory === "assignment"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xs"
                    : "border-emerald-500/50 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 font-bold"
                }`}
                onClick={() => {
                  setActiveCategory("assignment");
                  setCardIndex(0);
                }}
              >
                <BookA className="h-3.5 w-3.5" />
                <span>משימת המורה ({assignmentWords.length})</span>
              </Button>
            )}

            <Button
              variant={activeCategory === "saved" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer gap-1.5 shrink-0"
              onClick={() => {
                setActiveCategory("saved");
                setCardIndex(0);
              }}
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>אוצר המילים שלי ({savedUnseenWords.length})</span>
            </Button>

            <Button
              variant={activeCategory === "grade7" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer shrink-0"
              onClick={() => {
                setActiveCategory("grade7");
                setCardIndex(0);
              }}
            >
              רמה 1
            </Button>

            <Button
              variant={activeCategory === "grade8" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer shrink-0"
              onClick={() => {
                setActiveCategory("grade8");
                setCardIndex(0);
              }}
            >
              רמה 2
            </Button>

            <Button
              variant={activeCategory === "grade9" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer shrink-0"
              onClick={() => {
                setActiveCategory("grade9");
                setCardIndex(0);
              }}
            >
              רמה 3
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="חיפוש מילה או תרגום..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs w-full"
              />
            </div>

            <Button
              onClick={() => {
                setShowAddModal(true);
                setFormError(null);
              }}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold gap-1 cursor-pointer border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 shrink-0"
              dir="rtl"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>הוסף מילה</span>
            </Button>
          </div>
        </div>

        {/* Study Mode Tabs */}
        <div className="flex items-center justify-between gap-2 print:hidden w-full overflow-x-auto pb-1">
          <Tabs
            value={studyMode}
            onValueChange={(v) => setStudyMode(v as "flashcards" | "match" | "quiz" | "bank")}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full sm:max-w-md h-9 p-1">
              <TabsTrigger value="flashcards" className="text-[11px] sm:text-xs px-1 sm:px-3">
                כרטיסיות
              </TabsTrigger>
              <TabsTrigger value="match" className="text-[11px] sm:text-xs px-1 sm:px-3">
                התאמה
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-[11px] sm:text-xs px-1 sm:px-3">
                בחן עצמך
              </TabsTrigger>
              <TabsTrigger value="bank" className="text-[11px] sm:text-xs px-1 sm:px-3">
                מילון ({filteredWords.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <span className="text-xs text-muted-foreground hidden sm:inline shrink-0">
            {wordStats.starred > 0 && <span className="text-amber-500 font-semibold ml-2">⭐ {wordStats.starred} מועדפים</span>}
            {wordStats.learned} / {wordStats.total} מילים נלמדו ✓
          </span>
        </div>

        {/* Sorting & Status Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 print:hidden bg-card/60 backdrop-blur-xs p-2.5 rounded-xl border border-border/70" dir="rtl">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              <span>סינון:</span>
            </span>

            <button
              type="button"
              onClick={() => {
                setFilterOption("all");
                setCardIndex(0);
              }}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0",
                filterOption === "all"
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              הכל ({wordStats.total})
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterOption("starred");
                setCardIndex(0);
              }}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1",
                filterOption === "starred"
                  ? "bg-amber-500 text-white font-semibold shadow-2xs"
                  : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Star className={cn("h-3 w-3", filterOption === "starred" ? "fill-white" : "fill-amber-400 text-amber-500")} />
              <span>מועדפים ({wordStats.starred})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterOption("unlearned");
                setCardIndex(0);
              }}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1",
                filterOption === "unlearned"
                  ? "bg-orange-500 text-white font-semibold shadow-2xs"
                  : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <span>⏳ לתרגול ({wordStats.unlearned})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterOption("learned");
                setCardIndex(0);
              }}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1",
                filterOption === "learned"
                  ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                  : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>נלמדו ({wordStats.learned})</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs mr-auto">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              <span>מיון:</span>
            </span>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value as any);
                setCardIndex(0);
              }}
              className="h-8 px-2.5 py-1 rounded-lg border border-border bg-background text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="starred_first">⭐ מועדפים תחילה</option>
              <option value="alpha_asc">🔤 באנגלית (A-Z)</option>
              <option value="alpha_desc">🔤 באנגלית (Z-A)</option>
              <option value="hebrew_asc">🇮🇱 בעברית (א-ת)</option>
              <option value="unlearned_first">⏳ דורש תרגול תחילה</option>
              <option value="learned_first">✓ נלמדו תחילה</option>
              <option value="newest">🕒 נוספו לאחרונה</option>
            </select>
          </div>
        </div>

        {/* EMPTY STATE (When category or filter has no words) */}
        {filteredWords.length === 0 && (
          <div className="max-w-md mx-auto py-12 text-center space-y-4" dir="rtl">
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center">
              <BookMarked className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                {filterOption !== "all"
                  ? filterOption === "starred"
                    ? "אין עדיין מילים שסומנו במועדפים ⭐"
                    : filterOption === "unlearned"
                    ? "כל הכבוד! אין כרגע מילים הדורשות תרגול"
                    : "עדיין לא סומנו מילים כנלמדו"
                  : activeCategory === "saved"
                  ? "עדיין לא הוספת מילים לאוצר המילים שלך"
                  : "לא נמצאו מילים התואמות לחיפוש"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {filterOption !== "all"
                  ? "תוכל להציג את כל המילים או לסמן מילים בכוכב / לשנות סטטוס שליטה ברשימת המילים."
                  : activeCategory === "saved"
                  ? "תוכל להזין מילים חדשות ידנית בעצמך (עם מילה, תרגום ומשפט לדוגמה) או ללחוץ על מילים בזמן קריאת אנסין כדי לשמור אותן כאן."
                  : "נסו לחפש מילה אחרת או נקו את שורת החיפוש."}
              </p>
            </div>

            {filterOption !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterOption("all")}
                className="text-xs cursor-pointer font-medium"
              >
                הצג את כל המילים ({wordStats.total})
              </Button>
            ) : activeCategory === "saved" ? (
              <Button
                onClick={() => {
                  setShowAddModal(true);
                  setFormError(null);
                }}
                className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>הוסף את המילה הראשונה שלך עכשיו</span>
              </Button>
            ) : null}
          </div>
        )}

        {/* MODE 1: FLASHCARDS */}
        {studyMode === "flashcards" && currentCard && filteredWords.length > 0 && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                כרטיס {(cardIndex % filteredWords.length) + 1} מתוך {filteredWords.length}
              </span>
              <Badge variant="outline" className="text-[11px]">
                {currentCard.level === "Personal Word"
                  ? "מילה אישית שהזנת"
                  : currentCard.level === "Saved from Unseen"
                  ? "נשמר מהאנסין"
                  : currentCard.level || "חטיבת ביניים"}
              </Badge>
            </div>

            {/* Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[260px] w-full rounded-2xl border-2 border-primary/20 bg-card p-6 flex flex-col items-center justify-between cursor-pointer shadow-md hover:border-primary/40 transition-all select-none text-center"
            >
              <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar(currentCard.id, currentCard.starred);
                    }}
                    className={cn(
                      "p-1.5 rounded-full transition-colors cursor-pointer",
                      currentCard.starred
                        ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                        : "text-muted-foreground hover:text-amber-500 hover:bg-muted"
                    )}
                    title={currentCard.starred ? "הסר מכוכב / מועדפים" : "סמן בכוכב ⭐ לתרגול ממוקד"}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        currentCard.starred ? "fill-amber-400 text-amber-500" : ""
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentCard.english);
                    }}
                    className="p-1.5 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
                    title="האזן להגייה באנגלית"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-[11px]">לחצו בכל מקום בכרטיס כדי להפוך ↺</span>
              </div>

              {!isFlipped ? (
                <div className="space-y-3 my-auto notranslate" translate="no" lang="en">
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                    {currentCard.english}
                  </h2>
                  {currentCard.example && (
                    <p className="text-xs sm:text-sm text-muted-foreground italic max-w-sm mx-auto font-sans" dir="ltr">
                      &quot;{currentCard.example}&quot;
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 my-auto" dir="rtl">
                  <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                    {currentCard.hebrew}
                  </h2>
                  {currentCard.example && (
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans" dir="ltr">
                      &quot;{currentCard.example}&quot;
                    </p>
                  )}
                </div>
              )}

              <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-2">
                {currentCard.mastered ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> סומן כנלמד בהצלחה!
                  </span>
                ) : (
                  <span className="text-muted-foreground">⏳ עדיין בתהליך למידה</span>
                )}
                {currentCard.starred && (
                  <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                    <Star className="h-3 w-3 fill-amber-400" /> מועדף
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={handlePrevCard} className="cursor-pointer gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>הקודם</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markCardMastered(currentCard.id, false)}
                  className="cursor-pointer text-xs"
                >
                  לתרגל שוב
                </Button>
                <Button
                  size="sm"
                  onClick={() => markCardMastered(currentCard.id, true)}
                  className="cursor-pointer text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>אני יודע/ת!</span>
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={handleNextCard} className="cursor-pointer gap-1">
                <span>הבא</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* MODE 2: SPEED MATCH */}
        {studyMode === "match" && filteredWords.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">משחק התאמה מהיר (Speed Match)</h3>
                <p className="text-xs text-muted-foreground">
                  לחצו על מילה באנגלית, ולאחר מכן לחצו על התרגום התואם שלה בעברית.
                </p>
              </div>
              <Badge variant="outline">
                {matchedPairs.size} / {matchPool.length} הותאמו
              </Badge>
            </div>

            {matchedPairs.size === matchPool.length && matchPool.length > 0 ? (
              <div className="p-8 text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold">כל הכבוד! התאמתם את כל המילים!</h4>
                <Button
                  onClick={() => {
                    setMatchedPairs(new Set());
                    setSelectedEng(null);
                    setSelectedHeb(null);
                    setMatchRound((r) => r + 1);
                  }}
                  className="cursor-pointer gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>שחק סיבוב נוסף</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {/* English Column */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground block text-left">
                    באנגלית (English)
                  </span>
                  {matchPool.map((item) => {
                    const isMatched = matchedPairs.has(item.id);
                    const isSelected = selectedEng === item.id;

                    let btnClass = "border-border bg-card hover:border-primary/50 text-foreground";
                    if (isMatched) btnClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 opacity-50";
                    else if (isSelected) {
                      btnClass = matchError
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary bg-primary/10 text-primary font-bold";
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClickEng(item.id)}
                        className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer flex items-center justify-between gap-1 break-words ${btnClass}`}
                      >
                        <span className="break-words leading-tight">{item.english}</span>
                        {isMatched && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Hebrew Column */}
                <div className="space-y-2" dir="rtl">
                  <span className="text-xs font-semibold text-muted-foreground block text-right">
                    בעברית (תרגום)
                  </span>
                  {shuffledHebrew.map((item) => {
                    const isMatched = matchedPairs.has(item.id);
                    const isSelected = selectedHeb === item.id;

                    let btnClass = "border-border bg-card hover:border-primary/50 text-foreground";
                    if (isMatched) btnClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 opacity-50";
                    else if (isSelected) {
                      btnClass = matchError
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary bg-primary/10 text-primary font-bold";
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClickHeb(item.id)}
                        className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-right cursor-pointer flex items-center justify-between gap-1 break-words ${btnClass}`}
                      >
                        <span className="break-words leading-tight">{item.hebrew}</span>
                        {isMatched && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: QUIZ */}
        {studyMode === "quiz" && currentQuizWord && filteredWords.length > 0 && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">שאלה {quizIndex + 1}:</span>
                <h3 className="text-base font-bold">מה התרגום הנכון של המילה?</h3>
              </div>
              <Badge variant="secondary">ניקוד: {quizScore} נק׳</Badge>
            </div>

            <Card className="border border-border/80">
              <CardHeader className="text-center pb-2">
                <span className="text-xs text-muted-foreground">מילה באנגלית:</span>
                <CardTitle className="text-3xl font-extrabold text-foreground pt-1">
                  {currentQuizWord.english}
                </CardTitle>
                {currentQuizWord.example && (
                  <CardDescription className="text-xs italic font-sans" dir="ltr">
                    &quot;{currentQuizWord.example}&quot;
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-2 pt-3" dir="rtl">
                {quizOptions.map((opt) => {
                  const isSelected = selectedQuizOption === opt.hebrew;
                  const isCorrect = opt.hebrew === currentQuizWord.hebrew;

                  let btnStyle = "border-border hover:bg-muted/50 text-foreground";
                  if (selectedQuizOption) {
                    if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 font-bold";
                    else if (isSelected) btnStyle = "border-destructive bg-destructive/15 text-destructive";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={selectedQuizOption !== null}
                      onClick={() => handleQuizAnswer(opt.hebrew)}
                      className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all text-right cursor-pointer ${btnStyle}`}
                    >
                      {opt.hebrew}
                    </button>
                  );
                })}

                {selectedQuizOption && (
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-xs">
                      {selectedQuizOption === currentQuizWord.hebrew ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> תשובה נכונה! (+10 נק׳)
                        </span>
                      ) : (
                        <span className="text-destructive font-semibold">
                          התשובה הנכונה היא: <strong>{currentQuizWord.hebrew}</strong>
                        </span>
                      )}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedQuizOption(null);
                        setQuizIndex((i) => i + 1);
                      }}
                      className="cursor-pointer text-xs"
                    >
                      לשאלה הבאה &rarr;
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* MODE 4: WORD BANK TABLE */}
        {studyMode === "bank" && filteredWords.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold">
                  {activeCategory === "saved" ? "מילון אוצר המילים האישי שלי" : "מילון המילים למאגר זה"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  סה״כ {filteredWords.length} מילים להרחבת אוצר המילים.
                </p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <Button
                  onClick={() => {
                    setShowAddModal(true);
                    setFormError(null);
                  }}
                  size="sm"
                  className="gap-1 text-xs cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  dir="rtl"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>הוסף מילה חדשה</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>הדפסת דף עבודה</span>
                </Button>
              </div>
            </div>

            {/* Mobile Card List (sm:hidden) */}
            <div className="sm:hidden space-y-2.5">
              {filteredWords.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStar(w.id, w.starred)}
                        className={cn(
                          "p-1 rounded-md transition-colors cursor-pointer",
                          w.starred
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-muted-foreground/30 hover:text-amber-500"
                        )}
                        title={w.starred ? "הסר ממועדפים" : "סמן בכוכב ⭐"}
                      >
                        <Star className={cn("h-4 w-4", w.starred ? "fill-amber-400 text-amber-500" : "")} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSpeak(w.english)}
                        className="p-1 rounded-md bg-muted/60 text-muted-foreground hover:text-primary cursor-pointer"
                        title="האזנה להגייה"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-bold text-sm text-foreground capitalize">{w.english}</span>
                      {w.level === "Personal Word" && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                          אישי
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-primary" dir="rtl">{w.hebrew}</span>
                      {activeCategory === "saved" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteWord(w.id, w.english)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded-md hover:bg-destructive/10"
                          title="מחק מילה מאוצר המילים שלי"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {w.example && (
                    <p className="text-xs text-muted-foreground italic font-sans bg-muted/30 p-2 rounded-lg" dir="ltr">
                      &ldquo;{w.example}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleMastered(w.id, w.mastered)}
                      className="cursor-pointer"
                      title="לחץ לשינוי סטטוס שליטה"
                    >
                      {w.mastered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors">
                          <CheckCheck className="h-3 w-3" /> נלמד
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors">
                          ⏳ לתרגול
                        </span>
                      )}
                    </button>
                    {w.starred && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-amber-400" /> מועדף
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (hidden sm:block) */}
            <div className="hidden sm:block rounded-xl border border-border overflow-hidden bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                      <th className="p-3 w-10 text-center print:hidden">⭐</th>
                      <th className="p-3 w-1/4">באנגלית (English)</th>
                      <th className="p-3 w-1/4 text-right">בעברית (תרגום)</th>
                      <th className="p-3 w-1/3">משפט לדוגמה (Sentence)</th>
                      <th className="p-3 w-28 text-center">סטטוס</th>
                      <th className="p-3 w-16 text-center print:hidden">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredWords.map((w) => (
                      <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 text-center print:hidden">
                          <button
                            type="button"
                            onClick={() => handleToggleStar(w.id, w.starred)}
                            className={cn(
                              "p-1 rounded-md transition-colors cursor-pointer",
                              w.starred
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-muted-foreground/30 hover:text-amber-500"
                            )}
                            title={w.starred ? "הסר ממועדפים" : "סמן בכוכב ⭐"}
                          >
                            <Star
                              className={cn(
                                "h-4 w-4",
                                w.starred ? "fill-amber-400 text-amber-500" : ""
                              )}
                            />
                          </button>
                        </td>
                        <td className="p-3 font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{w.english}</span>
                            <button
                              type="button"
                              onClick={() => handleSpeak(w.english)}
                              className="text-muted-foreground hover:text-foreground cursor-pointer print:hidden"
                              title="האזנה להגייה"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                            </button>
                            {w.level === "Personal Word" && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hidden sm:inline">
                                הזנה ידנית
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-primary text-right" dir="rtl">
                          {w.hebrew}
                        </td>
                        <td className="p-3 text-muted-foreground italic font-sans" dir="ltr">
                          {w.example ? `"${w.example}"` : "—"}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMastered(w.id, w.mastered)}
                            className="cursor-pointer"
                            title="לחץ לשינוי סטטוס שליטה"
                          >
                            {w.mastered ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors">
                                <CheckCheck className="h-3 w-3" /> נלמד
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors">
                                ⏳ לתרגול
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-center print:hidden">
                          {activeCategory === "saved" ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteWord(w.id, w.english)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded-md hover:bg-destructive/10"
                              title="מחק מילה מאוצר המילים שלי"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <span className="text-muted-foreground/50 text-[10px]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Manual Word Input Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground">
                    הוספת מילה חדשה לאוצר המילים
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    הזינו את המילה באנגלית, תרגומה לעברית, והציבו אותה בתוך משפט לדוגמה.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormError(null);
                }}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomWord} className="space-y-4 text-xs">
              {/* Field 1: English Word */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  1. המילה באנגלית (English Word) <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="למשל: discover או curious"
                  value={newWordEng}
                  onChange={(e) => {
                    setNewWordEng(e.target.value);
                    setFormError(null);
                  }}
                  dir="ltr"
                  className="h-10 text-sm font-sans"
                  autoFocus
                />
              </div>

              {/* Field 2: Hebrew Translation */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  2. תרגום המילה לעברית <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="למשל: לגלות או סקרן"
                  value={newWordHeb}
                  onChange={(e) => {
                    setNewWordHeb(e.target.value);
                    setFormError(null);
                  }}
                  dir="rtl"
                  className="h-10 text-sm"
                />
              </div>

              {/* Field 3: Part of Speech */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  3. חלק דיבר (Part of Speech)
                </label>
                <select
                  value={newWordPos}
                  onChange={(e) =>
                    setNewWordPos(
                      e.target.value as "noun" | "verb" | "adjective" | "adverb" | "phrase"
                    )
                  }
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="noun">שם עצם (Noun)</option>
                  <option value="verb">פועל (Verb)</option>
                  <option value="adjective">שם תואר (Adjective)</option>
                  <option value="adverb">תואר הפועל (Adverb)</option>
                  <option value="phrase">ביטוי / צירוף מילים (Phrase)</option>
                </select>
              </div>

              {/* Field 4: Example Sentence containing the word */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground block">
                    4. הצבת המילה בתוך משפט באנגלית (Example Sentence) <span className="text-destructive">*</span>
                  </label>
                  {newWordEng.trim() && (
                    <span className="text-[10px] text-muted-foreground font-sans" dir="ltr">
                      Must include: <strong>{newWordEng.trim()}</strong>
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  placeholder={`למשל: We wanted to ${newWordEng.trim() || "discover"} new places during the trip.`}
                  value={newWordSentence}
                  onChange={(e) => {
                    setNewWordSentence(e.target.value);
                    setFormError(null);
                  }}
                  dir="ltr"
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm font-sans shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />

                {/* Real-time sentence inclusion indicator */}
                {newWordSentence.trim() && newWordEng.trim() && (
                  <div className="pt-0.5">
                    {isWordInSentence ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>מעולה! המילה &quot;{newWordEng.trim()}&quot; מופיעה כנדרש בתוך המשפט.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>שימו לב: המשפט חייב להכיל את המילה באנגלית (&quot;{newWordEng.trim()}&quot;).</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError(null);
                  }}
                  className="cursor-pointer text-xs"
                >
                  ביטול
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!newWordEng.trim() || !newWordHeb.trim() || !newWordSentence.trim() || !isWordInSentence}
                  className="cursor-pointer text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>שמור מילה לאוצר המילים</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Turn In Assignment Modal */}
      {turnInModalOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-foreground">
                    הגשת משימת אוצר מילים למורה
                  </h3>
                  <p className="text-2xs text-muted-foreground">
                    {activeAssignment.hebrewTitle} &bull; המורה {activeAssignment.teacherName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTurnInModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2">
              <span className="font-bold text-foreground block">סיכום התרגול שלך:</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-background border border-border/60">
                  <span className="text-2xs text-muted-foreground block">מילים בשליטה מלאה</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {masteredIds.size} / {assignmentWords.length}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-background border border-border/60">
                  <span className="text-2xs text-muted-foreground block">ציון בוחן (Quiz)</span>
                  <span className="text-base font-black text-foreground">
                    {quizScore > 0 ? `${quizScore} / 100` : "טרם בוצע"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-2xs text-muted-foreground leading-relaxed">
              בלחיצה על &ldquo;אשר והגש למורה&rdquo;, תוצאות התרגול ורשימת המילים שנלמדו יישלחו ישירות ללוח הבקרה של המורה {activeAssignment.teacherName}.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTurnInModalOpen(false)}
                className="cursor-pointer text-xs"
              >
                המשך לתרגל
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleTurnInAssignment}
                disabled={isSubmittingTurnIn}
                className="cursor-pointer text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmittingTurnIn ? "מגיש..." : "אשר והגש למורה"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Success Dialog with Confetti */}
      {submissionSuccessReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          {showConfetti && <Confetti active={true} durationMs={4000} />}
          <div
            className="w-full max-w-md bg-card border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center text-xs animate-in zoom-in-95"
            dir="rtl"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-foreground">
                משימת אוצר המילים הוגשה בהצלחה! 🎉
              </h3>
              <p className="text-xs text-muted-foreground">
                התרגול שלך נשמר והועבר לבדיקת המורה {activeAssignment?.teacherName}.
              </p>
            </div>

            {/* Receipt Code Box */}
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
              <span className="text-2xs font-bold text-muted-foreground block">
                קוד אישור הגשה (Receipt Code):
              </span>
              <div className="flex items-center justify-center gap-2">
                <code className="text-sm font-mono font-black text-foreground tracking-wider bg-background px-3 py-1 rounded-lg border border-border">
                  {submissionSuccessReceipt}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-2xs gap-1 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(submissionSuccessReceipt);
                    setCopiedReceipt(true);
                    setTimeout(() => setCopiedReceipt(false), 2000);
                  }}
                >
                  {copiedReceipt ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedReceipt ? "הועתק!" : "העתק"}</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Link href="/student">
                <Button
                  size="sm"
                  className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground cursor-pointer"
                >
                  <span>מעבר לפורטל התלמידים</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSubmissionSuccessReceipt(null)}
                className="text-xs cursor-pointer"
              >
                סגור והמשך
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
