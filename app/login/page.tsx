"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Brand from "../components/Brand";
import { useAuth } from "../../context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (activeTab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(userCredential.user, {
          displayName: fullName,
        });
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat otentikasi");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal masuk dengan Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Success Animation Overlay */}
      {success && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a] flex flex-col items-center justify-center animate-in fade-in duration-500 px-6 text-center">
          <div className="relative w-32 h-32 md:w-48 md:h-48 bg-primary rounded-full shadow-[0_0_100px_rgba(13,89,242,0.5)] flex items-center justify-center animate-in zoom-in duration-1000 ease-out">
            <Image
              src="/tangtanglogo1.png"
              alt="Tangtang Logo"
              width={200}
              height={200}
              className="object-contain scale-125 animate-pulse"
            />
          </div>
          <h2 className="mt-12 text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white animate-in slide-in-from-bottom-8 duration-700 delay-300 w-full">
            Tangtang
          </h2>
          <p className="mt-4 text-primary font-bold tracking-[0.3em] uppercase text-xs md:text-sm animate-in fade-in duration-1000 delay-500">
            Getting things ready...
          </p>
        </div>
      )}

      {/* Absolute Branding - Pojok Kiri (Desktop Only) */}
      <div className="hidden md:block absolute top-6 left-6 md:top-10 md:left-10 z-50">
        <Brand className="scale-100 md:scale-110 lg:scale-125 transform origin-left" />
      </div>
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/10 blur-[120px] rounded-full -z-10"></div>

      <main className="auth-container flex flex-col items-center justify-center md:flex-row md:gap-12 lg:gap-20 px-6 md:px-12 lg:px-20 overflow-y-auto md:overflow-visible py-16 md:py-0">
        {/* Branding Section (Title & Mascot) */}
        <div className="mb-8 md:mb-0 text-center md:text-left md:w-1/2 animate-in fade-in zoom-in duration-700">
          <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 relative bg-primary rounded-full mx-auto md:mx-0 mb-4 md:mb-6 shadow-3xl primary-glow overflow-hidden transform md:-rotate-6 hover:rotate-0 transition-transform duration-500 cursor-pointer mt-4 md:mt-0">
            <Image
              src="/tangtanglogo1.png"
              alt="Tangtang Logo"
              fill
              className="object-cover scale-150"
            />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-2 md:mb-4">
            Tangtang
          </h1>
          <p className="text-slate-500 text-sm md:text-lg lg:text-xl font-bold max-w-[240px] md:max-w-none mx-auto md:mx-0 leading-relaxed mb-4 md:mb-6">
            Produktivitas untuk <br className="hidden md:block" /> generasi baru
          </p>

          {/* Desktop Benefits List */}
          <div className="hidden md:flex flex-col gap-3 md:gap-4 mt-6 md:mt-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            {[
              { icon: "check_circle", text: "Kelola tugas cerdas" },
              { icon: "analytics", text: "Pantau progres visual" },
              { icon: "groups", text: "Diskusi komunitas" },
            ].map(
              (b, i) =>
                b && (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/5">
                      <span className="material-icons-round text-lg">
                        {b.icon}
                      </span>
                    </div>
                    <span className="text-base font-black text-slate-700 dark:text-slate-300 tracking-tight">
                      {b.text}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Auth Box */}
        <div className="w-full max-w-[400px] md:w-1/2 flex flex-col items-center z-10 animate-in slide-in-from-right-12 duration-1000">
          <div className="w-full bg-slate-900/50 dark:bg-surface-dark/80 backdrop-blur-2xl border border-white/5 p-5 md:p-8 lg:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {/* Tab Switcher */}
            <div className="w-full bg-white/5 backdrop-blur-md p-1 rounded-2xl mb-8 flex relative border border-white/5">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-4 text-sm font-black rounded-[1.2rem] transition-all duration-300 uppercase tracking-widest ${activeTab === "login" ? "bg-primary text-white shadow-xl" : "text-slate-400 hover:text-slate-200"}`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-4 text-sm font-black rounded-[1.2rem] transition-all duration-300 uppercase tracking-widest ${activeTab === "signup" ? "bg-primary text-white shadow-xl" : "text-slate-400 hover:text-slate-200"}`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Section */}
            <div className="w-full space-y-6">
              <form onSubmit={handleAuth} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                    {error}
                  </div>
                )}

                {activeTab === "signup" && (
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="material-icons-round absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
                        person_outline
                      </span>
                      <input
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border-2 border-transparent focus:border-primary focus:bg-white/10 focus:outline-none transition-all font-bold text-lg text-white"
                        placeholder="Your Name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={activeTab === "signup"}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-icons-round absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">
                      mail_outline
                    </span>
                    <input
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border-2 border-transparent focus:border-primary focus:bg-white/10 focus:outline-none transition-all font-bold text-lg text-white"
                      placeholder="hello@tangtang.app"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-icons-round absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl md:text-2xl">
                      lock_open
                    </span>
                    <input
                      className="w-full pl-12 md:pl-14 pr-12 md:pr-14 py-4 md:py-5 rounded-2xl bg-white/5 border-2 border-transparent focus:border-primary focus:bg-white/10 focus:outline-none transition-all font-bold text-base md:text-lg text-white"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="material-icons-round absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl hover:text-primary transition-colors"
                    >
                      {showPassword ? "visibility" : "visibility_off"}
                    </button>
                  </div>
                  {activeTab === "login" && (
                    <div className="text-right px-2 mt-2">
                      <a
                        className="text-xs font-black text-primary hover:underline underline-offset-4"
                        href="#"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 mt-8 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm lg:text-base disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>
                        {activeTab === "login" ? "Sign In" : "Create Account"}
                      </span>
                      <span className="material-icons-round text-xl">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Social Divider */}
            <div className="w-full flex items-center gap-4 my-10">
              <div className="h-px flex-1 bg-white/5"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Or connect with
              </span>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            {/* Social Logins */}
            <div className="flex justify-center w-full">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center gap-4 px-10 py-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:shadow-xl active:scale-95 group disabled:opacity-50"
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-white/80">
                  Google
                </span>
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest max-w-[300px] leading-relaxed">
            By continuing, you agree to Tangtang's <br />
            <a className="text-primary hover:underline" href="#">
              Terms
            </a>{" "}
            &{" "}
            <a className="text-primary hover:underline" href="#">
              Privacy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
