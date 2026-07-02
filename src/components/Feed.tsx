/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Flame,
  Plus,
  MapPin,
  Sparkles,
  Share2,
  X,
  Check,
  Copy,
  RefreshCw
} from "lucide-react";
import { Post, Story } from "../types";
import { getFilterStyle } from "../utils";

interface FeedProps {
  posts: Post[];
  stories: Story[];
  friends?: any[];
  savedPostIds?: string[];
  onSavePost?: (postId: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onSelectStory: (index: number) => void;
  onNavigateToTab: (tab: string, isStory?: boolean) => void;
  onShareToFriend?: (friendId: string, postId: string) => void;
  currentUser?: any;
  onRefresh?: () => Promise<void>;
}

export default function Feed({
  posts,
  stories,
  friends = [],
  savedPostIds = [],
  onSavePost,
  onLikePost,
  onAddComment,
  onSelectStory,
  onNavigateToTab,
  onShareToFriend,
  currentUser,
  onRefresh
}: FeedProps) {
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [lastTap, setLastTap] = useState<{ id: string; time: number } | null>(null);
  const [floatingHeartPostId, setFloatingHeartPostId] = useState<string | null>(null);

  // Pull-to-refresh states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    setPullDistance(80);
    try {
      await onRefresh();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } catch (e) {
      console.error("Refresh failed:", e);
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };

  // States for comments modal, copy, and DM sharing
  const [selectedPostIdForComments, setSelectedPostIdForComments] = useState<string | null>(null);
  const [modalCommentText, setModalCommentText] = useState("");
  const [sharingPostId, setSharingPostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [sharedFriendIds, setSharedFriendIds] = useState<Record<string, boolean>>({});

  // Handle double-tap to like on mobile/desktop
  const handleImageClick = (postId: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap && lastTap.id === postId && now - lastTap.time < DOUBLE_TAP_DELAY) {
      // Double tap triggered
      onLikePost(postId);
      // Trigger big heart float animation
      setFloatingHeartPostId(postId);
      setTimeout(() => {
        setFloatingHeartPostId(null);
      }, 800);
    } else {
      setLastTap({ id: postId, time: now });
    }
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  // Filter out my stories and friends' stories
  const myStories = stories.filter(s => s.userId === "me" || (currentUser && s.userId === currentUser.id));
  const friendsStories = stories.filter(s => s.userId !== "me" && (!currentUser || s.userId !== currentUser.id));
  const hasMyStories = myStories.length > 0;

  const handleMyStoryClick = () => {
    if (hasMyStories) {
      const globalIndex = stories.findIndex(s => s.userId === "me" || (currentUser && s.userId === currentUser.id));
      if (globalIndex !== -1) {
        onSelectStory(globalIndex);
      }
    } else {
      onNavigateToTab("create", true);
    }
  };

  return (
    <div className="relative overflow-visible max-w-xl mx-auto">
      
      {/* Pull-to-refresh ambient background indicator */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ height: 120 }}>
        <motion.div
          style={{
            y: isRefreshing ? 15 : Math.min(pullDistance * 0.4, 40),
            opacity: isRefreshing ? 1 : Math.min(pullDistance / 80, 1),
          }}
          className="w-full flex flex-col items-center justify-center p-3 text-center"
        >
          {/* Neon spinning ring or icon */}
          <div className="relative flex items-center justify-center mb-1.5">
            {showSuccess ? (
              <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 rounded-full p-2 animate-bounce">
                <Check className="w-4 h-4" />
              </div>
            ) : isRefreshing ? (
              <div className="relative w-8 h-8 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-pulse pointer-events-none" />
              </div>
            ) : (
              <div className="relative w-8 h-8 flex items-center justify-center">
                <RefreshCw 
                  className="w-4 h-4 text-zinc-500 transition-transform" 
                  style={{ transform: `rotate(${pullDistance * 4.5}deg)` }} 
                />
                <div 
                  className="absolute inset-0 rounded-full border border-dashed border-zinc-700 opacity-60 pointer-events-none" 
                  style={{ transform: `scale(${Math.min(0.5 + pullDistance / 160, 1)})` }}
                />
              </div>
            )}
          </div>

          {/* Status Text with monospaced futuristic font */}
          <span className="text-[10px] font-mono tracking-widest font-bold uppercase transition-all">
            {showSuccess ? (
              <span className="text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.3)] font-mono">SECURE SYNC COMPLETE!</span>
            ) : isRefreshing ? (
              <span className="text-cyan-400 animate-pulse drop-shadow-[0_0_4px_rgba(6,182,212,0.3)] font-mono">DOWNLINKING SECURE STREAM...</span>
            ) : pullDistance >= 80 ? (
              <span className="text-pink-500 drop-shadow-[0_0_4px_rgba(236,72,153,0.3)] font-mono">RELEASE TO SYNCHRONIZE</span>
            ) : (
              <span className="text-zinc-500 font-mono">PULL TO LINK HOLONET ({Math.min(Math.round(pullDistance / 80 * 100), 100)}%)</span>
            )}
          </span>
          
          {/* Small sub-label */}
          {!showSuccess && (
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">
              {isRefreshing ? "CALIBRATING QUANTUM NODES" : "E2E CHANNELS DECRYPTED"}
            </span>
          )}
        </motion.div>
      </div>

      {/* Draggable Feed Content */}
      <motion.div
        drag={isAtTop && !isRefreshing ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDrag={(e, info) => {
          if (info.offset.y > 0) {
            setPullDistance(info.offset.y);
          }
        }}
        onDragEnd={(e, info) => {
          if (info.offset.y > 80) {
            triggerRefresh();
          } else {
            setPullDistance(0);
          }
        }}
        animate={{ y: isRefreshing ? 90 : Math.min(pullDistance * 0.5, 90) }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="space-y-6"
      >
      
      {/* 1. STORIES CAROUSEL */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 flex gap-4 overflow-x-auto scrollbar-none items-center shadow-lg">
        
        {/* User's own story creation anchor */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
          <div className="relative">
            <div 
              onClick={handleMyStoryClick}
              className={`w-[60px] h-[60px] rounded-full p-[3px] flex items-center justify-center transition-all group-hover:scale-105 cursor-pointer ${
                hasMyStories
                  ? "bg-gradient-to-tr from-cyan-400 via-pink-500 to-orange-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  : "bg-zinc-800 border border-zinc-700"
              }`}
            >
              <div className="w-full h-full rounded-full bg-zinc-950 p-[2px]">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Your Story"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-cyan-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Plus icon overlay */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToTab("create", true);
              }}
              className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5 border-2 border-zinc-950 hover:bg-cyan-400 hover:scale-110 transition-all cursor-pointer shadow-md z-10"
            >
              <Plus className="w-3 h-3 text-black font-extrabold" />
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-semibold">Your Story</span>
        </div>

        {/* Friends Stories */}
        {friendsStories.map((story) => {
          const globalIndex = stories.findIndex((s) => s.id === story.id);
          return (
            <div
              key={story.id}
              onClick={() => onSelectStory(globalIndex)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative">
                {/* Glowing Halo Gradient Border */}
                <div
                  className={`w-[60px] h-[60px] rounded-full p-[3px] flex items-center justify-center transition-all group-hover:scale-105 ${
                    story.viewed
                      ? "bg-zinc-800"
                      : "bg-gradient-to-tr from-cyan-400 via-pink-500 to-orange-500"
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-zinc-950 p-[2px]">
                    <img
                      src={story.userAvatar}
                      alt={story.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Halo Streak Overlay Badge */}
                {story.hasActiveStreak && (
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center bg-orange-500 text-white rounded-full px-1 py-0.5 shadow-lg border border-zinc-950 font-bold text-[8px] animate-pulse">
                    <Flame className="w-2.5 h-2.5 fill-white" />
                    {story.streakDays}
                  </div>
                )}
              </div>
              
              <span className="text-[10px] text-zinc-400 font-semibold max-w-[55px] truncate text-center">
                {story.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* 2. MAIN POSTS LIST */}
      <div className="space-y-6">
        {posts.map((post) => {
          const appliedFilterClass = getFilterStyle(post.filter);
          const isOwn = post.user.id === "me";

          return (
            <div
              key={post.id}
              className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden"
            >
              
              {/* Post Header */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user.avatar}
                    alt={post.user.username}
                    className="w-9 h-9 rounded-full object-cover border border-cyan-500/20"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                      {post.user.username}
                      {/* Sub-badge indicating customized filter if applicable */}
                      {post.filter !== "normal" && (
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] px-1.5 py-0.2 rounded font-semibold capitalize">
                          {post.filter}
                        </span>
                      )}
                    </h3>
                    {post.location && (
                      <span className="text-[9px] text-zinc-500 flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {post.location}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 font-medium font-mono">
                  {post.timestamp}
                </span>
              </div>

              {/* Post Image with CSS filters & Double Tap To Like */}
              <div
                onClick={() => handleImageClick(post.id)}
                className="relative aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer select-none group"
              >
                <img
                  src={post.imageUrl}
                  alt="Post Content"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.01] ${appliedFilterClass}`}
                />

                {/* Cyberpunk grid overlay for style matching Halogram */}
                <div className="absolute inset-0 bg-zinc-950/10 mix-blend-color-dodge opacity-30 pointer-events-none" />

                {/* Floating Heart Popup Animation */}
                <AnimatePresence>
                  {floatingHeartPostId === post.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                    >
                      <Heart className="w-20 h-20 fill-pink-500 text-pink-500 drop-shadow-lg" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Guide overlay on hover */}
                <div className="absolute bottom-2 left-2 bg-zinc-950/85 backdrop-blur-sm rounded px-2 py-1 text-[9px] text-zinc-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 border border-zinc-800">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Double-tap to express like
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3.5 flex items-center justify-between border-b border-zinc-800/60">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className="p-1 hover:text-pink-500 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-5.5 h-5.5 transition-all ${
                        post.hasLiked ? "fill-pink-500 text-pink-500 scale-110" : "text-zinc-300"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setSelectedPostIdForComments(post.id)}
                    className="p-1 hover:text-cyan-400 transition-colors text-zinc-300 cursor-pointer"
                  >
                    <MessageCircle className="w-5.5 h-5.5" />
                  </button>

                  <button
                    onClick={() => setSharingPostId(post.id)}
                    className="p-1 hover:text-cyan-400 transition-colors text-zinc-300 cursor-pointer"
                  >
                    <Share2 className="w-5.5 h-5.5" />
                  </button>
                </div>

                <button
                  onClick={() => onSavePost?.(post.id)}
                  className="p-1 hover:text-cyan-400 transition-colors text-zinc-300 cursor-pointer"
                >
                  <Bookmark
                    className={`w-5.5 h-5.5 transition-all ${
                      savedPostIds.includes(post.id) ? "fill-cyan-400 text-cyan-400" : "text-zinc-300"
                    }`}
                  />
                </button>
              </div>

              {/* Likes & Caption Info */}
              <div className="p-3.5 pt-2.5 pb-2.5 space-y-1.5 text-xs">
                <p className="font-bold text-zinc-100 flex items-center gap-1">
                  <span>{post.likes.toLocaleString()} likes</span>
                </p>

                <p className="text-zinc-300 leading-relaxed">
                  <span className="font-bold text-zinc-100 mr-1.5 cursor-pointer">
                    {post.user.username}
                  </span>
                  {post.caption}
                </p>

                {/* Comments Link Trigger */}
                {post.comments.length > 0 && (
                  <button
                    onClick={() => setSelectedPostIdForComments(post.id)}
                    className="text-cyan-400/80 hover:text-cyan-400 text-xs font-semibold transition-colors block text-left mt-1 cursor-pointer"
                  >
                    View all {post.comments.length} comments
                  </button>
                )}

                {/* Comments List Preview */}
                {post.comments.length > 0 && (
                  <div className="mt-1.5 space-y-1 pt-1.5 border-t border-zinc-800/40">
                    {post.comments.slice(-2).map((comment) => (
                      <div key={comment.id} className="text-zinc-400 text-xs">
                        <span className="font-bold text-zinc-100 mr-1.5 cursor-pointer text-[11px]">
                          {comment.username}
                        </span>
                        {comment.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Comment Input */}
              <form
                onSubmit={(e) => handleCommentSubmit(post.id, e)}
                className="flex items-center border-t border-zinc-800/60 p-2 bg-zinc-950/30"
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  className="flex-1 bg-transparent px-2 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!commentInputs[post.id]?.trim()}
                  className="text-xs font-bold text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-cyan-300 px-3 py-1.5 cursor-pointer"
                >
                  Post
                </button>
              </form>

            </div>
          );
        })}
      </div>
      </motion.div>

      {/* COMMENTS INTERACTIVE MODAL */}
      <AnimatePresence>
        {selectedPostIdForComments && (() => {
          const commentPost = posts.find((p) => p.id === selectedPostIdForComments);
          if (!commentPost) return null;
          return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
              >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-sm text-zinc-100">Quantum Thread Comments</h3>
                  </div>
                  <button
                    onClick={() => setSelectedPostIdForComments(null)}
                    className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Preview */}
                <div className="p-4 bg-zinc-950/40 border-b border-zinc-800 flex gap-3 items-start">
                  <img
                    src={commentPost.user.avatar}
                    alt={commentPost.user.username}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/20"
                  />
                  <div>
                    <span className="font-bold text-xs text-white mr-1.5">@{commentPost.user.username}</span>
                    <p className="text-xs text-zinc-300 leading-relaxed inline">{commentPost.caption}</p>
                    <span className="block text-[9px] text-zinc-500 mt-1 font-mono">{commentPost.timestamp}</span>
                  </div>
                </div>

                {/* Comments list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {commentPost.comments.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 text-xs">
                      No cryptographic comments recorded yet. Start the thread!
                    </div>
                  ) : (
                    commentPost.comments.map((c) => (
                      <div key={c.id} className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400 uppercase">
                          {c.username.slice(0, 2)}
                        </div>
                        <div className="flex-1 bg-zinc-950/30 p-2.5 rounded-xl border border-zinc-800">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-xs text-zinc-200">@{c.username}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">{c.timestamp || "Just now"}</span>
                          </div>
                          <p className="text-xs text-zinc-300">{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Form comment */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!modalCommentText.trim()) return;
                    onAddComment(commentPost.id, modalCommentText.trim());
                    setModalCommentText("");
                  }}
                  className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type encrypted comment..."
                    value={modalCommentText}
                    onChange={(e) => setModalCommentText(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-850 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!modalCommentText.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Comment
                  </button>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* SHARING INTERACTIVE MODAL */}
      <AnimatePresence>
        {sharingPostId && (() => {
          const sharingPost = posts.find((p) => p.id === sharingPostId);
          if (!sharingPost) return null;
          return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-pink-500 animate-pulse" />
                    <h3 className="font-bold text-sm text-zinc-100">Quantum Beam Share</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSharingPostId(null);
                      setSharedFriendIds({});
                    }}
                    className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content preview */}
                <div className="p-3 bg-zinc-950/60 flex gap-3 items-center border-b border-zinc-850">
                  <img
                    src={sharingPost.imageUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest font-mono">
                      BEAM CARD PREVIEW
                    </span>
                    <p className="text-xs text-zinc-300 truncate mt-0.5">@{sharingPost.user.username}: {sharingPost.caption}</p>
                  </div>
                </div>

                {/* Friends list */}
                <div className="p-4 space-y-3 max-h-[250px] overflow-y-auto">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                    BEAM DIRECTLY TO FRIENDS
                  </span>
                  {friends && friends.length > 0 ? (
                    <div className="space-y-2">
                      {friends.map((friend) => {
                        const isShared = sharedFriendIds[friend.id];
                        return (
                          <div key={friend.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/40 border border-zinc-850">
                            <div className="flex items-center gap-2.5">
                              <img src={friend.avatar} alt={friend.username} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <span className="text-xs font-bold text-zinc-200">@{friend.username}</span>
                                <span className="block text-[9px] text-zinc-500">{friend.fullName}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (isShared) return;
                                if (onShareToFriend) {
                                  onShareToFriend(friend.id, sharingPost.id);
                                }
                                setSharedFriendIds((prev) => ({ ...prev, [friend.id]: true }));
                              }}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                isShared
                                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default"
                                  : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300"
                              }`}
                            >
                              {isShared ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Beamed
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 text-pink-500" />
                                  Beam DM
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-500 text-center py-4">No connection nodes online.</div>
                  )}
                </div>

                {/* Copy / Broadcast */}
                <div className="p-4 bg-zinc-950 border-t border-zinc-850 space-y-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://halogram.sync/posts/${sharingPost.id}`);
                      setCopiedPostId(sharingPost.id);
                      setTimeout(() => setCopiedPostId(null), 2000);
                    }}
                    className="w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 py-2 rounded-xl text-xs font-bold text-zinc-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedPostId === sharingPost.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Encrypted Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        Copy Quantum Hologram Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setCopiedPostId("broadcast");
                      setTimeout(() => setCopiedPostId(null), 2000);
                    }}
                    className="w-full bg-pink-500 hover:bg-pink-400 py-2 rounded-xl text-xs font-extrabold text-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedPostId === "broadcast" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        Broadcast Broadcasted!
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Broadcast to HoloNet
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
