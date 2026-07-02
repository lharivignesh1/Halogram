/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Heart,
  MessageCircle,
  Sparkles,
  Trash2,
  Check,
  Eye,
  ArrowLeft,
  Flame,
  CornerDownRight,
  Send
} from "lucide-react";
import { Friend } from "../types";

export interface SystemNotification {
  id: string;
  type: "story_like" | "story_reply" | "post_like" | "post_comment";
  user: {
    username: string;
    avatar: string;
  };
  content?: string; // reply message or comment text
  targetPreview?: string; // thumbnail/preview of post/story
  timestamp: string;
  read: boolean;
}

interface NotificationsProps {
  friends: Friend[];
  onNavigateToTab: (tab: string) => void;
  theme?: "dark" | "light";
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    type: "story_like",
    user: {
      username: "lisa_cyber",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    targetPreview: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80",
    timestamp: "2 mins ago",
    read: false
  },
  {
    id: "notif-2",
    type: "story_reply",
    user: {
      username: "neon_kai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    content: "This neural hologram is vibrating at perfect frequencies! Sync me in! 🌀🚀",
    targetPreview: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
    timestamp: "12 mins ago",
    read: false
  },
  {
    id: "notif-3",
    type: "post_like",
    user: {
      username: "sophia_prism",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    targetPreview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
    timestamp: "45 mins ago",
    read: true
  },
  {
    id: "notif-4",
    type: "post_comment",
    user: {
      username: "ethan.glitch",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    content: "Absolutely loving the retro neon lookup matrix. Let's build a custom layer!",
    targetPreview: "https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80",
    timestamp: "1 hour ago",
    read: true
  },
  {
    id: "notif-5",
    type: "story_like",
    user: {
      username: "ethan.glitch",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    targetPreview: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
    timestamp: "3 hours ago",
    read: true
  },
  {
    id: "notif-6",
    type: "story_reply",
    user: {
      username: "sophia_prism",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    content: "Incredible chromatic dispersion. What focal distance did you use?",
    targetPreview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
    timestamp: "5 hours ago",
    read: true
  }
];

export default function Notifications({
  friends,
  onNavigateToTab,
  theme = "dark"
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState<string | null>(null);

  const isDark = theme === "dark";

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast("All transmissions marked as synced");
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    triggerToast("Notification purge complete");
  };

  const handleSendReply = (id: string, username: string) => {
    const text = replyInputs[id];
    if (!text || !text.trim()) return;

    triggerToast(`Downlinked transmission reply to @${username}`);
    setReplyInputs((prev) => ({ ...prev, [id]: "" }));
    setActiveReplyId(null);

    // Automatically mark the notification as read upon replying
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-cyan-950 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-cyan-300 px-4 py-2.5 rounded-full text-xs font-mono font-semibold tracking-wider flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{showToast.toUpperCase()}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info Panel */}
      <div className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab("feed")}
            className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
              isDark
                ? "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase font-mono bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Transmissions Log
            </h2>
            <span className="text-[10px] text-zinc-500 font-mono">
              STORIES & POSTS TELEMETRY
            </span>
          </div>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 font-mono text-[9px] px-2.5 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all"
          >
            Sync All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl"
            >
              <Bell className="w-8 h-8 text-zinc-600 mx-auto mb-3 animate-bounce" />
              <p className="text-zinc-400 font-semibold text-xs">No active telemetry syncs</p>
              <p className="text-zinc-600 font-mono text-[9px] mt-1 uppercase tracking-widest">
                All quantum links are fully aligned
              </p>
            </motion.div>
          ) : (
            notifications.map((notif) => {
              const hasReplied = false;

              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`relative overflow-hidden rounded-2xl border transition-all p-4 flex gap-3.5 ${
                    notif.read
                      ? "bg-zinc-900/20 border-zinc-800/60 text-zinc-300"
                      : "bg-zinc-900/60 border-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.03)] text-white"
                  }`}
                >
                  {/* Left Unread Bar Indicator */}
                  {!notif.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-pink-500" />
                  )}

                  {/* Friend Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={notif.user.avatar}
                      alt={notif.user.username}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700 shadow"
                    />
                    <div className={`absolute -bottom-1 -right-1 rounded-full p-1 border shadow-sm ${
                      notif.type.includes("like")
                        ? "bg-pink-500 text-white border-pink-600"
                        : "bg-cyan-500 text-black border-cyan-600"
                    }`}>
                      {notif.type.includes("like") ? (
                        <Heart className="w-2 h-2 fill-current" />
                      ) : (
                        <MessageCircle className="w-2 h-2 fill-current" />
                      )}
                    </div>
                  </div>

                  {/* Notification Content Body */}
                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-bold font-mono">
                        @{notif.user.username}
                      </h4>
                      <span className="text-[9px] text-zinc-500 font-mono whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed pr-8">
                      {notif.type === "story_like" && (
                        <span>
                          liked your <span className="text-pink-400 font-semibold">holographic story</span>.
                        </span>
                      )}
                      {notif.type === "post_like" && (
                        <span>
                          liked your <span className="text-cyan-400 font-semibold font-mono">hologram stream post</span>.
                        </span>
                      )}
                      {notif.type === "story_reply" && (
                        <span>
                          replied to your <span className="text-pink-400 font-semibold">story</span>:
                        </span>
                      )}
                      {notif.type === "post_comment" && (
                        <span>
                          commented on your <span className="text-cyan-400 font-semibold font-mono">post</span>:
                        </span>
                      )}
                    </p>

                    {/* Content (Comment / Reply text) */}
                    {notif.content && (
                      <div className="mt-1.5 p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/50 flex gap-2">
                        <CornerDownRight className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-zinc-400 font-mono italic break-words min-w-0">
                          "{notif.content}"
                        </p>
                      </div>
                    )}

                    {/* Reply Input Box Trigger */}
                    {notif.type.includes("reply") || notif.type === "post_comment" ? (
                      <div className="mt-2.5 flex items-center gap-2">
                        {activeReplyId === notif.id ? (
                          <div className="flex w-full items-center gap-1.5">
                            <input
                              type="text"
                              value={replyInputs[notif.id] || ""}
                              onChange={(e) =>
                                setReplyInputs((prev) => ({
                                  ...prev,
                                  [notif.id]: e.target.value
                                }))
                              }
                              placeholder={`Secure reply to @${notif.user.username}...`}
                              className="bg-zinc-950/80 border border-cyan-500/30 text-xs rounded-lg px-2.5 py-1.5 flex-grow font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400"
                            />
                            <button
                              onClick={() => handleSendReply(notif.id, notif.user.username)}
                              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold p-1.5 rounded-lg transition-all"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setActiveReplyId(null)}
                              className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase px-1.5"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveReplyId(notif.id)}
                            className="text-[9px] font-mono font-bold tracking-widest uppercase text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                          >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            Secure Transmission Reply
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Thumbnail Preview and Actions Column */}
                  <div className="flex flex-col items-end gap-2.5 flex-shrink-0 justify-between">
                    {notif.targetPreview && (
                      <img
                        src={notif.targetPreview}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-zinc-800/80 bg-zinc-900"
                      />
                    )}

                    {/* Control Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleRead(notif.id)}
                        title={notif.read ? "Mark as unread" : "Mark as read"}
                        className={`p-1.5 rounded-lg border transition-all ${
                          notif.read
                            ? "bg-zinc-950 text-zinc-500 border-zinc-800/80 hover:text-zinc-300 hover:border-zinc-700"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        title="Dismiss notification"
                        className="p-1.5 rounded-lg border bg-zinc-950 border-zinc-800/80 text-zinc-500 hover:text-pink-500 hover:border-pink-500/30 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
