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
          className={`relative z-10 transition-all duration-1000 transform flex flex-col items-center ${
            isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
        >
          {/* Mascot Image */}
          <div className="w-48 h-48 md:w-64 md:h-64 relative animate-float-glow">
            <Image
              src="/tangtanglogo1.png"
              alt="TangTang Logo"
              fill
              className="object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]"
              priority
            />
          </div>

          {/* Logo Text */}
          <div className="mt-12 text-center flex flex-col items-center w-full">
            <h1 className="text-white text-4xl md:text-7xl font-black tracking-[0.3em] uppercase mb-4 drop-shadow-2xl">
              TangTang
            </h1>
            <div className="w-48 md:w-80 h-1.5 shadow-glow bg-primary rounded-full animate-progress-expand shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-glow {
          0%,
          100% {
            transform: translateY(0);
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
          }
          50% {
            transform: translateY(-15px);
            filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.6));
          }
        }
        @keyframes progress-expand {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-float-glow {
          animation: float-glow 3s ease-in-out infinite;
        }
        .animate-progress-expand {
          animation: progress-expand 1.5s cubic-bezier(0.65, 0, 0.35, 1)
            forwards;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
