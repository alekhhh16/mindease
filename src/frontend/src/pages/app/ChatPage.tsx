import { createActor } from "@/backend";
import { useVoice } from "@/hooks/useVoice";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Emotion =
  | "anxious"
  | "sad"
  | "stressed"
  | "overwhelmed"
  | "neutral"
  | "hopeful"
  | "caring"
  | "crisis";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  emotion?: Emotion;
  /** Detected AI emotion label (parsed from backend response) */
  emotionLabel?: string;
}

/** Conversation history entry for backend */
interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_MESSAGE =
  "I'm here for you 💙 It seems I had a small hiccup connecting. Take a deep breath, and try sending your message again in a moment.";

const ERROR_PREFIXES = [
  "API_ERROR:",
  "PARSE_ERROR:",
  "NETWORK_ERROR:",
  "ERROR_DECODE",
  "INPUT_ERROR:",
];

// ─── Emotion Detection (fallback for user messages) ───────────────────────────

const CRISIS_KEYWORDS = [
  "suicide",
  "suicidal",
  "end my life",
  "want to die",
  "hurt myself",
  "kill myself",
  "can't go on",
  "no point living",
];
const STRESSED_KEYWORDS = [
  "stressed",
  "stress",
  "pressure",
  "deadline",
  "exam",
  "fail",
  "failing",
  "can't focus",
  "burnout",
  "burnt out",
  "overwhelmed",
  "too much",
];
const ANXIOUS_KEYWORDS = [
  "anxious",
  "anxiety",
  "panic",
  "scared",
  "fear",
  "worried",
  "worry",
  "nervous",
  "dread",
  "afraid",
];
const SAD_KEYWORDS = [
  "sad",
  "depressed",
  "depression",
  "lonely",
  "alone",
  "hopeless",
  "hopelessness",
  "crying",
  "tears",
  "empty",
  "numb",
];
const TIRED_KEYWORDS = [
  "tired",
  "exhausted",
  "can't sleep",
  "insomnia",
  "no energy",
  "fatigue",
  "drained",
  "sleepless",
];
const HOPEFUL_KEYWORDS = [
  "better",
  "good",
  "okay",
  "fine",
  "hopeful",
  "improving",
  "thanks",
  "helped",
  "grateful",
];
const OVERWHELMED_KEYWORDS = [
  "overwhelmed",
  "too much",
  "can't handle",
  "breaking down",
  "falling apart",
  "losing it",
];

function detectEmotion(text: string): Emotion {
  const lower = text.toLowerCase();
  if (CRISIS_KEYWORDS.some((k) => lower.includes(k))) return "crisis";
  if (OVERWHELMED_KEYWORDS.some((k) => lower.includes(k))) return "overwhelmed";
  if (STRESSED_KEYWORDS.some((k) => lower.includes(k))) return "stressed";
  if (ANXIOUS_KEYWORDS.some((k) => lower.includes(k))) return "anxious";
  if (SAD_KEYWORDS.some((k) => lower.includes(k))) return "sad";
  if (TIRED_KEYWORDS.some((k) => lower.includes(k))) return "overwhelmed";
  if (HOPEFUL_KEYWORDS.some((k) => lower.includes(k))) return "hopeful";
  return "neutral";
}

/** Parse AI response into emotion label + clean response text */
function parseAIResponse(raw: string): {
  emotionLabel: string;
  responseText: string;
} {
  try {
    if (!raw || !raw.trim()) {
      return { emotionLabel: "", responseText: FALLBACK_MESSAGE };
    }
    const trimmed = raw.trim();
    const lines = trimmed.split("\n");
    let emotionLabel = "";
    let responseText = trimmed;

    // New format: first line is "Emotion: <word>", rest is natural response
    const firstLine = lines[0]?.trim() ?? "";
    if (firstLine.toLowerCase().startsWith("emotion:")) {
      emotionLabel = firstLine.replace(/^emotion:\s*/i, "").trim();
      // Everything after the first line is the actual response
      const rest = lines.slice(1).join("\n").trim();
      if (rest) {
        // Strip any accidental "Response:" prefix from the rest
        responseText = rest.replace(/^response:\s*/i, "").trim();
      } else {
        responseText = trimmed;
      }
    } else {
      // Fallback: scan all lines for "Emotion:" and "Response:" prefixes
      for (const line of lines) {
        const l = line.trim();
        if (l.toLowerCase().startsWith("emotion:")) {
          emotionLabel = l.replace(/^emotion:\s*/i, "").trim();
        } else if (l.toLowerCase().startsWith("response:")) {
          responseText = l.replace(/^response:\s*/i, "").trim();
        }
      }
    }

    return {
      emotionLabel,
      responseText: responseText.trim() || FALLBACK_MESSAGE,
    };
  } catch {
    return { emotionLabel: "", responseText: FALLBACK_MESSAGE };
  }
}

