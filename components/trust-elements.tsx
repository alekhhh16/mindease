"use client";

import { Lock, Shield, Trash2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

// Privacy Badge - compact version for headers
export function PrivacyBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full ${className}`}>
      <Lock className="w-3 h-3 text-emerald-500" />
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Private & Secure</span>
    </div>
  );
}

// Trust Banner - for footer/bottom of pages
export function TrustBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-4 border-t border-border/50"
    >
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Your chats are private</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete your data anytime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}

// Medical Disclaimer - important for mental health app
export function MedicalDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground text-center">
        This is not medical advice. For emergencies, call 112.
      </p>
    );
  }
  
  return (
    <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground">
        MindEase provides emotional support, not medical advice. 
        If you&apos;re experiencing a mental health emergency, please contact a professional or call emergency services.
      </p>
    </div>
  );
}

// Privacy Info Card - detailed version for settings/profile
export function PrivacyInfoCard() {
  return (
    <div className="p-4 bg-card rounded-2xl border border-border space-y-3">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        Your Privacy Matters
      </h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>All conversations are encrypted and stored securely</span>
        </li>
        <li className="flex items-start gap-2">
          <Trash2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>You can delete your chat history and data at any time</span>
        </li>
        <li className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>We never share your personal information with third parties</span>
        </li>
      </ul>
    </div>
  );
}
