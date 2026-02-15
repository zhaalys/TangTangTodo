"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageType = "id" | "en" | "ja" | "ko" | "ar";

interface Translations {
  [key: string]: {
    [key in LanguageType]: string;
  };
}

export const translations: Translations = {
  // Navbar
  home: { id: "Beranda", en: "Home", ja: "ホーム", ko: "홈", ar: "الرئيسية" },
  focus: {
    id: "Focus",
    en: "Focus",
    ja: "フォーカス",
    ko: "포커스",
    ar: "تركيز",
  },
  tasks: { id: "Tugas", en: "Tasks", ja: "タスク", ko: "작업", ar: "مهام" },
  profile: {
    id: "Profil",
    en: "Profile",
    ja: "プロフィール",
    ko: "프로필",
    ar: "الملف الشخصي",
  },

  // Dashboard
  hello: {
    id: "Halo",
    en: "Hello",
    ja: "こんにちは",
    ko: "안녕하세요",
    ar: "مرحباً",
  },
  today_tasks_count: {
    id: "Ada {count} tugas hari ini",
    en: "You have {count} tasks today",
    ja: "今日は{count}件のタスクがあります",
    ko: "오늘 {count}개의 작업이 있습니다",
    ar: "لديك {count} مهام اليوم",
  },
  finished: {
    id: "Selesai",
    en: "Finished",
    ja: "完了",
    ko: "완료",
    ar: "مكتمل",
  },
  pending: {
    id: "Tertunda",
    en: "Pending",
    ja: "保留中",
    ko: "대기 중",
    ar: "قيد الانتظar",
  },
  upcoming_tasks: {
    id: "Tugas Mendatang",
    en: "Upcoming Tasks",
    ja: "今後のタスク",
    ko: "예정된 작업",
    ar: "المهام القادمة",
  },
  view_all: {
    id: "Lihat Semua",
    en: "View All",
    ja: "すべて見る",
    ko: "모두 보기",
    ar: "عرض الكل",
  },
  agenda_today: {
    id: "Agenda Hari Ini",
    en: "Today's Agenda",
    ja: "今日の予定",
    ko: "오늘의 일정",
    ar: "جدول اليوم",
  },
  agenda_empty: {
    id: "Agenda Kosong",
    en: "Empty Agenda",
    ja: "予定なし",
    ko: "일정 없음",
    ar: "لا يوجد جدول",
  },
  motivation: {
    id: "Motivation",
    en: "Motivation",
    ja: "モチベーション",
    ko: "동기 부여",
    ar: "تحفيز",
  },

  // Focus Page
  ready_focus: {
    id: "Siap untuk fokus, {name}?",
    en: "Ready for focus, {name}?",
    ja: "集中する準備はできていますか、{name}？",
    ko: "집중할 준비가 되셨나요, {name}님?",
    ar: "هل أنت مستعد للتركيز، {name}؟",
  },
  start: { id: "Start", en: "Start", ja: "スタート", ko: "시작", ar: "ابدأ" },
  pause: {
    id: "Pause",
    en: "Pause",
    ja: "一時停止",
    ko: "일시정지",
    ar: "توقف",
  },
  reset: {
    id: "Reset",
    en: "Reset",
    ja: "リセット",
    ko: "초기화",
    ar: "إعادة ضبط",
  },
  settings: {
    id: "Settings",
    en: "Settings",
    ja: "設定",
    ko: "설정",
    ar: "الإعدادات",
  },
  duration: {
    id: "Durasi Timer (Menit)",
    en: "Timer Duration (Minutes)",
    ja: "タイマー時間（分）",
    ko: "타이머 기간(분)",
    ar: "مدة المؤقت (دقائق)",
  },
  select_music: {
    id: "Pilih Musik",
    en: "Select Music",
    ja: "音楽を選択",
    ko: "음악 선택",
    ar: "اختر الموسيقى",
  },
  select_atmosphere: {
    id: "Pilih Atmosfer",
    en: "Select Atmosphere",
    ja: "雰囲気を選択",
    ko: "분위기 선택",
    ar: "اختر الأجواء",
  },
  save_settings: {
    id: "Simpan Pengaturan",
    en: "Save Settings",
    ja: "設定を保存",
    ko: "설정 저장",
    ar: "حفظ الإعدادات",
  },

  // Profile
  user_profile: {
    id: "Profil Pengguna",
    en: "User Profile",
    ja: "ユーザープロフィール",
    ko: "사용자 프로필",
    ar: "ملف المستخدم",
  },
  edit_profile: {
    id: "Edit Profil",
    en: "Edit Profile",
    ja: "プロフィールの編集",
    ko: "프로필 편집",
    ar: "تعديل الملف الشخصي",
  },
  app_theme: {
    id: "Tema Aplikasi",
    en: "App Theme",
    ja: "アプリのテーマ",
    ko: "앱 테마",
    ar: "سمة التطبيق",
  },
  app_language: {
    id: "Bahasa Aplikasi",
    en: "App Language",
    ja: "アプリの言語",
    ko: "لغة التطبيق",
    ar: "لغة التطبيق",
  },
  my_discussions: {
    id: "Diskusi Saya",
    en: "My Discussions",
    ja: "マイディスカッション",
    ko: "내 토론",
    ar: "نقاشاتي",
  },
  logout: {
    id: "Keluar Akun",
    en: "Logout",
    ja: "ログアウト",
    ko: "로그아웃",
    ar: "تسجيل الخروج",
  },
};

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageType>("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("app-lang") as LanguageType;
    if (savedLang && translations.home[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem("app-lang", lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>) => {
    let translation = translations[key]?.[language] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        translation = translation.replace(`{${k}}`, String(v));
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
