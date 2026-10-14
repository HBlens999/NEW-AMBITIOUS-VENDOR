import React, { useEffect, useRef, useState } from 'react';

export type GlowEffectState = 'fire' | 'ice' | 'thunder' | 'neon' | 'rose';

interface HeroGlowingHeadlineProps {
  headlineText: string;
  effectMode?: 'fire' | 'ice' | 'thunder' | 'neon' | 'rose' | 'cycle';
  cycleIntervalSec?: number;
}

export const HeroGlowingHeadline: React.FC<HeroGlowingHeadlineProps> = ({
  headlineText = 'AMBITIOUS VENDOR',
  effectMode = 'cycle',
  cycleIntervalSec = 4.5,
}) => {
  const [currentEffect, setCurrentEffect] = useState<GlowEffectState>('fire');
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const effectsList: GlowEffectState[] = ['fire', 'ice', 'thunder', 'neon', 'rose'];

  // Cycle automatically if effectMode === 'cycle'
  useEffect(() => {
    if (effectMode !== 'cycle') {
      setCurrentEffect(effectMode as GlowEffectState);
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentEffect(prev => {
        const currentIndex = effectsList.indexOf(prev);
        const nextIndex = (currentIndex + 1) % effectsList.length;
        return effectsList[nextIndex];
      });
    }, cycleIntervalSec * 1000);

    return () => clearInterval(interval);
  }, [effectMode, cycleIntervalSec, isPaused]);

  // Particle Canvas for Fire & Lightning Sparks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }> = [];

    // Lightning discharge state
    let lightningTimer = 0;
    let lightningBolts: Array<Array<{ x: number; y: number }>> = [];

    const createLightning = () => {
      const bolts: Array<Array<{ x: number; y: number }>> = [];
      const numBolts = Math.floor(Math.random() * 2) + 1;

      for (let b = 0; b < numBolts; b++) {
        const startX = Math.random() * width * 0.8 + width * 0.1;
        const startY = height * 0.3 + Math.random() * (height * 0.4);
        const bolt = [{ x: startX, y: startY }];

        let curX = startX;
        let curY = startY;
        const segments = Math.floor(Math.random() * 6) + 4;

        for (let s = 0; s < segments; s++) {
          curX += (Math.random() - 0.5) * 50;
          curY += (Math.random() - 0.5) * 35;
          bolt.push({ x: curX, y: curY });
        }
        bolts.push(bolt);
      }
      return bolts;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Fire effect particles (rising embers)
      if (currentEffect === 'fire') {
        if (particles.length < 40 && Math.random() < 0.6) {
          particles.push({
            x: Math.random() * width * 0.7 + width * 0.15,
            y: height * 0.75 + Math.random() * (height * 0.2),
            vx: (Math.random() - 0.5) * 1.2,
            vy: -Math.random() * 2.2 - 0.8,
            radius: Math.random() * 3 + 1.5,
            alpha: 1,
            color: Math.random() > 0.4 ? '#ff5a1f' : '#fbbf24',
            life: 0,
            maxLife: Math.random() * 45 + 30,
          });
        }
      } else if (currentEffect === 'ice') {
        // Crystalline drifting frost flakes
        if (particles.length < 25 && Math.random() < 0.3) {
          particles.push({
            x: Math.random() * width * 0.8 + width * 0.1,
            y: Math.random() * height * 0.6 + height * 0.2,
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 0.5 - 0.2,
            radius: Math.random() * 2 + 1,
            alpha: 0.9,
            color: Math.random() > 0.5 ? '#e0f2fe' : '#7dd3fc',
            life: 0,
            maxLife: Math.random() * 50 + 40,
          });
        }
      } else if (currentEffect === 'thunder') {
        // Lightning crackles
        lightningTimer++;
        if (lightningTimer > 40 && Math.random() < 0.08) {
          lightningBolts = createLightning();
          lightningTimer = 0;
        }

        if (lightningBolts.length > 0) {
          ctx.save();
          ctx.strokeStyle = '#93c5fd';
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 12;
          ctx.lineWidth = 2;

          for (const bolt of lightningBolts) {
            ctx.beginPath();
            ctx.moveTo(bolt[0].x, bolt[0].y);
            for (let i = 1; i < bolt.length; i++) {
              ctx.lineTo(bolt[i].x, bolt[i].y);
            }
            ctx.stroke();
          }
          ctx.restore();

          // Fade out lightning quickly
          if (Math.random() < 0.4) {
            lightningBolts = [];
          }
        }
      } else if (currentEffect === 'rose') {
        // Rose plasma particles
        if (particles.length < 30 && Math.random() < 0.4) {
          particles.push({
            x: Math.random() * width * 0.8 + width * 0.1,
            y: height * 0.5 + (Math.random() - 0.5) * (height * 0.4),
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2.5 + 1,
            alpha: 0.95,
            color: Math.random() > 0.4 ? '#f43f5e' : '#fda4af',
            life: 0,
            maxLife: Math.random() * 40 + 35,
          });
        }
      }

      // Update and draw general particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentEffect]);

  // Effect-specific typography styles
  const getEffectStyles = () => {
    switch (currentEffect) {
      case 'fire':
        return {
          containerClass: 'glow-fire',
          textClass:
            'bg-gradient-to-t from-red-600 via-orange-500 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_-4px_18px_rgba(239,68,68,0.9)]',
          badgeText: 'State 1: Burning Fire',
          badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-950/30',
        };
      case 'ice':
        return {
          containerClass: 'glow-ice',
          textClass:
            'bg-gradient-to-r from-sky-200 via-cyan-100 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.9)] drop-shadow-[0_0_35px_rgba(14,165,233,0.7)]',
          badgeText: 'State 2: Ice & Frost',
          badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
        };
      case 'thunder':
        return {
          containerClass: 'glow-thunder',
          textClass:
            'bg-gradient-to-b from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(96,165,250,1)] drop-shadow-[0_0_40px_rgba(37,99,235,0.85)]',
          badgeText: 'State 3: Thunder & Lightning',
          badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/30',
        };
      case 'neon':
        return {
          containerClass: 'glow-neon',
          textClass:
            'text-cyan-300 drop-shadow-[0_0_10px_#22d3ee] drop-shadow-[0_0_25px_#06b6d4] drop-shadow-[0_0_45px_#a855f7]',
          badgeText: 'State 4: Electric Neon',
          badgeColor: 'border-cyan-400/40 text-cyan-400 bg-cyan-950/30',
        };
      case 'rose':
        return {
          containerClass: 'glow-rose',
          textClass:
            'bg-gradient-to-r from-rose-400 via-pink-300 to-rose-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(244,63,94,0.95)] drop-shadow-[0_0_45px_rgba(182,111,125,0.8)]',
          badgeText: 'State 5: Rose-Pink Energy',
          badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
        };
    }
  };

  const currentStyles = getEffectStyles();

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none">
      {/* Particle Overlay Canvas (strictly pointer-events-none so all buttons remain clickable) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ minHeight: '140px' }}
      />

      {/* Main Headline Container */}
      <div className={`relative z-20 text-center px-4 ${currentStyles.containerClass}`}>
        <h1
          className={`font-serif font-black tracking-tight leading-[1.05] transition-all duration-700 ${currentStyles.textClass}`}
          style={{
            fontSize: 'clamp(2.75rem, 8vw, 6.25rem)',
            textWrap: 'balance',
          }}
        >
          {headlineText}
        </h1>
      </div>

      {/* Interactive State Controller Strip (Refined & Unobtrusive) */}
      <div className="relative z-20 mt-4 flex items-center justify-center gap-2 flex-wrap">
        <span
          className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider rounded-full border transition-all duration-300 ${currentStyles.badgeColor}`}
        >
          {currentStyles.badgeText}
        </span>

        {/* Quick state switcher for immediate testing */}
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          {effectsList.map(eff => (
            <button
              key={eff}
              onClick={() => {
                setCurrentEffect(eff);
                setIsPaused(true);
              }}
              title={`Switch to ${eff} glow`}
              className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded-full transition-all ${
                currentEffect === eff
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {eff}
            </button>
          ))}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume auto-cycle' : 'Pause on current effect'}
            className="px-2 py-0.5 text-[10px] font-mono text-neutral-400 hover:text-white transition-colors border-l border-white/10 ml-1"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    </div>
  );
};
