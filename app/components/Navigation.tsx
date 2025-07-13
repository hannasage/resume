'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Menu, X, Music } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MusicDropdown from './MusicDropdown';
import { SpotifyTrack } from '../lib/spotify-types';

interface NavigationProps {
  activeSection: string;
  scrollToSection: (section: string) => void;
}

export default function Navigation({ activeSection, scrollToSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
  const [musicTracks, setMusicTracks] = useState<SpotifyTrack[]>([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(1, 1 - scrollY / 300);
      setOpacity(newOpacity);
      setHasScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchMusicData = async () => {
    if (musicTracks.length > 0) {
      setIsMusicDropdownOpen(true);
      return;
    }
    
    setMusicLoading(true);
    setMusicError(null);
    
    try {
      const response = await fetch('/api/music/top-tracks');
      const data = await response.json();
      
      if (data.tracks && data.tracks.length > 0) {
        setMusicTracks(data.tracks);
        setIsMusicDropdownOpen(true);
      } else {
        setMusicError('No music data available');
      }
    } catch (error) {
      setMusicError('Failed to load music data');
      console.error('Music fetch error:', error);
    } finally {
      setMusicLoading(false);
    }
  };

  const handleMenuClick = (section: string) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  };

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        hasScrolled ? 'backdrop-blur-md border-b shadow-lg' : ''
      }`}
      style={{ 
        opacity,
        backgroundColor: hasScrolled ? 'var(--color-background-translucent)' : 'transparent',
        borderBottomColor: hasScrolled ? 'var(--color-border)' : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="text-2xl font-bold text-black dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hanna Sage
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['home', 'about', 'skills', 'experience', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize transition-colors duration-200 ${
                  activeSection === section 
                    ? 'border-b-2' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
                style={{
                  color: activeSection === section ? 'var(--color-accent-vibrant)' : undefined,
                  borderBottomColor: activeSection === section ? 'var(--color-accent-vibrant)' : undefined
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Controls & Social Icons */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Music & Theme Controls */}
            <div className="flex items-center space-x-2">
              {/* Music Button */}
              <div className="relative">
                <button
                  onClick={fetchMusicData}
                  className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    isMusicDropdownOpen ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                  aria-label="View my top Spotify tracks"
                  disabled={musicLoading}
                >
                  {musicLoading ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-b-2" style={{ borderColor: 'var(--color-accent-vibrant)' }}></div>
                  ) : (
                    <Music className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
                <MusicDropdown
                  isOpen={isMusicDropdownOpen}
                  onClose={() => setIsMusicDropdownOpen(false)}
                  tracks={musicTracks}
                  loading={musicLoading}
                  error={musicError || undefined}
                />
              </div>
              <ThemeToggle />
            </div>
            
            {/* Separator */}
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/hannasage"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://linkedin.com/in/hannasage"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden border-t ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
        style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-border)' 
        }}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0, 
          height: isMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-2 space-y-2">
          {['home', 'about', 'skills', 'experience', 'contact'].map((section) => (
            <button
              key={section}
              onClick={() => handleMenuClick(section)}
              className={`block w-full text-left py-2 capitalize transition-colors duration-200 ${
                activeSection === section 
                  ? 'font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
              style={{
                color: activeSection === section ? 'var(--color-accent-vibrant)' : undefined
              }}
            >
              {section}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}