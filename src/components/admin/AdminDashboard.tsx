import React, { useEffect, useState } from 'react';
import {
  X,
  Palette,
  Sparkles,
  Layers,
  Briefcase,
  Droplets,
  User,
  Sliders,
  Mail,
  Database,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Copy,
  LayoutDashboard,
  Eye,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ImageUploader } from '../ui/ImageUploader';
import { getSupabase, SUPABASE_MIGRATION_SQL } from '../../lib/supabase';
import { PortfolioProject, PerfumeProduct, ServiceItem, HeroSettings, InquirySubmission } from '../../types/data';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab =
  | 'overview'
  | 'themes'
  | 'hero'
  | 'services'
  | 'portfolio'
  | 'perfumes'
  | 'founder'
  | 'site'
  | 'inquiries'
  | 'supabase';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { activePresetId, colors, setPreset, updateCustomColor, resetToPreset, presets, saveThemeSettings } = useTheme();
  const {
    services,
    portfolio,
    perfumes,
    founder,
    heroSettings,
    siteSettings,
    inquiries,
    supabaseConfig,
    saveServices,
    savePortfolio,
    savePerfumes,
    saveFounder,
    saveHeroSettings,
    saveSiteSettings,
    updateInquiryStatus,
    deleteInquiry,
    updateSupabaseCredentials,
  } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Form states
  const [heroForm, setHeroForm] = useState({ ...heroSettings });
  const [siteForm, setSiteForm] = useState({ ...siteSettings });
  const [founderForm, setFounderForm] = useState({ ...founder });
  const [servicesForm, setServicesForm] = useState<ServiceItem[]>([...services]);
  const [portfolioForm, setPortfolioForm] = useState<PortfolioProject[]>([...portfolio]);
  const [perfumesForm, setPerfumesForm] = useState<PerfumeProduct[]>([...perfumes]);

  // Supabase credentials form
  const [supaUrl, setSupaUrl] = useState(supabaseConfig.url || '');
  const [supaKey, setSupaKey] = useState(supabaseConfig.anonKey || '');
  const [supaTestLoading, setSupaTestLoading] = useState(false);
  const [supaTestResult, setSupaTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  // Admin access is granted only after Supabase Auth verifies an account.
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setHeroForm({ ...heroSettings });
    setSiteForm({ ...siteSettings, socialLinks: [...(siteSettings.socialLinks || [])] });
    setFounderForm({ ...founder });
    setServicesForm([...services]);
    setPortfolioForm([...portfolio]);
    setPerfumesForm([...perfumes]);
  }, [isOpen, heroSettings, siteSettings, founder, services, portfolio, perfumes]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const supabase = getSupabase();
    setAdminAuthenticated(false);
    setAdminAuthError('');
    if (!supabase) return;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!cancelled && !error && data.session?.user) setAdminAuthenticated(true);
    });
    return () => { cancelled = true; };
  }, [isOpen]);

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminAuthError('');
    const supabase = getSupabase();
    if (!supabase) {
      setAdminAuthError('Supabase is not configured in this browser. Configure the Supabase project first, then sign in.');
      return;
    }
    setAdminAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword,
      });
      if (error || !data.user) {
        setAdminAuthError(error?.message || 'Sign-in failed. Check your email and password.');
        return;
      }
      setAdminAuthenticated(true);
      setAdminPassword('');
    } catch {
      setAdminAuthError('Unable to sign in. Check your connection and Supabase Auth settings.');
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setAdminAuthenticated(false);
    setAdminEmail('');
    setAdminPassword('');
    setAdminAuthError('');
  };


  // New portfolio/perfume modal states
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [editingPerfume, setEditingPerfume] = useState<PerfumeProduct | null>(null);


  if (!isOpen) return null;

  if (!adminAuthenticated) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <form onSubmit={handleAdminLogin} className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-2xl text-[var(--text-primary)]">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-11 h-11 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">AV</span>
            <div>
              <h2 className="text-lg font-bold font-serif">Director Portal</h2>
              <p className="text-xs text-[var(--text-secondary)]">AMBITIOUS VENDOR · Secure sign in</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Sign in with an authorized Supabase account to access website administration.</p>
          <label className="block text-xs font-semibold mb-2" htmlFor="admin-auth-email">Admin email</label>
          <input id="admin-auth-email" type="email" autoComplete="username" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="you@example.com" />
          <label className="block text-xs font-semibold mb-2" htmlFor="admin-auth-password">Password</label>
          <input id="admin-auth-password" type="password" autoComplete="current-password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="Enter your password" />
          {adminAuthError && <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">{adminAuthError}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold hover:bg-[var(--surface-soft)]">Cancel</button>
            <button type="submit" disabled={adminAuthLoading} className="flex-1 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{adminAuthLoading ? 'Signing in…' : 'Sign in securely'}</button>
          </div>
          <p className="mt-5 text-[11px] leading-relaxed text-[var(--text-secondary)]">This uses Supabase Authentication. A password stored in a regular database table will not work unless a matching Supabase Auth user exists in the connected project.</p>
        </form>
      </div>
    );
  }


  const notify = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(null), 3500);
  };

  const handleSaveHero = async () => {
    await saveHeroSettings(heroForm);
    notify('Hero settings saved and applied!');
  };

  const handleSaveSite = async () => {
    try { await saveSiteSettings(siteForm); notify('Site branding, social links and configuration saved!'); }
    catch (error) { notify(`Site settings save failed: ${error instanceof Error ? error.message : 'Unknown error'}`); }
  };

  const handleSaveFounder = async () => {
    await saveFounder(founderForm);
    notify('Founder/CEO profile updated!');
  };

  const handleSaveServices = async (updated: ServiceItem[]) => {
    try {
      await saveServices(updated);
      setServicesForm(updated);
      notify('Services saved to Supabase and published across devices.');
    } catch (error) {
      notify(`Service save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSaveTheme = async () => {
    try {
      await saveThemeSettings();
      notify('Theme and preset saved to Supabase for all devices.');
    } catch (error) {
      notify(`Theme save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSavePortfolio = async (updated: PortfolioProject[]) => {
    setPortfolioForm(updated);
    try { await savePortfolio(updated); notify('Portfolio projects saved and removed items deleted from the live list.'); }
    catch (error) { notify(`Portfolio save failed: ${error instanceof Error ? error.message : 'Unknown error'}`); }
  };

  const handleSavePerfumes = async (updated: PerfumeProduct[]) => {
    setPerfumesForm(updated);
    await savePerfumes(updated);
    notify('Perfume products catalog saved!');
  };

  const handleTestSupabase = async () => {
    setSupaTestLoading(true);
    setSupaTestResult(null);
    try {
      const res = await updateSupabaseCredentials(supaUrl, supaKey);
      setSupaTestResult(res);
      if (res.success) {
        notify('Connected to Supabase project!');
      }
    } finally {
      setSupaTestLoading(false);
    }
  };

  const copySqlScript = () => {
    navigator.clipboard.writeText(SUPABASE_MIGRATION_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden text-[var(--text-primary)]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--surface-soft)]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs tracking-wider">
              AV
            </span>
            <div>
              <h2 className="text-base font-bold font-serif text-[var(--text-primary)]">
                AMBITIOUS VENDOR — Control Center CMS
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                <span>Director Portal</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      supabaseConfig.connected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {supabaseConfig.connected ? 'Supabase Connected' : 'Local Storage Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleAdminLogout} className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs font-semibold hover:bg-[var(--surface-card)]" title="Sign out of the admin portal">Sign out</button>

            {saveNotification && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-1.5 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{saveNotification}</span>
              </span>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <aside className="w-56 sm:w-64 border-r border-[var(--color-border)] bg-[var(--surface-card)] overflow-y-auto p-3 flex flex-col gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('themes')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'themes'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Themes & Presets</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'hero'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Hero & Glow Effects</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Services & Marquee</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Portfolio Works ({portfolio.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('perfumes')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'perfumes'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Droplets className="w-4 h-4 shrink-0" />
              <span>Perfume Catalog ({perfumes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('founder')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'founder'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Founder / CEO Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('site')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'site'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Site Branding & Favicon</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Inquiries Inbox ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('supabase')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'supabase'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>Supabase & DB Sync</span>
            </button>
          </aside>

          {/* Tab Content Panel */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[var(--bg-main)]">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Executive Control Dashboard
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Real-time metrics, active content inventory, and direct website management.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm">
                    <span className="text-xs font-mono uppercase text-[var(--color-secondary)]">
                      Inbound Inquiries
                    </span>
                    <div className="mt-2 text-3xl font-bold font-serif text-[var(--text-primary)]">
                      {inquiries.length}
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                      {inquiries.filter(i => i.status === 'new').length} unread new requests
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm">
                    <span className="text-xs font-mono uppercase text-[var(--color-secondary)]">
                      Core Services
                    </span>
                    <div className="mt-2 text-3xl font-bold font-serif text-[var(--text-primary)]">
                      {services.length}
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                      Syncing with continuous marquee
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm">
                    <span className="text-xs font-mono uppercase text-[var(--color-secondary)]">
                      Portfolio Cases
                    </span>
                    <div className="mt-2 text-3xl font-bold font-serif text-[var(--text-primary)]">
                      {portfolio.length}
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                      Curated works showcase
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm">
                    <span className="text-xs font-mono uppercase text-[var(--color-secondary)]">
                      Perfume Catalog
                    </span>
                    <div className="mt-2 text-3xl font-bold font-serif text-[var(--text-primary)]">
                      {perfumes.length}
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
                      Active fragrance products
                    </span>
                  </div>
                </div>

                {/* Quick actions strip */}
                <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Quick Operational Shortcuts
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('themes')}
                      className="px-4 py-2 text-xs font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--surface-soft)] transition-colors"
                    >
                      Change Color Theme Preset
                    </button>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="px-4 py-2 text-xs font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--surface-soft)] transition-colors"
                    >
                      Update Service Images
                    </button>
                    <button
                      onClick={() => setActiveTab('founder')}
                      className="px-4 py-2 text-xs font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--surface-soft)] transition-colors"
                    >
                      Upload CEO Portrait
                    </button>
                    <button
                      onClick={() => setActiveTab('supabase')}
                      className="px-4 py-2 text-xs font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--surface-soft)] transition-colors"
                    >
                      Configure Supabase Database
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. THEMES & COLOR PRESETS */}
            {activeTab === 'themes' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Theme Presets & Design Tokens
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Select from 6 professional presets or customize exact hex colors. Changes apply instantly across the whole website.
                  </p>
                </div>

                {/* 6 Required Theme Presets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {presets.map(preset => {
                    const isActive = preset.id === activePresetId;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          setPreset(preset.id);
                          notify(`Switched to "${preset.name}" preset!`);
                        }}
                        className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                          isActive
                            ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-md bg-[var(--surface-card)]'
                            : 'border-[var(--color-border)] hover:border-[var(--color-secondary)] bg-[var(--surface-card)]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-serif font-bold text-base text-[var(--text-primary)]">
                            {preset.name}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--color-primary)] text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                          {preset.description}
                        </p>

                        {/* Swatches strip */}
                        <div className="flex items-center gap-1.5 h-6 rounded-lg overflow-hidden border border-black/10">
                          <div
                            className="flex-1 h-full"
                            style={{ backgroundColor: preset.colors.bgMain }}
                            title="Background"
                          />
                          <div
                            className="flex-1 h-full"
                            style={{ backgroundColor: preset.colors.surfaceCard }}
                            title="Surface"
                          />
                          <div
                            className="flex-1 h-full"
                            style={{ backgroundColor: preset.colors.colorSecondary }}
                            title="Secondary Accent"
                          />
                          <div
                            className="flex-1 h-full"
                            style={{ backgroundColor: preset.colors.colorPrimary }}
                            title="Primary Accent"
                          />
                          <div
                            className="flex-1 h-full"
                            style={{ backgroundColor: preset.colors.textPrimary }}
                            title="Text"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Color Overrides Editor */}
                <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold font-serif text-[var(--text-primary)]">
                        Fine-Grained Color Override System
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Customize individual palette tokens. Values are saved to CSS variables.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        resetToPreset(activePresetId);
                        notify('Reset palette to preset defaults!');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--surface-soft)]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Preset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                        Primary Accent
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colors.colorPrimary}
                          onChange={e => updateCustomColor('colorPrimary', e.target.value)}
                          className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer"
                        />
                        <span className="text-xs font-mono">{colors.colorPrimary}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                        Secondary Accent
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colors.colorSecondary}
                          onChange={e => updateCustomColor('colorSecondary', e.target.value)}
                          className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer"
                        />
                        <span className="text-xs font-mono">{colors.colorSecondary}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                        Page Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colors.bgMain}
                          onChange={e => updateCustomColor('bgMain', e.target.value)}
                          className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer"
                        />
                        <span className="text-xs font-mono">{colors.bgMain}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                        Card Surface
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colors.surfaceCard}
                          onChange={e => updateCustomColor('surfaceCard', e.target.value)}
                          className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer"
                        />
                        <span className="text-xs font-mono">{colors.surfaceCard}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                        Primary Text
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colors.textPrimary}
                          onChange={e => updateCustomColor('textPrimary', e.target.value)}
                          className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer"
                        />
                        <span className="text-xs font-mono">{colors.textPrimary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[var(--color-border)] pt-5">
                    <p className="text-xs text-[var(--text-secondary)]">Preview changes apply immediately in this browser. Save to publish the preset and custom colors to every device.</p>
                    <button onClick={handleSaveTheme} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm">
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Theme & Preset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. HERO & GLOW EFFECTS */}
            {activeTab === 'hero' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Hero Section & Glowing Headline Controls
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Manage headline copy, background imagery, and the 5 animated glowing text states.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] space-y-5">
                  <div>
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                      Main Brand Headline *
                    </label>
                    <input
                      type="text"
                      value={heroForm.headline}
                      onChange={e => setHeroForm({ ...heroForm, headline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                      Intro Kicker Tagline
                    </label>
                    <input
                      type="text"
                      value={heroForm.introKicker}
                      onChange={e => setHeroForm({ ...heroForm, introKicker: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                      Hero Description Copy
                    </label>
                    <textarea
                      rows={3}
                      value={heroForm.description}
                      onChange={e => setHeroForm({ ...heroForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                    />
                  </div>

                  {/* Glow state mode selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Active Headline Glow Effect
                      </label>
                      <select
                        value={heroForm.activeGlowEffect}
                        onChange={e =>
                          setHeroForm({
                            ...heroForm,
                            activeGlowEffect: e.target.value as HeroSettings['activeGlowEffect'],
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      >
                        <option value="cycle">Auto-Cycle All 5 Effects (Recommended)</option>
                        <option value="fire">Lock State 1: Burning Fire</option>
                        <option value="ice">Lock State 2: Ice & Frost</option>
                        <option value="thunder">Lock State 3: Thunder & Lightning</option>
                        <option value="neon">Lock State 4: Electric Neon</option>
                        <option value="rose">Lock State 5: Rose-Pink Energy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Cycle Speed (Seconds)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="15"
                        step="0.5"
                        value={heroForm.cycleSpeedSeconds}
                        onChange={e =>
                          setHeroForm({ ...heroForm, cycleSpeedSeconds: parseFloat(e.target.value) || 4.5 })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      />
                    </div>
                  </div>

                  {/* Hero Background Image Upload */}
                  <div className="pt-2">
                    <ImageUploader
                      label="Optional Hero Atmospheric Background Image"
                      bucket="site-assets"
                      currentUrl={heroForm.backgroundImageUrl}
                      onImageUploaded={url => setHeroForm({ ...heroForm, backgroundImageUrl: url })}
                      aspectRatio="16/9"
                    />
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Primary CTA Text
                      </label>
                      <input
                        type="text"
                        value={heroForm.primaryCtaText}
                        onChange={e => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Secondary CTA Text
                      </label>
                      <input
                        type="text"
                        value={heroForm.secondaryCtaText}
                        onChange={e => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveHero}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Hero Configuration</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SERVICES & MARQUEE */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                      Services & Service Marquee Management
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Updating service photography or titles here automatically updates both the main Services section AND the Right-to-Left moving Marquee.
                    </p>
                  </div>
                  <button onClick={() => { void handleSaveServices(servicesForm); }} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)]">
                    <Save className="w-3.5 h-3.5" /> Save Services
                  </button>
                </div>

                {/* Marquee Speed Settings */}
                <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono uppercase text-[var(--text-secondary)]">
                      Marquee RTL Speed:
                    </span>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      value={siteForm.marqueeSpeedSeconds}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setSiteForm({ ...siteForm, marqueeSpeedSeconds: val });
                      }}
                      className="w-32 cursor-pointer"
                    />
                    <span className="text-xs font-mono">{siteForm.marqueeSpeedSeconds}s / cycle</span>
                    <button onClick={async () => { try { await saveSiteSettings(siteForm); notify('Marquee speed saved to Supabase for all devices.'); } catch (error) { notify(`Marquee save failed: ${error instanceof Error ? error.message : 'Unknown error'}`); } }} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)]"><Save className="w-3.5 h-3.5" /> Save Marquee</button>
                  </div>
                </div>

                {/* Services List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {servicesForm.map((service, index) => (
                    <div
                      key={service.id}
                      className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--surface-soft)] text-[var(--color-secondary)]">
                          Discipline 0{index + 1}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-secondary)]">
                          ID: {service.id}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Service Title *
                          </label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={e => {
                              const updated = servicesForm.map(s =>
                                s.id === service.id ? { ...s, title: e.target.value } : s
                              );
                              setServicesForm(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-sm font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Sub-Category / Category Tag
                          </label>
                          <input
                            type="text"
                            value={service.category}
                            onChange={e => {
                              const updated = servicesForm.map(s =>
                                s.id === service.id ? { ...s, category: e.target.value } : s
                              );
                              setServicesForm(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                          />
                        </div>

                        {/* Service Image Uploader */}
                        <div>
                          <ImageUploader
                            label="Service Cover Photography"
                            bucket="service-images"
                            currentUrl={service.imageUrl}
                            onImageUploaded={url => {
                              const updated = servicesForm.map(s =>
                                s.id === service.id ? { ...s, imageUrl: url } : s
                              );
                              setServicesForm(updated);
                            }}
                            aspectRatio="4/3"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Detailed Description
                          </label>
                          <textarea
                            rows={3}
                            value={service.description}
                            onChange={e => {
                              const updated = servicesForm.map(s =>
                                s.id === service.id ? { ...s, description: e.target.value } : s
                              );
                              setServicesForm(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PORTFOLIO WORKS */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                      Curated Portfolio Projects ({portfolioForm.length})
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Manage case studies, client work, categories, and showcase imagery.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newProj: PortfolioProject = {
                        id: `proj-${Date.now()}`,
                        title: 'New Creative Case Study',
                        category: 'Graphic Design',
                        client: 'Client Name',
                        year: new Date().getFullYear().toString(),
                        summary: 'Brief description of the challenge and strategic solution.',
                        outcome: 'Measured client result and impact.',
                        imageUrl: services[0]?.imageUrl || '',
                        tags: ['Art Direction'],
                        featured: true,
                      };
                      setPortfolioForm([newProj, ...portfolioForm]);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project Case</span>
                  </button>
                  <button onClick={() => { void handleSavePortfolio(portfolioForm); }} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-full hover:bg-emerald-800 transition-colors"><Save className="w-3.5 h-3.5" /> Save Portfolio Changes</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioForm.map(project => (
                    <div
                      key={project.id}
                      className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm space-y-4"
                    >
                      <ImageUploader
                        label="Project Artwork / Screenshot"
                        bucket="portfolio-images"
                        currentUrl={project.imageUrl}
                        onImageUploaded={url => {
                          const updated = portfolioForm.map(p =>
                            p.id === project.id ? { ...p, imageUrl: url } : p
                          );
                          setPortfolioForm(updated);
                        }}
                        aspectRatio="16/9"
                      />

                      <div>
                        <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={e => {
                            const updated = portfolioForm.map(p =>
                              p.id === project.id ? { ...p, title: e.target.value } : p
                            );
                            setPortfolioForm(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-sm font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Discipline
                          </label>
                          <select
                            value={project.category}
                            onChange={e => {
                              const updated = portfolioForm.map(p =>
                                p.id === project.id
                                  ? { ...p, category: e.target.value as PortfolioProject['category'] }
                                  : p
                              );
                              setPortfolioForm(updated);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                          >
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Website Development">Website Development</option>
                            <option value="Video Editing">Video Editing</option>
                            <option value="Brand Identity">Brand Identity</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Client Name
                          </label>
                          <input
                            type="text"
                            value={project.client}
                            onChange={e => {
                              const updated = portfolioForm.map(p =>
                                p.id === project.id ? { ...p, client: e.target.value } : p
                              );
                              setPortfolioForm(updated);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                          Outcome / Key Metric
                        </label>
                        <input
                          type="text"
                          value={project.outcome}
                          onChange={e => {
                            const updated = portfolioForm.map(p =>
                              p.id === project.id ? { ...p, outcome: e.target.value } : p
                            );
                            setPortfolioForm(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-xs text-[var(--color-primary)] font-medium"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            const updated = portfolioForm.filter(p => p.id !== project.id);
                            setPortfolioForm(updated);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PERFUME PRODUCTS */}
            {activeTab === 'perfumes' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                      Perfume & Fragrance Catalog ({perfumesForm.length})
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Manage luxury flacons, pricing in Naira, olfactory notes, and WhatsApp order triggers.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPerfume: PerfumeProduct = {
                        id: `perfume-${Date.now()}`,
                        name: 'New Signature Scent',
                        subtitle: 'Extrait de Parfum',
                        volume: '50ml / 1.7 FL.OZ.',
                        priceNaira: 75000,
                        description: 'A bespoke olfactory formulation curated by Ambitious Vendor.',
                        notes: {
                          top: 'Bergamot, Cardamom',
                          heart: 'Amber, Velvet Rose',
                          base: 'Oud, Sandalwood',
                        },
                        imageUrl: perfumes[0]?.imageUrl || '',
                        inStock: true,
                        featured: true,
                      };
                      handleSavePerfumes([newPerfume, ...perfumesForm]);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-full hover:bg-[var(--color-secondary)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Fragrance Flacon</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {perfumesForm.map(perfume => (
                    <div
                      key={perfume.id}
                      className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm space-y-4"
                    >
                      <ImageUploader
                        label="Perfume Bottle Photo"
                        bucket="product-images"
                        currentUrl={perfume.imageUrl}
                        onImageUploaded={url => {
                          const updated = perfumesForm.map(p =>
                            p.id === perfume.id ? { ...p, imageUrl: url } : p
                          );
                          handleSavePerfumes(updated);
                        }}
                        aspectRatio="4/3"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Fragrance Name
                          </label>
                          <input
                            type="text"
                            value={perfume.name}
                            onChange={e => {
                              const updated = perfumesForm.map(p =>
                                p.id === perfume.id ? { ...p, name: e.target.value } : p
                              );
                              handleSavePerfumes(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-sm font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Price (₦ Naira)
                          </label>
                          <input
                            type="number"
                            value={perfume.priceNaira}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              const updated = perfumesForm.map(p =>
                                p.id === perfume.id ? { ...p, priceNaira: val } : p
                              );
                              handleSavePerfumes(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Concentration
                          </label>
                          <input
                            type="text"
                            value={perfume.subtitle}
                            onChange={e => {
                              const updated = perfumesForm.map(p =>
                                p.id === perfume.id ? { ...p, subtitle: e.target.value } : p
                              );
                              handleSavePerfumes(updated);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block mb-1">
                            Bottle Volume
                          </label>
                          <input
                            type="text"
                            value={perfume.volume}
                            onChange={e => {
                              const updated = perfumesForm.map(p =>
                                p.id === perfume.id ? { ...p, volume: e.target.value } : p
                              );
                              handleSavePerfumes(updated);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                          Fragrance Notes
                        </label>
                        <input
                          type="text"
                          placeholder="Top: Saffron, Bergamot..."
                          value={perfume.notes.top}
                          onChange={e => {
                            const updated = perfumesForm.map(p =>
                              p.id === perfume.id
                                ? { ...p, notes: { ...p.notes, top: e.target.value } }
                                : p
                            );
                            handleSavePerfumes(updated);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-[var(--color-border)] bg-[var(--bg-main)] text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Heart: Rose, Amber..."
                          value={perfume.notes.heart}
                          onChange={e => {
                            const updated = perfumesForm.map(p =>
                              p.id === perfume.id
                                ? { ...p, notes: { ...p.notes, heart: e.target.value } }
                                : p
                            );
                            handleSavePerfumes(updated);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-[var(--color-border)] bg-[var(--bg-main)] text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Base: Vanilla, Oud..."
                          value={perfume.notes.base}
                          onChange={e => {
                            const updated = perfumesForm.map(p =>
                              p.id === perfume.id
                                ? { ...p, notes: { ...p.notes, base: e.target.value } }
                                : p
                            );
                            handleSavePerfumes(updated);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-[var(--color-border)] bg-[var(--bg-main)] text-[11px]"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={perfume.inStock}
                            onChange={e => {
                              const updated = perfumesForm.map(p =>
                                p.id === perfume.id ? { ...p, inStock: e.target.checked } : p
                              );
                              handleSavePerfumes(updated);
                            }}
                          />
                          <span>Available in Stock</span>
                        </label>

                        <button
                          onClick={() => {
                            const updated = perfumesForm.filter(p => p.id !== perfume.id);
                            handleSavePerfumes(updated);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Perfume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. FOUNDER / CEO PROFILE */}
            {activeTab === 'founder' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Founder & CEO Personal Brand
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Upload your high-resolution portrait, update bio, statement, and social connection channels.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] space-y-5">
                  {/* Portrait Upload */}
                  <ImageUploader
                    label="Founder Photograph / Portrait (High Quality)"
                    bucket="founder-images"
                    currentUrl={founderForm.portraitUrl}
                    onImageUploaded={url => setFounderForm({ ...founderForm, portraitUrl: url })}
                    aspectRatio="4/3"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Founder Full Name *
                      </label>
                      <input
                        type="text"
                        value={founderForm.name}
                        onChange={e => setFounderForm({ ...founderForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={founderForm.title}
                        onChange={e => setFounderForm({ ...founderForm, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                      Signature Statement / Quote
                    </label>
                    <input
                      type="text"
                      value={founderForm.statement}
                      onChange={e => setFounderForm({ ...founderForm, statement: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                      Biography & Background
                    </label>
                    <textarea
                      rows={4}
                      value={founderForm.bio}
                      onChange={e => setFounderForm({ ...founderForm, bio: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={founderForm.email}
                        onChange={e => setFounderForm({ ...founderForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={founderForm.whatsapp}
                        onChange={e => setFounderForm({ ...founderForm, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        value={founderForm.instagram}
                        onChange={e => setFounderForm({ ...founderForm, instagram: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveFounder}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Founder Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 8. SITE BRANDING & FAVICON */}
            {activeTab === 'site' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Site Branding, Favicon & Metadata
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Upload website favicon (updates the browser tab instantly), site logo, and business contact information.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Favicon Upload */}
                    <ImageUploader
                      label="Browser Tab Favicon (SVG/PNG/ICO)"
                      bucket="site-assets"
                      currentUrl={siteForm.faviconUrl}
                      onImageUploaded={url => setSiteForm({ ...siteForm, faviconUrl: url })}
                      aspectRatio="1/1"
                    />

                    {/* Logo Upload */}
                    <ImageUploader
                      label="Main Website Logo"
                      bucket="site-assets"
                      currentUrl={siteForm.logoUrl}
                      onImageUploaded={url => setSiteForm({ ...siteForm, logoUrl: url })}
                      aspectRatio="16/9"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Brand Name / Title *
                      </label>
                      <input
                        type="text"
                        value={siteForm.siteTitle}
                        onChange={e => setSiteForm({ ...siteForm, siteTitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={siteForm.tagline}
                        onChange={e => setSiteForm({ ...siteForm, tagline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                      Meta Description (SEO & OpenGraph)
                    </label>
                    <textarea
                      rows={2}
                      value={siteForm.metaDescription}
                      onChange={e => setSiteForm({ ...siteForm, metaDescription: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        General Email
                      </label>
                      <input
                        type="email"
                        value={siteForm.email}
                        onChange={e => setSiteForm({ ...siteForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={siteForm.phone}
                        onChange={e => setSiteForm({ ...siteForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1.5">
                        Office Location
                      </label>
                      <input
                        type="text"
                        value={siteForm.address}
                        onChange={e => setSiteForm({ ...siteForm, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-[var(--color-border)] space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div><h4 className="text-sm font-bold text-[var(--text-primary)]">Footer Social Media Links</h4><p className="text-xs text-[var(--text-secondary)] mt-1">Add/remove icons, choose an icon, and set its destination URL. These links appear in the public footer.</p></div>
                      <button type="button" onClick={() => setSiteForm(current => ({ ...current, socialLinks: [...(current.socialLinks || []), { id: `social-${Date.now()}`, label: 'New Link', icon: 'globe', url: '', enabled: true }] }))} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full bg-[var(--color-primary)] text-white"><Plus className="w-3.5 h-3.5" /> Add Link</button>
                    </div>
                    {(siteForm.socialLinks || []).length === 0 && <p className="text-xs text-[var(--text-secondary)]">No footer social links added yet.</p>}
                    {(siteForm.socialLinks || []).map((link, index) => (
                      <div key={link.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)]">
                        <div className="sm:col-span-3"><label className="block text-[10px] uppercase font-mono text-[var(--text-secondary)] mb-1">Label</label><input value={link.label} onChange={e => setSiteForm(current => ({ ...current, socialLinks: (current.socialLinks || []).map((item, i) => i === index ? { ...item, label: e.target.value } : item) }))} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--surface-card)] text-xs" /></div>
                        <div className="sm:col-span-3"><label className="block text-[10px] uppercase font-mono text-[var(--text-secondary)] mb-1">Icon</label><select value={link.icon} onChange={e => setSiteForm(current => ({ ...current, socialLinks: (current.socialLinks || []).map((item, i) => i === index ? { ...item, icon: e.target.value } : item) }))} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--surface-card)] text-xs">{['instagram','facebook','linkedin','youtube','tiktok','twitter','mail','whatsapp','globe','link'].map(icon => <option key={icon} value={icon}>{icon}</option>)}</select></div>
                        <div className="sm:col-span-4"><label className="block text-[10px] uppercase font-mono text-[var(--text-secondary)] mb-1">URL</label><input value={link.url} onChange={e => setSiteForm(current => ({ ...current, socialLinks: (current.socialLinks || []).map((item, i) => i === index ? { ...item, url: e.target.value } : item) }))} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--surface-card)] text-xs" /></div>
                        <div className="sm:col-span-1 flex items-center gap-2"><input aria-label="Show link in footer" type="checkbox" checked={link.enabled} onChange={e => setSiteForm(current => ({ ...current, socialLinks: (current.socialLinks || []).map((item, i) => i === index ? { ...item, enabled: e.target.checked } : item) }))} /><span className="text-[10px] text-[var(--text-secondary)]">Show</span></div>
                        <div className="sm:col-span-1 flex justify-end"><button type="button" title="Remove social link" onClick={() => setSiteForm(current => ({ ...current, socialLinks: (current.socialLinks || []).filter((_, i) => i !== index) }))} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveSite}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Branding & Favicon</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 9. INQUIRIES INBOX */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Inbound Consultation Inquiries ({inquiries.length})
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Client consultation requests submitted through the public inquiry form.
                  </p>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)]">
                    <Mail className="w-8 h-8 mx-auto text-[var(--text-secondary)] mb-3" />
                    <p className="text-sm font-semibold text-[var(--text-primary)]">No inquiries yet</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      New consultation requests from your website visitors will be archived here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map(inq => (
                      <div
                        key={inq.id}
                        className="p-5 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)]/60 pb-3">
                          <div>
                            <span className="font-bold font-serif text-lg text-[var(--text-primary)]">
                              {inq.name}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] ml-2">
                              · {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                                inq.status === 'new'
                                  ? 'bg-rose-100 text-rose-800'
                                  : inq.status === 'in_progress'
                                  ? 'bg-amber-100 text-amber-800'
                                  : inq.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-neutral-100 text-neutral-800'
                              }`}
                            >
                              {inq.status}
                            </span>

                            <select
                              value={inq.status}
                              onChange={e =>
                                updateInquiryStatus(inq.id, e.target.value as InquirySubmission['status'])
                              }
                              className="text-xs px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--bg-main)]"
                            >
                              <option value="new">Mark New</option>
                              <option value="contacted">Mark Contacted</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="archived">Archived</option>
                            </select>

                            <button
                              onClick={() => deleteInquiry(inq.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-[var(--text-secondary)]">Discipline: </span>
                            <strong className="text-[var(--text-primary)]">{inq.serviceCategory}</strong>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">Email: </span>
                            <a href={`mailto:${inq.email}`} className="text-[var(--color-primary)] underline">
                              {inq.email}
                            </a>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">Phone: </span>
                            <strong className="text-[var(--text-primary)]">{inq.phone || 'N/A'}</strong>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--surface-soft)] text-xs text-[var(--text-primary)] leading-relaxed">
                          {inq.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 10. SUPABASE & DATABASE SYNC */}
            {activeTab === 'supabase' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Supabase Database & Storage Integration
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Connect your existing Supabase project, verify credentials, upload images to Storage buckets, and sync metadata.
                  </p>
                </div>

                {/* Connection Box */}
                <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[var(--color-secondary)]">
                      Connection Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        supabaseConfig.connected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          supabaseConfig.connected ? 'bg-emerald-600' : 'bg-amber-600'
                        }`}
                      />
                      {supabaseConfig.connected
                        ? 'Connected & Operational'
                        : 'Local Mode (Awaiting Supabase Credentials)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1">
                        Supabase Project URL (e.g. https://xyzcompany.supabase.co)
                      </label>
                      <input
                        type="text"
                        placeholder="https://YOUR_PROJECT_ID.supabase.co"
                        value={supaUrl}
                        onChange={e => setSupaUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] block mb-1">
                        Supabase Anon / Public API Key
                      </label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={supaKey}
                        onChange={e => setSupaKey(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-main)] text-sm font-mono"
                      />
                    </div>
                  </div>

                  {supaTestResult && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        supaTestResult.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {supaTestResult.success ? (
                        <Check className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{supaTestResult.message}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleTestSupabase}
                      disabled={supaTestLoading || !supaUrl || !supaKey}
                      className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm disabled:opacity-50"
                    >
                      {supaTestLoading ? 'Verifying Connection...' : 'Save & Test Supabase'}
                    </button>
                  </div>
                </div>

                {/* SQL Schema Generator Script */}
                <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-[var(--color-border)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Supabase Database Migration & Storage Script
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Run this in your Supabase SQL Editor to provision all tables, Row-Level Security, and Storage buckets with 1 click.
                      </p>
                    </div>
                    <button
                      onClick={copySqlScript}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto max-h-64 scrollbar-thin">
                    {SUPABASE_MIGRATION_SQL}
                  </pre>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
