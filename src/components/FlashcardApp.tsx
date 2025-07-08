import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X, RefreshCw, ArrowLeftRight } from 'lucide-react';

interface Flashcard {
  id: string;
  german: string;
  english: string;
  category?: string;
  difficulty?: number;
}

interface FlashcardProgress {
  cardId: string;
  lastSeen: Date;
  status: 'got-it' | 'not-quite' | 'repeat';
  streak: number;
}

const FlashcardApp: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [dailySet, setDailySet] = useState<Flashcard[]>([]);
  const [cardsPerDay, setCardsPerDay] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('https://docs.google.com/spreadsheets/d/e/2PACX-1vRa3k9eFOlMbkJEE4SZqhFvaqtbAzR3-ecP8tBrvXJINQmr4XfWYkzZkBGvbMINOpjCi7JqU75NRNrA/pubhtml');
  const [progress, setProgress] = useState<Map<string, FlashcardProgress>>(new Map());
  const [studyDirection, setStudyDirection] = useState<'german-to-english' | 'english-to-german'>('german-to-english');
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [pasteText, setPasteText] = useState('');



  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('flashcard-progress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      const progressMap = new Map();
      Object.entries(progressData).forEach(([key, value]) => {
        progressMap.set(key, {
          ...value as FlashcardProgress,
          lastSeen: new Date((value as any).lastSeen)
        });
      });
      setProgress(progressMap);
    }

    // Load Google Sheets URL
    const savedUrl = localStorage.getItem('google-sheet-url');
    if (savedUrl) {
      setGoogleSheetUrl(savedUrl);
    }

    // Load study direction preference
    const savedDirection = localStorage.getItem('study-direction') as 'german-to-english' | 'english-to-german';
    if (savedDirection) {
      setStudyDirection(savedDirection);
    }

    // Try to load saved flashcards first, otherwise auto-load your deck
    const savedFlashcards = localStorage.getItem('saved-flashcards');
    if (savedFlashcards) {
      const cards = JSON.parse(savedFlashcards);
      setFlashcards(cards);
      generateDailySet(cards);
    } else {
      // Auto-load your Google Sheets deck on first visit
      loadFromGoogleSheets();
    }
  }, []);

  const generateDailySet = (cards: Flashcard[]) => {
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem(`daily-set-${today}`);
    
    console.log(`Generating daily set from ${cards.length} cards`);
    
    if (savedDaily) {
      console.log('Using saved daily set');
      setDailySet(JSON.parse(savedDaily));
    } else {
      // Generate new daily set
      console.log(`Creating new daily set with ${cardsPerDay} cards`);
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      let daily = shuffled.slice(0, cardsPerDay);
      
      // Add cards that were previously marked as "repeat" or "not-quite" to the daily set
      const savedProgress = localStorage.getItem('flashcard-progress');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        console.log('Progress data loaded:', progressData);
        const repeatCards = cards.filter(card => 
          progressData[card.id] && (progressData[card.id].status === 'repeat' || progressData[card.id].status === 'not-quite')
        );
        console.log(`Found ${repeatCards.length} repeat/not-quite cards in progress data`);
        
        if (repeatCards.length > 0) {
          console.log(`Adding ${repeatCards.length} previously marked repeat/not-quite cards:`, repeatCards.map(c => c.german));
                      // Add repeat/not-quite cards to the end of the daily set, avoiding duplicates
          const dailyIds = new Set(daily.map(c => c.id));
          const newRepeatCards = repeatCards.filter(card => !dailyIds.has(card.id));
          console.log(`After filtering duplicates: ${newRepeatCards.length} cards to add`);
          daily = [...daily, ...newRepeatCards];
        }
      }
      
      setDailySet(daily);
      localStorage.setItem(`daily-set-${today}`, JSON.stringify(daily));
      console.log('New daily set created:', daily.map(c => c.german).slice(0, 5));
    }
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const cards = parseCSVText(text);
        setFlashcards(cards);
        generateDailySet(cards);
        localStorage.setItem('saved-flashcards', JSON.stringify(cards));
        alert(`Successfully imported ${cards.length} words from CSV!`);
        setShowImportOptions(false);
      } catch (error) {
        alert('Error importing CSV. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const importFromPaste = () => {
    if (!pasteText.trim()) return;
    
    try {
      const cards = parseCSVText(pasteText);
      setFlashcards(cards);
      generateDailySet(cards);
      localStorage.setItem('saved-flashcards', JSON.stringify(cards));
      alert(`Successfully imported ${cards.length} words from text!`);
      setPasteText('');
      setShowImportOptions(false);
    } catch (error) {
      alert('Error importing text. Please check the format.');
    }
  };

  const parseCSVText = (text: string): Flashcard[] => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const cards: Flashcard[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const values = lines[i].split(',').map(val => val.replace(/^"|"$/g, '').trim());
      
      if (values.length >= 2 && values[0] && values[1]) {
        // Skip header row if it contains "German" or "English"
        if (i === 0 && (values[0].toLowerCase().includes('german') || values[1].toLowerCase().includes('english'))) {
          continue;
        }
        
        cards.push({
          id: (i + 1).toString(),
          german: values[0].trim(),
          english: values[1].trim(),
          category: values[2]?.trim() || 'vocabulary',
          difficulty: parseInt(values[3]) || 2
        });
      }
    }
    
    return cards;
  };

  const loadFromGoogleSheets = async () => {
    if (!googleSheetUrl) return;

    setIsLoading(true);
    try {
      // Convert Google Sheets URL to CSV export URL
      let csvUrl = googleSheetUrl;
      
      // Handle different Google Sheets URL formats
      if (googleSheetUrl.includes('/edit#gid=')) {
        csvUrl = googleSheetUrl.replace('/edit#gid=', '/export?format=csv&gid=');
      } else if (googleSheetUrl.includes('/pubhtml')) {
        // Extract sheet ID from pubhtml URL
        const sheetIdMatch = googleSheetUrl.match(/\/spreadsheets\/d\/e\/([^\/]+)\//);
        if (sheetIdMatch) {
          csvUrl = `https://docs.google.com/spreadsheets/d/e/${sheetIdMatch[1]}/pub?output=csv`;
        }
      } else if (googleSheetUrl.includes('/spreadsheets/d/')) {
        // Handle regular sheet URLs
        const sheetIdMatch = googleSheetUrl.match(/\/spreadsheets\/d\/([^\/]+)/);
        if (sheetIdMatch) {
          csvUrl = `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/export?format=csv`;
        }
      }
      
      console.log('Fetching CSV from:', csvUrl);
      const response = await fetch(csvUrl);
      const text = await response.text();
      
      // Parse CSV data with better handling
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const cards: Flashcard[] = [];
      
      for (let i = 1; i < lines.length; i++) { // Skip header row
        // Split CSV line properly, handling commas in quoted fields
        const values = lines[i].split(',').map(val => val.replace(/^"|"$/g, '').trim());
        
        if (values.length >= 2 && values[0] && values[1]) {
          // Skip the row number column if it exists
          const germanCol = values[0].match(/^\d+$/) ? 1 : 0;
          const englishCol = germanCol + 1;
          
          if (values[germanCol] && values[englishCol]) {
            cards.push({
              id: i.toString(),
              german: values[germanCol].trim(),
              english: values[englishCol].trim(),
              category: values[englishCol + 1]?.trim() || 'vocabulary',
              difficulty: parseInt(values[englishCol + 2]) || 2
            });
          }
        }
      }
      
             console.log(`Loaded ${cards.length} cards from Google Sheets`);
       
       // Clear any existing daily set to force regeneration with new words
       const today = new Date().toDateString();
       localStorage.removeItem(`daily-set-${today}`);
       
       setFlashcards(cards);
       generateDailySet(cards);
       localStorage.setItem('google-sheet-url', googleSheetUrl);
       localStorage.setItem('saved-flashcards', JSON.stringify(cards));
       
       // Show success message
       alert(`Successfully loaded ${cards.length} words from your Google Sheet!`);
    } catch (error) {
      console.error('Error loading from Google Sheets:', error);
      alert('Error loading from Google Sheets. Please check the URL and make sure the sheet is published to the web.');
    } finally {
      setIsLoading(false);
    }
  };

  const markCard = (status: 'got-it' | 'not-quite' | 'repeat') => {
    const currentCard = dailySet[currentIndex];
    if (!currentCard) return;

    const newProgress: FlashcardProgress = {
      cardId: currentCard.id,
      lastSeen: new Date(),
      status,
      streak: status === 'got-it' ? (progress.get(currentCard.id)?.streak || 0) + 1 : 0
    };

    const newProgressMap = new Map(progress);
    newProgressMap.set(currentCard.id, newProgress);
    setProgress(newProgressMap);

    // Save to localStorage
    const progressObj = Object.fromEntries(newProgressMap);
    localStorage.setItem('flashcard-progress', JSON.stringify(progressObj));

    // If card is marked as repeat, add it back to the end of the daily set
    let currentDailySet = dailySet;
    if (status === 'repeat') {
      const updatedDailySet = [...dailySet];
      updatedDailySet.push(currentCard);
      console.log(`Adding repeat card "${currentCard.german}" to end of daily set. New length: ${updatedDailySet.length}`);
      setDailySet(updatedDailySet);
      currentDailySet = updatedDailySet;
      
      // Update the saved daily set as well
      const today = new Date().toDateString();
      localStorage.setItem(`daily-set-${today}`, JSON.stringify(updatedDailySet));
    }

    // Move to next card
    console.log(`Current index: ${currentIndex}, Daily set length: ${currentDailySet.length}`);
    if (currentIndex < currentDailySet.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log(`Moving to next card at index ${nextIndex}`);
      setCurrentIndex(nextIndex);
      setShowAnswer(false);
    } else {
      // End of session
      console.log('End of session reached');
      alert('Great job! You\'ve completed today\'s flashcard session!');
    }
  };

  const toggleStudyDirection = () => {
    const newDirection = studyDirection === 'german-to-english' ? 'english-to-german' : 'german-to-english';
    setStudyDirection(newDirection);
    localStorage.setItem('study-direction', newDirection);
    setShowAnswer(false); // Reset answer visibility when changing direction
  };

  const getQuestionText = (card: Flashcard) => {
    return studyDirection === 'german-to-english' ? card.german : card.english;
  };

  const getAnswerText = (card: Flashcard) => {
    return studyDirection === 'german-to-english' ? card.english : card.german;
  };

  const currentCard = dailySet[currentIndex];
  const sessionProgress = ((currentIndex + 1) / dailySet.length) * 100;

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Flashcard Settings
          <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {studyDirection === 'german-to-english' ? '🇩🇪 → 🇺🇸' : '🇺🇸 → 🇩🇪'}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Google Sheets URL</label>
            <input
              type="url"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cards per Day</label>
            <select
              value={cardsPerDay}
              onChange={(e) => setCardsPerDay(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 cards</option>
              <option value={20}>20 cards</option>
              <option value={30}>30 cards</option>
              <option value={50}>50 cards</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={loadFromGoogleSheets}
            disabled={isLoading || !googleSheetUrl}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Reload Your Deck'}
          </button>
          <button
            onClick={() => setShowImportOptions(!showImportOptions)}
            className="btn-secondary"
          >
            📥 Import New List
          </button>
          <button
            onClick={() => {
              // Clear cached daily set and generate new one
              const today = new Date().toDateString();
              localStorage.removeItem(`daily-set-${today}`);
              generateDailySet(flashcards);
              setCurrentIndex(0);
              setShowAnswer(false);
            }}
            className="btn-secondary"
          >
            <RefreshCw size={16} className="mr-2" />
            New Daily Set
          </button>
        </div>

        {/* Import Options */}
        {showImportOptions && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">Import New Vocabulary List</h3>
            
            <div className="space-y-4">
              {/* Google Sheets */}
              <div>
                <label className="block text-sm font-medium mb-2">🔗 From Google Sheets</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    placeholder="Paste Google Sheets URL here..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={loadFromGoogleSheets}
                    disabled={isLoading || !googleSheetUrl}
                    className="btn-primary disabled:opacity-50"
                  >
                    Load
                  </button>
                </div>
              </div>

              {/* CSV Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">📄 Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={importFromCSV}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Format: German, English, Category, Difficulty</p>
              </div>

              {/* Copy/Paste */}
              <div>
                <label className="block text-sm font-medium mb-2">📋 Copy & Paste Text</label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste your vocabulary list here (one per line or CSV format):&#10;Erwarten, Expect&#10;Unbedingt, Absolutely&#10;..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={importFromPaste}
                    disabled={!pasteText.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    Import Text
                  </button>
                  <button
                    onClick={() => setShowImportOptions(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Session Progress</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {flashcards.length > 10 ? `${flashcards.length} words from Google Sheets` : 'Sample words'}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              {studyDirection === 'german-to-english' ? '🇩🇪 → 🇺🇸' : '🇺🇸 → 🇩🇪'}
            </span>
            <span className="text-sm text-gray-600">{currentIndex + 1} / {dailySet.length}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${sessionProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="card p-8">
          <div className="text-center">
            {/* Study Direction Toggle */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-lg p-1 flex items-center">
                <button
                  onClick={toggleStudyDirection}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    studyDirection === 'german-to-english'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🇩🇪 → 🇺🇸
                </button>
                <button
                  onClick={toggleStudyDirection}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeftRight size={16} />
                </button>
                <button
                  onClick={toggleStudyDirection}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    studyDirection === 'english-to-german'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🇺🇸 → 🇩🇪
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {showAnswer ? getAnswerText(currentCard) : getQuestionText(currentCard)}
              </div>
              {currentCard.category && (
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {currentCard.category}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="btn-primary mb-6"
            >
              {showAnswer 
                ? (studyDirection === 'german-to-english' ? 'Show German' : 'Show English')
                : (studyDirection === 'german-to-english' ? 'Show English' : 'Show German')
              }
            </button>

            {showAnswer && (
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => markCard('got-it')}
                  className="btn-success flex items-center gap-2"
                >
                  <Check size={16} />
                  Got it!
                </button>
                <button
                  onClick={() => markCard('not-quite')}
                  className="btn-warning flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Not quite
                </button>
                <button
                  onClick={() => markCard('repeat')}
                  className="btn-danger flex items-center gap-2"
                >
                  <X size={16} />
                  Repeat
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setShowAnswer(false);
            }
          }}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-50 flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Card {currentIndex + 1} of {dailySet.length}
        </div>

        <button
          onClick={() => {
            if (currentIndex < dailySet.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setShowAnswer(false);
            }
          }}
          disabled={currentIndex === dailySet.length - 1}
          className="btn-secondary disabled:opacity-50 flex items-center gap-2"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardApp; 