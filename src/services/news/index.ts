import { useCallback, useEffect, useState } from 'react';

/**
 * Normalized news item used by the UI.
 */
export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  published_at?: string;
  description?: string;
  image?: string | null;
};

/**
 * React hook to fetch news from the Netlify proxy function.
 * This avoids direct calls to third-party RSS JSON providers
 * (e.g., rss2json) and prevents CORS/500 issues.
 *
 * The Netlify function path is /.netlify/functions/news-proxy
 * and supports multiple `source=` query params.
 */
export function useNewsFeeds(sources: string[] = ['dod', 'usaf', 'army', 'navy']) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = sources.map((s) => `source=${encodeURIComponent(s)}`).join('&');
      const res = await fetch(`/.netlify/functions/news-proxy?${qs}`, {
        headers: { 'cache-control': 'no-cache' },
      });
      if (!res.ok) throw new Error(`news-proxy ${res.status}`);

      const payload = await res.json();
      const list: NewsItem[] = Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
        ? payload
        : [];

      // De-dupe by link/title
      const map = new Map<string, NewsItem>();
      for (const n of list) {
        const key = ((n.link ?? n.title) ?? '').toLowerCase();
        if (key && !map.has(key)) map.set(key, n);
      }
      setItems(Array.from(map.values()));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [sources]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return { items, loading, error, refresh: fetchAll };
}
