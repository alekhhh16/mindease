"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Brain,
  Heart,
  Sparkles,
  Wind,
  Play,
  Pause,
  ChevronRight,
  Clock,
  Headphones,
  Leaf,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  X,
  Check,
  Eye,
  Hand,
  Ear,
  Flower2,
  Cookie,
  ArrowRight,
} from "lucide-react";

// Guided meditations data
const guidedMeditations = [
  {
    id: 1,
    title: "Morning Calm",
    duration: "5 min",
    category: "Mindfulness",
    icon: Sun,
    color: "from-amber-400 to-orange-500",
    description: "Start your day with peace and clarity",
    audioScript: [
      "Welcome to this morning meditation...",
      "Take a deep breath in... and slowly release...",
      "Feel the energy of a new day...",
      "You are ready to embrace whatever comes...",
    ],
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: "10 min",
    category: "Relaxation",
    icon: Wind,
    color: "from-blue-400 to-cyan-500",
    description: "Release tension and find inner calm",
    audioScript: [
      "Let's release the stress you're carrying...",
      "Breathe deeply into your belly...",
      "With each exhale, let go of tension...",
      "You are safe. You are calm. You are at peace...",
    ],
  },
  {
    id: 3,
    title: "Sleep Well",
    duration: "15 min",
    category: "Sleep",
    icon: Moon,
    color: "from-indigo-400 to-purple-500",
    description: "Drift into peaceful, restful sleep",
    audioScript: [
      "Allow your body to sink into comfort...",
      "Release the day's thoughts...",
      "Each breath takes you deeper into relaxation...",
      "Sleep is coming naturally to you...",
    ],
  },
  {
    id: 4,
    title: "Self Compassion",
    duration: "8 min",
    category: "Emotional",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    description: "Cultivate kindness towards yourself",
    audioScript: [
      "Place your hand on your heart...",
      "Feel the warmth of your own compassion...",
      "You deserve love and kindness...",
      "Speak gently to yourself, as you would to a friend...",
    ],
  },
  {
    id: 5,
    title: "Focus Boost",
    duration: "7 min",
    category: "Productivity",
    icon: Brain,
    color: "from-emerald-400 to-teal-500",
    description: "Sharpen your mind and concentration",
    audioScript: [
      "Clear your mind of distractions...",
      "Focus on the present moment...",
      "Your mind is sharp and clear...",
      "You are fully present and focused...",
    ],
  },
  {
    id: 6,
    title: "Gratitude",
    duration: "6 min",
    category: "Positivity",
    icon: Sparkles,
    color: "from-yellow-400 to-amber-500",
    description: "Appreciate the good in your life",
    audioScript: [
      "Think of three things you're grateful for...",
      "Feel the warmth of appreciation...",
      "Gratitude transforms your perspective...",
      "There is so much good in your life...",
    ],
  },
];

// Breathing exercises data
const breathingExercises = [
  {
    id: 1,
    name: "4-7-8 Relaxation",
    description: "Calming breath for anxiety and sleep",
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    color: "from-blue-500 to-indigo-600",
    benefits: ["Reduces anxiety", "Improves sleep", "Calms nervous system"],
  },
  {
    id: 2,
    name: "Box Breathing",
    description: "Balance and focus technique",
    pattern: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
    color: "from-emerald-500 to-teal-600",
    benefits: ["Increases focus", "Reduces stress", "Balances energy"],
  },
  {
    id: 3,
    name: "Energizing Breath",
    description: "Quick pick-me-up for low energy",
    pattern: { inhale: 2, exhale: 2 },
    color: "from-orange-500 to-amber-600",
    benefits: ["Boosts energy", "Increases alertness", "Wakes you up"],
  },
  {
    id: 4,
    name: "Deep Calm",
    description: "Extended exhale for deep relaxation",
    pattern: { inhale: 4, exhale: 8 },
    color: "from-purple-500 to-pink-600",
    benefits: [
      "Deep relaxation",
      "Activates parasympathetic",
      "Reduces heart rate",
    ],
  },
];

// Self-care activities
const selfCareActivities = [
  {
    category: "Physical",
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    activities: [
      "Take a 10-minute walk outside",
      "Do gentle stretching",
      "Take a warm bath or shower",
      "Get 15 minutes of sunlight",
      "Dance to your favorite song",
    ],
  },
  {
    category: "Emotional",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    activities: [
      "Journal your feelings",
      "Call a friend or loved one",
      "Watch something that makes you laugh",
      "Give yourself a compliment",
      "Have a good cry if needed",
    ],
  },
  {
    category: "Mental",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    activities: [
      "Read for 20 minutes",
      "Do a puzzle or brain game",
      "Learn something new",
      "Organize one small space",
      "Take a social media break",
    ],
  },
  {
    category: "Spiritual",
    icon: Sparkles,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    activities: [
      "Practice gratitude",
      "Meditate for 5 minutes",
      "Spend time in nature",
      "Write down your intentions",
      "Practice mindful eating",
    ],
  },
];

