"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Brain,
  ChevronDown,
  Clock,
  Heart,
  Menu,
  MessageCircle,
  Mic,
  Moon,
  Phone,
  Shield,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// ── Navbar ──────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Breathing", href: "#breathing" },
  { label: "Self-Help", href: "#selfhelp" },
  { label: "Grounding", href: "/app/self-help#grounding", external: false },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
] as const;

function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-ocid="nav.toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center glass hover:bg-accent/40 transition-smooth text-foreground"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLink = () => setOpen(false);

  return (
    <nav
      data-ocid="nav.panel"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-elevated shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-foreground font-display">
          🌿 MindEase
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="hover:text-foreground transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <DarkModeToggle />
          <Link
            href="/app"
            data-ocid="nav.primary_button"
            className="btn-pill btn-primary text-sm font-medium"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <DarkModeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
            onClick={() => setOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-full glass text-foreground"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden glass-elevated border-t border-border/20"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={handleLink}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/app"
                onClick={handleLink}
                data-ocid="nav.mobile_primary_button"
                className="btn-pill btn-primary text-sm font-medium text-center mt-2"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-hero pt-24 pb-20 px-6 overflow-hidden"
    >
      {/* Decorative orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, oklch(0.921 0.04 286 / 0.5), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, oklch(0.84 0.065 144 / 0.5), transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
            className="inline-block glass text-coral text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          >
            💛 Safe · Anonymous · Always Here
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold font-display text-foreground leading-tight mb-6"
          >
            Your Safe Space for
            <span className="text-coral block">Mental Wellness</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md"
          >
            An anonymous AI companion that listens, understands, and gently
            helps you heal. No judgement. No appointments. Just support,
            whenever you need it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/app/chat"
              data-ocid="hero.primary_button"
              className="btn-pill btn-primary text-sm font-semibold"
            >
              Start Chatting Free
            </Link>
            <a
              href="#features"
              data-ocid="hero.secondary_button"
              className="btn-pill btn-secondary text-sm font-semibold"
            >
              Explore Features
            </a>
          </motion.div>
        </div>

        {/* Floating illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex justify-center items-center"
        >
          <div className="relative w-72 h-72">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-white/30"
            />
            <div className="absolute inset-6 rounded-full bg-white/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-2">🧘</div>
                <div className="flex justify-center gap-1">
                  {["🌿", "🌸", "🍃"].map((emoji, i) => (
                    <motion.span
                      key={emoji}
                      className="text-2xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3 + i * 0.5,
                        delay: i * 0.4,
                        ease: "easeInOut",
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex justify-center mt-12"
      >
        <a
          href="#problem"
          className="animate-bounce text-muted-foreground"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-6 h-6" />
        </a>
      </motion.div>
    </section>
  );
}

// ── Problem ───────────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: "📊",
    stat: "1 in 4",
    label: "Students experience mental health issues",
  },
  { icon: "🤐", stat: "76%", label: "Don't seek help due to stigma" },
  { icon: "📚", stat: "Peak stress", label: "During exam season every year" },
];

function Problem() {
  return (
    <section id="problem" className="bg-lavender py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold font-display mb-4"
        >
          {"You're not alone."}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-muted-foreground mb-12 max-w-xl mx-auto"
        >
          {"Millions of students silently struggle. The system wasn't built for you. MindEase was."}
        </motion.p>
        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.stat}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-elevated rounded-2xl p-8 shadow-soft text-center"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="text-3xl font-bold text-coral mb-2">{s.stat}</div>
              <p className="text-muted-foreground text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Solution ─────────────────────────────────────────────────────────────────
const SOLUTION_CARDS = [
  {
    bg: "bg-peach",
    icon: <Shield className="w-7 h-7" />,
    title: "Completely Anonymous",
    desc: "No email, no phone number. Just you and a safe space. Your identity is always protected.",
  },
  {
    bg: "bg-lavender",
    icon: <Brain className="w-7 h-7" />,
    title: "CBT-Based Support",
    desc: "Evidence-backed cognitive behavioral therapy techniques woven into every conversation.",
  },
  {
    bg: "bg-sage",
    icon: <Clock className="w-7 h-7" />,
    title: "Always Available",
    desc: "24/7 support. No appointments needed. Open at 3am during finals week — we're here.",
  },
];

function Solution() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold font-display mb-4"
        >
          MindEase is different.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-12 max-w-xl mx-auto"
        >
          Built specifically for students. Designed with care. Powered by
          science.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-6">
          {SOLUTION_CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`${c.bg} rounded-2xl p-8 text-left shadow-soft`}
            >
              <div className="mb-4 text-foreground">{c.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "AI Chat Support",
    desc: "Emotionally intelligent conversations, day or night.",
    badge: "",
    to: "/app/chat" as const,
    anchor: null,
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Mood Tracking",
    desc: "Track daily moods, visualize trends over time.",
    badge: "",
    to: "/app/mood" as const,
    anchor: null,
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "SOS Emergency",
    desc: "One tap to access crisis helplines and support.",
    badge: "",
    to: "/app/sos" as const,
    anchor: null,
  },
  {
    icon: <span className="text-xl">🫁</span>,
    title: "Breathing Exercises",
    desc: "Guided animations to calm your nervous system.",
    badge: "",
    to: "/app/self-help" as const,
    anchor: null,
  },
  {
    icon: <span className="text-xl">🧠</span>,
    title: "Grounding Techniques",
    desc: "5-4-3-2-1 sensory grounding for anxiety relief.",
    badge: "",
    to: "/app/self-help" as const,
    anchor: null,
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Voice Analysis",
    desc: "Tone-based stress detection via voice notes.",
    badge: "Coming Soon",
    to: null,
    anchor: "#features",
  },
] as const;

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (feature.to) {
      router.push(feature.to);
    } else if (feature.anchor) {
      const el = document.querySelector(feature.anchor);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.button
      type="button"
      data-ocid={`features.item.${index + 1}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="glass-elevated rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer group relative overflow-hidden text-left w-full"
      aria-label={`Explore ${feature.title}`}
    >
      {/* Subtle hover gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      <div className="w-12 h-12 bg-peach rounded-xl flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform duration-200">
        {feature.icon}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold text-sm">{feature.title}</h3>
        {feature.badge && (
          <span className="text-xs bg-lavender px-2 py-0.5 rounded-full font-medium">
            {feature.badge}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mb-4">
        {feature.desc}
      </p>

      {/* "Explore →" indicator — appears on hover */}
      <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
        <span>Explore</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </motion.button>
  );
}

