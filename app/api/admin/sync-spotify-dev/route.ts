import { NextRequest, NextResponse } from 'next/server';
import { spotifyService } from '../../../lib/spotify';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

function isLocalHost(request: NextRequest): boolean {
  const host = request.headers.get('host') ?? '';
  return (
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]')
  );
}

/**
 * Dev-only: refresh top tracks from Spotify and rewrite data/spotify-tracks.json.
 * Only accepts requests with Host localhost / 127.0.0.1 (same-origin from local dev).
 * Requires SPOTIFY_REFRESH_TOKEN (+ client id/secret) in .env.local.
 */
export async function POST(request: NextRequest) {
  if (!isLocalHost(request)) {
    return NextResponse.json({ error: 'Only available on localhost' }, { status: 403 });
  }

  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refreshToken) {
    return NextResponse.json(
      {
        error:
          'SPOTIFY_REFRESH_TOKEN is not set. Add it to .env.local (from /api/admin/spotify-auth after authorizing once).',
      },
      { status: 500 }
    );
  }

  try {
    const { access_token } = await spotifyService.refreshAccessToken(refreshToken);
    const topTracksResponse = await spotifyService.getUserTopTracks(
      access_token,
      'medium_term',
      10
    );
    const cacheData = spotifyService.createCacheData(topTracksResponse.items, 6);

    const dataDir = join(process.cwd(), 'data');
    const filePath = join(dataDir, 'spotify-tracks.json');
    try {
      await writeFile(filePath, JSON.stringify(cacheData, null, 2));
    } catch {
      await mkdir(dataDir, { recursive: true });
      await writeFile(filePath, JSON.stringify(cacheData, null, 2));
    }

    return NextResponse.json({
      message: 'Tracks synced to data/spotify-tracks.json',
      trackCount: cacheData.tracks.length,
      lastUpdated: cacheData.lastUpdated,
      cacheExpiry: cacheData.cacheExpiry,
      tracks: cacheData.tracks,
    });
  } catch (error) {
    console.error('sync-spotify-dev:', error);
    return NextResponse.json(
      {
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
