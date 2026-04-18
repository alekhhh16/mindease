"use client";

import Link from "next/link";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDailyQuote } from "@/hooks/useJournalQueries";
import { useMoodEntries, useUserStats } from "@/hooks/useQueries";
import { useAppStore } from "@/store/appStore";

function getUserId(): string {
  if (typeof window === "undefined") return "default";
  let id = localStorage.getItem("mindease_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("mindease_user_id", id);
  }
  return id;
}

const QUICK_LINKS = [
  {
    to: "/app/chat",
    emoji: "💬",
    label: "AI Chat",
    desc: "Talk to MindEase",
    color: "from-rose-400/20 to-orange-300/20",
    ocid: "dashboard.quicklink.item.1",
  },
  {
    to: "/app/selfhelp",
    emoji: "🌬️",
    label: "Breathe",
    desc: "Calm your mind",
    color: "from-sky-400/20 to-indigo-300/20",
    ocid: "dashboard.quicklink.item.2",
  },
  {
    to: "/app/selfhelp",
    emoji: "🌿",
    label: "Ground",
    desc: "Be present",
    color: "from-emerald-400/20 to-teal-300/20",
    ocid: "dashboard.quicklink.item.3",
  },
  {
    to: "/app/sos",
    emoji: "🚨",
    label: "SOS",
    desc: "Immediate help",
    color: "from-red-400/20 to-pink-300/20",
    ocid: "dashboard.quicklink.item.4",
  },
];

const BADGE_ICONS: Record<string, string> = {
  first_entry: "🌱",
  "3_day_streak": "🔥",
  "7_day_streak": "⚡",
  "30_day_streak": "🏆",
  "10_entries": "📝",
  mood_improver: "📈",
  consistency: "⭐",
};

function getMoodEmoji(score: number) {
  if (score <= 1) return "😔";
  if (score <= 2) return "😟";
  if (score <= 3) return "😐";
  if (score <= 4) return "🙂";
  return "😊";
}

// Framer Motion breathing loop for StressReliefModal
const BREATH_PHASES = [
  { label: "Inhale...", duration: 4, scale: 1.45 },
  { label: "Hold...", duration: 4, scale: 1.45 },
  { label: "Exhale...", duration: 4, scale: 1 },
];