/** Map emotion label string to our Emotion type */
function labelToEmotion(label: string): Emotion {
  const l = label.toLowerCase();
  if (l.includes("anxious") || l.includes("anxiety")) return "anxious";
  if (l.includes("sad") || l.includes("depress") || l.includes("lonely"))
    return "sad";
  if (l.includes("stress")) return "stressed";
  if (l.includes("overwhelm")) return "overwhelmed";
  if (l.includes("hopeful") || l.includes("happy") || l.includes("good"))
    return "hopeful";
  if (l.includes("crisis") || l.includes("suicid")) return "crisis";
  if (l.includes("caring") || l.includes("error")) return "caring";
  return "neutral";
}

// ─── Emotion Badge Styles ─────────────────────────────────────────────────────

const EMOTION_STYLES: Record<
  Emotion,
  { bg: string; text: string; emoji: string; label: string }
> = {
  anxious: {
    bg: "bg-lavender/60",
    text: "text-foreground",
    emoji: "😰",
    label: "Anxious",
  },
  sad: {
    bg: "bg-accent/60",
    text: "text-foreground",
    emoji: "🥺",
    label: "Feeling down",
  },
  stressed: {
    bg: "bg-peach/60",
    text: "text-foreground",
    emoji: "😤",
    label: "Stressed",
  },
  overwhelmed: {
    bg: "bg-secondary/70",
    text: "text-foreground",
    emoji: "🌊",
    label: "Overwhelmed",
  },
  neutral: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    emoji: "💬",
    label: "Neutral",
  },
  hopeful: {
    bg: "bg-sage/50",
    text: "text-foreground",
    emoji: "🌱",
    label: "Hopeful",
  },
  caring: {
    bg: "bg-primary/20",
    text: "text-foreground",
    emoji: "💙",
    label: "Caring",
  },
  crisis: {
    bg: "bg-destructive/20",
    text: "text-destructive",
    emoji: "🆘",
    label: "Crisis support",
  },
};

// ─── Quick Replies ────────────────────────────────────────────────────────────

const QUICK_REPLIES = [
  { label: "😰 I feel stressed", text: "I feel really stressed right now" },
  { label: "🧠 Help me focus", text: "I can't focus on my studies at all" },
  {
    label: "🌊 I need grounding",
    text: "I need grounding exercises, I feel overwhelmed",
  },
  {
    label: "😴 I can't sleep",
    text: "I can't sleep, my mind won't stop racing",
  },
];

// ─── BreathingPrompt ──────────────────────────────────────────────────────────

function BreathingPrompt({
  onAccept,
  onDecline,
}: { onAccept: () => void; onDecline: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass rounded-2xl p-4 mx-2 border border-border/50 shadow-soft"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">🫁</span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Quick Breathing Exercise?
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            60 seconds to reset your nervous system
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          data-ocid="chat.breathing_accept_button"
          className="btn-pill btn-primary text-xs py-2 px-4 flex items-center gap-1"
        >
          <Wind size={12} /> Yes, let's breathe
        </button>
        <button
          type="button"
          onClick={onDecline}
          data-ocid="chat.breathing_decline_button"
          className="btn-pill text-xs py-2 px-4 border border-border bg-transparent text-foreground"
        >
          Not right now
        </button>
      </div>
    </motion.div>
  );
}

// ─── BreathingOverlay ─────────────────────────────────────────────────────────

function BreathingOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const phases: Array<{
      name: "inhale" | "hold" | "exhale";
      duration: number;
    }> = [
      { name: "inhale", duration: 4 },
      { name: "hold", duration: 4 },
      { name: "exhale", duration: 4 },
    ];
    let phaseIndex = 0;
    let remaining = phases[0].duration;

    const tick = setInterval(() => {
      remaining -= 1;
      setCount(remaining);
      if (remaining <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (phaseIndex === 0) setCycle((c) => c + 1);
        remaining = phases[phaseIndex].duration;
        setPhase(phases[phaseIndex].name);
        setCount(remaining);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (cycle >= 3) onClose();
  }, [cycle, onClose]);

  const phaseLabels = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center glass-elevated rounded-2xl"
    >
      <p className="text-sm text-muted-foreground mb-6">
        Cycle {cycle + 1} of 3
      </p>
      <motion.div
        animate={{
          scale: phase === "inhale" ? 1.4 : phase === "hold" ? 1.4 : 1,
          opacity: phase === "hold" ? 1 : 0.85,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-28 h-28 rounded-full bg-lavender flex items-center justify-center shadow-soft-lg mb-6"
      >
        <span className="text-3xl font-bold text-foreground">{count}</span>
      </motion.div>
      <p className="text-xl font-semibold text-foreground">
        {phaseLabels[phase]}
      </p>
      <button
        type="button"
        onClick={onClose}
        data-ocid="chat.breathing_close_button"
        className="mt-8 text-xs text-muted-foreground underline underline-offset-2"
      >
        Exit breathing exercise
      </button>
    </motion.div>
  );
}

// ─── CrisisCard ───────────────────────────────────────────────────────────────

function CrisisCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-4"
      data-ocid="chat.crisis_card"
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={16} className="text-destructive flex-shrink-0" />
        <p className="text-sm font-semibold text-destructive">
          Emergency Support Available
        </p>
      </div>
      <p className="text-xs text-foreground/80 mb-3 leading-relaxed">
        You're not alone. Trained counselors are ready to listen — no judgment,
        completely confidential.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/app/sos"
          data-ocid="chat.sos_button"
          className="btn-pill text-xs py-2 px-4 bg-destructive text-destructive-foreground font-semibold"
        >
          View Support Options
        </Link>
        <a
          href="tel:9152987821"
          data-ocid="chat.icall_button"
          className="btn-pill text-xs py-2 px-4 border border-destructive/40 text-destructive font-semibold bg-transparent"
        >
          📞 iCALL: 9152987821
        </a>
        <button
          type="button"
          onClick={onDismiss}
          data-ocid="chat.crisis_dismiss_button"
          className="btn-pill text-xs py-2 px-4 border border-border text-muted-foreground bg-transparent"
        >
          I'm okay for now
        </button>
      </div>
    </motion.div>
  );
}

// ─── Emotion Badge Component ──────────────────────────────────────────────────

function EmotionBadge({
  emotion,
  label,
}: { emotion: Emotion; label?: string }) {
  const style = EMOTION_STYLES[emotion];
  if (emotion === "neutral" && !label) return null;
  const displayLabel = label || style.label;
  if (!displayLabel) return null;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
    >
      <span>{style.emoji}</span>
      {displayLabel}
    </motion.span>
  );
}

