import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Eye, EyeOff } from 'lucide-react';

interface WordOfDay {
  id: string;
  german: string;
  english: string;
  pronunciation: string;
  gender?: string;
  type: string;
  example: string;
  exampleTranslation: string;
  difficulty: number;
  date: string;
}

const WordOfTheDay: React.FC = () => {
  const [todaysWord, setTodaysWord] = useState<WordOfDay | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [drillMode, setDrillMode] = useState<'translation' | 'example' | 'usage'>('translation');

  // Sample words for demonstration
  const sampleWords: WordOfDay[] = [
    {
      id: '1',
      german: 'verschärfen',
      english: 'to intensify, to tighten',
      pronunciation: 'fɛɐ̯ˈʃɛːɐ̯fən',
      type: 'verb',
      example: 'Die Regierung will die Gesetze verschärfen.',
      exampleTranslation: 'The government wants to tighten the laws.',
      difficulty: 4,
      date: '2024-01-15'
    },
    {
      id: '2',
      german: 'die Nachhaltigkeit',
      english: 'sustainability',
      pronunciation: 'ˈnaːxhaltɪçkaɪ̯t',
      gender: 'die',
      type: 'noun',
      example: 'Nachhaltigkeit ist wichtig für unsere Zukunft.',
      exampleTranslation: 'Sustainability is important for our future.',
      difficulty: 4,
      date: '2024-01-16'
    },
    {
      id: '3',
      german: 'beeindruckend',
      english: 'impressive',
      pronunciation: 'bəˈʔaɪ̯ndrʊkənt',
      type: 'adjective',
      example: 'Das war eine beeindruckende Leistung.',
      exampleTranslation: 'That was an impressive performance.',
      difficulty: 3,
      date: '2024-01-17'
    },
    {
      id: '4',
      german: 'sich bemühen',
      english: 'to make an effort, to try hard',
      pronunciation: 'zɪç bəˈmyːən',
      type: 'reflexive verb',
      example: 'Ich bemühe mich, pünktlich zu sein.',
      exampleTranslation: 'I make an effort to be punctual.',
      difficulty: 4,
      date: '2024-01-18'
    },
    {
      id: '5',
      german: 'die Herausforderung',
      english: 'challenge',
      pronunciation: 'ˈhɛʁaʊ̯sˌfɔʁdərʊŋ',
      gender: 'die',
      type: 'noun',
      example: 'Diese Aufgabe ist eine große Herausforderung.',
      exampleTranslation: 'This task is a big challenge.',
      difficulty: 3,
      date: '2024-01-19'
    }
  ];

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Find word for today based on date
    let wordForToday = sampleWords.find(word => word.date === today);
    
    // If no word for today, use a random one
    if (!wordForToday) {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      wordForToday = sampleWords[dayOfYear % sampleWords.length];
    }
    
    setTodaysWord(wordForToday);
  }, []);

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
  };

  const nextDrill = () => {
    setUserAnswer('');
    setShowAnswer(false);
    const modes: ('translation' | 'example' | 'usage')[] = ['translation', 'example', 'usage'];
    const currentIndex = modes.indexOf(drillMode);
    setDrillMode(modes[(currentIndex + 1) % modes.length]);
  };

  const getDrillQuestion = () => {
    if (!todaysWord) return '';
    
    switch (drillMode) {
      case 'translation':
        return `What does "${todaysWord.german}" mean in English?`;
      case 'example':
        return `Translate this sentence: "${todaysWord.example}"`;
      case 'usage':
        return `Use "${todaysWord.german}" in a sentence:`;
      default:
        return '';
    }
  };

  const getDrillAnswer = () => {
    if (!todaysWord) return '';
    
    switch (drillMode) {
      case 'translation':
        return todaysWord.english;
      case 'example':
        return todaysWord.exampleTranslation;
      case 'usage':
        return todaysWord.example;
      default:
        return '';
    }
  };

  if (!todaysWord) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">Loading today's word...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Word of the Day Card */}
      <div className="card p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
            📅 Word of the Day
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {todaysWord.german}
          </div>
          <div className="text-lg text-gray-600 mb-2">
            {todaysWord.english}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            [{todaysWord.pronunciation}]
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => speakWord(todaysWord.german)}
              className="btn-secondary flex items-center gap-2"
            >
              <Volume2 size={16} />
              Pronunciation
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-secondary flex items-center gap-2"
            >
              {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Word Info</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Type:</span> {todaysWord.type}</p>
                  {todaysWord.gender && <p><span className="font-medium">Gender:</span> {todaysWord.gender}</p>}
                  <p><span className="font-medium">Difficulty:</span> {'⭐'.repeat(todaysWord.difficulty)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Example</h3>
                <div className="space-y-2 text-sm">
                  <p className="italic">"{todaysWord.example}"</p>
                  <p>"{todaysWord.exampleTranslation}"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drilling Exercise */}
      <div className="card p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Practice Drill</h2>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
            {drillMode.charAt(0).toUpperCase() + drillMode.slice(1)} Mode
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {getDrillQuestion()}
            </h3>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={checkAnswer}
              className="btn-primary"
            >
              Check Answer
            </button>
            <button
              onClick={nextDrill}
              className="btn-secondary"
            >
              Next Drill
            </button>
          </div>

          {showAnswer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Correct Answer:</h4>
              <p className="text-green-700">{getDrillAnswer()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Streak */}
      <div className="card p-4">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Daily Streak</h3>
          <div className="text-2xl font-bold text-blue-600">🔥 7 days</div>
          <p className="text-sm text-gray-600 mt-1">Keep it up! You're doing great!</p>
        </div>
      </div>
    </div>
  );
};

export default WordOfTheDay; 