function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-beige">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-display mb-4"
          >
            Everything you need to feel better
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            A full toolkit for mental wellness, all in one calming space. Click
            any card to explore.
          </motion.p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    n: "1",
    title: "Open anonymously",
    desc: "No sign-up required. Just open and start. Your privacy is guaranteed.",
  },
  {
    n: "2",
    title: "Share how you feel",
    desc: "Type or speak. MindEase listens without judgement, 24/7.",
  },
  {
    n: "3",
    title: "Get personalized support",
    desc: "Receive CBT-backed responses tailored to your emotional state.",
  },
  {
    n: "4",
    title: "Track your progress",
    desc: "Log moods daily, earn badges, and watch yourself grow stronger.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-display mb-4"
          >
            How it works
          </motion.h2>
          <p className="text-muted-foreground">
            Simple, private, and supportive in four steps.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {HOW_STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-peach text-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                {s.n}
              </div>
              <h3 className="font-semibold mb-2 text-sm">{s.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Demo Chat ─────────────────────────────────────────────────────────────────
const DEMO_PRESETS: Record<string, string> = {
  "I'm feeling anxious":
    "I hear you 💛 Anxiety can feel overwhelming. Let's try a quick grounding exercise. Name 5 things you can see right now. Take your time — I'm right here with you.",
  "I can't sleep":
    "I'm sorry you're struggling with sleep. Racing thoughts at night are so common. Try this: breathe in for 4 counts, hold for 4, exhale for 4. Repeat 3 times. Your body knows how to rest — let's help it remember.",
  "Everything feels overwhelming":
    "When everything piles up, it can feel impossible to know where to start. That's completely valid 💛 Let's slow down together. What's one small thing — even tiny — that you could let go of right now?",
};

interface DemoMessage {
  id: number;
  role: "user" | "ai";
  text: string;
}

function DemoChat() {
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      id: 0,
      role: "ai",
      text: "Hi there 💛 I'm here with you. How are you feeling today?",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const sendPreset = (msg: string) => {
    if (typing) return;
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "user", text: msg },
    ]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "ai",
          text: DEMO_PRESETS[msg] || "I hear you. You're not alone in this.",
        },
      ]);
      setTyping(false);
    }, 1500);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <section className="py-20 px-6 bg-lavender">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-display mb-4"
          >
            See it in action
          </motion.h2>
          <p className="text-muted-foreground">
            Click a message to try a live demo conversation.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-elevated rounded-2xl shadow-soft-lg overflow-hidden"
        >
          {/* Chat header */}
          <div className="bg-peach px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
              🌿
            </div>
            <div>
              <div className="font-semibold text-sm">MindEase</div>
              <div className="text-xs text-muted-foreground">
                Always here for you
              </div>
            </div>
          </div>
          {/* Messages */}
          <div className="h-64 overflow-y-auto p-6 flex flex-col gap-3">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-peach text-foreground rounded-br-sm"
                      : "bg-muted text-foreground shadow-xs rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm shadow-xs">
                  <div className="flex gap-1">
                    <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                    <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                    <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Preset chips */}
          <div className="px-6 pb-6 flex flex-wrap gap-2">
            {Object.keys(DEMO_PRESETS).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendPreset(p)}
                data-ocid="demo.primary_button"
                disabled={typing}
                className="btn-pill glass text-foreground text-xs font-medium hover:bg-accent/60 transition-smooth disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Breathing Section ─────────────────────────────────────────────────────────
