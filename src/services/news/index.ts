import { useState, useEffect } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  description?: string;
  imageUrl?: string;
  source: string;
}

// Mock news data for development
const MOCK_NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'DoD Announces New Innovation Initiative',
    link: 'https://example.com/news/1',
    pubDate: new Date().toISOString(),
    description: 'The Department of Defense has announced a new initiative to accelerate technology adoption.',
    imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    source: 'Department of Defense'
  },
  {
    id: '2',
    title: 'Defense Industry Updates Cybersecurity Standards',
    link: 'https://example.com/news/2',
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    description: 'New cybersecurity standards have been implemented across defense contractors.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    source: 'Defense News'
  },
  {
    id: '3',
    title: 'SBIR Program Sees Record Applications',
    link: 'https://example.com/news/3',
    pubDate: new Date(Date.now() - 172800000).toISOString(),
    description: 'The Small Business Innovation Research program has received a record number of applications this year.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    source: 'Breaking Defense'
  }
];

// List of RSS feeds for defense news
const NEWS_FEEDS = [
  {
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=127',
    name: 'Department of Defense'
  },
  {
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml',
    name: 'Defense News'
  },
  {
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://breakingdefense.com/feed/',
    name: 'Breaking Defense'
  },
  {
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.defensedaily.com/feed/',
    name: 'Defense Daily'
  }
];

export const useNewsFeeds = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllFeeds = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In development mode, return mock data to avoid making external API calls
        if (import.meta.env.DEV) {
          setNewsItems(MOCK_NEWS_ITEMS);
          setIsLoading(false);
          return;
        }
        
        const feedPromises = NEWS_FEEDS.map(async feed => {
          try {
            const response = await fetch(feed.url);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch from ${feed.name}`);
            }
            
            const data = await response.json();
            
            // Transform the RSS feed items to our NewsItem format
            return data.items.map((item: any) => ({
              id: item.guid || item.link,
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              content: item.content,
              description: item.description,
              imageUrl: extractImageFromContent(item.content || item.description || ''),
              source: feed.name
            }));
          } catch (err) {
            console.error(`Error fetching ${feed.name}:`, err);
            return []; // Return empty array for failed feeds
          }
        });
        
        const results = await Promise.all(feedPromises);
        
        // Collect successful results
        const allNews = results.flat();
        
        // Sort by date (newest first)
        const sortedNews = allNews.sort((a, b) => 
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );
        
        setNewsItems(sortedNews.length > 0 ? sortedNews : MOCK_NEWS_ITEMS);
      } catch (err) {
        console.error('Error fetching news feeds:', err);
        setError(err as Error);
        setNewsItems(MOCK_NEWS_ITEMS); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllFeeds();
  }, []);

  return { newsItems, isLoading, error };
};

// Helper function to extract image URL from HTML content
function extractImageFromContent(content: string): string | undefined {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
}