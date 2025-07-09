import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Eye, EyeOff, RefreshCw, Brain, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { enhancedWords, generateDrillsForWord, type EnhancedWord, type WordDrill } from '../data/wordDrills';

const WordOfTheDay: React.FC = () => {
  const [todaysWord, setTodaysWord] = useState<EnhancedWord | null>(null);
  const [currentDrill, setCurrentDrill] = useState<WordDrill | null>(null);
  const [availableDrills, setAvailableDrills] = useState<WordDrill[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  // Load today's word and generate drills
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
    const drills = generateDrillsForWord(word);
    setAvailableDrills(drills);
    setCurrentDrill(drills[0]);
    
    // Load stats
    const savedStats = localStorage.getItem('word-drill-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const getNewWord = () => {
    const newWord = enhancedWords[Math.floor(Math.random() * enhancedWords.length)];
    setTodaysWord(newWord);
    const drills = generateDrillsForWord(newWord);
    setAvailableDrills(drills);
    setCurrentDrill(drills[0]);
    setDrillIndex(0);
    resetDrillState();
    
    // Save new word for today
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`word-of-day-${today}`, JSON.stringify(newWord));
  };

  const resetDrillState = () => {
    setUserAnswer('');
    setSelectedOption('');
    setShowAnswer(false);
    setShowHint(false);
    setAnswerSubmitted(false);
    setIsCorrect(null);
  };

  const nextDrill = () => {
    if (drillIndex < availableDrills.length - 1) {
      setDrillIndex(drillIndex + 1);
      setCurrentDrill(availableDrills[drillIndex + 1]);
    } else {
      setDrillIndex(0);
      setCurrentDrill(availableDrills[0]);
    }
    resetDrillState();
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    if (!currentDrill) return;
    
    let answer = '';
    let userInput = '';
    
    if (currentDrill.type === 'hidden-translation' && currentDrill.options) {
      answer = currentDrill.correctAnswer;
      userInput = selectedOption;
    } else {
      answer = currentDrill.correctAnswer.toLowerCase().trim();
      userInput = userAnswer.toLowerCase().trim();
    }
    
    // More flexible answer checking for different drill types
    let correct = false;
    
    if (currentDrill.type === 'hidden-translation') {
      correct = userInput === answer;
    } else if (currentDrill.type === 'pronunciation-guess') {
      correct = userInput === todaysWord?.german.toLowerCase();
    } else if (currentDrill.type === 'grammar-usage') {
      correct = userInput === answer;
    } else if (currentDrill.type === 'word-formation') {
      correct = userInput === answer;
    } else {
      // For open-ended questions, accept if answer contains key elements
      correct = userInput.includes(answer) || answer.includes(userInput) || userInput.length > 5;
    }
    
    setIsCorrect(correct);
    setAnswerSubmitted(true);
    setShowAnswer(true);
    
    // Update stats
    const newStats = {
      correct: stats.correct + (correct ? 1 : 0),
      total: stats.total + 1
    };
    setStats(newStats);
    localStorage.setItem('word-drill-stats', JSON.stringify(newStats));
  };

  const getDrillTitle = (type: string) => {
    switch (type) {
      case 'hidden-translation': return '🔤 Translation Challenge';
      case 'new-context': return '🎯 New Context Usage';
      case 'grammar-usage': return '📚 Grammar Practice';
      case 'pronunciation-guess': return '🗣️ Pronunciation Challenge';
      case 'scenario-usage': return '🎭 Real-World Scenario';
      case 'word-formation': return '🔗 Word Family';
      default: return '📖 Drill';
    }
  };

  const renderDrillInput = () => {
    if (!currentDrill) return null;

    // Handle options-based drills
    if (currentDrill.options && ['hidden-translation', 'grammar-usage', 'word-formation'].includes(currentDrill.type)) {
      return (
        <div className="space-y-2">
          {currentDrill.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="drill-option"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={answerSubmitted}
                className="text-blue-600"
              />
              <span className={`${answerSubmitted && option === currentDrill.correctAnswer 
                ? 'text-green-600 font-semibold' 
                : answerSubmitted && option === selectedOption && isCorrect === false
                ? 'text-red-600'
                : ''}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      );
    }
    
    // Handle text input drills
    if (['new-context', 'pronunciation-guess', 'scenario-usage', 'hidden-translation', 'grammar-usage', 'word-formation'].includes(currentDrill.type)) {
      return (
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={answerSubmitted}
          placeholder={currentDrill.type === 'pronunciation-guess' 
            ? "What German word matches this pronunciation?"
            : "Type your answer here..."}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={currentDrill.type === 'pronunciation-guess' ? 1 : 3}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !answerSubmitted) {
              e.preventDefault();
              checkAnswer();
            }
          }}
        />
      );
    }
    
    return <div className="text-gray-500">Drill type not implemented</div>;
  };

  // Determine if we should hide the definition based on current drill
  const shouldHideDefinition = currentDrill?.hideDefinition && !showAnswer;

  if (!todaysWord || !currentDrill) {
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
            <p className="text-gray-600">Master German vocabulary with challenging drills</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">
              {stats.total > 0 && `${Math.round((stats.correct / stats.total) * 100)}% correct`}
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
            <div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">
                {todaysWord.gender && `${todaysWord.gender} `}{todaysWord.german}
              </h3>
              
              {/* Conditionally hide the definition during certain drills */}
              {!shouldHideDefinition && (
                <p className="text-lg text-blue-700">{todaysWord.english}</p>
              )}
              
              {shouldHideDefinition && (
                <p className="text-lg text-blue-700 italic">
                  ❓ Definition hidden for this drill
                </p>
              )}
              
              <p className="text-sm text-blue-600 mt-1">[{todaysWord.pronunciation}]</p>
            </div>
            <button
              onClick={() => speakWord(todaysWord.german)}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Volume2 size={24} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {todaysWord.type}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              Level {todaysWord.difficulty}
            </span>
          </div>

          <button
            onClick={() => setShowWordDetails(!showWordDetails)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showWordDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            {showWordDetails ? 'Hide' : 'Show'} word details
          </button>

          {showWordDetails && (
            <div className="mt-4 space-y-4">
              {/* Examples */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Examples:</h4>
                {todaysWord.examples.map((example, index) => (
                  <div key={index} className="bg-white p-3 rounded border mb-2">
                    <p className="text-gray-800">{example.sentence}</p>
                    <p className="text-gray-600 text-sm">{example.translation}</p>
                    <p className="text-blue-600 text-xs mt-1">{example.context}</p>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              {todaysWord.memoryTip && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">💡 Memory Tip:</h4>
                  <p className="text-gray-700">{todaysWord.memoryTip}</p>
                </div>
              )}
              
              {todaysWord.wordFamily && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">👨‍👩‍👧‍👦 Word Family:</h4>
                  <p className="text-gray-700">{todaysWord.wordFamily.join(', ')}</p>
                </div>
              )}

              {todaysWord.usageContexts && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Usage Contexts:</h4>
                  <p className="text-gray-700">{todaysWord.usageContexts.join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drill Section */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {getDrillTitle(currentDrill.type)}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {drillIndex + 1}/{availableDrills.length}
            </span>
            <button
              onClick={nextDrill}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Next drill"
            >
              <Brain size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Question */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">{currentDrill.question}</p>
          </div>

          {/* Input */}
          {renderDrillInput()}

          {/* Buttons */}
          <div className="flex gap-3">
            {!answerSubmitted && (
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim() && !selectedOption}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Check Answer
              </button>
            )}
            
            {currentDrill.hint && !answerSubmitted && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Lightbulb size={16} className="inline mr-2" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}

            {answerSubmitted && (
              <button
                onClick={nextDrill}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Next Drill
              </button>
            )}
          </div>

          {/* Hint */}
          {showHint && currentDrill.hint && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-yellow-800">💡 {currentDrill.hint}</p>
            </div>
          )}

          {/* Answer */}
          {showAnswer && (
            <div className={`p-4 rounded-lg border ${isCorrect 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <XCircle className="text-red-600" size={20} />
                )}
                <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </span>
              </div>
              <p className="text-gray-700">{currentDrill.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordOfTheDay; 