type BreathPhase = "idle" | "inhale" | "hold" | "exhale";

function BreathingSection() {
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCycle = () => {
    setPhase("inhale");
    timerRef.current = setTimeout(() => {
      setPhase("hold");
      timerRef.current = setTimeout(() => {
        setPhase("exhale");
        timerRef.current = setTimeout(runCycle, 4000);
      }, 4000);
    }, 4000);
  };

  const toggle = () => {
    if (active) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setActive(false);
      setPhase("idle");
    } else {
      setActive(true);
      runCycle();
    }
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const phaseLabel: Record<BreathPhase, string> = {
    idle: "Press Start",
    inhale: "Inhale...",
    hold: "Hold...",
    exhale: "Exhale...",
  };

  const circleScale = phase === "inhale" || phase === "hold" ? 1.28 : 1;

  return (
    <section
      id="breathing"
      className="py-20 px-6 bg-sage relative overflow-hidden"
    >
      {/* Decorative orb */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(1 0 0 / 0.6), transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold font-display mb-4">
            Take a breath with us
          </h2>
          <p className="text-muted-foreground mb-12">
            A simple 4-4-4 box breathing exercise to calm your mind in minutes.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          {/* Animated circle */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulse rings */}
            <motion.div
              animate={
                active
                  ? { scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }
                  : { scale: 1, opacity: 0 }
              }
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut",
              }}
              className="absolute w-56 h-56 rounded-full"
              style={{ background: "oklch(0.84 0.065 144 / 0.35)" }}
            />
            <motion.div
              animate={
                active
                  ? { scale: [1, 1.3, 1], opacity: [0.25, 0.05, 0.25] }
                  : { scale: 1, opacity: 0 }
              }
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute w-56 h-56 rounded-full"
              style={{ background: "oklch(0.84 0.065 144 / 0.2)" }}
            />
            <motion.div
              animate={{ scale: circleScale }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="relative w-40 h-40 rounded-full bg-white/80 flex items-center justify-center shadow-elevated"
              style={{
                boxShadow:
                  "0 0 0 16px oklch(0.84 0.065 144 / 0.25), 0 0 0 32px oklch(0.84 0.065 144 / 0.12)",
              }}
            >
              <span className="text-base font-semibold text-foreground">
                {phaseLabel[phase]}
              </span>
            </motion.div>
          </div>

          {phase !== "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              <span className="capitalize font-medium text-foreground">
                {phase}
              </span>
              {" — 4 counts"}
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              type="button"
              onClick={toggle}
              data-ocid="breathing.primary_button"
              className={`btn-pill font-semibold text-sm px-8 py-3 ${active ? "btn-secondary" : "btn-primary"}`}
            >
              {active ? "Stop" : "Start Breathing"}
            </button>
            <Link
              href="/app/self-help"
              data-ocid="breathing.secondary_button"
              className="btn-pill btn-secondary text-sm font-semibold"
            >
              More Exercises →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Self-Help anchor ──────────────────────────────────────────────────────────
const APP_SCREENS = [
  {
    emoji: "💬",
    title: "AI Chat",
    desc: "Warm, CBT-backed conversations",
    bg: "bg-peach",
  },
  {
    emoji: "📊",
    title: "Mood Tracker",
    desc: "Daily log + weekly insights",
    bg: "bg-lavender",
  },
  {
    emoji: "🌿",
    title: "Self-Help",
    desc: "Breathing + grounding tools",
    bg: "bg-sage",
  },
];

function AppPreview() {
  return (
    <section id="selfhelp" className="py-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-display mb-4"
          >
            Built for your pocket
          </motion.h2>
          <p className="text-muted-foreground">
            Every feature designed with calm and clarity in mind.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 justify-center">
          {APP_SCREENS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div
                className={`w-48 h-80 ${s.bg} rounded-3xl shadow-soft-lg flex flex-col items-center justify-center gap-4 p-6`}
              >
                <div className="text-5xl">{s.emoji}</div>
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 bg-white/60 rounded-full" />
                  <div className="h-2 bg-white/40 rounded-full w-3/4" />
                  <div className="h-2 bg-white/30 rounded-full w-1/2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Priya, 22",
    role: "Engineering student",
    avatar: "🌸",
    text: "MindEase helped me through my worst exam week. Just having something listen without judging made everything lighter. I started sleeping again.",
  },
  {
    name: "Arjun, 20",
    role: "First-year college student",
    avatar: "🌿",
    text: "I was too embarrassed to talk to anyone. MindEase was there at 2am when panic hit. The breathing exercises actually work. I keep coming back.",
  },
  {
    name: "Sam, 24",
    role: "Postgrad student",
    avatar: "🍃",
    text: "The mood tracker helped me see my patterns. I realized stress spikes every Sunday evening. Now I plan around it. It genuinely changed my routine.",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-6 bg-peach">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-display mb-4"
          >
            Students who found their calm
          </motion.h2>
          <p className="text-muted-foreground">Real stories. Real relief.</p>
        </div>
        {/* Horizontal scroll on mobile, 3-col on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory">
          {TESTIMONIALS.map((q, i) => (
            <motion.div
              key={q.name}
              data-ocid={`testimonials.item.${i + 1}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-elevated rounded-2xl p-6 shadow-soft border border-accent/30 flex-none w-72 md:w-auto snap-center"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-xl">
                  {q.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {["h1", "h2", "h3", "h4", "h5"].map((hk) => (
                  <Heart
                    key={hk}
                    className="w-3 h-3 text-coral"
                    style={{ fill: "oklch(var(--accent-coral))" }}
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground italic">
                {`"${q.text}"`}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is it really anonymous?",
    a: "Yes, completely. We don't ask for your name, email, or phone number. You're identified only by a randomly generated device ID that stays on your device.",
  },
  {
    q: "Is this a replacement for therapy?",
    a: "No. MindEase is a supportive companion, not a clinical service. We encourage you to seek professional help when needed and will always point you towards real therapists when the situation calls for it.",
  },
  {
    q: "What happens during an SOS?",
    a: "MindEase will never take sudden action. We first take a breath together, then show you verified helpline numbers, a pre-written support message you can send, and nearby resources — all at your own pace.",
  },
  {
    q: "How does mood tracking work?",
    a: "Each day you pick an emoji that reflects your mood. Over time, MindEase builds a chart so you can see your emotional patterns. Streaks and badges celebrate your consistency.",
  },
  {
    q: "Is my data safe?",
    a: "We don't store chat conversations permanently. Mood data is encrypted and linked only to your anonymous device ID. We never sell or share your data.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="py-20 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-display mb-4"
          >
            {"Questions? We've got answers."}
          </motion.h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              data-ocid={`faq.item.${i + 1}`}
              className="glass-elevated rounded-2xl shadow-soft border-0 px-6"
            >
              <AccordionTrigger className="text-sm font-semibold py-5 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 px-6 bg-lavender text-center relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[700px] h-[400px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.715 0.099 34 / 0.3), transparent 70%)",
          }}
        />
      </div>
      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-4xl mb-6">🌿</div>
          <h2 className="text-3xl font-bold font-display mb-4">
            Ready to start your wellness journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            {"Take the first step. It's free, anonymous, and waiting for you right now."}
          </p>
          <Link
            href="/app"
            data-ocid="cta.primary_button"
            className="btn-pill btn-primary text-base font-semibold px-10 py-4 inline-block"
          >
            Begin Your Journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer className="glass-elevated border-t border-border/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="text-lg font-bold font-display mb-3">
              🌿 MindEase
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A peaceful companion that listens, understands, and gently helps
              you heal.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">App</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <Link
                  href="/app/chat"
                  className="hover:text-foreground transition-colors"
                >
                  AI Chat
                </Link>
              </div>
              <div>
                <Link
                  href="/app/mood"
                  className="hover:text-foreground transition-colors"
                >
                  Mood Tracker
                </Link>
              </div>
              <div>
                <Link
                  href="/app/self-help"
                  className="hover:text-foreground transition-colors"
                >
                  Self-Help
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">Safety</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <Link
                  href="/app/sos"
                  className="hover:text-foreground transition-colors"
                >
                  SOS Support
                </Link>
              </div>
              <div className="hover:text-foreground transition-colors cursor-default">
                Privacy Policy
              </div>
              <div className="hover:text-foreground transition-colors cursor-default">
                Anonymous Usage
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3">Emergency</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>iCALL: 9152987821</div>
              <div>Vandrevala: 1860-2662-345</div>
              <div>SNEHI: 044-24640050</div>
            </div>
          </div>
        </div>
        <div className="border-t border-border/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {year} MindEase. Made with 💛 for student wellbeing.</span>
          <span className="hover:text-foreground transition-colors">
            Built with love
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <DemoChat />
      <BreathingSection />
      <AppPreview />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
