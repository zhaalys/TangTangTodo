"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const stats = {
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    today: tasks.filter((t) => t.isToday && !t.completed).length,
  };

  const upcomingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4);

  return (
    <div className="bg-[#0f172a] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="app-container pb-24 px-6 lg:px-12">
        {/* Header */}
        <header className="pt-12 flex justify-between items-center z-10 lg:pt-16">
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
              Halo, {user?.displayName?.split(" ")[0] || "Teman"}!
            </h1>
            <p className="text-sm lg:text-base text-primary font-semibold flex items-center gap-1 mt-1">
              Ada {stats.today} tugas hari ini{" "}
              <span className="material-icons-round text-[16px] lg:text-[20px]">
                auto_awesome
              </span>
            </p>
          </div>
          <Link
            href="/profile"
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden transition-transform hover:scale-105"
          >
            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="material-icons-round text-primary text-2xl lg:text-3xl">
                  person
                </span>
              )}
            </div>
          </Link>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:mt-12 mt-8">
          {/* Main Content (Left Column on Desktop) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Stats Section */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl transition-all hover:shadow-lg hover:shadow-primary/5">
                <span className="material-icons-round text-primary mb-3 text-3xl">
                  check_circle
                </span>
                <p className="text-3xl font-bold">{stats.completed}</p>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">
                  Selesai
                </p>
              </div>
              <div className="bg-accent-blue/10 border border-accent-blue/20 p-6 rounded-3xl transition-all hover:shadow-lg hover:shadow-accent-blue/5">
                <span className="material-icons-round text-accent-blue mb-3 text-3xl">
                  pending_actions
                </span>
                <p className="text-3xl font-bold">{stats.pending}</p>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">
                  Tertunda
                </p>
              </div>
            </section>

            {/* Upcoming Tasks */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl lg:text-2xl tracking-tight">
                  Tugas Mendatang
                </h3>
                <Link
                  href="/tasks"
                  className="text-sm font-black text-primary hover:underline underline-offset-4"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task, idx) => (
                    <Link
                      href="/tasks"
                      key={idx}
                      className="flex gap-4 p-5 rounded-[2rem] bg-surface-dark border border-white/5 items-center hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${task.isPenting ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}
                      >
                        <span className="material-icons-round text-2xl">
                          {task.isPenting ? "auto_awesome" : "schedule"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-full">
                            {task.category}
                          </span>
                          <p className="text-xs text-slate-500 font-bold tracking-tight">
                            {task.time}
                          </p>
                        </div>
                      </div>
                      <span className="material-icons-round text-slate-300 group-hover:text-primary transition-colors">
                        chevron_right
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-10 flex flex-col items-center justify-center opacity-30 text-center space-y-3">
                    <span className="material-icons-round text-5xl">
                      task_alt
                    </span>
                    <p className="font-black text-xs uppercase tracking-widest">
                      Tidak ada tugas mendatangi
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Extra Content (Right Column on Desktop) */}
          <div className="lg:col-span-4 mt-10 lg:mt-0 space-y-10">
            {/* Quote Plate */}
            <section>
              <div className="bg-gradient-to-br from-primary to-accent-blue p-8 rounded-[3rem] relative overflow-hidden shadow-2xl primary-glow group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-transform group-hover:scale-125"></div>
                <span className="material-icons-round text-white/30 text-6xl absolute -bottom-4 -right-4 opacity-50">
                  format_quote
                </span>
                <p className="relative z-10 text-white font-black italic leading-relaxed text-xl lg:text-2xl">
                  "Fokus pada proses, bukan hasil akhir. Setiap langkah kecil
                  membawamu lebih dekat."
                </p>
                <div className="mt-8 flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md">
                    <span className="material-icons-round text-white">
                      bolt
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                      Motivation
                    </span>
                    <span className="text-white font-black text-sm uppercase">
                      Tangtang Daily
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Calendar Placeholder or Extra Widget */}
            <section className="hidden lg:block bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 shadow-sm">
              <h4 className="font-black text-lg mb-6 flex items-center gap-2">
                <span className="material-icons-round text-primary">
                  calendar_today
                </span>
                Agenda Hari Ini
              </h4>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-1 h-12 bg-primary/20 rounded-full"></div>
                  <div>
                    <p className="font-black text-sm">Meeting Rutin</p>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      09:00 - 10:00
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start opacity-40">
                  <div className="w-1 h-12 bg-slate-300 rounded-full"></div>
                  <div>
                    <p className="font-black text-sm">Review Dokumentasi</p>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      11:00 - 12:00
                    </p>
                  </div>
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

export default DashboardPage;
