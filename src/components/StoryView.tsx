/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Flame, Send, Heart } from "lucide-react";
import { Story } from "../types";
import { getFilterStyle } from "../utils";

interface StoryViewProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
  onStoryLiked?: (userId: string) => void;
  onStoryCommented?: (userId: string, commentText: string) => void;
}

export default function StoryView({
  stories,
  initialIndex,
  onClose,
  onStoryViewed,
  onStoryLiked,
  onStoryCommented
}: StoryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [localNotification, setLocalNotification] = useState<string | null>(null);

  const activeStory = stories[currentIndex];
  const activeStoryId = activeStory?.id;

  // Use a ref for the callback to prevent reference-change trigger loops
  const onStoryViewedRef = useRef(onStoryViewed);
  useEffect(() => {
    onStoryViewedRef.current = onStoryViewed;
  }, [onStoryViewed]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (localNotification) {
      const timer = setTimeout(() => setLocalNotification(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [localNotification]);

  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
    if (onStoryViewedRef.current && activeStoryId) {
      onStoryViewedRef.current(activeStoryId);
    }
  }, [currentIndex, activeStoryId]);

  // Story autoplay logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // 2% per 100ms -> 5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const text = replyText.trim();
    setReplyText("");
    
    // Bubble up comment reply to trigger DM update & streak points
    if (onStoryCommented && activeStory) {
      onStoryCommented(activeStory.userId, text);
    }
    setLocalNotification(`🔒 Comment secure-sent to ${activeStory.username}!`);
  };

  if (!activeStory) return null;

  const appliedStyle = getFilterStyle(activeStory.filter);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-md">
      {/* Container holding the story */}
      <div className="relative w-full max-w-lg aspect-[9/16] bg-zinc-950 md:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl border border-zinc-900">
        
        {/* Top Progress Bars */}
        <div className="absolute top-4 left-0 right-0 z-20 px-3 flex gap-1">
          {stories.map((s, index) => (
            <div key={s.id} className="h-1 flex-1 bg-zinc-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
                style={{
                  width:
                    index < currentIndex
                      ? "100%"
                      : index > currentIndex
                      ? "0%"
                      : `${progress}%`
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-8 left-0 right-0 z-20 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeStory.userAvatar}
              alt={activeStory.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm drop-shadow">
                  {activeStory.username}
                </span>
                {activeStory.hasActiveStreak && (
                  <span className="flex items-center gap-0.5 bg-orange-500/90 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
                    <Flame className="w-3 h-3 fill-white" />
                    {activeStory.streakDays}
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-300 drop-shadow">
                {activeStory.timestamp} • Filter: <span className="capitalize text-cyan-400">{activeStory.filter}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Navigation Zones (Absolute Touch Target) */}
        <div className="absolute inset-x-0 top-24 bottom-24 z-10 flex">
          <div onClick={handlePrev} className="w-1/3 cursor-pointer" />
          <div onClick={handleNext} className="w-2/3 cursor-pointer" />
        </div>

        {/* Side Controls for desktop */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors ${
              currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <button
            onClick={handleNext}
            disabled={currentIndex === stories.length - 1}
            className={`p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors ${
              currentIndex === stories.length - 1 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Story Image with CSS filters applied in real-time */}
        <div className="w-full h-full flex items-center justify-center bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeStory.id}
              src={activeStory.imageUrl}
              alt="Story Content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-300 ${appliedStyle}`}
            />
          </AnimatePresence>
        </div>

        {/* Floating Notification */}
        <AnimatePresence>
          {localNotification && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute bottom-24 left-4 right-4 z-30 bg-cyan-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 text-center flex items-center justify-center gap-1.5"
            >
              <span>{localNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story Footer with Interactive Replies */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-12 flex items-center gap-3">
          <form onSubmit={handleSendReply} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder={`Send encrypted reply to ${activeStory.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-cyan-400 focus:outline-none rounded-full px-4 py-2 text-white placeholder-white/60 text-sm backdrop-blur-sm transition-all"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={() => {
              const nextLiked = !isLiked;
              setIsLiked(nextLiked);
              if (nextLiked) {
                if (onStoryLiked && activeStory) {
                  onStoryLiked(activeStory.userId);
                }
                setLocalNotification("Story Hologram Liked! ❤️");
              } else {
                setLocalNotification("Story Liked Removed");
              }
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white backdrop-blur-sm transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                isLiked ? "fill-pink-500 text-pink-500 scale-125 animate-bounce" : ""
              }`}
            />
          </button>
        </div>

      </div>
    </div>
  );
}
