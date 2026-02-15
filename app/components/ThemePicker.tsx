"use client";

import React from "react";
import { useTheme, ThemeType } from "../../context/ThemeContext";

const themeDetails: Record<
  ThemeType,
  { name: string; color: string; desc: string }
> = {
  default: {
    name: "Tangtang Blue",
    color: "#0d59f2",
    desc: "Original premium look",
  },
  emerald: {
    name: "Emerald Green",
    color: "#10b981",
    desc: "Fresh and productive",
  },
  sunset: {
    name: "Sunset Orange",
    color: "#f59e0b",
    desc: "Warm and energetic",
  },
  royal: {
    name: "Royal Purple",
    color: "#8b5cf6",
    desc: "Elegant and focused",
  },
  rose: { name: "Rose Pink", color: "#f43f5e", desc: "Passionate and bold" },
  ocean: {
    name: "Deep Ocean",
    color: "#0ea5e9",
    desc: "Calm and professional",
  },
};

const ThemePicker = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {availableThemes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`group flex items-center gap-4 p-5 rounded-[2.5rem] bg-white/5 border transition-all hover:bg-white/10 ${
            theme === t
              ? "border-primary shadow-xl primary-glow scale-[1.02]"
              : "border-white/5"
          }`}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-active:scale-90"
            style={{ backgroundColor: themeDetails[t].color }}
          >
            {theme === t && (
              <span className="material-icons-round text-white">check</span>
            )}
          </div>
          <div className="text-left flex-1">
            <span
              className={`block font-black text-sm uppercase tracking-widest ${theme === t ? "text-primary" : "text-slate-300"}`}
            >
              {themeDetails[t].name}
            </span>
            <span className="block text-[10px] text-slate-500 font-bold mt-1">
              {themeDetails[t].desc}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemePicker;
