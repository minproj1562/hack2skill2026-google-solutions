import React, { useState, useRef } from 'react';
import { Menu, Search, Bell, Share2, Bookmark } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import './NewsApp.css';

const MOCK_NEWS = [
  {
    id: 1,
    category: 'Politics',
    title: 'Global Summit Reaches Historic Agreement on Climate Action',
    source: 'World News Network',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1529245003508-3e4cbfa2bd69?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    category: 'Technology',
    title: 'Next-Gen AI Models Show Unprecedented Reasoning Capabilities',
    source: 'Tech Daily',
    time: '4h ago',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    category: 'Health',
    title: 'New Study Links Mediterranean Diet to Extended Lifespan',
    source: 'Healthline',
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    category: 'Sports',
    title: 'Championship Finals: Underdog Team Secures Victory in Overtime',
    source: 'Sports Hub',
    time: '8h ago',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400'
  }
];

export const NewsApp: React.FC = () => {
  const { setMode } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('For You');
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      setMode('PIN_ENTRY');
      if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    }, 2000); // 2 second hold
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleDoubleClick = () => {
    setMode('PIN_ENTRY');
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="news-app animate-fade-in">
      <header className="news-header">
        <div className="top-bar">
          <Menu className="icon" />
          {/* This is the secret trigger area */}
          <div 
            className="logo-container"
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            <h1 className="logo">Global<span className="logo-accent">News</span></h1>
          </div>
          <div className="actions">
            <Search className="icon" />
            <Bell className="icon" />
          </div>
        </div>
        
        <div className="categories-scroll">
          {['For You', 'Politics', 'Tech', 'Health', 'Sports', 'Entertainment'].map(cat => (
            <button 
              key={cat} 
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="news-feed">
        <div className="breaking-news">
          <span className="breaking-badge">Breaking</span>
          <h2>Market Hits All-Time High Amidst Tech Surge</h2>
        </div>

        <div className="news-list">
          {MOCK_NEWS.map(news => (
            <article key={news.id} className="news-card">
              <div className="news-card-image" style={{ backgroundImage: `url(${news.image})` }} />
              <div className="news-card-content">
                <span className="news-category">{news.category}</span>
                <h3 className="news-title">{news.title}</h3>
                <div className="news-footer">
                  <span className="news-source">{news.source} • {news.time}</span>
                  <div className="news-actions">
                    <Bookmark className="icon-small" />
                    <Share2 className="icon-small" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      
      {/* Fake Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <div className="nav-icon home-icon"></div>
          <span>Home</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon discover-icon"></div>
          <span>Discover</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon profile-icon"></div>
          <span>Profile</span>
        </div>
      </nav>
    </div>
  );
};
