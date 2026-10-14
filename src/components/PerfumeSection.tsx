import React, { useState } from 'react';
import { Droplets, Sparkles, MessageCircle, Info, X, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PerfumeProduct } from '../types/data';

export const PerfumeSection: React.FC = () => {
  const { perfumes, siteSettings } = useData();
  const [selectedPerfume, setSelectedPerfume] = useState<PerfumeProduct | null>(null);

  const handleOrderViaWhatsApp = (perfume: PerfumeProduct) => {
    const rawNumber = siteSettings.whatsapp || siteSettings.phone || '+2348140000000';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Ambitious Vendor, I would like to order/inquire about the fragrance: "${perfume.name} (${perfume.subtitle} - ${perfume.volume})" priced at ₦${perfume.priceNaira.toLocaleString()}.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="perfumes" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 pb-6 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)] mb-2">
            <Droplets className="w-3.5 h-3.5" />
            <span>03. Artisanal Fragrances</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)]">
            Haute Parfumerie & Curated Scents
          </h2>
        </div>
        <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
          Niche artisanal perfumes, rare amber extracts, and signature fragrances curated for extraordinary longevity and presence.
        </p>
      </div>

      {/* Fragrance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {perfumes.map(perfume => (
          <article
            key={perfume.id}
            className="group flex flex-col bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Bottle Image Frame */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#181318]">
              <img
                src={perfume.imageUrl}
                alt={perfume.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              <span className="absolute top-4 left-4 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                {perfume.volume}
              </span>

              {perfume.inStock ? (
                <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 backdrop-blur-md rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>In Stock</span>
                </span>
              ) : (
                <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-mono text-amber-300 bg-amber-950/70 border border-amber-500/30 backdrop-blur-md rounded-full">
                  Pre-Order Only
                </span>
              )}
            </div>

            {/* Product Details Panel */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[var(--color-secondary)]">
                  {perfume.subtitle}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors mt-1">
                  {perfume.name}
                </h3>
                <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                  {perfume.description}
                </p>

                {/* Fragrance Notes Breakdown */}
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]/60 text-xs space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-secondary)] w-12 shrink-0">
                      Top:
                    </span>
                    <span className="text-[var(--text-secondary)] truncate">{perfume.notes.top}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-secondary)] w-12 shrink-0">
                      Heart:
                    </span>
                    <span className="text-[var(--text-secondary)] truncate">{perfume.notes.heart}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-secondary)] w-12 shrink-0">
                      Base:
                    </span>
                    <span className="text-[var(--text-secondary)] truncate">{perfume.notes.base}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-6 pt-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                    Retail Price
                  </span>
                  <span className="text-xl font-bold font-serif text-[var(--text-primary)]">
                    ₦{perfume.priceNaira.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPerfume(perfume)}
                    aria-label="View perfume notes"
                    className="p-2.5 rounded-full border border-[var(--color-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)] transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOrderViaWhatsApp(perfume)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full transition-all duration-200 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Perfume Note Modal */}
      {selectedPerfume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedPerfume(null)}
              className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--surface-soft)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-secondary)]">
              {selectedPerfume.subtitle} · {selectedPerfume.volume}
            </span>
            <h3 className="text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
              {selectedPerfume.name}
            </h3>

            <div className="my-5 rounded-xl overflow-hidden h-52 bg-neutral-900">
              <img
                src={selectedPerfume.imageUrl}
                alt={selectedPerfume.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {selectedPerfume.description}
            </p>

            <div className="mt-5 p-4 rounded-xl bg-[var(--surface-soft)] space-y-2 border border-[var(--color-border)] text-xs">
              <div>
                <strong className="text-[var(--text-primary)]">Top Notes:</strong>{' '}
                <span className="text-[var(--text-secondary)]">{selectedPerfume.notes.top}</span>
              </div>
              <div>
                <strong className="text-[var(--text-primary)]">Heart Notes:</strong>{' '}
                <span className="text-[var(--text-secondary)]">{selectedPerfume.notes.heart}</span>
              </div>
              <div>
                <strong className="text-[var(--text-primary)]">Base Notes:</strong>{' '}
                <span className="text-[var(--text-secondary)]">{selectedPerfume.notes.base}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[var(--text-secondary)] block">Price</span>
                <span className="text-xl font-bold font-serif text-[var(--text-primary)]">
                  ₦{selectedPerfume.priceNaira.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  const p = selectedPerfume;
                  setSelectedPerfume(null);
                  handleOrderViaWhatsApp(p);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
