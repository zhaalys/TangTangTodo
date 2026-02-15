"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db, auth, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Post {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: any; // Can be string or Firestore timestamp
  likes: number;
  likedBy?: string[];
  comments: number;
  tag: string;
  userId: string;
  imageUrl?: string;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    votedBy?: string[];
  };
}

const DiskusiPage = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPollInput, setShowPollInput] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [activeReplyPost, setActiveReplyPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = [];
      snapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeReplyPost) return;

    const q = query(
      collection(db, "posts", activeReplyPost, "comments"),
      orderBy("createdAt", "asc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommentsMap((prev) => ({ ...prev, [activeReplyPost]: commentsData }));
    });

    return () => unsubscribe();
  }, [activeReplyPost]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handlePost = async () => {
    if ((!newPost.trim() && !selectedFile) || !user) return;
    setIsUploading(true);
    try {
      let finalImageUrl = imageUrl;

      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      const postData: any = {
        user: user.displayName || "User",
        avatar: user.photoURL || "",
        content: newPost,
        tag: "General",
        likes: 0,
        likedBy: [],
        comments: 0,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      if (finalImageUrl) postData.imageUrl = finalImageUrl;
      if (showPollInput && pollQuestion && pollOptions.every((o) => o.trim())) {
        postData.poll = {
          question: pollQuestion,
          options: pollOptions.map((o) => ({ text: o, votes: 0 })),
          votedBy: [],
        };
      }

      await addDoc(collection(db, "posts"), postData);
      setNewPost("");
      setImageUrl("");
      setSelectedFile(null);
      setImagePreview(null);
      setShowImageInput(false);
      setShowPollInput(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
    } catch (err) {
      console.error("Gagal mengirim postingan", err);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleLike = async (postId: string, likedBy: string[] = []) => {
    if (!user) return;
    const postRef = doc(db, "posts", postId);
    const isLiked = likedBy.includes(user.uid);

    try {
      await updateDoc(postRef, {
        likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likes: isLiked ? likedBy.length - 1 : likedBy.length + 1,
      });
    } catch (err) {
      console.error("Gagal toggle like", err);
    }
  };

  const handleVote = async (postId: string, optionIndex: number) => {
    if (!user) return;
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (!post?.poll || post.poll.votedBy?.includes(user.uid)) return;

    const newOptions = [...post.poll.options];
    newOptions[optionIndex].votes += 1;

    try {
      await updateDoc(postRef, {
        "poll.options": newOptions,
        "poll.votedBy": arrayUnion(user.uid),
      });
    } catch (err) {
      console.error("Gagal voting", err);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim() || !user) return;

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        userId: user.uid,
        user: user.displayName || "User",
        avatar: user.photoURL || "",
        content: newComment,
        createdAt: serverTimestamp(),
      });

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: increment(1),
      });

      setNewComment("");
    } catch (err) {
      console.error("Gagal menambahkan komentar", err);
    }
  };

  return (
    <div className="bg-[#0f172a] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="app-container pb-24 px-6 lg:px-12">
        {/* Header */}
        <header className="pt-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6 z-10 lg:pt-16">
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
              {t("community_title")}
            </h1>
            <p className="text-sm lg:text-base text-primary font-semibold flex items-center gap-1 mt-1">
              {t("community_subtitle")}{" "}
              <span className="material-icons-round text-[16px]">groups</span>
            </p>
          </div>
          <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all self-start md:self-auto">
            <span className="material-icons-round text-primary">search</span>
          </button>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:mt-12 mt-8">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {/* Create Post Card */}
            <div className="bg-surface-dark rounded-[2.5rem] md:rounded-[3rem] p-6 lg:p-10 border border-white/5 shadow-2xl relative overflow-hidden group transition-all hover:shadow-primary/5">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-icons-round text-primary text-2xl">
                    person
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder={t("post_placeholder")}
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:opacity-30 resize-none min-h-[100px] outline-none"
                  />
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6 mt-4">
                    <div className="flex gap-4">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => {
                          document.getElementById("image-upload")?.click();
                          setShowPollInput(false);
                          setShowImageInput(false); // Hide URL input if using file upload
                        }}
                        className={`transition-colors flex items-center gap-2 ${selectedFile || showImageInput ? "text-primary" : "text-slate-400 hover:text-primary"}`}
                      >
                        <span className="material-icons-round text-xl">
                          image
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">
                          {selectedFile
                            ? t("post_image") + "..."
                            : t("post_image")}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPollInput(!showPollInput);
                          setShowImageInput(false);
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                        className={`transition-colors flex items-center gap-2 ${showPollInput ? "text-primary" : "text-slate-400 hover:text-primary"}`}
                      >
                        <span className="material-icons-round text-xl">
                          poll
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">
                          {t("post_poll")}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setShowImageInput(!showImageInput);
                          setSelectedFile(null);
                          setImagePreview(null);
                          setShowPollInput(false);
                        }}
                        className="text-slate-400 hover:text-primary transition-all flex items-center gap-1"
                        title="Gunakan URL Gambar"
                      >
                        <span className="material-icons-round text-lg">
                          link
                        </span>
                      </button>
                    </div>
                    <button
                      onClick={handlePost}
                      disabled={
                        (!newPost.trim() && !selectedFile) || isUploading
                      }
                      className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${(newPost.trim() || selectedFile) && !isUploading ? "bg-primary text-white shadow-xl shadow-primary/30 active:scale-95" : "bg-slate-100 dark:bg-white/5 text-slate-400 opacity-50"}`}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{t("post_sending")}</span>
                        </div>
                      ) : (
                        t("post_send")
                      )}
                    </button>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-6 relative w-full aspect-video rounded-3xl overflow-hidden border border-primary/20 group">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-icons-round">close</span>
                      </button>
                    </div>
                  )}

                  {/* Dynamic Inputs (URL Input) */}
                  {showImageInput && !selectedFile && (
                    <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Tempel URL Gambar di sini..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  )}

                  {showPollInput && (
                    <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300 bg-white/5 p-4 rounded-3xl border border-white/10">
                      <input
                        type="text"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder="Tanyakan sesuatu..."
                        className="w-full bg-transparent border-b border-white/10 px-2 py-2 text-base font-black focus:outline-none focus:border-primary transition-all"
                      />
                      <div className="space-y-2">
                        {pollOptions.map((opt, i) => (
                          <input
                            key={i}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...pollOptions];
                              newOpts[i] = e.target.value;
                              setPollOptions(newOpts);
                            }}
                            placeholder={`Opsi ${i + 1}`}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setPollOptions([...pollOptions, ""])}
                        className="text-[10px] uppercase font-black tracking-widest text-primary hover:underline ml-2"
                      >
                        + Tambah Opsi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feed List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-surface-dark rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-transparent group-hover:border-primary/20 transition-all">
                        <span className="material-icons-round text-slate-500 group-hover:text-primary transition-colors">
                          person
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-lg leading-none">
                          {post.user}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {post.time}
                        </p>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                      {post.tag}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed text-lg mb-6">
                    {post.content}
                  </p>

                  {/* Post Media (Images) */}
                  {post.imageUrl && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-6 border border-white/5 group-hover:border-primary/20 transition-all">
                      <Image
                        src={post.imageUrl}
                        alt="Post media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Post Polls */}
                  {post.poll && (
                    <div className="mb-8 space-y-3 bg-white/5 p-6 rounded-3xl border border-white/5">
                      <h5 className="font-black text-base md:text-lg mb-4">
                        {post.poll.question}
                      </h5>
                      <div className="space-y-3">
                        {post.poll.options.map((option, idx) => {
                          const totalVotes =
                            post.poll?.options.reduce(
                              (a, b) => a + b.votes,
                              0,
                            ) || 0;
                          const percentage =
                            totalVotes > 0
                              ? Math.round((option.votes / totalVotes) * 100)
                              : 0;
                          const hasVoted = post.poll?.votedBy?.includes(
                            user?.uid || "",
                          );

                          return (
                            <button
                              key={idx}
                              onClick={() => handleVote(post.id, idx)}
                              disabled={hasVoted || !user}
                              className="w-full relative h-12 rounded-2xl border border-white/10 overflow-hidden group/poll-opt transition-all hover:border-primary/30"
                            >
                              <div
                                className="absolute inset-y-0 left-0 bg-primary/20 transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              ></div>
                              <div className="absolute inset-0 px-4 flex justify-between items-center z-10">
                                <span
                                  className={`text-sm font-black ${hasVoted ? "text-primary" : "text-slate-300"}`}
                                >
                                  {option.text}
                                </span>
                                {hasVoted && (
                                  <span className="text-xs font-black text-primary/70">
                                    {percentage}%
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-2">
                        {t("votes", { count: post.poll.votedBy?.length || 0 })}{" "}
                        •{" "}
                        {post.poll.votedBy?.includes(user?.uid || "")
                          ? t("voted")
                          : t("not_voted")}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-6 border-t border-slate-100 dark:border-white/5 pt-6">
                    <button
                      onClick={() => toggleLike(post.id, post.likedBy)}
                      className="flex items-center gap-2 group/btn"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${post.likedBy?.includes(user?.uid || "") ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-slate-50 dark:bg-white/5 group-hover/btn:bg-red-500/10 group-hover/btn:text-red-500"}`}
                      >
                        <span className="material-icons-round text-xl">
                          {post.likedBy?.includes(user?.uid || "")
                            ? "favorite"
                            : "favorite_border"}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-black transition-colors ${post.likedBy?.includes(user?.uid || "") ? "text-red-500" : "text-slate-500 group-hover/btn:text-red-500"}`}
                      >
                        {post.likes}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setActiveReplyPost(
                          activeReplyPost === post.id ? null : post.id,
                        )
                      }
                      className="flex items-center gap-2 group/btn"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeReplyPost === post.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-white/5 group-hover/btn:bg-primary/10 group-hover/btn:text-primary"}`}
                      >
                        <span className="material-icons-round text-xl">
                          chat_bubble_outline
                        </span>
                      </div>
                      <span
                        className={`text-sm font-black transition-colors ${activeReplyPost === post.id ? "text-primary" : "text-slate-500 group-hover/btn:text-primary"}`}
                      >
                        {post.comments}
                      </span>
                    </button>
                    <button className="ml-auto w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                      <span className="material-icons-round text-xl">
                        share
                      </span>
                    </button>
                  </div>

                  {/* Comment Section (Expandable) */}
                  {activeReplyPost === post.id && (
                    <div className="mt-8 border-t border-slate-100 dark:border-white/5 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {commentsMap[post.id]?.map((comment) => (
                          <div key={comment.id} className="flex gap-4">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                              {comment.avatar ? (
                                <Image
                                  src={comment.avatar}
                                  alt={comment.user}
                                  width={32}
                                  height={32}
                                  className="rounded-xl"
                                />
                              ) : (
                                <span className="material-icons-round text-primary text-base">
                                  person
                                </span>
                              )}
                            </div>
                            <div className="flex-1 bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                              <div className="flex justify-between items-center mb-1">
                                <h6 className="text-[11px] font-black uppercase text-primary tracking-widest">
                                  {comment.user}
                                </h6>
                                <span className="text-[9px] text-slate-500 font-bold">
                                  {comment.createdAt
                                    ?.toDate()
                                    .toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                          <span className="material-icons-round text-slate-500">
                            reply
                          </span>
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddComment(post.id)
                            }
                            placeholder="Tulis balasan..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-all pr-12"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 active:scale-95 disabled:opacity-0 transition-all"
                          >
                            <span className="material-icons-round">send</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Topics & Trends */}
          <div className="lg:col-span-4 hidden lg:block space-y-8">
            <div className="bg-white/5 dark:bg-surface-dark/50 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-xl">
              <h3 className="font-black text-xl mb-6">{t("popular_topics")}</h3>
              <div className="space-y-4">
                {[
                  "Productivity",
                  "Self Care",
                  "Work Flow",
                  "Journaling Tips",
                ].map((topic, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center group cursor-pointer"
                  >
                    <span className="text-slate-500 group-hover:text-primary font-bold transition-colors">
                      #{topic}
                    </span>
                    <span className="text-[10px] font-black text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">
                      {12 + i * 5} Post
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 rounded-[2.5rem] p-8 border border-primary/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <h3 className="font-black text-xl text-primary mb-2">
                {t("weekly_challenge")}
              </h3>
              <p className="text-sm font-bold text-primary/70 mb-6 leading-relaxed">
                {t("challenge_desc")}
              </p>
              <button className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 primary-glow">
                {t("join_challenge")}
              </button>
            </div>
          </div>
        </div>

        <Navbar />
      </main>
    </div>
  );
};

export default DiskusiPage;
