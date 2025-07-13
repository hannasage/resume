import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CachedSpotifyData } from '../../../lib/spotify-types';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'spotify-tracks.json');
    
    try {
      const fileContents = await readFile(filePath, 'utf8');
      const cacheData: CachedSpotifyData = JSON.parse(fileContents);
      
      // Check if cache is expired
      const isExpired = new Date() > new Date(cacheData.cacheExpiry);
      
      return NextResponse.json({
        tracks: cacheData.tracks,
        lastUpdated: cacheData.lastUpdated,
        cacheExpired: isExpired,
        ...(isExpired && { message: 'Cache expired - data may be stale' })
      });
    } catch {
      // File doesn't exist or is corrupted, return fallback
      return NextResponse.json({
        tracks: [],
        error: 'No cached music data available',
        lastUpdated: null,
        cacheExpired: true
      });
    }
  } catch (error) {
    console.error('Music API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load music data',
        tracks: [],
        lastUpdated: null,
        cacheExpired: true
      }, 
      { status: 500 }
    );
  }
}

export async function HEAD() {
  try {
    const filePath = join(process.cwd(), 'data', 'spotify-tracks.json');
    const fileContents = await readFile(filePath, 'utf8');
    const cacheData: CachedSpotifyData = JSON.parse(fileContents);
    
    const headers = new Headers();
    headers.set('Last-Modified', new Date(cacheData.lastUpdated).toUTCString());
    headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    return new NextResponse(null, { status: 200, headers });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}