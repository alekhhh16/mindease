"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  MessageCircle,
  Heart,
  Shield,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Wind,
  Clock,
  MapPin,
  Globe,
  Star,
  X,
} from "lucide-react";

// Crisis helplines data
const crisisHelplines = [
  {
    id: 1,
    name: "iCall",
    number: "9152987821",
    description:
      "Free telephone counselling service by TISS. Available Monday-Saturday, 8am-10pm.",
    hours: "Mon-Sat, 8am-10pm",
    type: "Counselling",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    description:
      "24/7 free mental health support helpline. Multilingual support available.",
    hours: "24/7",
    type: "Mental Health",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "AASRA",
    number: "9820466726",
    description:
      "Crisis intervention center for the depressed and suicidal. Available 24/7.",
    hours: "24/7",
    type: "Crisis",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 4,
    name: "Snehi",
    number: "044-24640050",
    description:
      "Emotional support helpline based in Chennai. Available 24 hours daily.",
    hours: "24/7",
    type: "Emotional Support",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 5,
    name: "NIMHANS",
    number: "080-46110007",
    description:
      "National Institute of Mental Health helpline. Professional psychiatric support.",
    hours: "Mon-Sat, 9am-5pm",
    type: "Psychiatric",
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: 6,
    name: "Connecting Trust",
    number: "9922001122",
    description:
      "Emotional support for people in distress. Based in Pune, available evenings.",
    hours: "Daily, 12pm-8pm",
    type: "Emotional Support",
    color: "from-amber-500 to-orange-500",
  },
];

// Quick coping strategies
const copingStrategies = [
  {
    id: 1,
    title: "Box Breathing",
    description: "4-4-4-4 breathing to calm your nervous system",
    icon: Wind,
    color: "from-blue-400 to-cyan-500",
    steps: [
      "Breathe in for 4 seconds",
      "Hold for 4 seconds",
      "Breathe out for 4 seconds",
      "Hold empty for 4 seconds",
      "Repeat 4 times",
    ],
  },
  {
    id: 2,
    title: "5-4-3-2-1 Grounding",
    description: "Use your senses to ground yourself in the present",
    icon: Sparkles,
    color: "from-purple-400 to-pink-500",
    steps: [
      "5 things you can SEE",
      "4 things you can TOUCH",
      "3 things you can HEAR",
      "2 things you can SMELL",
      "1 thing you can TASTE",
    ],
  },
  {
    id: 3,
    title: "Safe Place Visualization",
    description: "Imagine a place where you feel completely safe",
    icon: Shield,
    color: "from-emerald-400 to-teal-500",
    steps: [
      "Close your eyes",
      "Picture a safe, peaceful place",
      "Notice the colors and shapes",
      "Feel the temperature and textures",
      "Stay here until you feel calmer",
    ],
  },
  {
    id: 4,
    title: "Progressive Muscle Relaxation",
    description: "Release tension by tensing and relaxing muscles",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    steps: [
      "Start with your feet - tense for 5 seconds",
      "Release and notice the relaxation",
      "Move to calves, then thighs",
      "Continue up through your body",
      "End with your face and jaw",
    ],
  },
];

// Affirmations
const affirmations = [
  "This feeling is temporary. It will pass.",
  "I am stronger than I think I am.",
  "It's okay to ask for help. That takes courage.",
  "I am doing the best I can, and that is enough.",
  "I deserve kindness, especially from myself.",
  "This moment does not define my whole life.",
  "I have survived difficult times before.",
  "My feelings are valid, but they don't control me.",
  "Tomorrow is a new day with new possibilities.",
  "I am worthy of love and support.",
];

