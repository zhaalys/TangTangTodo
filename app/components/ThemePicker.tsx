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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {availableThemes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`group relative flex items-center gap-5 p-6 rounded-[2.5rem] bg-slate-900/40 border transition-all duration-300 ${
            theme === t
              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-[0_20px_40px_rgba(13,89,242,0.15)] scale-[1.02]"
              : "border-white/5 hover:border-white/10 hover:bg-white/5"
          }`}
        >
          {/* Theme Color Indicator */}
          <div
            className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-active:scale-95 shrink-0"
            style={{
              backgroundColor: themeDetails[t].color,
              boxShadow:
                theme === t ? `0 10px 30px ${themeDetails[t].color}40` : "none",
            }}
          >
            {theme === t && (
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center animate-in zoom-in duration-300">
                <span className="material-icons-round text-slate-900 text-sm">
                  check
                </span>
              </div>
            )}
          </div>

          <div className="text-left flex-1 min-[0px]:truncate">
            <span
              className={`block font-black text-sm lg:text-base uppercase tracking-widest transition-colors ${theme === t ? "text-primary" : "text-slate-200"}`}
            >
              {themeDetails[t].name}
            </span>
            <span className="block text-[10px] lg:text-[11px] text-slate-500 font-bold mt-1 tracking-tight">
              {themeDetails[t].desc}
            </span>
          </div>

          {theme === t && (
            <div className="absolute top-4 right-4 animate-in fade-in duration-500">
              <span className="px-3 py-1 bg-primary/20 text-primary text-[8px] font-black uppercase rounded-full border border-primary/20 tracking-tighter">
                Active
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemePicker;