// ─── Main ChatPage ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { actor } = useActor(createActor);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      content:
        "Hey there 💙 I'm MindEase, your personal wellness companion. How are you feeling today? I'm here to listen — no judgment, just support. You can share anything on your mind, big or small.",
      timestamp: new Date(),
      emotion: "caring",
      emotionLabel: "Caring",
    },
  ]);

  // Conversation history for backend context (excludes the initial welcome message)
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [showBreathingPrompt, setShowBreathingPrompt] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [latestMoodScore, setLatestMoodScore] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const voice = useVoice();

  // Fetch latest mood from backend on mount
  useEffect(() => {
    if (!actor) return;
    actor
      .getLatestMoodEntry("user")
      .then((entry) => {
        if (entry && "moodScore" in entry) {
          setLatestMoodScore(Number(entry.moodScore));
        }
      })
      .catch(() => {
        // Non-critical — mood context is optional
      });
  }, [actor]);

  // Sync voice transcript to input
  useEffect(() => {
    if (voice.transcript) setInput(voice.transcript);
  }, [voice.transcript]);

  // Auto-scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing change intentional
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText || typing) return;

      const userEmotion = detectEmotion(trimmedText);

      const userMsg: Message = {
        id: nextId.current++,
        role: "user",
        content: trimmedText,
        timestamp: new Date(),
        emotion: userEmotion,
      };

      // Build sanitized conversation history — every content must be a non-empty string
      const sanitizedHistory: ConversationMessage[] = [
        ...conversationHistory,
        { role: "user" as const, content: trimmedText },
      ]
        .filter((m) => typeof m.content === "string" && m.content.trim() !== "")
        .map((m) => ({ role: m.role, content: String(m.content).trim() }));

      setMessages((prev) => [...prev, userMsg]);
      setConversationHistory(sanitizedHistory);
      setInput("");
      voice.clearTranscript();
      if (voiceEnabled) voice.stopListening();
      setTyping(true);

      if (userEmotion === "crisis") setShowSos(true);

      const offerBreathing =
        (userEmotion === "stressed" || userEmotion === "overwhelmed") &&
        !showBreathingPrompt;

      // Pass raw string | null — bindgen's to_candid_opt_n1 handles Candid wrapping automatically.
      // Do NOT pre-wrap as [] | [string]; that causes double-wrapping ([[]] or [["5"]]) which Motoko rejects.
      const moodRaw: string | null =
        latestMoodScore !== null &&
        latestMoodScore !== undefined &&
        !Number.isNaN(latestMoodScore)
          ? String(latestMoodScore)
          : null;

      // Call backend — it performs the OpenAI HTTP outcall server-side securely
      (actor
        ? actor.sendChatMessage(sanitizedHistory, moodRaw)
        : Promise.reject(new Error("Actor not ready"))
      )
        .then((rawResponse: string) => {
          // Check for backend error prefixes BEFORE attempting to parse
          if (ERROR_PREFIXES.some((prefix) => rawResponse.startsWith(prefix))) {
            console.error("[MindEase] AI backend error:", rawResponse);
            const fallbackMsg: Message = {
              id: nextId.current++,
              role: "ai",
              content: FALLBACK_MESSAGE,
              timestamp: new Date(),
              emotion: "caring",
              emotionLabel: "Caring",
            };
            setMessages((prev) => [...prev, fallbackMsg]);
            setTyping(false);
            return;
          }

          const { emotionLabel, responseText } = parseAIResponse(rawResponse);
          const mappedEmotion = emotionLabel
            ? labelToEmotion(emotionLabel)
            : userEmotion;

          const aiMsg: Message = {
            id: nextId.current++,
            role: "ai",
            content: responseText,
            timestamp: new Date(),
            emotion: mappedEmotion,
            emotionLabel: emotionLabel || undefined,
          };

          // Add AI response to conversation history
          setConversationHistory((prev) => [
            ...prev,
            { role: "assistant", content: responseText },
          ]);

          setMessages((prev) => [...prev, aiMsg]);
          setTyping(false);

          if (offerBreathing) setShowBreathingPrompt(true);
          if (ttsEnabled) setTimeout(() => voice.speak(responseText), 200);
        })
        .catch((err: unknown) => {
          console.error("[MindEase] AI chat exception:", err);
          // Friendly fallback — never show raw errors to user
          const fallbackMsg: Message = {
            id: nextId.current++,
            role: "ai",
            content: FALLBACK_MESSAGE,
            timestamp: new Date(),
            emotion: "caring",
            emotionLabel: "Caring",
          };

          setMessages((prev) => [...prev, fallbackMsg]);
          setTyping(false);
        });
    },
    [
      typing,
      voiceEnabled,
      ttsEnabled,
      showBreathingPrompt,
      voice,
      conversationHistory,
      latestMoodScore,
      actor,
    ],
  );

  const handleVoiceToggle = () => {
    if (!voice.isSupported) return;
    if (voiceEnabled && voice.isListening) {
      voice.stopListening();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      voice.startListening();
    }
  };

  const handleBreathingAccept = () => {
    setShowBreathingPrompt(false);
    setShowBreathingExercise(true);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Breathing overlay */}
      <AnimatePresence>
        {showBreathingExercise && (
          <BreathingOverlay onClose={() => setShowBreathingExercise(false)} />
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={m.id}
              data-ocid={`chat.item.${i + 1}`}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* AI Avatar */}
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-peach flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1 shadow-soft">
                  🌿
                </div>
              )}

              <div
                className={`flex flex-col gap-1.5 max-w-[78%] sm:max-w-sm ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {/* Emotion badge — for user messages (detected from input) */}
                {m.role === "user" && m.emotion && m.emotion !== "neutral" && (
                  <EmotionBadge emotion={m.emotion} />
                )}

                {/* Chat bubble — clean content only, no "Response:" prefix */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                    m.role === "user"
                      ? "glass-elevated rounded-br-sm bg-primary/15 text-foreground dark:bg-primary/20"
                      : "glass rounded-bl-sm shadow-soft"
                  }`}
                >
                  {m.content}
                </div>

                {/* Emotion badge — for AI messages (parsed from backend response) */}
                {m.role === "ai" &&
                  m.emotionLabel &&
                  m.emotion &&
                  m.emotion !== "neutral" && (
                    <EmotionBadge emotion={m.emotion} label={m.emotionLabel} />
                  )}

                <span className="text-[10px] text-muted-foreground px-1">
                  {m.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex justify-start"
              data-ocid="chat.loading_state"
            >
              <div className="w-8 h-8 rounded-full bg-peach flex items-center justify-center text-sm mr-2 flex-shrink-0 shadow-soft">
                🌿
              </div>
              <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm shadow-soft">
                <div className="flex gap-1 items-center">
                  <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crisis card */}
        <AnimatePresence>
          {showSos && <CrisisCard onDismiss={() => setShowSos(false)} />}
        </AnimatePresence>

        {/* Breathing prompt */}
        <AnimatePresence>
          {showBreathingPrompt && (
            <BreathingPrompt
              onAccept={handleBreathingAccept}
              onDecline={() => setShowBreathingPrompt(false)}
            />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div
        className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none"
        data-ocid="chat.quick_replies"
      >
        {QUICK_REPLIES.map((qr) => (
          <motion.button
            key={qr.label}
            type="button"
            onClick={() => sendMessage(qr.text)}
            data-ocid="chat.secondary_button"
            disabled={typing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-pill glass text-foreground text-xs whitespace-nowrap shadow-soft disabled:opacity-40 hover:bg-accent/20 transition-colors flex-shrink-0 py-2 px-4"
          >
            {qr.label}
          </motion.button>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-5 pt-2 bg-card/80 backdrop-blur-sm border-t border-border/60 flex gap-2 items-center">
        {/* Voice toggle */}
        <motion.button
          type="button"
          onClick={handleVoiceToggle}
          disabled={!voice.isSupported}
          data-ocid="chat.voice_toggle"
          whileTap={{ scale: 0.92 }}
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            voice.isListening
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-muted text-muted-foreground hover:bg-accent/30"
          } disabled:opacity-40`}
          aria-label={
            voice.isListening ? "Stop listening" : "Start voice input"
          }
        >
          {voice.isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
            >
              <Mic size={14} />
            </motion.div>
          ) : (
            <MicOff size={14} />
          )}
        </motion.button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && sendMessage(input)
          }
          placeholder={
            voice.isListening
              ? "Listening… speak now"
              : "Share how you're feeling…"
          }
          data-ocid="chat.input"
          className="flex-1 min-w-0 bg-muted/60 dark:bg-muted/40 rounded-full px-4 py-2.5 text-sm outline-none border border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
        />

        {/* TTS toggle */}
        <motion.button
          type="button"
          onClick={() => setTtsEnabled((v) => !v)}
          data-ocid="chat.tts_toggle"
          whileTap={{ scale: 0.92 }}
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            ttsEnabled
              ? "bg-sage/60 text-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent/30"
          }`}
          aria-label={
            ttsEnabled ? "Disable voice responses" : "Enable voice responses"
          }
        >
          {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </motion.button>

        {/* Send button */}
        <motion.button
          type="button"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || typing}
          data-ocid="chat.submit_button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 shadow-soft flex-shrink-0"
          aria-label="Send message"
        >
          <Send size={15} />
        </motion.button>
      </div>

      {/* Speaking indicator */}
      <AnimatePresence>
        {voice.isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 glass-elevated rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-foreground shadow-soft"
            data-ocid="chat.speaking_state"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
              className="w-1.5 h-1.5 rounded-full bg-sage"
            />
            MindEase is speaking…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
