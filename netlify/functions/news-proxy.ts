// netlify/functions/news-proxy.ts
import type { Handler } from '@netlify/functions';

const SOURCES: Record<string, string> = {
  dod: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=127',
  // add more sources here if you want: ex. 'af': 'https://www.af.mil/DesktopModules/ArticleCS/RSS.ashx?...'
};

export const handler: Handler = async (event) => {
  const source = event.queryStringParameters?.source || 'dod';
  const url = SOURCES[source];
  if (!url) return { statusCode: 400, body: 'Unknown source' };

  try {
    const upstream = await fetch(url);
    const text = await upstream.text();
    return {
      statusCode: upstream.ok ? 200 : upstream.status,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch {
    return { statusCode: 502, body: 'Upstream fetch failed' };
  }
};
