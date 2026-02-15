"use client";

import React, { useState, useEffect, useRef } from "react";

const FocusTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && totalSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);
    } else if (totalSeconds === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Optional: Add notification sound here
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, totalSeconds]);

  useEffect(() => {
    setMinutes(Math.floor(totalSeconds / 60));
    setSeconds(totalSeconds % 60);
  }, [totalSeconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTotalSeconds(initialSeconds);
  };

  const setPreset = (mins: number) => {
    setIsActive(false);
    setInitialSeconds(mins * 60);
    setTotalSeconds(mins * 60);
  };

  const progress = ((initialSeconds - totalSeconds) / initialSeconds) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <section className="bg-surface-dark border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Timer Display (Circular) */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100 dark:text-white/5"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              style={{
                strokeDashoffset,
                transition: "stroke-dashoffset 0.5s ease",
              }}
              strokeLinecap="round"
              className="text-primary"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tighter">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Focus
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl lg:text-2xl tracking-tight mb-2">
              Focus Timer
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Waktunya Produktif & Bertumbuh
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {[15, 25, 45].map((m) => (
              <button
                key={m}
                onClick={() => setPreset(m)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${initialSeconds === m * 60 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"}`}
              >
                {m}m
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center md:justify-start">
            <button
              onClick={toggleTimer}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
              <span className="material-icons-round">
                {isActive ? "pause" : "play_arrow"}
              </span>
              {isActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all active:scale-95"
            >
              <span className="material-icons-round">refresh</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FocusTimer;
