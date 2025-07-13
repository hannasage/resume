import { NextRequest, NextResponse } from 'next/server';
import { spotifyService } from '../../../lib/spotify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const action = searchParams.get('action');

  // Generate auth URL for initial setup
  if (action === 'authorize') {
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/spotify-auth`;
    const authUrl = spotifyService.generateAuthUrl(redirectUri, ['user-top-read']);
    
    return NextResponse.redirect(authUrl);
  }

  // Handle callback with authorization code
  if (code) {
    try {
      const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/spotify-auth`;
      const tokens = await spotifyService.exchangeCodeForTokens(code, redirectUri);
      
      // In a real app, you'd store these tokens securely
      // For now, we'll return them for manual storage
      return NextResponse.json({
        message: 'Authentication successful! Store these tokens securely.',
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in
        }
      });
    } catch (error) {
      console.error('Spotify auth error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
    }
  }

  return NextResponse.json({ 
    message: 'Spotify Admin Auth',
    usage: 'Add ?action=authorize to start auth flow'
  });
}

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();
    
    if (!refresh_token) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    const tokens = await spotifyService.refreshAccessToken(refresh_token);
    
    return NextResponse.json({
      message: 'Token refreshed successfully',
      tokens: {
        access_token: tokens.access_token,
        expires_in: tokens.expires_in
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 400 });
  }
}