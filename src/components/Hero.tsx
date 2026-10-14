import React from 'react';
import { ArrowUpRight, Sparkles, Layers, Code, Droplets, Video } from 'lucide-react';
import { HeroGlowingHeadline } from './HeroGlowingHeadline';
import { useData } from '../context/DataContext';

export const Hero: React.FC = () => {
  const { heroSettings, siteSettings } = useData();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-white"
      style={{
        backgroundColor: '#09080B', // Fixed cinematic dark background as required
      }}
    >
      {/* Background Architectural Atmosphere & Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {heroSettings.backgroundImageUrl ? (
          <img
            src={heroSettings.backgroundImageUrl}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/80 via-[#0E0C10] to-[#09080B]" />
        )}
        {/* Subtle Luxury Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09080B]/60 via-transparent to-[#09080B]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-rose-950/20 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Brand Kicker / Subtitle */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-300" />
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-300">
            {heroSettings.introKicker || 'Creative Direction · Full-Stack Web · Luxury Fragrances · Post-Production'}
          </span>
        </div>

        {/* 5-State Animated Glowing Headline */}
        <HeroGlowingHeadline
          headlineText={heroSettings.headline || 'AMBITIOUS VENDOR'}
          effectMode={heroSettings.activeGlowEffect}
          cycleIntervalSec={heroSettings.cycleSpeedSeconds}
        />

        {/* Concise Value Proposition */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed">
          {heroSettings.description ||
            'A multi-disciplinary creative house crafting bespoke brand identities, high-performance web applications, curated luxury perfumes, and cinematic video productions.'}
        </p>

        {/* Four Core Pillars Pill Strip (Unboxed / Clean Icons) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-neutral-400">
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Layers className="w-4 h-4 text-rose-400" />
            <span>Graphic Design</span>
          </div>
          <span className="text-neutral-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Website Development</span>
          </div>
          <span className="text-neutral-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Droplets className="w-4 h-4 text-amber-400" />
            <span>Perfume Vendor</span>
          </div>
          <span className="text-neutral-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Video className="w-4 h-4 text-purple-400" />
            <span>Video Editing</span>
          </div>
        </div>

        {/* Prominent Dual CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href={heroSettings.primaryCtaLink || '#portfolio'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full transition-all duration-200 shadow-lg shadow-rose-950/40 hover:scale-[1.02]"
          >
            <span>{heroSettings.primaryCtaText || 'View Selected Works'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href={heroSettings.secondaryCtaLink || '#contact'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm"
          >
            <span>{heroSettings.secondaryCtaText || "Let's Work Together"}</span>
          </a>
        </div>
      </div>

      {/* Down indicator */}
      <div className="relative z-10 mt-16 sm:mt-20 flex flex-col items-center">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Scroll to explore</span>
        <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 rounded-full bg-rose-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
