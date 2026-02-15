"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../components/Navbar";

const backgrounds = [
  "/asset_background_image/backgroundtodo.jpg",
  "/asset_background_image/Hunter x hunter.jpg",
  "/asset_background_image/One Piece_ Luffy, Zoro, Nami, Usopp, Sanji, Chopper, Robin, Franky, Brook_.jpg",
  "/asset_background_image/download (1).jpg",
  "/asset_background_image/download (2).jpg",
  "/asset_background_image/download.jpg",
  "/asset_background_image/★.jpg",
  "/asset_background_image/💤 (1).jpg",
];

const songs = [
  {
    name: "Chill Study",
    path: "/asset_lagu/chill_background-study-110111.mp3",
  },
  {
    name: "December Rain",
    path: "/asset_lagu/ceeprolific-december-rain-274814.mp3",
  },
  {
    name: "Sleepy Rain",
    path: "/asset_lagu/lorenzobuczek-sleepy-rain-116521.mp3",
  },
  {
    name: "School Learning",
    path: "/asset_lagu/tunetank-school-learning-study-music-349700.mp3",
  },
  {
    name: "Silhouette (Naruto)",
    path: "/asset_lagu/naruto_silhouette.mp4",
  },
  {
    name: "Orange (Shigatsu)",
    path: "/asset_lagu/shigatsu_orange.mp4",
  },
  {
    name: "Memories (One Piece)",
    path: "/asset_lagu/one_piece_memories.mp4",
  },
  { name: "Rapsodi (JKT48)", path: "/asset_lagu/jkt48_rapsodi.mp4" },
];

const FocusPage = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      playAlarm();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, time]);

  useEffect(() => {
    if (isActive && audioRef.current && !isMuted) {
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isActive, songIndex, isMuted]);

  const playAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(customMinutes * 60);
  };

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleCustomTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setCustomMinutes(val);
    if (!isActive) setTime(val * 60);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center font-display">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgrounds[bgIndex]}
          alt="Focus Background"
          fill
          className="object-cover transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <p className="text-white/80 text-lg font-black uppercase tracking-[0.3em] mb-2">
            Ready for productivity, {user?.displayName?.split(" ")[0] || "Alex"}
            ?
          </p>
          <h2 className="text-white text-xl font-bold italic opacity-60">
            "Success all depends on the second letter"
          </h2>
        </header>

        <div className="relative mb-12 animate-pulse-slow">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]">
            {formatTime(time)}
          </h1>
        </div>

        <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <button
            onClick={handleStart}
            className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all shadow-2xl"
          >
            {isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
          >
            <span className="material-icons-round">refresh</span>
          </button>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-10 left-10 flex gap-4 z-20">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        >
          <span className="material-icons-round">
            {isMuted ? "music_off" : "music_note"}
          </span>
        </button>
      </div>

      <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-4">
          <button
            onClick={() =>
              setBgIndex(
                (prev) => (prev - 1 + backgrounds.length) % backgrounds.length,
              )
            }
            className="text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="material-icons-round">landscape</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="material-icons-round">settings</span>
          </button>
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="material-icons-round">fullscreen</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-50 flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-[3rem] p-10 relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <span className="material-icons-round text-3xl">close</span>
            </button>

            <h3 className="text-3xl font-black text-white mb-10">
              Focus Settings
            </h3>

            <div className="space-y-12">
              {/* Time Setting */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">
                  Timer Duration (Minutes)
                </label>
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={handleCustomTime}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer mb-2"
                />
                <div className="flex justify-between text-white/40 font-black text-[10px] uppercase">
                  <span>1m</span>
                  <span className="text-white text-lg">
                    {customMinutes} Minutes
                  </span>
                  <span>120m</span>
                </div>
              </div>

              {/* Music Selection */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">
                  Select Music
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {songs.map((song, i) => (
                    <button
                      key={i}
                      onClick={() => setSongIndex(i)}
                      className={`p-3 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all ${songIndex === i ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                    >
                      {song.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Selection */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">
                  Select Atmosphere
                </label>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {backgrounds.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => setBgIndex(i)}
                      className={`min-w-[120px] h-20 rounded-2xl overflow-hidden relative border-2 transition-all ${bgIndex === i ? "border-primary scale-105" : "border-transparent opacity-50"}`}
                    >
                      <Image src={bg} alt="bg" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs mt-12 hover:bg-primary hover:text-white transition-all"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={audioRef} src={songs[songIndex].path} loop />
      <audio ref={alarmRef} src="/sound_alaram/alaram.mp3" />

      <Navbar />
    </div>
  );
};

export default FocusPage;
