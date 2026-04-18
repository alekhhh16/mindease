"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Plus,
  Calendar,
  Search,
  X,
  Save,
  Trash2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useJournalQueries } from "@/hooks/useJournalQueries";

const journalPrompts = [
  "What made you smile today?",
  "What are you grateful for right now?",
  "Describe a challenge you overcame recently.",
  "What is something you learned about yourself today?",
  "Write about a moment that brought you peace.",
  "What would you tell your past self?",
  "Describe your ideal day.",
  "What emotions have you felt today?",
];

export default function JournalPage() {
  const { entries, isLoading, addEntry, deleteEntry } = useJournalQueries();
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(
    journalPrompts[Math.floor(Math.random() * journalPrompts.length)]
  );

  const handleSave = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    await addEntry({
      title: newEntry.title,
      content: newEntry.content,
    });
    
    setNewEntry({ title: "", content: "" });
    setIsWriting(false);
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    setSelectedEntry(null);
  };

  const getRandomPrompt = () => {
    let newPrompt = currentPrompt;
    while (newPrompt === currentPrompt) {
      newPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    }
    setCurrentPrompt(newPrompt);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const selectedEntryData = entries.find((e) => e.id === selectedEntry);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Journal</h1>
            </div>
            <button
              onClick={() => setIsWriting(true)}
              className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-gray-400">Express your thoughts and feelings</p>
        </motion.div>
      </div>

      {/* Writing Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-6 mb-6"
      >
        <button
          onClick={getRandomPrompt}
          className="w-full p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">
              Writing Prompt
            </span>
          </div>
          <p className="text-white font-medium">{currentPrompt}</p>
          <p className="text-gray-500 text-xs mt-2">Tap for another prompt</p>
        </button>
      </motion.div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Entries</h2>
          <span className="text-gray-500 text-sm">
            {filteredEntries.length} entries
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400">
              {searchQuery ? "No entries found" : "Start writing your first entry"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsWriting(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold"
              >
                Write Now
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, idx) => (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedEntry(entry.id)}
                className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-left transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {entry.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                      {entry.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500 text-xs">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Write Entry Modal */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setIsWriting(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-[#1a1a2e] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button
                  onClick={() => setIsWriting(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
                <h3 className="text-white font-semibold">New Entry</h3>
                <button
                  onClick={handleSave}
                  disabled={!newEntry.title.trim() || !newEntry.content.trim()}
                  className="p-2 rounded-full bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 space-y-4">
                <input
                  type="text"
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-semibold placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50"
                />
                <textarea
                  placeholder="Write your thoughts..."
                  value={newEntry.content}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, content: e.target.value })
                  }
                  rows={10}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              {/* Prompt suggestion */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => {
                    setNewEntry({ ...newEntry, content: currentPrompt + "\n\n" });
                    getRandomPrompt();
                  }}
                  className="w-full p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-left"
                >
                  <div className="flex items-center gap-2 text-purple-400 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Use prompt: &ldquo;{currentPrompt}&rdquo;</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Entry Modal */}
      <AnimatePresence>
        {selectedEntry && selectedEntryData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-[#1a1a2e] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedEntryData.createdAt)}</span>
                </div>
                <button
                  onClick={() => handleDelete(selectedEntryData.id)}
                  className="p-2 rounded-full hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedEntryData.title}
                </h2>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedEntryData.content}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
