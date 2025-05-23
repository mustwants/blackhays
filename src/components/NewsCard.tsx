import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import type { NewsItem } from '../services/news';

interface NewsCardProps {
  article: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    // Remove HTML tags
    const plainText = text?.replace(/<[^>]*>?/gm, '') || '';
    
    if (plainText.length <= maxLength) return plainText;
    
    // Find the last space within the limit
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return truncated.substring(0, lastSpace) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {article.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Hide broken images
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-bhred text-white rounded-full">
            {article.source}
          </span>
          <div className="flex items-center text-bhgray-500 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(article.pubDate)}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-bhgray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        {(article.description || article.content) && (
          <p className="text-bhgray-600 mb-4">
            {truncateDescription(article.description || article.content || '')}
          </p>
        )}
        
        <div className="mt-4">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-bhred hover:text-red-700"
          >
            Read More
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;