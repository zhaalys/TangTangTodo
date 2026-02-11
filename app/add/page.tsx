"use client";

import React from "react";
import Link from "next/link";

const AddSelectionPage = () => {
  return (
    <div className="bg-[#0f172a] font-display text-slate-900 dark:text-slate-100 min-h-screen flex justify-center items-center">
      <main className="app-container pb-12 flex flex-col items-center justify-center p-8 lg:p-12 relative">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-accent-blue/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Close Button */}
        <Link
          href="/dashboard"
          className="absolute top-12 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 z-20"
        >
          <span className="material-icons-round">close</span>
        </Link>

        {/* Title */}
        <div className="text-center mb-12 lg:mb-20 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-4">
            Buat Baru
          </h1>
          <p className="text-slate-500 font-bold text-sm lg:text-lg">
            Pilih apa yang ingin kamu buat hari ini
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-[800px] grid gap-8 lg:grid-cols-2 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link
            href="/tasks?add=true"
            className="block w-full p-10 rounded-[3rem] bg-primary shadow-2xl shadow-primary/40 lg:shadow-3xl lg:shadow-primary/50 primary-glow group hover:scale-[1.03] transition-all duration-500"
          >
            <div className="flex flex-col items-start gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="material-icons-round text-white text-5xl">
                  task_alt
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Tugas Baru</h3>
                <p className="text-white/70 text-sm lg:text-base font-bold leading-relaxed">
                  Atur jadwal dan tujuanmu dengan mudah
                </p>
              </div>
              <span className="material-icons-round text-white/50 ml-auto group-hover:translate-x-3 transition-transform text-3xl">
                arrow_forward
              </span>
            </div>
          </Link>

          <Link
            href="/jurnal"
            className="block w-full p-10 rounded-[3rem] bg-surface-dark border border-white/5 shadow-2xl group hover:scale-[1.03] transition-all duration-500 hover:shadow-primary/5"
          >
            <div className="flex flex-col items-start gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-accent-blue/10 flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="material-icons-round text-accent-blue text-5xl">
                  edit_note
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Jurnal Baru</h3>
                <p className="text-slate-500 text-sm lg:text-base font-bold leading-relaxed">
                  Abadikan momen berhargamu hari ini
                </p>
              </div>
              <span className="material-icons-round text-slate-300 ml-auto group-hover:translate-x-3 transition-transform text-3xl group-hover:text-primary">
                arrow_forward
              </span>
            </div>
          </Link>
        </div>

        {/* Secondary Options */}
        <div className="mt-16 grid grid-cols-2 gap-6 w-full max-w-[800px] relative z-10 animate-in fade-in duration-1000 delay-300">
          <button className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group group cursor-not-allowed opacity-50">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110">
              <span className="material-icons-round text-2xl">mic</span>
            </div>
            <div className="text-left">
              <span className="block text-xs font-black uppercase tracking-widest text-slate-400">
                Rekam Suara
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                (Coming Soon)
              </span>
            </div>
          </button>
          <button className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group group cursor-not-allowed opacity-50">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
              <span className="material-icons-round text-2xl">
                photo_camera
              </span>
            </div>
            <div className="text-left">
              <span className="block text-xs font-black uppercase tracking-widest text-slate-400">
                Kamera
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                (Coming Soon)
              </span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddSelectionPage;
