"use client";

import { useEffect, useState } from "react";

interface BlackHoleLoaderProps {
  message?: string;
}

export default function BlackHoleLoader({
  message = "Falling into the void...",
}: BlackHoleLoaderProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; delay: number; duration: number }>
  >([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 bg-void-black flex items-center justify-center z-50">
      {/* Black hole container */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Event horizon - the black center */}
        <div className="absolute w-24 h-24 bg-black rounded-full shadow-2xl z-20 animate-pulse" />

        {/* Accretion disk - spinning rings */}
        <div className="absolute w-64 h-64 border-2 border-void-accent/30 rounded-full animate-spin-slow" />
        <div className="absolute w-48 h-48 border-2 border-purple-500/20 rounded-full animate-spin-reverse" />
        <div className="absolute w-32 h-32 border border-void-accent/50 rounded-full animate-spin-slow" />

        {/* Gravitational lensing effect */}
        <div className="absolute w-80 h-80 rounded-full bg-gradient-radial from-transparent via-void-accent/5 to-transparent animate-pulse" />

        {/* Falling particles */}
        {particles.map((particle) => {
          const size = Math.random() > 0.7 ? "w-2 h-2" : "w-1 h-1";
          const color =
            Math.random() > 0.5 ? "bg-void-accent" : "bg-purple-400";
          return (
            <div
              key={particle.id}
              className={`fixed ${size} ${color} rounded-full animate-fall-into-hole shadow-lg`}
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                boxShadow: `0 0 4px currentColor`,
              }}
            />
          );
        })}

        {/* Hawking radiation - subtle glow */}
        <div className="absolute w-96 h-96 rounded-full bg-gradient-radial from-void-accent/10 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="absolute bottom-32 text-center">
        <p className="text-void-muted text-lg font-medium animate-pulse">
          {message}
        </p>
        <div className="flex justify-center mt-4 space-x-1">
          <div
            className="w-2 h-2 bg-void-accent rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-void-accent rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-void-accent rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
