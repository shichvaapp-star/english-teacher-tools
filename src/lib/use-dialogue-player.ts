"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DialogueSpeaker, DialogueTurn } from "@/types/conversation";
import { CuratedVoice } from "@/lib/use-speech-player";

// Prevent garbage collection in Chrome / Safari V8 engines
function retainUtterance(u: SpeechSynthesisUtterance) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __dialogueUtteranceSet?: Set<SpeechSynthesisUtterance> };
  if (!w.__dialogueUtteranceSet) {
    w.__dialogueUtteranceSet = new Set<SpeechSynthesisUtterance>();
  }
  w.__dialogueUtteranceSet.add(u);
}

function releaseUtterance(u: SpeechSynthesisUtterance) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __dialogueUtteranceSet?: Set<SpeechSynthesisUtterance> };
  if (w.__dialogueUtteranceSet) {
    w.__dialogueUtteranceSet.delete(u);
  }
}

function ensureSpeechSynthesisUnpaused() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch {}
}

function scoreVoice(v: SpeechSynthesisVoice): number {
  let score = 0;
  const name = v.name.toLowerCase();
  const uri = v.voiceURI.toLowerCase();

  if (name.includes("siri") || uri.includes("siri")) return -999;
  if (v.localService) score += 25;
  if (name.includes("natural") || uri.includes("natural")) score += 40;
  if (name.includes("enhanced") || uri.includes("enhanced")) score += 35;
  if (name.includes("premium") || uri.includes("premium")) score += 30;
  if (name.includes("google") || uri.includes("google")) score += 20;
  if (name.includes("online") || uri.includes("online")) score += 10;

  if (name.includes("samantha") || name.includes("jenny") || name.includes("guy")) score += 25;
  if (name.includes("daniel") || name.includes("oliver") || name.includes("ava")) score += 25;

  if (name.includes("alex") || name.includes("fred") || name.includes("victoria")) score -= 15;
  if (name.includes("albert") || name.includes("bad news") || name.includes("bahh")) score -= 50;

  return score;
}

function getVoiceAccent(v: SpeechSynthesisVoice): "US" | "UK" | "AU" | "Other" {
  const lang = v.lang.toLowerCase();
  if (lang.includes("us") || lang.includes("en-us")) return "US";
  if (lang.includes("gb") || lang.includes("uk") || lang.includes("en-gb")) return "UK";
  if (lang.includes("au") || lang.includes("en-au")) return "AU";
  return "Other";
}

function inferVoiceGender(v: SpeechSynthesisVoice): "female" | "male" | "unknown" {
  const n = v.name.toLowerCase();
  if (
    n.includes("samantha") ||
    n.includes("victoria") ||
    n.includes("karen") ||
    n.includes("moira") ||
    n.includes("tessa") ||
    n.includes("jenny") ||
    n.includes("aria") ||
    n.includes("ava") ||
    n.includes("allison") ||
    n.includes("susan") ||
    n.includes("zira") ||
    n.includes("female") ||
    n.includes("uk english female")
  ) {
    return "female";
  }
  if (
    n.includes("daniel") ||
    n.includes("alex") ||
    n.includes("tom") ||
    n.includes("oliver") ||
    n.includes("guy") ||
    n.includes("david") ||
    n.includes("mark") ||
    n.includes("arthur") ||
    n.includes("aaron") ||
    n.includes("male") ||
    n.includes("uk english male")
  ) {
    return "male";
  }
  return "unknown";
}

