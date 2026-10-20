"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export interface SpeechSentence {
  id: string;
  paragraphIndex: number;
  sentenceIndexInParagraph: number;
  globalIndex: number;
  text: string;
}

export interface CuratedVoice {
  voice: SpeechSynthesisVoice;
  displayName: string;
  isNatural: boolean;
  accent: "US" | "UK" | "AU" | "Other";
}

// Prevent garbage collection in Chrome / Safari V8 engines
function retainUtterance(u: SpeechSynthesisUtterance) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (!w.__speechUtteranceSet) {
    w.__speechUtteranceSet = new Set<SpeechSynthesisUtterance>();
  }
  w.__speechUtteranceSet.add(u);
}

function releaseUtterance(u: SpeechSynthesisUtterance) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.__speechUtteranceSet) {
    w.__speechUtteranceSet.delete(u);
  }
}

// Ensure browser speech synthesis is unpaused and active
function ensureSpeechSynthesisUnpaused() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch {}
}

// Score voice quality: higher score = more natural prosody and local offline reliability
function scoreVoice(v: SpeechSynthesisVoice): number {
  let score = 0;
  const name = v.name.toLowerCase();
  const uri = v.voiceURI.toLowerCase();

  // Prefer local offline voices for rock-solid stability without network hiccups
  if (v.localService) score += 25;

  if (name.includes("natural") || uri.includes("natural")) score += 40;
  if (name.includes("enhanced") || uri.includes("enhanced")) score += 35;
  if (name.includes("premium") || uri.includes("premium")) score += 30;
  if (name.includes("siri") || uri.includes("siri")) score += 30;
  if (name.includes("google") || uri.includes("google")) score += 20;
  if (name.includes("online") || uri.includes("online")) score += 10;

  // Specific high quality voices on macOS / Windows / iOS
  if (name.includes("samantha") || name.includes("jenny") || name.includes("guy")) score += 25;
  if (name.includes("daniel") || name.includes("oliver") || name.includes("ava")) score += 25;

  // Penalize robotic / legacy voices
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

export function useSpeechPlayer(paragraphs: string[]) {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [rate, setRate] = useState(0.9); // Default natural EFL pacing
  const [voices, setVoices] = useState<CuratedVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

  // Refs for audio playback control
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const currentSentenceRef = useRef(0);
  const rateRef = useRef(0.9);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const interSentenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sentenceStartTimeRef = useRef<number>(0);

  // Sync refs with state
  isPlayingRef.current = isPlaying;
  isPausedRef.current = isPaused;
  currentSentenceRef.current = currentSentenceIndex;
  rateRef.current = rate;

  // 1. Break paragraphs into structured sentences
  const sentences: SpeechSentence[] = useMemo(() => {
    const list: SpeechSentence[] = [];
    let globalIdx = 0;

    paragraphs.forEach((para, pIdx) => {
      if (!para || !para.trim()) return;

      // Match sentences ending in . ! ? with quotes/parentheses attached
      const rawSentences = para.match(/[^.!?]+(?:[.!?]+["'”’)]*|\s*$)/g) || [para];

      let sentenceIdxInPara = 0;
      rawSentences.forEach((raw) => {
        const clean = raw.trim();
        // Check if there is actual pronounceable text
        if (clean.length > 0 && /[a-zA-Z0-9]/.test(clean)) {
          list.push({
            id: `p${pIdx}-s${sentenceIdxInPara}-${globalIdx}`,
            paragraphIndex: pIdx,
            sentenceIndexInParagraph: sentenceIdxInPara,
            globalIndex: globalIdx,
            text: clean,
          });
          sentenceIdxInPara++;
          globalIdx++;
        } else if (list.length > 0 && clean.length > 0) {
          // If it's just punctuation or a trailing quote, append to previous sentence
          list[list.length - 1].text += " " + clean;
        }
      });
    });

    return list;
  }, [paragraphs]);

  // 2. Discover and curate English natural voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const englishVoices = allVoices.filter((v) => {
        const l = v.lang.toLowerCase();
        return l.startsWith("en-") || l.startsWith("en_") || l === "en";
      });

      const listToScore = englishVoices.length > 0 ? englishVoices : allVoices;

      // Score and sort
      const curated: CuratedVoice[] = listToScore
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
          };
        })
        .sort((a, b) => (b as any)._score - (a as any)._score);

      setVoices(curated);

      // Pick top-ranked natural voice as default
      if (curated.length > 0) {
        setSelectedVoiceURI((prev) => {
          if (prev && curated.some((c) => c.voice.voiceURI === prev)) {
            const match = curated.find((c) => c.voice.voiceURI === prev);
            if (match) selectedVoiceRef.current = match.voice;
            return prev;
          }
          const best = curated[0];
          selectedVoiceRef.current = best.voice;
          return best.voice.voiceURI;
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
  }, []);

  // Update selectedVoiceRef when selectedVoiceURI changes
  useEffect(() => {
    if (selectedVoiceURI && voices.length > 0) {
      const match = voices.find((v) => v.voice.voiceURI === selectedVoiceURI);
      if (match) {
        selectedVoiceRef.current = match.voice;
      }
    }
  }, [selectedVoiceURI, voices]);

  // Keep-alive timer for Chrome (Chrome pauses SpeechSynthesis after ~14 seconds)
  useEffect(() => {
    if (isPlaying && !isPaused) {
      keepAliveIntervalRef.current = setInterval(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      }, 10000);
    } else {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    }

    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused]);

  // Cleanup on unmount or story switch
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
      if (interSentenceTimeoutRef.current) {
        clearTimeout(interSentenceTimeoutRef.current);
        interSentenceTimeoutRef.current = null;
      }
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, [paragraphs]);

  // 3. Play a specific sentence by index (with automatic fallback to default voice if custom voice fails)
  const playSentence = useCallback(
    (index: number, fallbackWithoutVoice = false) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (index < 0 || index >= sentences.length) {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }

      if (interSentenceTimeoutRef.current) {
        clearTimeout(interSentenceTimeoutRef.current);
        interSentenceTimeoutRef.current = null;
      }
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }

      // If active utterance is in progress, cancel cleanly
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      } catch {}

      const sentenceObj = sentences[index];
      if (!sentenceObj) return;

      setCurrentSentenceIndex(index);
      currentSentenceRef.current = index;
      setIsPlaying(true);
      setIsPaused(false);
      sentenceStartTimeRef.current = Date.now();

      // Small 25ms delay to allow browser speech engine queue to flush cleanly after cancel
      playTimeoutRef.current = setTimeout(() => {
        try {
          ensureSpeechSynthesisUnpaused();

          const utterance = new SpeechSynthesisUtterance(sentenceObj.text);
          activeUtteranceRef.current = utterance;
          retainUtterance(utterance);

          utterance.lang = "en-US";
          utterance.rate = rateRef.current;
          utterance.pitch = 1.0;

          if (!fallbackWithoutVoice && selectedVoiceRef.current) {
            utterance.voice = selectedVoiceRef.current;
          }

          utterance.onstart = () => {
            ensureSpeechSynthesisUnpaused();
          };

          utterance.onend = () => {
            releaseUtterance(utterance);
            if (!isPlayingRef.current || isPausedRef.current) return;

            const nextIndex = currentSentenceRef.current + 1;
            if (nextIndex < sentences.length) {
              // Add a natural 180ms breath pause between sentences for realistic human cadence
              interSentenceTimeoutRef.current = setTimeout(() => {
                playSentence(nextIndex);
              }, 180);
            } else {
              // Finished entire passage
              setIsPlaying(false);
              setIsPaused(false);
              setCurrentSentenceIndex(0);
            }
          };

          utterance.onerror = (e) => {
            releaseUtterance(utterance);
            // "interrupted" or "canceled" errors happen naturally when user skips, pauses, or changes stories
            if (e.error === "interrupted" || e.error === "canceled") {
              return;
            }

            console.warn("[SpeechPlayer] Error on utterance:", e.error);

            // If voice synthesis failed with a custom voice (e.g. network timeout on Google voice),
            // immediately retry this sentence with the browser's default system voice!
            if (!fallbackWithoutVoice && utterance.voice) {
              console.info("[SpeechPlayer] Retrying sentence with default system voice fallback...");
              playSentence(index, true);
              return;
            }

            // If it still errored, advance to next sentence smoothly or pause
            const nextIndex = currentSentenceRef.current + 1;
            if (nextIndex < sentences.length && isPlayingRef.current) {
              interSentenceTimeoutRef.current = setTimeout(() => {
                playSentence(nextIndex);
              }, 200);
            } else {
              setIsPlaying(false);
              setIsPaused(false);
            }
          };

          ensureSpeechSynthesisUnpaused();
          window.speechSynthesis.speak(utterance);

          // Extra safety check: if browser paused immediately after speak, unpause it
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } catch (err) {
          console.error("[SpeechPlayer] Exception during speak:", err);
          setIsPlaying(false);
        }
      }, 25);
    },
    [sentences]
  );

  // 4. Public Controls
  const startPlayer = useCallback(() => {
    ensureSpeechSynthesisUnpaused();
    setIsActive(true);
    playSentence(0);
  }, [playSentence]);

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    ensureSpeechSynthesisUnpaused();
    setIsPaused(false);
    setIsPlaying(true);
    // Restart current sentence cleanly
    playSentence(currentSentenceRef.current);
  }, [playSentence]);

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (interSentenceTimeoutRef.current) {
      clearTimeout(interSentenceTimeoutRef.current);
      interSentenceTimeoutRef.current = null;
    }
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const skipBack = useCallback(() => {
    const elapsed = Date.now() - sentenceStartTimeRef.current;
    // If we've played for more than 1.8 seconds in the current sentence, restart this sentence
    if (elapsed > 1800) {
      playSentence(currentSentenceRef.current);
    } else {
      // Otherwise jump to previous sentence
      const prevIdx = Math.max(0, currentSentenceRef.current - 1);
      playSentence(prevIdx);
    }
  }, [playSentence]);

  const skipForward = useCallback(() => {
    const nextIdx = Math.min(sentences.length - 1, currentSentenceRef.current + 1);
    playSentence(nextIdx);
  }, [sentences.length, playSentence]);

  const seekSentence = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < sentences.length) {
        setIsActive(true);
        playSentence(idx);
      }
    },
    [sentences.length, playSentence]
  );

  const changeRate = useCallback(
    (newRate: number) => {
      setRate(newRate);
      rateRef.current = newRate;
      if (isPlaying) {
        // Re-trigger current sentence smoothly with new speed
        playSentence(currentSentenceRef.current);
      }
    },
    [isPlaying, playSentence]
  );

  const changeVoice = useCallback(
    (voiceURI: string) => {
      setSelectedVoiceURI(voiceURI);
      const match = voices.find((v) => v.voice.voiceURI === voiceURI);
      if (match) {
        selectedVoiceRef.current = match.voice;
        if (isPlaying) {
          playSentence(currentSentenceRef.current);
        }
      }
    },
    [voices, isPlaying, playSentence]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (interSentenceTimeoutRef.current) {
      clearTimeout(interSentenceTimeoutRef.current);
      interSentenceTimeoutRef.current = null;
    }
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    setIsActive(false);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
  }, []);

  return {
    isActive,
    isPlaying,
    isPaused,
    currentSentenceIndex,
    currentSentence: sentences[currentSentenceIndex] || null,
    totalSentences: sentences.length,
    sentences,
    rate,
    voices,
    selectedVoiceURI,
    startPlayer,
    play: resume,
    pause,
    togglePlayPause,
    skipBack,
    skipForward,
    seekSentence,
    changeRate,
    changeVoice,
    stop,
  };
}
