export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  deliverables: string[];
  imageUrl: string;
  ctaText?: string;
  sortOrder: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'Graphic Design' | 'Website Development' | 'Video Editing' | 'Brand Identity';
  client: string;
  year: string;
  summary: string;
  outcome: string;
  imageUrl: string;
  tags: string[];
  projectUrl?: string;
  featured?: boolean;
}

export interface PerfumeProduct {
  id: string;
  name: string;
  subtitle: string;
  volume: string;
  priceNaira: number;
  description: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  imageUrl: string;
  inStock: boolean;
  featured?: boolean;
}

export interface FounderProfile {
  name: string;
  title: string;
  brandRole: string;
  bio: string;
  statement: string;
  portraitUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  experienceYears: number;
}

export interface InquirySubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  timeline: string;
  budgetRange?: string;
  message: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';
  createdAt: string;
}

export interface HeroSettings {
  headline: string;
  introKicker: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  activeGlowEffect: 'fire' | 'ice' | 'thunder' | 'neon' | 'rose' | 'cycle';
  cycleSpeedSeconds: number;
  backgroundImageUrl?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  icon: string;
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  metaDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  socialPreviewUrl?: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  marqueeSpeedSeconds: number;
  pauseMarqueeOnHover: boolean;
  socialLinks?: SocialLink[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  connected: boolean;
  lastChecked?: string;
  error?: string;
}
