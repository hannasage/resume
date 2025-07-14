'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Menu, X, Music } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MusicDropdown from './MusicDropdown';
import { Button } from './ui';
import { SpotifyTrack } from '../lib/spotify-types';
import { getNavigationData } from '../lib/content-loader';

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
  
  // Load navigation data
  const navigationData = getNavigationData();

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
            {navigationData.brand}
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigationData.menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`capitalize transition-colors duration-200 ${
                  activeSection === item.id 
                    ? 'border-b-2 text-accent-gradient' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
                style={{
                  borderImage: activeSection === item.id ? 'var(--color-accent-gradient) 1' : undefined
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Controls & Social Icons */}
          <div className="flex items-center space-x-2">
            {/* Desktop: Full controls */}
            <div className="hidden md:flex items-center space-x-2">
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
              
              {/* Separator */}
              <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-2">
                {navigationData.socialLinks.map((link) => {
                  const IconComponent = link.icon === 'Github' ? Github : Linkedin;
                  return (
                    <Button
                      key={link.id}
                      variant="social"
                      onClick={() => window.open(link.url, '_blank')}
                      aria-label={link.label}
                    >
                      <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </Button>
                  );
                })}
              </div>
            </div>
            
          </div>

          {/* Mobile: Theme toggle and Menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="text-black dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
          {navigationData.menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`block w-full text-left py-2 capitalize transition-colors duration-200 ${
                activeSection === item.id 
                  ? 'font-medium text-accent-gradient' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {/* Mobile Controls & Social Media Icons */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Spotify Playlist Button for Mobile */}
            <div className="flex justify-center mb-4">
              <a
                href={navigationData.mobile.spotifyPlaylist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="See my playlist on Spotify"
              >
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.08 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{navigationData.mobile.spotifyPlaylist.label}</span>
              </a>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center justify-center space-x-4">
              {navigationData.socialLinks.map((link) => {
                const IconComponent = link.icon === 'Github' ? Github : Linkedin;
                return (
                  <Button
                    key={link.id}
                    variant="social"
                    onClick={() => window.open(link.url, '_blank')}
                    aria-label={link.label}
                  >
                    <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}