import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ServiceMarquee: React.FC = () => {
  const { services, siteSettings } = useData();

  // If services has items, we duplicate the list 3 times to ensure a seamlessly endless loop track
  const marqueeItems = [...services, ...services, ...services];

  return (
    <section
      id="marquee"
      className="relative py-12 overflow-hidden border-y border-[var(--color-border)] bg-[var(--surface-soft)]/50 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)]">
            Continuous Capabilities Stream
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
            Core Service Disciplines
          </h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)] font-medium max-w-xs">
          Interactive right-to-left showcase. Hover or touch any card to pause and inspect.
        </p>
      </div>

      {/* Marquee viewport container with edge fade masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right gradient edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10 pointer-events-none" />

        {/* Endless Moving Track - Right to Left */}
        <div
          className="animate-marquee-rtl flex gap-6 px-4"
          style={
            {
              '--marquee-speed': `${siteSettings.marqueeSpeedSeconds || 30}s`,
            } as React.CSSProperties
          }
        >
          {marqueeItems.map((item, idx) => (
            <a
              key={`${item.id}-${idx}`}
              href={`#service-${item.id}`}
              className="group relative flex-shrink-0 w-64 sm:w-72 bg-[var(--surface-card)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 block"
            >
              {/* Service Image Thumbnail */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm group-hover:bg-[var(--color-primary)] transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="absolute bottom-3 left-3 text-[10px] font-mono uppercase tracking-wider text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              {/* Service Label and Info below the image */}
              <div className="p-4 bg-[var(--surface-card)]">
                <h3 className="font-serif font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {item.tagline || item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
