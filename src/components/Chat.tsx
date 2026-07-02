/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Lock,
  Unlock,
  Key,
  Shield,
  Eye,
  EyeOff,
  Flame,
  AlertTriangle,
  Terminal,
  Activity,
  ChevronLeft,
  Search,
  MessageCircle,
  Hash,
  Check,
  CheckCheck
} from "lucide-react";
import { Friend, Message } from "../types";
import { encryptMessage, decryptMessage } from "../data";

interface ChatProps {
  friends: Friend[];
  messages: Message[];
  currentUserId: string;
  onSendMessage: (receiverId: string, text: string, ciphertext: string) => void;
  onUpdateStreak: (friendId: string) => void;
  initialActiveFriendId?: string | null;
}

export default function Chat({
  friends,
  messages,
  currentUserId,
  onSendMessage,
  onUpdateStreak,
  initialActiveFriendId = null
}: ChatProps) {
  const [activeFriendId, setActiveFriendId] = useState<string | null>(initialActiveFriendId);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [showCipherMode, setShowCipherMode] = useState(false);
  const [encryptionLog, setEncryptionLog] = useState<string[]>([]);
  const [isEncryptingAnimation, setIsEncryptingAnimation] = useState(false);
  const [animatingMessageText, setAnimatingMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialActiveFriendId) {
      setActiveFriendId(initialActiveFriendId);
    }
  }, [initialActiveFriendId]);

  const activeFriend = friends.find((f) => f.id === activeFriendId);

  // Filter messages for active chat
  const activeChatMessages = messages.filter(
    (m) =>
      (m.senderId === currentUserId && m.receiverId === activeFriendId) ||
      (m.senderId === activeFriendId && m.receiverId === currentUserId)
  );

  // Get last message helper for each friend
  const getLastMessage = (friendId: string) => {
    const friendMsgs = messages.filter(
      (m) =>
        (m.senderId === currentUserId && m.receiverId === friendId) ||
        (m.senderId === friendId && m.receiverId === currentUserId)
    );
    if (friendMsgs.length === 0) return null;
    return friendMsgs[friendMsgs.length - 1];
  };

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeFriendId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeFriend) return;

    const originalText = inputText;
    setInputText("");
    setIsEncryptingAnimation(true);
    setAnimatingMessageText(originalText);

    // 1. Simulate logging encryption protocol steps
    setEncryptionLog([
      `Initializing E2E Handshake with ${activeFriend.username}...`,
      `Pulling recipient Public Key: ${activeFriend.publicKey}`,
      `Salting and hashing plaintext buffer...`,
      `XOR Matrix conversion: shifting bits by ${activeFriend.publicKey.length % 26} slots`,
      `Packing secure byte block: HALO_E2EE cipher created.`
    ]);

    // 2. Play beautiful encryption animation steps
    setTimeout(() => {
      const encrypted = encryptMessage(originalText, activeFriend.publicKey);
      onSendMessage(activeFriend.id, originalText, encrypted.ciphertext);
      
      // Update the active streak if it wasn't active
      if (!activeFriend.streakActive) {
        onUpdateStreak(activeFriend.id);
        setEncryptionLog(prev => [...prev, `🔥 STREAK ENERGETICALLY CHARGED! Streak updated for today.`]);
      }

      setIsEncryptingAnimation(false);
      setAnimatingMessageText("");
    }, 1500);
  };

  // Filter friends list based on search query
  const filteredFriends = friends.filter(
    (friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto h-[calc(100vh-140px)] bg-zinc-950/80 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col">
      <AnimatePresence mode="wait">
        {!activeFriendId ? (
          /* INBOX VIEW - LIST OF FRIENDS */
          <motion.div
            key="inbox"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <h2 className="font-mono text-base font-black uppercase tracking-wider text-white">
                  Direct Waves
                </h2>
              </div>
              <div className="bg-cyan-950/25 border border-cyan-500/25 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] text-cyan-300 font-bold font-mono">E2EE NETWORK</span>
              </div>
            </div>

            {/* Stories/Active nodes horizontal quick bar */}
            <div className="p-3 bg-zinc-900/30 border-b border-zinc-900 flex gap-3 overflow-x-auto scrollbar-none items-center">
              <div className="flex-shrink-0 text-center mr-1">
                <div className="w-11 h-11 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 text-xs font-bold font-mono bg-zinc-950">
                  P2P
                </div>
                <span className="text-[9px] text-zinc-500 block mt-1 font-mono">Active</span>
              </div>
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setActiveFriendId(friend.id)}
                  className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.username}
                      className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400 p-[1px] bg-zinc-950 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-0.5 shadow-lg border border-zinc-900 animate-pulse">
                      <Flame className="w-2.5 h-2.5 fill-white" />
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 group-hover:text-cyan-400 transition-colors mt-1 font-medium truncate max-w-[55px]">
                    @{friend.username}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="p-3 bg-zinc-900/10 border-b border-zinc-900">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search secure connection nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Friend List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {filteredFriends.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-zinc-700" />
                  <p className="text-xs font-mono">No connected nodes match your query</p>
                </div>
              ) : (
                filteredFriends.map((friend) => {
                  const lastMsg = getLastMessage(friend.id);
                  return (
                    <button
                      key={friend.id}
                      onClick={() => setActiveFriendId(friend.id)}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/75 border border-zinc-850/80 hover:border-zinc-800 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <img
                            src={friend.avatar}
                            alt={friend.username}
                            className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800 group-hover:border-cyan-400/80 transition-all"
                          />
                          <div className="absolute -bottom-1 -right-1 flex items-center justify-center bg-orange-500 text-white rounded-full p-0.5 shadow-md border border-zinc-950">
                            <Flame className="w-3 h-3 fill-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between">
                            <h4 className="text-xs font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
                              {friend.username}
                            </h4>
                          </div>
                          <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">
                            {friend.fullName}
                          </p>
                          <p className="text-[10px] text-zinc-500 truncate mt-1 italic flex items-center gap-1">
                            <Unlock className="w-2.5 h-2.5 text-zinc-600 inline" />
                            {lastMsg ? lastMsg.text : "Double encrypted sync established."}
                          </p>
                        </div>
                      </div>

                      {/* Streak info right aligned */}
                      <div className="text-right ml-3 flex-shrink-0">
                        <span className="inline-flex items-center gap-0.5 font-extrabold text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          🔥 {friend.streakDays}
                        </span>
                        <p className="text-[9px] text-zinc-500 mt-1 font-mono">
                          {friend.streakActive ? "active" : `${friend.hoursRemaining}h remaining`}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          /* CHAT ROOM VIEW */
          <motion.div
            key="chat-room"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setActiveFriendId(null);
                    setSearchQuery("");
                  }}
                  className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="Back to messages"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeFriend?.avatar}
                    alt={activeFriend?.username}
                    className="w-9 h-9 rounded-full object-cover border border-cyan-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-zinc-100 text-xs">@{activeFriend?.username}</h3>
                      <span className="flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[8px] px-1.5 py-0.2 rounded-full font-bold">
                        <Lock className="w-2 h-2" /> SECURE
                      </span>
                    </div>
                    <p className="text-[8px] text-zinc-500 font-mono flex items-center gap-1">
                      <Key className="w-2 h-2 text-cyan-500" /> ECDH: {activeFriend?.publicKey}
                    </p>
                  </div>
                </div>
              </div>

              {/* Encryption options */}
              <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800/80">
                <span className="text-[8px] text-zinc-400 font-mono tracking-tighter hidden sm:inline">RAW CIPHERS:</span>
                <button
                  onClick={() => setShowCipherMode(!showCipherMode)}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                    showCipherMode ? "bg-cyan-500" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      showCipherMode ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <div className="p-0.5 rounded text-zinc-400">
                  {showCipherMode ? <EyeOff className="w-3 h-3 text-cyan-400" /> : <Eye className="w-3 h-3" />}
                </div>
              </div>
            </div>

            {/* Messages logs */}
            <div className="flex-1 overflow-y-auto space-y-3.5 p-3.5 bg-zinc-950/20 scrollbar-thin flex flex-col">
              {activeChatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-3 bg-zinc-900 border border-zinc-855 rounded-full mb-3 text-cyan-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-100">Zero decrypted waves found</h4>
                  <p className="text-[10px] text-zinc-500 max-w-[220px] mt-1 leading-relaxed">
                    Symmetric ECDH pipeline is ready. Type a wave message to initiate handshake.
                  </p>
                </div>
              ) : (
                activeChatMessages.map((msg) => {
                  const isOwn = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${isOwn ? "self-end items-end" : "self-start items-start"}`}
                    >
                      {/* Bubble content */}
                      <div
                        className={`p-3 rounded-2xl border text-xs leading-relaxed transition-all shadow-md ${
                          isOwn
                            ? "bg-cyan-950/25 border-cyan-500/35 text-cyan-100 rounded-br-none"
                            : "bg-zinc-900/80 border-zinc-800 text-zinc-100 rounded-bl-none"
                        }`}
                      >
                        {showCipherMode ? (
                          <div className="font-mono text-[9px] break-all text-purple-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 flex-shrink-0" />
                            {msg.ciphertext}
                          </div>
                        ) : (
                          <div>{msg.text}</div>
                        )}
                      </div>

                      {/* Decryption Helper Badge */}
                      <span className="text-[8px] text-zinc-500 mt-1 font-mono flex items-center gap-1.5 px-1">
                        {!showCipherMode && <Unlock className="w-2 h-2 text-emerald-500" />}
                        <span>{msg.timestamp}</span>
                        {isOwn && (
                          <span className="flex items-center">
                            {msg.seen ? (
                              <CheckCheck className="w-3 h-3 text-cyan-400 stroke-[2.5]" title="Opened / Seen" />
                            ) : (
                              <Check className="w-3 h-3 text-zinc-600 stroke-[2.5]" title="Sent" />
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Encryption pipeline animation */}
              {isEncryptingAnimation && (
                <div className="self-end items-end max-w-[85%] space-y-1 animate-pulse">
                  <div className="p-3 rounded-2xl bg-pink-950/15 border border-pink-500/30 text-xs text-pink-300 rounded-br-none font-mono">
                    <div className="flex items-center gap-1.5 mb-1.5 text-[9px] text-pink-400 font-semibold border-b border-pink-500/20 pb-1">
                      <Activity className="w-3 h-3 animate-spin" />
                      ECDH PIPELINE SECURING PLAIN TEXT
                    </div>
                    <div className="space-y-0.5 text-[8px] text-zinc-400">
                      {encryptionLog.map((logLine, i) => (
                        <div key={i} className="flex gap-1.5 items-start">
                          <span className="text-cyan-500">▶</span>
                          <span>{logLine}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-zinc-100 font-sans font-medium italic text-[10px]">
                      Enciphering: "{animatingMessageText.substring(0, 18)}..."
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input System */}
            <form onSubmit={handleSend} className="p-3 border-t border-zinc-900 bg-zinc-950 flex gap-2 items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isEncryptingAnimation}
                placeholder={
                  isEncryptingAnimation
                    ? "Locking pipeline packet..."
                    : `Encrypted message to @${activeFriend?.username}...`
                }
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isEncryptingAnimation}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
