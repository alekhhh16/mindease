"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          {/* Header */}
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MindEase
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Check your email
          </h1>

          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
            <Mail className="w-5 h-5" />
            <p>We&apos;ve sent you a confirmation link</p>
          </div>

          <p className="text-muted-foreground text-sm mb-8">
            Please check your email inbox and click the confirmation link to
            activate your account. The link will expire in 24 hours.
          </p>

          <Link href="/auth/login">
            <Button className="w-full py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold rounded-xl transition-all">
              Back to Login
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
