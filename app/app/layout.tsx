"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Home,
  Leaf,
  MessageCircle,
  Moon,
  Phone,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

const NAV_ITEMS = [
  { path: "/app", icon: Home, label: "Home", emoji: "🏠" },
  { path: "/app/chat", icon: MessageCircle, label: "Chat", emoji: "💬" },
  { path: "/app/mood", icon: BarChart2, label: "Mood", emoji: "📊" },
  { path: "/app/selfhelp", icon: Leaf, label: "Self-Help", emoji: "🌿" },
  { path: "/app/sos", icon: Phone, label: "SOS", emoji: "🚨" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

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
