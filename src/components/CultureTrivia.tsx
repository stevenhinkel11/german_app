import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, ExternalLink, Heart, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { triviaDatabase, type TriviaFact } from '../data/cultureTrivia';

const CultureTrivia: React.FC = () => {
  const [currentFact, setCurrentFact] = useState<TriviaFact | null>(null);
  const [factHistory, setFactHistory] = useState<TriviaFact[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'Germany' | 'Austria' | 'Switzerland'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'culture' | 'history' | 'food' | 'language' | 'geography' | 'traditions' | 'quirky' | 'modern'>('all');
  const [stats, setStats] = useState({ factsViewed: 0, favorites: 0 });
  const [isLoadingWikipedia, setIsLoadingWikipedia] = useState(false);
  const [allFacts, setAllFacts] = useState<TriviaFact[]>(triviaDatabase);

  // Fetch facts from Wikipedia
  const fetchWikipediaFact = async (country: 'Germany' | 'Austria' | 'Switzerland' = 'Germany') => {
    setIsLoadingWikipedia(true);
    try {
      // Wikipedia API: Get a random article related to the country
      const searchTerms = {
        'Germany': ['Germany', 'German culture', 'Berlin', 'Bavaria', 'German history'],
        'Austria': ['Austria', 'Vienna', 'Austrian culture', 'Alps', 'Austrian history'],
        'Switzerland': ['Switzerland', 'Swiss culture', 'Zurich', 'Alps', 'Swiss history']
      };
      
      const randomTerm = searchTerms[country][Math.floor(Math.random() * searchTerms[country].length)];
      
      // First, search for articles
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(randomTerm)}`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error('Wikipedia API error');
      }
      
      const data = await response.json();
      
      // Extract interesting information from the summary
      if (data.extract && data.extract.length > 50) {
        // Create a fact from the Wikipedia summary
        const sentences = data.extract.split('. ').filter((s: string) => s.length > 30);
        if (sentences.length > 0) {
          // Take the first interesting sentence
          let factText = sentences[0];
          if (factText.length > 200) {
            factText = factText.substring(0, 200) + '...';
          }
          
          // Determine category based on content
          let category: 'culture' | 'history' | 'food' | 'language' | 'geography' | 'traditions' | 'quirky' | 'modern' = 'culture';
          const lowerText = factText.toLowerCase();
          if (lowerText.includes('history') || lowerText.includes('war') || lowerText.includes('century')) {
            category = 'history';
          } else if (lowerText.includes('food') || lowerText.includes('cuisine') || lowerText.includes('dish')) {
            category = 'food';
          } else if (lowerText.includes('language') || lowerText.includes('dialect')) {
            category = 'language';
          } else if (lowerText.includes('mountain') || lowerText.includes('river') || lowerText.includes('city')) {
            category = 'geography';
          }
          
          const newFact: TriviaFact = {
            id: `wiki-${Date.now()}-${Math.random()}`,
            title: data.title || `About ${country}`,
            fact: factText,
            country: country,
            category: category,
            funRating: 3,
            difficulty: 2,
            source: 'Wikipedia'
          };
          
          // Cache the fact
          const cachedFacts = JSON.parse(localStorage.getItem('wikipedia-facts') || '[]');
          cachedFacts.push(newFact);
          // Keep only last 50 Wikipedia facts
          const trimmedCache = cachedFacts.slice(-50);
          localStorage.setItem('wikipedia-facts', JSON.stringify(trimmedCache));
          
          setAllFacts(prev => {
            // Avoid duplicates
            if (!prev.find(f => f.id === newFact.id)) {
              return [...prev, newFact];
            }
            return prev;
          });
          
          return newFact;
        }
      }
    } catch (error) {
      console.error('Error fetching Wikipedia fact:', error);
    } finally {
      setIsLoadingWikipedia(false);
    }
    return null;
  };

  // Load cached Wikipedia facts on mount
  useEffect(() => {
    const cachedFacts = JSON.parse(localStorage.getItem('wikipedia-facts') || '[]');
    if (cachedFacts.length > 0) {
      setAllFacts([...triviaDatabase, ...cachedFacts]);
    } else {
      setAllFacts(triviaDatabase);
    }
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('trivia-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    
    // Load stats
    const savedStats = localStorage.getItem('trivia-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    // Load daily fact
    getRandomFact();
    
    // Fetch a new Wikipedia fact occasionally (not on every load to avoid rate limiting)
    const shouldFetchWikipedia = Math.random() < 0.3; // 30% chance
    if (shouldFetchWikipedia) {
      const countries: ('Germany' | 'Austria' | 'Switzerland')[] = ['Germany', 'Austria', 'Switzerland'];
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      fetchWikipediaFact(randomCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRandomFact = async () => {
    let filteredFacts = allFacts;
    
    // Filter by country
    if (selectedCountry !== 'all') {
      filteredFacts = filteredFacts.filter(fact => fact.country === selectedCountry);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filteredFacts = filteredFacts.filter(fact => fact.category === selectedCategory);
    }
    
    // Advanced randomization to avoid repetition
    const recentFactIds = factHistory.slice(-10).map(f => f.id);
    const unusedFacts = filteredFacts.filter(fact => !recentFactIds.includes(fact.id));
    const factsToChooseFrom = unusedFacts.length > 0 ? unusedFacts : filteredFacts;
    
    // If we have very few facts, try to fetch a new one from Wikipedia
    if (factsToChooseFrom.length < 5 && !isLoadingWikipedia) {
      const countries: ('Germany' | 'Austria' | 'Switzerland')[] = ['Germany', 'Austria', 'Switzerland'];
      const countryToFetch = selectedCountry !== 'all' ? selectedCountry : countries[Math.floor(Math.random() * countries.length)];
      await fetchWikipediaFact(countryToFetch);
      // Re-filter after fetching
      let updatedFacts = allFacts;
      if (selectedCountry !== 'all') {
        updatedFacts = updatedFacts.filter(fact => fact.country === selectedCountry);
      }
      if (selectedCategory !== 'all') {
        updatedFacts = updatedFacts.filter(fact => fact.category === selectedCategory);
      }
      filteredFacts = updatedFacts;
    }
    
    // Weight selection by fun rating and difficulty
    const weightedFacts = filteredFacts.flatMap(fact => {
      const weight = Math.max(1, fact.funRating - 1); // Higher fun rating = more weight
      return Array(weight).fill(fact);
    });
    
    if (weightedFacts.length === 0) {
      // Fallback to any fact if filters are too restrictive
      const fallbackFacts = allFacts.filter(fact => !recentFactIds.includes(fact.id));
      if (fallbackFacts.length > 0) {
        const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
        setCurrentFact(randomFact);
        setFactHistory(prev => [...prev, randomFact].slice(-20));
        return;
      }
    }
    
    const randomFact = weightedFacts[Math.floor(Math.random() * weightedFacts.length)];
    setCurrentFact(randomFact);
    
    // Update history and stats
    setFactHistory(prev => [...prev, randomFact].slice(-20)); // Keep last 20 facts
    const newStats = {
      factsViewed: stats.factsViewed + 1,
      favorites: favorites.size
    };
    setStats(newStats);
    localStorage.setItem('trivia-stats', JSON.stringify(newStats));
  };

  const toggleFavorite = (factId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(factId)) {
      newFavorites.delete(factId);
    } else {
      newFavorites.add(factId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('trivia-favorites', JSON.stringify(Array.from(newFavorites)));
    
    // Update stats
    const newStats = {
      ...stats,
      favorites: newFavorites.size
    };
    setStats(newStats);
    localStorage.setItem('trivia-stats', JSON.stringify(newStats));
  };

  const getFlagEmoji = (country: string) => {
    switch (country) {
      case 'Germany': return '🇩🇪';
      case 'Austria': return '🇦🇹';
      case 'Switzerland': return '🇨🇭';
      default: return '🌍';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'culture': return '🎭';
      case 'history': return '📚';
      case 'food': return '🍞';
      case 'language': return '🗣️';
      case 'geography': return '🗺️';
      case 'traditions': return '🎄';
      case 'quirky': return '🤪';
      case 'modern': return '🔬';
      default: return '📖';
    }
  };

  const getCategoryStats = () => {
    const stats = allFacts.reduce((acc, fact) => {
      acc[fact.category] = (acc[fact.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  const getCountryStats = () => {
    const stats = allFacts.reduce((acc, fact) => {
      acc[fact.country] = (acc[fact.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  if (!currentFact) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <Globe className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">Loading cultural facts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🌍 Culture Trivia</h2>
            <p className="text-gray-600">Discover fascinating facts about German-speaking cultures</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{triviaDatabase.length}</div>
            <div className="text-sm text-gray-500">facts available</div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-blue-600" size={20} />
              <span className="font-semibold text-blue-800">Progress</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.factsViewed}</div>
            <div className="text-sm text-blue-600">facts viewed</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-red-600" size={20} />
              <span className="font-semibold text-red-800">Favorites</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{favorites.size}</div>
            <div className="text-sm text-red-600">saved facts</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-green-600" size={20} />
              <span className="font-semibold text-green-800">Completion</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Math.min(100, Math.round((stats.factsViewed / triviaDatabase.length) * 100))}%
            </div>
            <div className="text-sm text-green-600">discovered</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Country:</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              <option value="Germany">🇩🇪 Germany</option>
              <option value="Austria">🇦🇹 Austria</option>
              <option value="Switzerland">🇨🇭 Switzerland</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="culture">🎭 Culture</option>
              <option value="history">📚 History</option>
              <option value="food">🍞 Food</option>
              <option value="language">🗣️ Language</option>
              <option value="geography">🗺️ Geography</option>
              <option value="traditions">🎄 Traditions</option>
              <option value="quirky">🤪 Quirky</option>
              <option value="modern">🔬 Modern</option>
            </select>
          </div>
          
          <button
            onClick={getRandomFact}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            New Fact
          </button>
        </div>
      </div>

      {/* Main Fact Card */}
      <div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getFlagEmoji(currentFact.country)}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentFact.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {getCategoryEmoji(currentFact.category)}
                  {currentFact.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  {currentFact.country}
                </span>
                {currentFact.year && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <Calendar size={10} />
                    {currentFact.year}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => toggleFavorite(currentFact.id)}
            className={`p-2 rounded-lg transition-colors ${
              favorites.has(currentFact.id)
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart size={20} fill={favorites.has(currentFact.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-800 leading-relaxed">{currentFact.fact}</p>
        </div>

        {/* Fact Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>Fun Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < currentFact.funRating ? 'text-yellow-400' : 'text-gray-300'}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span>Difficulty:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < currentFact.difficulty ? 'text-red-400' : 'text-gray-300'}>
                    🔥
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {currentFact.source && (
            <div className="flex items-center gap-1 text-blue-600">
              <ExternalLink size={12} />
              <span className="text-xs">Source: {currentFact.source}</span>
            </div>
          )}
        </div>
      </div>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Facts by Category</h3>
          <div className="space-y-2">
            {getCategoryStats().map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  {getCategoryEmoji(category)}
                  {category}
                </span>
                <span className="text-sm font-medium text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">🏳️ Facts by Country</h3>
          <div className="space-y-2">
            {getCountryStats().map(([country, count]) => (
              <div key={country} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  {getFlagEmoji(country)}
                  {country}
                </span>
                <span className="text-sm font-medium text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Facts */}
      {factHistory.length > 1 && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">📚 Recent Facts</h3>
          <div className="space-y-2">
            {factHistory.slice(-5).reverse().map((fact, index) => (
              <div key={`${fact.id}-${index}`} className="flex items-center gap-2 text-sm">
                <span>{getFlagEmoji(fact.country)}</span>
                <span className="text-gray-700">{fact.title}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{fact.category}</span>
                {favorites.has(fact.id) && <Heart size={12} className="text-red-500" fill="currentColor" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CultureTrivia; 