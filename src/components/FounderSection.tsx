import React from 'react';
import { Mail, Phone, MessageCircle, Instagram, Linkedin, Sparkles, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

export const FounderSection: React.FC = () => {
  const { founder } = useData();

  return (
    <section id="founder" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[var(--surface-card)] rounded-3xl border border-[var(--color-border)] p-8 sm:p-12 lg:p-16 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Founder Portrait (Dynamic from Supabase / DataContext - Not Hardcoded) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-[var(--color-border)]">
              <img
                src={founder.portraitUrl}
                alt={`${founder.name} — ${founder.title}`}
                className="w-full h-[450px] sm:h-[520px] object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

              {/* Founder Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 block">
                  Vision & Direction
                </span>
                <span className="text-base font-bold font-serif">{founder.name}</span>
                <span className="text-xs text-neutral-300 block mt-0.5">
                  {founder.title} · {founder.brandRole}
                </span>
              </div>
            </div>

            {/* Decorative Ambient Glow */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[var(--color-highlight)]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          </div>

          {/* Founder Editorial Story & Ethos */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>04. The Vision Behind the Brand</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--text-primary)] leading-tight">
              Driven by Ambition. Crafted with Obsessive Detail.
            </h2>

            <div className="mt-6 border-l-2 border-[var(--color-secondary)] pl-5 italic font-serif text-lg text-[var(--text-primary)] leading-relaxed">
              &ldquo;{founder.statement}&rdquo;
            </div>

            <p className="mt-6 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {founder.bio}
            </p>

            {/* Disciplines Summary Matrix */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--color-border)]/60">
              <div className="p-3.5 rounded-xl bg-[var(--surface-soft)]">
                <span className="text-[11px] font-mono uppercase text-[var(--color-secondary)] block">
                  Discipline 01
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] mt-1 block">
                  Visual Identity
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--surface-soft)]">
                <span className="text-[11px] font-mono uppercase text-[var(--color-secondary)] block">
                  Discipline 02
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] mt-1 block">
                  Web Engineering
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--surface-soft)] col-span-2 sm:col-span-1">
                <span className="text-[11px] font-mono uppercase text-[var(--color-secondary)] block">
                  Discipline 03 & 04
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] mt-1 block">
                  Fragrances & Cinema
                </span>
              </div>
            </div>

            {/* Founder Social & Direct Contact Links */}
            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${founder.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border border-[var(--color-border)] text-[var(--text-primary)] hover:bg-[var(--surface-soft)] hover:border-[var(--color-primary)] transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                <span>{founder.email}</span>
              </a>

              {founder.whatsapp && (
                <a
                  href={`https://wa.me/${founder.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Direct WhatsApp</span>
                </a>
              )}

              {founder.instagram && (
                <a
                  href={founder.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-[var(--surface-soft)]"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {founder.linkedin && (
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-[var(--surface-soft)]"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
