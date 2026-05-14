'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { getNavigationData } from '../lib/content-loader';

interface NavigationProps {
  activeSection: string;
  scrollToSection: (section: string) => void;
}

export default function Navigation({ activeSection, scrollToSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const navigationData = getNavigationData();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = (section: string) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-colors duration-200"
      style={{
        backgroundColor: hasScrolled
          ? 'var(--color-background-translucent)'
          : 'transparent',
        backdropFilter: hasScrolled ? 'blur(10px)' : undefined,
        WebkitBackdropFilter: hasScrolled ? 'blur(10px)' : undefined,
        borderBottom: hasScrolled
          ? '1px solid var(--color-border)'
          : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-2 min-w-0">
            <span aria-hidden className="pip flex-shrink-0" />
            <span className="font-display text-base sm:text-lg font-bold tracking-tightish text-ink truncate">
              {navigationData.brand}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navigationData.menuItems.map((item, i) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 text-[11px] uppercase tracking-widest2 transition-colors duration-150 ${
                  activeSection === item.id
                    ? 'text-accent'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <span className="text-ink-muted mr-1.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <ThemeSelector />
              <span
                aria-hidden
                className="h-4 w-px"
                style={{ background: 'var(--color-border)' }}
              />
              {navigationData.socialLinks.map((link) => {
                const Icon = link.icon === 'Github' ? Github : Linkedin;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-2 rounded-sm text-ink-dim hover:text-accent transition-colors duration-150"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <ThemeSelector />
              <button
                className="p-2 text-ink-dim hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          isMenuOpen ? 'max-h-[320px]' : 'max-h-0'
        }`}
        style={{
          backgroundColor: 'var(--color-bg)',
          borderTop: isMenuOpen
            ? '1px solid var(--color-border)'
            : '1px solid transparent',
        }}
      >
        <div className="px-4 py-3 space-y-1">
          {navigationData.menuItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`block w-full text-left py-2 text-[12px] uppercase tracking-widest2 transition-colors duration-150 ${
                activeSection === item.id ? 'text-accent' : 'text-ink-dim'
              }`}
            >
              <span className="text-ink-muted mr-2">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.label}
            </button>
          ))}

          <div
            className="pt-3 mt-2 flex items-center justify-center gap-2"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {navigationData.socialLinks.map((link) => {
              const Icon = link.icon === 'Github' ? Github : Linkedin;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="p-2 rounded-sm text-ink-dim hover:text-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
