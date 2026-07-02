export type AccentColor = "cyan" | "emerald" | "pink" | "purple";

export interface AccentTheme {
  text: string;
  textMuted: string;
  bg: string;
  hoverBg: string;
  border: string;
  borderHover: string;
  borderMuted: string;
  badge: string;
  shadow: string;
  gradient: string;
  fill: string;
  lightText: string;
  lightBg: string;
  lightBadge: string;
}

export const ACCENT_CLASSES: Record<AccentColor, AccentTheme> = {
  cyan: {
    text: "text-cyan-400",
    textMuted: "text-cyan-500/70",
    bg: "bg-cyan-500",
    hoverBg: "hover:bg-cyan-400",
    border: "border-cyan-500",
    borderHover: "hover:border-cyan-400",
    borderMuted: "border-cyan-500/30",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    shadow: "shadow-cyan-500/20",
    gradient: "from-cyan-400 via-pink-400 to-purple-500",
    fill: "fill-cyan-400",
    lightText: "text-cyan-600",
    lightBg: "bg-cyan-600",
    lightBadge: "bg-cyan-50 text-cyan-700 border-cyan-200"
  },
  emerald: {
    text: "text-emerald-400",
    textMuted: "text-emerald-500/70",
    bg: "bg-emerald-500",
    hoverBg: "hover:bg-emerald-400",
    border: "border-emerald-500",
    borderHover: "hover:border-emerald-400",
    borderMuted: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    shadow: "shadow-emerald-500/20",
    gradient: "from-emerald-400 via-cyan-400 to-teal-500",
    fill: "fill-emerald-400",
    lightText: "text-emerald-600",
    lightBg: "bg-emerald-600",
    lightBadge: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  pink: {
    text: "text-pink-400",
    textMuted: "text-pink-500/70",
    bg: "bg-pink-500",
    hoverBg: "hover:bg-pink-400",
    border: "border-pink-500",
    borderHover: "hover:border-pink-400",
    borderMuted: "border-pink-500/30",
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    shadow: "shadow-pink-500/20",
    gradient: "from-pink-400 via-rose-400 to-purple-500",
    fill: "fill-pink-400",
    lightText: "text-pink-600",
    lightBg: "bg-pink-600",
    lightBadge: "bg-pink-50 text-pink-700 border-pink-200"
  },
  purple: {
    text: "text-purple-400",
    textMuted: "text-purple-500/70",
    bg: "bg-purple-500",
    hoverBg: "hover:bg-purple-400",
    border: "border-purple-500",
    borderHover: "hover:border-purple-400",
    borderMuted: "border-purple-500/30",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    shadow: "shadow-purple-500/20",
    gradient: "from-purple-400 via-fuchsia-400 to-pink-500",
    fill: "fill-purple-400",
    lightText: "text-purple-600",
    lightBg: "bg-purple-600",
    lightBadge: "bg-purple-50 text-purple-700 border-purple-200"
  }
};
