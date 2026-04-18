import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import type { Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useAddMoodEntry,
  useMoodEntries,
  useUserStats,
} from "../../hooks/useQueries";
import { useAppStore } from "../../store/appStore";

// ─── Types ───────────────────────────────────────────────────────────────────

const EMOJIS = [
  { emoji: "😔", score: 1, label: "Very Low" },
  { emoji: "😕", score: 2, label: "Low" },
  { emoji: "😐", score: 3, label: "Okay" },
  { emoji: "🙂", score: 4, label: "Good" },
  { emoji: "😊", score: 5, label: "Great" },
] as const;

const BADGE_DISPLAY: Record<string, { icon: string; desc: string }> = {
  first_entry: { icon: "💛", desc: "First step taken" },
  "3_day_streak": { icon: "🌿", desc: "3 days calm" },
  "7_day_streak": { icon: "⭐", desc: "7-day streak" },
  calm_3: { icon: "🌿", desc: "3 days calm" },
};

const STUDY_SUGGESTIONS: Record<string, string> = {
  low: "Rest is productive too. Take a break and try again in 20 min 🌙",
  mid: "Try a Pomodoro: 25 min focus, 5 min break ⏱️",
  high: "Great energy! Tackle your hardest task first while you feel good 🚀",
};

function getStudySuggestion(score: number): string {
  if (score <= 2) return STUDY_SUGGESTIONS.low;
  if (score === 3) return STUDY_SUGGESTIONS.mid;
  return STUDY_SUGGESTIONS.high;
}

function getUserId(): string {
  let id = localStorage.getItem("mindease_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("mindease_user_id", id);
  }
  return id;
}

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCount({ value }: { value: number }) {
  const springVal = useSpring(0, { stiffness: 60, damping: 18 });
  const display = useTransform(springVal, (v) => Math.round(v).toString());
  useEffect(() => {
    springVal.set(value);
  }, [value, springVal]);
  return <motion.span>{display}</motion.span>;
}

// ─── Breathing Circle (inside modal) ─────────────────────────────────────────