// Safety Plan Component
function SafetyPlanModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a1a2e] rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              Personal Safety Plan
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Steps to follow when in crisis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Recognize Warning Signs",
              content:
                "What thoughts, feelings, or behaviors tell you a crisis may be developing?",
            },
            {
              step: 2,
              title: "Use Coping Strategies",
              content:
                "Try the coping techniques on this page: breathing exercises, grounding, etc.",
            },
            {
              step: 3,
              title: "Reach Out to Someone",
              content:
                "Contact a trusted friend, family member, or one of the helplines listed.",
            },
            {
              step: 4,
              title: "Make Your Environment Safe",
              content:
                "Remove or distance yourself from things that could harm you.",
            },
            {
              step: 5,
              title: "Professional Help",
              content:
                "If coping strategies aren't helping, call a crisis line or go to emergency services.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {item.step}
                </div>
                <h4 className="text-white font-semibold">{item.title}</h4>
              </div>
              <p className="text-gray-400 text-sm ml-11">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Emergency</span>
          </div>
          <p className="text-gray-300 text-sm">
            If you are in immediate danger, call emergency services (112) or go
            to your nearest emergency room.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Coping Strategy Modal
function CopingStrategyModal({
  strategy,
  onClose,
}: {
  strategy: (typeof copingStrategies)[0];
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const IconComponent = strategy.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a1a2e] rounded-3xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${strategy.color} flex items-center justify-center`}
          >
            <IconComponent className="w-7 h-7 text-white" />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{strategy.title}</h3>
        <p className="text-gray-400 mb-6">{strategy.description}</p>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {strategy.steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl transition-all ${
                idx === currentStep
                  ? `bg-gradient-to-r ${strategy.color} text-white`
                  : idx < currentStep
                    ? "bg-white/10 text-gray-300"
                    : "bg-white/5 text-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentStep === strategy.steps.length - 1) {
                onClose();
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${strategy.color} text-white font-semibold`}
          >
            {currentStep === strategy.steps.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SosPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<
    (typeof copingStrategies)[0] | null
  >(null);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Crisis Support</h1>
          </div>
          <p className="text-gray-400">
            You are not alone. Help is available.
          </p>
        </motion.div>
      </div>

      {/* Emergency Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-6 mb-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold mb-1">
              If you are in immediate danger
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Call emergency services or go to your nearest emergency room.
            </p>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold text-sm"
            >
              <Phone className="w-4 h-4" />
              Call 112
            </a>
          </div>
        </div>
      </motion.div>

      {/* Affirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-6 mb-6"
      >
        <button
          onClick={nextAffirmation}
          className="w-full p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 text-left"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">
              Affirmation
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentAffirmation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-lg font-medium"
            >
              &ldquo;{affirmations[currentAffirmation]}&rdquo;
            </motion.p>
          </AnimatePresence>
          <p className="text-gray-500 text-xs mt-3">Tap for another</p>
        </button>
      </motion.div>

      {/* Safety Plan Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mx-6 mb-6"
      >
        <button
          onClick={() => setShowSafetyPlan(true)}
          className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Personal Safety Plan</h3>
              <p className="text-gray-400 text-sm">
                Steps to follow when in crisis
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </motion.div>

      {/* Quick Coping Strategies */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Quick Coping Strategies
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {copingStrategies.map((strategy, idx) => {
            const IconComponent = strategy.icon;
            return (
              <motion.button
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                onClick={() => setSelectedStrategy(strategy)}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-left transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${strategy.color} flex items-center justify-center mb-3`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">
                  {strategy.title}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  {strategy.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Crisis Helplines */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Crisis Helplines</h2>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span>India</span>
          </div>
        </div>
        <div className="space-y-3">
          {crisisHelplines.map((helpline, idx) => (
            <motion.div
              key={helpline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="bg-white/5 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-semibold">{helpline.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${helpline.color} text-white text-xs font-medium`}
                    >
                      {helpline.type}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {helpline.hours}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${helpline.number.replace(/-/g, "")}`}
                  className="p-3 bg-emerald-500 rounded-xl"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                {helpline.description}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${helpline.number.replace(/-/g, "")}`}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {helpline.number}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Online Resources */}
      <div className="px-6 mt-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Online Resources
        </h2>
        <div className="space-y-3">
          {[
            {
              name: "iCALL Chat Support",
              url: "https://icallhelpline.org",
              description: "Online chat-based counselling",
            },
            {
              name: "YourDOST",
              url: "https://yourdost.com",
              description: "Connect with experts anonymously",
            },
            {
              name: "MindPeers",
              url: "https://mindpeers.co",
              description: "Mental health support platform",
            },
          ].map((resource, idx) => (
            <motion.a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {resource.name}
                  </h3>
                  <p className="text-gray-500 text-xs">{resource.description}</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-500" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Chat Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mx-6 mb-6"
      >
        <a
          href="/app/chat"
          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Talk to Mira</h3>
              <p className="text-gray-400 text-sm">
                Your AI wellness companion
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </a>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedStrategy && (
          <CopingStrategyModal
            strategy={selectedStrategy}
            onClose={() => setSelectedStrategy(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSafetyPlan && (
          <SafetyPlanModal onClose={() => setShowSafetyPlan(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
