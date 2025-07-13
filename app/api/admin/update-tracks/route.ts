import { NextRequest, NextResponse } from 'next/server';
import { spotifyService } from '../../../lib/spotify';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { access_token } = await request.json();
    
    if (!access_token) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 });
    }

    // Fetch top tracks from Spotify
    const topTracksResponse = await spotifyService.getUserTopTracks(access_token, 'medium_term', 10);
    
    // Create cache data
    const cacheData = spotifyService.createCacheData(topTracksResponse.items, 6);
    
    // Save to data directory
    const dataDir = join(process.cwd(), 'data');
    const filePath = join(dataDir, 'spotify-tracks.json');
    
    // Ensure data directory exists
    try {
      await writeFile(filePath, JSON.stringify(cacheData, null, 2));
    } catch {
      // If data directory doesn't exist, create it and try again
      const { mkdir } = await import('fs/promises');
      await mkdir(dataDir, { recursive: true });
      await writeFile(filePath, JSON.stringify(cacheData, null, 2));
    }
    
    return NextResponse.json({
      message: 'Tracks updated successfully',
      trackCount: cacheData.tracks.length,
      lastUpdated: cacheData.lastUpdated,
      cacheExpiry: cacheData.cacheExpiry
    });
  } catch (error) {
    console.error('Update tracks error:', error);
    return NextResponse.json({ 
      error: 'Failed to update tracks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}