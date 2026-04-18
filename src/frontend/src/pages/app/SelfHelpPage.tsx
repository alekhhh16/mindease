import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type BreathPhase = "idle" | "inhale" | "hold" | "exhale";
type PomodoroMode = "work" | "break";

// ─── Breathing Module ─────────────────────────────────────────────────────────
const PHASE_LABELS: Record<BreathPhase, string> = {
  idle: "Ready to begin",
  inhale: "Inhale (4s)",
  hold: "Hold (7s)",
  exhale: "Exhale (8s)",
};
const PHASE_DURATIONS: Record<Exclude<BreathPhase, "idle">, number> = {
  inhale: 4000,
  hold: 7000,
  exhale: 8000,
};

function BreathingModule() {
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const runCycle = useCallback(
    (p: Exclude<BreathPhase, "idle">) => {
      setPhase(p);
      const dur = PHASE_DURATIONS[p];
      let remaining = Math.round(dur / 1000);
      setCount(remaining);
      intervalRef.current = setInterval(() => {
        remaining -= 1;
        setCount(remaining);
      }, 1000);
      timerRef.current = setTimeout(() => {
        clearAll();
        const next: Exclude<BreathPhase, "idle"> =
          p === "inhale" ? "hold" : p === "hold" ? "exhale" : "inhale";
        runCycle(next);
      }, dur);
    },
    [clearAll],
  );

  const toggle = () => {
    if (active) {
      clearAll();
      setActive(false);
      setPhase("idle");
    } else {
      setActive(true);
      runCycle("inhale");
    }
  };

  useEffect(() => () => clearAll(), [clearAll]);

  const circleScale = phase === "inhale" || phase === "hold" ? 1.4 : 1;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Inhale 4s · Hold 7s · Exhale 8s — calms anxiety in minutes.
      </p>
      <div className="flex flex-col items-center gap-8">
        {/* Outer glow ring */}
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, oklch(0.82 0.055 290 / 0.18) 0%, transparent 70%)",
            }}
            animate={{ scale: active ? [1, 1.15, 1] : 1 }}
            transition={
              active
                ? {
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
                : {}
            }
          />
          {/* Inner circle */}
          <motion.div
            data-ocid="selfhelp.breathing.canvas_target"
            className="relative z-10 rounded-full flex flex-col items-center justify-center"
            style={{
              width: 136,
              height: 136,
              background:
                "radial-gradient(circle at 35% 35%, oklch(0.91 0.07 290), oklch(0.82 0.055 290))",
              boxShadow:
                "0 0 0 10px oklch(0.82 0.055 290 / 0.18), 0 0 0 22px oklch(0.82 0.055 290 / 0.08)",
            }}
            animate={{ scale: circleScale }}
            transition={{
              duration: phase === "inhale" ? 4 : phase === "hold" ? 0.1 : 8,
              ease: "easeInOut",
            }}
          >
            <span className="text-xs font-semibold text-foreground/70 text-center leading-tight px-2">
              {PHASE_LABELS[phase]}
            </span>
            {phase !== "idle" && (
              <motion.span
                key={count}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold mt-0.5"
                style={{ color: "oklch(0.25 0.04 290)" }}
              >
                {count}
              </motion.span>
            )}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={toggle}
          data-ocid="selfhelp.breathing.primary_button"
          className={`btn-pill font-semibold text-sm px-10 py-3 ${active ? "btn-secondary" : "btn-primary"}`}
        >
          {active ? "Stop" : "Begin 4-7-8 Breathing"}
        </button>
      </div>
    </div>
  );
}

// ─── Grounding Module ─────────────────────────────────────────────────────────
const GROUNDING_STEPS = [
  {
    count: 5,
    sense: "SEE",
    prompt: "5 things you can SEE",
    icon: "👁️",
    color: "oklch(0.91 0.04 286)",
  },
  {
    count: 4,
    sense: "TOUCH",
    prompt: "4 things you can TOUCH",
    icon: "🤚",
    color: "oklch(0.888 0.071 53)",
  },
  {
    count: 3,
    sense: "HEAR",
    prompt: "3 things you can HEAR",
    icon: "👂",
    color: "oklch(0.84 0.065 144)",
  },
  {
    count: 2,
    sense: "SMELL",
    prompt: "2 things you can SMELL",
    icon: "👃",
    color: "oklch(0.967 0.023 102)",
  },
  {
    count: 1,
    sense: "TASTE",
    prompt: "1 thing you can TASTE",
    icon: "👅",
    color: "oklch(0.91 0.04 286)",
  },
];

