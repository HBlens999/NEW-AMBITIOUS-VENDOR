export interface ThemeColors {
  bgMain: string;
  surfaceCard: string;
  surfaceSoft: string;
  surfaceHover: string;
  textPrimary: string;
  textSecondary: string;
  colorPrimary: string;
  colorSecondary: string;
  colorBorder: string;
  colorHighlight: string;
  heroBg?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  isDark?: boolean;
  colors: ThemeColors;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'blush-luxury',
    name: 'Blush Luxury',
    description: 'Ivory, pale blush, dusty rose, and deep rich berry. The signature Ambitious Vendor look.',
    colors: {
      bgMain: '#FFFAFA',
      surfaceCard: '#FFFFFF',
      surfaceSoft: '#FFF0F2',
      surfaceHover: '#F7E8E8',
      textPrimary: '#24171B',
      textSecondary: '#725B61',
      colorPrimary: '#71384B',
      colorSecondary: '#B66F7D',
      colorBorder: '#EAD3D5',
      colorHighlight: '#DCA7AE',
      heroBg: '#0F0B0E',
    },
  },
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    description: 'Near-black obsidian, warm ivory, champagne gold, and muted bronze.',
    isDark: true,
    colors: {
      bgMain: '#0E0D10',
      surfaceCard: '#18171C',
      surfaceSoft: '#232128',
      surfaceHover: '#2E2B34',
      textPrimary: '#FBF9F5',
      textSecondary: '#B8B2A7',
      colorPrimary: '#D4AF37',
      colorSecondary: '#AA8232',
      colorBorder: '#36323D',
      colorHighlight: '#E6C762',
      heroBg: '#09080A',
    },
  },
  {
    id: 'ocean-sapphire',
    name: 'Ocean Sapphire',
    description: 'Deep royal navy, clean white, sapphire blue, and luminous ice cyan.',
    isDark: true,
    colors: {
      bgMain: '#0B132B',
      surfaceCard: '#121F42',
      surfaceSoft: '#1A2C5B',
      surfaceHover: '#243B75',
      textPrimary: '#F0F7FF',
      textSecondary: '#94A3B8',
      colorPrimary: '#38BDF8',
      colorSecondary: '#2563EB',
      colorBorder: '#233766',
      colorHighlight: '#7DD3FC',
      heroBg: '#060B1A',
    },
  },
  {
    id: 'emerald-prestige',
    name: 'Emerald Prestige',
    description: 'Crisp ivory, deep forest green, vivid emerald, and muted gold accents.',
    colors: {
      bgMain: '#FAFDFB',
      surfaceCard: '#FFFFFF',
      surfaceSoft: '#EDF8F2',
      surfaceHover: '#E2F3E9',
      textPrimary: '#0A261E',
      textSecondary: '#3E6155',
      colorPrimary: '#0E624A',
      colorSecondary: '#10B981',
      colorBorder: '#CCE4D8',
      colorHighlight: '#6EE7B7',
      heroBg: '#061712',
    },
  },
  {
    id: 'royal-violet',
    name: 'Royal Violet',
    description: 'Soft white canvas, deep royal violet, lavender mist, and imperial plum.',
    colors: {
      bgMain: '#FAF9FE',
      surfaceCard: '#FFFFFF',
      surfaceSoft: '#F3EEFF',
      surfaceHover: '#EAE1FC',
      textPrimary: '#1E1435',
      textSecondary: '#5E5279',
      colorPrimary: '#5B21B6',
      colorSecondary: '#8B5CF6',
      colorBorder: '#E1D5F8',
      colorHighlight: '#A78BFA',
      heroBg: '#120A24',
    },
  },
  {
    id: 'coral-sunset',
    name: 'Coral Sunset',
    description: 'Warm cream, vibrant coral, terracotta, and deep velvety burgundy.',
    colors: {
      bgMain: '#FFFBF9',
      surfaceCard: '#FFFFFF',
      surfaceSoft: '#FFF1EE',
      surfaceHover: '#FFE5E0',
      textPrimary: '#291217',
      textSecondary: '#7A4D55',
      colorPrimary: '#9F1239',
      colorSecondary: '#F43F5E',
      colorBorder: '#F9D1D8',
      colorHighlight: '#FB7185',
      heroBg: '#14060A',
    },
  },
];
