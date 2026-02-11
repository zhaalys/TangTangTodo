"use client";

import React from "react";
import Link from "next/link";
import Brand from "../components/Brand";
import Navbar from "../components/Navbar";

const SettingsPage = () => {
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
            Pengaturan
          </h1>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:mt-12 mt-8 items-start">
          {/* Brand Info (Left Side on Desktop) */}
          <section className="lg:col-span-5">
            <div className="flex flex-col items-center py-12 px-8 bg-white dark:bg-surface-dark rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

              <Brand className="scale-125 lg:scale-150 mb-10 transition-transform group-hover:scale-[1.6]" />

              <div className="text-center space-y-4">
                <p className="text-slate-500 font-black text-sm lg:text-base uppercase tracking-widest">
                  Versi 1.0.4 - Build 2026
                </p>
                <p className="text-center text-xs lg:text-sm text-slate-400 font-bold max-w-[280px] mx-auto leading-relaxed">
                  Dibuat dengan ❤️ untuk generasi produktif masa kini.
                  Efficiency meets elegance.
                </p>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5 w-full flex justify-center gap-6">
                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:text-primary transition-colors">
                  <span className="material-icons-round">language</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:text-primary transition-colors">
                  <span className="material-icons-round">share</span>
                </button>
              </div>
            </div>
          </section>

          {/* Options (Right Side on Desktop) */}
          <div className="lg:col-span-7 mt-10 lg:mt-0 space-y-10">
            {/* Section: Akun */}
            <section className="space-y-4">
              <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                Akun & Keamanan
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: "person_outline",
                    label: "Edit Profil",
                    sub: "Ubah nama, email, dan foto",
                  },
                  {
                    icon: "lock_outline",
                    label: "Ubah Kata Sandi",
                    sub: "Ganti pengaman akunmu",
                  },
                  {
                    icon: "translate",
                    label: "Bahasa",
                    sub: "Indonesia (Default)",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-6 p-6 bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 rounded-[2.5rem] hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-2xl">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="block font-black text-lg">
                        {item.label}
                      </span>
                      <span className="block text-xs font-bold text-slate-400 opacity-60 mt-0.5">
                        {item.sub}
                      </span>
                    </div>
                    <span className="material-icons-round text-slate-300 group-hover:translate-x-2 transition-transform">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Support */}
            <section className="space-y-4">
              <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                Bantuan & Dukungan
              </h3>
              <div className="bg-primary/10 border border-primary/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-lg transform -rotate-6">
                  <span className="material-icons-round text-4xl text-primary">
                    support_agent
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="font-black text-xl text-slate-900 dark:text-white mb-2">
                    Butuh bantuan?
                  </p>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed mb-6">
                    Kami di sini untuk membantu. Tim kami siap menjawab
                    pertanyaanmu kapan saja.
                  </p>
                  <button className="px-10 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest shadow-xl primary-glow hover:scale-[1.05] transition-transform">
                    Hubungi Kami
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <Navbar />
      </main>
    </div>
  );
};

export default SettingsPage;
