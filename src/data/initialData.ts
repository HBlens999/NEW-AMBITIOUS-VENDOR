import {
  FounderProfile,
  HeroSettings,
  PerfumeProduct,
  PortfolioProject,
  ServiceItem,
  SiteSettings,
} from '../types/data';

// High-fidelity image paths generated
import heroFounderImg from '../assets/images/hero_creative_director_1791917641326.jpg';
import graphicDesignImg from '../assets/images/service_graphic_design_1791917641699.jpg';
import webDevImg from '../assets/images/service_web_development_1791917642183.jpg';
import perfumeImg from '../assets/images/service_perfume_luxury_1791917642355.jpg';
import videoEditingImg from '../assets/images/service_video_editing_1791917643199.jpg';
import portfolioBrandingImg from '../assets/images/portfolio_luxury_branding_1791917667206.jpg';
import portfolioWebImg from '../assets/images/portfolio_digital_web_1791917668383.jpg';
import portfolioFilmImg from '../assets/images/portfolio_film_editing_1791917668360.jpg';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    category: 'Visual Identity & Art Direction',
    tagline: 'Distinctive brand identities, typography specimens, and editorial collateral.',
    description:
      'We craft bespoke visual systems, luxury stationery, corporate brand guidelines, marketing assets, and publication design that position your brand in its highest tier.',
    deliverables: [
      'Bespoke Brand Identity & Logos',
      'Typography Specimens & Guidelines',
      'Luxury Packaging & Print Collateral',
      'Campaign & Social Media Direction',
    ],
    imageUrl: graphicDesignImg,
    ctaText: 'Commission Identity',
    sortOrder: 1,
  },
  {
    id: 'website-development',
    title: 'Website Development',
    category: 'Engineering & Interactive Digital',
    tagline: 'High-performance bespoke web applications and luxury digital platforms.',
    description:
      'Engineered with modern frontend architectures, responsive design-token systems, and seamless database workflows for high conversion and effortless management.',
    deliverables: [
      'Custom React & Full-Stack Applications',
      'E-commerce & Luxury Showcase Portals',
      'Database Architecture & CMS Integration',
      'SEO & Mobile Optimization',
    ],
    imageUrl: webDevImg,
    ctaText: 'Build Digital Platform',
    sortOrder: 2,
  },
  {
    id: 'perfume-vendor',
    title: 'Perfume Vendor',
    category: 'Artisanal Fragrance & Luxury Scents',
    tagline: 'Curated niche fragrances, bespoke decants, and long-lasting luxury extraits.',
    description:
      'Immerse your senses in carefully curated signature fragrances, rich oriental ouds, amber florals, and bespoke olfactory compositions crafted for sophistication and longevity.',
    deliverables: [
      'Niche & Designer Perfume Flacons',
      'Custom Fragrance Wardrobe Consultations',
      'Exclusive Oil Extracts & Decants',
      'Corporate & Wedding Fragrance Gifting',
    ],
    imageUrl: perfumeImg,
    ctaText: 'Explore Fragrance Collection',
    sortOrder: 3,
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    category: 'Cinematography & Post-Production',
    tagline: 'Broadcast-grade color grading, cinematic storytelling, and commercial reels.',
    description:
      'From 4K commercial reels to social storytelling and high-contrast color grading, we transform raw footage into rhythmically paced, unforgettable cinematic visual narratives.',
    deliverables: [
      'Commercial & Brand Campaign Editing',
      'DaVinci Resolve Color Grading & Audio Mix',
      'Social Motion Graphics & Reels',
      'Documentary & Event Post-Production',
    ],
    imageUrl: videoEditingImg,
    ctaText: 'Book Post-Production',
    sortOrder: 4,
  },
];

export const INITIAL_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'proj-aurélia',
    title: 'Aurélia Paris — Luxury Brand Identity',
    category: 'Graphic Design',
    client: 'Aurélia Haute Parfumerie',
    year: '2025',
    summary: 'Complete luxury brand identity, foil-stamped stationery, and packaging design for an artisanal perfume house.',
    outcome: 'Elevated client brand valuation with retail placement across premier boutiques.',
    imageUrl: portfolioBrandingImg,
    tags: ['Brand Identity', 'Packaging', 'Art Direction', 'Typography'],
    projectUrl: '#',
    featured: true,
  },
  {
    id: 'proj-aura-digital',
    title: 'Aura Digital — Creative Agency Platform',
    category: 'Website Development',
    client: 'Aura Studio',
    year: '2025',
    summary: 'High-performance bespoke portfolio web platform with dynamic theme tokens and smooth micro-interactions.',
    outcome: 'Achieved 99/100 Lighthouse performance and 3.4x inbound lead consultation bookings.',
    imageUrl: portfolioWebImg,
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    projectUrl: '#',
    featured: true,
  },
  {
    id: 'proj-sahara-cinematic',
    title: 'Golden Horizon — Fashion Film & Color Grade',
    category: 'Video Editing',
    client: 'Vogue Africa x Maison Sol',
    year: '2026',
    summary: 'Cinematic commercial edit and fine-grain 35mm color grading for a high-fashion sunset campaign.',
    outcome: 'Surpassed 1.2M organic views across social channels and featured in editorial showreels.',
    imageUrl: portfolioFilmImg,
    tags: ['Color Grading', 'DaVinci Resolve', '4K Editorial', 'Sound Design'],
    projectUrl: '#',
    featured: true,
  },
];

