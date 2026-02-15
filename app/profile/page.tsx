"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import ThemePicker from "../components/ThemePicker";
import LanguagePicker from "../components/LanguagePicker";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import Image from "next/image";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { updateProfile } from "firebase/auth";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { availableThemes } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || "");
  const [editedPhoto, setEditedPhoto] = useState(user?.photoURL || "");
  const [activeView, setActiveView] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    if (!user) return;

    const qTasks = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
    );
    const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    const qPosts = query(
      collection(db, "posts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserPosts(postsData);
    });

    setLoading(false);
    return () => {
      unsubscribeTasks();
      unsubscribePosts();
    };
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: editedName,
        photoURL: editedPhoto,
      });
      setIsEditing(false);
      // Force refresh data in some way or let Firebase Auth handle it
    } catch (err) {
      console.error("Gagal update profil", err);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    streak: tasks.filter((t) => t.completed).length > 5 ? 7 : 0, // Mock streak for now
    percent:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.completed).length / tasks.length) * 100,
          )
        : 0,
  };

  const categories = [
    {
      label: "Project",
      value: tasks.filter((t) => t.category === "Project").length,
      color: "bg-primary",
    },
    {
      label: "Kerja",
      value: tasks.filter((t) => t.category === "Kerja").length,
      color: "bg-emerald-500",
    },
    {
      label: "Personal",
      value: tasks.filter((t) => t.category === "Personal").length,
      color: "bg-amber-500",
    },
    {
      label: "Lainnya",
      value: tasks.filter(
        (t) => !["Project", "Kerja", "Personal"].includes(t.category),
      ).length,
      color: "bg-blue-400",
    },
  ];

  const weeklyData = [
    { day: "Sen", value: stats.percent > 0 ? stats.percent : 0 },
    { day: "Sel", value: 0 },
    { day: "Rab", value: 0 },
    { day: "Kam", value: 0 },
    { day: "Jum", value: 0 },
    { day: "Sab", value: 0 },
    { day: "Min", value: 0 },
  ];

  const monthlyData = [
    { day: "W1", value: 45 },
    { day: "W2", value: 65 },
    { day: "W3", value: 30 },
    { day: "W4", value: stats.percent > 0 ? stats.percent : 20 },
  ];

  const chartData = activeView === "weekly" ? weeklyData : monthlyData;

  const averageValue = Math.round(
    chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length,
  );

  return (
    <div className="bg-[#0f172a] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="app-container pb-24 px-6 lg:px-12">
        {/* Header with Back Button */}
        <header className="pt-12 flex items-center gap-4 z-10 lg:pt-16">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          >
            <span className="material-icons-round">chevron_left</span>
          </Link>
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
            {t("user_profile")}
          </h1>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:mt-12 mt-8 items-start">
          {/* Profile Card (Left on Desktop) */}
          <section className="lg:col-span-5">
            <div className="bg-surface-dark rounded-[3rem] p-10 lg:p-12 border border-white/5 shadow-2xl flex flex-col items-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

              <div className="relative">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-[2.5rem] bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary/40 p-1.5 transition-transform group-hover:scale-105 duration-500">
                  <div className="w-full h-full rounded-[2rem] bg-primary/20 flex items-center justify-center relative">
                    {user?.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="material-icons-round text-primary text-6xl lg:text-8xl">
                        person
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl border-4 border-[#0f172a] transition-transform hover:scale-110 active:scale-90"
                >
                  <span className="material-icons-round text-lg">edit</span>
                </button>
              </div>

              <h2 className="mt-8 text-2xl lg:text-3xl font-black">
                {user?.displayName || "Pengguna Baru"}
              </h2>
              <p className="text-slate-500 font-bold text-sm lg:text-base mt-2">
                {user?.email}
              </p>

              <div className="mt-10 flex gap-8 w-full border-t border-white/5 pt-10">
                <div className="flex-1 text-center">
                  <p className="text-3xl font-black text-primary">
                    {stats.total}
                  </p>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-2">
                    Tugas
                  </p>
                </div>
                <div className="w-px bg-white/5 h-12 self-center"></div>
                <div className="flex-1 text-center">
                  <p className="text-3xl font-black text-accent-blue">
                    {stats.streak}
                  </p>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-2">
                    Streak
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Sections (Integrated) */}
          <div className="lg:col-span-12 mt-12 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <h2 className="text-2xl lg:text-3xl font-black">
                Analisis Aktivitas
              </h2>
              <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
                <button
                  onClick={() => setActiveView("weekly")}
                  className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeView === "weekly" ? "bg-primary text-white shadow-lg primary-glow" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Mingguan
                </button>
                <button
                  onClick={() => setActiveView("monthly")}
                  className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeView === "monthly" ? "bg-primary text-white shadow-lg primary-glow" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Bulanan
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Weekly/Monthly Chart */}
              <div className="lg:col-span-8 bg-surface-dark rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12 relative z-10">
                  <div>
                    <h3 className="text-xl font-black mb-1">
                      Aktivitas{" "}
                      {activeView === "weekly" ? "Mingguan" : "Bulanan"}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <p className="text-xs text-slate-500 font-bold">
                        Total produktif:{" "}
                        {activeView === "weekly" ? "42 Jam" : "168 Jam"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 text-center flex flex-col items-center">
                    <p className="text-xl font-black text-emerald-500 leading-none">
                      {activeView === "weekly" ? "+12.5%" : "+8.4%"}
                    </p>
                    <p className="text-[9px] text-emerald-500/70 font-black uppercase tracking-tight mt-1">
                      Menaik
                    </p>
                  </div>
                </div>

                <div className="relative h-64 md:h-80 w-full z-10">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 py-2">
                    {[100, 75, 50, 25, 0].map((level) => (
                      <div
                        key={level}
                        className="w-full border-t border-slate-400 flex items-center"
                      >
                        <span className="text-[8px] -ml-8 font-black">
                          {level}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-primary/30 z-20 transition-all duration-700"
                    style={{ bottom: `${averageValue}%` }}
                  >
                    <span className="absolute -top-6 right-0 bg-primary/20 text-primary text-[7px] font-black px-1.5 py-0.5 rounded-md">
                      AVG: {averageValue}%
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-end justify-between gap-1 md:gap-4 pt-4">
                    {chartData.map((data, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center group h-full"
                      >
                        <div className="w-full h-full relative flex items-end">
                          <div className="absolute inset-0 bg-white/5 rounded-lg md:rounded-2xl"></div>
                          <div
                            className="w-full bg-gradient-to-t from-primary to-primary-light rounded-lg md:rounded-2xl transition-all duration-1000 ease-out shadow-lg primary-glow opacity-80 group-hover:opacity-100 relative z-10"
                            style={{ height: `${data.value}%` }}
                          ></div>
                        </div>
                        <p className="mt-4 text-[9px] md:text-[11px] font-black text-slate-400 group-hover:text-primary transition-colors uppercase tracking-widest text-center">
                          {data.day}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intensity Section */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-3xl primary-glow relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
                  <h3 className="text-xl font-black mb-6 relative z-10">
                    Target {activeView === "weekly" ? "Mingguan" : "Februari"}
                  </h3>
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="white"
                          strokeWidth="12"
                          strokeDasharray="351.85"
                          strokeDashoffset={
                            351.85 - (351.85 * stats.percent) / 100
                          }
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black">
                          {stats.percent}%
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 font-bold text-center">
                      {stats.completed} / {stats.total} Selesai
                    </p>
                  </div>
                </div>

                <div className="bg-surface-dark rounded-[2.5rem] p-6 md:p-8 border border-white/5 shadow-sm overflow-hidden flex-1">
                  <div className="flex flex-col gap-4 mb-6">
                    <h3 className="text-lg font-black">Intensitas Bulanan</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Kurang
                      </span>
                      <div className="flex gap-1">
                        {[0.1, 0.3, 0.6, 0.9].map((op, i) => (
                          <div
                            key={i}
                            className="w-2.5 h-2.5 rounded-sm bg-primary"
                            style={{ opacity: op }}
                          ></div>
                        ))}
                      </div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Produktif
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 h-full">
                    {/* Assuming heatmapData is defined elsewhere or will be added */}
                    {/* For now, using a placeholder */}
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-[4px] bg-white/5 opacity-10"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Selection */}
            <section className="mt-12">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl lg:text-3xl font-black">
                  Tema Aplikasi
                </h3>
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full border border-primary/20">
                  {availableThemes.length} Pilihan
                </span>
              </div>
              <ThemePicker />
            </section>

            {/* Language Selection */}
            <section className="mt-12">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl lg:text-3xl font-black">
                  {t("app_language")}
                </h3>
              </div>
              <LanguagePicker />
            </section>

            {/* Menu Items */}
            <section className="space-y-4 pt-10">
              <h3 className="text-xl font-black mb-6">Account Settings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: "notifications_none",
                    label: "Notifikasi",
                    sub: "Atur pengingat dan pesan",
                    color: "bg-orange-500/10 text-orange-500",
                    href: "/notifications",
                  },
                  {
                    icon: "security",
                    label: "Keamanan & Privasi",
                    sub: "Lindungi data ceritamu",
                    color: "bg-emerald-500/10 text-emerald-500",
                    href: "/settings",
                  },
                  {
                    icon: "help_outline",
                    label: "Pusat Bantuan",
                    sub: "Tanya apa saja tentang Tangtang",
                    color: "bg-blue-500/10 text-blue-500",
                    href: "/settings",
                  },
                  {
                    icon: "info_outline",
                    label: "Tentang Tangtang",
                    sub: "Cari tahu lebih lanjut",
                    color: "bg-slate-500/10 text-slate-500",
                    href: "/settings",
                  },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-6 p-6 bg-surface-dark border border-white/5 rounded-[2.5rem] hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}
                    >
                      <span className="material-icons-round text-2xl">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="block font-black text-lg">
                        {item.label}
                      </span>
                      <span className="block text-xs text-slate-400 font-bold mt-0.5 tracking-tight">
                        {item.sub}
                      </span>
                    </div>
                    <span className="material-icons-round text-slate-300 transition-transform group-hover:translate-x-2">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Personal Posts Feed */}
            <section className="mt-16">
              <h2 className="text-2xl lg:text-3xl font-black mb-8">
                Diskusi Saya
              </h2>
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-surface-dark rounded-3xl p-6 border border-white/5 shadow-xl group hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">
                          {post.tag || "General"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {post.createdAt?.toDate().toLocaleDateString() ||
                            "Baru"}
                        </span>
                      </div>
                      <p className="text-sm font-bold line-clamp-3 mb-6">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <span className="material-icons-round text-sm">
                            favorite
                          </span>
                          <span className="text-xs font-black">
                            {post.likes || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-icons-round text-sm">
                            chat_bubble
                          </span>
                          <span className="text-xs font-black">
                            {post.comments || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 rounded-3xl p-12 text-center border border-dashed border-white/10">
                  <p className="text-slate-500 font-bold">
                    Belum ada diskusi yang kamu buat.
                  </p>
                  <Link
                    href="/diskusi"
                    className="text-primary font-black mt-2 inline-block hover:underline"
                  >
                    Mulai Berdiskusi →
                  </Link>
                </div>
              )}
            </section>

            {/* Logout Button */}
            <section className="pt-6">
              <button
                onClick={() => logout()}
                className="w-full py-6 bg-red-500 text-white font-black rounded-3xl shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-95 lg:text-lg uppercase tracking-widest text-sm"
              >
                <span className="material-icons-round">logout</span>
                <span>Keluar Akun</span>
              </button>
              <p className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
                Version 1.0.4 - Build 2026
              </p>
            </section>
          </div>
        </div>

        <Navbar />
        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white"
              >
                <span className="material-icons-round">close</span>
              </button>

              <h3 className="text-xl font-black mb-8">Edit Profil</h3>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-primary transition-all overflow-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    URL Foto Profil
                  </label>
                  <input
                    type="text"
                    value={editedPhoto}
                    onChange={(e) => setEditedPhoto(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-primary transition-all overflow-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest text-xs mt-4"
                >
                  {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
