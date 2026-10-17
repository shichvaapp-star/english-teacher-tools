"use client";

export interface TutorVoiceOption {
  id: string;
  voice: SpeechSynthesisVoice;
  titleHebrew: string;
  subtitle: string;
  accent: "US" | "UK" | "Other";
  isNatural: boolean;
}

// Score voice quality to find the most human, warm, and natural English voices
export function scoreTutorVoice(v: SpeechSynthesisVoice): number {
  let score = 0;
  const name = v.name.toLowerCase();
  const uri = v.voiceURI.toLowerCase();

  const lang = v.lang.toLowerCase();
  const isUK = lang.includes("gb") || lang.includes("uk") || lang.includes("en-gb");

  // Top priority: Google Natural (UK) / British natural voices
  if ((name.includes("google") || uri.includes("google")) && isUK) {
    score += 100;
  } else if (isUK && (name.includes("natural") || name.includes("enhanced") || name.includes("daniel") || name.includes("oliver"))) {
    score += 80;
  } else if (name.includes("natural") || uri.includes("natural")) {
    score += 60;
  } else if (name.includes("google") || uri.includes("google")) {
    score += 50;
  } else if (name.includes("enhanced") || uri.includes("enhanced")) {
    score += 40;
  } else if (name.includes("premium") || uri.includes("premium")) {
    score += 35;
  } else if (name.includes("siri") || uri.includes("siri")) {
    score += 35;
  } else if (name.includes("online") || uri.includes("online")) {
    score += 25;
  }

  // Well-known high-prosody voice actors
  if (name.includes("daniel") || name.includes("oliver")) score += 30;
  if (name.includes("samantha") || name.includes("jenny") || name.includes("guy")) score += 20;
  if (name.includes("serena") || name.includes("tom") || name.includes("karen")) score += 15;

  // Penalize robotic, low-quality legacy voices
  if (name.includes("alex") || name.includes("fred") || name.includes("victoria") || name.includes("junior")) {
    score -= 25;
  }
  if (name.includes("albert") || name.includes("bad news") || name.includes("bahh")) {
    score -= 50;
  }

  // Prefer cloud/neural services when available
  if (v.localService === false) score += 10;

  return score;
}

export function getCuratedTutorVoices(): TutorVoiceOption[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  const allVoices = window.speechSynthesis.getVoices();
  if (!allVoices || allVoices.length === 0) return [];

  // Filter English voices
  const english = allVoices.filter(
    (v) => v.lang.toLowerCase().startsWith("en") || v.lang.toLowerCase().startsWith("en-")
  );

  // Score and sort
  const scored = english
    .map((v) => ({
      voice: v,
      score: scoreTutorVoice(v),
    }))
    .sort((a, b) => b.score - a.score);

  const curated: TutorVoiceOption[] = [];
  const seenNames = new Set<string>();

  for (const item of scored) {
    const v = item.voice;
    const cleanName = v.name.replace(/\(.*?\)/g, "").replace(/Desktop/i, "").trim();

    if (seenNames.has(cleanName.toLowerCase())) continue;
    seenNames.add(cleanName.toLowerCase());

    const lang = v.lang.toLowerCase();
    const isUK = lang.includes("gb") || lang.includes("uk") || lang.includes("en-gb");
    const accent = isUK ? "UK" : "US";
    const isNatural = item.score >= 25;

    let titleHebrew = `${cleanName}`;
    let subtitle = accent === "UK" ? "מבטא בריטי קלאסי • British Accent" : "מבטא אמריקאי טבעי • US Accent";

    if (v.name.toLowerCase().includes("google")) {
      titleHebrew = `Google Natural (${accent})`;
      subtitle = "קול שוטף וטבעי • Neural HD Voice";
    } else if (v.name.toLowerCase().includes("siri")) {
      titleHebrew = `Siri English (${accent})`;
      subtitle = "קול חי ומעודד • Apple Voice";
    } else if (v.name.toLowerCase().includes("daniel")) {
      titleHebrew = "Daniel (British)";
      subtitle = "מבטא בריטי ברור ומדויק";
    } else if (v.name.toLowerCase().includes("samantha")) {
      titleHebrew = "Samantha (US)";
      subtitle = "קול אמריקאי ידידותי וברור";
    }

    curated.push({
      id: v.voiceURI,
      voice: v,
      titleHebrew,
      subtitle,
      accent,
      isNatural,
    });

    if (curated.length >= 6) break;
  }

  return curated;
}
