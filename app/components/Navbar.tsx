"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "./Brand";
import { useLanguage } from "../../context/LanguageContext";

const Navbar = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  interface NavItem {
    href: string;
    icon: string;
    label: string;
    isCenter?: boolean;
    desktopOnly?: boolean;
  }

  const navItems: NavItem[] = [
    { href: "/dashboard", icon: "home", label: t("home") },
    { href: "/focus", icon: "timer", label: t("focus") },
    { href: "/tasks", icon: "task_alt", label: t("tasks") },
    { href: "/add", icon: "add", label: "Add", isCenter: true },
    { href: "/diskusi", icon: "forum", label: "Diskusi" },
    { href: "/profile", icon: "person", label: t("profile") },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[4.5rem] bg-[#0f172a]/95 backdrop-blur-2xl border-t border-white/5 flex justify-between items-center px-4 z-50">
        {navItems
          .filter((item) => !item.desktopOnly)
          .map((item) => {
            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-12 h-12 -mt-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-[3px] border-[#0f172a] transition-transform hover:scale-110 active:scale-95 z-10"
                >
                  <span className="material-icons-round text-white text-3xl">
                    {item.icon}
                  </span>
                </Link>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-slate-400 dark:text-slate-500 hover:text-primary"
                }`}
              >
                <span
                  className={`material-icons-round text-xl ${isActive ? "fill-primary" : ""}`}
                >
                  {item.icon}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-center truncate w-12">
                  {item.label}
                </span>
              </Link>
            );
          })}
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-[280px] bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-white/5 flex-col p-8 z-50">
        <Link
          href="/dashboard"
          className="mb-12 hover:opacity-80 transition-opacity"
        >
          <Brand />
        </Link>

        <div className="space-y-3 flex-1 overflow-y-auto scroll-hide">
          {navItems
            .filter((i) => !i.isCenter)
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-black transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-xl shadow-primary/20 primary-glow"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="material-icons-round">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </div>

        <div className="mt-8">
          <Link
            href="/add"
            className="w-full py-4 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl shadow-primary/20 primary-glow hover:scale-[1.02] transition-all active:scale-95"
          >
            <span className="material-icons-round">add</span>
            <span>Tugas Baru</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
