import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, ExternalLink, Heart } from 'lucide-react';

interface TriviaFact {
  id: string;
  title: string;
  fact: string;
  country: 'Germany' | 'Austria' | 'Switzerland';
  category: 'culture' | 'history' | 'food' | 'language' | 'geography' | 'traditions';
  difficulty: number;
  funRating: number;
  source?: string;
}

const CultureTrivia: React.FC = () => {
  const [currentFact, setCurrentFact] = useState<TriviaFact | null>(null);
  const [factHistory, setFactHistory] = useState<TriviaFact[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'Germany' | 'Austria' | 'Switzerland'>('all');

  const triviaFacts: TriviaFact[] = [
    {
      id: '1',
      title: 'German Christmas Markets',
      fact: 'Germany has over 2,500 Christmas markets (Weihnachtsmärkte) that operate during the holiday season. The oldest one in Dresden dates back to 1434! These markets are famous for Glühwein (mulled wine), Lebkuchen (gingerbread), and handcrafted ornaments.',
      country: 'Germany',
      category: 'traditions',
      difficulty: 2,
      funRating: 5,
      source: 'German National Tourist Board'
    },
    {
      id: '2',
      title: 'Swiss Cheese Holes',
      fact: 'The holes in Swiss cheese (called "eyes") are created by bacteria that produce carbon dioxide gas during the aging process. Traditional Swiss cheesemakers can tell the quality of cheese by the sound it makes when tapped!',
      country: 'Switzerland',
      category: 'food',
      difficulty: 2,
      funRating: 4
    },
    {
      id: '3',
      title: 'Austrian Sound of Music',
      fact: 'While "The Sound of Music" is beloved worldwide, it\'s actually not that popular in Austria! Most Austrians haven\'t seen it, and some find the portrayal of their country to be too stereotypical. The real von Trapp family story is quite different from the musical.',
      country: 'Austria',
      category: 'culture',
      difficulty: 3,
      funRating: 4
    },
    {
      id: '4',
      title: 'German Bread Diversity',
      fact: 'Germany has over 3,000 different types of bread! German bread culture is so significant that it was added to UNESCO\'s list of Intangible Cultural Heritage in 2014. Germans eat an average of 85kg of bread per person per year.',
      country: 'Germany',
      category: 'food',
      difficulty: 2,
      funRating: 4
    },
    {
      id: '5',
      title: 'Swiss Punctuality',
      fact: 'Swiss trains are so punctual that they have an average delay of just 3 minutes. If a train is more than 3 minutes late, passengers can get a partial refund. The Swiss railway system is considered one of the most efficient in the world!',
      country: 'Switzerland',
      category: 'culture',
      difficulty: 2,
      funRating: 4
    },
    {
      id: '6',
      title: 'German Recycling',
      fact: 'Germany recycles about 68% of its waste, making it one of the world\'s top recycling countries. The German recycling system is so complex that there are specific days for different types of waste, and mixing them up can result in fines!',
      country: 'Germany',
      category: 'culture',
      difficulty: 2,
      funRating: 3
    },
    {
      id: '7',
      title: 'Austrian Coffeehouse Culture',
      fact: 'Viennese coffeehouse culture is a UNESCO Intangible Cultural Heritage. A traditional Austrian coffeehouse serves over 30 different types of coffee preparations, and it\'s considered rude to rush customers - people often spend hours reading newspapers and socializing.',
      country: 'Austria',
      category: 'culture',
      difficulty: 3,
      funRating: 4
    },
    {
      id: '8',
      title: 'German Autobahn',
      fact: 'About 70% of Germany\'s autobahn network has no speed limit! However, there\'s a recommended speed of 130 km/h (81 mph). The autobahn system was started in the 1930s and now spans over 13,000 kilometers.',
      country: 'Germany',
      category: 'geography',
      difficulty: 2,
      funRating: 5
    },
    {
      id: '9',
      title: 'Swiss Direct Democracy',
      fact: 'Switzerland practices direct democracy where citizens vote on specific issues 3-4 times per year. Swiss people have voted on everything from minimum wage to whether to build new infrastructure. It\'s one of the most democratic countries in the world!',
      country: 'Switzerland',
      category: 'culture',
      difficulty: 4,
      funRating: 4
    },
    {
      id: '10',
      title: 'German Kindergarten',
      fact: 'The concept of "Kindergarten" (children\'s garden) was invented in Germany by Friedrich Fröbel in 1840. The idea was to let children learn through play and creativity, which was revolutionary at the time. Now kindergartens exist worldwide!',
      country: 'Germany',
      category: 'history',
      difficulty: 3,
      funRating: 4
    }
  ];

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('trivia-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    
    // Load daily fact
    getRandomFact();
  }, []);

  const getRandomFact = () => {
    const filteredFacts = selectedCountry === 'all' 
      ? triviaFacts 
      : triviaFacts.filter(fact => fact.country === selectedCountry);
    
    const unusedFacts = filteredFacts.filter(fact => !factHistory.some(used => used.id === fact.id));
    const factsToChooseFrom = unusedFacts.length > 0 ? unusedFacts : filteredFacts;
    
    const randomFact = factsToChooseFrom[Math.floor(Math.random() * factsToChooseFrom.length)];
    setCurrentFact(randomFact);
    
    setFactHistory(prev => [...prev, randomFact].slice(-10)); // Keep last 10 facts
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
      default: return '📖';
    }
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
      {/* Controls */}
      <div className="card p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-blue-600" />
            <span className="font-medium">Culture Trivia</span>
          </div>
          <div className="flex items-center gap-2">
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
            <button
              onClick={getRandomFact}
              className="btn-primary text-sm flex items-center gap-1"
            >
              <RefreshCw size={14} />
              New Fact
            </button>
          </div>
        </div>
      </div>

      {/* Main Fact Card */}
      <div className="card p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getFlagEmoji(currentFact.country)}</span>
            <span className="text-lg font-semibold text-gray-800">{currentFact.country}</span>
          </div>
          <button
            onClick={() => toggleFavorite(currentFact.id)}
            className={`p-2 rounded-full transition-colors ${
              favorites.has(currentFact.id) 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={20} fill={favorites.has(currentFact.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentFact.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              {getCategoryEmoji(currentFact.category)}
              {currentFact.category}
            </span>
            <span>Difficulty: {'⭐'.repeat(currentFact.difficulty)}</span>
            <span>Fun Rating: {'🎉'.repeat(currentFact.funRating)}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">{currentFact.fact}</p>
        </div>

        {currentFact.source && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ExternalLink size={14} />
              <span>Source: {currentFact.source}</span>
            </div>
          </div>
        )}
      </div>

      {/* Recent Facts */}
      {factHistory.length > 1 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Facts</h3>
          <div className="space-y-2">
            {factHistory.slice(-5).reverse().map((fact, index) => (
              <div
                key={fact.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  fact.id === currentFact.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentFact(fact)}
              >
                <span className="text-lg">{getFlagEmoji(fact.country)}</span>
                <span className="text-sm">{getCategoryEmoji(fact.category)}</span>
                <span className="text-sm font-medium text-gray-800 truncate">
                  {fact.title}
                </span>
                {favorites.has(fact.id) && (
                  <Heart size={14} className="text-red-500" fill="currentColor" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {favorites.size > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart size={18} className="text-red-500" />
            Favorite Facts ({favorites.size})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from(favorites).map(factId => {
              const fact = triviaFacts.find(f => f.id === factId);
              if (!fact) return null;
              return (
                <div
                  key={fact.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setCurrentFact(fact)}
                >
                  <span className="text-lg">{getFlagEmoji(fact.country)}</span>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {fact.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CultureTrivia; 