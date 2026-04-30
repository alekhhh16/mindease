"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, MessageCircle, Shield, ArrowRight, X } from "lucide-react";

interface WelcomeModalProps {
  userName?: string;
  onClose: () => void;
}

export function WelcomeModal({ userName, onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  
  const features = [
    {
      icon: MessageCircle,
      title: "Chat with Mira",
      description: "Your AI companion who listens without judgment and remembers what you share.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Track Your Mood",
      description: "Log how you feel daily and see patterns in your emotional wellness.",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations are encrypted and you can delete your data anytime.",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {userName ? `Welcome, ${userName}!` : "Welcome to MindEase"}
            </h2>
            <p className="text-muted-foreground">
              Your personal space for mental wellness
            </p>
          </div>

          {/* Features carousel */}
          <div className="relative overflow-hidden mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 bg-accent/30 rounded-2xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${features[step].color} flex items-center justify-center mb-3`}>
                  {(() => {
                    const Icon = features[step].icon;
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{features[step].title}</h3>
                <p className="text-sm text-muted-foreground">{features[step].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === step ? "w-6 bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {step < features.length - 1 ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-accent/50 text-foreground font-medium hover:bg-accent transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            MindEase provides support, not medical advice
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("mindease_onboarding_complete");
    if (!hasSeenOnboarding) {
      // Small delay to let the app load first
      const timer = setTimeout(() => setShowWelcome(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem("mindease_onboarding_complete", "true");
    setShowWelcome(false);
  };
  
  return { showWelcome, completeOnboarding };
}
