"use client";

import Link from "next/link";
import Image from "next/image";
import Brand from "./components/Brand";
import { useState, useEffect } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="bg-[#f8fafc] dark:bg-[#020b1c] font-display text-slate-900 dark:text-white min-h-screen selection:bg-primary selection:text-white transition-colors duration-500">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex items-center justify-between">
        <Brand />
        <button
          className="p-3 rounded-full bg-slate-200/50 dark:bg-white/5 backdrop-blur-md border border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white/10 transition-all active:scale-95"
          onClick={() => setIsDark(!isDark)}
        >
          <span className="material-icons-round block dark:hidden text-slate-700">
            dark_mode
          </span>
          <span className="material-icons-round hidden dark:block text-yellow-400">
            light_mode
          </span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-full h-full hero-gradient pointer-events-none opacity-50"></div>
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Side: Mockup Illustration */}
          <div className="order-2 lg:order-1 relative flex justify-center items-center">
            <div className="absolute w-[450px] h-[450px] border border-slate-300/20 dark:border-white/5 rounded-full"></div>
            <div className="absolute w-[350px] h-[350px] border border-slate-300/30 dark:border-white/10 rounded-full"></div>

            {/* Floating Task Card Mockup */}
            <div className="task-card-float relative z-10 w-full max-w-[320px] aspect-[3/4] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden glass-card">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                    <span className="material-icons-round text-white text-lg">
                      check
                    </span>
                  </div>
                  <div className="h-2 w-32 bg-slate-300 dark:bg-white/10 rounded-full"></div>
                </div>

                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-9 h-9 rounded-xl border-2 border-slate-300 dark:border-white/20"></div>
                  <div className="h-2 w-48 bg-slate-300 dark:bg-white/10 rounded-full"></div>
                </div>

                <div className="flex items-center gap-4 opacity-30">
                  <div className="w-9 h-9 rounded-xl border-2 border-slate-300 dark:border-white/20"></div>
                  <div className="h-2 w-24 bg-slate-300 dark:bg-white/10 rounded-full"></div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl group/mascot transition-all hover:scale-110">
                <Image
                  src="/tangtanglogo1.png"
                  alt="Mascot"
                  width={48}
                  height={48}
                  className="opacity-80 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            </div>

            {/* Floating Schedule Icon */}
            <div
              className="absolute top-0 right-10 w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <span className="material-icons-round text-primary text-4xl drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                schedule
              </span>
            </div>
          </div>

          {/* Right Side: Text & Actions */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
              Organize
              <br />
              <span className="text-primary drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                Your
              </span>{" "}
              Life
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg mb-12 mx-auto lg:mx-0 leading-relaxed font-medium">
              Master your day with Tangtang. Simple, fun, and powerful.
              Efficiency meets elegance in one platform.
            </p>

            {/* Features Mini-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {[
                {
                  icon: "bolt",
                  title: "Cepat & Ringan",
                  sub: "Performa secepat kilat",
                },
                {
                  icon: "shield",
                  title: "Privasi Terjamin",
                  sub: "Data Anda aman",
                },
                {
                  icon: "auto_awesome",
                  title: "Desain Premium",
                  sub: "Antarmuka manja",
                },
                {
                  icon: "sync",
                  title: "Sinkronisasi",
                  sub: "Akses di mana saja",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-slate-200 dark:border-white/5 backdrop-blur-md p-5 rounded-3xl flex items-center gap-4 transition-all hover:scale-[1.05] hover:bg-slate-50 dark:hover:bg-white/10 group cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <span className="material-icons-round text-primary group-hover:text-white">
                      {f.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-[10px] uppercase tracking-widest opacity-90">
                      {f.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      {f.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8 flex flex-col items-center lg:items-start">
              <Link
                href="/login"
                className="w-full md:w-auto px-12 py-5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-3 overflow-hidden group relative"
              >
                <span className="relative z-10">Mulai Sekarang</span>
                <span className="material-icons-round relative z-10 group-hover:translate-x-2 transition-transform">
                  arrow_forward
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>

              <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase">
                <span className="text-slate-400">Sudah punya akun?</span>
                <Link
                  href="/login"
                  className="text-primary hover:underline decoration-4 underline-offset-8 transition-all"
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Initials */}
      <footer className="fixed bottom-6 right-6 md:right-12 hidden md:block">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xl shadow-2xl border border-white/10">
          T
        </div>
      </footer>
    </div>
  );
}
