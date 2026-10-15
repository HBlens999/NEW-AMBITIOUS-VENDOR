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
    if (!saved) return INITIAL_SITE_SETTINGS;
    const parsed = JSON.parse(saved);
    return { ...INITIAL_SITE_SETTINGS, ...parsed, socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : INITIAL_SITE_SETTINGS.socialLinks };
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

  // Load the current JSON-based Supabase schema.
  const refreshData = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setIsLoading(true);
    try {
      const [siteRes, heroRes, marqueeRes, aboutRes, servicesRes, portfolioRes, perfumesRes, inquiriesRes] = await Promise.all([
        supabase.from('site_settings').select('data').eq('key','current').maybeSingle(),
        supabase.from('hero_settings').select('data').eq('key','current').maybeSingle(),
        supabase.from('marquee_settings').select('data').eq('key','current').maybeSingle(),
        supabase.from('about_content').select('data').eq('key','current').maybeSingle(),
        supabase.from('services').select('id,data,sort_order,published').order('sort_order',{ascending:true}),
        supabase.from('portfolio_projects').select('id,data,sort_order,published').order('sort_order',{ascending:true}),
        supabase.from('perfume_products').select('id,data,sort_order,published').order('sort_order',{ascending:true}),
        supabase.from('contact_submissions').select('*').order('created_at',{ascending:false}),
      ]);
      if(siteRes.data?.data){const d=siteRes.data.data;setSiteSettings(p=>({...p,siteTitle:d.siteName||d.logoText||p.siteTitle,tagline:d.tagline||p.tagline,metaDescription:d.seoDescription||d.metaDescription||p.metaDescription,logoUrl:d.logoUrl||p.logoUrl,faviconUrl:d.faviconUrl||p.faviconUrl,email:d.email||p.email,phone:d.phone||p.phone,whatsapp:d.whatsapp||p.whatsapp,address:d.address||p.address,marqueeSpeedSeconds:d.marqueeSpeedSeconds||p.marqueeSpeedSeconds,socialLinks:Array.isArray(d.socialLinks)?d.socialLinks:(p.socialLinks||INITIAL_SITE_SETTINGS.socialLinks)}));}
      if(heroRes.data?.data){const d=heroRes.data.data;setHeroSettings(p=>({...p,...d,headline:d.headline||p.headline,subheading:d.subheading||p.subheading,backgroundImageUrl:d.bgImage||d.backgroundImageUrl||p.backgroundImageUrl,duration:d.duration||p.duration}));}
      if(marqueeRes.data?.data){const d=marqueeRes.data.data;setSiteSettings(p=>({...p,marqueeSpeedSeconds:d.speedSeconds||p.marqueeSpeedSeconds}));}
      if(aboutRes.data?.data){const d=aboutRes.data.data;setFounder(p=>({...p,name:d.name||p.name,title:d.ceoTitle||d.title||p.title,brandRole:d.ceoName||d.brandRole||p.brandRole,bio:d.brandIntro||d.bio||p.bio,statement:d.headline||d.statement||p.statement,portraitUrl:d.ceoImage||d.portraitUrl||p.portraitUrl,email:d.email||p.email,phone:d.phone||p.phone,whatsapp:d.whatsapp||p.whatsapp,instagram:d.instagram||p.instagram,linkedin:d.linkedin||p.linkedin}));}
      if(!servicesRes.error){const loadedServices=(servicesRes.data||[]).filter((r:any)=>r.published!==false).map((r:any)=>{const d=r.data||{};return{id:r.id,title:d.title||'',category:d.category||'',tagline:d.tagline||d.shortDescription||'',description:d.fullDescription||d.description||'',deliverables:Array.isArray(d.deliverables)?d.deliverables:[],imageUrl:d.image||d.imageUrl||'',ctaText:d.ctaText||'',sortOrder:r.sort_order??d.order??0};});setServices(loadedServices);localStorage.setItem(STORAGE_KEYS.SERVICES,JSON.stringify(loadedServices));}
      if(!portfolioRes.error){const loadedPortfolio=(portfolioRes.data||[]).filter((r:any)=>r.published!==false).map((r:any)=>{const d=r.data||{};return{id:r.id,title:d.title||'',category:d.category||'Graphic Design',client:d.client||'',year:String(d.year||''),summary:d.description||d.summary||'',outcome:d.outcome||'',imageUrl:d.image||d.imageUrl||'',tags:Array.isArray(d.tags)?d.tags:[],projectUrl:d.projectUrl||d.project_url||'',featured:Boolean(d.featured)};});setPortfolio(loadedPortfolio);localStorage.setItem(STORAGE_KEYS.PORTFOLIO,JSON.stringify(loadedPortfolio));}
      if(perfumesRes.data?.length)setPerfumes(perfumesRes.data.filter((r:any)=>r.published!==false).map((r:any)=>{const d=r.data||{};const price=Number(String(d.price||d.priceNaira||'0').replace(/[^0-9.]/g,''));const notes=typeof d.notes==='string'?{top:d.notes,heart:'',base:''}:(d.notes||{top:'',heart:'',base:''});return{id:r.id,name:d.name||'',subtitle:d.tagline||d.subtitle||'',volume:d.volume||'',priceNaira:Number.isFinite(price)?price:0,description:d.description||'',notes,imageUrl:d.image||d.imageUrl||'',inStock:(d.status||'Available')!=='Out of Stock',featured:Boolean(d.featured)};}));
      if(inquiriesRes.data)setInquiries(inquiriesRes.data.map((i:any)=>({id:i.id,name:i.full_name||'',email:i.email||'',phone:i.phone||'',serviceCategory:i.service||'',timeline:'',budgetRange:i.budget||'',message:i.message||'',status:(i.status==='In Progress'?'in_progress':i.status==='Resolved'?'completed':'new') as InquirySubmission['status'],createdAt:i.created_at})));
      setSupabaseConfig(p=>({...p,connected:true,lastChecked:new Date().toLocaleTimeString(),error:undefined}));
    } catch(err) { console.warn('Supabase fetch error:',err); setSupabaseConfig(p=>({...p,connected:false,error:err instanceof Error?err.message:'Could not load Supabase data'})); }
    finally { setIsLoading(false); }
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
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured. Services cannot be saved for other devices.');
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Please sign in to the admin portal before saving services.');
    for (const [index, s] of newServices.entries()) {
      const { error } = await supabase.from('services').upsert({
        id: s.id,
        data: { id: s.id, title: s.title, category: s.category, tagline: s.tagline, shortDescription: s.tagline, fullDescription: s.description, description: s.description, deliverables: s.deliverables, image: s.imageUrl, ctaText: s.ctaText, order: index, published: true },
        sort_order: index,
        published: true,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(`Could not save service "${s.title}": ${error.message}`);
    }
    const { data: existing, error: listError } = await supabase.from('services').select('id');
    if (listError) throw new Error(`Could not verify saved services: ${listError.message}`);
    const keepIds = new Set(newServices.map(s => s.id));
    for (const row of existing || []) {
      if (!keepIds.has(row.id)) {
        const { error } = await supabase.from('services').delete().eq('id', row.id);
        if (error) throw new Error(`Could not remove deleted service: ${error.message}`);
      }
    }
    setServices(newServices);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
  };

  const savePortfolio = async (newPortfolio: PortfolioProject[]) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured. Portfolio changes cannot be published across devices.');
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Please sign in to the admin portal before saving portfolio projects.');
    for (const [index, p] of newPortfolio.entries()) {
      const { error } = await supabase.from('portfolio_projects').upsert({ id: p.id, data: { id: p.id, title: p.title, category: p.category, client: p.client, year: p.year, description: p.summary, summary: p.summary, outcome: p.outcome, image: p.imageUrl, imageUrl: p.imageUrl, tags: p.tags, projectUrl: p.projectUrl, featured: p.featured, order: index, published: true }, sort_order: index, published: true, updated_at: new Date().toISOString() });
      if (error) throw new Error(`Could not save portfolio project \"${p.title}\": ${error.message}`);
    }
    const { data: existing, error: listError } = await supabase.from('portfolio_projects').select('id');
    if (listError) throw new Error(`Could not verify saved portfolio projects: ${listError.message}`);
    const keepIds = new Set(newPortfolio.map(p => p.id));
    for (const row of existing || []) if (!keepIds.has(row.id)) {
      const { error } = await supabase.from('portfolio_projects').delete().eq('id', row.id);
      if (error) throw new Error(`Could not remove deleted portfolio project: ${error.message}`);
    }
    setPortfolio(newPortfolio);
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(newPortfolio));
  };

  const savePerfumes = async (newPerfumes: PerfumeProduct[]) => {
    setPerfumes(newPerfumes); localStorage.setItem(STORAGE_KEYS.PERFUMES,JSON.stringify(newPerfumes));
    const supabase=getSupabase(); if(!supabase)return;
    for(const p of newPerfumes){const {error}=await supabase.from('perfume_products').upsert({id:p.id,data:{id:p.id,name:p.name,tagline:p.subtitle,subtitle:p.subtitle,volume:p.volume,price:String(p.priceNaira),priceNaira:p.priceNaira,description:p.description,notes:[p.notes.top,p.notes.heart,p.notes.base].filter(Boolean).join(' · '),image:p.imageUrl,status:p.inStock?'Available':'Out of Stock',featured:p.featured,order:newPerfumes.indexOf(p),published:true},sort_order:newPerfumes.indexOf(p),published:true});if(error)throw error;}
  };

  const saveFounder = async (newFounder: FounderProfile) => {
    setFounder(newFounder); localStorage.setItem(STORAGE_KEYS.FOUNDER,JSON.stringify(newFounder));
    const supabase=getSupabase(); if(!supabase)return;
    const data={ceoName:newFounder.brandRole,ceoTitle:newFounder.title,brandRole:newFounder.brandRole,bio:newFounder.bio,brandIntro:newFounder.bio,headline:newFounder.statement,statement:newFounder.statement,ceoImage:newFounder.portraitUrl,portraitUrl:newFounder.portraitUrl,name:newFounder.name,email:newFounder.email,phone:newFounder.phone,whatsapp:newFounder.whatsapp,instagram:newFounder.instagram,linkedin:newFounder.linkedin};
    const {error}=await supabase.from('about_content').upsert({key:'current',data,updated_at:new Date().toISOString()}); if(error)throw error;
  };

  const saveHeroSettings = async (newHero: HeroSettings) => {
    setHeroSettings(newHero); localStorage.setItem(STORAGE_KEYS.HERO,JSON.stringify(newHero));
    const supabase=getSupabase(); if(!supabase)return;
    const {error}=await supabase.from('hero_settings').upsert({key:'current',data:{...newHero,bgImage:(newHero as any).bgImage||(newHero as any).backgroundImage},updated_at:new Date().toISOString()});if(error)throw error;
  };

  const saveSiteSettings = async (newSite: SiteSettings) => {
    setSiteSettings(newSite); localStorage.setItem(STORAGE_KEYS.SITE,JSON.stringify(newSite));
    const supabase=getSupabase(); if(!supabase)return;
    const timestamp = new Date().toISOString();
    const {error}=await supabase.from('site_settings').upsert({key:'current',data:{siteName:newSite.siteTitle,logoText:newSite.siteTitle,tagline:newSite.tagline,seoDescription:newSite.metaDescription,logoUrl:newSite.logoUrl,faviconUrl:newSite.faviconUrl,email:newSite.email,phone:newSite.phone,whatsapp:newSite.whatsapp,address:newSite.address,marqueeSpeedSeconds:newSite.marqueeSpeedSeconds,socialLinks:newSite.socialLinks||[]},updated_at:timestamp});if(error)throw error;
    const {data:existingMarquee,error:marqueeReadError}=await supabase.from('marquee_settings').select('data').eq('key','current').maybeSingle();if(marqueeReadError)throw marqueeReadError;
    const marqueeData={...(existingMarquee?.data||{}),speedSeconds:newSite.marqueeSpeedSeconds};
    const {error:marqueeError}=await supabase.from('marquee_settings').upsert({key:'current',data:marqueeData,updated_at:timestamp});if(marqueeError)throw marqueeError;
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
      const {error}=await supabase.from('contact_submissions').insert({
        id:newInquiry.id,full_name:newInquiry.name,email:newInquiry.email,phone:newInquiry.phone,
        service:newInquiry.serviceCategory,budget:newInquiry.budgetRange,message:newInquiry.message,status:'New',created_at:newInquiry.createdAt
      });
      if(error){console.warn('Inquiry remote sync error:',error.message);return {success:false,id};}
    }

    return { success: true, id };
  };

  const updateInquiryStatus = async (id: string, status: InquirySubmission['status']) => {
    const updated=inquiries.map(i=>i.id===id?{...i,status}:i);setInquiries(updated);localStorage.setItem(STORAGE_KEYS.INQUIRIES,JSON.stringify(updated));
    const supabase=getSupabase();if(supabase){const dbStatus=status==='completed'?'Resolved':status==='in_progress'?'In Progress':'New';const {error}=await supabase.from('contact_submissions').update({status:dbStatus}).eq('id',id);if(error)throw error;}
  };

  const deleteInquiry = async (id: string) => {
    const updated=inquiries.filter(i=>i.id!==id);setInquiries(updated);localStorage.setItem(STORAGE_KEYS.INQUIRIES,JSON.stringify(updated));
    const supabase=getSupabase();if(supabase){const {error}=await supabase.from('contact_submissions').delete().eq('id',id);if(error)throw error;}
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
