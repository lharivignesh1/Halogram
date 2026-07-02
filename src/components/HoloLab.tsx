/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sliders, Sparkles, RefreshCw, Upload, Image as ImageIcon, Camera } from "lucide-react";

interface HoloLabProps {
  onPublishCustomPost: (imageUrl: string, filterStyleString: string) => void;
  onNavigateToTab: (tab: string) => void;
}

const STOCK_PICS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80", // cyberpunk neon portrait
  "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&auto=format&fit=crop&q=80", // street
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"  // glass prism
];

export default function HoloLab({ onPublishCustomPost, onNavigateToTab }: HoloLabProps) {
  const [selectedImage, setSelectedImage] = useState(STOCK_PICS[0]);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [cyberTint, setCyberTint] = useState(false);

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
    setInvert(0);
    setCyberTint(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Compile individual parameters into a unified CSS filter style
  const filterStyle = {
    filter: `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      sepia(${sepia}%)
      blur(${blur}px)
      hue-rotate(${hueRotate}deg)
      invert(${invert}%)
    `,
    boxShadow: cyberTint ? "inset 0 0 50px rgba(236,72,153,0.3), 0 0 20px rgba(6,182,212,0.4)" : "none"
  };

  const inlineStyleString = `brightness-${brightness} contrast-${contrast} saturate-${saturation} sepia-${sepia} blur-${blur} hue-rotate-${hueRotate} invert-${invert}`;

  const handlePublish = () => {
    onPublishCustomPost(selectedImage, inlineStyleString);
    onNavigateToTab("feed");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-xl space-y-6">
      
      {/* Lab Intro */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            HoloLab Shader Playground
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Build your own real-time CSS shaders. Adjust visual matrices dynamically and instantly post to Halogram.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Parameters
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-lg shadow-cyan-500/10 flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            Post Customized Photo
          </button>
        </div>
      </div>

      {/* Main Sandbox split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Real-time interactive canvas preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center">
            
            {/* The Image under the real-time filter */}
            <img
              src={selectedImage}
              alt="HoloLab Sandbox"
              style={filterStyle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-100"
            />

            {/* Glowing Holographic Overlap overlay */}
            {cyberTint && (
              <div className="absolute inset-0 pointer-events-none border-2 border-pink-500 mix-blend-color-dodge opacity-60 animate-pulse bg-gradient-to-tr from-cyan-500/10 to-pink-500/20" />
            )}

            <div className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-[10px] text-cyan-400 font-mono">
              ACTIVE MATRIX RESOLVER: ONLINE
            </div>
          </div>

          {/* Picture options */}
          <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">Sources:</span>
              <div className="flex gap-1.5">
                {STOCK_PICS.map((pic, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(pic)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === pic ? "border-cyan-400" : "border-transparent"
                    }`}
                  >
                    <img src={pic} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="cursor-pointer bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300 px-3 py-2 rounded-lg hover:text-white hover:border-zinc-700 transition-all flex items-center gap-1">
                <Upload className="w-3 h-3" />
                Upload Photo
                <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Slider settings */}
        <div className="lg:col-span-6 space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <h3 className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4" />
            Shader Matrix Parameters
          </h3>

          <div className="space-y-4">
            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-zinc-400">
                <span>Brightness</span>
                <span className="text-cyan-400">{brightness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-zinc-400">
                <span>Contrast</span>
                <span className="text-cyan-400">{contrast}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-zinc-400">
                <span>Saturation</span>
                <span className="text-cyan-400">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Hue Rotate */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-zinc-400">
                <span>Hue Shift</span>
                <span className="text-pink-400">{hueRotate}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hueRotate}
                onChange={(e) => setHueRotate(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-zinc-400">
                <span>Digital Blur</span>
                <span className="text-cyan-400">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Sepia */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-zinc-400">
                <span>Analog Sepia</span>
                <span className="text-cyan-400">{sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sepia}
                onChange={(e) => setSepia(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Invert */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-zinc-400">
                <span>Bitwise Inversion</span>
                <span className="text-cyan-400">{invert}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={invert}
                onChange={(e) => setInvert(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Cyberpunk Tint toggle */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900 rounded-lg border border-zinc-800/80 mt-2">
              <div>
                <p className="text-xs font-bold text-zinc-100">Quantum Cyan-Pink Overlay</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Inject dynamic color reflections on edges</p>
              </div>
              <button
                type="button"
                onClick={() => setCyberTint(!cyberTint)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  cyberTint ? "bg-pink-500" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    cyberTint ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
