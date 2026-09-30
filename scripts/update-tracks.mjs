// Refresh data/spotify-tracks.json from a local dev server.
//
// Usage: start `npm run dev`, then run `npm run update-tracks` in a second
// terminal. The dev-only sync route reads SPOTIFY_REFRESH_TOKEN from
// .env.local and writes the file. A production build answers 404 on that
// route, so the track list is never written from the deployed site.

import { pathToFileURL } from 'node:url';

export const DEFAULT_BASE_URL = 'http://localhost:3000';
export const SYNC_PATH = '/api/admin/sync-spotify-dev';

export async function updateTracks({ baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch } = {}) {
  const url = new URL(SYNC_PATH, baseUrl);
  if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error(`update-tracks runs against a local dev server only, not ${url.host}`);
  }
  const response = await fetchImpl(url, { method: 'POST' });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Sync failed with ${response.status}: ${body.error ?? 'no error message'}`);
  }
  return body;
}

const isMain = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  updateTracks({ baseUrl: process.env.UPDATE_TRACKS_BASE_URL ?? DEFAULT_BASE_URL })
    .then((body) => {
      console.log(`${body.message}: ${body.trackCount} tracks, updated ${body.lastUpdated}`);
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
