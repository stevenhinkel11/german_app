import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Eye, EyeOff, RefreshCw, Brain } from 'lucide-react';

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
  const [allWords, setAllWords] = useState<WordOfDay[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'success' | 'fallback'>('idle');

  // Hugging Face API integration
  const generateAIResponse = async (prompt: string): Promise<string> => {
    try {
      setIsGeneratingAnswer(true);
      setAiStatus('loading');
      
      // Try multiple models in order of preference
      const models = [
        'google/flan-t5-large',
        'microsoft/DialoGPT-medium',
        'gpt2'
      ];
      
      for (const model of models) {
        try {
          const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                inputs: prompt,
                parameters: {
                  max_length: 300,
                  temperature: 0.7,
                  do_sample: true,
                  top_p: 0.9,
                  repetition_penalty: 1.1,
                },
              }),
            }
          );

          if (!response.ok) {
            if (response.status === 503) {
              console.log(`Model ${model} is loading, trying next...`);
              continue;
            }
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          console.log('AI Response:', data);
          
          // Handle different response formats
          if (Array.isArray(data) && data[0]?.generated_text) {
            const generated = data[0].generated_text;
            const cleanedResponse = generated.replace(prompt, '').trim();
            if (cleanedResponse.length > 10) {
              setAiStatus('success');
              return cleanedResponse;
            }
          } else if (data.generated_text) {
            const generated = data.generated_text;
            const cleanedResponse = generated.replace(prompt, '').trim();
            if (cleanedResponse.length > 10) {
              setAiStatus('success');
              return cleanedResponse;
            }
          } else if (Array.isArray(data) && data[0]?.summary_text) {
            // For some models that return summary_text
            setAiStatus('success');
            return data[0].summary_text;
          }
        } catch (modelError) {
          console.log(`Model ${model} failed:`, modelError);
          continue;
        }
      }
      
      throw new Error('All models failed');
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      setAiStatus('fallback');
      // Fallback to enhanced static content
      return generateFallbackResponse(prompt);
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  const generateFallbackResponse = (prompt: string): string => {
    if (!todaysWord) return 'No word selected for analysis.';
    
    // Enhanced fallback responses when API is unavailable
    if (prompt.includes('translation') || prompt.includes('Explain the German word')) {
      return `"${todaysWord.german}" means "${todaysWord.english}". This is a ${todaysWord.type}${todaysWord.gender ? ` (${todaysWord.gender})` : ''}. In German, this word is commonly used in ${todaysWord.type === 'verb' ? 'various sentence contexts and requires proper conjugation' : 'different grammatical cases'}. ${todaysWord.type === 'noun' && todaysWord.gender ? `As a ${todaysWord.gender} noun, use the appropriate article and case endings.` : ''} Practice using this word in your own sentences to improve retention.`;
    } else if (prompt.includes('example') || prompt.includes('Analyze this German sentence')) {
      return `The sentence "${todaysWord.example}" translates to "${todaysWord.exampleTranslation}". Key grammar points: ${todaysWord.german} is the main ${todaysWord.type} here. ${todaysWord.type === 'verb' ? 'Notice the verb position in the sentence - German follows specific word order rules.' : ''} ${todaysWord.gender ? `The gender ${todaysWord.gender} affects article usage.` : ''} Try creating similar sentences using this pattern.`;
    } else if (prompt.includes('usage') || prompt.includes('Show how to use')) {
      return `"${todaysWord.german}" can be used in multiple contexts: 1) ${todaysWord.example} 2) Try variations like changing the subject or tense. ${todaysWord.type === 'verb' ? 'Remember to conjugate based on the subject (ich, du, er/sie/es, wir, ihr, sie).' : ''} ${todaysWord.type === 'noun' ? 'Use appropriate articles and case endings based on sentence role.' : ''} Practice makes perfect!`;
    }
    return `"${todaysWord.german}" (${todaysWord.english}) is a ${todaysWord.type}. Practice using it in context: ${todaysWord.example}`;
  };

  const createPromptForDrill = (word: WordOfDay, mode: string): string => {
    switch (mode) {
      case 'translation':
        return `Explain the German word "${word.german}" (${word.english}). Include alternative meanings, usage context, and a memory tip. Keep it concise and educational.`;
      
      case 'example':
        return `Analyze this German sentence: "${word.example}" (${word.exampleTranslation}). Break down the grammar, word order, and provide similar examples.`;
      
      case 'usage':
        return `Show how to use "${word.german}" in different contexts. Include conjugation patterns, common phrases, and usage tips for German learners.`;
      
      default:
        return `Explain the German word "${word.german}" meaning "${word.english}" for a language learner.`;
    }
  };

  // Word of the Day database - Expanded collection
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
    },
    {
      id: '6',
      german: 'erweitern',
      english: 'to expand',
      pronunciation: 'ɛʁˈvaɪtɐn',
      type: 'verb',
      example: 'Wir müssen unser Wissen erweitern.',
      exampleTranslation: 'We need to expand our knowledge.',
      difficulty: 2,
      date: '2024-01-13'
    },
    {
      id: '7',
      german: 'Geduld',
      english: 'patience',
      pronunciation: 'ɡəˈdʊlt',
      gender: 'die',
      type: 'noun',
      example: 'Geduld ist eine wichtige Eigenschaft.',
      exampleTranslation: 'Patience is an important quality.',
      difficulty: 2,
      date: '2024-01-14'
    },
    {
      id: '8',
      german: 'überzeugen',
      english: 'to convince',
      pronunciation: 'yːbɐˈt͡sɔɪɡən',
      type: 'verb',
      example: 'Er konnte mich nicht überzeugen.',
      exampleTranslation: 'He could not convince me.',
      difficulty: 3,
      date: '2024-01-15'
    },
    {
      id: '9',
      german: 'Gewohnheit',
      english: 'habit',
      pronunciation: 'ɡəˈvoːnhaɪt',
      gender: 'die',
      type: 'noun',
      example: 'Das ist eine schlechte Gewohnheit.',
      exampleTranslation: 'That is a bad habit.',
      difficulty: 2,
      date: '2024-01-16'
    },
    {
      id: '10',
      german: 'zuverlässig',
      english: 'reliable',
      pronunciation: 't͡suːfɐˈlɛsɪç',
      type: 'adjective',
      example: 'Er ist sehr zuverlässig.',
      exampleTranslation: 'He is very reliable.',
      difficulty: 3,
      date: '2024-01-17'
    },
    {
      id: '11',
      german: 'sich entscheiden',
      english: 'to decide',
      pronunciation: 'zɪç ɛntˈʃaɪdən',
      type: 'reflexive verb',
      example: 'Ich kann mich nicht entscheiden.',
      exampleTranslation: 'I cannot decide.',
      difficulty: 2,
      date: '2024-01-18'
    },
    {
      id: '12',
      german: 'Aufmerksamkeit',
      english: 'attention',
      pronunciation: 'ˈaʊfmɛrkzaːmkaɪt',
      gender: 'die',
      type: 'noun',
      example: 'Das verdient unsere Aufmerksamkeit.',
      exampleTranslation: 'This deserves our attention.',
      difficulty: 3,
      date: '2024-01-19'
    },
    {
      id: '13',
      german: 'vertrauen',
      english: 'to trust',
      pronunciation: 'fɛʁˈtʁaʊən',
      type: 'verb',
      example: 'Ich vertraue dir vollkommen.',
      exampleTranslation: 'I trust you completely.',
      difficulty: 2,
      date: '2024-01-20'
    },
    {
      id: '14',
      german: 'Eigenschaft',
      english: 'characteristic',
      pronunciation: 'ˈaɪɡənʃaft',
      gender: 'die',
      type: 'noun',
      example: 'Das ist eine positive Eigenschaft.',
      exampleTranslation: 'That is a positive characteristic.',
      difficulty: 3,
      date: '2024-01-21'
    },
    {
      id: '15',
      german: 'auffallen',
      english: 'to stand out',
      pronunciation: 'ˈaʊffalən',
      type: 'verb',
      example: 'Das wird bestimmt auffallen.',
      exampleTranslation: 'That will definitely stand out.',
      difficulty: 3,
      date: '2024-01-22'
    },
    {
      id: '16',
      german: 'Erinnerung',
      english: 'memory',
      pronunciation: 'ɛʁˈɪnəʁʊŋ',
      gender: 'die',
      type: 'noun',
      example: 'Das ist eine schöne Erinnerung.',
      exampleTranslation: 'That is a beautiful memory.',
      difficulty: 2,
      date: '2024-01-23'
    },
    {
      id: '17',
      german: 'neugierig',
      english: 'curious',
      pronunciation: 'ˈnɔɪɡiːʁɪç',
      type: 'adjective',
      example: 'Ich bin sehr neugierig auf das Ergebnis.',
      exampleTranslation: 'I am very curious about the result.',
      difficulty: 2,
      date: '2024-01-24'
    },
    {
      id: '18',
      german: 'sich gewöhnen',
      english: 'to get used to',
      pronunciation: 'zɪç ɡəˈvøːnən',
      type: 'reflexive verb',
      example: 'Ich muss mich an das Wetter gewöhnen.',
      exampleTranslation: 'I have to get used to the weather.',
      difficulty: 3,
      date: '2024-01-25'
    },
    {
      id: '19',
      german: 'Vorstellung',
      english: 'imagination',
      pronunciation: 'ˈfoːʁʃtɛlʊŋ',
      gender: 'die',
      type: 'noun',
      example: 'Das übersteigt meine Vorstellung.',
      exampleTranslation: 'That exceeds my imagination.',
      difficulty: 3,
      date: '2024-01-26'
    },
    {
      id: '20',
      german: 'betrachten',
      english: 'to consider',
      pronunciation: 'bəˈtʁaxtən',
      type: 'verb',
      example: 'Wir sollten alle Möglichkeiten betrachten.',
      exampleTranslation: 'We should consider all possibilities.',
      difficulty: 3,
      date: '2024-01-27'
    }
  ];

  useEffect(() => {
    // Load all available words from multiple sources
    const loadAllWords = async () => {
      setIsLoadingWords(true);
      let combinedWords = [...words]; // Start with curated words
      
      try {
        // Try to load additional words from Google Sheets (your vocabulary list)
        const csvUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRa3k9eFOlMbkJEE4SZqhFvaqtbAzR3-ecP8tBrvXJINQmr4XfWYkzZkBGvbMINOpjCi7JqU75NRNrA/pub?output=csv`;
        
        const response = await fetch(csvUrl);
        const text = await response.text();
        
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const googleSheetWords: WordOfDay[] = [];
        
        for (let i = 1; i < lines.length; i++) { // Skip header
          const values = lines[i].split(',').map(val => val.replace(/^"|"$/g, '').trim());
          
          if (values.length >= 2 && values[0] && values[1]) {
            const germanCol = values[0].match(/^\d+$/) ? 1 : 0;
            const englishCol = germanCol + 1;
            
            if (values[germanCol] && values[englishCol]) {
              // Skip if word already exists in curated list
              const wordExists = combinedWords.some(w => 
                w.german.toLowerCase() === values[germanCol].toLowerCase()
              );
              
              if (!wordExists) {
                googleSheetWords.push({
                  id: `gs-${i}`,
                  german: values[germanCol].trim(),
                  english: values[englishCol].trim(),
                  pronunciation: '', // Will be generated dynamically
                  type: 'vocabulary', // Default type
                  example: `Das ist ein Beispiel mit "${values[germanCol].trim()}".`,
                  exampleTranslation: `This is an example with "${values[englishCol].trim()}".`,
                  difficulty: 2, // Default difficulty
                  date: new Date().toISOString().split('T')[0]
                });
              }
            }
          }
        }
        
        combinedWords = [...combinedWords, ...googleSheetWords];
        console.log(`Loaded ${combinedWords.length} total words (${words.length} curated + ${googleSheetWords.length} from Google Sheets)`);
        
      } catch (error) {
        console.log('Could not load Google Sheets words, using curated words only:', error);
      }
      
      setAllWords(combinedWords);
      
      // Get initial word
      const randomWord = getRandomWordFromList(combinedWords);
      setTodaysWord(randomWord);
      setIsLoadingWords(false);
    };
    
    loadAllWords();
  }, []);

  const getRandomWordFromList = (wordList: WordOfDay[]) => {
    const recentlyShown = JSON.parse(localStorage.getItem('recent-words') || '[]');
    const availableWords = wordList.filter(word => !recentlyShown.includes(word.id));
    
    let selectedWord;
    if (availableWords.length === 0) {
      // If all words have been shown recently, reset and pick any word
      localStorage.setItem('recent-words', '[]');
      selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    } else {
      // Pick from words not recently shown
      selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    }
    
    // Track this word as recently shown (keep last 25 words for larger word pool)
    const updatedRecent = [selectedWord.id, ...recentlyShown].slice(0, 25);
    localStorage.setItem('recent-words', JSON.stringify(updatedRecent));
    
    return selectedWord;
  };

  const getNewWord = () => {
    if (allWords.length === 0) return;
    
    const selectedWord = getRandomWordFromList(allWords);
    setTodaysWord(selectedWord);
    
    // Reset drill state when getting new word
    setDrillMode('translation');
    setUserAnswer('');
    setShowAnswer(false);
    setShowDetails(false);
    setAiAnswer('');
    setAiStatus('idle');
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = async () => {
    setShowAnswer(true);
    
    if (!todaysWord) return;
    
    // Generate AI response
    const prompt = createPromptForDrill(todaysWord, drillMode);
    const answer = await generateAIResponse(prompt);
    setAiAnswer(answer);
  };

  const nextDrill = () => {
    const modes: ('translation' | 'example' | 'usage')[] = ['translation', 'example', 'usage'];
    const currentIndex = modes.indexOf(drillMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setDrillMode(modes[nextIndex]);
    setUserAnswer('');
    setShowAnswer(false);
    setAiAnswer('');
    setAiStatus('idle');
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

  // Old hardcoded functions replaced by AI-generated content - using Hugging Face API

  // All old hardcoded functions removed - now using AI-generated content via Hugging Face API

  if (!todaysWord || isLoadingWords) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">
            {isLoadingWords ? 'Loading word collection...' : 'Loading word...'}
          </p>
          {isLoadingWords && (
            <p className="text-sm text-gray-500 mt-2">
              Combining curated words with your Google Sheets vocabulary
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Word of the Day Card */}
      <div className="card p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              ✨ German Study Word
            </div>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {allWords.length} words available
            </div>
            <button
              onClick={getNewWord}
              className="btn-secondary text-sm flex items-center gap-1"
              title="Get a new word"
            >
              <RefreshCw size={14} />
              New Word
            </button>
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
            <Brain size={14} className="mr-1" />
            {drillMode.charAt(0).toUpperCase() + drillMode.slice(1)} Mode (AI-Powered)
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
              disabled={isGeneratingAnswer}
              className="btn-primary flex items-center gap-2"
            >
              {isGeneratingAnswer ? (
                <>
                  <Brain className="animate-spin" size={16} />
                  Generating...
                </>
              ) : (
                'Check Answer'
              )}
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
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Brain size={16} />
                {aiStatus === 'success' ? 'AI-Generated Answer:' : 
                 aiStatus === 'fallback' ? 'Enhanced Answer (Offline Mode):' : 
                 'AI-Generated Answer:'}
                {aiStatus === 'success' && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">🤖 Live AI</span>}
                {aiStatus === 'fallback' && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">📚 Enhanced</span>}
              </h4>
              {isGeneratingAnswer ? (
                <div className="flex items-center gap-2 text-green-700">
                  <Brain className="animate-spin" size={16} />
                  <span>Generating personalized response...</span>
                </div>
              ) : (
                <p className="text-green-700 whitespace-pre-line">
                  {aiAnswer || 'Unable to generate answer. Please try again.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Streak */}
      <div className="card p-4">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 justify-center">
            <Brain size={16} />
            AI-Enhanced Study Progress
          </h3>
          <div className="text-2xl font-bold text-blue-600">📚 {allWords.length} words available!</div>
          <p className="text-sm text-gray-600 mt-1">
            Smart rotation avoids last 25 words. Fresh content every visit!
          </p>
          <div className="mt-2 text-xs text-gray-500">
            {words.length} curated + {allWords.length - words.length} from your Google Sheets
          </div>
          <div className="mt-2 text-xs text-blue-600 flex items-center gap-1 justify-center">
            <Brain size={12} />
            Powered by Hugging Face AI for personalized explanations
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordOfTheDay; 