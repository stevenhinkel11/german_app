import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, X, RotateCcw } from 'lucide-react';

interface GermanNoun {
  id: string;
  word: string;
  gender: 'der' | 'die' | 'das';
  plural: string;
  english: string;
  category: string;
  difficulty: number;
}

const GenderHelper: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<GermanNoun | null>(null);
  const [selectedGender, setSelectedGender] = useState<'der' | 'die' | 'das' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const sampleWords: GermanNoun[] = [
    { id: '1', word: 'Haus', gender: 'das', plural: 'Häuser', english: 'house', category: 'buildings', difficulty: 1 },
    { id: '2', word: 'Katze', gender: 'die', plural: 'Katzen', english: 'cat', category: 'animals', difficulty: 1 },
    { id: '3', word: 'Hund', gender: 'der', plural: 'Hunde', english: 'dog', category: 'animals', difficulty: 1 },
    { id: '4', word: 'Auto', gender: 'das', plural: 'Autos', english: 'car', category: 'vehicles', difficulty: 1 },
    { id: '5', word: 'Tisch', gender: 'der', plural: 'Tische', english: 'table', category: 'furniture', difficulty: 1 },
    { id: '6', word: 'Wand', gender: 'die', plural: 'Wände', english: 'wall', category: 'buildings', difficulty: 2 },
    { id: '7', word: 'Fenster', gender: 'das', plural: 'Fenster', english: 'window', category: 'buildings', difficulty: 2 },
    { id: '8', word: 'Freundschaft', gender: 'die', plural: 'Freundschaften', english: 'friendship', category: 'abstract', difficulty: 3 },
    { id: '9', word: 'Verständnis', gender: 'das', plural: 'Verständnisse', english: 'understanding', category: 'abstract', difficulty: 3 },
    { id: '10', word: 'Bügermeister', gender: 'der', plural: 'Bügermeister', english: 'mayor', category: 'people', difficulty: 3 },
    { id: '11', word: 'Universität', gender: 'die', plural: 'Universitäten', english: 'university', category: 'education', difficulty: 2 },
    { id: '12', word: 'Mädchen', gender: 'das', plural: 'Mädchen', english: 'girl', category: 'people', difficulty: 2 },
    { id: '13', word: 'Frau', gender: 'die', plural: 'Frauen', english: 'woman', category: 'people', difficulty: 1 },
    { id: '14', word: 'Mann', gender: 'der', plural: 'Männer', english: 'man', category: 'people', difficulty: 1 },
    { id: '15', word: 'Buch', gender: 'das', plural: 'Bücher', english: 'book', category: 'objects', difficulty: 1 },
  ];

  useEffect(() => {
    getNextWord();
  }, []);

  const getNextWord = () => {
    const availableWords = sampleWords.filter(word => !usedWords.has(word.id));
    
    if (availableWords.length === 0) {
      // Reset if all words have been used
      setUsedWords(new Set());
      setCurrentWord(sampleWords[Math.floor(Math.random() * sampleWords.length)]);
    } else {
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(randomWord);
    }
    
    setSelectedGender(null);
    setShowResult(false);
  };

  const handleGenderSelect = (gender: 'der' | 'die' | 'das') => {
    setSelectedGender(gender);
    setShowResult(true);
    
    if (currentWord) {
      const isCorrect = gender === currentWord.gender;
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
      
      setUsedWords(prev => new Set(prev).add(currentWord.id));
    }
  };



  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{score.correct}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{score.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="card p-4 text-center">
          <div className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>
            {accuracy}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
      </div>

      {/* Main Practice Card */}
      {currentWord && (
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
              🎯 Gender Practice
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              ___ {currentWord.word}
            </div>
            <div className="text-lg text-gray-600 mb-2">
              {currentWord.english}
            </div>
            <div className="text-sm text-gray-500">
              Category: {currentWord.category} • Difficulty: {'⭐'.repeat(currentWord.difficulty)}
            </div>
          </div>

          {!showResult ? (
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => handleGenderSelect('der')}
                className="btn-secondary text-blue-600 border-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-bold"
              >
                der
              </button>
              <button
                onClick={() => handleGenderSelect('die')}
                className="btn-secondary text-red-600 border-red-600 hover:bg-red-50 px-8 py-3 text-lg font-bold"
              >
                die
              </button>
              <button
                onClick={() => handleGenderSelect('das')}
                className="btn-secondary text-green-600 border-green-600 hover:bg-green-50 px-8 py-3 text-lg font-bold"
              >
                das
              </button>
            </div>
          ) : (
            <div className="text-center mb-6">
              <div className={`text-3xl font-bold mb-4 ${
                selectedGender === currentWord.gender ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedGender === currentWord.gender ? (
                  <div className="flex items-center justify-center gap-2">
                    <Check size={32} />
                    Correct!
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <X size={32} />
                    Incorrect
                  </div>
                )}
              </div>
              
              <div className="text-xl mb-4">
                The correct answer is: <span className="font-bold text-blue-600">{currentWord.gender} {currentWord.word}</span>
              </div>
              
              <div className="text-sm text-gray-600 mb-6">
                Plural: <span className="font-medium">{currentWord.plural}</span>
              </div>
              
              <button
                onClick={getNextWord}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={16} />
                Next Word
              </button>
            </div>
          )}
        </div>
      )}

      {/* Gender Rules Reference */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <HelpCircle size={20} />
          Gender Rules Quick Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-blue-600 mb-2">der (masculine)</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Male people/animals</li>
              <li>• Days, months, seasons</li>
              <li>• Weather phenomena</li>
              <li>• Words ending in -er</li>
              <li>• Words ending in -ismus</li>
            </ul>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-red-600 mb-2">die (feminine)</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Female people/animals</li>
              <li>• Numbers as nouns</li>
              <li>• Words ending in -ung</li>
              <li>• Words ending in -heit, -keit</li>
              <li>• Words ending in -schaft</li>
            </ul>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-green-600 mb-2">das (neuter)</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Young people/animals</li>
              <li>• Metals, elements</li>
              <li>• Words ending in -chen</li>
              <li>• Words ending in -lein</li>
              <li>• Infinitives as nouns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderHelper; 