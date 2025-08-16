// src/services/news/index.ts
// Lightweight client for the Netlify `news-proxy` function.
// NewsPage expects: `useNewsFeeds` hook and `NewsItem` type.

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate?: string;
  description?: string;
  image?: string;
};

export type SourceKey =
  | 'dod'
  | 'diu'
  | 'darpa'
  | 'afwerx'
  | 'army'
  | 'navy'
  | 'airforce';

const RSS_MAP: Record<SourceKey, string> = {
  dod: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=127',
  diu: 'https://media.diu.mil/api/rss',
  darpa: 'https://www.darpa.mil/rss',
  afwerx: 'https://www.afwerx.com/feed/',
  army: 'https://www.army.mil/rss/news/',
  navy: 'https://www.navy.mil/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=178&max=10',
  airforce: 'https://www.af.mil/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=1&Max=10',
};

async function fetchFeed(rssUrl: string, source: string): Promise<NewsItem[]> {
  // We proxy through Netlify to avoid CORS and inconsistent RSS parsing.
  const url = `/.netlify/functions/news-proxy?url=${encodeURIComponent(rssUrl)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`News proxy failed for ${source} (${res.status})`);
  const json = await res.json();

  // Expect a normalized shape from the proxy, but be defensive.
  const items: any[] = Array.isArray(json?.items) ? json.items : [];
  return items.map((i, idx) => ({
    id: i.id ?? i.guid ?? `${source}-${idx}-${i.link ?? ''}`,
    title: i.title ?? 'Untitled',
    link: i.link ?? '#',
    source,
    pubDate: i.pubDate ?? i.pub_date ?? i.isoDate ?? undefined,
    description: i.description ?? i.summary ?? '',
    image: i.enclosure?.url ?? i.image ?? undefined,
  }));
}

export async function getAllNews(sources: SourceKey[] = ['dod', 'diu', 'darpa']) {
  const tasks = sources.map(async (k) => {
    const rss = RSS_MAP[k];
    try {
      return await fetchFeed(rss, k);
    } catch {
      // Return empty array on individual feed failure; page can still render others.
      return [] as NewsItem[];
    }
  });

  const results = await Promise.all(tasks);
  // Flatten + sort by date (desc)
  const flat = results.flat();
  flat.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });
  return flat;
}

// React hook expected by `src/pages/NewsPage.tsx`
import { useEffect, useState, useCallback } from 'react';

export function useNewsFeeds(initSources: SourceKey[] = ['dod', 'diu', 'darpa']) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllNews(initSources);
      setItems(data);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Failed to load news';
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [initSources]);

  useEffect(() => {
    void load();
  }, [load]);

  return { items, loading, error, refresh: load };
}
