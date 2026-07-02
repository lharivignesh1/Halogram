/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Grid, 
  Bookmark, 
  Award, 
  Flame, 
  Settings, 
  Check, 
  Edit2, 
  Image as ImageIcon,
  X,
  Lock,
  Bell,
  Shield,
  HelpCircle,
  Users,
  Palette,
  UserX,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  MapPin,
  Sparkles,
  Send,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { User, Post } from "../types";
import { getFilterStyle } from "../utils";

interface ProfileProps {
  user: User;
  posts: Post[];
  savedPostIds?: string[];
  theme?: string;
  setTheme?: (theme: string) => void;
  accentColor?: string;
  onEquipAccent?: (color: string) => void;
  onUpdateBio: (fullName: string, bio: string, avatar: string) => void;
  friends?: any[];
  onLikePost?: (postId: string) => void;
  onAddComment?: (postId: string, commentText: string) => void;
  onSavePost?: (postId: string) => void;
}

export default function Profile({ 
  user, 
  posts, 
  savedPostIds = [],
  theme = "dark",
  setTheme,
  accentColor = "cyan",
  onEquipAccent,
  onUpdateBio,
  friends = [],
  onLikePost,
  onAddComment,
  onSavePost
}: ProfileProps) {
  const [activeSubTab, setActiveSubTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  
  // Settings Overlay State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingTab, setActiveSettingTab] = useState<string | null>(null);

  // Interactive settings values
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [closeFriendIds, setCloseFriendIds] = useState<Record<string, boolean>>({});
  const [blockedUserIds, setBlockedUserIds] = useState<Record<string, boolean>>({});
  const [notificationSettings, setNotificationSettings] = useState({
    dms: true,
    stories: true,
    streaks: true
  });
  const [reportText, setReportText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Verification onboarding settings
  const [requireEmail, setRequireEmail] = useState(() => {
    return localStorage.getItem("halo_verification_require_email") !== "false";
  });
  const [requirePhone, setRequirePhone] = useState(() => {
    return localStorage.getItem("halo_verification_require_phone") !== "false";
  });
  const [requireUsername, setRequireUsername] = useState(() => {
    return localStorage.getItem("halo_verification_require_username") !== "false";
  });
  const [enableOtp, setEnableOtp] = useState(() => {
    return localStorage.getItem("halo_verification_enable_otp") !== "false";
  });
  const [smsOtp, setSmsOtp] = useState(() => {
    return localStorage.getItem("halo_verification_sms_otp") || "7777";
  });
  const [emailOtp, setEmailOtp] = useState(() => {
    return localStorage.getItem("halo_verification_email_otp") || "8888";
  });

  const updateVerificationSetting = (key: string, value: any, setter: (val: any) => void) => {
    localStorage.setItem(key, String(value));
    setter(value);
  };
  
  // Local edit states
  const [editFullName, setEditFullName] = useState(user.fullName);
  const [editBio, setEditBio] = useState(user.bio || "");
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  // Post Detail Modal States
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null);
  const [detailCommentText, setDetailCommentText] = useState("");

  // Filter posts created by current user
  const myPosts = posts.filter((p) => p.user.id === "me");
  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  // Synchronize modal state with updated posts array
  const currentDetailedPost = selectedPostForDetail 
    ? posts.find(p => p.id === selectedPostForDetail.id) || selectedPostForDetail
    : null;

  const handleSave = () => {
    onUpdateBio(editFullName, editBio, editAvatar);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-xl space-y-6">
      
      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 pb-6 border-b border-zinc-800">
        
        {/* Avatar block with customizable image option */}
        <div className="relative group">
          <img
            src={isEditing ? editAvatar : user.avatar}
            alt={user.username}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-cyan-400 shadow-lg"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-[10px] text-cyan-400 cursor-pointer font-bold transition-opacity p-2 text-center">
              <ImageIcon className="w-4 h-4 mb-1" />
              <span>Paste URL below</span>
            </div>
          )}
        </div>

        {/* Info & Stats */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">@{user.username}</h2>
            
            <div className="flex items-center justify-center md:justify-start gap-2">
              {user.badge && (
                <span className="bg-pink-500/10 text-pink-400 border border-pink-500/35 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {user.badge}
                </span>
              )}
              
              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/35 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                {user.streakCount} Streak pts
              </span>
            </div>

            {/* Editing actions */}
            <div className="mt-2 md:mt-0 md:ml-auto flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                    Edit Bio
                  </button>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Open Settings"
                    title="Hologram Settings"
                  >
                    <Settings className="w-4 h-4 text-pink-500 hover:rotate-45 transition-transform duration-350" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats count Row */}
          <div className="flex items-center justify-center md:justify-start gap-8 text-xs font-semibold text-zinc-300">
            <div>
              <span className="text-white font-bold block text-sm md:inline md:mr-1">{myPosts.length}</span>
              posts
            </div>
            <div>
              <span className="text-white font-bold block text-sm md:inline md:mr-1">{user.followersCount}</span>
              followers
            </div>
            <div>
              <span className="text-white font-bold block text-sm md:inline md:mr-1">{user.followingCount}</span>
              following
            </div>
          </div>

          {/* Edit bio inputs or pure display */}
          {isEditing ? (
            <div className="space-y-2.5 max-w-md bg-zinc-950 p-4 rounded-xl border border-zinc-800 animate-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-[10px] uppercase text-cyan-400 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-cyan-400 font-bold mb-1">Interactive Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-cyan-400 font-bold mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">{user.fullName}</h3>
              <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile sub-tabs navigator */}
      <div className="flex border-b border-zinc-800 text-xs font-bold text-zinc-400">
        <button
          onClick={() => setActiveSubTab("posts")}
          className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === "posts"
              ? "border-cyan-400 text-cyan-300 bg-cyan-950/5"
              : "border-transparent hover:text-white"
          }`}
        >
          <Grid className="w-4 h-4" />
          My Posts
        </button>
        <button
          onClick={() => setActiveSubTab("saved")}
          className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === "saved"
              ? "border-cyan-400 text-cyan-300 bg-cyan-950/5"
              : "border-transparent hover:text-white"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Posts
        </button>
        <button
          onClick={() => setActiveSubTab("badges")}
          className={`flex-1 py-3 border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === "badges"
              ? "border-cyan-400 text-cyan-300 bg-cyan-950/5"
              : "border-transparent hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          Earned Badges
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeSubTab === "posts" && (
          <div>
            {myPosts.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto text-zinc-700" />
                <h4 className="font-bold text-white text-sm">No Holograms Posted Yet</h4>
                <p className="text-xs max-w-xs mx-auto text-zinc-500">
                  Head over to the Create tab or HoloLab to customize and publish your first cyberpunk photograph.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 md:gap-4 animate-in fade-in duration-200">
                {myPosts.map((post) => {
                  const appliedStyle = getFilterStyle(post.filter);
                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPostForDetail(post)}
                      className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-cyan-400/50 transition-all group cursor-pointer"
                    >
                      <img
                        src={post.imageUrl}
                        alt="My Post content"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${appliedStyle}`}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-3">
                        <span className="flex items-center gap-1">❤️ {post.likes}</span>
                        <span className="flex items-center gap-1">💬 {post.comments.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSubTab === "saved" && (
          <div>
            {savedPosts.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 space-y-2">
                <Bookmark className="w-12 h-12 mx-auto text-zinc-700" />
                <h4 className="font-bold text-white text-sm">No Saved Posts</h4>
                <p className="text-xs max-w-xs mx-auto text-zinc-500">
                  Save other creators' posts and shader parameters to quickly load them inside your own feed later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 md:gap-4 animate-in fade-in duration-200">
                {savedPosts.map((post) => {
                  const appliedStyle = getFilterStyle(post.filter);
                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPostForDetail(post)}
                      className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-cyan-400/50 transition-all group cursor-pointer"
                    >
                      <img
                        src={post.imageUrl}
                        alt="Saved Post content"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${appliedStyle}`}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-3">
                        <span className="flex items-center gap-1">❤️ {post.likes}</span>
                        <span className="flex items-center gap-1">💬 {post.comments.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSubTab === "badges" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <div className="p-4 bg-zinc-950 rounded-xl border border-pink-500/30 flex items-start gap-3 shadow-lg shadow-pink-500/5">
              <span className="text-3xl p-1 bg-zinc-900 border border-zinc-800 rounded">🌟</span>
              <div>
                <h4 className="text-xs font-bold text-white">Holo Pioneer Badge</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">Joined Halogram during the Quantum Beta phase.</p>
                <p className="text-[9px] text-emerald-400 mt-1 font-semibold">Active Profile Accolade</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-xl border border-orange-500/20 flex items-start gap-3">
              <span className="text-3xl p-1 bg-zinc-900 border border-zinc-800 rounded">🔥</span>
              <div>
                <h4 className="text-xs font-bold text-white">Streak Enthusiast</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">Maintain 3 or more concurrent Halo Streaks with friends.</p>
                <p className="text-[9px] text-orange-400 mt-1 font-semibold">Active Profile Accolade</p>
              </div>
            </div>
          </div>
        )}
      </div>

       {/* INSTAGRAM SETTINGS OVERLAY */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full h-[75vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/20">
              <div className="flex items-center">
                {activeSettingTab !== null && (
                  <button
                    onClick={() => setActiveSettingTab(null)}
                    className="mr-3 p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider"
                    aria-label="Back to settings options"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-pink-500 animate-spin-slow" />
                  <h3 className="font-bold text-sm text-zinc-100">
                    {activeSettingTab 
                      ? `${activeSettingTab.toUpperCase()} PROTOCOLS` 
                      : "Hologram Settings System"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setActiveSettingTab(null);
                }}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex overflow-hidden">
              {activeSettingTab === null ? (
                /* 1. Main Options List */
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-zinc-950/15">
                  {[
                    { id: "verification", label: "Verification Rules", desc: "Configure onboarding requirement parameters & simulated OTP codes", icon: ShieldCheck },
                    { id: "privacy", label: "Account Privacy", desc: "Manage visible holographic profiles and connection rules", icon: Lock },
                    { id: "aesthetics", label: "Aesthetics & Theme", desc: "Equip custom neon visual templates and highlights", icon: Palette },
                    { id: "notifications", label: "Notifications", desc: "Sync direct dm, story, and streak alerts", icon: Bell },
                    { id: "security", label: "Security & E2EE", desc: "Audit symmetric keys and signature protocols", icon: Shield },
                    { id: "friends", label: "Close Friends", desc: "Select eligible nodes for exclusive story waves", icon: Users },
                    { id: "blocked", label: "Blocked Nodes", desc: "Sever connectivity from unwanted nodes", icon: UserX },
                    { id: "help", label: "Help & Diagnostics", desc: "Troubleshoot trace-route pings or glitch logs", icon: HelpCircle }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setActiveSettingTab(option.id)}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/40 hover:bg-zinc-850/40 border border-zinc-850 hover:border-zinc-750 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-pink-500 group-hover:text-cyan-400 transition-colors">
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                              {option.label}
                            </h4>
                            <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{option.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* 2. Detailed Content Pane */
                <div className="flex-1 p-5 overflow-y-auto bg-zinc-950/5 text-left">
                  {activeSettingTab === "verification" && (
                    <div className="space-y-4 animate-in fade-in duration-200 text-left">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Verification & Registration Protocol</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Define onboarding requirements, mandatory verification parameters, and OTP validation keys for newly registering nodes.
                        </p>
                      </div>

                      {/* Requirement Switches */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">ONBOARDING FIELD REQUIREMENTS</span>
                        
                        {/* Require Username */}
                        <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">Require Unique Username</span>
                            <span className="text-[9px] text-zinc-500 leading-none">Forces user to choose an alphanumeric node tag.</span>
                          </div>
                          <button
                            onClick={() => updateVerificationSetting("halo_verification_require_username", !requireUsername, setRequireUsername)}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                              requireUsername ? "bg-cyan-500" : "bg-zinc-700"
                            }`}
                          >
                            <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${requireUsername ? "translate-x-4.5" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* Require Email */}
                        <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">Require Email Address</span>
                            <span className="text-[9px] text-zinc-500 leading-none">Requires entering an email channel for system telemetry.</span>
                          </div>
                          <button
                            onClick={() => updateVerificationSetting("halo_verification_require_email", !requireEmail, setRequireEmail)}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                              requireEmail ? "bg-cyan-500" : "bg-zinc-700"
                            }`}
                          >
                            <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${requireEmail ? "translate-x-4.5" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* Require Phone */}
                        <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">Require Phone Number</span>
                            <span className="text-[9px] text-zinc-500 leading-none">Mandates an active cellular uplink route.</span>
                          </div>
                          <button
                            onClick={() => updateVerificationSetting("halo_verification_require_phone", !requirePhone, setRequirePhone)}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                              requirePhone ? "bg-cyan-500" : "bg-zinc-700"
                            }`}
                          >
                            <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${requirePhone ? "translate-x-4.5" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* Enable OTP Handshake */}
                        <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block text-pink-400">Enable 2-Factor OTP Challenge</span>
                            <span className="text-[9px] text-zinc-500 leading-none">Prompts the user to enter SMS/Email verification keys on registration.</span>
                          </div>
                          <button
                            onClick={() => updateVerificationSetting("halo_verification_enable_otp", !enableOtp, setEnableOtp)}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                              enableOtp ? "bg-pink-500" : "bg-zinc-700"
                            }`}
                          >
                            <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${enableOtp ? "translate-x-4.5" : "translate-x-0"}`} />
                          </button>
                        </div>
                      </div>

                      {/* Custom OTP Values */}
                      {enableOtp && (
                        <div className="space-y-3 pt-2 border-t border-zinc-800">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">CUSTOM SIMULATED OTP PASSKEYS</span>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">Simulated SMS OTP</label>
                              <input
                                type="text"
                                value={smsOtp}
                                onChange={(e) => updateVerificationSetting("halo_verification_sms_otp", e.target.value, setSmsOtp)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono tracking-widest text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">Simulated Email OTP</label>
                              <input
                                type="text"
                                value={emailOtp}
                                onChange={(e) => updateVerificationSetting("halo_verification_email_otp", e.target.value, setEmailOtp)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-pink-300 focus:outline-none focus:border-pink-500 font-mono tracking-widest text-center"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Simulate New Install Action */}
                      <div className="p-4 bg-red-500/5 border border-red-500/25 rounded-xl space-y-2.5 pt-3">
                        <div>
                          <span className="text-xs font-bold text-red-400 block uppercase tracking-wide font-mono">Quantum Simulator Handshake</span>
                          <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
                            Click to simulate a completely new user installation. Wipes current session identity data (without deleting feed history) and immediately displays the custom onboarding & verification handshake flow you configured above.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem("halo_user");
                            localStorage.removeItem("halo_user_registered");
                            localStorage.setItem("halo_is_new_install", "true");
                            window.location.reload();
                          }}
                          className="w-full py-2 bg-red-950/40 hover:bg-red-900/30 border border-red-500/40 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(239,68,68,0.15)] active:scale-98"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Simulate Clean Install (Demo Mode)</span>
                        </button>
                      </div>

                    </div>
                  )}

                  {activeSettingTab === "privacy" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Account Privacy</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Control who can view your holographic parameters and streak coordinates.
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-zinc-200 block">Private Account</span>
                          <span className="text-[9px] text-zinc-500 leading-none">Only verified streak links can access details.</span>
                        </div>
                        <button
                          onClick={() => setIsPrivateAccount(!isPrivateAccount)}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                            isPrivateAccount ? "bg-cyan-500" : "bg-zinc-700"
                          }`}
                        >
                          <div
                            className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${
                              isPrivateAccount ? "translate-x-4.5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">BROADCAST RULES</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed space-y-1">
                          • Mentions: Allowed from everyone.<br />
                          • Direct Messages: Encrypted via 256-bit HaloNet.<br />
                          • Story Replying: Accessible by all active connection nodes.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSettingTab === "aesthetics" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Aesthetics & Theme</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Switch visual matrix templates and equip dynamic custom accent highlighters.
                        </p>
                      </div>

                      {/* Dark/Light Toggler */}
                      <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-zinc-200 block">Visual Interface Theme</span>
                          <span className="text-[9px] text-zinc-500 leading-none">Switch between Sophisticated Dark and Neon Light.</span>
                        </div>
                        <button
                          onClick={() => setTheme?.(theme === "dark" ? "light" : "dark")}
                          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {theme === "dark" ? (
                            <>
                              <Moon className="w-3.5 h-3.5 text-blue-400" />
                              Dark Matrix
                            </>
                          ) : (
                            <>
                              <Sun className="w-3.5 h-3.5 text-yellow-500" />
                              Light Matrix
                            </>
                          )}
                        </button>
                      </div>

                      {/* Color Accent Toggler */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">EQUIP DYNAMIC ACCENT AURA</span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {[
                            { id: "cyan", name: "Cyber Cyan", color: "bg-cyan-500 border-cyan-400" },
                            { id: "pink", name: "Pulse Pink", color: "bg-pink-500 border-pink-400" },
                            { id: "emerald", name: "Neon Emerald", color: "bg-emerald-500 border-emerald-400" },
                            { id: "purple", name: "Plasma Purple", color: "bg-purple-500 border-purple-400" }
                          ].map((acc) => (
                            <button
                              key={acc.id}
                              onClick={() => onEquipAccent?.(acc.id)}
                              className={`p-2 rounded-lg border flex items-center gap-2.5 transition-all cursor-pointer ${
                                accentColor === acc.id
                                  ? "bg-zinc-800 border-cyan-400/80 scale-102 shadow-md shadow-cyan-500/5"
                                  : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30"
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${acc.color}`} />
                              <span className="text-[10px] font-bold text-zinc-300">{acc.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingTab === "notifications" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Notification Channels</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Sync alerts across sub-neural systems for real-time engagement.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: "dms", label: "Direct Messages Alert", desc: "Notify when peer-to-peer secure chat packet is delivered" },
                          { id: "stories", label: "Story Interactions", desc: "Notify when friends like/reply to active stories" },
                          { id: "streaks", label: "Streak Expiration Alerts", desc: "Critical ping 2 hours before Halo Streak decay" }
                        ].map((item) => (
                          <div key={item.id} className="p-2.5 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                            <div className="max-w-[75%]">
                              <span className="text-xs font-bold text-zinc-200 block leading-tight">{item.label}</span>
                              <span className="text-[9px] text-zinc-500 leading-tight">{item.desc}</span>
                            </div>
                            <button
                              onClick={() =>
                                setNotificationSettings((prev: any) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }))
                              }
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                                (notificationSettings as any)[item.id] ? "bg-cyan-500" : "bg-zinc-700"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                                  (notificationSettings as any)[item.id] ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSettingTab === "security" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Cyber Security Engine</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Manage private P2P decryption keys, multi-node certificates, and login guard rails.
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-zinc-200 block">Quantum Signature (2FA)</span>
                          <span className="text-[9px] text-zinc-500 leading-none">Validate identity with dual biometric security tokens.</span>
                        </div>
                        <button
                          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                            twoFactorEnabled ? "bg-cyan-500" : "bg-zinc-700"
                          }`}
                        >
                          <div
                            className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ${
                              twoFactorEnabled ? "translate-x-4.5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-3 bg-zinc-950/40 border border-zinc-855 rounded-xl">
                        <span className="text-[10px] font-bold text-zinc-400 block mb-1">Peer Encryption Protocol</span>
                        <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">
                          E2EE Cypher: AES-256-GCM<br />
                          Key Exchange: Elliptic Curve Diffie-Hellman (ECDH)<br />
                          Fingerprint: 345E-05C9-DD65-49EB-8D90-0BEC-068D-AE80
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSettingTab === "friends" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Close Friends Selection</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Select nodes eligible for exclusive holographic broadcasts.
                        </p>
                      </div>

                      <div className="space-y-2 max-h-[180px] overflow-y-auto">
                        {friends && friends.length > 0 ? (
                          friends.map((friend) => {
                            const isClose = closeFriendIds[friend.id];
                            return (
                              <div key={friend.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/40 border border-zinc-800">
                                <div className="flex items-center gap-2">
                                  <img src={friend.avatar} alt={friend.username} className="w-7 h-7 rounded-full object-cover" />
                                  <span className="text-xs font-bold text-zinc-200">@{friend.username}</span>
                                </div>
                                <button
                                  onClick={() =>
                                    setCloseFriendIds((prev) => ({
                                      ...prev,
                                      [friend.id]: !prev[friend.id]
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                                    isClose
                                      ? "bg-cyan-500 text-black font-extrabold"
                                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-750"
                                  }`}
                                >
                                  {isClose ? "Close Friend" : "Add Close"}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-[10px] text-zinc-500 py-4 text-center">No connections.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSettingTab === "blocked" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Blocked Connection Nodes</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Sever connectivity nodes to prevent direct beams or tracking coordinates.
                        </p>
                      </div>

                      <div className="space-y-2 max-h-[180px] overflow-y-auto">
                        {friends && friends.length > 0 ? (
                          friends.map((friend) => {
                            const isBlocked = blockedUserIds[friend.id];
                            return (
                              <div key={friend.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/40 border border-zinc-800">
                                <div className="flex items-center gap-2">
                                  <img src={friend.avatar} alt={friend.username} className="w-7 h-7 rounded-full object-cover grayscale" />
                                  <span className="text-xs font-bold text-zinc-300">@{friend.username}</span>
                                </div>
                                <button
                                  onClick={() =>
                                    setBlockedUserIds((prev) => ({
                                      ...prev,
                                      [friend.id]: !prev[friend.id]
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                                    isBlocked
                                      ? "bg-red-500 text-white font-extrabold"
                                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-750"
                                  }`}
                                >
                                  {isBlocked ? "Blocked" : "Block Node"}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-[10px] text-zinc-500 py-4 text-center">No connection nodes found.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSettingTab === "help" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide font-mono text-cyan-400">Help & Glitch Diagnostics</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Submit local trace-route pings or troubleshoot core UI synchronization anomalies.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">REPORT A GLITCH</span>
                        <textarea
                          placeholder="Describe synchronization or latency anomalies..."
                          value={reportText}
                          onChange={(e) => setReportText(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none transition-colors h-16 resize-none"
                        />
                        <button
                          onClick={() => {
                            if (!reportText.trim()) return;
                            setReportSubmitted(true);
                            setReportText("");
                            setTimeout(() => setReportSubmitted(false), 3000);
                          }}
                          disabled={!reportText.trim()}
                          className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-45 text-black py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          {reportSubmitted ? "Diagnostics Logged ✓" : "Transmit Diagnostic Packet"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POST DETAIL OVERLAY */}
      {currentDetailedPost && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] md:h-[650px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            {/* Left Column: Image with Filter */}
            <div className="md:w-[55%] bg-black relative flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800">
              <img
                src={currentDetailedPost.imageUrl}
                alt="Post content details"
                referrerPolicy="no-referrer"
                className={`w-full h-full max-h-[40vh] md:max-h-full object-contain ${getFilterStyle(currentDetailedPost.filter)}`}
              />
              {currentDetailedPost.filter !== "normal" && (
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-cyan-400 border border-cyan-500/30 flex items-center gap-1 font-mono uppercase">
                  <Sparkles className="w-3 h-3" />
                  {currentDetailedPost.filter}
                </span>
              )}
            </div>

            {/* Right Column: Interaction details */}
            <div className="flex-1 flex flex-col h-full bg-zinc-950/25">
              {/* Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentDetailedPost.user.avatar}
                    alt={currentDetailedPost.user.username}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">@{currentDetailedPost.user.username}</span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-zinc-600" />
                      {currentDetailedPost.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPostForDetail(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Comments/Caption area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Caption / description */}
                {currentDetailedPost.caption && (
                  <div className="flex items-start gap-2.5 pb-3.5 border-b border-zinc-800/40">
                    <img
                      src={currentDetailedPost.user.avatar}
                      alt={currentDetailedPost.user.username}
                      className="w-7 h-7 rounded-full object-cover border border-zinc-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-200 mr-1.5">@{currentDetailedPost.user.username}</span>
                      <span className="text-xs text-zinc-300 leading-relaxed">{currentDetailedPost.caption}</span>
                      <span className="block text-[9px] text-zinc-600 mt-1">{currentDetailedPost.timestamp}</span>
                    </div>
                  </div>
                )}

                {/* Comment List */}
                <div className="space-y-3.5">
                  {currentDetailedPost.comments.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600 text-[11px]">
                      No holographic telemetry records yet. Be the first to add sync comments!
                    </div>
                  ) : (
                    currentDetailedPost.comments.map((comment: any) => (
                      <div key={comment.id} className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-cyan-400 uppercase">
                          {comment.username.slice(0, 2)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-200 mr-1.5">@{comment.username}</span>
                          <span className="text-xs text-zinc-300">{comment.text}</span>
                          <span className="block text-[9px] text-zinc-600 mt-0.5">{comment.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Interaction Row (Likes, Saves, Stats) */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onLikePost?.(currentDetailedPost.id)}
                      className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-300 hover:text-pink-500 transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-5.5 h-5.5 ${
                          currentDetailedPost.hasLiked ? "fill-pink-500 text-pink-500 scale-110" : ""
                        }`}
                      />
                    </button>
                    <span className="text-xs font-bold text-zinc-300">{currentDetailedPost.likes} likes</span>
                  </div>

                  <button
                    onClick={() => onSavePost?.(currentDetailedPost.id)}
                    className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-300 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <Bookmark
                      className={`w-5.5 h-5.5 ${
                        savedPostIds.includes(currentDetailedPost.id) ? "fill-cyan-400 text-cyan-400" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Comment Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (detailCommentText.trim() && onAddComment) {
                      onAddComment(currentDetailedPost.id, detailCommentText.trim());
                      setDetailCommentText("");
                    }
                  }}
                  className="flex gap-2 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Type synchronized telemetry..."
                    value={detailCommentText}
                    onChange={(e) => setDetailCommentText(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!detailCommentText.trim()}
                    className="px-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