export const INITIAL_PERFUMES: PerfumeProduct[] = [
  {
    id: 'perfume-ambre-dore',
    name: 'Ambre Doré',
    subtitle: 'Extrait de Parfum',
    volume: '50ml / 1.7 FL.OZ.',
    priceNaira: 65000,
    description: 'A rich, radiant amber fragrance warmed with smoked vanilla, golden saffron, and velvet Turkish rose petals.',
    notes: {
      top: 'Saffron, Italian Bergamot, Pink Peppercorn',
      heart: 'Velvet Turkish Rose, Frankincense, Caramelized Amber',
      base: 'Madagascan Vanilla, Cambodian Oud, Sandalwood',
    },
    imageUrl: perfumeImg,
    inStock: true,
    featured: true,
  },
  {
    id: 'perfume-noir-santal',
    name: 'Noir Santal',
    subtitle: 'Eau de Parfum Intense',
    volume: '100ml / 3.4 FL.OZ.',
    priceNaira: 85000,
    description: 'Dark, magnetic sandalwood intertwined with spicy cardamom, cardamom smoke, and deep cedarwood.',
    notes: {
      top: 'Green Cardamom, Violet Leaf, Papyrus',
      heart: 'Mysore Sandalwood, Iris Concrete, Cedar Bark',
      base: 'Smoked Leather, Ambergris, Cashmeran',
    },
    imageUrl: perfumeImg,
    inStock: true,
    featured: true,
  },
  {
    id: 'perfume-velvet-rose',
    name: 'Velvet Rose & Berry',
    subtitle: 'Elixir Privé',
    volume: '50ml / 1.7 FL.OZ.',
    priceNaira: 70000,
    description: 'Luminous Damascus rose paired with dark juicy blackberry, candied raspberry, and white musk.',
    notes: {
      top: 'Blackberry, Wild Raspberry, Lychee',
      heart: 'Damascus Rose, Peony, Spiced Cinnamon',
      base: 'White Musk, Patchouli, Amber Crystal',
    },
    imageUrl: perfumeImg,
    inStock: true,
    featured: true,
  },
];

export const INITIAL_FOUNDER: FounderProfile = {
  name: 'Elobisi Mmesoma',
  title: 'Creative Director & Founder',
  brandRole: 'AMBITIOUS VENDOR',
  bio: 'Elobisi Mmesoma is a multidisciplinary creative technologist, luxury brand designer, and fragrance curator based in Nigeria. Operating under the visionary banner of AMBITIOUS VENDOR, Elobisi blends aesthetic rigor, bespoke code engineering, and sensory fragrance curation to build unforgettable experiences.',
  statement: 'True luxury lies at the intersection of intentional aesthetics, robust engineering, and sensory excellence.',
  portraitUrl: heroFounderImg,
  email: '001ambitious@gmail.com',
  phone: '+234 814 000 0000',
  whatsapp: '+2348140000000',
  instagram: 'https://instagram.com/ambitiousvendor',
  linkedin: '',
  experienceYears: 7,
};

export const INITIAL_HERO_SETTINGS: HeroSettings = {
  headline: 'AMBITIOUS VENDOR',
  introKicker: 'Multidisciplinary Creative Agency & Luxury Fragrances',
  description:
    'Bespoke Graphic Design, Modern Website Development, Curated Luxury Perfumes, and High-Impact Video Editing crafted with uncompromising excellence.',
  primaryCtaText: 'View Selected Works',
  primaryCtaLink: '#portfolio',
  secondaryCtaText: "Let's Work Together",
  secondaryCtaLink: '#contact',
  activeGlowEffect: 'cycle',
  cycleSpeedSeconds: 4.5,
  backgroundImageUrl: '',
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'AMBITIOUS VENDOR',
  tagline: 'Creative Agency & Luxury Fragrances',
  footerDescription: 'Creative Agency & Luxury Fragrances. Founded and directed by Elobisi Mmesoma. Delivering bespoke art direction, web engineering, sensory perfumery, and cinematic editing.',
  perfumeSectionKicker: '03. Artisanal Fragrances',
  perfumeSectionTitle: 'Haute Parfumerie & Curated Scents',
  perfumeSectionDescription: 'Niche artisanal perfumes, rare amber extracts, and signature fragrances curated for extraordinary longevity and presence.',
  metaDescription:
    'Premium personal brand and creative technology agency offering Graphic Design, Website Development, Luxury Perfumes, and Video Editing by Elobisi Mmesoma.',
  email: 'josepchiemezie42@gmail.com',
  phone: '+234 814 000 0000',
  whatsapp: '+2348140000000',
  address: 'Lagos & Port Harcourt, Nigeria · Worldwide Remote',
  marqueeSpeedSeconds: 28,
  pauseMarqueeOnHover: true,
  socialLinks: [
    { id: 'instagram', label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/ambitiousvendor', enabled: true },
    
    { id: 'email', label: 'Email', icon: 'mail', url: 'mailto:001ambitious@gmail.com', enabled: true },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/2348140000000', enabled: true },
  ],
};