const CONFETTI_EMOJIS = ["🌸", "✨", "🌿", "💜", "🎉", "🌟", "💫", "🍃"];

function GroundingModule() {
  const [step, setStep] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState<
    { id: number; emoji: string; x: number; delay: number }[]
  >([]);

  const finish = () => {
    setDone(true);
    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
      x: Math.random() * 280 - 140,
      delay: Math.random() * 0.4,
    }));
    setConfetti(burst);
    setTimeout(() => setConfetti([]), 3000);
  };

  const reset = () => {
    setStep(null);
    setDone(false);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Bring your mind back to the present moment with this 5-sense technique.
      </p>

      {step === null && !done && (
        <button
          type="button"
          onClick={() => setStep(0)}
          data-ocid="selfhelp.grounding.primary_button"
          className="btn-pill btn-primary font-semibold text-sm px-8 py-3"
        >
          Start Grounding
        </button>
      )}

      <AnimatePresence mode="wait">
        {step !== null && !done && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-4"
          >
            <div
              className="rounded-2xl p-5 text-center space-y-2"
              style={{ background: GROUNDING_STEPS[step].color }}
            >
              <div className="text-5xl">{GROUNDING_STEPS[step].icon}</div>
              <div className="text-xl font-bold text-foreground">
                {GROUNDING_STEPS[step].prompt}
              </div>
              <p className="text-sm text-muted-foreground">
                Take your time. Notice each one carefully.
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {GROUNDING_STEPS.map((gs, i) => (
                <div
                  key={gs.sense}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 20 : 8,
                    height: 8,
                    background:
                      i <= step
                        ? "oklch(var(--accent-coral))"
                        : "oklch(var(--border))",
                  }}
                />
              ))}
            </div>

            <div className="flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s !== null ? s - 1 : 0))}
                  data-ocid="selfhelp.grounding.cancel_button"
                  className="btn-pill btn-secondary text-sm flex-1 py-3"
                >
                  ← Back
                </button>
              )}
              {step < GROUNDING_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s !== null ? s + 1 : 0))}
                  data-ocid="selfhelp.grounding.secondary_button"
                  className="btn-pill btn-primary text-sm flex-1 py-3"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finish}
                  data-ocid="selfhelp.grounding.confirm_button"
                  className="btn-pill btn-primary text-sm flex-1 py-3"
                >
                  ✅ I feel grounded!
                </button>
              )}
            </div>
          </motion.div>
        )}

        {done && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative text-center rounded-2xl p-6 overflow-hidden"
            style={{ background: "oklch(0.84 0.065 144 / 0.2)" }}
          >
            {/* Confetti burst */}
            {confetti.map((c) => (
              <motion.span
                key={c.id}
                className="absolute text-2xl pointer-events-none"
                style={{ top: "40%", left: "50%" }}
                initial={{ opacity: 1, y: 0, x: 0 }}
                animate={{ opacity: 0, y: -120, x: c.x }}
                transition={{ duration: 1.5, delay: c.delay, ease: "easeOut" }}
              >
                {c.emoji}
              </motion.span>
            ))}
            <div className="text-4xl mb-3">🌿</div>
            <h4 className="font-bold text-lg mb-1">You're grounded!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              You reconnected with the present moment. That took courage. 💜
            </p>
            <button
              type="button"
              onClick={reset}
              data-ocid="selfhelp.grounding.primary_button"
              className="btn-pill btn-primary text-sm px-6 py-2.5"
            >
              Do it again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Pomodoro / Focus Module ──────────────────────────────────────────────────
const WORK_MINS = 25;
const BREAK_MINS = 5;

function useBinauralAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    if (playing) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
    setPlaying(true);
  };

  const stop = useCallback(() => {
    gainRef.current?.gain.setValueAtTime(0, ctxRef.current?.currentTime ?? 0);
    oscRef.current?.stop();
    ctxRef.current?.close();
    oscRef.current = null;
    gainRef.current = null;
    ctxRef.current = null;
    setPlaying(false);
  }, []);

  const toggle = () => (playing ? stop() : start());

  useEffect(
    () => () => {
      try {
        stop();
      } catch {
        /* ignore cleanup */
      }
    },
    [stop],
  );

  return { playing, toggle };
}

