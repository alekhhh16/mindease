import { AnimatePresence, type Variants, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const HELPLINES = [
  {
    name: "iCALL",
    number: "9152987821",
    hours: "Mon–Sat 8am–10pm",
    desc: "Professional psychological counselling by trained volunteers.",
    icon: "📞",
    color: "from-violet-400/20 to-purple-300/20",
    detail:
      "iCALL is a psychosocial helpline set up by the Tata Institute of Social Sciences (TISS). It provides professional counselling services via phone and email, specially for those in emotional distress.",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    hours: "24/7",
    desc: "Mental health helpline, available around the clock.",
    icon: "🕐",
    color: "from-sky-400/20 to-blue-300/20",
    detail:
      "The Vandrevala Foundation operates a 24/7 mental health helpline for people in crisis or emotional distress. Calls are free, confidential, and staffed by trained counsellors.",
  },
  {
    name: "iCALL WhatsApp",
    number: "+919152987821",
    hours: "Mon–Sat 8am–10pm",
    desc: "Chat-based counselling support via WhatsApp.",
    icon: "💬",
    color: "from-emerald-400/20 to-green-300/20",
    detail:
      "For those more comfortable typing than talking, iCALL also offers WhatsApp-based chat support. Send a message and a trained counsellor will respond.",
  },
  {
    name: "Snehi",
    number: "044-24640050",
    hours: "24/7",
    desc: "Emotional support and suicide prevention helpline.",
    icon: "💙",
    color: "from-rose-400/20 to-pink-300/20",
    detail:
      "Snehi is a volunteer-based service offering emotional support and suicide prevention helpline services across India. All calls are strictly confidential.",
  },
];

const SUPPORT_MESSAGE =
  "Hi, I'm struggling right now and could use some support. I'm reaching out through MindEase.";

type BreathPhase = "inhale" | "hold" | "exhale";

const PHASE_SEQUENCE: {
  phase: BreathPhase;
  duration: number;
  scale: number;
  label: string;
}[] = [
  { phase: "inhale", duration: 4, scale: 1.45, label: "Inhale..." },
  { phase: "hold", duration: 4, scale: 1.45, label: "Hold..." },
  { phase: "exhale", duration: 4, scale: 1, label: "Exhale..." },
];

export function MiniBreather() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const current = PHASE_SEQUENCE[phaseIdx];

  const handleAnimationComplete = () => {
    setPhaseIdx((i) => (i + 1) % PHASE_SEQUENCE.length);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Outer glow */}
      <div className="relative flex items-center justify-center w-32 h-32">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.84 0.065 144 / 0.4) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1.2, 1], opacity: [0.4, 0.8, 0.8, 0.4] }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            times: [0, 0.33, 0.67, 1],
          }}
        />
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-soft"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.84 0.065 144 / 0.85), oklch(0.921 0.04 286 / 0.7))",
            boxShadow: "0 0 32px oklch(0.84 0.065 144 / 0.45)",
          }}
          animate={{ scale: current.scale }}
          transition={{ duration: current.duration, ease: "easeInOut" }}
          onAnimationComplete={handleAnimationComplete}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={phaseIdx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="text-xs font-bold text-foreground text-center leading-tight px-2"
            >
              {current.label}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
      <p className="text-xs text-muted-foreground">
        4 counts in · 4 hold · 4 out
      </p>
    </div>
  );
}

function HelplineCard({ h, i }: { h: (typeof HELPLINES)[number]; i: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      key={h.name}
      data-ocid={`sos.item.${i + 1}`}
      className="glass rounded-2xl overflow-hidden shadow-soft"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.1 }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${h.color})` }}
      />
      <div className="relative p-4 flex items-start gap-3">
        <div className="text-2xl mt-0.5 flex-shrink-0">{h.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="font-bold text-sm text-foreground">{h.name}</p>
            <span className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full flex-shrink-0">
              {h.hours}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
            {h.desc}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${h.number}`}
              data-ocid={`sos.primary_button.${i + 1}`}
              className="btn-pill btn-primary text-xs font-bold px-4 py-2 inline-flex items-center gap-1"
            >
              📲 {h.number}
            </a>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              data-ocid={`sos.toggle.${i + 1}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
            >
              {expanded ? "Less ↑" : "Learn more ↓"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative px-4 pb-4">
              <div className="glass rounded-xl p-3 border-l-2 border-primary/40">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {h.detail}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SosPage() {
  const [copied, setCopied] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const copyMessage = () => {
    navigator.clipboard.writeText(SUPPORT_MESSAGE).then(() => {
      setCopied(true);
      toast.success("Message copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
  };

  return (
    <motion.div
      id="sos"
      className="px-4 py-6 max-w-lg mx-auto space-y-5 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="text-center space-y-2"
        data-ocid="sos.header"
      >
        <motion.div
          className="text-5xl mx-auto w-fit"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          💛
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">
          You are not alone
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I'm here for you. Before we do anything, let's take one breath
          together.
        </p>
      </motion.div>

      {/* Breathing section */}
      <motion.div
        variants={itemVariants}
        className="glass rounded-3xl p-5 shadow-soft"
        data-ocid="sos.breathing.panel"
      >
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-1">
          🌬️ Breathing Exercise
        </p>
        <MiniBreather />
      </motion.div>

      {/* Helplines */}
      <motion.div variants={itemVariants} data-ocid="sos.helplines.panel">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
          📞 Immediate Support
        </p>
        <div className="relative space-y-3">
          {HELPLINES.map((h, i) => (
            <HelplineCard key={h.name} h={h} i={i} />
          ))}
        </div>
      </motion.div>

      {/* Support message */}
      <motion.div
        variants={itemVariants}
        className="glass rounded-3xl p-5 shadow-soft space-y-3"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.921 0.04 286 / 0.4), oklch(0.888 0.071 53 / 0.3))",
          backdropFilter: "blur(12px)",
        }}
        data-ocid="sos.message.panel"
      >
        <div>
          <p className="font-bold text-sm text-foreground">
            Need help starting the conversation?
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use this ready-made message when calling or messaging a helpline.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {showMessage ? (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div
                className="glass rounded-xl p-4 text-sm leading-relaxed text-foreground border-l-2 border-primary/50"
                data-ocid="sos.message.card"
              >
                {SUPPORT_MESSAGE}
              </div>
              <button
                type="button"
                onClick={copyMessage}
                data-ocid="sos.secondary_button"
                className={`btn-pill text-sm font-bold w-full py-3 transition-smooth ${
                  copied ? "bg-sage text-foreground" : "btn-primary"
                }`}
              >
                {copied ? "✅ Copied to clipboard!" : "📋 Copy This Message"}
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              type="button"
              onClick={() => setShowMessage(true)}
              data-ocid="sos.open_modal_button"
              className="btn-pill btn-primary text-sm font-bold w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Generate Support Message
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl p-5 text-center shadow-soft"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.888 0.071 53 / 0.45) 0%, oklch(0.84 0.065 144 / 0.35) 100%)",
          backdropFilter: "blur(12px)",
          border: "1px solid oklch(var(--border) / 0.2)",
        }}
        data-ocid="sos.encouragement.card"
      >
        <motion.div
          className="text-3xl mb-2"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          🌿
        </motion.div>
        <p className="text-sm font-bold text-foreground leading-relaxed">
          Reaching out is an act of courage.
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          You're doing the right thing. We're proud of you for being here. Every
          breath you take matters.
        </p>
      </motion.div>
    </motion.div>
  );
}
