"use client";

import { useVoice } from "@/hooks/useVoice";
import { useLatestMoodEntry } from "@/hooks/useQueries";
import Link from "next/link";
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

// Types
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
  emotionLabel?: string;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

const FALLBACK_MESSAGE =
  "I'm here for you. It seems I had a small hiccup connecting. Take a deep breath, and try sending your message again in a moment.";

// Emotion Detection
const CRISIS_KEYWORDS = ["suicide", "suicidal", "end my life", "want to die", "hurt myself", "kill myself"];
const STRESSED_KEYWORDS = ["stressed", "stress", "pressure", "deadline", "exam", "overwhelmed"];
const ANXIOUS_KEYWORDS = ["anxious", "anxiety", "panic", "scared", "fear", "worried", "nervous"];
const SAD_KEYWORDS = ["sad", "depressed", "lonely", "alone", "hopeless", "crying"];
const HOPEFUL_KEYWORDS = ["better", "good", "okay", "fine", "hopeful", "grateful", "thanks"];

function detectEmotion(text: string): Emotion {
  const lower = text.toLowerCase();
  if (CRISIS_KEYWORDS.some((k) => lower.includes(k))) return "crisis";
  if (STRESSED_KEYWORDS.some((k) => lower.includes(k))) return "stressed";
  if (ANXIOUS_KEYWORDS.some((k) => lower.includes(k))) return "anxious";
  if (SAD_KEYWORDS.some((k) => lower.includes(k))) return "sad";
  if (HOPEFUL_KEYWORDS.some((k) => lower.includes(k))) return "hopeful";
  return "neutral";
}

function parseAIResponse(raw: string): { emotionLabel: string; responseText: string } {
  if (!raw?.trim()) return { emotionLabel: "", responseText: FALLBACK_MESSAGE };
  const lines = raw.trim().split("\n");
  const firstLine = lines[0]?.trim() ?? "";
  if (firstLine.toLowerCase().startsWith("emotion:")) {
    const emotionLabel = firstLine.replace(/^emotion:\s*/i, "").trim();
    const rest = lines.slice(1).join("\n").trim();
    return { emotionLabel, responseText: rest || raw.trim() };
  }
  return { emotionLabel: "", responseText: raw.trim() };
}

function labelToEmotion(label: string): Emotion {
  const l = label.toLowerCase();
  if (l.includes("anxious") || l.includes("anxiety")) return "anxious";
  if (l.includes("sad") || l.includes("depress")) return "sad";
  if (l.includes("stress")) return "stressed";
  if (l.includes("overwhelm")) return "overwhelmed";
  if (l.includes("hopeful") || l.includes("happy")) return "hopeful";
  if (l.includes("crisis")) return "crisis";
  if (l.includes("caring")) return "caring";
  return "neutral";
}

const EMOTION_STYLES: Record<Emotion, { bg: string; text: string; emoji: string; label: string }> = {
  anxious: { bg: "bg-lavender/60", text: "text-foreground", emoji: "😰", label: "Anxious" },
  sad: { bg: "bg-accent/60", text: "text-foreground", emoji: "🥺", label: "Feeling down" },
  stressed: { bg: "bg-peach/60", text: "text-foreground", emoji: "😤", label: "Stressed" },
  overwhelmed: { bg: "bg-secondary/70", text: "text-foreground", emoji: "🌊", label: "Overwhelmed" },
  neutral: { bg: "bg-muted", text: "text-muted-foreground", emoji: "💬", label: "Neutral" },
  hopeful: { bg: "bg-sage/50", text: "text-foreground", emoji: "🌱", label: "Hopeful" },
  caring: { bg: "bg-primary/20", text: "text-foreground", emoji: "💙", label: "Caring" },
  crisis: { bg: "bg-destructive/20", text: "text-destructive", emoji: "🆘", label: "Crisis support" },
};

const QUICK_REPLIES = [
  { label: "😰 I feel stressed", text: "I feel really stressed right now" },
  { label: "🧠 Help me focus", text: "I can't focus on my studies at all" },
  { label: "🌊 I need grounding", text: "I need grounding exercises, I feel overwhelmed" },
  { label: "😴 I can't sleep", text: "I can't sleep, my mind won't stop racing" },
];

function BreathingPrompt({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
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
          <p className="text-sm font-semibold text-foreground">Quick Breathing Exercise?</p>
          <p className="text-xs text-muted-foreground mt-0.5">60 seconds to reset your nervous system</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="btn-pill btn-primary text-xs py-2 px-4 flex items-center gap-1"
        >
          <Wind size={12} /> {"Yes, let's breathe"}
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="btn-pill text-xs py-2 px-4 border border-border bg-transparent text-foreground"
        >
          Not right now
        </button>
      </div>
    </motion.div>
  );
}

function BreathingOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const phases = [
      { name: "inhale" as const, duration: 4 },
      { name: "hold" as const, duration: 4 },
      { name: "exhale" as const, duration: 4 },
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

  const phaseLabels = { inhale: "Breathe In", hold: "Hold", exhale: "Breathe Out" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center glass-elevated rounded-2xl"
    >
      <p className="text-sm text-muted-foreground mb-6">Cycle {cycle + 1} of 3</p>
      <motion.div
        animate={{ scale: phase === "inhale" ? 1.4 : phase === "hold" ? 1.4 : 1, opacity: phase === "hold" ? 1 : 0.85 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-28 h-28 rounded-full bg-lavender flex items-center justify-center shadow-soft-lg mb-6"
      >
        <span className="text-3xl font-bold text-foreground">{count}</span>
      </motion.div>
      <p className="text-xl font-semibold text-foreground">{phaseLabels[phase]}</p>
      <button type="button" onClick={onClose} className="mt-8 text-xs text-muted-foreground underline">
        Exit breathing exercise
      </button>
    </motion.div>
  );
}

function CrisisCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={16} className="text-destructive flex-shrink-0" />
        <p className="text-sm font-semibold text-destructive">Emergency Support Available</p>
      </div>
      <p className="text-xs text-foreground/80 mb-3 leading-relaxed">
        {"You're not alone. Trained counselors are ready to listen — no judgment, completely confidential."}
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/app/sos" className="btn-pill text-xs py-2 px-4 bg-destructive text-destructive-foreground font-semibold">
          View Support Options
        </Link>
        <a href="tel:9152987821" className="btn-pill text-xs py-2 px-4 border border-destructive/40 text-destructive font-semibold bg-transparent">
          📞 iCALL: 9152987821
        </a>
        <button type="button" onClick={onDismiss} className="btn-pill text-xs py-2 px-4 border border-border text-muted-foreground bg-transparent">
          {"I'm okay for now"}
        </button>
      </div>
    </motion.div>
  );
}

function EmotionBadge({ emotion, label }: { emotion: Emotion; label?: string }) {
  const style = EMOTION_STYLES[emotion];
  if (emotion === "neutral" && !label) return null;
  const displayLabel = label || style.label;
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

function getUserId(): string {
  if (typeof window === "undefined") return "default";
  let id = localStorage.getItem("mindease_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("mindease_user_id", id);
  }
  return id;
}

export default function ChatPage() {
  const [userId, setUserId] = useState("default");
  
  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const { data: latestMood } = useLatestMoodEntry(userId);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      content: "Hey there 💙 I'm MindEase, your personal wellness companion. How are you feeling today? I'm here to listen — no judgment, just support.",
      timestamp: new Date(),
      emotion: "caring",
      emotionLabel: "Caring",
    },
  ]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [showBreathingPrompt, setShowBreathingPrompt] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const voice = useVoice();

  useEffect(() => {
    if (voice.transcript) setInput(voice.transcript);
  }, [voice.transcript]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = useCallback(
    async (text: string) => {
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

      const sanitizedHistory: ConversationMessage[] = [
        ...conversationHistory,
        { role: "user" as const, content: trimmedText },
      ].filter((m) => m.content.trim() !== "");

      setMessages((prev) => [...prev, userMsg]);
      setConversationHistory(sanitizedHistory);
      setInput("");
      voice.clearTranscript();
      if (voiceEnabled) voice.stopListening();
      setTyping(true);

      if (userEmotion === "crisis") setShowSos(true);

      const offerBreathing = (userEmotion === "stressed" || userEmotion === "overwhelmed") && !showBreathingPrompt;

      const moodRaw = latestMood?.moodScore ? String(latestMood.moodScore) : null;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: sanitizedHistory, latestMood: moodRaw }),
        });
        const data = await res.json();
        const rawResponse = data.response || FALLBACK_MESSAGE;

        const { emotionLabel, responseText } = parseAIResponse(rawResponse);
        const mappedEmotion = emotionLabel ? labelToEmotion(emotionLabel) : userEmotion;

        const aiMsg: Message = {
          id: nextId.current++,
          role: "ai",
          content: responseText,
          timestamp: new Date(),
          emotion: mappedEmotion,
          emotionLabel: emotionLabel || undefined,
        };

        setConversationHistory((prev) => [...prev, { role: "assistant", content: responseText }]);
        setMessages((prev) => [...prev, aiMsg]);
        setTyping(false);

        if (offerBreathing) setShowBreathingPrompt(true);
        if (ttsEnabled) setTimeout(() => voice.speak(responseText), 200);
      } catch {
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
      }
    },
    [typing, voiceEnabled, ttsEnabled, showBreathingPrompt, voice, conversationHistory, latestMood]
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

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <AnimatePresence>
        {showBreathingExercise && <BreathingOverlay onClose={() => setShowBreathingExercise(false)} />}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : ""}`}>
              {msg.emotion && msg.role === "ai" && (
                <div className="mb-1.5">
                  <EmotionBadge emotion={msg.emotion} label={msg.emotionLabel} />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-peach text-foreground rounded-br-sm"
                    : "glass text-foreground rounded-bl-sm shadow-soft"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm shadow-soft">
              <div className="flex gap-1">
                <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showSos && <CrisisCard onDismiss={() => setShowSos(false)} />}
          {showBreathingPrompt && (
            <BreathingPrompt
              onAccept={() => { setShowBreathingPrompt(false); setShowBreathingExercise(true); }}
              onDecline={() => setShowBreathingPrompt(false)}
            />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr.text}
                type="button"
                onClick={() => sendMessage(qr.text)}
                className="btn-pill glass text-xs font-medium px-3 py-2 hover:bg-accent/40 transition-smooth"
              >
                {qr.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 glass border-t border-border/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-2.5 rounded-full transition-smooth ${
              voiceEnabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {voiceEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Share how you're feeling..."
            className="flex-1 bg-muted/50 rounded-full px-4 py-2.5 text-sm outline-none border border-border/50 focus:border-primary/50 transition-smooth"
          />

          <button
            type="button"
            onClick={() => setTtsEnabled((v) => !v)}
            className={`p-2.5 rounded-full transition-smooth ${
              ttsEnabled ? "bg-sage text-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="p-2.5 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-smooth"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
