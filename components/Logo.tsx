"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /** Display format */
  variant?: "full" | "mark" | "compact";
  /** Color theme */
  theme?: "light" | "dark" | "auto";
  /** Size preset */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether to show the subtitle/tagline in full variant */
  showSubtitle?: boolean;
  /** Custom subtitle text */
  subtitle?: string;
  /** Additional container classes */
  className?: string;
  /** Hover animations */
  animated?: boolean;
  /** Override brand title text */
  brandName?: string;
}

import Image from "next/image";

export function LogoIcon({
  size = "md",
  className,
  animated = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}) {
  const sizeMap = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-9 h-9 sm:w-10 sm:h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
    xl: "w-16 h-16 rounded-2xl",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none transition-transform duration-300",
        sizeMap[size],
        animated && "group-hover:scale-105",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="Ephtopia Logo"
        fill
        sizes="(max-width: 768px) 40px, 64px"
        className="object-contain"
        priority
      />
    </div>
  );
}

export default function Logo({
  variant = "full",
  theme = "auto",
  size = "md",
  showSubtitle = false,
  subtitle = "Hospitality & Cleaning",
  className,
  animated = true,
  brandName = "Ephtopia Cleans",
}: LogoProps) {
  if (variant === "mark") {
    return <LogoIcon size={size} className={className} animated={animated} />;
  }

  // Parse brand name into main word & second word if available
  const parts = brandName.trim().split(" ");
  const firstWord = parts[0] || "Ephtopia";
  const secondWord = parts.slice(1).join(" ") || "Cleans";

  // Text size classes
  const titleSizeMap = {
    sm: "text-base tracking-tight",
    md: "text-lg sm:text-[19px] tracking-tight",
    lg: "text-xl sm:text-2xl tracking-tight",
    xl: "text-2xl sm:text-3xl tracking-tight",
  };

  const subtitleSizeMap = {
    sm: "text-[9px] tracking-widest",
    md: "text-[10px] tracking-widest",
    lg: "text-[11px] tracking-widest",
    xl: "text-xs tracking-widest",
  };

  // Theme color styles
  const firstWordColor =
    theme === "dark"
      ? "text-white"
      : theme === "light"
        ? "text-slate-900"
        : "text-slate-900 dark:text-white";

  const secondWordColor = "text-teal";

  const subtitleColor =
    theme === "dark"
      ? "text-slate-400"
      : "text-slate-400";

  return (
    <div className={cn("inline-flex items-center group select-none", className)}>
      <div className="flex flex-col leading-none">
        <div className={cn("font-bold font-heading flex items-center gap-1.5", titleSizeMap[size])}>
          <span className={cn("transition-colors duration-200", firstWordColor)}>
            {firstWord}
          </span>
          <span className={cn("font-extrabold transition-colors duration-200", secondWordColor)}>
            {secondWord}
          </span>
        </div>

        {showSubtitle && (
          <span
            className={cn(
              "font-medium uppercase tracking-widest mt-0.5 transition-colors duration-200",
              subtitleSizeMap[size],
              subtitleColor
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
