"use client";

import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Brain, Trash2, User, Heart, Star, Clock, Plus, X } from "lucide-react";
import Link from "next/link";

interface Memory {
  id: string;
  category: "personal" | "preferences" | "context" | "important";
  key: string;
  value: string;
  confidence: number;
  created_at: string;
  updated_at: string;
}

const CATEGORY_CONFIG = {
  personal: {
    label: "Personal Info",
    icon: User,
    color: "bg-primary/20 text-primary border-primary/30",
    description: "Name, age, college, family details",
  },
  preferences: {
    label: "Preferences",
    icon: Heart,
    color: "bg-peach/30 text-foreground border-peach/50",
    description: "Communication style, likes/dislikes",
  },
  context: {
    label: "Current Context",
    icon: Clock,
    color: "bg-lavender/30 text-foreground border-lavender/50",
    description: "Ongoing situations, recent events",
  },
  important: {
    label: "Important",
    icon: Star,
    color: "bg-sage/30 text-foreground border-sage/50",
    description: "Mental health info, triggers, coping strategies",
  },
};

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    category: "personal" as Memory["category"],
    key: "",
    value: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memories");
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/memories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error("Failed to delete memory:", error);
    }
  };

  const handleAddMemory = async () => {
    if (!newMemory.key.trim() || !newMemory.value.trim()) return;

    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemory),
      });

      if (res.ok) {
        const data = await res.json();
        setMemories((prev) => [data, ...prev]);
        setNewMemory({ category: "personal", key: "", value: "" });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add memory:", error);
    }
  };

  const groupedMemories = memories.reduce(
    (acc, memory) => {
      if (!acc[memory.category]) acc[memory.category] = [];
      acc[memory.category].push(memory);
      return acc;
    },
    {} as Record<string, Memory[]>
  );

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="glass-elevated border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Brain size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">My Memories</h1>
              <p className="text-xs text-muted-foreground">What MindEase remembers about you</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-pill btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Memory
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Brain size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No memories yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              As you chat with MindEase, I will remember important things about you to personalize our conversations.
            </p>
            <Link href="/app/chat" className="btn-pill btn-primary text-sm py-2.5 px-6">
              Start Chatting
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((category) => {
              const config = CATEGORY_CONFIG[category];
              const categoryMemories = groupedMemories[category] || [];
              const Icon = config.icon;

              if (categoryMemories.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">{config.label}</h2>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {categoryMemories.map((memory) => (
                      <motion.div
                        key={memory.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass rounded-xl p-3 border border-border/50 group"
                      >
                        {deleteConfirmId === memory.id ? (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-foreground">Delete this memory?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(memory.id)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground font-medium"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-foreground"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {memory.key}
                              </p>
                              <p className="text-sm text-foreground mt-0.5">{memory.value}</p>
                            </div>
                            <button
                              onClick={() => setDeleteConfirmId(memory.id)}
                              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-elevated rounded-2xl p-6 w-full max-w-md border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Add Memory</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1.5 rounded-full hover:bg-muted transition-smooth"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                  <select
                    value={newMemory.category}
                    onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value as Memory["category"] })}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    What to remember (e.g., &quot;name&quot;, &quot;college&quot;)
                  </label>
                  <input
                    type="text"
                    value={newMemory.key}
                    onChange={(e) => setNewMemory({ ...newMemory, key: e.target.value })}
                    placeholder="e.g., name, college, hobby"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Value</label>
                  <input
                    type="text"
                    value={newMemory.value}
                    onChange={(e) => setNewMemory({ ...newMemory, value: e.target.value })}
                    placeholder="e.g., Rahul, IIT Delhi"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <button
                  onClick={handleAddMemory}
                  disabled={!newMemory.key.trim() || !newMemory.value.trim()}
                  className="w-full btn-pill btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Memory
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
