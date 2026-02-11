"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

interface JurnalEntry {
  date: string;
  text: string;
  mood: string;
  photo?: string;
}

const JurnalPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMood, setSelectedMood] = useState("senang");
  const [entryText, setEntryText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showCameraShutter, setShowCameraShutter] = useState(false);
  const [entries, setEntries] = useState<Record<string, JurnalEntry>>({});

  // Generate dynamic dates for the current week
  const dates = useMemo(() => {
    const today = new Date();
    const result = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      result.push({
        day: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(
          date,
        ),
        date: date.getDate().toString(),
        fullDate: date.toISOString().split("T")[0],
        month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
          date,
        ),
      });
    }
    return result;
  }, []);

  // Initialize selected date to today
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDate(todayStr);

    const saved = localStorage.getItem("tangtang_jurnal");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Load entry when date changes
  useEffect(() => {
    if (selectedDate && entries[selectedDate]) {
      setEntryText(entries[selectedDate].text);
      setSelectedMood(entries[selectedDate].mood);
    } else {
      setEntryText("");
      setSelectedMood("senang");
    }
  }, [selectedDate, entries]);

  const saveEntry = () => {
    if (!selectedDate) return;
    const newEntries = {
      ...entries,
      [selectedDate]: {
        date: selectedDate,
        text: entryText,
        mood: selectedMood,
      },
    };
    setEntries(newEntries);
    localStorage.setItem("tangtang_jurnal", JSON.stringify(newEntries));
    alert("Cerita hari ini berhasil disimpan!");
  };

  const handleCamera = () => {
    setShowCameraShutter(true);
    setTimeout(() => setShowCameraShutter(false), 300);
    // In a real app, we'd trigger the camera API here
  };

  const moods = [
    {
      id: "senang",
      label: "Senang",
      icon: "sentiment_satisfied_alt",
      color: "text-amber-500",
    },
    {
      id: "semangat",
      label: "Semangat",
      icon: "rocket_launch",
      color: "text-primary",
    },
    {
      id: "ngantuk",
      label: "Ngantuk",
      icon: "bedtime",
      color: "text-indigo-400",
    },
    {
      id: "sedih",
      label: "Sedih",
      icon: "sentiment_dissatisfied",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="bg-[#0f172a] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Camera Shutter Effect */}
      {showCameraShutter && (
        <div className="fixed inset-0 bg-white z-[200] animate-out fade-out duration-300 pointer-events-none"></div>
      )}

      <main className="app-container pb-24 px-6 lg:px-12">
        {/* Header */}
        <header className="pt-12 flex justify-between items-center z-10 lg:pt-16">
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
              Jurnal Tangtang
            </h1>
            <p className="text-sm lg:text-base text-primary font-semibold flex items-center gap-1 mt-1">
              Petualangan Hari Ini{" "}
              <span className="material-icons-round text-[16px]">
                celebration
              </span>
            </p>
          </div>
          <div className="flex -space-x-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-background-dark bg-primary/10 flex items-center justify-center transition-transform hover:scale-110"
              >
                <span className="material-icons-round text-primary text-xl lg:text-2xl">
                  person
                </span>
              </div>
            ))}
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:mt-12 mt-8">
          {/* Left Side: Controls & History */}
          <div className="lg:col-span-5 space-y-10">
            {/* Date Scroller */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
                Kalender
              </h3>
              <div className="flex overflow-x-auto scroll-hide space-x-4 py-2">
                {dates.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(d.fullDate)}
                    className={`flex flex-col items-center min-w-[70px] py-4 rounded-3xl transition-all active:scale-95 ${
                      selectedDate === d.fullDate
                        ? "bg-primary text-white shadow-lg primary-glow border-transparent"
                        : "bg-white/5 border border-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-black mb-1">
                      {d.day}
                    </span>
                    <span
                      className={`text-xl font-black ${selectedDate === d.fullDate ? "scale-110" : ""}`}
                    >
                      {d.date}
                    </span>
                    <span className="text-[8px] uppercase font-bold opacity-60">
                      {d.month}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Mood Picker */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
                Suasana Hati
              </h3>
              <div className="flex justify-around items-center bg-white/5 dark:bg-surface-dark/50 rounded-[2.5rem] p-4 border border-white/5 backdrop-blur-md">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all active:scale-95 ${
                      selectedMood === mood.id
                        ? "bg-white/10 ring-2 ring-primary/50 shadow-lg scale-110"
                        : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100"
                    }`}
                  >
                    <span
                      className={`material-icons-round text-4xl ${selectedMood === mood.id ? mood.color : "text-slate-400"}`}
                    >
                      {mood.icon}
                    </span>
                    <span
                      className={`text-[10px] mt-2 font-black uppercase tracking-widest ${selectedMood === mood.id ? "text-white" : "text-slate-500"}`}
                    >
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Photo Moment Section */}
            <section className="hidden lg:block">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
                Momen Terakhir
              </h3>
              <div className="relative rounded-[3rem] overflow-hidden h-56 shadow-2xl group cursor-pointer text-white border border-white/5">
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <span className="material-icons-round text-7xl opacity-10">
                    photo_library
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/95 via-background-dark/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                    Aktivitas Malam
                  </p>
                  <h4 className="text-2xl font-black leading-tight">
                    Menangkap Kunang-Kunang
                  </h4>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side: Main Entry Area */}
          <div className="lg:col-span-7 mt-10 lg:mt-0">
            <div className="bg-white/5 dark:bg-surface-dark/50 rounded-[3rem] p-8 lg:p-12 border border-white/5 backdrop-blur-xl relative overflow-hidden h-full min-h-[400px] flex flex-col group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-black text-2xl lg:text-3xl tracking-tight">
                    Cerita Hari Ini
                  </h3>
                  <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">
                    Bagikan momen serumu
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all ${entryText ? "bg-primary text-white shadow-lg primary-glow" : "bg-white/5 text-slate-500"}`}
                >
                  <span className="material-icons-round text-2xl">
                    {entryText ? "auto_awesome" : "edit"}
                  </span>
                </div>
              </div>

              <textarea
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Tulis petualanganmu di sini..."
                className="flex-1 w-full bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 leading-relaxed text-lg lg:text-xl placeholder:italic placeholder:text-slate-500/30 resize-none font-bold outline-none"
              />

              {/* Simulation Widgets */}
              {isRecording && (
                <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-12 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-red-500 font-black uppercase tracking-widest">
                    Perekaman Suara Aktif...
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 mt-12 relative z-30">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex-1 transition-all py-6 rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 text-lg ${
                    isRecording
                      ? "bg-red-500 text-white shadow-red-500/40 animate-pulse"
                      : "bg-primary text-white shadow-primary/40 hover:scale-[1.02]"
                  }`}
                >
                  <span className="material-icons-round text-2xl">
                    {isRecording ? "stop" : "mic"}
                  </span>
                  <span>{isRecording ? "Selesai" : "Simpan Cerita"}</span>
                </button>
                <button
                  onClick={handleCamera}
                  className="w-20 h-20 rounded-3xl border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                >
                  <span className="material-icons-round text-3xl text-slate-300">
                    photo_camera
                  </span>
                </button>

                {/* Real Save Action */}
                {!isRecording && entryText && (
                  <button
                    onClick={saveEntry}
                    className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                  >
                    <span className="material-icons-round text-3xl">save</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Navbar />
      </main>
    </div>
  );
};

export default JurnalPage;
