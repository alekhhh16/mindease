"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
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
            className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-10 h-10 text-red-500" />
          </motion.div>

          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Authentication Error
          </h1>

          <p className="text-muted-foreground mb-8">
            Something went wrong during authentication. This could be due to an
            expired link or an invalid request. Please try again.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/auth/login">
              <Button className="w-full py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold rounded-xl transition-all">
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full py-6 border-white/10 hover:bg-white/5 rounded-xl transition-all"
              >
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
