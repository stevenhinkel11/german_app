import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Eye, EyeOff, RefreshCw, Calendar } from 'lucide-react';
import { enhancedWords, type EnhancedWord } from '../data/words';

const WordOfTheDay: React.FC = () => {
  const [todaysWord, setTodaysWord] = useState<EnhancedWord | null>(null);
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [wordHistory, setWordHistory] = useState<EnhancedWord[]>([]);

  // Load today's word
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedWord = localStorage.getItem(`word-of-day-${today}`);
    
    let word: EnhancedWord;
    if (savedWord) {
      word = JSON.parse(savedWord);
    } else {
      // Select a random word for today
      word = enhancedWords[Math.floor(Math.random() * enhancedWords.length)];
      localStorage.setItem(`word-of-day-${today}`, JSON.stringify(word));
    }
    
    setTodaysWord(word);
    
    // Load word history
    const savedHistory = localStorage.getItem('word-history');
    if (savedHistory) {
      setWordHistory(JSON.parse(savedHistory));
    }
  }, []);

  const getNewWord = () => {
    const newWord = enhancedWords[Math.floor(Math.random() * enhancedWords.length)];
    setTodaysWord(newWord);
    
    // Update history
    const newHistory = [newWord, ...wordHistory].slice(0, 10); // Keep last 10 words
    setWordHistory(newHistory);
    localStorage.setItem('word-history', JSON.stringify(newHistory));
    
    // Save new word for today
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`word-of-day-${today}`, JSON.stringify(newWord));
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!todaysWord) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">Loading word of the day...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Word of the Day</h2>
            <p className="text-gray-600">Learn a new German word every day</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">
              {enhancedWords.length} words available
            </div>
            <button
              onClick={getNewWord}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="New word"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Today's Word */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-4xl font-bold text-blue-900 mb-3">
                {todaysWord.gender && `${todaysWord.gender} `}{todaysWord.german}
              </h3>
              <p className="text-xl text-blue-700 mb-2">{todaysWord.english}</p>
              <p className="text-sm text-blue-600">[{todaysWord.pronunciation}]</p>
            </div>
            <button
              onClick={() => speakWord(todaysWord.german)}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Pronounce word"
            >
              <Volume2 size={24} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {todaysWord.type}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              Level {todaysWord.difficulty}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <Calendar size={12} />
              Today's Word
            </span>
          </div>

          {/* Memory Tip */}
          {todaysWord.memoryTip && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
              <p className="text-yellow-800">💡 <strong>Memory Tip:</strong> {todaysWord.memoryTip}</p>
            </div>
          )}
        </div>
      </div>

      {/* Examples Section */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Examples in Context</h3>
        <div className="space-y-4">
          {todaysWord.examples.map((example, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-800 font-medium text-lg">{example.sentence}</p>
                <button
                  onClick={() => speakWord(example.sentence)}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Pronounce sentence"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-gray-600 mb-2">{example.translation}</p>
              <p className="text-blue-600 text-sm italic">{example.context}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Word Details */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">📖 Word Details</h3>
          <button
            onClick={() => setShowWordDetails(!showWordDetails)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showWordDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            {showWordDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {showWordDetails && (
          <div className="space-y-4">
            {/* Word Family */}
            {todaysWord.wordFamily && todaysWord.wordFamily.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">👨‍👩‍👧‍👦 Word Family</h4>
                <div className="flex flex-wrap gap-2">
                  {todaysWord.wordFamily.map((word, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {todaysWord.synonyms && todaysWord.synonyms.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🔄 Synonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {todaysWord.synonyms.map((synonym, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Contexts */}
            {todaysWord.usageContexts && todaysWord.usageContexts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🎯 Common Usage</h4>
                <div className="flex flex-wrap gap-2">
                  {todaysWord.usageContexts.map((context, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {context}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes */}
            {todaysWord.commonMistakes && todaysWord.commonMistakes.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Common Mistakes</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {todaysWord.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-gray-700">{mistake}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conjugations for verbs */}
            {todaysWord.conjugations && todaysWord.conjugations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🔀 Conjugations</h4>
                <div className="grid grid-cols-2 gap-2">
                  {todaysWord.conjugations.map((conj, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded">
                      <span className="font-medium text-gray-800">{conj.form}</span>
                      <span className="text-gray-600 text-sm block">{conj.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Words */}
      {wordHistory.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🕐 Recent Words</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {wordHistory.slice(0, 6).map((word, index) => (
              <div 
                key={`${word.id}-${index}`} 
                className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setTodaysWord(word)}
              >
                <div className="font-medium text-gray-800">
                  {word.gender && `${word.gender} `}{word.german}
                </div>
                <div className="text-sm text-gray-600">{word.english}</div>
                <div className="text-xs text-gray-500 mt-1">{word.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordOfTheDay; 