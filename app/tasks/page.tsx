"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

interface Task {
  id: string; // Changed to string for Firestore doc ID
  title: string;
  time: string;
  completed: boolean;
  isPenting: boolean;
  category: string;
  isToday: boolean;
  userId: string;
}

const TasksContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // New/Edit task form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Project");
  const [newTime, setNewTime] = useState("09:00");
  const [newIsPenting, setNewIsPenting] = useState(false);

  const categories = [
    "Project",
    "Kerja",
    "Kesehatan",
    "Personal",
    "Belanja",
    "Edukasi",
    "Hobi",
    "Keuangan",
    "Sosial",
    "Rumah",
    "Keluarga",
    "Ibadah",
    "Transport",
    "Lifestyle",
    "Urgent",
    "Lainnya",
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setIsAddOpen(true);
    }
  }, [searchParams]);

  const filters = ["Semua", "Hari Ini", "Penting", "Selesai"];

  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case "Hari Ini":
        return tasks.filter((t) => t.isToday);
      case "Penting":
        return tasks.filter((t) => t.isPenting);
      case "Selesai":
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [activeFilter, tasks]);

  const toggleTask = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const taskRef = doc(db, "tasks", id);
      const task = tasks.find((t) => t.id === id);
      if (task) {
        await updateDoc(taskRef, {
          completed: !task.completed,
        });
      }
    } catch (err) {
      console.error("Gagal update tugas", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setIsDetailOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Gagal hapus tugas", err);
    }
  };

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const addTask = async () => {
    if (!newTitle.trim() || !user) return;
    try {
      await addDoc(collection(db, "tasks"), {
        title: newTitle,
        time: newTime,
        category: newCategory,
        isPenting: newIsPenting,
        completed: false,
        isToday: true,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      console.error("Gagal menambah tugas", err);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewCategory("Project");
    setNewTime("09:00");
    setNewIsPenting(false);
  };

  const handleEditOpen = () => {
    if (!selectedTask) return;
    setNewTitle(selectedTask.title);
    setNewCategory(selectedTask.category);
    setTimeSafe(selectedTask.time);
    setNewIsPenting(selectedTask.isPenting);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const setTimeSafe = (timeStr: string) => {
    if (timeStr.includes(":")) {
      const parts = timeStr.split(":");
      setNewTime(`${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`);
    } else {
      setNewTime("09:00");
    }
  };

  const updateTask = async () => {
    if (!selectedTask || !newTitle.trim()) return;
    try {
      const taskRef = doc(db, "tasks", selectedTask.id);
      await updateDoc(taskRef, {
        title: newTitle,
        category: newCategory,
        time: newTime,
        isPenting: newIsPenting,
      });
      setIsEditOpen(false);
      setSelectedTask(null);
      resetForm();
    } catch (err) {
      console.error("Gagal perbarui tugas", err);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="app-container pb-24 px-6 lg:px-12">
        <header className="pt-12 flex items-center gap-4 z-10 lg:pt-16">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <span className="material-icons-round">chevron_left</span>
          </Link>
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
            Semua Tugas
          </h1>
        </header>

        <div className="mt-8 flex gap-3 overflow-x-auto scroll-hide lg:mt-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-primary text-white shadow-lg primary-glow"
                  : "bg-white/5 border border-white/10 text-slate-500 hover:border-primary/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-6 lg:mt-12">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => openDetail(task)}
                className={`flex gap-4 p-5 rounded-[2rem] bg-white dark:bg-surface-dark border items-center shadow-sm group hover:shadow-xl transition-all cursor-pointer ${task.completed ? "opacity-60 bg-slate-100 dark:bg-white/5 border-transparent" : "border-slate-100 dark:border-white/5"}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${task.completed ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : task.isPenting ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}
                >
                  <span className="material-icons-round text-2xl">
                    {task.completed
                      ? "task_alt"
                      : task.isPenting
                        ? "auto_awesome"
                        : "schedule"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-black text-lg tracking-tight ${task.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"}`}
                    >
                      {task.title}
                    </p>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${task.completed ? "bg-slate-200 dark:bg-white/5 text-slate-400" : "bg-primary/10 text-primary"}`}
                    >
                      {task.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {task.time}
                  </p>
                </div>
                <button
                  onClick={(e) => toggleTask(e, task.id)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30" : "border-slate-200 dark:border-white/10 group-hover:border-primary"}`}
                >
                  {task.completed && (
                    <span className="material-icons-round text-white text-[20px]">
                      check
                    </span>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30 text-center space-y-4">
              <span className="material-icons-round text-7xl">task_alt</span>
              <p className="font-black text-sm uppercase tracking-widest">
                Tidak ada tugas
              </p>
            </div>
          )}
        </div>

        {/* Detail Modal Overlay */}
        {(isDetailOpen || isAddOpen || isEditOpen) && (
          <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
        )}

        {/* Task Detail Modal */}
        {isDetailOpen && selectedTask && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="w-full max-w-[450px] bg-white dark:bg-surface-dark rounded-[3rem] p-10 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-300 lg:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">
                    {selectedTask.category}
                  </span>
                  <h2
                    className={`text-3xl lg:text-4xl font-black leading-tight ${selectedTask.completed ? "line-through opacity-50" : ""}`}
                  >
                    {selectedTask.title}
                  </h2>
                </div>
                <div
                  className={`w-16 h-16 rounded-3xl flex items-center justify-center ${selectedTask.completed ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"}`}
                >
                  <span className="material-icons-round text-3xl">
                    {selectedTask.completed ? "task_alt" : "assignment"}
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-500 font-bold text-lg">
                  <span className="material-icons-round">schedule</span>
                  <span>Jam {selectedTask.time}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-bold text-lg">
                  <span className="material-icons-round text-amber-500">
                    stars
                  </span>
                  <span>
                    {selectedTask.isPenting ? "Tugas Penting" : "Tugas Reguler"}
                  </span>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-4">
                <button
                  onClick={handleEditOpen}
                  className="py-5 rounded-2xl bg-slate-100 dark:bg-white/5 font-black uppercase text-xs tracking-widest hover:bg-slate-200 text-primary"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(selectedTask.id)}
                  className="py-5 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
              <button
                onClick={async () => {
                  try {
                    const taskRef = doc(db, "tasks", selectedTask.id);
                    await updateDoc(taskRef, {
                      completed: !selectedTask.completed,
                    });
                    setIsDetailOpen(false);
                  } catch (err) {
                    console.error("Gagal update status", err);
                  }
                }}
                className={`w-full mt-4 py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${selectedTask.completed ? "bg-slate-100 text-slate-400" : "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"}`}
              >
                {selectedTask.completed ? "Batal Selesai" : "Tandai Selesai"}
              </button>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full mt-6 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="w-full max-w-[450px] bg-white dark:bg-surface-dark rounded-[3rem] p-10 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-black mb-10">Tugas Baru</h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3 block">
                    Judul Tugas
                  </label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Belajar Coding"
                    className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl px-6 py-5 font-bold focus:ring-2 ring-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3 block">
                      Jam
                    </label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl px-6 py-5 font-bold focus:ring-2 ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3 block">
                      Kategori
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl px-6 py-5 font-bold focus:ring-2 ring-primary outline-none appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setNewIsPenting(!newIsPenting)}
                  className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-black transition-all ${newIsPenting ? "bg-primary/20 text-primary border border-primary/30" : "bg-slate-100 dark:bg-white/5 border border-transparent opacity-60"}`}
                >
                  <span className="material-icons-round">
                    {newIsPenting ? "stars" : "star_outline"}
                  </span>
                  <span className="text-sm">Tandai sebagai Penting</span>
                </button>
              </div>
              <div className="mt-12">
                <button
                  onClick={addTask}
                  className="w-full py-6 rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90"
                >
                  Simpan Tugas
                </button>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="w-full mt-6 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 text-center"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {isEditOpen && selectedTask && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="w-full max-w-[450px] bg-white dark:bg-surface-dark rounded-[3rem] p-10 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-black mb-10">Edit Tugas</h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3 block">
                    Judul Tugas
                  </label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl px-6 py-5 font-bold focus:ring-2 ring-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3 block">
                      Jam
                    </label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl px-6 py-5 font-bold focus:ring-2 ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3 block">
                      Kategori
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/5 rounded-2xl px-6 py-5 font-bold focus:ring-2 ring-primary outline-none appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setNewIsPenting(!newIsPenting)}
                  className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-black transition-all ${newIsPenting ? "bg-primary/20 text-primary border border-primary/30" : "bg-slate-100 dark:bg-white/5 border border-transparent opacity-60"}`}
                >
                  <span className="material-icons-round">
                    {newIsPenting ? "stars" : "star_outline"}
                  </span>
                  <span className="text-sm">Tandai sebagai Penting</span>
                </button>
              </div>
              <div className="mt-12">
                <button
                  onClick={updateTask}
                  className="w-full py-6 rounded-3xl bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-600"
                >
                  Perbarui Tugas
                </button>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-full mt-6 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 text-center"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsAddOpen(true)}
          className="fixed bottom-28 right-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl primary-glow transition-transform hover:scale-110 active:scale-95 z-40 lg:w-20 lg:h-20"
        >
          <span className="material-icons-round text-4xl">add</span>
        </button>

        <Navbar />
      </main>
    </div>
  );
};

const TasksPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
          <p className="text-white font-black">Loading...</p>
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
};

export default TasksPage;
