import { u as useActor, a as useQuery, c as createActor, b as useMoodEntries, d as useUserStats, e as useAppStore, r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, R as ResponsiveContainer, f as AreaChart, X as XAxis, Y as YAxis, T as Tooltip, g as Area, L as Link } from "./index-C0qKHfEz.js";
function useDailyQuote() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["daily_quote"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getDailyQuote();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60 * 60
    // Cache for 1 hour — quotes are daily
  });
}
function getUserId() {
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
    ocid: "dashboard.quicklink.item.1"
  },
  {
    to: "/app/selfhelp",
    emoji: "🌬️",
    label: "Breathe",
    desc: "Calm your mind",
    color: "from-sky-400/20 to-indigo-300/20",
    ocid: "dashboard.quicklink.item.2"
  },
  {
    to: "/app/selfhelp",
    emoji: "🌿",
    label: "Ground",
    desc: "Be present",
    color: "from-emerald-400/20 to-teal-300/20",
    ocid: "dashboard.quicklink.item.3"
  },
  {
    to: "/app/sos",
    emoji: "🚨",
    label: "SOS",
    desc: "Immediate help",
    color: "from-red-400/20 to-pink-300/20",
    ocid: "dashboard.quicklink.item.4"
  }
];
const BADGE_ICONS = {
  first_entry: "🌱",
  "3_day_streak": "🔥",
  "7_day_streak": "⚡",
  "30_day_streak": "🏆",
  "10_entries": "📝",
  mood_improver: "📈",
  consistency: "⭐"
};
function getMoodEmoji(score) {
  if (score <= 1) return "😔";
  if (score <= 2) return "😟";
  if (score <= 3) return "😐";
  if (score <= 4) return "🙂";
  return "😊";
}
const BREATH_PHASES = [
  { label: "Inhale...", duration: 4, scale: 1.45 },
  { label: "Hold...", duration: 4, scale: 1.45 },
  { label: "Exhale...", duration: 4, scale: 1 }
];
function StressReliefModal({ onClose }) {
  const [phaseIdx, setPhaseIdx] = reactExports.useState(0);
  const phase = BREATH_PHASES[phaseIdx];
  reactExports.useEffect(() => {
    const t = setTimeout(() => {
      setPhaseIdx((i) => (i + 1) % BREATH_PHASES.length);
    }, phase.duration * 1e3);
    return () => clearTimeout(t);
  }, [phase.duration]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed inset-0 z-50 flex flex-col items-center justify-center",
      style: {
        backdropFilter: "blur(20px)",
        background: "oklch(0.18 0.02 260 / 0.85)"
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      "data-ocid": "stress-relief.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "relative w-full max-w-sm mx-4 glass-elevated rounded-3xl p-8 flex flex-col items-center gap-6 shadow-elevated",
          initial: { scale: 0.9, opacity: 0, y: 20 },
          animate: { scale: 1, opacity: 1, y: 0 },
          exit: { scale: 0.9, opacity: 0, y: 20 },
          transition: { type: "spring", stiffness: 260, damping: 28 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "data-ocid": "stress-relief.close_button",
                className: "absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:bg-muted transition-smooth",
                "aria-label": "Close",
                children: "✕"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest", children: "Stress Relief" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "Let's breathe together 🌬️" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center w-36 h-36", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute inset-0 rounded-full",
                  style: {
                    background: "radial-gradient(circle, oklch(0.82 0.055 290 / 0.3) 0%, transparent 70%)"
                  },
                  animate: { scale: [1, 1.2, 1.2, 1], opacity: [0.5, 0.9, 0.9, 0.5] },
                  transition: {
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    times: [0, 0.33, 0.67, 1]
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "w-24 h-24 rounded-full flex items-center justify-center shadow-elevated",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.82 0.055 290 / 0.8), oklch(0.715 0.099 34 / 0.6))",
                    boxShadow: "0 0 40px oklch(0.82 0.055 290 / 0.5)"
                  },
                  animate: { scale: phase.scale },
                  transition: { duration: phase.duration, ease: "easeInOut" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.p,
                    {
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.8 },
                      transition: { duration: 0.4 },
                      className: "text-xs font-bold text-foreground text-center leading-tight px-2",
                      children: phase.label
                    },
                    phaseIdx
                  ) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center leading-relaxed", children: "You're doing great. Keep breathing slowly. Each breath brings you closer to calm." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full glass rounded-2xl p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: `"You don't have to have it all figured out. Just breathe."` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/app/selfhelp",
                  onClick: onClose,
                  "data-ocid": "stress-relief.secondary_button",
                  className: "flex-1 btn-pill btn-secondary text-center text-sm font-semibold py-2.5",
                  children: "More Exercises"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "data-ocid": "stress-relief.confirm_button",
                  className: "flex-1 btn-pill btn-primary text-sm font-semibold py-2.5",
                  children: "I Feel Better"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function MoodDot(props) {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy - 4, textAnchor: "middle", fontSize: 14, children: getMoodEmoji(payload.score) });
}
function DashboardPage() {
  const userId = getUserId();
  const { data: moodEntries } = useMoodEntries(userId);
  const { data: userStats } = useUserStats(userId);
  const { data: quote, isLoading: quoteLoading } = useDailyQuote();
  const { stressReliefOpen, setStressReliefOpen } = useAppStore();
  const [hour] = reactExports.useState(() => (/* @__PURE__ */ new Date()).getHours());
  const timeGreeting = hour < 12 ? "Good morning ☀️" : hour < 17 ? "Good afternoon 🌤️" : "Good evening 🌙";
  const chartData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 864e5);
      return {
        day: days[d.getDay()],
        score: null,
        date: d.toDateString()
      };
    });
    if (moodEntries) {
      for (const entry of moodEntries) {
        const dateStr = new Date(
          Number(entry.timestamp) / 1e6
        ).toDateString();
        const slot = result.find((r) => r.date === dateStr);
        if (slot) slot.score = Number(entry.moodScore);
      }
    }
    return result.map((r) => ({ ...r, score: r.score ?? 0 }));
  })();
  const latest = moodEntries == null ? void 0 : moodEntries[moodEntries.length - 1];
  const latestEmoji = latest ? getMoodEmoji(Number(latest.moodScore)) : "—";
  const streak = (() => {
    if (!moodEntries || moodEntries.length === 0) return 0;
    const dates = [
      ...new Set(
        moodEntries.map(
          (e) => new Date(Number(e.timestamp) / 1e6).toDateString()
        )
      )
    ].reverse();
    let s = 0;
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] === new Date(Date.now() - i * 864e5).toDateString())
        s++;
      else break;
    }
    return s;
  })();
  const badges = (userStats == null ? void 0 : userStats.badges) ?? [];
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: stressReliefOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(StressReliefModal, { onClose: () => setStressReliefOpen(false) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "min-h-full p-4 pb-8 space-y-4 max-w-lg mx-auto",
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: itemVariants,
              className: "relative overflow-hidden rounded-3xl p-5 shadow-soft",
              style: {
                background: "linear-gradient(135deg, oklch(0.921 0.04 286 / 0.55) 0%, oklch(0.888 0.071 53 / 0.45) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid oklch(var(--border) / 0.25)"
              },
              "data-ocid": "dashboard.hero.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute top-0 right-0 w-32 h-32 rounded-full opacity-20",
                    style: {
                      background: "radial-gradient(circle, oklch(0.715 0.099 34) 0%, transparent 70%)",
                      transform: "translate(30%, -30%)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1", children: timeGreeting }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground leading-snug mb-2", children: "Your safe space is here 💛" }),
                quoteLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-3.5 bg-muted/40 rounded-full animate-pulse w-4/5",
                    "data-ocid": "dashboard.quote.loading_state"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/80 italic leading-relaxed", children: [
                  "“",
                  quote || "You are worthy of rest, joy, and healing.",
                  "”"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setStressReliefOpen(true),
              "data-ocid": "dashboard.stress_relief.primary_button",
              className: "w-full relative overflow-hidden rounded-2xl py-5 px-6 flex items-center justify-center gap-3 shadow-elevated transition-smooth hover:shadow-elevated hover:-translate-y-0.5 active:scale-95",
              style: {
                background: "linear-gradient(135deg, oklch(0.715 0.099 34) 0%, oklch(0.65 0.12 20) 100%)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.span,
                  {
                    className: "absolute inset-0 rounded-2xl",
                    animate: {
                      boxShadow: [
                        "0 0 0 0px oklch(0.715 0.099 34 / 0.5)",
                        "0 0 0 12px oklch(0.715 0.099 34 / 0)"
                      ]
                    },
                    transition: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeOut"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "💆" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-white leading-tight", children: "I Feel Stressed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/75", children: "Tap for instant relief" })
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              variants: itemVariants,
              className: "grid grid-cols-3 gap-3",
              "data-ocid": "dashboard.stats.panel",
              children: [
                {
                  icon: streak > 0 ? "🔥" : "💤",
                  value: streak,
                  label: "Day streak",
                  id: "streak"
                },
                {
                  icon: latestEmoji,
                  value: latest ? Number(latest.moodScore).toFixed(0) : "—",
                  label: "Last mood",
                  id: "mood"
                },
                {
                  icon: "📝",
                  value: (moodEntries == null ? void 0 : moodEntries.length) ?? 0,
                  label: "Total logs",
                  id: "logs"
                }
              ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass rounded-2xl p-3 flex flex-col items-center gap-1 shadow-soft",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: stat.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-foreground", children: stat.value }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium text-center leading-tight", children: stat.label })
                  ]
                },
                stat.id
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: itemVariants,
              className: "glass rounded-3xl p-4 shadow-soft",
              "data-ocid": "dashboard.chart.panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3", children: "📊 Weekly Mood" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 120, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  AreaChart,
                  {
                    data: chartData,
                    margin: { top: 16, right: 4, left: -28, bottom: 0 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "moodGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "stop",
                          {
                            offset: "5%",
                            stopColor: "oklch(0.82 0.055 290)",
                            stopOpacity: 0.5
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "stop",
                          {
                            offset: "95%",
                            stopColor: "oklch(0.82 0.055 290)",
                            stopOpacity: 0
                          }
                        )
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        XAxis,
                        {
                          dataKey: "day",
                          tick: { fontSize: 10, fill: "oklch(0.55 0.01 80)" },
                          axisLine: false,
                          tickLine: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        YAxis,
                        {
                          domain: [0, 5],
                          tick: { fontSize: 10, fill: "oklch(0.55 0.01 80)" },
                          axisLine: false,
                          tickLine: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tooltip,
                        {
                          contentStyle: {
                            background: "oklch(0.24 0.025 260 / 0.9)",
                            border: "1px solid oklch(0.3 0.02 260)",
                            borderRadius: "0.75rem",
                            fontSize: "11px",
                            backdropFilter: "blur(8px)"
                          },
                          formatter: (val) => [
                            `${getMoodEmoji(val)} ${val}`,
                            "Mood"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Area,
                        {
                          type: "monotone",
                          dataKey: "score",
                          stroke: "oklch(0.82 0.055 290)",
                          strokeWidth: 2,
                          fill: "url(#moodGradient)",
                          dot: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            MoodDot,
                            {
                              ...props,
                              payload: props.payload
                            }
                          ),
                          activeDot: { r: 4, fill: "oklch(0.82 0.055 290)" }
                        }
                      )
                    ]
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: itemVariants, "data-ocid": "dashboard.badges.panel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1", children: "🏅 Your Badges" }),
            badges.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "glass rounded-2xl p-5 text-center shadow-soft",
                "data-ocid": "dashboard.badges.empty_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Start tracking your mood to earn badges ✨" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 no-scrollbar", children: badges.map((badge, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `dashboard.badge.item.${i + 1}`,
                className: "glass rounded-full px-4 py-2 flex items-center gap-1.5 shadow-soft whitespace-nowrap flex-shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: BADGE_ICONS[badge] ?? "🌟" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground capitalize", children: badge.replace(/_/g, " ") })
                ]
              },
              badge
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              variants: itemVariants,
              "data-ocid": "dashboard.quicklinks.panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1", children: "⚡ Quick Access" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: QUICK_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: link.to,
                    "data-ocid": link.ocid,
                    className: "relative overflow-hidden rounded-2xl p-4 flex items-center gap-3 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 active:scale-95 transition-smooth",
                    style: {
                      background: "linear-gradient(135deg, oklch(var(--card) / 0.5), oklch(var(--card) / 0.3))",
                      backdropFilter: "blur(12px)",
                      border: "1px solid oklch(var(--border) / 0.25)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute inset-0 opacity-50 rounded-2xl",
                          style: {
                            background: `linear-gradient(135deg, ${link.color.replace("from-", "").replace(" to-", ", ")})`
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative text-2xl", children: link.emoji }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground truncate", children: link.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: link.desc })
                      ] })
                    ]
                  },
                  link.ocid
                )) })
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  DashboardPage as default
};