// Meditation Player Component
function MeditationPlayer({
  meditation,
  onClose,
}: {
  meditation: (typeof guidedMeditations)[0];
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= meditation.audioScript.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 8000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, meditation.audioScript.length]);

  const IconComponent = meditation.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-3xl p-8 max-w-md w-full shadow-elevated border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meditation.color} flex items-center justify-center`}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-2">
          {meditation.title}
        </h3>
        <p className="text-muted-foreground mb-8">{meditation.description}</p>

        {/* Current instruction */}
        <div className="bg-muted/50 dark:bg-muted/30 rounded-2xl p-6 mb-8 min-h-[100px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-foreground text-center text-lg italic"
            >
              {meditation.audioScript[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {meditation.audioScript.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentStep
                  ? "bg-primary w-6"
                  : idx < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full hover:bg-muted transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </button>

          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="p-3 rounded-full hover:bg-muted transition-colors"
          >
            <SkipBack className="w-5 h-5 text-foreground" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${meditation.color} flex items-center justify-center shadow-lg`}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-white" />
            ) : (
              <Play className="w-7 h-7 text-white ml-1" />
            )}
          </button>

          <button
            onClick={() =>
              setCurrentStep(
                Math.min(meditation.audioScript.length - 1, currentStep + 1)
              )
            }
            className="p-3 rounded-full hover:bg-muted transition-colors"
          >
            <SkipForward className="w-5 h-5 text-foreground" />
          </button>

          <div className="w-11" /> {/* Spacer for alignment */}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Breathing Exercise Component
