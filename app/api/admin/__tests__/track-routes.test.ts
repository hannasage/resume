import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fsMocks = vi.hoisted(() => ({
  writeFile: vi.fn<(path: string, data: string) => Promise<void>>(async () => undefined),
  mkdir: vi.fn<(path: string, options?: object) => Promise<void>>(async () => undefined),
}));

const spotifyMocks = vi.hoisted(() => ({
  refreshAccessToken: vi.fn(async () => ({ access_token: 'access', expires_in: 3600 })),
  getUserTopTracks: vi.fn(async () => ({ items: [] })),
  createCacheData: vi.fn(() => ({ tracks: [], lastUpdated: 'now', cacheExpiry: 'later' })),
}));

vi.mock('fs/promises', () => ({ ...fsMocks, default: fsMocks }));
vi.mock('../../../lib/spotify', () => ({ spotifyService: spotifyMocks }));

import { POST as syncTracks } from '../sync-spotify-dev/route';

const API_DIR = join(__dirname, '..', '..');

function routeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return name === '__tests__' ? [] : routeFiles(path);
    }
    return name === 'route.ts' ? [path] : [];
  });
}

function syncRequest(host: string, body?: unknown) {
  return new NextRequest(`http://${host}/api/admin/sync-spotify-dev`, {
    method: 'POST',
    headers: { host, 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('admin track routes', () => {
  beforeEach(() => {
    vi.stubEnv('SPOTIFY_REFRESH_TOKEN', 'refresh');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('ships no update-tracks route, so a request to it is a 404', () => {
    expect(existsSync(join(API_DIR, 'admin', 'update-tracks', 'route.ts'))).toBe(false);
  });

  it('leaves only the dev-only sync route able to write the track file', () => {
    const writers = routeFiles(API_DIR)
      .filter((path) => {
        const source = readFileSync(path, 'utf8');
        return source.includes('spotify-tracks.json') && source.includes('writeFile');
      })
      .map((path) => path.slice(API_DIR.length + 1));
    expect(writers).toEqual([join('admin', 'sync-spotify-dev', 'route.ts')]);
  });

  it('answers 404 in production and writes nothing, even for a request that claims localhost', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    for (const host of ['localhost:3000', 'example.com']) {
      const response = await syncTracks(syncRequest(host, { access_token: 'any-token' }));
      expect(response.status).toBe(404);
    }
    expect(spotifyMocks.refreshAccessToken).not.toHaveBeenCalled();
    expect(fsMocks.writeFile).not.toHaveBeenCalled();
  });

  it('refuses a non-local host outside production and writes nothing', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const response = await syncTracks(syncRequest('example.com'));
    expect(response.status).toBe(403);
    expect(fsMocks.writeFile).not.toHaveBeenCalled();
  });

  it('writes the track file for a local request in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const response = await syncTracks(syncRequest('localhost:3000'));
    expect(response.status).toBe(200);
    expect(fsMocks.writeFile).toHaveBeenCalledTimes(1);
    expect(String(fsMocks.writeFile.mock.calls[0][0])).toMatch(/data[\\/]spotify-tracks\.json$/);
  });
});
