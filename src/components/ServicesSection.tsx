import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ServiceItem } from '../types/data';

interface ServicesSectionProps {
  onSelectServiceForInquiry?: (serviceCategory: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForInquiry }) => {
  const { services } = useData();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleCommissionClick = (service: ServiceItem) => {
    if (onSelectServiceForInquiry) {
      onSelectServiceForInquiry(service.title);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>01. Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)]">
            Four Specialized Disciplines
          </h2>
        </div>
        <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
          From high-concept brand identities and custom web applications to curated luxury perfumes and broadcast-grade video editing.
        </p>
      </div>

      {/* Services Grid (2x2 Asymmetric Editorial Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {services.map((service, index) => (
          <article
            key={service.id}
            id={`service-${service.id}`}
            className="group flex flex-col bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Top: High-Resolution Visual Asset */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-900">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                  {`0${index + 1} · ${service.category}`}
                </span>
              </div>
            </div>

            {/* Bottom: Solid Defined Background Area for maximum contrast & readability */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-[var(--surface-card)]">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-[var(--color-secondary)]">
                  {service.tagline}
                </p>
                <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {service.description}
                </p>

                {/* Key Deliverables List */}
                <div className="mt-6 pt-6 border-t border-[var(--color-border)]/60">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] mb-3">
                    Deliverables & Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors underline-offset-4 hover:underline"
                >
                  View Full Specifications
                </button>

                <button
                  onClick={() => handleCommissionClick(service)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full transition-all duration-200 shadow-sm"
                >
                  <span>{service.ctaText || 'Inquire Service'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--surface-soft)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-secondary)]">
              {selectedService.category}
            </span>
            <h3 className="text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
              {selectedService.title}
            </h3>

            <div className="my-6 rounded-xl overflow-hidden h-56 bg-neutral-900">
              <img
                src={selectedService.imageUrl}
                alt={selectedService.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {selectedService.description}
            </p>

            <div className="mt-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] mb-3">
                Full Deliverables & Scope
              </h4>
              <ul className="space-y-2">
                {selectedService.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] rounded-full"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedService;
                  setSelectedService(null);
                  handleCommissionClick(s);
                }}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm"
              >
                Commission This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