function BreathingExercise({
  exercise,
  onClose,
}: {
  exercise: (typeof breathingExercises)[0];
  onClose: () => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<
    "inhale" | "hold" | "exhale" | "holdEmpty"
  >("inhale");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalCycles = 4;

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCount((prev) => {
          const currentMax =
            exercise.pattern[phase as keyof typeof exercise.pattern] || 0;

          if (prev >= currentMax - 1) {
            // Move to next phase
            if (phase === "inhale") {
              if (exercise.pattern.hold) {
                setPhase("hold");
              } else {
                setPhase("exhale");
              }
            } else if (phase === "hold") {
              setPhase("exhale");
            } else if (phase === "exhale") {
              if (exercise.pattern.holdEmpty) {
                setPhase("holdEmpty");
              } else {
                setPhase("inhale");
                setCycles((c) => {
                  if (c >= totalCycles - 1) {
                    setIsActive(false);
                    return 0;
                  }
                  return c + 1;
                });
              }
            } else if (phase === "holdEmpty") {
              setPhase("inhale");
              setCycles((c) => {
                if (c >= totalCycles - 1) {
                  setIsActive(false);
                  return 0;
                }
                return c + 1;
              });
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase, exercise.pattern]);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "holdEmpty":
        return "Hold Empty";
      default:
        return "";
    }
  };

  const getCircleScale = () => {
    if (phase === "inhale") return 1 + count * 0.1;
    if (phase === "exhale")
      return 1.4 - count * (0.4 / (exercise.pattern.exhale || 4));
    return phase === "hold" ? 1.4 : 1;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-3xl p-8 max-w-md w-full text-center shadow-elevated border border-border relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h3 className="text-2xl font-bold text-foreground mb-2">{exercise.name}</h3>
        <p className="text-muted-foreground mb-8">{exercise.description}</p>

        {/* Breathing circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <motion.div
            animate={{ scale: isActive ? getCircleScale() : 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${exercise.color} opacity-30`}
          />
          <motion.div
            animate={{ scale: isActive ? getCircleScale() * 0.8 : 0.8 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className={`absolute inset-4 rounded-full bg-gradient-to-br ${exercise.color} opacity-50`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">
              {isActive
                ? (exercise.pattern[phase as keyof typeof exercise.pattern] ||
                    0) - count
                : "Ready"}
            </span>
            {isActive && (
              <span className="text-muted-foreground mt-2">{getPhaseText()}</span>
            )}
          </div>
        </div>

        {/* Cycle progress */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalCycles }).map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < cycles
                  ? "bg-primary"
                  : idx === cycles && isActive
                    ? "bg-primary/50"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Start/Stop button */}
        <button
          onClick={() => {
            if (!isActive) {
              setPhase("inhale");
              setCount(0);
              setCycles(0);
            }
            setIsActive(!isActive);
          }}
          className={`px-8 py-4 rounded-full bg-gradient-to-r ${exercise.color} text-white font-semibold shadow-lg`}
        >
          {isActive ? "Stop" : "Start Breathing"}
        </button>

        {/* Benefits */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {exercise.benefits.map((benefit, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
            >
              {benefit}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// 5-4-3-2-1 Grounding Exercise Component
function GroundingExercise({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<string[][]>([[], [], [], [], []]);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { count: 5, sense: "SEE", icon: Eye, color: "from-blue-500 to-cyan-500", prompt: "Look around. What 5 things can you SEE?" },
    { count: 4, sense: "TOUCH", icon: Hand, color: "from-green-500 to-emerald-500", prompt: "Focus on your body. What 4 things can you FEEL?" },
    { count: 3, sense: "HEAR", icon: Ear, color: "from-purple-500 to-pink-500", prompt: "Listen carefully. What 3 things can you HEAR?" },
    { count: 2, sense: "SMELL", icon: Flower2, color: "from-orange-500 to-amber-500", prompt: "Take a breath. What 2 things can you SMELL?" },
    { count: 1, sense: "TASTE", icon: Cookie, color: "from-red-500 to-rose-500", prompt: "Notice your mouth. What 1 thing can you TASTE?" },
  ];

  const currentStepData = steps[currentStep];
  const currentInputs = inputs[currentStep] || [];

  const handleAddInput = (value: string) => {
    if (value.trim() && currentInputs.length < currentStepData.count) {
      const newInputs = [...inputs];
      newInputs[currentStep] = [...currentInputs, value.trim()];
      setInputs(newInputs);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const canProceed = currentInputs.length === currentStepData.count;
  const IconComponent = currentStepData.icon;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl p-8 max-w-md w-full text-center shadow-elevated border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">Well Done!</h3>
          <p className="text-muted-foreground mb-6">
            You have completed the 5-4-3-2-1 grounding exercise. Take a moment to notice how you feel now compared to before.
          </p>
          <p className="text-sm text-muted-foreground/70 mb-8">
            This technique helps bring you back to the present moment by engaging all your senses.
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold"
          >
            Finish
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-3xl p-6 max-w-md w-full shadow-elevated border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full transition-all ${
                idx < currentStep ? "bg-green-500" : idx === currentStep ? `bg-gradient-to-r ${step.color}` : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <span className={`text-6xl font-bold bg-gradient-to-r ${currentStepData.color} bg-clip-text text-transparent`}>
            {currentStepData.count}
          </span>
          <p className="text-foreground text-lg mt-2">things you can <span className="font-bold">{currentStepData.sense}</span></p>
        </div>

        <p className="text-muted-foreground text-center mb-6">{currentStepData.prompt}</p>

        {/* Input area */}
        <div className="space-y-3 mb-6">
          {Array.from({ length: currentStepData.count }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentInputs[idx] ? `bg-gradient-to-r ${currentStepData.color} text-white` : "bg-muted text-muted-foreground"
              }`}>
                {idx + 1}
              </div>
              {currentInputs[idx] ? (
                <span className="text-foreground flex-1">{currentInputs[idx]}</span>
              ) : idx === currentInputs.length ? (
                <input
                  type="text"
                  placeholder={`Enter something you can ${currentStepData.sense.toLowerCase()}...`}
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddInput((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span className="text-muted-foreground/50 flex-1">Waiting...</span>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 rounded-full flex items-center justify-center gap-2 font-semibold transition-all ${
            canProceed
              ? `bg-gradient-to-r ${currentStepData.color} text-white`
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {currentStep < 4 ? "Next Step" : "Complete"} <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function SelfHelpPage() {
  const [selectedMeditation, setSelectedMeditation] = useState<
    (typeof guidedMeditations)[0] | null
  >(null);
  const [selectedExercise, setSelectedExercise] = useState<
    (typeof breathingExercises)[0] | null
  >(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "meditations" | "breathing" | "grounding" | "selfcare"
  >("meditations");
  const [showGroundingExercise, setShowGroundingExercise] = useState(false);

  const toggleActivity = (activity: string) => {
    setCompletedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Self Help</h1>
          </div>
          <p className="text-muted-foreground">
            Tools and resources for your wellbeing
          </p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 bg-muted/50 dark:bg-muted/30 p-1.5 rounded-xl border border-border/50">
          {[
            { id: "meditations", label: "Meditations", icon: Headphones },
            { id: "breathing", label: "Breathing", icon: Wind },
            { id: "grounding", label: "Grounding", icon: Eye },
            { id: "selfcare", label: "Self Care", icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "meditations" | "breathing" | "grounding" | "selfcare"
                )
              }
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-card shadow-soft text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === "meditations" && (
            <motion.div
              key="meditations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Guided Meditations
              </h2>
              {guidedMeditations.map((meditation, idx) => {
                const IconComponent = meditation.icon;
                return (
                  <motion.button
                    key={meditation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedMeditation(meditation)}
                    className="w-full bg-card hover:bg-muted/50 rounded-2xl p-4 flex items-center gap-4 transition-all text-left shadow-soft border border-border"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meditation.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-foreground font-semibold">
                        {meditation.title}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate">
                        {meditation.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">
                          {meditation.duration}
                        </span>
                        <span className="text-border">|</span>
                        <span className="text-muted-foreground text-xs">
                          {meditation.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {activeTab === "breathing" && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Breathing Exercises
              </h2>
              {breathingExercises.map((exercise, idx) => (
                <motion.button
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full bg-card hover:bg-muted/50 rounded-2xl p-4 text-left transition-all shadow-soft border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-foreground font-semibold">{exercise.name}</h3>
                    <div
                      className={`px-3 py-1 rounded-full bg-gradient-to-r ${exercise.color} text-white text-xs font-medium`}
                    >
                      {Object.entries(exercise.pattern)
                        .map(([, val]) => val)
                        .join("-")}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {exercise.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.benefits.map((benefit, bidx) => (
                      <span
                        key={bidx}
                        className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {activeTab === "grounding" && (
            <motion.div
              key="grounding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Grounding Techniques
              </h2>
              
              {/* 5-4-3-2-1 Exercise Card */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowGroundingExercise(true)}
                className="w-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-500/30 dark:hover:to-purple-500/30 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-6 text-left transition-all shadow-soft"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">5</span>
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg">5-4-3-2-1 Technique</h3>
                    <p className="text-muted-foreground text-sm">Interactive sensory grounding</p>
                  </div>
                </div>
                <p className="text-foreground/80 dark:text-gray-300 text-sm mb-4">
                  A powerful technique to bring you back to the present moment by engaging all five senses. Perfect for anxiety, panic, or overwhelming thoughts.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-muted-foreground">5 See</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hand className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span className="text-muted-foreground">4 Touch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ear className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-muted-foreground">3 Hear</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Takes ~3-5 minutes</span>
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1">
                    Start Exercise <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.button>

              {/* Info card */}
              <div className="bg-card rounded-2xl p-5 mt-6 shadow-soft border border-border">
                <h4 className="text-foreground font-semibold mb-3">When to Use Grounding</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    During anxiety or panic attacks
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    When feeling overwhelmed or dissociated
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Before important meetings or exams
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    After triggering or stressful situations
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === "selfcare" && (
            <motion.div
              key="selfcare"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">
                  Self Care Checklist
                </h2>
                <span className="text-sm text-muted-foreground">
                  {completedActivities.length} completed
                </span>
              </div>

              {selfCareActivities.map((category, idx) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card rounded-2xl p-4 shadow-soft border border-border"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${category.bgColor} flex items-center justify-center`}
                      >
                        <IconComponent className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <h3 className="text-foreground font-semibold">
                        {category.category}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {category.activities.map((activity) => (
                        <button
                          key={activity}
                          onClick={() => toggleActivity(activity)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            completedActivities.includes(activity)
                              ? "bg-muted/70"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              completedActivities.includes(activity)
                                ? `${category.bgColor} border-transparent`
                                : "border-muted-foreground/40"
                            }`}
                          >
                            {completedActivities.includes(activity) && (
                              <Check className={`w-3 h-3 ${category.color}`} />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              completedActivities.includes(activity)
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            }`}
                          >
                            {activity}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Meditation Player Modal */}
      <AnimatePresence>
        {selectedMeditation && (
          <MeditationPlayer
            meditation={selectedMeditation}
            onClose={() => setSelectedMeditation(null)}
          />
        )}
      </AnimatePresence>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <BreathingExercise
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </AnimatePresence>

      {/* Grounding Exercise Modal */}
      <AnimatePresence>
        {showGroundingExercise && (
          <GroundingExercise onClose={() => setShowGroundingExercise(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
