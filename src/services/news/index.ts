// src/services/news/index.ts
// Use our Netlify proxy to avoid CORS/rate limits from rss2json.
const SOURCES = {
  dod: '/.netlify/functions/news-proxy?source=dod',
  diu: '/.netlify/functions/news-proxy?source=diu',
  dhs: '/.netlify/functions/news-proxy?source=dhs',
  whitehouse: '/.netlify/functions/news-proxy?source=whitehouse',
} as const

export interface NewsItem {
  source: keyof typeof SOURCES
  title: string
  link: string
  pubDate: string
  description?: string
}

function parseRSS(xmlStr: string, source: keyof typeof SOURCES): NewsItem[] {
  const doc = new window.DOMParser().parseFromString(xmlStr, 'application/xml')
  const items = Array.from(doc.querySelectorAll('item'))
  return items.map((item) => ({
    source,
    title: item.querySelector('title')?.textContent?.trim() || 'Untitled',
    link: item.querySelector('link')?.textContent?.trim() || '#',
    pubDate: item.querySelector('pubDate')?.textContent?.trim() || new Date().toISOString(),
    description: item.querySelector('description')?.textContent?.trim() || undefined,
  }))
}

async function fetchSource(source: keyof typeof SOURCES) {
  const url = SOURCES[source]
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error(`Failed to fetch ${source} RSS`)
  const xml = await res.text()
  return parseRSS(xml, source)
}

export async function fetchAllNews() {
  const sources: (keyof typeof SOURCES)[] = ['dod', 'diu', 'dhs', 'whitehouse']
  const lists = await Promise.allSettled(sources.map(fetchSource))
  const items = []
  for (const result of lists) {
    if (result.status === 'fulfilled') items.push(...result.value)
  }
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  return items
}

export const newsService = {
  fetchAllNews,
  fetchSource,
}
