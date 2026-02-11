import React from "react";
import Image from "next/image";

const Brand = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 relative overflow-hidden flex items-center justify-center">
        <Image
          src="/tangtanglogo1.png"
          alt="Tangtang Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-white dark:to-white/80">
        Tangtang
      </span>
    </div>
  );
};

export default Brand;
