import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceMarquee } from './components/ServiceMarquee';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PerfumeSection } from './components/PerfumeSection';
import { FounderSection } from './components/FounderSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceInquiry, setSelectedServiceInquiry] = useState<string>('Website Development');

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-[var(--color-secondary)] selection:text-white">
          {/* Top Bar Navigation */}
          <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

          {/* Main Website Structure */}
          <main className="flex-1">
            {/* 1. Cinematic Hero with 5-State Glowing Headline */}
            <Hero />

            {/* 2. Continuous Right-to-Left Service Marquee */}
            <ServiceMarquee />

            {/* 3. Core Capabilities & Services Section */}
            <ServicesSection
              onSelectServiceForInquiry={serviceCategory => {
                setSelectedServiceInquiry(serviceCategory);
              }}
            />

            {/* 4. Selected Works & Curated Portfolio */}
            <PortfolioSection />

            {/* 5. Haute Parfumerie & Luxury Scents Showcase */}
            <PerfumeSection />

            {/* 6. Founder & CEO Showcase (Elobisi Mmesoma) */}
            <FounderSection />

            {/* 7. Consultation Inquiry & Project Contact */}
            <ContactSection initialService={selectedServiceInquiry} />
          </main>

          {/* Professional Footer */}
          <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

          {/* Admin CMS Modal */}
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}
