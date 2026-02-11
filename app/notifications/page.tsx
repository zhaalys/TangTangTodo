"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const NotificationsPage = () => {
  const notifications = [
    {
      title: "Waktunya mereview tugas!",
      desc: "Jangan lupa cek tugas hari ini ya.",
      time: "2 menit yang lalu",
      icon: "notifications_active",
      color: "text-orange-500",
    },
    {
      title: "Streak 7 Hari! 🔥",
      desc: "Hebat! Kamu telah produktif selama seminggu penuh.",
      time: "1 jam yang lalu",
      icon: "local_fire_department",
      color: "text-red-500",
    },
    {
      title: "Versi 1.0.4 Tersedia",
      desc: "Update sekarang untuk fitur jurnal baru.",
      time: "Kemarin",
      icon: "system_update",
      color: "text-blue-500",
    },
    {
      title: "Tips Produktivitas",
      desc: "Coba teknik Pomodoro untuk fokus lebih lama.",
      time: "2 hari yang lalu",
      icon: "lightbulb",
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="app-container pb-24 px-6 lg:px-12">
        {/* Header */}
        <header className="pt-12 flex items-center gap-4 z-10 lg:pt-16">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          >
            <span className="material-icons-round">chevron_left</span>
          </Link>
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
            Notifikasi
          </h1>
        </header>

        {/* List */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-6 lg:mt-12">
          {notifications.map((n, idx) => (
            <div
              key={idx}
              className="flex gap-6 p-6 rounded-[2.5rem] bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm transition-all hover:shadow-xl group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-w-[56px] rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 ${n.color}`}
              >
                <span className="material-icons-round text-3xl">{n.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-black text-lg lg:text-xl text-slate-900 dark:text-white leading-tight">
                    {n.title}
                  </p>
                </div>
                <p className="text-sm lg:text-base text-slate-500 mt-2 font-bold">
                  {n.desc}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    {n.time}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Bottom Content */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center opacity-20 p-20 text-center pointer-events-none mt-10">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center mb-6">
              <span className="material-icons-round text-6xl">
                notifications_paused
              </span>
            </div>
            <p className="font-black text-lg uppercase tracking-widest">
              Semua sudah beres!
            </p>
            <p className="text-sm mt-1">
              Kamu tidak punya notifikasi baru saat ini.
            </p>
          </div>
        </div>

        <Navbar />
      </main>
    </div>
  );
};

export default NotificationsPage;
