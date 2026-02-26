"use client";

import React from "react";

const INK_WEB_URL = "https://ink-web.dev";

// --- Corner Ribbon ---

interface CornerRibbonProps {
  /** Which corner to display in */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Background color of the ribbon */
  color?: string;
  /** Text color */
  textColor?: string;
  /** Use absolute instead of fixed positioning (for embedding in a relative container) */
  absolute?: boolean;
}

export function CornerRibbon({
  position = "top-right",
  color = "#000",
  textColor = "#fff",
  absolute = false,
}: CornerRibbonProps) {
  const isTop = position.startsWith("top");
  const isRight = position.endsWith("right");

  const wrapperStyles: React.CSSProperties = {
    position: absolute ? "absolute" : "fixed",
    zIndex: 9999,
    overflow: "hidden",
    width: 150,
    height: 150,
    pointerEvents: "none",
    ...(isTop ? { top: 0 } : { bottom: 0 }),
    ...(isRight ? { right: 0 } : { left: 0 }),
  };

  let ribbonTransform: string;
  if (position === "top-right")
    ribbonTransform = "translateX(14px) translateY(32px) rotate(45deg)";
  else if (position === "top-left")
    ribbonTransform = "translateX(-14px) translateY(32px) rotate(-45deg)";
  else if (position === "bottom-right")
    ribbonTransform = "translateX(14px) translateY(-32px) rotate(-45deg)";
  else
    ribbonTransform = "translateX(-14px) translateY(-32px) rotate(45deg)";

  return (
    <div style={wrapperStyles}>
      <a
        href={INK_WEB_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          display: "block",
          width: 200,
          padding: "6px 0",
          textAlign: "center",
          backgroundColor: color,
          color: textColor,
          fontSize: 11,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "0.02em",
          transform: ribbonTransform,
          transformOrigin: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          pointerEvents: "auto",
          ...(isTop ? { top: 0 } : { bottom: 0 }),
          ...(isRight ? { right: -25 } : { left: -25 }),
        }}
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

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  dark: {
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid transparent",
  },
  light: {
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #e5e5e5",
  },
  outline: {
    backgroundColor: "transparent",
    color: "currentColor",
    border: "1px solid currentColor",
  },
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
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontWeight: 500,
        textDecoration: "none",
        lineHeight: 1,
        transition: "opacity 0.15s",
        ...variantStyles[variant],
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.8";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
    >
      <span style={{ fontSize: 14 }}>&gt;_</span>
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
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        color: "inherit",
        opacity: 0.5,
        textDecoration: "none",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.8";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.5";
      }}
    >
      &gt;_ made with ink web
    </a>
  );
}
