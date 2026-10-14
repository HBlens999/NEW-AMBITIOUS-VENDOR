import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  FounderProfile,
  HeroSettings,
  InquirySubmission,
  PerfumeProduct,
  PortfolioProject,
  ServiceItem,
  SiteSettings,
  SupabaseConfig,
} from '../types/data';
import {
  INITIAL_FOUNDER,
  INITIAL_HERO_SETTINGS,
  INITIAL_PERFUMES,
  INITIAL_PORTFOLIO,
  INITIAL_SERVICES,
  INITIAL_SITE_SETTINGS,
} from '../data/initialData';
import {
  getStoredSupabaseConfig,
  getSupabase,
  saveSupabaseConfig,
  testSupabaseConnection,
  uploadImageToStorage,
} from '../lib/supabase';

interface DataContextType {
  services: ServiceItem[];
  portfolio: PortfolioProject[];
  perfumes: PerfumeProduct[];
  founder: FounderProfile;
  heroSettings: HeroSettings;
  siteSettings: SiteSettings;
  inquiries: InquirySubmission[];
  supabaseConfig: SupabaseConfig;
  isLoading: boolean;
  saveServices: (services: ServiceItem[]) => Promise<void>;
  savePortfolio: (portfolio: PortfolioProject[]) => Promise<void>;
  savePerfumes: (perfumes: PerfumeProduct[]) => Promise<void>;
  saveFounder: (founder: FounderProfile) => Promise<void>;
  saveHeroSettings: (settings: HeroSettings) => Promise<void>;
  saveSiteSettings: (settings: SiteSettings) => Promise<void>;
  submitInquiry: (data: Omit<InquirySubmission, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; id: string }>;
  updateInquiryStatus: (id: string, status: InquirySubmission['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  uploadImage: (
    bucket: 'site-assets' | 'service-images' | 'founder-images' | 'portfolio-images' | 'product-images',
    file: File
  ) => Promise<{ url: string; error?: string }>;
  updateSupabaseCredentials: (url: string, anonKey: string) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;
}

const STORAGE_KEYS = {
  SERVICES: 'ambitious_services_data',
  PORTFOLIO: 'ambitious_portfolio_data',
  PERFUMES: 'ambitious_perfumes_data',
  FOUNDER: 'ambitious_founder_data',
  HERO: 'ambitious_hero_data',
  SITE: 'ambitious_site_data',
  INQUIRIES: 'ambitious_inquiries_data',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
  });

  const [perfumes, setPerfumes] = useState<PerfumeProduct[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERFUMES);
    return saved ? JSON.parse(saved) : INITIAL_PERFUMES;
  });

  const [founder, setFounder] = useState<FounderProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOUNDER);
    return saved ? JSON.parse(saved) : INITIAL_FOUNDER;
  });

  const [heroSettings, setHeroSettings] = useState<HeroSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HERO);
    return saved ? JSON.parse(saved) : INITIAL_HERO_SETTINGS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SITE);
    return saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS;
  });

  const [inquiries, setInquiries] = useState<InquirySubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    return saved ? JSON.parse(saved) : [];
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const cfg = getStoredSupabaseConfig();
    return {
      url: cfg.url,
      anonKey: cfg.anonKey,
      isConfigured: cfg.isConfigured,
      connected: false,
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync favicon if siteSettings changes
  useEffect(() => {
    if (siteSettings.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.faviconUrl;
    }
  }, [siteSettings.faviconUrl]);

  // Sync site title
  useEffect(() => {
    if (siteSettings.siteTitle) {
      document.title = `${siteSettings.siteTitle} — ${siteSettings.tagline}`;
    }
  }, [siteSettings.siteTitle, siteSettings.tagline]);

  // Load from Supabase if connected
  const refreshData = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    setIsLoading(true);
    try {
      // 1. Fetch site settings
      const { data: siteData, error: siteErr } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!siteErr && siteData) {
        setSiteSettings(prev => ({
          ...prev,
          siteTitle: siteData.site_title || prev.siteTitle,
          tagline: siteData.tagline || prev.tagline,
          metaDescription: siteData.meta_description || prev.metaDescription,
          logoUrl: siteData.logo_url || prev.logoUrl,
          faviconUrl: siteData.favicon_url || prev.faviconUrl,
          email: siteData.email || prev.email,
          phone: siteData.phone || prev.phone,
          whatsapp: siteData.whatsapp || prev.whatsapp,
          address: siteData.address || prev.address,
          marqueeSpeedSeconds: siteData.marquee_speed_seconds || prev.marqueeSpeedSeconds,
        }));
      }

      // 2. Fetch services
      const { data: servicesData, error: srvErr } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (!srvErr && servicesData && servicesData.length > 0) {
        setServices(servicesData.map(s => ({
          id: s.id,
          title: s.title,
          category: s.category,
          tagline: s.tagline || '',
          description: s.description,
          deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
          imageUrl: s.image_url,
          ctaText: s.cta_text,
          sortOrder: s.sort_order || 0,
        })));
      }

      // 3. Fetch portfolio
      const { data: portData, error: portErr } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
      if (!portErr && portData && portData.length > 0) {
        setPortfolio(portData.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          client: p.client,
          year: p.year,
          summary: p.summary,
          outcome: p.outcome,
          imageUrl: p.image_url,
          tags: Array.isArray(p.tags) ? p.tags : [],
          projectUrl: p.project_url,
          featured: p.featured,
        })));
      }

      // 4. Fetch perfumes
      const { data: perfData, error: perfErr } = await supabase.from('perfume_products').select('*');
      if (!perfErr && perfData && perfData.length > 0) {
        setPerfumes(perfData.map(pr => ({
          id: pr.id,
          name: pr.name,
          subtitle: pr.subtitle,
          volume: pr.volume,
          priceNaira: Number(pr.price_naira),
          description: pr.description,
          notes: pr.notes || { top: '', heart: '', base: '' },
          imageUrl: pr.image_url,
          inStock: pr.in_stock,
          featured: pr.featured,
        })));
      }

      // 5. Fetch founder profile
      const { data: founderData, error: fndErr } = await supabase.from('founder_profile').select('*').limit(1).single();
      if (!fndErr && founderData) {
        setFounder({
          name: founderData.name,
          title: founderData.title,
          brandRole: founderData.brand_role,
          bio: founderData.bio,
          statement: founderData.statement,
          portraitUrl: founderData.portrait_url,
          email: founderData.email,
          phone: founderData.phone,
          whatsapp: founderData.whatsapp,
          instagram: founderData.instagram,
          linkedin: founderData.linkedin,
          experienceYears: founderData.experience_years,
        });
      }

      // 6. Fetch inquiries
      const { data: inqData, error: inqErr } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!inqErr && inqData) {
        setInquiries(inqData.map(i => ({
          id: i.id,
          name: i.name,
          email: i.email,
          phone: i.phone,
          serviceCategory: i.service_category,
          timeline: i.timeline,
          budgetRange: i.budget_range,
          message: i.message,
          status: i.status || 'new',
          createdAt: i.created_at,
        })));
      }

      setSupabaseConfig(prev => ({ ...prev, connected: true, lastChecked: new Date().toLocaleTimeString() }));
    } catch (err) {
      console.warn('Supabase fetch error, using local data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial check
  useEffect(() => {
    if (supabaseConfig.isConfigured) {
      testSupabaseConnection().then(res => {
        setSupabaseConfig(prev => ({
          ...prev,
          connected: res.success,
          error: res.success ? undefined : res.message,
        }));
        if (res.success) {
          refreshData();
        }
      });
    }
  }, [supabaseConfig.isConfigured, refreshData]);

  // Persist locally
  const saveServices = async (newServices: ServiceItem[]) => {
    setServices(newServices);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));

    const supabase = getSupabase();
    if (supabase) {
      for (const s of newServices) {
        await supabase.from('services').upsert({
          id: s.id,
          title: s.title,
          category: s.category,
          tagline: s.tagline,
          description: s.description,
          deliverables: s.deliverables,
          image_url: s.imageUrl,
          cta_text: s.ctaText,
          sort_order: s.sortOrder,
        });
      }
    }
  };

  const savePortfolio = async (newPortfolio: PortfolioProject[]) => {
    setPortfolio(newPortfolio);
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(newPortfolio));

    const supabase = getSupabase();
    if (supabase) {
      for (const p of newPortfolio) {
        await supabase.from('portfolio_projects').upsert({
          id: p.id,
          title: p.title,
          category: p.category,
          client: p.client,
          year: p.year,
          summary: p.summary,
          outcome: p.outcome,
          image_url: p.imageUrl,
          tags: p.tags,
          project_url: p.projectUrl,
          featured: p.featured,
        });
      }
    }
  };

  const savePerfumes = async (newPerfumes: PerfumeProduct[]) => {
    setPerfumes(newPerfumes);
    localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(newPerfumes));

    const supabase = getSupabase();
    if (supabase) {
      for (const p of newPerfumes) {
        await supabase.from('perfume_products').upsert({
          id: p.id,
          name: p.name,
          subtitle: p.subtitle,
          volume: p.volume,
          price_naira: p.priceNaira,
          description: p.description,
          notes: p.notes,
          image_url: p.imageUrl,
          in_stock: p.inStock,
          featured: p.featured,
        });
      }
    }
  };

  const saveFounder = async (newFounder: FounderProfile) => {
    setFounder(newFounder);
    localStorage.setItem(STORAGE_KEYS.FOUNDER, JSON.stringify(newFounder));

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('founder_profile').upsert({
        id: 'founder',
        name: newFounder.name,
        title: newFounder.title,
        brand_role: newFounder.brandRole,
        bio: newFounder.bio,
        statement: newFounder.statement,
        portrait_url: newFounder.portraitUrl,
        email: newFounder.email,
        phone: newFounder.phone,
        whatsapp: newFounder.whatsapp,
        instagram: newFounder.instagram,
        linkedin: newFounder.linkedin,
        experience_years: newFounder.experienceYears,
      });
    }
  };

  const saveHeroSettings = async (newHero: HeroSettings) => {
    setHeroSettings(newHero);
    localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(newHero));
  };

  const saveSiteSettings = async (newSite: SiteSettings) => {
    setSiteSettings(newSite);
    localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(newSite));

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('site_settings').upsert({
        id: 'default',
        site_title: newSite.siteTitle,
        tagline: newSite.tagline,
        meta_description: newSite.metaDescription,
        logo_url: newSite.logoUrl,
        favicon_url: newSite.faviconUrl,
        email: newSite.email,
        phone: newSite.phone,
        whatsapp: newSite.whatsapp,
        address: newSite.address,
        marquee_speed_seconds: newSite.marqueeSpeedSeconds,
      });
    }
  };

  const submitInquiry = async (
    data: Omit<InquirySubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; id: string }> => {
    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newInquiry: InquirySubmission = {
      ...data,
      id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('inquiries').insert({
          id: newInquiry.id,
          name: newInquiry.name,
          email: newInquiry.email,
          phone: newInquiry.phone,
          service_category: newInquiry.serviceCategory,
          timeline: newInquiry.timeline,
          budget_range: newInquiry.budgetRange,
          message: newInquiry.message,
          status: newInquiry.status,
          created_at: newInquiry.createdAt,
        });
      } catch (err) {
        console.warn('Inquiry remote sync error:', err);
      }
    }

    return { success: true, id };
  };

  const updateInquiryStatus = async (id: string, status: InquirySubmission['status']) => {
    const updated = inquiries.map(i => (i.id === id ? { ...i, status } : i));
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('inquiries').update({ status }).eq('id', id);
    }
  };

  const deleteInquiry = async (id: string) => {
    const updated = inquiries.filter(i => i.id !== id);
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('inquiries').delete().eq('id', id);
    }
  };

  const uploadImage = async (
    bucket: 'site-assets' | 'service-images' | 'founder-images' | 'portfolio-images' | 'product-images',
    file: File
  ) => {
    return uploadImageToStorage(bucket, file);
  };

  const updateSupabaseCredentials = async (url: string, anonKey: string) => {
    saveSupabaseConfig(url, anonKey);
    const testResult = await testSupabaseConnection(url, anonKey);
    setSupabaseConfig({
      url,
      anonKey,
      isConfigured: Boolean(url && anonKey),
      connected: testResult.success,
      error: testResult.success ? undefined : testResult.message,
      lastChecked: new Date().toLocaleTimeString(),
    });

    if (testResult.success) {
      await refreshData();
    }

    return testResult;
  };

  return (
    <DataContext.Provider
      value={{
        services,
        portfolio,
        perfumes,
        founder,
        heroSettings,
        siteSettings,
        inquiries,
        supabaseConfig,
        isLoading,
        saveServices,
        savePortfolio,
        savePerfumes,
        saveFounder,
        saveHeroSettings,
        saveSiteSettings,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        uploadImage,
        updateSupabaseCredentials,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
