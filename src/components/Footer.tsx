import React from 'react';
import { ArrowUp, Instagram, Linkedin, Mail, MessageCircle, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { siteSettings, founder } = useData();
  const { activePresetId, presets } = useTheme();

  const activePreset = presets.find(p => p.id === activePresetId);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--surface-card)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand & Vision */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
                AV
              </span>
              <span className="text-xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
                {siteSettings.siteTitle || 'AMBITIOUS VENDOR'}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              {siteSettings.tagline || 'Creative Agency & Luxury Fragrances'}. Founded and directed by Joseph Chiemezie. Delivering bespoke art direction, web engineering, sensory perfumery, and cinematic editing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {founder.instagram && (
                <a
                  href={founder.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-[var(--color-border)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {founder.linkedin && (
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-[var(--color-border)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {founder.email && (
                <a
                  href={`mailto:${founder.email}`}
                  className="p-2 rounded-full border border-[var(--color-border)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {siteSettings.whatsapp && (
                <a
                  href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-[var(--color-border)] text-[var(--text-secondary)] hover:text-emerald-600 hover:border-emerald-600 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)]">
              Core Disciplines
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[var(--text-secondary)]">
              <li>
                <a href="#services" className="hover:text-[var(--color-primary)] transition-colors">
                  Graphic Design & Identity
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[var(--color-primary)] transition-colors">
                  Website Development
                </a>
              </li>
              <li>
                <a href="#perfumes" className="hover:text-[var(--color-primary)] transition-colors">
                  Perfume Vendor & Niche Scents
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[var(--color-primary)] transition-colors">
                  Cinematic Video Editing
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[var(--color-primary)] transition-colors">
                  Curated Selected Works
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)]">
              Studio & Inquiries
            </h4>
            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <p className="text-[var(--text-primary)] font-medium">{siteSettings.email}</p>
              <p>{siteSettings.phone}</p>
              <p>{siteSettings.address}</p>
            </div>
            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--color-border)] hover:bg-[var(--surface-soft)] transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin CMS Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border)]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} AMBITIOUS VENDOR. All rights reserved.</span>
            <span>·</span>
            <span className="font-mono text-[11px]">
              Theme: {activePreset?.name || 'Blush Luxury'}
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
