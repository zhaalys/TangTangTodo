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

  // Community
  community_title: {
    id: "Diskusi Komunitas",
    en: "Community Discussion",
    ja: "コミュニティの議論",
    ko: "커뮤니티 토론",
    ar: "نقاش المجتمع",
  },
  community_subtitle: {
    id: "Berbagi & Bertumbuh Bersama",
    en: "Share & Grow Together",
    ja: "共に分かち合い、成長する",
    ko: "함께 나누고 성장하기",
    ar: "شارك وانمو معاً",
  },
  post_placeholder: {
    id: "Apa yang ada di pikiranmu hari ini?",
    en: "What's on your mind today?",
    ja: "今日は何を考えていますか？",
    ko: "오늘 무슨 생각을 하시나요?",
    ar: "ماذا يدور في ذهنك اليوم؟",
  },
  post_image: { id: "Foto", en: "Image", ja: "画像", ko: "이미지", ar: "صورة" },
  post_poll: {
    id: "Poling",
    en: "Poll",
    ja: "投票",
    ko: "투표",
    ar: "استطلاع",
  },
  post_send: {
    id: "Kirim Post",
    en: "Send Post",
    ja: "投稿する",
    ko: "게시물 보내기",
    ar: "نشر",
  },
  post_sending: {
    id: "Mengirim...",
    en: "Sending...",
    ja: "送信中...",
    ko: "보내는 중...",
    ar: "جاري الإرسال...",
  },
  popular_topics: {
    id: "Topik Populer",
    en: "Popular Topics",
    ja: "人気のトピック",
    ko: "인기 주제",
    ar: "المواضيع الشائعة",
  },
  weekly_challenge: {
    id: "Tantangan Mingguan",
    en: "Weekly Challenge",
    ja: "週間チャレンジ",
    ko: "주간 챌린지",
    ar: "التحدي الأسبوعي",
  },
  join_challenge: {
    id: "Gabung Tantangan",
    en: "Join Challenge",
    ja: "チャレンジに参加",
    ko: "챌린지 참여",
    ar: "انضم للتحدي",
  },
  votes: {
    id: "{count} Suara",
    en: "{count} Votes",
    ja: "{count} 票",
    ko: "{count} 투표",
    ar: "{count} أصوات",
  },
  voted: {
    id: "Sudah Memilih",
    en: "Already Voted",
    ja: "投票済み",
    ko: "이미 투표함",
    ar: "تم التصويت",
  },
  not_voted: {
    id: "Belum Memilih",
    en: "Not Voted Yet",
    ja: "未投票",
    ko: "아직 투표하지 않음",
    ar: "لم يتم التصويت بعد",
  },

  // Tasks
  all_tasks: {
    id: "Semua Tugas",
    en: "All Tasks",
    ja: "すべてのタスク",
    ko: "모든 작업",
    ar: "جميع المهام",
  },
  task_title: {
    id: "Judul Tugas",
    en: "Task Title",
    ja: "タスクタイトル",
    ko: "작업 제목",
    ar: "عنوان المهمة",
  },
  task_time: { id: "Waktu", en: "Time", ja: "時間", ko: "시간", ar: "الوقت" },
  task_category: {
    id: "Kategori",
    en: "Category",
    ja: "カテゴリー",
    ko: "카테고리",
    ar: "الفئة",
  },
  task_important: {
    id: "Tandai sebagai Penting",
    en: "Mark as Important",
    ja: "重要としてマーク",
    ko: "중요로 표시",
    ar: "تميز كمهم",
  },
  task_save: {
    id: "Simpan Tugas",
    en: "Save Task",
    ja: "タスクを保存",
    ko: "작업 저장",
    ar: "حفظ المهمة",
  },
  task_cancel: {
    id: "Batal",
    en: "Cancel",
    ja: "キャンセル",
    ko: "취소",
    ar: "إلغاء",
  },
  task_edit: {
    id: "Edit Tugas",
    en: "Edit Task",
    ja: "タスクを編集",
    ko: "작업 편집",
    ar: "تعديل المهمة",
  },
  task_delete: { id: "Hapus", en: "Delete", ja: "削除", ko: "삭제", ar: "حذف" },
  task_empty: {
    id: "Tidak ada tugas",
    en: "No tasks found",
    ja: "タスクが見つかりません",
    ko: "작업을 찾을 수 없습니다",
    ar: "لم يتم العثور على مهام",
  },
  task_filter_all: {
    id: "Semua",
    en: "All",
    ja: "すべて",
    ko: "전체",
    ar: "الكل",
  },
  task_filter_today: {
    id: "Hari Ini",
    en: "Today",
    ja: "今日",
    ko: "오늘",
    ar: "اليوم",
  },
  task_filter_important: {
    id: "Penting",
    en: "Important",
    ja: "重要",
    ko: "중요",
    ar: "مهم",
  },
  task_filter_finished: {
    id: "Selesai",
    en: "Finished",
    ja: "完了",
    ko: "완료",
    ar: "مكتمل",
  },

  // Jurnal
  jurnal_title: {
    id: "Jurnal Tangtang",
    en: "Tangtang Journal",
    ja: "タンタンの日記",
    ko: "탕탕 저널",
    ar: "مذكرة تانغ تانغ",
  },
  jurnal_subtitle: {
    id: "Petualangan Hari Ini",
    en: "Today's Adventure",
    ja: "今日の冒険",
    ko: "오늘의 모험",
    ar: "مغامرة اليوم",
  },
  jurnal_calendar: {
    id: "Kalender",
    en: "Calendar",
    ja: "カレンダー",
    ko: "달력",
    ar: "التقويم",
  },
  jurnal_mood: {
    id: "Suasana Hati",
    en: "Mood",
    ja: "気分",
    ko: "기분",
    ar: "المزاج",
  },
  jurnal_entry_title: {
    id: "Cerita Hari Ini",
    en: "Today's Story",
    ja: "今日の物語",
    ko: "오늘의 이야기",
    ar: "قصة اليوم",
  },
  jurnal_entry_placeholder: {
    id: "Tulis petualanganmu di sini...",
    en: "Write your adventure here...",
    ja: "ここにあなたの冒険を書いてください...",
    ko: "여기에 모험을 기록하세요...",
    ar: "اكتب مغامرتك هنا...",
  },
  jurnal_save: {
    id: "Simpan Cerita",
    en: "Save Story",
    ja: "日記を保存",
    ko: "이야기 저장",
    ar: "حفظ القصة",
  },
  jurnal_saved_msg: {
    id: "Cerita hari ini berhasil disimpan!",
    en: "Today's story saved successfully!",
    ja: "今日の物語が保存されました！",
    ko: "오늘의 이야기가 성공적으로 저장되었습니다!",
    ar: "تم حفظ قصة اليوم بنجاح!",
  },
  mood_happy: { id: "Senang", en: "Happy", ja: "幸せ", ko: "행복", ar: "سعيد" },
  mood_excited: {
    id: "Semangat",
    en: "Excited",
    ja: "ワクワク",
    ko: "신남",
    ar: "متحمس",
  },
  mood_sleepy: {
    id: "Ngantuk",
    en: "Sleepy",
    ja: "眠い",
    ko: "졸림",
    ar: "نعسان",
  },
  mood_sad: { id: "Sedih", en: "Sad", ja: "悲しい", ko: "悲しい", ar: "حزين" },

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
    ar: "قيد الانتظار",
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

  // Focus
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

  // Quotes (7 items for daily rotation)
  quote_1: {
    id: "Fokus pada proses, bukan hasil akhir. Setiap langkah kecil membawamu lebih dekat.",
    en: "Focus on the process, not the outcome. Every small step brings you closer.",
    ja: "プロセスに集中し、結果にはこだわらない。小さな一歩一歩があなたを近づけます。",
    ko: "결과가 아닌 과정에 집중하세요. 모든 작은 발걸음이 여러분을 더 가깝게 만듭니다.",
    ar: "ركز على العملية، وليس النتيجة. كل خطوة صغيرة تقربك أكثر.",
  },
  quote_2: {
    id: "Jangan biarkan kemarin merenggut terlalu banyak dari hari ini.",
    en: "Don't let yesterday take up too much of today.",
    ja: "昨日に今日を奪わせないでください。",
    ko: "어제가 오늘의 너무 많은 부분을 차지하게 하지 마세요.",
    ar: "لا تدع الأمس يأخذ الكثير من اليوم.",
  },
  quote_3: {
    id: "Waktu paling tepat untuk mulai adalah sekarang. Tangtang hari ini dengan maksimal!",
    en: "The best time to start is now. Challenge today to the fullest!",
    ja: "始めるのに最適な時期は今です。今日を最大限に活用してください！",
    ko: "시작하기 가장 좋은 때는 지금입니다. 오늘을 최대한 활용하세요!",
    ar: "أفضل وقت للبدء هو الآن. تحدَّ اليوم إلى أقصى حد!",
  },
  quote_4: {
    id: "Disiplin adalah jembatan antara cita-cita dan pencapaian nyata.",
    en: "Discipline is the bridge between goals and accomplishment.",
    ja: "規律は目標と達成の間の架け橋である。",
    ko: "규율은 목표와 성취 사이의 다리입니다.",
    ar: "الانضباط هو الجسر بين الأهداف والإنجاز.",
  },
  quote_5: {
    id: "Produktivitas bukan soal sibuk, tapi soal kemajuan yang nyata.",
    en: "Productivity is not about being busy, but about making real progress.",
    ja: "生産性とは忙しいことではなく、真の進歩を遂げることです。",
    ko: "생산성은 바쁜 것이 아니라 실질적인 진전을 이루는 것입니다.",
    ar: "الإنتاجية لا تتعلق بالانشغال، بل بتحقيق تقدم حقيقي.",
  },
  quote_6: {
    id: "Satu-satunya cara melakukan pekerjaan besar adalah mencintai apa yang kamu kerjakan.",
    en: "The only way to do great work is to love what you do.",
    ja: "素晴らしい仕事をする唯一の方法は、自分のしていることを愛することです。",
    ko: "훌륭한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것입니다.",
    ar: "الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.",
  },
  quote_7: {
    id: "Istirahatlah jika lelah, jangan menyerah. Besok adalah peluang baru.",
    en: "Rest if you are tired, but never give up. Tomorrow is a new opportunity.",
    ja: "疲れたら休んでください、でも決して諦めないでください。明日は新しいチャンスです。",
    ko: "피곤하면 쉬되, 절대 포기하지 마세요. 내일은 새로운 기회입니다.",
    ar: "استرح إذا كنت متعباً، لكن لا تستسلم أبداً. غداً فرصة جديدة.",
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
