"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-void-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-void-accent/40 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-void-accent/20 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-1 h-1 bg-void-accent/50 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-void-accent/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-void-accent/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Header onSettingsClick={() => {}} showBlogLink={true} />

      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-void-accent to-void-accent-light flex items-center justify-center animate-float shadow-2xl shadow-void-accent/20">
                  <div className="w-8 h-8 rounded-full bg-void-black"></div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-void-accent/20 to-void-accent-light/20 rounded-3xl blur-xl animate-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-light text-void-text mb-6 tracking-tight">
              void <span className="text-void-accent font-medium">space</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-void-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              A contemplative space for deep thoughts, mindful reflections, and
              meaningful connections
            </p>

            {/* Philosophy */}
            <div className="text-void-muted-dark text-sm md:text-base mb-12 max-w-3xl mx-auto leading-relaxed space-y-4">
              <p>
                Welcome to the void, not as emptiness, but as infinite
                possibility.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push("/blog")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-void-accent text-void-black rounded-2xl font-medium text-lg hover:bg-void-accent-light transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-void-accent/30"
            >
              <span>Enter the Void</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Newsletter />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-void-border/20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-void-muted-dark text-sm">
              © 2025 Void Space. For the People, By the People!
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
