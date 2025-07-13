'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Clock } from 'lucide-react';
import { MusicDropdownProps } from '../lib/spotify-types';

export default function MusicDropdown({ isOpen, onClose, tracks, loading, error }: MusicDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-72 sm:w-80 md:w-96 rounded-lg shadow-lg border backdrop-blur-md z-50"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
            transform: 'translateX(calc(-100% + 2.5rem))'
          }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                My Top Tracks
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close music dropdown"
              >
                ✕
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--color-accent-vibrant)' }}></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading tracks...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Failed to load music</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            )}

            {!loading && !error && tracks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No tracks available</p>
              </div>
            )}

            {!loading && !error && tracks.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tracks.slice(0, 5).map((track, index) => (
                  <motion.div
                    key={track.id}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Album Art */}
                    <div className="relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={track.album.images[2]?.url || track.album.images[0]?.url}
                        alt={`${track.album.name} cover`}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded transition-all duration-200 flex items-center justify-center">
                        {track.preview_url && (
                          <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-black dark:text-white truncate">
                        {track.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {track.artists.map(artist => artist.name).join(', ')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                        {track.album.name}
                      </p>
                    </div>

                    {/* Track Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(track.duration_ms)}
                      </span>
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={`Open ${track.name} on Spotify`}
                      >
                        <ExternalLink className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && tracks.length > 0 && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  My top tracks from Spotify • Updated periodically
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}