import { describe, expect, it, vi } from 'vitest';
import { SYNC_PATH, updateTracks } from '../update-tracks.mjs';

function fakeFetch(status, body) {
  return vi.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }));
}

describe('update-tracks script', () => {
  it('posts to the local sync route and returns its body', async () => {
    const fetchImpl = fakeFetch(200, { message: 'ok', trackCount: 6 });
    const body = await updateTracks({ baseUrl: 'http://localhost:3000', fetchImpl });
    expect(body.trackCount).toBe(6);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toBe(`http://localhost:3000${SYNC_PATH}`);
    expect(init).toEqual({ method: 'POST' });
  });

  it('refuses a base URL that is not local, before any request', async () => {
    const fetchImpl = fakeFetch(200, {});
    await expect(
      updateTracks({ baseUrl: 'https://example.com', fetchImpl }),
    ).rejects.toThrow(/local dev server only/);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fails with the status when the route refuses', async () => {
    const fetchImpl = fakeFetch(404, { error: 'Not found' });
    await expect(
      updateTracks({ baseUrl: 'http://127.0.0.1:3000', fetchImpl }),
    ).rejects.toThrow('Sync failed with 404: Not found');
  });
});
