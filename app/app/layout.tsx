"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart2,
  Home,
  Leaf,
  LogOut,
  MessageCircle,
  Moon,
  Phone,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { path: "/app", icon: Home, label: "Home", emoji: "🏠" },
  { path: "/app/chat", icon: MessageCircle, label: "Chat", emoji: "💬" },
  { path: "/app/mood", icon: BarChart2, label: "Mood", emoji: "📊" },
  { path: "/app/self-help", icon: Leaf, label: "Self-Help", emoji: "🌿" },
  { path: "/app/sos", icon: Phone, label: "SOS", emoji: "🚨" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isDark = theme === "dark";

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      {/* Top bar */}
      <header className="glass border-b border-border/50 shadow-soft z-10 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            data-ocid="app.back_link"
            aria-label="Back to home"
            className="text-muted-foreground hover:text-foreground transition-smooth p-1.5 rounded-full hover:bg-muted/40"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <title>Back</title>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>

          <div className="text-base font-bold tracking-tight text-foreground">
            🌿 MindEase
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              type="button"
              data-ocid="app.theme_toggle"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
                >
                  <User size={18} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl border border-white/10 shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.user_metadata?.display_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/app/sos"
              data-ocid="app.sos_button"
              className="bg-destructive/10 text-destructive text-xs font-bold px-3 py-1.5 rounded-full hover:bg-destructive/20 transition-smooth"
            >
              SOS
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom nav */}
      <nav
        className="glass border-t border-border/50 flex-shrink-0 pb-safe"
        data-ocid="app.bottom_nav"
      >
        <div className="grid grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.path ||
              (pathname === "/app" && item.path === "/app") ||
              (item.path !== "/app" && pathname?.startsWith(item.path));
            const isSos = item.path === "/app/sos";

            return (
              <Link
                key={item.path}
                href={item.path}
                data-ocid={`app.${item.label.toLowerCase().replace("-", "")}.tab`}
                className={`flex flex-col items-center justify-center py-3 gap-0.5 transition-smooth relative ${
                  isSos
                    ? isActive
                      ? "text-destructive"
                      : "text-destructive/60 hover:text-destructive"
                    : isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
                <span className="text-lg leading-none">{item.emoji}</span>
                <span className="text-[10px] font-semibold tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
