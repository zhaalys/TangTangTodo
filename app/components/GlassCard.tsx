import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowTop?: boolean;
  glowBottom?: boolean;
}

const GlassCard = ({
  children,
  className = "",
  glowTop,
  glowBottom,
}: GlassCardProps) => {
  return (
    <div
      className={`glass-card rounded-xl p-6 relative overflow-hidden group ${className}`}
    >
      {glowTop && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
      )}
      {glowBottom && (
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl"></div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
