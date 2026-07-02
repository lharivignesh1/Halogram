/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Flame, 
  Clock, 
  Send, 
  Award, 
  Sparkles, 
  Bell, 
  HelpCircle, 
  Check, 
  Calendar, 
  Activity, 
  Sparkle,
  Zap
} from "lucide-react";
import { Friend } from "../types";
import { ACCENT_CLASSES, AccentColor } from "../accent";

interface StreaksProps {
  friends: Friend[];
  onNudge: (friendId: string) => void;
  onNavigateToTab: (tab: string, isStory?: boolean, selectedFriendId?: string) => void;
  theme: "light" | "dark";
  accentColor: AccentColor;
  onEquipAccent: (color: AccentColor) => void;
}

const ACHIEVEMENTS = [
  {
    id: "a1",
    title: "Prismatic Novice",
    req: "Reach a 5-day streak",
    days: 5,
    description: "Begin lighting the holographic fire with friends.",
    icon: "🌱"
  },
  {
    id: "a2",
    title: "Laser Pulse Bond",
    req: "Reach a 15-day streak",
    days: 15,
    description: "Stable and high-speed communication channel established.",
    icon: "⚡"
  },
  {
    id: "a3",
    title: "Quantum Supernova",
    req: "Reach a 30-day streak",
    days: 30,
    description: "Outstanding dedication. Your digital atoms are fused!",
    icon: "☄️"
  }
];

const REWARDS = [
  {
    id: "r1",
    name: "Cyber Emerald Accent",
    streakRequired: 5,
    color: "emerald" as AccentColor,
    hex: "#10b981",
    description: "Unlocks the glowing cyber emerald visual theme for your Halogram interface.",
    icon: "🟢"
  },
  {
    id: "r2",
    name: "Laser Pulse Pink Accent",
    streakRequired: 15,
    color: "pink" as AccentColor,
    hex: "#ec4899",
    description: "Unlocks the laser pulse pink neon borders and active indicators.",
    icon: "🌸"
  },
  {
    id: "r3",
    name: "Quantum Purple Accent",
    streakRequired: 30,
    color: "purple" as AccentColor,
    hex: "#8b5cf6",
    description: "Unlocks the hyper-dimensional quantum purple theme for the ultimate look.",
    icon: "🔮"
  }
];

