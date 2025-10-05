"use client";

import { Sparkles } from "lucide-react";

interface HeaderProps {
  onSettingsClick?: () => void;
  onConstellationClick?: () => void;
}

export default function Header({
  onSettingsClick,
  onConstellationClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 bg-void-black/95 backdrop-blur-md border-b border-void-border z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-void-accent to-void-accent-light flex items-center justify-center animate-float">
                <div className="w-3 h-3 rounded-full bg-void-black"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-void-text tracking-tight">
                  void space
                </h1>
                <span className="text-xs text-void-muted-dark tracking-wide">
                  by vedant karle
                </span>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Constellation Mode Button */}
            {onConstellationClick && (
              <button
                onClick={onConstellationClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-void-accent/10 text-void-accent border border-void-accent/30 rounded-lg font-medium hover:bg-void-accent/20 transition-all duration-200 text-sm"
                title="Explore connections between thoughts"
              >
                <Sparkles size={14} />
                <span className="hidden sm:inline">constellation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
