"use client";

import React from "react";
import { useLanguage, LanguageType } from "../../context/LanguageContext";

const langs: { type: LanguageType; name: string; flag: string }[] = [
  { type: "id", name: "Indonesia", flag: "🇮🇩" },
  { type: "en", name: "English", flag: "🇺🇸" },
  { type: "ja", name: "日本語", flag: "🇯🇵" },
  { type: "ko", name: "한국어", flag: "🇰🇷" },
  { type: "ar", name: "العربية", flag: "🇸🇦" },
];

const LanguagePicker = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto scroll-hide">
      {langs.map((l) => (
        <button
          key={l.type}
          onClick={() => setLanguage(l.type)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
            language === l.type
              ? "bg-primary text-white shadow-lg primary-glow"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <span>{l.flag}</span>
          <span>{l.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguagePicker;
