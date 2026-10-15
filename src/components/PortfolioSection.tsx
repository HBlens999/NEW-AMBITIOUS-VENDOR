import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink, Sparkles, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PortfolioProject } from '../types/data';

export const PortfolioSection: React.FC = () => {
  const { portfolio } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Derive category tabs from current projects so obsolete categories disappear automatically.
  const categories = ['All', ...Array.from(new Set(portfolio.map(project => project.category).filter(Boolean)))];

  const filteredProjects =
    activeCategory === 'All'
      ? portfolio
      : portfolio.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Clear, High-Contrast Section Heading Panel */}
      <div className="mb-14 pb-6 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-secondary)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>02. Selected Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)]">
            Curated Creative Portfolio
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--color-border)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)]">
          <p className="text-sm text-[var(--text-secondary)]">No projects found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Project Image Frame */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    {project.category}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-mono text-neutral-300 bg-black/40 backdrop-blur-md rounded-full">
                    {project.year}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 p-2 rounded-full bg-white/20 text-white backdrop-blur-md group-hover:bg-[var(--color-primary)] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Information Panel */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[var(--color-secondary)]">
                    Client: {project.client}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors mt-1">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-primary)] font-medium">
                    {project.outcome}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[var(--surface-card)] rounded-2xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--surface-soft)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-white bg-[var(--color-primary)] rounded-full">
                {selectedProject.category}
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                {selectedProject.year} · Client: {selectedProject.client}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-3">
              {selectedProject.title}
            </h3>

            <div className="my-6 rounded-xl overflow-hidden max-h-96 bg-neutral-900">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] mb-1">
                  Project Overview
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {selectedProject.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--color-border)]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--color-primary)] mb-1">
                  Deliverable Outcome & Impact
                </h4>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {selectedProject.outcome}
                </p>
              </div>

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 text-xs rounded-full bg-[var(--surface-card)] border border-[var(--color-border)] text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
              {selectedProject.projectUrl && selectedProject.projectUrl !== '#' ? (
                <a
                  href={selectedProject.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  <span>Visit Live Case Study</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-[var(--text-secondary)]">Private Commission Case</span>
              )}

              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-full shadow-sm"
              >
                Close Project
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
