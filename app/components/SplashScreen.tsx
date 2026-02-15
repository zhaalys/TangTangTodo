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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-[90vw]">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow scale-150"></div>

        {/* Logo Container */}
        <div
          className={`relative z-10 transition-all duration-1000 transform flex flex-col items-center ${
            isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
        >
          {/* Mascot Image */}
          <div className="w-64 h-64 md:w-[450px] md:h-[450px] relative animate-float-glow">
            <Image
              src="/tangtanglogo1.png"
              alt="TangTang Logo"
              fill
              className="object-contain drop-shadow-[0_0_60px_rgba(59,130,246,0.6)]"
              priority
            />
          </div>

          {/* Logo Text */}
          <div className="mt-16 text-center flex flex-col items-center w-full">
            <h1 className="text-white text-5xl md:text-9xl font-black tracking-[0.3em] uppercase mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              TangTang
            </h1>
            <div className="w-64 md:w-[500px] h-2 shadow-glow bg-primary rounded-full animate-progress-expand shadow-[0_0_30px_rgba(59,130,246,1)]"></div>
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
