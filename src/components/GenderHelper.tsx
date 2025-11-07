import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, X, RotateCcw, Plus, BookOpen, Target, Settings, RefreshCw } from 'lucide-react';
import { germanNouns, GermanNoun } from '../data/germanNouns';

const GenderHelper: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<GermanNoun | null>(null);
  const [selectedGender, setSelectedGender] = useState<'der' | 'die' | 'das' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [progress, setProgress] = useState<Map<string, any>>(new Map());
  const [randomizedPool, setRandomizedPool] = useState<GermanNoun[]>([]);
  const [allNouns, setAllNouns] = useState<GermanNoun[]>(germanNouns);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  
  // Session management
  const [sessionLength, setSessionLength] = useState(10);
  const [sessionCounter, setSessionCounter] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showSessionSettings, setShowSessionSettings] = useState(false);

  // Look up word in Wiktionary API to determine if it's a noun and get gender
  const lookupWordInDictionary = async (word: string): Promise<{ isNoun: boolean; gender: 'der' | 'die' | 'das' | null }> => {
    const lowerWord = word.toLowerCase().trim();
    
    // Check cache first
    const cacheKey = `dict-${lowerWord}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Check learned genders first
    const learnedGenders = JSON.parse(localStorage.getItem('learned-genders') || '{}');
    if (learnedGenders[lowerWord]) {
      const result = { isNoun: true, gender: learnedGenders[lowerWord] as 'der' | 'die' | 'das' };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
    
    try {
      // Try Wiktionary API (free, no key required)
      // Format: https://en.wiktionary.org/api/rest_v1/page/definition/{word}
      const wiktionaryUrl = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
      const response = await fetch(wiktionaryUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Look for German definitions (language code: 'de')
        if (data.de && Array.isArray(data.de)) {
          for (const entry of data.de) {
            // Check if it's a noun - Wiktionary structure varies, check multiple places
            let isNoun = false;
            let gender: 'der' | 'die' | 'das' | null = null;
            
            // Method 1: Check partOfSpeech field
            if (entry.partOfSpeech) {
              const pos = entry.partOfSpeech.toLowerCase();
              isNoun = pos.includes('noun') || pos.includes('substantiv') || pos.includes('nomen');
            }
            
            // Method 2: Check in definitions/meanings
            if (!isNoun && entry.definitions) {
              for (const def of entry.definitions) {
                if (def.partOfSpeech?.toLowerCase().includes('noun') || 
                    def.tags?.some((tag: string) => tag.toLowerCase().includes('noun'))) {
                  isNoun = true;
                  break;
                }
              }
            }
            
            // Method 3: Check tags directly
            if (!isNoun && entry.tags) {
              isNoun = entry.tags.some((tag: string) => 
                tag.toLowerCase().includes('noun') || 
                tag.toLowerCase().includes('substantiv') ||
                tag.toLowerCase().includes('nomen')
              );
            }
            
            // Method 4: Check if word appears with article in definitions
            const fullText = JSON.stringify(entry).toLowerCase();
            if (!isNoun) {
              // Look for patterns like "der/die/das [word]" which indicates a noun
              const articlePattern = /(der|die|das)\s+[a-zäöüß]+/i;
              if (articlePattern.test(fullText)) {
                isNoun = true;
              }
            }
            
            if (isNoun) {
              // Extract gender - try multiple methods
              
              // Method 1: Check tags for gender
              if (entry.tags) {
                for (const tag of entry.tags) {
                  const lowerTag = tag.toLowerCase();
                  if (lowerTag === 'masculine' || lowerTag === 'm' || lowerTag.includes('masculine')) {
                    gender = 'der';
                    break;
                  } else if (lowerTag === 'feminine' || lowerTag === 'f' || lowerTag.includes('feminine')) {
                    gender = 'die';
                    break;
                  } else if (lowerTag === 'neuter' || lowerTag === 'n' || lowerTag.includes('neuter')) {
                    gender = 'das';
                    break;
                  }
                }
              }
              
              // Method 2: Check forms array
              if (!gender && entry.forms) {
                for (const form of entry.forms) {
                  if (form.form === 'der' || form.tags?.some((t: string) => t.toLowerCase().includes('masculine'))) {
                    gender = 'der';
                    break;
                  } else if (form.form === 'die' || form.tags?.some((t: string) => t.toLowerCase().includes('feminine'))) {
                    gender = 'die';
                    break;
                  } else if (form.form === 'das' || form.tags?.some((t: string) => t.toLowerCase().includes('neuter'))) {
                    gender = 'das';
                    break;
                  }
                }
              }
              
              // Method 3: Search in full text for article patterns
              if (!gender) {
                const derMatch = fullText.match(/\bder\s+[a-zäöüß]+\b/i);
                const dieMatch = fullText.match(/\bdie\s+[a-zäöüß]+\b/i);
                const dasMatch = fullText.match(/\bdas\s+[a-zäöüß]+\b/i);
                
                // Prefer exact matches with the word
                if (derMatch && derMatch[0].toLowerCase().includes(lowerWord)) gender = 'der';
                else if (dieMatch && dieMatch[0].toLowerCase().includes(lowerWord)) gender = 'die';
                else if (dasMatch && dasMatch[0].toLowerCase().includes(lowerWord)) gender = 'das';
                // Fallback to any article found
                else if (derMatch) gender = 'der';
                else if (dieMatch) gender = 'die';
                else if (dasMatch) gender = 'das';
              }
              
              // Method 4: Check in definitions text
              if (!gender && entry.definitions) {
                for (const def of entry.definitions) {
                  const defText = JSON.stringify(def).toLowerCase();
                  if (defText.includes(`"der ${lowerWord}`) || defText.includes(`(der ${lowerWord}`)) {
                    gender = 'der';
                    break;
                  } else if (defText.includes(`"die ${lowerWord}`) || defText.includes(`(die ${lowerWord}`)) {
                    gender = 'die';
                    break;
                  } else if (defText.includes(`"das ${lowerWord}`) || defText.includes(`(das ${lowerWord}`)) {
                    gender = 'das';
                    break;
                  }
                }
              }
              
              const result = { isNoun: true, gender };
              localStorage.setItem(cacheKey, JSON.stringify(result));
              return result;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error looking up word "${word}" in dictionary:`, error);
    }
    
    // Fallback: Try alternative API (Dict.cc style lookup via a proxy or alternative service)
    // For now, return unknown - we'll handle this in the calling function
    const result = { isNoun: false, gender: null as 'der' | 'die' | 'das' | null };
    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  };

  // Load words from Google Sheets and convert to GermanNoun format
  const loadWordsFromSheets = async () => {
    const googleSheetUrl = localStorage.getItem('google-sheet-url') || 
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRa3k9eFOlMbkJEE4SZqhFvaqtbAzR3-ecP8tBrvXJINQmr4XfWYkzZkBGvbMINOpjCi7JqU75NRNrA/pubhtml';
    
    if (!googleSheetUrl) {
      setAllNouns(germanNouns);
      return;
    }

    try {
      // Convert Google Sheets URL to CSV export URL
      let csvUrl = googleSheetUrl;
      
      if (googleSheetUrl.includes('/edit#gid=')) {
        csvUrl = googleSheetUrl.replace('/edit#gid=', '/export?format=csv&gid=');
      } else if (googleSheetUrl.includes('/pubhtml')) {
        const sheetIdMatch = googleSheetUrl.match(/\/spreadsheets\/d\/e\/([^\/]+)\//);
        if (sheetIdMatch) {
          csvUrl = `https://docs.google.com/spreadsheets/d/e/${sheetIdMatch[1]}/pub?output=csv`;
        }
      } else if (googleSheetUrl.includes('/spreadsheets/d/')) {
        const sheetIdMatch = googleSheetUrl.match(/\/spreadsheets\/d\/([^\/]+)/);
        if (sheetIdMatch) {
          csvUrl = `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/export?format=csv`;
        }
      }
      
      const response = await fetch(csvUrl);
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const sheetNouns: GermanNoun[] = [];
      const wordsToProcess: Array<{word: string; english: string; category: string; difficulty: number; index: number}> = [];
      
      // First pass: collect all potential words (case-insensitive, no space filter)
      for (let i = 1; i < lines.length; i++) { // Skip header
        const values = lines[i].split(',').map(val => val.replace(/^"|"$/g, '').trim());
        
        if (values.length >= 2 && values[0] && values[1]) {
          const germanCol = values[0].match(/^\d+$/) ? 1 : 0;
          const englishCol = germanCol + 1;
          
          if (values[germanCol] && values[englishCol]) {
            const germanWord = values[germanCol].trim();
            const englishWord = values[englishCol].trim();
            
            // Process all words, not just capitalized ones (user might not capitalize properly)
            // Skip only if it has spaces (likely a phrase, not a single noun)
            if (!germanWord.includes(' ') && germanWord.length > 1) {
              wordsToProcess.push({
                word: germanWord,
                english: englishWord,
                category: values[englishCol + 1]?.trim() || 'vocabulary',
                difficulty: parseInt(values[englishCol + 2]) || 2,
                index: i
              });
            }
          }
        }
      }
      
      // Second pass: Look up each word in dictionary API (with rate limiting)
      console.log(`Processing ${wordsToProcess.length} words from Google Sheets...`);
      setIsLoadingWords(true);
      setLoadingProgress({ current: 0, total: wordsToProcess.length });
      
      for (let i = 0; i < wordsToProcess.length; i++) {
        const { word, english, category, difficulty, index } = wordsToProcess[i];
        
        setLoadingProgress({ current: i + 1, total: wordsToProcess.length });
        
        // Rate limiting: add small delay between API calls to avoid overwhelming the service
        if (i > 0 && i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay every 5 words
        }
        
        // Look up word in dictionary
        const lookupResult = await lookupWordInDictionary(word);
        
        // Only add if it's identified as a noun
        if (lookupResult.isNoun) {
          // Capitalize the word properly (German nouns should be capitalized)
          const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          
          // Use detected gender, or fallback to 'die' if unknown
          const gender = lookupResult.gender || 'die';
          
          // Generate plural (basic rules - could be improved with API data)
          let plural = capitalizedWord + 'e'; // Default plural
          const lowerWord = capitalizedWord.toLowerCase();
          if (lowerWord.endsWith('e')) {
            plural = capitalizedWord + 'n';
          } else if (lowerWord.endsWith('er') || lowerWord.endsWith('el') || lowerWord.endsWith('en')) {
            plural = capitalizedWord; // No change
          } else if (lowerWord.endsWith('um')) {
            plural = capitalizedWord.replace(/um$/i, 'en');
          } else if (lowerWord.endsWith('chen') || lowerWord.endsWith('lein')) {
            plural = capitalizedWord; // Diminutives don't change
          }
          
          sheetNouns.push({
            id: `sheet-${index}`,
            word: capitalizedWord,
            gender: gender,
            plural: plural,
            english: english,
            category: category,
            difficulty: difficulty
          });
          
          console.log(`✓ Found noun: ${capitalizedWord} (${gender})`);
        } else {
          console.log(`✗ Skipped (not a noun): ${word}`);
        }
      }
      
      console.log(`Loaded ${sheetNouns.length} nouns from Google Sheets`);
      
      // Combine with static nouns (avoid duplicates)
      const combinedNouns = [...germanNouns];
      sheetNouns.forEach(noun => {
        if (!combinedNouns.find(n => n.word.toLowerCase() === noun.word.toLowerCase())) {
          combinedNouns.push(noun);
        }
      });
      
      setAllNouns(combinedNouns);
      setIsLoadingWords(false);
    } catch (error) {
      console.error('Error loading words from Google Sheets:', error);
      setAllNouns(germanNouns);
      setIsLoadingWords(false);
    }
  };

  useEffect(() => {
    // Load words from Google Sheets first
    loadWordsFromSheets();
    
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('flashcard-progress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      const progressMap = new Map();
      Object.entries(progressData).forEach(([key, value]) => {
        progressMap.set(key, {
          ...value as any,
          lastSeen: new Date((value as any).lastSeen)
        });
      });
      setProgress(progressMap);
    }

    // Load session length preference
    const savedSessionLength = localStorage.getItem('gender-session-length');
    if (savedSessionLength) {
      setSessionLength(parseInt(savedSessionLength));
    }
  }, []);

  // Create randomized pool when allNouns changes
  useEffect(() => {
    if (allNouns.length > 0) {
      createRandomizedPool();
      if (!currentWord) {
        getNextWord();
      }
    }
  }, [allNouns]);

  const createRandomizedPool = () => {
    // Create multiple shuffled copies for better randomization
    let pool: GermanNoun[] = [];
    
    // Add words multiple times based on difficulty (easier words appear less often)
    allNouns.forEach(word => {
      const frequency = word.difficulty === 1 ? 1 : word.difficulty === 2 ? 2 : 3;
      for (let i = 0; i < frequency; i++) {
        pool.push(word);
      }
    });
    
    // Apply Fisher-Yates shuffle multiple times for maximum randomness
    for (let shuffleCount = 0; shuffleCount < 3; shuffleCount++) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }
    
    setRandomizedPool(pool);
  };

  const getNextWord = () => {
    if (sessionComplete) return;
    
    if (randomizedPool.length === 0) {
      createRandomizedPool();
      return;
    }

    // Priority 1: Words marked as "repeat" or "not-quite" from previous sessions
    const priorityWords = randomizedPool.filter(word => {
      const wordProgress = progress.get(word.id);
      return wordProgress && (wordProgress.status === 'repeat' || wordProgress.status === 'not-quite') && !usedWords.has(word.id);
    });

    // Priority 2: Words never seen before
    const newWords = randomizedPool.filter(word => !progress.has(word.id) && !usedWords.has(word.id));

    // Priority 3: All other available words
    const otherWords = randomizedPool.filter(word => !usedWords.has(word.id));

    let availableWords: GermanNoun[];
    
    // Select from priority words first, then new words, then others
    if (priorityWords.length > 0) {
      availableWords = priorityWords;
      console.log(`🎯 Prioritizing ${priorityWords.length} words marked for review`);
    } else if (newWords.length > 0) {
      availableWords = newWords;
      console.log(`📚 Selecting from ${newWords.length} new words`);
    } else {
      availableWords = otherWords;
      console.log(`🔄 Selecting from ${otherWords.length} other words`);
    }
    
    // If we've used most words, reset the session
    if (availableWords.length === 0) {
      if (usedWords.size < allNouns.length * 0.3) {
        // Fallback: create new randomized pool
        createRandomizedPool();
        setUsedWords(new Set());
        availableWords = randomizedPool;
      } else {
        // Reset used words periodically for better variety
        setUsedWords(new Set());
        availableWords = randomizedPool;
      }
    }
    
    // Advanced randomization: use timestamp + multiple random factors
    const timeBasedSeed = Date.now() % availableWords.length;
    const randomFactor = Math.floor(Math.random() * availableWords.length);
    const mathRandomFactor = Math.floor(Math.random() * availableWords.length);
    
    const combinedIndex = (timeBasedSeed + randomFactor + mathRandomFactor) % availableWords.length;
    const selectedWord = availableWords[combinedIndex];
    
    setCurrentWord(selectedWord);
    setSelectedGender(null);
    setShowResult(false);
  };

  const handleGenderSelect = (gender: 'der' | 'die' | 'das') => {
    setSelectedGender(gender);
    setShowResult(true);
    
    if (currentWord) {
      const isCorrect = gender === currentWord.gender;
      
      // Save the correct gender to learned genders (especially if user got it wrong)
      // This helps improve future automatic detection
      const learnedGenders = JSON.parse(localStorage.getItem('learned-genders') || '{}');
      learnedGenders[currentWord.word.toLowerCase()] = currentWord.gender;
      localStorage.setItem('learned-genders', JSON.stringify(learnedGenders));
      
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
      
      setUsedWords(prev => new Set(prev).add(currentWord.id));
      
      // Update session counter
      const newSessionCounter = sessionCounter + 1;
      setSessionCounter(newSessionCounter);
      
      // Check if session is complete
      if (newSessionCounter >= sessionLength) {
        setSessionComplete(true);
      }
    }
  };

  const markProgress = (status: 'got-it' | 'not-quite' | 'repeat') => {
    if (!currentWord) return;

    const newProgress = {
      cardId: currentWord.id,
      lastSeen: new Date(),
      status,
      streak: status === 'got-it' ? (progress.get(currentWord.id)?.streak || 0) + 1 : 0
    };

    const newProgressMap = new Map(progress);
    newProgressMap.set(currentWord.id, newProgress);
    setProgress(newProgressMap);

    // Save to localStorage (same system as flashcards)
    const progressObj = Object.fromEntries(newProgressMap);
    localStorage.setItem('flashcard-progress', JSON.stringify(progressObj));

    console.log(`Marked "${currentWord.word}" as: ${status}`);
    
    // Handle "repeat" - add word back to current session
    if (status === 'repeat') {
      // Remove from used words so it can appear again in this session
      setUsedWords(prev => {
        const newUsedWords = new Set(prev);
        newUsedWords.delete(currentWord.id);
        return newUsedWords;
      });
      
      // Decrease session counter since we're repeating this word
      setSessionCounter(prev => Math.max(0, prev - 1));
      
      console.log(`🔄 Added "${currentWord.word}" back to current session for repeat practice`);
    }
    
    // Move to next word after a brief delay
    setTimeout(() => {
      getNextWord();
    }, 500);
  };

  const startNewSession = () => {
    setSessionCounter(0);
    setSessionComplete(false);
    setScore({ correct: 0, total: 0 });
    setUsedWords(new Set());
    createRandomizedPool();
    getNextWord();
  };

  const updateSessionLength = (newLength: number) => {
    setSessionLength(newLength);
    localStorage.setItem('gender-session-length', newLength.toString());
    setShowSessionSettings(false);
  };

  const addToFlashcards = () => {
    if (!currentWord) return;
    
    // Get existing flashcards from localStorage
    const savedFlashcards = localStorage.getItem('saved-flashcards');
    const existingCards = savedFlashcards ? JSON.parse(savedFlashcards) : [];
    
    // Check if word already exists in flashcards
    const wordExists = existingCards.some((card: any) => 
      card.german.toLowerCase() === currentWord.word.toLowerCase()
    );
    
    if (wordExists) {
      alert('This word is already in your flashcard deck!');
      return;
    }
    
    // Create new flashcard entry
    const newFlashcard = {
      id: `gender-${currentWord.id}`,
      german: `${currentWord.gender} ${currentWord.word}`,
      english: currentWord.english,
      category: currentWord.category,
      difficulty: currentWord.difficulty
    };
    
    // Add to existing flashcards
    const updatedFlashcards = [...existingCards, newFlashcard];
    localStorage.setItem('saved-flashcards', JSON.stringify(updatedFlashcards));
    
    // Show success message
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2000);
    
    console.log(`Added "${currentWord.gender} ${currentWord.word}" to flashcards!`);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Loading Indicator */}
      {isLoadingWords && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <RefreshCw size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Processing words from Google Sheets...
              </p>
              <p className="text-xs text-blue-600">
                Looking up {loadingProgress.current} of {loadingProgress.total} words in dictionary
              </p>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header Info */}
      <div className="card p-4 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">Gender Practice Database</h3>
              <p className="text-sm text-purple-600">
                {allNouns.length} German nouns available • Smart word prioritization • Progress tracking
              </p>
              <button
                onClick={() => {
                  createRandomizedPool();
                  getNextWord();
                }}
                className="text-xs text-purple-600 hover:text-purple-800 underline mt-1"
              >
                🔄 Refresh word pool and reset priorities
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-purple-600">Session Length</div>
              <div className="text-xl font-bold text-purple-800 flex items-center gap-2">
                {sessionLength} words
                <button
                  onClick={() => setShowSessionSettings(!showSessionSettings)}
                  className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                  title="Change session length"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-600">Total Words</div>
              <div className="text-2xl font-bold text-purple-800">{germanNouns.length}</div>
            </div>
          </div>
        </div>
        
        {/* Session Settings Dropdown */}
        {showSessionSettings && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">Choose Session Length</h4>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 50].map(length => (
                <button
                  key={length}
                  onClick={() => updateSessionLength(length)}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    sessionLength === length 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  {length} words
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Session Progress */}
      <div className="card p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Target size={20} className="text-blue-600" />
            </div>
            <div>
                             <h3 className="font-semibold text-blue-800">Current Session</h3>
               <p className="text-sm text-blue-600">
                 {sessionComplete 
                   ? `Session complete! You practiced ${sessionLength} words.`
                   : `Progress: ${sessionCounter}/${sessionLength} words • Smart prioritization active`
                 }
               </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-blue-600">Progress</div>
              <div className="text-2xl font-bold text-blue-800">
                {Math.round((sessionCounter / sessionLength) * 100)}%
              </div>
            </div>
            {sessionComplete && (
              <button
                onClick={startNewSession}
                className="btn-primary flex items-center gap-2"
              >
                <Target size={16} />
                New Session
              </button>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(sessionCounter / sessionLength) * 100}%` }}
            />
          </div>
        </div>
      </div>

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

      {/* Session Complete Message */}
      {sessionComplete && (
        <div className="card p-6 text-center bg-green-50 border-green-200">
          <div className="text-3xl font-bold text-green-800 mb-4">
            🎉 Session Complete!
          </div>
                     <div className="text-lg text-green-700 mb-4">
             You practiced {sessionLength} words and got {score.correct} correct ({accuracy}% accuracy)
           </div>
           <div className="text-sm text-green-600 mb-4">
             💡 Your next session will prioritize words you marked as "Not quite" or "Repeat" for focused practice
           </div>
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={startNewSession}
                className="btn-primary flex items-center gap-2"
              >
                <Target size={16} />
                Start New Session
              </button>
              <button
                onClick={() => setShowSessionSettings(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Settings size={16} />
                Change Session Length
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Practice Card */}
      {currentWord && !sessionComplete && (
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
              🎯 Gender Practice • {sessionCounter + 1}/{sessionLength}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              ___ {currentWord.word}
            </div>
            <div className="text-lg text-gray-600 mb-2">
              {currentWord.english}
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center gap-4">
              <span>Category: {currentWord.category}</span>
              <span>Difficulty: {'⭐'.repeat(currentWord.difficulty)}</span>
              {progress.get(currentWord.id) && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  progress.get(currentWord.id).status === 'got-it' ? 'bg-green-100 text-green-700' :
                  progress.get(currentWord.id).status === 'not-quite' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {progress.get(currentWord.id).status === 'got-it' ? '✓ Know it' :
                   progress.get(currentWord.id).status === 'not-quite' ? '~ Learning' :
                   '⚠ Need practice'}
                </span>
              )}
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
              
              {/* Progress Tracking Buttons */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-3 text-center">
                  How well do you know this word?
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  <button
                    onClick={() => markProgress('got-it')}
                    className="btn-success flex items-center gap-2"
                  >
                    <Check size={16} />
                    Got it!
                  </button>
                  <button
                    onClick={() => markProgress('not-quite')}
                    className="btn-warning flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Not quite
                  </button>
                  <button
                    onClick={() => markProgress('repeat')}
                    className="btn-danger flex items-center gap-2"
                  >
                    <X size={16} />
                    Repeat
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={getNextWord}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  {sessionCounter + 1 >= sessionLength ? 'Complete Session' : 'Next Word'}
                </button>
                
                <button
                  onClick={addToFlashcards}
                  className="btn-secondary flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Plus size={16} />
                  Add to Flashcards
                </button>
              </div>
              
              {showAddSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Check size={16} />
                    Added to your flashcard deck!
                  </div>
                </div>
              )}
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