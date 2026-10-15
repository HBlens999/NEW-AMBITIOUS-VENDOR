import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle, Mail, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../context/DataContext';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService = 'Website Development' }) => {
  const { siteSettings, submitInquiry } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceCategory: initialService,
    timeline: 'Within 2-4 Weeks',
    budgetRange: 'Standard Investment',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceCategory: formData.serviceCategory,
        timeline: formData.timeline,
        budgetRange: formData.budgetRange,
        message: formData.message.trim(),
      });

      if (res.success) {
        setSubmittedId(res.id);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#71384B', '#B66F7D', '#DCA7AE', '#FFF0F2'],
        });
      }
    } catch {
      setErrorMsg('An error occurred submitting your inquiry. Please try again or message via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const rawNumber = siteSettings.whatsapp || siteSettings.phone || '+2348140000000';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Ambitious Vendor, I am inquiring about commissioning: ${formData.serviceCategory || 'Creative Services'}.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[var(--surface-card)] rounded-3xl border border-[var(--color-border)] p-8 sm:p-12 lg:p-16 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Info & Editorial Pitch */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>05. Project Consultation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--text-primary)] leading-tight">
                Let&rsquo;s Create Something Extraordinary
              </h2>
              <p className="mt-5 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Whether you need a full brand overhaul, a custom website, high-impact video post-production, or luxury fragrance consultations, we are ready to bring your vision to life.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--surface-soft)]">
                <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono uppercase text-[var(--color-secondary)] block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-sm font-semibold text-[var(--text-primary)] hover:underline"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--surface-soft)]">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono uppercase text-[var(--color-secondary)] block">
                    WhatsApp Hotline
                  </span>
                  <a
                    href={`https://wa.me/${(siteSettings.whatsapp || siteSettings.phone).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[var(--text-primary)] hover:underline"
                  >
                    {siteSettings.whatsapp || siteSettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--surface-soft)]">
                <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono uppercase text-[var(--color-secondary)] block">
                    Location & Reach
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {siteSettings.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form or Success State */}
          <div className="lg:col-span-7">
            {submittedId ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[var(--surface-soft)] rounded-2xl border border-[var(--color-border)]">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center mb-6 shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
                  Consultation Request Received
                </h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
                  Thank you for reaching out. Your inquiry has been cataloged under reference{' '}
                  <code className="font-mono text-xs text-[var(--color-primary)] bg-[var(--surface-card)] px-2 py-0.5 rounded">
                    {submittedId}
                  </code>
                  . Elobisi Mmesoma will review your request and reply shortly.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        serviceCategory: 'Website Development',
                        timeline: 'Within 2-4 Weeks',
                        budgetRange: 'Standard Investment',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full border border-[var(--color-border)] hover:bg-[var(--surface-card)]"
                  >
                    Send Another Inquiry
                  </button>
                  <button
                    onClick={handleWhatsAppDirect}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-950/10 border border-rose-300 text-rose-800 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Primary Discipline *
                    </label>
                    <select
                      value={formData.serviceCategory}
                      onChange={e => setFormData({ ...formData, serviceCategory: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    >
                      <option value="Graphic Design">Graphic Design & Brand Identity</option>
                      <option value="Website Development">Website Development & Digital Platform</option>
                      <option value="Perfume Vendor">Perfume Vendor & Fragrance Wardrobe</option>
                      <option value="Video Editing">Video Editing & Cinematic Post-Production</option>
                      <option value="Multi-Discipline Package">Comprehensive Brand & Web Bundle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Desired Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    >
                      <option value="Immediate / Rush">Immediate (1-2 Weeks)</option>
                      <option value="Within 2-4 Weeks">Standard (2-4 Weeks)</option>
                      <option value="Flexible / 1-2 Months">Flexible (1-2 Months)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                      Investment Budget
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    >
                      <option value="₦150k - ₦500k">₦150k - ₦500k</option>
                      <option value="₦500k - ₦1.5M">₦500k - ₦1.5M</option>
                      <option value="₦1.5M - ₦5M+">₦1.5M - ₦5M+</option>
                      <option value="Flexible">To Be Discussed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Project Vision & Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your brand goals, target audience, aesthetic preferences, or specific fragrance requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all resize-y"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Prefer WhatsApp? Chat directly</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full transition-all duration-200 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Consultation...</span>
                    ) : (
                      <>
                        <span>Submit Consultation</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
