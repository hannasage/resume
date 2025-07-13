import { SpotifyTopTracksResponse, SpotifyAuthTokens, CachedSpotifyData } from './spotify-types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com';

export class SpotifyService {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  }

  async getClientCredentialsToken(): Promise<string> {
    const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.statusText}`);
    }

    const data: SpotifyAuthTokens = await response.json();
    return data.access_token;
  }

  async getUserTopTracks(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 10): Promise<SpotifyTopTracksResponse> {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch top tracks: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text:', responseText);
      throw new Error(`Invalid JSON response from Spotify: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<SpotifyAuthTokens> {
    const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return response.json();
  }

  generateAuthUrl(redirectUri: string, scopes: string[] = ['user-top-read']): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: scopes.join(' '),
      redirect_uri: redirectUri,
      state: crypto.randomUUID()
    });

    return `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<SpotifyAuthTokens> {
    const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    return response.json();
  }

  createCacheData(tracks: SpotifyTopTracksResponse['items'], cacheHours: number = 6): CachedSpotifyData {
    const now = new Date();
    const expiry = new Date(now.getTime() + (cacheHours * 60 * 60 * 1000));

    return {
      tracks,
      lastUpdated: now.toISOString(),
      cacheExpiry: expiry.toISOString()
    };
  }

  isCacheExpired(cacheData: CachedSpotifyData): boolean {
    return new Date() > new Date(cacheData.cacheExpiry);
  }
}

export const spotifyService = new SpotifyService();