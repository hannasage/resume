export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  popularity: number;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface SpotifyAuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface CachedSpotifyData {
  tracks: SpotifyTrack[];
  lastUpdated: string;
  cacheExpiry: string;
}

export interface MusicDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: SpotifyTrack[];
  loading?: boolean;
  error?: string;
}