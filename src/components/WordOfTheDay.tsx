import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Eye, EyeOff, RefreshCw } from 'lucide-react';

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
  };

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
      'Herausforderung': ['challenge', 'test', 'difficulty', 'hurdle'],
      'erweitern': ['to expand', 'to broaden', 'to extend', 'to enlarge'],
      'Geduld': ['patience', 'forbearance', 'tolerance', 'endurance'],
      'überzeugen': ['to convince', 'to persuade', 'to win over', 'to sway'],
      'Gewohnheit': ['habit', 'custom', 'routine', 'practice'],
      'zuverlässig': ['reliable', 'dependable', 'trustworthy', 'consistent'],
      'sich entscheiden': ['to decide', 'to choose', 'to make up one\'s mind', 'to resolve'],
      'Aufmerksamkeit': ['attention', 'focus', 'concentration', 'awareness'],
      'vertrauen': ['to trust', 'to rely on', 'to have faith in', 'to confide in'],
      'Eigenschaft': ['characteristic', 'trait', 'quality', 'attribute'],
      'auffallen': ['to stand out', 'to be noticeable', 'to catch attention', 'to be conspicuous'],
      'Erinnerung': ['memory', 'recollection', 'remembrance', 'reminiscence'],
      'neugierig': ['curious', 'inquisitive', 'interested', 'eager to know'],
      'sich gewöhnen': ['to get used to', 'to become accustomed', 'to adapt', 'to adjust'],
      'Vorstellung': ['imagination', 'idea', 'concept', 'notion'],
      'betrachten': ['to consider', 'to view', 'to regard', 'to examine']
    };
    
    const alts = alternatives[word.german];
    if (alts) {
      return alts.slice(1).join(', ');
    }
    
    // For words from Google Sheets without specific alternatives, generate smart alternatives
    const english = word.english.toLowerCase();
    if (english.includes('to ') && english.startsWith('to ')) {
      // It's a verb
      const baseVerb = english.substring(3);
      return `${baseVerb}, perform ${baseVerb}, carry out ${baseVerb}`;
    } else if (word.german.startsWith('der ') || word.german.startsWith('die ') || word.german.startsWith('das ')) {
      // It's a noun with article
      return `the ${english}, a ${english}, this ${english}`;
    } else {
      // Generate generic alternatives based on word type
      return `related meanings may vary by context`;
    }
  };

  const getContextualNote = (word: WordOfDay): string => {
    const notes: { [key: string]: string } = {
      'verschärfen': 'Often used in formal contexts like laws, regulations, or policies',
      'Nachhaltigkeit': 'A key concept in German environmental and business discourse',
      'beeindruckend': 'Can describe anything from performances to achievements',
      'sich bemühen': 'Reflexive verb - always use "sich" with the appropriate pronoun',
      'Herausforderung': 'Can be positive (opportunity) or negative (obstacle)',
      'erweitern': 'Commonly used in academic and professional contexts',
      'Geduld': 'Abstract noun, often used in philosophical or advice contexts',
      'überzeugen': 'Strong verb implying successful persuasion, not just attempting',
      'Gewohnheit': 'Can be positive or negative - context determines meaning',
      'zuverlässig': 'High praise in German culture - reliability is highly valued',
      'sich entscheiden': 'Reflexive verb requiring "sich" - implies personal choice',
      'Aufmerksamkeit': 'Formal word, often used in professional or academic settings',
      'vertrauen': 'Can take dative object - "Ich vertraue dir" (I trust you)',
      'Eigenschaft': 'More formal than "Merkmal" - used for inherent qualities',
      'auffallen': 'Separable verb - "Das fällt auf" (That stands out)',
      'Erinnerung': 'Can mean both the act of remembering and the memory itself',
      'neugierig': 'Generally positive trait in German culture, showing interest',
      'sich gewöhnen': 'Reflexive with "an" - "sich an etwas gewöhnen"',
      'Vorstellung': 'Multiple meanings: imagination, idea, or performance/presentation',
      'betrachten': 'More thoughtful than just "schauen" (to look) - implies analysis'
    };
    
    const specificNote = notes[word.german];
    if (specificNote) {
      return specificNote;
    }
    
    // Generate smart contextual notes for Google Sheets words
    const german = word.german.toLowerCase();
    const english = word.english.toLowerCase();
    
    if (german.includes('sich ')) {
      return 'Reflexive verb - requires the appropriate reflexive pronoun (mich, dich, sich, etc.)';
    } else if (german.startsWith('der ')) {
      return 'Masculine noun - use "der" (nominative), "den" (accusative), "dem" (dative), "des" (genitive)';
    } else if (german.startsWith('die ')) {
      return 'Feminine noun - use "die" (nom./acc.), "der" (dat./gen.)';
    } else if (german.startsWith('das ')) {
      return 'Neuter noun - use "das" (nom./acc.), "dem" (dative), "des" (genitive)';
    } else if (english.startsWith('to ')) {
      return 'Verb - remember German verb conjugations change based on subject and tense';
    } else if (german.endsWith('ig') || german.endsWith('lich') || german.endsWith('isch')) {
      return 'Adjective - endings change based on gender, case, and definiteness of noun';
    } else {
      return 'Pay attention to context, gender (for nouns), and appropriate usage register';
    }
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
      ],
      'erweitern': [
        'Wir wollen unseren Horizont erweitern. - We want to broaden our horizons.',
        'Das Unternehmen erweitert seine Produktion. - The company is expanding its production.'
      ],
      'Geduld': [
        'Hab etwas Geduld mit mir. - Have some patience with me.',
        'Geduld ist eine Tugend. - Patience is a virtue.'
      ],
      'überzeugen': [
        'Sie konnte mich überzeugen. - She was able to convince me.',
        'Das Argument überzeugt nicht. - The argument is not convincing.'
      ],
      'vertrauen': [
        'Ich vertraue dir vollkommen. - I trust you completely.',
        'Vertrauen muss man sich verdienen. - Trust must be earned.'
      ],
      'neugierig': [
        'Ich bin neugierig auf deine Meinung. - I am curious about your opinion.',
        'Das Kind ist sehr neugierig. - The child is very curious.'
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
          <h3 className="font-semibold text-gray-900 mb-2">Study Progress</h3>
          <div className="text-2xl font-bold text-blue-600">📚 {allWords.length} words available!</div>
          <p className="text-sm text-gray-600 mt-1">
            Smart rotation avoids last 25 words. Fresh content every visit!
          </p>
          <div className="mt-2 text-xs text-gray-500">
            {words.length} curated + {allWords.length - words.length} from your Google Sheets
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordOfTheDay; 