/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Friend, Post, Story, Message } from "./types";

export const CURRENT_USER: User = {
  id: "me",
  username: "vignesh.halo",
  fullName: "Hari Vignesh",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "🌌 Exploring the boundary between reality and digital holograms.\n✨ Halogram Designer & Tech Enthusiast\n🔥 Halo Streaks ongoing!",
  followersCount: 1420,
  followingCount: 482,
  streakCount: 28,
  badge: "Holo Pioneer"
};

export const FRIENDS: Friend[] = [
  {
    id: "friend1",
    username: "lisa_cyber",
    fullName: "Lisa Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    streakDays: 45,
    streakActive: true,
    hoursRemaining: 18,
    publicKey: "HALO_KEY_LISA_88E9B"
  },
  {
    id: "friend2",
    username: "neon_kai",
    fullName: "Kai Yamamoto",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    streakDays: 12,
    streakActive: false,
    hoursRemaining: 4,
    publicKey: "HALO_KEY_KAI_44A2D"
  },
  {
    id: "friend3",
    username: "sophia_prism",
    fullName: "Sophia Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    streakDays: 31,
    streakActive: true,
    hoursRemaining: 22,
    publicKey: "HALO_KEY_SOPHIA_11F5C"
  },
  {
    id: "friend4",
    username: "ethan.glitch",
    fullName: "Ethan Carter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    streakDays: 8,
    streakActive: false,
    hoursRemaining: 9,
    publicKey: "HALO_KEY_ETHAN_99D8E"
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: "story_1",
    userId: "friend1",
    username: "lisa_cyber",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    filter: "cyberpunk",
    viewed: false,
    timestamp: "2h ago",
    hasActiveStreak: true,
    streakDays: 45
  },
  {
    id: "story_2",
    userId: "friend3",
    username: "sophia_prism",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    filter: "hologram",
    viewed: false,
    timestamp: "4h ago",
    hasActiveStreak: true,
    streakDays: 31
  },
  {
    id: "story_3",
    userId: "friend2",
    username: "neon_kai",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80",
    filter: "vintage",
    viewed: true,
    timestamp: "12h ago",
    hasActiveStreak: true,
    streakDays: 12
  },
  {
    id: "story_4",
    userId: "friend4",
    username: "ethan.glitch",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    filter: "forest",
    viewed: true,
    timestamp: "18h ago",
    hasActiveStreak: true,
    streakDays: 8
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: "post_1",
    user: {
      id: "friend1",
      username: "lisa_cyber",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    imageUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&auto=format&fit=crop&q=80",
    filter: "cyberpunk",
    caption: "Midnight stroll through the fluorescent sector. The glowing holographic projections are crazy tonight! 🌌✨ #cyberpunk #neonvibes #halogram",
    likes: 342,
    hasLiked: false,
    comments: [
      {
        id: "c1",
        username: "sophia_prism",
        text: "This color scheme is incredible Lisa!",
        timestamp: "1h ago",
        likes: 12
      },
      {
        id: "c2",
        username: "neon_kai",
        text: "Meet me at sector 4 in 10 mins!",
        timestamp: "45m ago",
        likes: 3
      }
    ],
    timestamp: "2 hours ago",
    location: "Neo-Shibuya Sector"
  },
  {
    id: "post_2",
    user: {
      id: "friend3",
      username: "sophia_prism",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
    },
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    filter: "hologram",
    caption: "Experimenting with interactive glass prisms in the HoloLab. What do we think of this abstract refraction study? 🔮🧪 #hololab #refraction #digitalart",
    likes: 189,
    hasLiked: true,
    comments: [
      {
        id: "c3",
        username: "vignesh.halo",
        text: "The refraction accuracy is perfect, did you use the double pass filter?",
        timestamp: "3h ago",
        likes: 24
      }
    ],
    timestamp: "4 hours ago",
    location: "HoloLab Labs"
  },
  {
    id: "post_3",
    user: {
      id: "friend2",
      username: "neon_kai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80",
    filter: "vintage",
    caption: "Stepping into alternative reality models. Retro wave rendering feels nostalgic and futuristic all at once. 🕶️⚡ #retro #vr #nextgen",
    likes: 512,
    hasLiked: false,
    comments: [
      {
        id: "c4",
        username: "ethan.glitch",
        text: "Nostalgia is a bug in the code, Kai!",
        timestamp: "5h ago",
        likes: 18
      }
    ],
    timestamp: "Yesterday",
    location: "Virtual Grid Room"
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    senderId: "friend1",
    receiverId: "me",
    text: "Hey! Did you check out the new real-time filters I posted on my story?",
    ciphertext: "U2FsdGVkX1+zN8YyH30Y8Q9Gj7Fj9K1L4U2O8R6Q==",
    isEncrypted: true,
    timestamp: "10:30 AM"
  },
  {
    id: "m2",
    senderId: "me",
    receiverId: "friend1",
    text: "Yes, the cyberpunk tint looks amazing. How did you balance the neon contrast?",
    ciphertext: "U2FsdGVkX19hD4gH3Y8O9P8R5K6L2U4S8H3A==",
    isEncrypted: true,
    timestamp: "10:32 AM",
    seen: true
  },
  {
    id: "m3",
    senderId: "friend1",
    receiverId: "me",
    text: "I adjusted the saturation slider in the HoloLab tab and locked the color mask. Let's work on a new group preset soon!",
    ciphertext: "U2FsdGVkX1+gD9S3R8P7Q1G4H9K2L4M8J6O3N1E==",
    isEncrypted: true,
    timestamp: "10:35 AM"
  },
  {
    id: "m4",
    senderId: "friend2",
    receiverId: "me",
    text: "Our streak is about to expire in 4 hours! Nudge me back with a snap so we don't lose our 12-day flame! 🔥⚡",
    ciphertext: "U2FsdGVkX19pP9F4G2H7L2O9S4K6M2N8H9K8D==",
    isEncrypted: true,
    timestamp: "Yesterday"
  }
];

// Helper to simulate encryption/decryption client-side with a gorgeous visual transformation
export function encryptMessage(text: string, key: string): { ciphertext: string } {
  // Simple deterministic visual hex/obfuscation representational E2E encryption
  let result = "";
  const shift = key.length % 26;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // encode to hex with an offset
    const obfuscated = (charCode ^ shift).toString(16).toUpperCase().padStart(2, "0");
    result += obfuscated;
  }
  // format into nice blocks of 4 hex chars
  const chunks = result.match(/.{1,4}/g) || [];
  return { ciphertext: `🔒 HALO_E2EE[${chunks.join("-")}]` };
}

export function decryptMessage(ciphertext: string, key: string): string {
  // Extract hex string from HALO_E2EE[...]
  const match = ciphertext.match(/HALO_E2EE\[(.*)\]/);
  if (!match) return "Decryption Failed: Key mismatch or tampered cipher.";
  const hexStr = match[1].replace(/-/g, "");
  
  let result = "";
  const shift = key.length % 26;
  for (let i = 0; i < hexStr.length; i += 2) {
    const hex = hexStr.substring(i, i + 2);
    const charCode = parseInt(hex, 16) ^ shift;
    result += String.fromCharCode(charCode);
  }
  return result;
}
