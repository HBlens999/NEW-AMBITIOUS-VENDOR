import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE_URL = 'ambitious_supabase_url';
const STORAGE_KEY_SUPABASE_ANON = 'ambitious_supabase_anon';

export function getStoredSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const storedUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
  const storedAnon = localStorage.getItem(STORAGE_KEY_SUPABASE_ANON) || '';

  const url = storedUrl || envUrl;
  const anonKey = storedAnon || envAnon;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);

  if (anonKey) localStorage.setItem(STORAGE_KEY_SUPABASE_ANON, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEY_SUPABASE_ANON);

  // Reset client instance
  clientInstance = null;
}

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  try {
    clientInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return clientInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const testUrl = url || getStoredSupabaseConfig().url;
    const testAnon = anonKey || getStoredSupabaseConfig().anonKey;

    if (!testUrl || !testAnon) {
      return { success: false, message: 'Supabase URL and Anon Key are required.' };
    }

    const testClient = createClient(testUrl, testAnon);
    // Ping basic auth or public query
    const { error } = await testClient.from('site_settings').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, we still know the credentials authenticated if status code is not 401
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase project! (Tables not yet created, run migration script below).',
        };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected and verified Supabase connection!' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown connection error';
    return { success: false, message };
  }
}

/**
 * Uploads an image file to Supabase Storage.
 * Creates an object URL fallback if Supabase bucket is not yet provisioned.
 */
export async function uploadImageToStorage(
  bucket: 'site-assets' | 'service-images' | 'founder-images' | 'portfolio-images' | 'product-images',
  file: File,
  folder = 'uploads'
): Promise<{ url: string; error?: string }> {
  const supabase = getSupabase();

  if (!supabase) {
    // Return object URL / local data URL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.warn(`Supabase storage upload failed for bucket ${bucket}:`, error.message);
      // Fallback to local data URL so admin work is never blocked
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string, error: error.message });
        };
        reader.readAsDataURL(file);
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicUrlData.publicUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string, error: message });
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Standard complete Supabase schema and RLS policies SQL script
 */
export const SUPABASE_MIGRATION_SQL = `-- AMBITIOUS VENDOR SCHEMA MIGRATION SCRIPT
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_title TEXT NOT NULL DEFAULT 'AMBITIOUS VENDOR',
  tagline TEXT NOT NULL DEFAULT 'Creative Agency & Luxury Fragrances',
  meta_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  social_preview_url TEXT,
  email TEXT DEFAULT 'ambitiousvendor@gmail.com',
  phone TEXT DEFAULT '+234 814 000 0000',
  whatsapp TEXT DEFAULT '+2348140000000',
  address TEXT DEFAULT 'Lagos, Nigeria',
  marquee_speed_seconds INTEGER DEFAULT 32,
  theme_preset_id TEXT DEFAULT 'blush-luxury',
  theme_colors JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create services table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  deliverables JSONB DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Request Proposal',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  client TEXT NOT NULL,
  year TEXT NOT NULL,
  summary TEXT NOT NULL,
  outcome TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  project_url TEXT,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create perfume_products table
CREATE TABLE IF NOT EXISTS perfume_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  volume TEXT NOT NULL,
  price_naira NUMERIC NOT NULL,
  description TEXT NOT NULL,
  notes JSONB NOT NULL,
  image_url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create founder_profile table
CREATE TABLE IF NOT EXISTS founder_profile (
  id TEXT PRIMARY KEY DEFAULT 'founder',
  name TEXT NOT NULL DEFAULT 'Joseph Chiemezie',
  title TEXT NOT NULL DEFAULT 'Creative Director & Founder',
  brand_role TEXT NOT NULL DEFAULT 'AMBITIOUS VENDOR',
  bio TEXT NOT NULL,
  statement TEXT NOT NULL,
  portrait_url TEXT NOT NULL,
  email TEXT DEFAULT 'josepchiemezie42@gmail.com',
  phone TEXT DEFAULT '+234 814 000 0000',
  whatsapp TEXT DEFAULT '+2348140000000',
  instagram TEXT DEFAULT 'https://instagram.com/ambitiousvendor',
  linkedin TEXT,
  experience_years INTEGER DEFAULT 7,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create inquiries table (Contact submissions)
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_category TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget_range TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Enable Row-Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 8. Public Read Policies
CREATE POLICY IF NOT EXISTS "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view services" ON services FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view portfolio" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view perfumes" ON perfume_products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view founder profile" ON founder_profile FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- 9. Storage Buckets (Execute in Supabase Storage configuration or SQL):
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('site-assets', 'site-assets', true),
  ('service-images', 'service-images', true),
  ('founder-images', 'founder-images', true),
  ('portfolio-images', 'portfolio-images', true),
  ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('site-assets', 'service-images', 'founder-images', 'portfolio-images', 'product-images'));
`;