function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const phaseConfig = {
    inhale: { label: "Breathe In…", duration: 4000, scale: 1.35 },
    hold: { label: "Hold…", duration: 2000, scale: 1.35 },
    exhale: { label: "Breathe Out…", duration: 4000, scale: 1.0 },
  } as const;

  useEffect(() => {
    const order: Array<"inhale" | "hold" | "exhale"> = [
      "inhale",
      "hold",
      "exhale",
    ];
    const durations: Record<"inhale" | "hold" | "exhale", number> = {
      inhale: 4000,
      hold: 2000,
      exhale: 4000,
    };
    let idx = order.indexOf(phase);
    const tick = () => {
      idx = (idx + 1) % order.length;
      setPhase(order[idx]);
    };
    const timer = setInterval(tick, durations[phase]);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={{ scale: phaseConfig[phase].scale }}
        transition={{
          duration: phaseConfig[phase].duration / 1000,
          ease: "easeInOut",
        }}
        className="w-36 h-36 rounded-full flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle, oklch(0.84 0.065 144 / 0.8), oklch(0.921 0.04 286 / 0.5))",
          boxShadow: "0 0 60px oklch(0.84 0.065 144 / 0.4)",
        }}
      >
        <motion.div
          animate={{ scale: phaseConfig[phase].scale > 1 ? 0.85 : 1 }}
          transition={{
            duration: phaseConfig[phase].duration / 1000,
            ease: "easeInOut",
          }}
          className="w-20 h-20 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.921 0.04 286 / 0.9), oklch(0.888 0.071 53 / 0.6))",
          }}
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-lg font-medium text-foreground/80"
        >
          {phaseConfig[phase].label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ─── Stress Relief Modal ──────────────────────────────────────────────────────

function StressReliefModal() {
  const { stressReliefOpen, setStressReliefOpen } = useAppStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStressReliefOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setStressReliefOpen]);

  return (
    <AnimatePresence>
      {stressReliefOpen && (
        <motion.div
          data-ocid="stress_relief.dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
          style={{
            background: "oklch(0.18 0.02 260 / 0.92)",
            backdropFilter: "blur(16px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-sm glass-elevated rounded-3xl p-8 flex flex-col items-center gap-6 shadow-elevated text-center"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                You're safe here 💙
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Let's breathe together. Follow the circle and let tension melt
                away.
              </p>
            </div>

            <BreathingCircle />

            <div className="glass rounded-2xl px-5 py-3 w-full">
              <p className="text-xs text-muted-foreground leading-relaxed">
                🤍 It's okay to feel overwhelmed. This moment will pass. You've
                handled tough moments before — you can do this too.
              </p>
            </div>

            <button
              type="button"
              data-ocid="stress_relief.close_button"
              onClick={() => setStressReliefOpen(false)}
              className="btn-pill btn-secondary text-sm"
            >
              I feel better now ✓
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Custom Emoji Dot for Chart ───────────────────────────────────────────────

interface EmojiDotProps {
  cx?: number;
  cy?: number;
  value?: number;
}

function EmojiDot({ cx = 0, cy = 0, value = 3 }: EmojiDotProps) {
  const emoji =
    EMOJIS.find((e) => e.score === Math.round(value))?.emoji ?? "😐";
  return (
    <text
      x={cx}
      y={cy - 6}
      textAnchor="middle"
      fontSize={14}
      style={{ userSelect: "none" }}
    >
      {emoji}
    </text>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MoodPage() {
  const userId = getUserId();
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { setStressReliefOpen } = useAppStore();
  const moodQuery = useMoodEntries(userId);
  const statsQuery = useUserStats(userId);
  const addMood = useAddMoodEntry();

  const entries = moodQuery.data ?? [];
  const stats = statsQuery.data;

  const chartData = entries.slice(-7).map((e, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
    mood: Number(e.moodScore),
  }));

  const handleSubmit = async () => {
    if (selected === null) return;
    const emoji = EMOJIS.find((e) => e.score === selected)?.emoji ?? "😐";
    await addMood.mutateAsync({
      userId,
      moodScore: BigInt(selected),
      emoji,
      note: note || null,
    });
    setLastScore(selected);
    setSubmitted(true);
    setSelected(null);
    setNote("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      <StressReliefModal />

      <div
        ref={containerRef}
        className="px-4 py-6 space-y-5 max-w-lg mx-auto pb-20"
      >
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between gap-3"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              How are you feeling?
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your daily emotional check-in 🌿
            </p>
          </div>

          {/* I Feel Stressed button */}
          <button
            type="button"
            data-ocid="mood.stress_relief_button"
            onClick={() => setStressReliefOpen(true)}
            className="flex-shrink-0 btn-pill text-sm font-semibold transition-smooth"
            style={{
              background: "oklch(var(--accent-coral) / 0.12)",
              color: "oklch(var(--accent-coral))",
              border: "1.5px solid oklch(var(--accent-coral) / 0.3)",
              padding: "0.5rem 1rem",
            }}
          >
            😰 I feel stressed
          </button>
        </motion.div>

        {/* Streak card */}
        {stats && (
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            data-ocid="mood.streak_card"
            className="glass-elevated rounded-3xl px-5 py-4 shadow-soft-lg"
            style={{ background: "oklch(var(--peach) / 0.55)" }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🔥</span>
                  <span className="text-3xl font-bold text-foreground">
                    <AnimatedCount value={Number(stats.currentStreak)} />
                  </span>
                  <span className="text-base font-semibold text-foreground/70">
                    day streak
                  </span>
                </div>
                <p className="text-xs text-foreground/60 ml-11">
                  Keep going — you're doing amazing!
                </p>
              </div>
              <div className="flex gap-1.5">
                {stats.badges.slice(0, 3).map((b, i) => (
                  <motion.span
                    key={b}
                    data-ocid={`mood.badge.${i + 1}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.3 + i * 0.08,
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                    title={BADGE_DISPLAY[b]?.desc ?? b}
                    className="text-2xl"
                    style={{
                      filter:
                        "drop-shadow(0 2px 6px oklch(0.888 0.071 53 / 0.5))",
                    }}
                  >
                    {BADGE_DISPLAY[b]?.icon ?? "🏅"}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Mood input card */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="glass-elevated rounded-3xl p-5 shadow-soft-lg space-y-5 dark:shadow-none"
        >
          <p className="text-sm font-semibold text-muted-foreground">
            Tap an emoji to log your mood
          </p>

          {/* Emoji selector */}
          <div className="flex justify-between gap-1">
            {EMOJIS.map((e) => (
              <button
                key={e.score}
                type="button"
                data-ocid={`mood.checkbox.${e.score}`}
                onClick={() => setSelected(e.score)}
                className="flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-smooth relative"
                style={{
                  background:
                    selected === e.score
                      ? "oklch(var(--lavender) / 0.7)"
                      : "oklch(var(--muted) / 0.5)",
                  transform: selected === e.score ? "scale(1.12)" : "scale(1)",
                  boxShadow:
                    selected === e.score
                      ? "0 0 0 2.5px oklch(0.921 0.04 286), 0 4px 16px oklch(0.921 0.04 286 / 0.35)"
                      : "none",
                }}
              >
                <span className="text-3xl leading-none">{e.emoji}</span>
                <span
                  className="text-xs font-medium leading-none"
                  style={{
                    color:
                      selected === e.score
                        ? "oklch(var(--foreground))"
                        : "oklch(var(--muted-foreground))",
                  }}
                >
                  {e.label}
                </span>
              </button>
            ))}
          </div>

          {/* Note */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)…"
            data-ocid="mood.textarea"
            rows={2}
            className="w-full bg-muted/50 dark:bg-muted/30 rounded-2xl px-4 py-3 text-sm outline-none resize-none border border-border/50 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-smooth text-foreground placeholder:text-muted-foreground"
          />

          {/* Submit / success */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                data-ocid="mood.success_state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl px-4 py-4 space-y-2 text-center"
                style={{ background: "oklch(var(--sage) / 0.55)" }}
              >
                <p className="text-sm font-semibold text-foreground">
                  ✅ Mood logged! Keep it up 🌿
                </p>
                {lastScore !== null && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs text-foreground/70 leading-relaxed"
                  >
                    💡 {getStudySuggestion(lastScore)}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="submit"
                type="button"
                onClick={handleSubmit}
                disabled={selected === null || addMood.isPending}
                data-ocid="mood.submit_button"
                whileHover={
                  selected !== null
                    ? {
                        y: -2,
                        boxShadow:
                          "0 8px 24px oklch(var(--accent-coral) / 0.4)",
                      }
                    : {}
                }
                whileTap={{ scale: 0.98 }}
                className="w-full btn-pill btn-primary font-semibold text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addMood.isPending ? "Saving…" : "Log My Mood"}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Weekly chart card */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="glass-elevated rounded-3xl p-5 shadow-soft-lg dark:shadow-none"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Your week at a glance 📈
          </h2>
          {chartData.length > 0 ? (
            <>
              <svg
                width="0"
                height="0"
                style={{ position: "absolute" }}
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.72 0.05 286)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.80 0.06 144)"
                      stopOpacity={1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="moodAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="oklch(0.72 0.05 286)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.80 0.06 144)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
              </svg>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 4, left: -24, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "12px",
                      backdropFilter: "blur(12px)",
                      fontSize: 12,
                    }}
                    formatter={(v) => {
                      const score = Number(v);
                      const found = EMOJIS.find(
                        (e) => e.score === Math.round(score),
                      );
                      return [
                        `${found?.emoji ?? "😐"} ${found?.label ?? score}`,
                        "Mood",
                      ];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="url(#moodGradient)"
                    strokeWidth={2.5}
                    fill="url(#moodAreaGradient)"
                    dot={<EmojiDot />}
                    activeDot={{
                      r: 6,
                      fill: "oklch(0.72 0.05 286)",
                      strokeWidth: 0,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div
              data-ocid="mood.empty_state"
              className="flex flex-col items-center justify-center py-10 space-y-2 text-center"
            >
              <span className="text-4xl">📊</span>
              <p className="text-sm text-muted-foreground">
                Log your first mood to see your chart here
              </p>
            </div>
          )}
        </motion.div>

        {/* Badges card */}
        {stats && stats.badges.length > 0 && (
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-elevated rounded-3xl p-5 shadow-soft-lg dark:shadow-none"
            style={{ background: "oklch(var(--lavender) / 0.45)" }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Your achievements 🏅
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {stats.badges.map((b, i) => (
                <motion.div
                  key={b}
                  data-ocid={`mood.item.${i + 1}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.4 + i * 0.08,
                    type: "spring",
                    stiffness: 280,
                    damping: 16,
                  }}
                  className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-soft"
                >
                  <span
                    className="text-xl"
                    style={{
                      animation:
                        i === stats.badges.length - 1
                          ? "pulse-ring 2s infinite"
                          : "none",
                    }}
                  >
                    {BADGE_DISPLAY[b]?.icon ?? "🏅"}
                  </span>
                  <span className="text-xs font-semibold text-foreground/80">
                    {BADGE_DISPLAY[b]?.desc ?? b}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