function FocusModule() {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [session, setSession] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINS * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audio = useBinauralAudio();

  const totalSeconds = mode === "work" ? WORK_MINS * 60 : BREAK_MINS * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 52;

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clearTimer();
        setMode((m) => {
          if (m === "work") {
            setSecondsLeft(BREAK_MINS * 60);
            return "break";
          }
          setSession((s) => s + 1);
          setSecondsLeft(WORK_MINS * 60);
          return "work";
        });
        return prev;
      }
      return prev - 1;
    });
  }, [clearTimer]);

  const startTimer = () => {
    setRunning(true);
    setPaused(false);
    intervalRef.current = setInterval(tick, 1000);
  };

  const pauseTimer = () => {
    clearTimer();
    setPaused(true);
  };

  const resumeTimer = () => {
    setPaused(false);
    intervalRef.current = setInterval(tick, 1000);
  };

  const reset = () => {
    clearTimer();
    setRunning(false);
    setPaused(false);
    setMode("work");
    setSession(1);
    setSecondsLeft(WORK_MINS * 60);
    if (audio.playing) audio.toggle();
  };

  useEffect(() => () => clearTimer(), [clearTimer]);

  const modeColor =
    mode === "work" ? "oklch(var(--accent-coral))" : "oklch(0.84 0.065 144)";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        25min work · 5min break · repeat. Science-backed focus cycles.
      </p>

      {/* Session badge */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: `${modeColor}22`, color: modeColor }}
          data-ocid="selfhelp.focus.toggle"
        >
          {mode === "work" ? `🎯 Focus Session #${session}` : "☕ Short Break"}
        </span>
      </div>

      {/* Circular timer */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative" style={{ width: 140, height: 140 }}>
          <svg
            width="140"
            height="140"
            className="absolute inset-0 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="70"
              cy="70"
              r="52"
              fill="none"
              stroke="oklch(var(--border))"
              strokeWidth="8"
            />
            <motion.circle
              cx="70"
              cy="70"
              r="52"
              fill="none"
              stroke={modeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold font-mono tabular-nums"
              style={{ color: modeColor }}
              data-ocid="selfhelp.focus.canvas_target"
            >
              {fmt(secondsLeft)}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {mode === "work" ? "focus" : "break"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!running ? (
            <button
              type="button"
              onClick={startTimer}
              data-ocid="selfhelp.focus.primary_button"
              className="btn-pill btn-primary font-semibold text-sm px-8 py-3"
            >
              Start
            </button>
          ) : paused ? (
            <button
              type="button"
              onClick={resumeTimer}
              data-ocid="selfhelp.focus.primary_button"
              className="btn-pill btn-primary font-semibold text-sm px-8 py-3"
            >
              Resume
            </button>
          ) : (
            <button
              type="button"
              onClick={pauseTimer}
              data-ocid="selfhelp.focus.secondary_button"
              className="btn-pill btn-secondary font-semibold text-sm px-8 py-3"
            >
              Pause
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            data-ocid="selfhelp.focus.cancel_button"
            className="btn-pill btn-secondary text-sm px-6 py-3"
          >
            Reset
          </button>
        </div>

        {/* Focus music toggle */}
        <button
          type="button"
          onClick={audio.toggle}
          data-ocid="selfhelp.focus.toggle"
          className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-smooth"
          style={{
            background: audio.playing
              ? "oklch(0.84 0.065 144 / 0.2)"
              : "oklch(var(--muted))",
            color: audio.playing
              ? "oklch(0.4 0.065 144)"
              : "oklch(var(--muted-foreground))",
          }}
        >
          <span>{audio.playing ? "🎵" : "🔇"}</span>
          <span>
            {audio.playing ? "Focus Music ON (40Hz)" : "Focus Music OFF"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Sleep Module ─────────────────────────────────────────────────────────────
const SLEEP_TIPS = [
  {
    icon: "📵",
    title: "Digital Detox",
    tip: "Put your phone away 30 minutes before bed. Blue light delays melatonin production.",
  },
  {
    icon: "🫁",
    title: "Breathe to Sleep",
    tip: "Try 4-7-8 breathing. Inhale 4s, hold 7s, exhale 8s. Activates your parasympathetic system.",
  },
  {
    icon: "📝",
    title: "Brain Dump",
    tip: "Write tomorrow's worries in a journal before sleeping. Empty your mental buffer.",
  },
  {
    icon: "❄️",
    title: "Cool Room",
    tip: "Keep your room between 65–68°F (18–20°C). A cool room triggers deeper sleep cycles.",
  },
  {
    icon: "☕",
    title: "No Caffeine After 3pm",
    tip: "Caffeine has a 5–6 hour half-life. An afternoon coffee can still disrupt midnight sleep.",
  },
  {
    icon: "🎵",
    title: "Sleep Sounds",
    tip: "Pink noise or brown noise masks disturbances and promotes deeper, more restorative sleep.",
  },
];

function SleepModule() {
  const [current, setCurrent] = useState(0);
  const prev = () =>
    setCurrent((c) => (c - 1 + SLEEP_TIPS.length) % SLEEP_TIPS.length);
  const next = () => setCurrent((c) => (c + 1) % SLEEP_TIPS.length);

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Better sleep = calmer mind. Swipe through science-backed tips.
      </p>

      {/* Carousel */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            data-ocid={`selfhelp.item.${current + 1}`}
            className="rounded-2xl p-6 space-y-3"
            style={{
              background: "oklch(var(--card) / 0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid oklch(var(--border) / 0.3)",
            }}
          >
            <div className="text-5xl">{SLEEP_TIPS[current].icon}</div>
            <div className="font-bold text-base">
              {SLEEP_TIPS[current].title}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {SLEEP_TIPS[current].tip}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          data-ocid="selfhelp.sleep.pagination_prev"
          className="btn-pill btn-secondary text-sm px-5 py-2"
        >
          ← Prev
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {SLEEP_TIPS.map((tip, i) => (
            <button
              key={tip.title}
              type="button"
              onClick={() => setCurrent(i)}
              data-ocid={`selfhelp.sleep.toggle.${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                background:
                  i === current
                    ? "oklch(var(--accent-coral))"
                    : "oklch(var(--border))",
              }}
              aria-label={`Tip ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          data-ocid="selfhelp.sleep.pagination_next"
          className="btn-pill btn-secondary text-sm px-5 py-2"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── Expandable Card ──────────────────────────────────────────────────────────
interface ModuleCardProps {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function ModuleCard({
  id,
  icon,
  title,
  subtitle,
  children,
  defaultOpen = false,
}: ModuleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      id={id}
      layout
      className="rounded-2xl overflow-hidden transition-smooth"
      style={{
        background: open
          ? "oklch(var(--card) / 0.6)"
          : "oklch(var(--card) / 0.4)",
        backdropFilter: "blur(16px)",
        border: open
          ? "1px solid oklch(var(--accent-coral) / 0.25)"
          : "1px solid oklch(var(--border) / 0.3)",
        boxShadow: open
          ? "0 12px 40px oklch(var(--foreground) / 0.10)"
          : "0 4px 16px oklch(var(--foreground) / 0.06)",
      }}
      data-ocid={`selfhelp.${id}.card`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid={`selfhelp.${id}.toggle`}
        className="w-full flex items-center gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-muted-foreground truncate">
            {subtitle}
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-muted-foreground text-lg flex-shrink-0"
        >
          ▾
        </motion.span>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-6 pt-1">
              <div
                className="border-t mb-5"
                style={{ borderColor: "oklch(var(--border) / 0.4)" }}
              />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SelfHelpPage() {
  return (
    <div className="px-4 py-6 space-y-4 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-bold">Self-Help Modules 🌿</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a tool to calm your mind and body. Tap any module to expand.
        </p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
      >
        {[
          {
            id: "breathing",
            icon: "🫁",
            title: "4-7-8 Breathing",
            subtitle: "Inhale · Hold · Exhale — calm anxiety fast",
          },
          {
            id: "grounding",
            icon: "🧠",
            title: "5-4-3-2-1 Grounding",
            subtitle: "Reconnect with the present moment",
          },
          {
            id: "focus",
            icon: "📚",
            title: "Pomodoro Focus Timer",
            subtitle: "25min work · 5min break cycles",
          },
          {
            id: "sleep",
            icon: "💤",
            title: "Sleep Tips",
            subtitle: "Science-backed sleep hygiene",
          },
        ].map((mod, i) => (
          <motion.div
            key={mod.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, delay: i * 0.08 },
              },
            }}
          >
            <ModuleCard
              id={mod.id}
              icon={mod.icon}
              title={mod.title}
              subtitle={mod.subtitle}
              defaultOpen={mod.id === "breathing"}
            >
              {mod.id === "breathing" && <BreathingModule />}
              {mod.id === "grounding" && <GroundingModule />}
              {mod.id === "focus" && <FocusModule />}
              {mod.id === "sleep" && <SleepModule />}
            </ModuleCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Named exports for external references
export { BreathingModule, GroundingModule, FocusModule, SleepModule };