function StressReliefModal({ onClose }: { onClose: () => void }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = BREATH_PHASES[phaseIdx];

  useEffect(() => {
    const t = setTimeout(() => {
      setPhaseIdx((i) => (i + 1) % BREATH_PHASES.length);
    }, phase.duration * 1000);
    return () => clearTimeout(t);
  }, [phase.duration]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backdropFilter: "blur(20px)",
        background: "oklch(0.18 0.02 260 / 0.85)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="stress-relief.dialog"
    >
      <motion.div
        className="relative w-full max-w-sm mx-4 glass-elevated rounded-3xl p-8 flex flex-col items-center gap-6 shadow-elevated"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <button
          type="button"
          onClick={onClose}
          data-ocid="stress-relief.close_button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:bg-muted transition-smooth"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Stress Relief
          </p>
          <h2 className="text-xl font-bold text-foreground">
            {"Let's breathe together 🌬️"}
          </h2>
        </div>

        {/* Animated breathing circle */}
        <div className="relative flex items-center justify-center w-36 h-36">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.82 0.055 290 / 0.3) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1.2, 1], opacity: [0.5, 0.9, 0.9, 0.5] }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              times: [0, 0.33, 0.67, 1],
            }}
          />
          {/* Main circle */}
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-elevated"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.055 290 / 0.8), oklch(0.715 0.099 34 / 0.6))",
              boxShadow: "0 0 40px oklch(0.82 0.055 290 / 0.5)",
            }}
            animate={{ scale: phase.scale }}
            transition={{ duration: phase.duration, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={phaseIdx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-bold text-foreground text-center leading-tight px-2"
              >
                {phase.label}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          {"You're doing great. Keep breathing slowly. Each breath brings you closer to calm."}
        </p>

        <div className="w-full glass rounded-2xl p-4 text-center">
          <p className="text-sm font-medium text-foreground">
            {"\"You don't have to have it all figured out. Just breathe.\""}
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <Link
            href="/app/selfhelp"
            onClick={onClose}
            data-ocid="stress-relief.secondary_button"
            className="flex-1 btn-pill btn-secondary text-center text-sm font-semibold py-2.5"
          >
            More Exercises
          </Link>
          <button
            type="button"
            onClick={onClose}
            data-ocid="stress-relief.confirm_button"
            className="flex-1 btn-pill btn-primary text-sm font-semibold py-2.5"
          >
            I Feel Better
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Custom dot renderer for Recharts
function MoodDot(props: {
  cx?: number;
  cy?: number;
  payload?: { score: number };
}) {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload) return null;
  return (
    <text x={cx} y={cy - 4} textAnchor="middle" fontSize={14}>
      {getMoodEmoji(payload.score)}
    </text>
  );
}

export default function DashboardPage() {
  const [userId, setUserId] = useState("default");
  
  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const { data: moodEntries } = useMoodEntries(userId);
  const { data: userStats } = useUserStats(userId);
  const { data: quote, isLoading: quoteLoading } = useDailyQuote();
  const { stressReliefOpen, setStressReliefOpen } = useAppStore();

  const [hour] = useState(() => new Date().getHours());
  const timeGreeting =
    hour < 12
      ? "Good morning ☀️"
      : hour < 17
        ? "Good afternoon 🌤️"
        : "Good evening 🌙";

  // Build last-7-days chart data
  const chartData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86_400_000);
      return {
        day: days[d.getDay()],
        score: null as number | null,
        date: d.toDateString(),
      };
    });
    if (moodEntries) {
      for (const entry of moodEntries) {
        const dateStr = new Date(entry.timestamp).toDateString();
        const slot = result.find((r) => r.date === dateStr);
        if (slot) slot.score = Number(entry.moodScore);
      }
    }
    return result.map((r) => ({ ...r, score: r.score ?? 0 }));
  })();

  const latest = moodEntries?.[moodEntries.length - 1];
  const latestEmoji = latest ? getMoodEmoji(Number(latest.moodScore)) : "—";

  // Calculate streak
  const streak = (() => {
    if (!moodEntries || moodEntries.length === 0) return 0;
    const dates = [
      ...new Set(
        moodEntries.map((e) => new Date(e.timestamp).toDateString())
      ),
    ].reverse();
    let s = 0;
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] === new Date(Date.now() - i * 86_400_000).toDateString())
        s++;
      else break;
    }
    return s;
  })();

  const badges: string[] = userStats?.badges ?? [];

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
  };

  return (
    <>
      <AnimatePresence>
        {stressReliefOpen && (
          <StressReliefModal onClose={() => setStressReliefOpen(false)} />
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-full p-4 pb-8 space-y-4 max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero greeting card */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl p-5 shadow-soft"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.921 0.04 286 / 0.55) 0%, oklch(0.888 0.071 53 / 0.45) 100%)",
            backdropFilter: "blur(12px)",
            border: "1px solid oklch(var(--border) / 0.25)",
          }}
          data-ocid="dashboard.hero.card"
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, oklch(0.715 0.099 34) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {timeGreeting}
          </p>
          <h1 className="text-xl font-bold text-foreground leading-snug mb-2">
            Your safe space is here 💛
          </h1>
          {quoteLoading ? (
            <div
              className="h-3.5 bg-muted/40 rounded-full animate-pulse w-4/5"
              data-ocid="dashboard.quote.loading_state"
            />
          ) : (
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              &ldquo;{quote || "You are worthy of rest, joy, and healing."}
              &rdquo;
            </p>
          )}
        </motion.div>

        {/* I Feel Stressed hero button */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={() => setStressReliefOpen(true)}
            data-ocid="dashboard.stress_relief.primary_button"
            className="w-full relative overflow-hidden rounded-2xl py-5 px-6 flex items-center justify-center gap-3 shadow-elevated transition-smooth hover:shadow-elevated hover:-translate-y-0.5 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.715 0.099 34) 0%, oklch(0.65 0.12 20) 100%)",
            }}
          >
            {/* Pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  "0 0 0 0px oklch(0.715 0.099 34 / 0.5)",
                  "0 0 0 12px oklch(0.715 0.099 34 / 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
            <span className="text-2xl">💆</span>
            <div className="text-left">
              <p className="text-base font-bold text-white leading-tight">
                I Feel Stressed
              </p>
              <p className="text-xs text-white/75">Tap for instant relief</p>
            </div>
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-3"
          data-ocid="dashboard.stats.panel"
        >
          {[
            {
              icon: streak > 0 ? "🔥" : "💤",
              value: streak,
              label: "Day streak",
              id: "streak",
            },
            {
              icon: latestEmoji,
              value: latest ? Number(latest.moodScore).toFixed(0) : "—",
              label: "Last mood",
              id: "mood",
            },
            {
              icon: "📝",
              value: moodEntries?.length ?? 0,
              label: "Total logs",
              id: "logs",
            },
          ].map((stat) => (
            <div
              key={stat.id}
              className="glass rounded-2xl p-3 flex flex-col items-center gap-1 shadow-soft"
            >
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-base font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Mood chart */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-3xl p-4 shadow-soft"
          data-ocid="dashboard.chart.panel"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
            📊 Weekly Mood
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart
              data={chartData}
              margin={{ top: 16, right: 4, left: -28, bottom: 0 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.82 0.055 290)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.82 0.055 290)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "oklch(0.55 0.01 80)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 5]}
                tick={{ fontSize: 10, fill: "oklch(0.55 0.01 80)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.24 0.025 260 / 0.9)",
                  border: "1px solid oklch(0.3 0.02 260)",
                  borderRadius: "0.75rem",
                  fontSize: "11px",
                  backdropFilter: "blur(8px)",
                }}
                formatter={(val: number) => [
                  `${getMoodEmoji(val)} ${val}`,
                  "Mood",
                ]}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="oklch(0.82 0.055 290)"
                strokeWidth={2}
                fill="url(#moodGradient)"
                dot={(props) => (
                  <MoodDot
                    {...props}
                    payload={props.payload as { score: number }}
                  />
                )}
                activeDot={{ r: 4, fill: "oklch(0.82 0.055 290)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Badges */}
        <motion.div variants={itemVariants} data-ocid="dashboard.badges.panel">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
            🏅 Your Badges
          </p>
          {badges.length === 0 ? (
            <div
              className="glass rounded-2xl p-5 text-center shadow-soft"
              data-ocid="dashboard.badges.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                Start tracking your mood to earn badges ✨
              </p>
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {badges.map((badge, i) => (
                <div
                  key={badge}
                  data-ocid={`dashboard.badge.item.${i + 1}`}
                  className="glass rounded-full px-4 py-2 flex items-center gap-1.5 shadow-soft whitespace-nowrap flex-shrink-0"
                >
                  <span>{BADGE_ICONS[badge] ?? "🌟"}</span>
                  <span className="text-xs font-semibold text-foreground capitalize">
                    {badge.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick links */}
        <motion.div
          variants={itemVariants}
          data-ocid="dashboard.quicklinks.panel"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
            ⚡ Quick Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.ocid}
                href={link.to}
                data-ocid={link.ocid}
                className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-3 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 active:scale-95 transition-smooth"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--card) / 0.5), oklch(var(--card) / 0.3))",
                  backdropFilter: "blur(12px)",
                  border: "1px solid oklch(var(--border) / 0.25)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-50 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${link.color.replace("from-", "").replace(" to-", ", ")})`,
                  }}
                />
                <span className="relative text-2xl">{link.emoji}</span>
                <div className="relative min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {link.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {link.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
