/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FilterPreset {
  id: string;
  name: string;
  style: string; // Tailind filter utilities or custom CSS styles
  description: string;
  icon: string;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "normal",
    name: "Normal",
    style: "",
    description: "Original image colors",
    icon: "✨"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    style: "saturate-200 hue-rotate-15 contrast-125 brightness-95 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    description: "Saturated hot pinks and neon blues",
    icon: "🌆"
  },
  {
    id: "hologram",
    name: "Hologram",
    style: "hue-rotate-180 saturate-150 contrast-135 brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.5)] sepia-[0.1]",
    description: "Ethereal holographic cyan shift",
    icon: "💎"
  },
  {
    id: "vintage",
    name: "Vintage",
    style: "sepia contrast-[0.95] brightness-105 saturate-75",
    description: "Classic analog warm sepia tones",
    icon: "📷"
  },
  {
    id: "noir",
    name: "Noir",
    style: "grayscale contrast-150 brightness-90",
    description: "Deep high-contrast black & white",
    icon: "🕶️"
  },
  {
    id: "sunset",
    name: "Sunset",
    style: "hue-rotate-330 saturate-200 brightness-105 contrast-110",
    description: "Vibrant warm golden hour hues",
    icon: "🌇"
  },
  {
    id: "forest",
    name: "Forest",
    style: "hue-rotate-80 saturate-[0.85] contrast-110 brightness-95",
    description: "Moody deep green forest shades",
    icon: "🌲"
  }
];

export function getFilterStyle(filterId: string): string {
  const preset = FILTER_PRESETS.find(p => p.id === filterId);
  return preset ? preset.style : "";
}
