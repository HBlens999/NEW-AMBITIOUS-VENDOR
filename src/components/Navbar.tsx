import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { siteSettings } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[var(--surface-card)]/90 backdrop-blur-md shadow-sm border-b border-[var(--color-border)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-3 group text-decoration-none focus:outline-none"
          >
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt="Logo"
                className="h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
                AV
              </span>
            )}
            <span className="text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 group-hover:text-[var(--color-primary)] transition-colors">
              {siteSettings.siteTitle || 'AMBITIOUS VENDOR'}
            </span>
          </a>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a
              href="#services"
              className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              Services
            </a>
            <a
              href="#marquee"
              className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              Capabilities
            </a>
            <a
              href="#portfolio"
              className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              Selected Works
            </a>
            <a
              href="#perfumes"
              className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              Fragrances
            </a>
            <a
              href="#founder"
              className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              About CEO
            </a>
            <a
              href="#contact"
              className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Primary Action + Admin Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              aria-label="Open Admin Dashboard"
              title="Admin Portal"
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--surface-soft)] rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4" />
            </button>

            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full transition-all duration-200 shadow-sm whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--color-highlight)]"
            >
              <span>Commission Work</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[var(--text-primary)] hover:bg-[var(--surface-soft)] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--surface-card)] border-b border-[var(--color-border)] shadow-xl px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4 text-base font-medium text-[var(--text-primary)]">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[var(--color-border)]/50 hover:text-[var(--color-primary)]"
            >
              Services
            </a>
            <a
              href="#marquee"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[var(--color-border)]/50 hover:text-[var(--color-primary)]"
            >
              Capabilities
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[var(--color-border)]/50 hover:text-[var(--color-primary)]"
            >
              Selected Works
            </a>
            <a
              href="#perfumes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[var(--color-border)]/50 hover:text-[var(--color-primary)]"
            >
              Fragrances & Perfumes
            </a>
            <a
              href="#founder"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[var(--color-border)]/50 hover:text-[var(--color-primary)]"
            >
              About the CEO
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[var(--color-border)]/50 hover:text-[var(--color-primary)]"
            >
              Contact & Inquiries
            </a>
            <div className="pt-2 flex flex-col gap-3">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] rounded-full shadow-sm"
              >
                Commission Work
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[var(--text-secondary)] border border-[var(--color-border)] rounded-full hover:bg-[var(--surface-soft)]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin CMS Access</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
