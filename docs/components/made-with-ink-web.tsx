"use client";

import React from "react";

const INK_WEB_URL = "https://ink-web.dev";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- Corner Ribbon ---

interface CornerRibbonProps {
  /** Which corner to display in */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Additional CSS classes */
  className?: string;
  /** Use absolute instead of fixed positioning (for embedding in a relative container) */
  absolute?: boolean;
}

const positionClasses = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
} as const;

const ribbonTransforms = {
  "top-right": "translate-x-[14px] translate-y-[32px] rotate-[45deg] top-0 right-[-30px]",
  "top-left": "translate-x-[-14px] translate-y-[32px] rotate-[-45deg] top-0 left-[-30px]",
  "bottom-right": "translate-x-[14px] translate-y-[-32px] rotate-[-45deg] bottom-0 right-[-30px]",
  "bottom-left": "translate-x-[-14px] translate-y-[-32px] rotate-[45deg] bottom-0 left-[-30px]",
} as const;

export function CornerRibbon({
  position = "top-right",
  className,
  absolute = false,
}: CornerRibbonProps) {
  return (
    <div
      className={cn(
        absolute ? "absolute" : "fixed",
        "z-[9999] overflow-hidden w-[200px] h-[200px] pointer-events-none",
        positionClasses[position]
      )}
    >
      <a
        href={INK_WEB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "absolute block w-[210px] py-1.5 text-center text-[11px] font-semibold font-mono no-underline tracking-wide origin-center shadow-sm pointer-events-auto",
          "bg-neutral-200 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-400",
          ribbonTransforms[position],
          className
        )}
      >
        made with ink web
      </a>
    </div>
  );
}

// --- Badge Button ---

type BadgeVariant = "dark" | "light" | "outline";

interface BadgeButtonProps {
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  dark: "bg-black text-white dark:bg-white dark:text-black border border-transparent",
  light: "bg-white text-black dark:bg-black dark:text-white border border-neutral-200 dark:border-neutral-700",
  outline: "bg-transparent text-current border border-current",
};

export function BadgeButton({
  variant = "dark",
  className,
}: BadgeButtonProps) {
  return (
    <a
      href={INK_WEB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium no-underline leading-none transition-opacity hover:opacity-80",
        variantClasses[variant],
        className
      )}
    >
      <span className="text-sm">&gt;_</span>
      <span>made with ink web</span>
    </a>
  );
}

// --- Minimal Text Link ---

interface TextBadgeProps {
  className?: string;
}

export function TextBadge({ className }: TextBadgeProps) {
  return (
    <a
      href={INK_WEB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-mono text-inherit opacity-50 no-underline transition-opacity hover:opacity-80",
        className
      )}
    >
      &gt;_ made with ink web
    </a>
  );
}
