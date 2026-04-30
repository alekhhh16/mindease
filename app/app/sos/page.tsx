"use client";

import { useState, useEffect } from "react";
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
  Navigation,
  Loader2,
  CheckCircle,
} from "lucide-react";

// Location types
interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  area?: string;
}

// Location Permission Modal Component
function LocationPermissionModal({
  onAllow,
  onDeny,
}: {
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-border"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
          >
            <Navigation className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground text-center mb-2">
          Enable Location
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-center mb-6">
          To help you better, we can use your location to find nearby emergency support and services.
        </p>

        {/* Privacy Notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-6">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Your location is used only for emergency assistance. We do not store your location permanently.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onAllow}
            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Allow Location
          </button>
          <button
            onClick={onDeny}
            className="w-full py-3.5 bg-muted hover:bg-muted/80 rounded-xl text-muted-foreground font-medium transition-colors"
          >
            Continue Without Location
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Location Status Banner Component
function LocationBanner({
  location,
  loading,
  error,
}: {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Getting your location...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span className="text-sm text-amber-600 dark:text-amber-400">
            {error}
          </span>
        </div>
      </motion.div>
    );
  }

  if (location) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <div>
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              {location.city || location.area
                ? `You are near: ${location.city || location.area}`
                : "Location enabled"}
            </span>
            <p className="text-xs text-muted-foreground">
              Showing nearby emergency services
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

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
  
  // Location state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationAsked, setLocationAsked] = useState(false);

  // Check if location was already asked in this session
  useEffect(() => {
    const wasAsked = sessionStorage.getItem("sos_location_asked");
    if (!wasAsked) {
      // Show location modal after a brief delay
      const timer = setTimeout(() => {
        setShowLocationModal(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Try to get stored location if permission was granted before
      const storedLocation = sessionStorage.getItem("sos_user_location");
      if (storedLocation) {
        setLocation(JSON.parse(storedLocation));
      }
    }
  }, []);

  // Get user location
  const getUserLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    setShowLocationModal(false);
    sessionStorage.setItem("sos_location_asked", "true");
    setLocationAsked(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationData: LocationData = { latitude, longitude };

        // Try to get city name using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();
          if (data.address) {
            locationData.city = data.address.city || data.address.town || data.address.village;
            locationData.area = data.address.state_district || data.address.state;
          }
        } catch {
          // Reverse geocoding failed, but we still have coordinates
        }

        setLocation(locationData);
        sessionStorage.setItem("sos_user_location", JSON.stringify(locationData));
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Using default services.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable. Using default services.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Using default services.");
            break;
          default:
            setLocationError("Unable to get location. Using default services.");
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Handle deny location
  const handleDenyLocation = () => {
    setShowLocationModal(false);
    sessionStorage.setItem("sos_location_asked", "true");
    setLocationAsked(true);
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Location Permission Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <LocationPermissionModal
            onAllow={getUserLocation}
            onDeny={handleDenyLocation}
          />
        )}
      </AnimatePresence>

      {/* Location Status Banner */}
      <LocationBanner
        location={location}
        loading={locationLoading}
        error={locationError}
      />

      {/* Emotional Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">You Are Not Alone</h1>
          <p className="text-muted-foreground text-lg mb-4">
            Whatever you&apos;re going through, help is here.
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
            Take a deep breath. You&apos;ve already taken a brave step by coming here.
          </p>
        </motion.div>
      </div>
      
      {/* Quick Breathing Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-6 mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Wind className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-foreground font-medium">Quick Calm</p>
            <p className="text-sm text-muted-foreground">Breathe in for 4 seconds, hold for 4, breathe out for 4</p>
          </div>
        </div>
      </motion.div>

      {/* Emergency Banner - More Prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="mx-6 mb-6 p-5 bg-gradient-to-r from-red-500/30 to-rose-500/30 rounded-2xl border-2 border-red-500/50"
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-foreground font-bold text-lg mb-2">
            Need Immediate Help?
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            If you&apos;re in immediate danger, please reach out now.
          </p>
          <a
            href="tel:112"
            className="inline-flex items-center justify-center gap-2 w-full max-w-xs px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-bold text-lg transition-colors shadow-lg shadow-red-500/25"
          >
            <Phone className="w-5 h-5" />
            Call Emergency (112)
          </a>
        </div>
      </motion.div>

      {/* Affirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-6 mb-6"
      >
        <button
          onClick={nextAffirmation}
          className="w-full p-6 bg-gradient-to-br from-primary/10 to-pink-500/10 rounded-2xl border border-primary/20 text-left hover:bg-primary/15 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-medium">
              Words of Comfort
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentAffirmation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-foreground text-lg font-medium"
            >
              &ldquo;{affirmations[currentAffirmation]}&rdquo;
            </motion.p>
          </AnimatePresence>
          <p className="text-muted-foreground text-xs mt-3">Tap for another affirmation</p>
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
          <h2 className="text-lg font-semibold text-foreground">Crisis Helplines</h2>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>{location?.city || location?.area || "India"}</span>
          </div>
        </div>
        <div className="space-y-3">
          {crisisHelplines.map((helpline, idx) => (
            <motion.div
              key={helpline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="bg-card rounded-2xl p-4 border border-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-foreground font-semibold">{helpline.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${helpline.color} text-white text-xs font-medium`}
                    >
                      {helpline.type}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      {helpline.hours}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${helpline.number.replace(/-/g, "")}`}
                  className="p-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
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