export function useDialoguePlayer(turns: DialogueTurn[], speakers: DialogueSpeaker[]) {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [rate, setRate] = useState(0.92);
  const [voices, setVoices] = useState<CuratedVoice[]>([]);
  const [speakerAVoiceURI, setSpeakerAVoiceURI] = useState<string>("");
  const [speakerBVoiceURI, setSpeakerBVoiceURI] = useState<string>("");

  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const currentTurnRef = useRef(0);
  const singleTurnOnlyRef = useRef(false);
  const rateRef = useRef(0.92);
  const speakerAVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speakerBVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const interTurnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  isPlayingRef.current = isPlaying;
  isPausedRef.current = isPaused;
  currentTurnRef.current = currentTurnIndex;
  rateRef.current = rate;

  // Discover and curate English voices, then pick two contrasting voices for Speaker A & Speaker B
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const englishVoices = allVoices.filter((v) => {
        const l = v.lang.toLowerCase();
        const n = v.name.toLowerCase();
        const u = v.voiceURI.toLowerCase();
        if (n.includes("siri") || u.includes("siri")) return false;
        return l.startsWith("en-") || l.startsWith("en_") || l === "en";
      });

      const listToScore = englishVoices.length > 0 ? englishVoices : allVoices;

      const curated: (CuratedVoice & { _score: number; _gender: "female" | "male" | "unknown" })[] = listToScore
        .map((v) => {
          const score = scoreVoice(v);
          const accent = getVoiceAccent(v);
          const isNatural = score >= 25;
          const cleanName = v.name
            .replace(/\(.*?\)/g, "")
            .replace(/Desktop/i, "")
            .trim();
          const displayName = `${cleanName} (${accent}${isNatural ? " • Natural" : ""})`;

          return {
            voice: v,
            displayName,
            isNatural,
            accent,
            _score: score,
            _gender: inferVoiceGender(v),
          };
        })
        .sort((a, b) => b._score - a._score);

      setVoices(curated);

      if (curated.length > 0) {
        const speakerA = speakers[0];
        const speakerB = speakers[1];

        // Match Speaker A gender hint if possible
        const voiceForA =
          (speakerA?.genderHint && curated.find((c) => c._gender === speakerA.genderHint)) ||
          curated[0];

        // Pick a distinct second voice for Speaker B
        const remaining = curated.filter((c) => c.voice.voiceURI !== voiceForA.voice.voiceURI);
        const voiceForB =
          (speakerB?.genderHint && remaining.find((c) => c._gender === speakerB.genderHint)) ||
          remaining[0] ||
          voiceForA;

        setSpeakerAVoiceURI((prev) => {
          if (prev && curated.some((c) => c.voice.voiceURI === prev)) {
            const found = curated.find((c) => c.voice.voiceURI === prev);
            if (found) speakerAVoiceRef.current = found.voice;
            return prev;
          }
          speakerAVoiceRef.current = voiceForA.voice;
          return voiceForA.voice.voiceURI;
        });

        setSpeakerBVoiceURI((prev) => {
          if (prev && curated.some((c) => c.voice.voiceURI === prev)) {
            const found = curated.find((c) => c.voice.voiceURI === prev);
            if (found) speakerBVoiceRef.current = found.voice;
            return prev;
          }
          speakerBVoiceRef.current = voiceForB.voice;
          return voiceForB.voice.voiceURI;
        });
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    const timer = setTimeout(loadVoices, 250);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      clearTimeout(timer);
    };
  }, [speakers]);

  // Keep-alive for Chrome SpeechSynthesis
  useEffect(() => {
    if (isPlaying && !isPaused) {
      keepAliveIntervalRef.current = setInterval(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      }, 10000);
    } else if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }

    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused]);

  // Cleanup on unmount or scenario switch
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
      if (interTurnTimeoutRef.current) {
        clearTimeout(interTurnTimeoutRef.current);
        interTurnTimeoutRef.current = null;
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, [turns]);

  const playTurn = useCallback(
    (index: number, singleOnly = false, fallbackWithoutVoice = false) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (index < 0 || index >= turns.length) {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }

      if (interTurnTimeoutRef.current) {
        clearTimeout(interTurnTimeoutRef.current);
        interTurnTimeoutRef.current = null;
      }

      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}

      const turnObj = turns[index];
      if (!turnObj) return;

      singleTurnOnlyRef.current = singleOnly;
      setCurrentTurnIndex(index);
      currentTurnRef.current = index;
      setIsPlaying(true);
      setIsPaused(false);

      try {
        ensureSpeechSynthesisUnpaused();

        const utterance = new SpeechSynthesisUtterance(turnObj.text);
        retainUtterance(utterance);

        utterance.lang = "en-US";
        utterance.rate = rateRef.current;

        const isSpeakerA = turnObj.speakerId === speakers[0]?.id || index % 2 === 0;
        const chosenVoice = isSpeakerA ? speakerAVoiceRef.current : speakerBVoiceRef.current;

        // If both speakers ended up with the same system voice, slightly differentiate pitch so they still sound distinct
        const sameVoice =
          speakerAVoiceRef.current &&
          speakerBVoiceRef.current &&
          speakerAVoiceRef.current.voiceURI === speakerBVoiceRef.current.voiceURI;

        utterance.pitch = sameVoice ? (isSpeakerA ? 1.06 : 0.94) : 1.0;

        if (!fallbackWithoutVoice && chosenVoice) {
          utterance.voice = chosenVoice;
        }

        utterance.onstart = () => {
          ensureSpeechSynthesisUnpaused();
        };

        utterance.onend = () => {
          releaseUtterance(utterance);
          if (!isPlayingRef.current || isPausedRef.current) return;

          if (singleTurnOnlyRef.current) {
            setIsPlaying(false);
            setIsPaused(false);
            return;
          }

          const nextIndex = currentTurnRef.current + 1;
          if (nextIndex < turns.length) {
            interTurnTimeoutRef.current = setTimeout(() => {
              playTurn(nextIndex, false);
            }, 340);
          } else {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentTurnIndex(0);
          }
        };

        utterance.onerror = (e) => {
          releaseUtterance(utterance);
          if (e.error === "interrupted" || e.error === "canceled") return;

          if (!fallbackWithoutVoice && utterance.voice) {
            playTurn(index, singleOnly, true);
            return;
          }

          setIsPlaying(false);
          setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {
        setIsPlaying(false);
      }
    },
    [turns, speakers]
  );

  const startDialogue = useCallback(() => {
    setIsActive(true);
    playTurn(0, false);
  }, [playTurn]);

  const playSingleTurn = useCallback(
    (index: number) => {
      setIsActive(true);
      playTurn(index, true);
    },
    [playTurn]
  );

  const playFromTurn = useCallback(
    (index: number) => {
      setIsActive(true);
      playTurn(index, false);
    },
    [playTurn]
  );

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (interTurnTimeoutRef.current) {
      clearTimeout(interTurnTimeoutRef.current);
      interTurnTimeoutRef.current = null;
    }
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    ensureSpeechSynthesisUnpaused();
    setIsPaused(false);
    setIsPlaying(true);
    playTurn(currentTurnRef.current, false);
  }, [playTurn]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const skipBack = useCallback(() => {
    const prevIdx = Math.max(0, currentTurnRef.current - 1);
    playTurn(prevIdx, false);
  }, [playTurn]);

  const skipForward = useCallback(() => {
    const nextIdx = Math.min(turns.length - 1, currentTurnRef.current + 1);
    playTurn(nextIdx, false);
  }, [turns.length, playTurn]);

  const changeRate = useCallback(
    (newRate: number) => {
      setRate(newRate);
      rateRef.current = newRate;
      if (isPlaying) {
        playTurn(currentTurnRef.current, singleTurnOnlyRef.current);
      }
    },
    [isPlaying, playTurn]
  );

  const changeSpeakerAVoice = useCallback(
    (voiceURI: string) => {
      setSpeakerAVoiceURI(voiceURI);
      const match = voices.find((v) => v.voice.voiceURI === voiceURI);
      if (match) {
        speakerAVoiceRef.current = match.voice;
        if (isPlaying) {
          playTurn(currentTurnRef.current, singleTurnOnlyRef.current);
        }
      }
    },
    [voices, isPlaying, playTurn]
  );

  const changeSpeakerBVoice = useCallback(
    (voiceURI: string) => {
      setSpeakerBVoiceURI(voiceURI);
      const match = voices.find((v) => v.voice.voiceURI === voiceURI);
      if (match) {
        speakerBVoiceRef.current = match.voice;
        if (isPlaying) {
          playTurn(currentTurnRef.current, singleTurnOnlyRef.current);
        }
      }
    },
    [voices, isPlaying, playTurn]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (interTurnTimeoutRef.current) {
      clearTimeout(interTurnTimeoutRef.current);
      interTurnTimeoutRef.current = null;
    }
    setIsActive(false);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTurnIndex(0);
  }, []);

  return {
    isActive,
    isPlaying,
    isPaused,
    currentTurnIndex,
    currentTurn: turns[currentTurnIndex] || null,
    totalTurns: turns.length,
    rate,
    voices,
    speakerAVoiceURI,
    speakerBVoiceURI,
    startDialogue,
    playSingleTurn,
    playFromTurn,
    pause,
    resume,
    togglePlayPause,
    skipBack,
    skipForward,
    changeRate,
    changeSpeakerAVoice,
    changeSpeakerBVoice,
    stop,
  };
}
