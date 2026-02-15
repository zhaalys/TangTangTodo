"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Phase 1: Keep splash active for 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Phase 2: Unmount component after transition (0.5s)
    const renderTimer = setTimeout(() => {
      setShouldRender(false);
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearTimeout(renderTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a] transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow scale-150"></div>

        {/* Logo Container */}
        <div
          className={`relative z-10 transition-all duration-1000 transform ${isVisible ? "scale-100 opacity-100" : "scale-150 opacity-0"}`}
        >
          <div className="w-32 h-32 md:w-48 md:h-48 relative animate-float">
            <Image
              src="/tangtanglogo1.png"
              alt="TangTang Logo"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]"
              priority
            />
          </div>

          {/* Logo Text / Pulse Effect */}
          <div className="mt-8 text-center overflow-hidden">
            <h1 className="text-white text-3xl md:text-5xl font-black tracking-[0.2em] uppercase animate-in slide-in-from-bottom-8 duration-700">
              TangTang
            </h1>
            <div className="h-1 shadow-glow bg-primary mt-2 rounded-full animate-progress-expand"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes progress-expand {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-progress-expand {
          animation: progress-expand 1.5s cubic-bezier(0.65, 0, 0.35, 1)
            forwards;
          margin-left: auto;
          margin-right: auto;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