// Helper for generating mock weekly interaction matrix
// Mon-Sun log representing whether daily sync was successful
const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export default function Streaks({ 
  friends, 
  onNudge, 
  onNavigateToTab, 
  theme, 
  accentColor, 
  onEquipAccent 
}: StreaksProps) {
  const [nudgedFriends, setNudgedFriends] = useState<Record<string, boolean>>({});
  const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);
  
  // Local simulation of modifying historical sync matrix cells
  const [customSyncLogs, setCustomSyncLogs] = useState<Record<string, boolean[]>>({
    friend1: [true, true, true, true, true, true, true], // Lisa Chen has a long streak
    friend2: [true, false, true, false, false, true, false], // Kai Yamamoto is spotty
    friend3: [true, true, true, true, true, true, true], // Sophia
    friend4: [false, true, false, true, true, false, false] // Ethan
  });

  const handleNudgeClick = (friendId: string) => {
    onNudge(friendId);
    setNudgedFriends((prev) => ({ ...prev, [friendId]: true }));
    // reset nudge state after a few seconds
    setTimeout(() => {
      setNudgedFriends((prev) => ({ ...prev, [friendId]: false }));
    }, 3000);

    // Also simulate syncing today's log cell
    toggleSyncCell(friendId, 6); // Today is Sunday in this index
  };

  const toggleSyncCell = (friendId: string, dayIndex: number) => {
    setCustomSyncLogs(prev => {
      const logs = prev[friendId] ? [...prev[friendId]] : [false, false, false, false, false, false, false];
      logs[dayIndex] = !logs[dayIndex];
      return { ...prev, [friendId]: logs };
    });
  };

  const c = ACCENT_CLASSES[accentColor];
  const isDark = theme === "dark";

  // Calculate highest streak across all friends
  const maxStreak = friends.length > 0 ? Math.max(...friends.map((f) => f.streakDays)) : 0;

  return (
    <div className={`max-w-4xl mx-auto p-4 md:p-6 space-y-6 rounded-2xl border transition-all duration-300 ${
      isDark 
        ? "bg-zinc-900/60 backdrop-blur-sm border-zinc-800 shadow-2xl" 
        : "bg-white/95 border-zinc-200 shadow-xl"
    }`}>
      
      {/* Intro Header */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${
        isDark 
          ? "bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-purple-500/10 border-zinc-800/80" 
          : "bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5 border-zinc-200"
      }`}>
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
            <h2 className={`text-lg font-bold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              Your Halo Streaks Core
            </h2>
          </div>
          <p className={`text-xs max-w-md ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Halo Streaks measure your continuous daily end-to-end interactions (DMs, liking posts, commenting, viewing stories) with close friends. Keep your flames glowing!
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab("create")}
          className={`hover:scale-105 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 ${
            isDark 
              ? "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/20" 
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/10"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Send a Halo Post to Friends
        </button>
      </div>

      {/* Main Grid: Friends list and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Friends & Streaks Status */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              <Clock className={`w-4 h-4 ${c.text}`} />
              Real-Time Flame Monitors
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isDark ? "bg-zinc-800/80 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
              Click to view sync matrix
            </span>
          </div>

          <div className="space-y-3.5">
            {friends.map((friend) => {
              const logs = customSyncLogs[friend.id] || [true, true, true, false, true, true, friend.streakActive];
              const isExpanded = expandedFriendId === friend.id;

              return (
                <div
                  key={friend.id}
                  className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                    isDark 
                      ? "bg-zinc-950 border-zinc-800 hover:border-zinc-700" 
                      : "bg-zinc-50/80 border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {/* Top Summary Row */}
                  <div 
                    onClick={() => setExpandedFriendId(isExpanded ? null : friend.id)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.username}
                          className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/60"
                        />
                        {friend.streakActive && (
                          <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-0.5 text-[8px] animate-bounce">
                            🔥
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                          {friend.username}
                          <span className="text-xs font-bold text-orange-400 flex items-center gap-0.5 bg-orange-500/10 px-1.5 py-0.5 rounded">
                            🔥 {friend.streakDays}
                          </span>
                        </h4>
                        <p className="text-[11px] flex items-center gap-1 mt-0.5">
                          {friend.streakActive ? (
                            <span className="text-emerald-500 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Streak maintained for today
                            </span>
                          ) : (
                            <span className="text-amber-500 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              ⏳ Expiring in {friend.hoursRemaining}h!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleNudgeClick(friend.id)}
                        disabled={nudgedFriends[friend.id]}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                          nudgedFriends[friend.id]
                            ? "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                            : isDark
                              ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                              : "bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
                        }`}
                      >
                        <Bell className="w-3 h-3" />
                        {nudgedFriends[friend.id] ? "Nudged! ⚡" : "Nudge"}
                      </button>

                      <button
                        onClick={() => onNavigateToTab("messages", false, friend.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white transition-all flex items-center gap-1 hover:scale-102 ${
                          isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        Chat
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section: Weekly Sync Log Matrix */}
                  <div className={`transition-all duration-300 ${
                    isExpanded ? "border-t max-h-48 p-4" : "max-h-0 opacity-0 overflow-hidden"
                  } ${isDark ? "border-zinc-800/80 bg-zinc-950/40" : "border-zinc-200 bg-zinc-100/30"}`}>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className={`w-3.5 h-3.5 ${c.text}`} />
                        <span className={`text-xs font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                          E2E Quantum Sync logs (Last 7 Days)
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        Click block to toggle log manually
                      </span>
                    </div>

                    {/* Weekly Matrix Blocks */}
                    <div className="grid grid-cols-7 gap-2">
                      {DAYS_OF_WEEK.map((day, idx) => {
                        const isSynced = logs[idx];
                        const isToday = idx === 6;

                        return (
                          <div 
                            key={idx}
                            onClick={() => toggleSyncCell(friend.id, idx)}
                            className={`p-2 rounded-lg border text-center cursor-pointer transition-all hover:scale-105 flex flex-col items-center justify-center gap-1 ${
                              isSynced
                                ? isDark 
                                  ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                                  : "bg-emerald-50 border-emerald-300 text-emerald-700"
                                : isDark
                                  ? "bg-zinc-900/40 border-zinc-800 text-zinc-600"
                                  : "bg-zinc-100 border-zinc-200 text-zinc-400"
                            } ${isToday ? "ring-1 ring-orange-500/50" : ""}`}
                          >
                            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">{day}</span>
                            
                            {isSynced ? (
                              <div className="relative flex items-center justify-center">
                                <Check className="w-3 h-3 text-emerald-400" />
                                {isToday && (
                                  <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px]">•</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Status detail */}
                    <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Sync frequency: {logs.filter(Boolean).length}/7 days ({(logs.filter(Boolean).length / 7 * 100).toFixed(0)}%)
                      </span>
                      {friend.streakActive && (
                        <span className="text-emerald-400 font-semibold font-mono">CHANNEL ONLINE</span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rewards and Achievements Section */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Rewards Center */}
          <div className="space-y-3">
            <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              <Sparkle className={`w-4 h-4 ${c.text}`} />
              Streak Rewards Center
            </h3>

            <div className="space-y-3">
              {REWARDS.map((reward) => {
                const isUnlocked = maxStreak >= reward.streakRequired;
                const isEquipped = accentColor === reward.color;

                return (
                  <div
                    key={reward.id}
                    className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col gap-2.5 ${
                      isEquipped
                        ? isDark 
                          ? "bg-zinc-950 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
                          : "bg-orange-50/50 border-orange-300"
                        : isUnlocked
                          ? isDark
                            ? "bg-zinc-950/80 border-zinc-800"
                            : "bg-zinc-50 border-zinc-200"
                          : isDark
                            ? "bg-zinc-950/30 border-zinc-900/60 opacity-60"
                            : "bg-zinc-100/40 border-zinc-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl p-2 rounded-lg flex-shrink-0 border ${
                        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
                      }`}>
                        {reward.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                            {reward.name}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold uppercase tracking-wider">
                              Unlocked
                            </span>
                          ) : (
                            <span className="text-[9px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-700 font-semibold uppercase tracking-wider">
                              Locked
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                          {reward.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-dashed border-zinc-800">
                      <span className="text-[9px] font-mono text-zinc-500">
                        Milestone: {reward.streakRequired} Days
                      </span>
                      
                      {isUnlocked ? (
                        <button
                          onClick={() => onEquipAccent(reward.color)}
                          disabled={isEquipped}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 hover:scale-102 ${
                            isEquipped
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/40 cursor-default"
                              : isDark
                                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                                : "bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 shadow-sm"
                          }`}
                        >
                          <Zap className="w-3 h-3 fill-current" />
                          {isEquipped ? "Equipped" : "Equip"}
                        </button>
                      ) : (
                        <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Need {reward.streakRequired - maxStreak} more days!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements list */}
          <div className="space-y-3">
            <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              <Award className="w-4 h-4" />
              Streak Badges
            </h3>

            <div className="space-y-3">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = friends.some((f) => f.streakDays >= ach.days);

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? isDark 
                          ? "bg-zinc-950 border-pink-500/40 shadow-lg shadow-pink-500/5" 
                          : "bg-white border-pink-500/30 shadow-lg shadow-pink-500/5"
                        : isDark
                          ? "bg-zinc-950/40 border-zinc-800/60 opacity-60"
                          : "bg-zinc-100/40 border-zinc-200 opacity-60"
                    }`}
                  >
                    <div className="text-2xl p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex-shrink-0">
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        {ach.title}
                        {isUnlocked ? (
                          <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1 rounded border border-emerald-500/30 font-semibold">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] bg-zinc-800 text-zinc-500 px-1 rounded border border-zinc-700 font-semibold">
                            Locked
                          </span>
                        )}
                      </h4>
                      <p className={`text-[10px] mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{ach.description}</p>
                      <p className="text-[9px] text-zinc-500 font-mono mt-1">Req: {ach.req}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips block */}
          <div className={`p-3.5 rounded-xl border leading-relaxed flex gap-2.5 ${
            isDark ? "bg-zinc-950 border-zinc-800 text-[11px] text-zinc-500" : "bg-zinc-50 border-zinc-200 text-[11px] text-zinc-600"
          }`}>
            <HelpCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-semibold mb-0.5 ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>How to build streaks:</p>
              Send an E2EE direct message, like your friend's feed posts, post a reply comment, or click and view their active stories. Every action is automatically tracked as a dynamic daily sync!
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
