/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Home,
  MessageSquare,
  PlusSquare,
  Flame,
  User as UserIcon,
  Sparkles,
  Sliders,
  Shield,
  Activity,
  Heart,
  Sun,
  Moon,
  Bell
} from "lucide-react";
import { Post, Story, Friend, Message, User } from "./types";
import {
  CURRENT_USER,
  FRIENDS,
  MOCK_POSTS,
  MOCK_STORIES,
  INITIAL_MESSAGES
} from "./data";
import { ACCENT_CLASSES, AccentColor } from "./accent";

// Components
import Feed from "./components/Feed";
import StoryView from "./components/StoryView";
import CreatePost from "./components/CreatePost";
import Chat from "./components/Chat";
import Streaks from "./components/Streaks";
import HoloLab from "./components/HoloLab";
import Profile from "./components/Profile";
import Onboarding from "./components/Onboarding";
import Notifications from "./components/Notifications";

export default function App() {
  // --- 1. STATE PERSISTENCE ENGINE ---
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    const isNewInstall = localStorage.getItem("halo_is_new_install") === "true";
    const userExists = localStorage.getItem("halo_user") !== null;
    if (isNewInstall) return false;
    return userExists;
  });

  const [verificationSettings] = useState(() => {
    return {
      requireEmail: localStorage.getItem("halo_verification_require_email") !== "false",
      requirePhone: localStorage.getItem("halo_verification_require_phone") !== "false",
      requireUsername: localStorage.getItem("halo_verification_require_username") !== "false",
      enableOtpVerification: localStorage.getItem("halo_verification_enable_otp") !== "false",
      smsOtpCode: localStorage.getItem("halo_verification_sms_otp") || "7777",
      emailOtpCode: localStorage.getItem("halo_verification_email_otp") || "8888"
    };
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem("halo_user");
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem("halo_friends");
    return saved ? JSON.parse(saved) : FRIENDS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("halo_posts");
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem("halo_stories");
    return saved ? JSON.parse(saved) : MOCK_STORIES;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("halo_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeTab, setActiveTab] = useState<string>("feed");
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [createPostIsStory, setCreatePostIsStory] = useState<boolean>(false);
  const [selectedChatFriendId, setSelectedChatFriendId] = useState<string | null>(null);

  // Theme & Reward Accents State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("halo_theme");
    return saved === "light" ? "light" : "dark";
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("halo_saved_post_ids");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("halo_saved_post_ids", JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("halo_accent");
    return (saved as AccentColor) || "cyan";
  });

  // Streak Reward Popup Toast Notification
  const [streakNotification, setStreakNotification] = useState<{
    friendName: string;
    friendUsername: string;
    avatar: string;
    streakDays: number;
    action: string;
    isNewLevel: boolean;
  } | null>(null);

  // Sync back to localStorage & apply body classes
  useEffect(() => {
    localStorage.setItem("halo_theme", theme);
    if (theme === "light") {
      document.body.style.backgroundColor = "#fafafa";
      document.body.style.color = "#18181b";
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.body.style.backgroundColor = "#09090b";
      document.body.style.color = "#f4f4f5";
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("halo_accent", accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem("halo_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("halo_friends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem("halo_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("halo_stories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem("halo_messages", JSON.stringify(messages));
  }, [messages]);

  // --- 2. GLOBAL HANDLERS & OPERATIONS ---

  // Central Streaks Engine: dynamically tracks daily interactions and pops reward toasts
  const handleTriggerStreakInteraction = (friendId: string, actionType: string) => {
    setFriends((prevFriends) => {
      let isNewInteraction = false;
      let newStreakDays = 0;

      const updated = prevFriends.map((f) => {
        if (f.id === friendId) {
          isNewInteraction = !f.streakActive;
          newStreakDays = isNewInteraction ? f.streakDays + 1 : f.streakDays;
          return {
            ...f,
            streakActive: true,
            streakDays: newStreakDays,
            hoursRemaining: 24
          };
        }
        return f;
      });

      if (isNewInteraction) {
        const targetFriend = prevFriends.find((f) => f.id === friendId);
        if (targetFriend) {
          // Increment current user's max streak count if we surpassed it
          setCurrentUser((prev) => ({
            ...prev,
            streakCount: Math.max(prev.streakCount, newStreakDays)
          }));

          // Show floating E2EE status/streak notification reward
          setStreakNotification({
            friendName: targetFriend.fullName,
            friendUsername: targetFriend.username,
            avatar: targetFriend.avatar,
            streakDays: newStreakDays,
            action: actionType,
            isNewLevel: true
          });
        }
      }

      return updated;
    });
  };

  // Handle Post Liking - trigger daily interaction if liking friend's post
  const handleLikePost = (postId: string) => {
    const postToLike = posts.find((p) => p.id === postId);
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newHasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: newHasLiked,
            likes: newHasLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );

    if (postToLike && !postToLike.hasLiked && postToLike.user.id !== currentUser.id) {
      handleTriggerStreakInteraction(postToLike.user.id, "liked their holographic memory");
    }
  };

  // Add Comment to Post - trigger daily interaction if commenting on friend's post
  const handleAddComment = (postId: string, text: string) => {
    const postToComment = posts.find((p) => p.id === postId);
    const newComment = {
      id: `comment_${Date.now()}`,
      username: currentUser.username,
      text,
      timestamp: "Just now",
      likes: 0
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    if (postToComment && postToComment.user.id !== currentUser.id) {
      handleTriggerStreakInteraction(postToComment.user.id, "commented on their hologram");
    }
  };

  // Handle Post Save / Bookmark
  const handleSavePost = (postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // Handle Sharing Post to a friend
  const handleShareToFriend = (friendId: string, postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Direct encrypted sharing message
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: friendId,
      text: `Sent you a hologram card: [Hologram by @${post.user.username}]`,
      ciphertext: "U2VudCB5b3UgYSBob2xvZ3JhbSBjYXJk",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isEncrypted: true,
      seen: false
    };

    setMessages((prev) => [...prev, newMessage]);

    // Also stimulates and activates streak daily interactions!
    handleTriggerStreakInteraction(friendId, "shared an encrypted hologram card");

    // Simulate friend opening the chat and marking as seen
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, seen: true } : m))
      );
    }, 2500);
  };

  // Mark Story as Viewed - trigger daily interaction if viewing friend's story
  const handleStoryViewed = (storyId: string) => {
    const targetStory = stories.find((s) => s.id === storyId);
    if (targetStory && !targetStory.viewed) {
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === storyId ? { ...story, viewed: true } : story
        )
      );

      if (targetStory.userId !== currentUser.id) {
        handleTriggerStreakInteraction(targetStory.userId, "synchronized with their story wave");
      }
    }
  };

  // Handle DM Send - trigger daily interaction and log message
  const handleSendMessage = (receiverId: string, text: string, ciphertext: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      text,
      ciphertext,
      isEncrypted: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seen: false
    };

    setMessages((prev) => [...prev, newMsg]);
    handleTriggerStreakInteraction(receiverId, "sent an encrypted quantum message");

    // Simulate friend opening the chat and marking as seen
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, seen: true } : m))
      );
    }, 2500);
  };

  // Keep Streaks active (nudge updates daily flame limits)
  const handleNudgeFriend = (friendId: string) => {
    handleTriggerStreakInteraction(friendId, "sent a real-time quantum energy pulse");
  };

  // Increment Friend Streak when daily interaction completes
  const handleUpdateStreak = (friendId: string) => {
    handleTriggerStreakInteraction(friendId, "synced interactive data channels");
  };

  // Create new feed post
  const handleAddPost = (newPostData: Partial<Post>) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar
      },
      imageUrl: newPostData.imageUrl || "",
      filter: newPostData.filter || "normal",
      caption: newPostData.caption || "",
      likes: 0,
      hasLiked: false,
      comments: [],
      timestamp: "Just now",
      location: newPostData.location || "Global Grid"
    };

    setPosts((prev) => [newPost, ...prev]);
    setActiveTab("feed");
  };

  // Create custom shader post from HoloLab Playground
  const handlePublishCustomPost = (imageUrl: string, filterStyleString: string) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar
      },
      imageUrl,
      filter: "custom_shader",
      caption: `Created with custom shader matrices in the #HoloLab Shader Sandbox! 🔮🧬`,
      likes: 0,
      hasLiked: false,
      comments: [],
      timestamp: "Just now",
      location: "HoloLab Terminal"
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  // Add new Story
  const handleAddStory = (newStoryData: Partial<Story>) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      imageUrl: newStoryData.imageUrl || "",
      filter: newStoryData.filter || "normal",
      viewed: false,
      timestamp: "Just now",
      hasActiveStreak: true,
      streakDays: currentUser.streakCount
    };

    setStories((prev) => [newStory, ...prev]);
    setActiveTab("feed");
  };

  // Pull-to-refresh feed content simulation
  const handleRefreshFeed = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const NEW_SIMULATED_POSTS: Post[] = [
          {
            id: "new_post_1",
            user: {
              id: "friend2",
              username: "neon_kai",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
            filter: "retro",
            caption: "Calibrating the arcade rig in Sector 7. Glitch core engines active. Who's down for a holographic match? 🎮👾 #retro #halogram #glitch",
            likes: 512,
            hasLiked: false,
            comments: [
              {
                id: "new_c1",
                username: "ethan.glitch",
                text: "I'm in! Powering up my node now.",
                timestamp: "Just now",
                likes: 4
              }
            ],
            timestamp: "Just now",
            location: "Sector 7 Arcade Lounge"
          },
          {
            id: "new_post_2",
            user: {
              id: "friend4",
              username: "ethan.glitch",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            },
            imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
            filter: "cyan",
            caption: "Cyberpunk neon particles render test. The depth resolution on this stream is unbelievable! 🌀💎 #particles #quantum #render",
            likes: 289,
            hasLiked: false,
            comments: [],
            timestamp: "Just now",
            location: "Quantum Simulation Lab"
          },
          {
            id: "new_post_3",
            user: {
              id: "friend3",
              username: "sophia_prism",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            },
            imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
            filter: "aurora",
            caption: "Configured a new optic filter for my digital greenhouse. Synthesizing organic light structures 🌿🔆 #biotech #neonbotany #prism",
            likes: 421,
            hasLiked: false,
            comments: [
              {
                id: "new_c3",
                username: "lisa_cyber",
                text: "Beautiful! Teach me how to map these coordinates.",
                timestamp: "Just now",
                likes: 5
              }
            ],
            timestamp: "Just now",
            location: "Orchid Greenhouse Sector"
          }
        ];

        const unaddedPost = NEW_SIMULATED_POSTS.find(
          (newPost) => !posts.some((existingPost) => existingPost.id === newPost.id)
        );

        if (unaddedPost) {
          setPosts((prev) => [unaddedPost, ...prev]);
        } else {
          const randomSuffix = Math.floor(Math.random() * 1000);
          const customPost: Post = {
            id: `random_post_${randomSuffix}`,
            user: {
              id: "friend1",
              username: "lisa_cyber",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            },
            imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
            filter: "cyberpunk",
            caption: `Downlinked a brand-new quantum hologram stream! Node calibration complete. [#Node_${randomSuffix}] 🔮⚡ #quantum #halonet`,
            likes: Math.floor(Math.random() * 400) + 100,
            hasLiked: false,
            comments: [],
            timestamp: "Just now",
            location: "Neo-Shibuya Sector"
          };
          setPosts((prev) => [customPost, ...prev]);
        }
        resolve();
      }, 1500);
    });
  };

  // Update bio detail values
  const handleUpdateBio = (fullName: string, bio: string, avatar: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      fullName,
      bio,
      avatar
    }));
  };

  // Handle tab navigation with optional isStory pre-selection
  const handleNavigateToTab = (tab: string, isStory: boolean = false, friendId?: string) => {
    setActiveTab(tab);
    setCreatePostIsStory(isStory);
    if (friendId) {
      setSelectedChatFriendId(friendId);
    }
  };

  // Count active streaks sum
  const activeStreaksSum = friends.filter((f) => f.streakActive).length;

  const handleOnboardingComplete = (userData: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
  }) => {
    const newUser: User = {
      id: "me",
      username: userData.username || "quantum_pioneer",
      fullName: userData.fullName || "Quantum Pioneer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      bio: "🌌 Just linked with the digital Halogram matrix.\n✨ Sync initialized successfully.\n🔥 E2E Quantum Handshake confirmed.",
      followersCount: 1420,
      followingCount: 482,
      streakCount: 0,
      badge: "Verified Node",
      email: userData.email,
      phone: userData.phone,
      verificationStatus: "verified",
      registeredAt: new Date().toISOString()
    };
    
    setCurrentUser(newUser);
    localStorage.setItem("halo_user", JSON.stringify(newUser));
    localStorage.setItem("halo_user_registered", "true");
    localStorage.removeItem("halo_is_new_install");
    setIsRegistered(true);
  };

  if (!isRegistered) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        verificationSettings={verificationSettings}
      />
    );
  }

  const c = ACCENT_CLASSES[accentColor];
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 selection:bg-cyan-500/30 selection:text-cyan-200 ${
      isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    }`}>
      
      {/* --- TOP HEADER NAVIGATION PANEL --- */}
      <header className={`sticky top-0 z-40 transition-colors duration-300 border-b px-4 py-3.5 ${
        isDark 
          ? "bg-zinc-950/85 backdrop-blur-md border-zinc-800/80" 
          : "bg-white/85 backdrop-blur-md border-zinc-200"
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleNavigateToTab("feed")}>
            <div className="relative group flex items-center justify-center w-9 h-9">
              <svg className="w-9 h-9 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.7)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Chat Bubble Base */}
                <path 
                  d="M20 15H80C88.2843 15 95 21.7157 95 30V60C95 68.2843 88.2843 75 80 75H45L22 92V75H20C11.7157 75 5 68.2843 5 60V30C5 21.7157 11.7157 15 20 15Z" 
                  fill="#09090b" 
                  stroke="url(#logo-grad-border)" 
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                {/* Stylized Futuristic Letter 'H' */}
                {/* Left pillar */}
                <path d="M35 30V60" stroke="url(#h-pillar-grad)" strokeWidth="8" strokeLinecap="round" />
                {/* Right pillar */}
                <path d="M65 30V60" stroke="url(#h-pillar-grad)" strokeWidth="8" strokeLinecap="round" />
                {/* Bridge */}
                <path d="M35 45H65" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_3px_#ffffff]" />
                
                <defs>
                  <linearGradient id="logo-grad-border" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
                    <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
                  </linearGradient>
                  <linearGradient id="h-pillar-grad" x1="0" y1="0" x2="0" y2="100">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#a1a1aa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute -inset-1 rounded-full bg-cyan-400/15 blur opacity-40 group-hover:bg-pink-500/20 group-hover:opacity-60 transition-all duration-300" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-widest bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent uppercase drop-shadow-[0_0_5px_rgba(6,182,212,0.35)] font-mono">
                Halogram
              </h1>
            </div>
          </div>

          {/* Quick Stats Header indicators */}
          <div className="flex items-center gap-3">
            
            {/* Real-time connection badge */}
            <div className={`hidden sm:flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors ${
              isDark 
                ? "bg-zinc-900/60 border-zinc-800 text-zinc-400" 
                : "bg-zinc-100 border-zinc-200 text-zinc-600"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>E2E QUANTUM CHANNELS: ACTIVE</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-yellow-400 hover:text-yellow-300 hover:border-zinc-700"
                  : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300"
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification bell indicator */}
            <button
              onClick={() => setActiveTab("notifications")}
              className={`relative p-2 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isDark 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700" 
                  : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300"
              }`}
              aria-label="Transmissions / Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-pink-500 shadow shadow-pink-500 animate-ping" />
            </button>
          </div>

        </div>
      </header>

      {/* --- MAIN CORE RENDER PORTAL --- */}
      <main className="flex-1 pb-24 pt-4 px-3 sm:px-4">
        {activeTab === "feed" && (
          <Feed
            posts={posts}
            stories={stories}
            friends={friends}
            savedPostIds={savedPostIds}
            onSavePost={handleSavePost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onSelectStory={(index) => setActiveStoryIndex(index)}
            onNavigateToTab={handleNavigateToTab}
            onShareToFriend={handleShareToFriend}
            currentUser={currentUser}
            onRefresh={handleRefreshFeed}
          />
        )}

        {activeTab === "messages" && (
          <Chat
            friends={friends}
            messages={messages}
            currentUserId={currentUser.id}
            onSendMessage={handleSendMessage}
            onUpdateStreak={handleUpdateStreak}
            initialActiveFriendId={selectedChatFriendId}
          />
        )}

        {activeTab === "create" && (
          <CreatePost
            onAddPost={handleAddPost}
            onAddStory={handleAddStory}
            onSuccess={() => setActiveTab("feed")}
            defaultIsStory={createPostIsStory}
          />
        )}

        {activeTab === "streaks" && (
          <Streaks
            friends={friends}
            onNudge={handleNudgeFriend}
            onNavigateToTab={handleNavigateToTab}
            theme={theme}
            accentColor={accentColor}
            onEquipAccent={(color) => setAccentColor(color)}
          />
        )}

        {activeTab === "hololab" && (
          <HoloLab
            onPublishCustomPost={handlePublishCustomPost}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === "profile" && (
          <Profile
            user={currentUser}
            posts={posts}
            savedPostIds={savedPostIds}
            theme={theme}
            setTheme={(newTheme) => setTheme(newTheme as "dark" | "light")}
            accentColor={accentColor}
            onEquipAccent={(color) => setAccentColor(color as AccentColor)}
            onUpdateBio={handleUpdateBio}
            friends={friends}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onSavePost={handleSavePost}
          />
        )}

        {activeTab === "notifications" && (
          <Notifications
            friends={friends}
            onNavigateToTab={handleNavigateToTab}
            theme={theme}
          />
        )}
      </main>

      {/* --- RE-USABLE MODAL STORY POPUPS --- */}
      {activeStoryIndex !== null && (
        <StoryView
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onStoryViewed={(storyId) => handleStoryViewed(storyId)}
        />
      )}

      {/* --- BOTTOM MOBILE NAVIGATION FOOTER RAIL --- */}
      <footer className={`fixed bottom-0 inset-x-0 z-40 transition-colors duration-300 border-t px-4 py-2.5 ${
        isDark 
          ? "bg-zinc-900/90 backdrop-blur-md border-zinc-800/80" 
          : "bg-white/95 backdrop-blur-md border-zinc-200"
      }`}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          
          {/* Feed */}
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
              activeTab === "feed" 
                ? c.text + " scale-105" 
                : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Feed</span>
          </button>

          {/* DMs */}
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
              activeTab === "messages" 
                ? c.text + " scale-105" 
                : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>DMs</span>
          </button>

          {/* Create Post */}
          <button
            onClick={() => setActiveTab("create")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
              activeTab === "create" 
                ? "text-pink-500 scale-105" 
                : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <PlusSquare className="w-5.5 h-5.5" />
            <span>Create</span>
          </button>

          {/* Halo Streaks Core */}
          <button
            onClick={() => setActiveTab("streaks")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
              activeTab === "streaks" 
                ? "text-orange-400 scale-105 font-bold" 
                : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Flame className="w-5 h-5" />
            <span>Streaks</span>
          </button>

          {/* HoloLab Playground */}
          <button
            onClick={() => setActiveTab("hololab")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
              activeTab === "hololab" 
                ? "text-purple-400 scale-105" 
                : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>HoloLab</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
              activeTab === "profile" 
                ? c.text + " scale-105" 
                : isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </button>

        </div>
      </footer>

      {/* --- FLOATING STREAK REWARD TOAST OVERLAY --- */}
      {streakNotification && (
        <div className={`fixed top-20 right-4 z-50 max-w-sm w-full border shadow-2xl p-4 rounded-2xl flex gap-3.5 items-center transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          isDark 
            ? "bg-zinc-900/95 border-orange-500/50 shadow-orange-500/10 text-white" 
            : "bg-white/95 border-orange-400/80 shadow-orange-500/10 text-zinc-900"
        }`}>
          <div className="relative flex-shrink-0">
            <img src={streakNotification.avatar} alt={streakNotification.friendName} className="w-11 h-11 rounded-full border-2 border-orange-500 object-cover" />
            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-0.5 border">
              <Flame className="w-3 h-3 fill-white text-white" />
            </div>
          </div>
          <div className="flex-grow">
            <h4 className="text-xs font-black flex items-center gap-1">
              Streak Level Up! <span className="text-orange-500 font-extrabold">🔥 {streakNotification.streakDays} Days</span>
            </h4>
            <p className={`text-[10px] mt-0.5 leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
              Because you {streakNotification.action} with <span className="font-semibold">{streakNotification.friendName}</span>, your communication flame flared!
            </p>
          </div>
          <button 
            onClick={() => setStreakNotification(null)} 
            className={`text-xs p-1 font-bold rounded-full hover:bg-zinc-500/10 transition-colors ${
              isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
