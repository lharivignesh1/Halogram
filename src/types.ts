/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  streakCount: number;
  badge?: string;
  email?: string;
  phone?: string;
  verificationStatus?: "verified" | "pending";
  registeredAt?: string;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  user: {
    username: string;
    avatar: string;
    id: string;
  };
  imageUrl: string;
  filter: string; // CSS class/style string
  caption: string;
  likes: number;
  hasLiked: boolean;
  comments: Comment[];
  timestamp: string;
  location?: string;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  filter: string;
  viewed: boolean;
  timestamp: string;
  hasActiveStreak?: boolean;
  streakDays?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string; // Plaintext when decrypted
  ciphertext: string; // Encrypted version
  isEncrypted: boolean;
  timestamp: string;
  decrypting?: boolean; // animation state
  seen?: boolean;
}

export interface Friend {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  streakDays: number;
  streakActive: boolean; // Has interacted today?
  hoursRemaining: number;
  publicKey: string;
}
