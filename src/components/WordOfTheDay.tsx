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
  const [drillMode, setDrillMode] = useState<'translation' | 'example' | 'usage'>('translation');
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  // Word of the Day database
  const words: WordOfDay[] = [
    {
      id: '1',
      german: 'verschärfen',
      english: 'to intensify',
      pronunciation: 'fɛʁˈʃɛʁfən',
      type: 'verb',
      example: 'Die Sicherheitsmaßnahmen wurden verschärft.',
      exampleTranslation: 'The security measures were intensified.',
      difficulty: 3,
      date: '2024-01-08'
    },
    {
      id: '2',
      german: 'Nachhaltigkeit',
      english: 'sustainability',
      pronunciation: 'ˈnaːxhaltɪçkaɪt',
      gender: 'die',
      type: 'noun',
      example: 'Nachhaltigkeit ist ein wichtiges Thema.',
      exampleTranslation: 'Sustainability is an important topic.',
      difficulty: 3,
      date: '2024-01-09'
    },
    {
      id: '3',
      german: 'beeindruckend',
      english: 'impressive',
      pronunciation: 'bəˈʔaɪndrʊkənt',
      type: 'adjective',
      example: 'Das war eine beeindruckende Leistung.',
      exampleTranslation: 'That was an impressive performance.',
      difficulty: 2,
      date: '2024-01-10'
    },
    {
      id: '4',
      german: 'sich bemühen',
      english: 'to make an effort',
      pronunciation: 'zɪç bəˈmyːən',
      type: 'reflexive verb',
      example: 'Ich bemühe mich, pünktlich zu sein.',
      exampleTranslation: 'I make an effort to be on time.',
      difficulty: 3,
      date: '2024-01-11'
    },
    {
      id: '5',
      german: 'Herausforderung',
      english: 'challenge',
      pronunciation: 'hɛˈʁaʊsfɔʁdəʁʊŋ',
      gender: 'die',
      type: 'noun',
      example: 'Das ist eine große Herausforderung.',
      exampleTranslation: 'This is a big challenge.',
      difficulty: 2,
      date: '2024-01-12'
    }
  ];

  useEffect(() => {
    // Get today's word (cycling through the list)
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const wordIndex = dayOfYear % words.length;
    setTodaysWord(words[wordIndex]);
  }, []);

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
  };

  const nextDrill = () => {
    const modes: ('translation' | 'example' | 'usage')[] = ['translation', 'example', 'usage'];
    const currentIndex = modes.indexOf(drillMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setDrillMode(modes[nextIndex]);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const getDrillQuestion = () => {
    if (!todaysWord) return '';
    
    switch (drillMode) {
      case 'translation':
        return `What does "${todaysWord.german}" mean in English?`;
      case 'example':
        return `Translate this sentence: "${todaysWord.example}"`;
      case 'usage':
        return `Use "${todaysWord.german}" in a German sentence:`;
      default:
        return '';
    }
  };

  const generateDynamicTranslation = (word: WordOfDay): string => {
    const baseTranslation = word.english;
    const alternatives = generateTranslationAlternatives(word);
    const contextualNote = getContextualNote(word);
    
    return `${baseTranslation}\n\n💡 Alternative meanings: ${alternatives}\n\n📝 Usage note: ${contextualNote}`;
  };

  const generateDynamicExampleAnswer = (word: WordOfDay): string => {
    const baseTranslation = word.exampleTranslation;
    const breakdown = breakdownSentence(word.example, word.exampleTranslation);
    const similarExamples = generateSimilarExamples(word);
    
    return `${baseTranslation}\n\n🔍 Word breakdown:\n${breakdown}\n\n📚 Similar examples:\n${similarExamples}`;
  };

  const generateDynamicUsageAnswer = (word: WordOfDay): string => {
    const baseExample = word.example;
    const variations = generateUsageVariations(word);
    const grammarTip = getGrammarTip(word);
    
    return `${baseExample}\n\n🔄 Variations:\n${variations}\n\n📖 Grammar tip: ${grammarTip}`;
  };

  const generateTranslationAlternatives = (word: WordOfDay): string => {
    const alternatives: { [key: string]: string[] } = {
      'verschärfen': ['to intensify', 'to sharpen', 'to tighten up', 'to make stricter'],
      'Nachhaltigkeit': ['sustainability', 'durability', 'long-term viability'],
      'beeindruckend': ['impressive', 'striking', 'remarkable', 'awe-inspiring'],
      'sich bemühen': ['to make an effort', 'to strive', 'to endeavor', 'to try hard'],
      'Herausforderung': ['challenge', 'test', 'difficulty', 'hurdle']
    };
    
    const alts = alternatives[word.german] || [word.english, 'various contexts apply'];
    return alts.slice(1).join(', ');
  };

  const getContextualNote = (word: WordOfDay): string => {
    const notes: { [key: string]: string } = {
      'verschärfen': 'Often used in formal contexts like laws, regulations, or policies',
      'Nachhaltigkeit': 'A key concept in German environmental and business discourse',
      'beeindruckend': 'Can describe anything from performances to achievements',
      'sich bemühen': 'Reflexive verb - always use "sich" with the appropriate pronoun',
      'Herausforderung': 'Can be positive (opportunity) or negative (obstacle)'
    };
    
    return notes[word.german] || 'Consider the context and register when using this word';
  };

  const breakdownSentence = (german: string, english: string): string => {
    // Simple breakdown - in a real app, you might use a more sophisticated parser
    const words = german.split(' ');
    const englishWords = english.split(' ');
    
    if (words.length <= 3) {
      return words.map((word, _) => `"${word}" - part of "${englishWords.slice(0, 2).join(' ')}"`).join('\n');
    }
    
    return `Key parts: "${words[0]}" (${englishWords[0]}), main concept: "${words.find(w => w.includes(todaysWord!.german.split(' ')[0]))}"`;
  };

  const generateSimilarExamples = (word: WordOfDay): string => {
    const examples: { [key: string]: string[] } = {
      'verschärfen': [
        'Die Sicherheit wurde verschärft. - Security was tightened.',
        'Wir müssen die Kontrollen verschärfen. - We need to intensify the controls.'
      ],
      'Nachhaltigkeit': [
        'Nachhaltigkeit ist unser Ziel. - Sustainability is our goal.',
        'Die Nachhaltigkeit des Projekts ist wichtig. - The sustainability of the project is important.'
      ],
      'beeindruckend': [
        'Das Ergebnis war beeindruckend. - The result was impressive.',
        'Sie hat eine beeindruckende Leistung gezeigt. - She showed an impressive performance.'
      ]
    };
    
    const similar = examples[word.german] || [
      `Das ist sehr ${word.german}. - That is very ${word.english}.`,
      `Ein ${word.german} Beispiel. - A ${word.english} example.`
    ];
    
    return similar.join('\n');
  };

  const generateUsageVariations = (word: WordOfDay): string => {
    const variations: { [key: string]: string[] } = {
      'verschärfen': [
        'verschärft (past participle) - "Die verschärften Regeln"',
        'Verschärfung (noun) - "Die Verschärfung der Lage"'
      ],
      'sich bemühen': [
        'ich bemühe mich - I make an effort',
        'er/sie bemüht sich - he/she makes an effort',
        'wir bemühen uns - we make an effort'
      ],
      'Herausforderung': [
        'eine große Herausforderung - a big challenge',
        'Herausforderungen annehmen - to accept challenges'
      ]
    };
    
    return variations[word.german]?.join('\n') || 'Try using this word in different sentence positions';
  };

  const getGrammarTip = (word: WordOfDay): string => {
    if (word.type === 'verb') {
      return 'Remember German verb conjugations change based on the subject';
    }
    if (word.type === 'noun' && word.gender) {
      return `This is a ${word.gender} noun - use appropriate articles and adjective endings`;
    }
    if (word.type === 'reflexive verb') {
      return 'Reflexive verbs always need the reflexive pronoun (mich, dich, sich, etc.)';
    }
    return 'Pay attention to word order in German sentences';
  };

  const getDrillAnswer = () => {
    if (!todaysWord) return '';
    
    switch (drillMode) {
      case 'translation':
        return generateDynamicTranslation(todaysWord);
      case 'example':
        return generateDynamicExampleAnswer(todaysWord);
      case 'usage':
        return generateDynamicUsageAnswer(todaysWord);
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
              <p className="text-green-700 whitespace-pre-line">{getDrillAnswer()}</p>
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