import React, { useState, useEffect } from 'react';
import { useNewsFeeds, type NewsItem } from '../services/news';
import { RefreshCw, AlertCircle, Rss } from 'lucide-react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import NewsCard from '../components/NewsCard';
import NewsFilter from '../components/NewsFilter';

const NewsPage = () => {
  const { newsItems, isLoading, error } = useNewsFeeds();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [timeFrame, setTimeFrame] = useState('all');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);

  // Get unique sources from news items
  const sources = [...new Set(newsItems.map(item => item.source))];

  // Filter news items based on search, source, and time
  useEffect(() => {
    let filtered = [...newsItems];
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by source
    if (selectedSource) {
      filtered = filtered.filter(item => item.source === selectedSource);
    }
    
    // Filter by time frame
    if (timeFrame !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeFrame) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.pubDate) >= startDate);
    }
    
    setFilteredNews(filtered);
  }, [newsItems, searchTerm, selectedSource, timeFrame]);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Defense & DoD Acquisitions News</h1>
          <p className="text-xl text-gray-300">
            Stay informed with the latest news and updates from the defense industry
          </p>
        </div>
      </div>

      {/* Filters */}
      <NewsFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        sources={sources}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
      />

      {/* News Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhred mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news articles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-bhred mx-auto mb-4" />
            <p className="text-xl font-bold text-bhgray-800 mb-2">Error Loading News</p>
            <p className="text-gray-600">
              We couldn't load the latest news. Please try again later.
            </p>
          </div>
        ) : filteredNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Rss className="w-12 h-12 text-bhgray-400 mx-auto mb-4" />
            <p className="text-xl font-bold text-bhgray-800 mb-2">No News Articles Found</p>
            <p className="text-gray-600">
              {searchTerm || selectedSource || timeFrame !== 'all' 
                ? "Try adjusting your filters to see more results." 
                : "We don't have any news articles to display right now."}
            </p>
          </div>
        )}
      </div>

      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default NewsPage;