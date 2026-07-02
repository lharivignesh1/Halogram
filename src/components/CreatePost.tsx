/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Upload, Camera, MapPin, Sparkles, Image as ImageIcon } from "lucide-react";
import { FILTER_PRESETS } from "../utils";
import { Post, Story } from "../types";

interface CreatePostProps {
  onAddPost: (newPost: Partial<Post>) => void;
  onAddStory: (newStory: Partial<Story>) => void;
  onSuccess: () => void;
  defaultIsStory?: boolean;
}

const SAMPLE_POST_TEMPLATES = [
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80", // Sunset
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80", // Portrait neon
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80", // Street
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80", // Computer code neon
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"  // Glass neon prism
];

export default function CreatePost({ onAddPost, onAddStory, onSuccess, defaultIsStory = false }: CreatePostProps) {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_POST_TEMPLATES[0]);
  const [activeFilter, setActiveFilter] = useState("normal");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [isStory, setIsStory] = useState(defaultIsStory);

  useEffect(() => {
    setIsStory(defaultIsStory);
  }, [defaultIsStory]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isStory) {
      onAddStory({
        imageUrl: selectedImage,
        filter: activeFilter,
        timestamp: "Just now"
      });
    } else {
      onAddPost({
        imageUrl: selectedImage,
        filter: activeFilter,
        caption: caption || "Captured on Halogram with futuristic filters! 🔮📱",
        location: location || "Global Grid",
        timestamp: "Just now"
      });
    }
    
    // Reset form
    setCaption("");
    setLocation("");
    setActiveFilter("normal");
    onSuccess();
  };

  const currentPreset = FILTER_PRESETS.find(p => p.id === activeFilter);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
        <Camera className="w-6 h-6 text-cyan-400" />
        New Halogram Creation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Selector */}
        <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setIsStory(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isStory
                ? "bg-cyan-500 text-black shadow-lg"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Create Feed Post
          </button>
          <button
            type="button"
            onClick={() => setIsStory(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isStory
                ? "bg-pink-500 text-white shadow-lg"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Add to Story (Halo Streak)
          </button>
        </div>

        {/* Image Input Zone */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-4">
            {/* Main Preview Container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer flex flex-col items-center justify-center transition-all ${
                dragOver
                  ? "border-cyan-400 bg-cyan-950/20"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950"
              }`}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Post preview"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    currentPreset?.style || ""
                  }`}
                />
              ) : (
                <div className="text-center p-6 text-zinc-500">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-zinc-600" />
                  <p className="text-sm font-medium">Drag & drop your photo, or click to upload</p>
                  <p className="text-xs text-zinc-600 mt-1">Supports PNG, JPG, GIF</p>
                </div>
              )}
              {selectedImage && (
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Filter: {currentPreset?.name}
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Template Images Selection */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                Or choose from glowing stock holograms:
              </p>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {SAMPLE_POST_TEMPLATES.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === imgUrl ? "border-cyan-400 scale-105" : "border-transparent"
                    }`}
                  >
                    <img src={imgUrl} alt="Stock template" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form details & Realtime Filter select */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Apply Real-time Filters
              </h3>
              <div className="grid grid-cols-2 gap-2 h-52 overflow-y-auto pr-1 scrollbar-thin">
                {FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActiveFilter(preset.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs border transition-all ${
                      activeFilter === preset.id
                        ? "bg-cyan-950/40 border-cyan-500 text-cyan-200 font-semibold"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <div className="overflow-hidden">
                      <p className="truncate font-medium">{preset.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {!isStory && (
              <div className="space-y-3">
                {/* Caption input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe your hologram... #cyber #aesthetic"
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Location input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Neo-Tokyo, Sector 7"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${
                isStory
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-pink-500/10"
                  : "bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black shadow-cyan-500/10"
              }`}
            >
              {isStory ? "Broadcast Story" : "Publish to Feed"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
