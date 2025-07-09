export interface WordDrill {
  type: 'hidden-translation' | 'new-context' | 'grammar-usage' | 'pronunciation-guess' | 'scenario-usage' | 'word-formation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  hideDefinition?: boolean; // Hide the English definition during this drill
}

export interface EnhancedWord {
  id: string;
  german: string;
  english: string;
  pronunciation: string;
  gender?: string;
  type: string;
  difficulty: number;
  date: string;
  examples: {
    sentence: string;
    translation: string;
    context: string;
  }[];
  wordFamily?: string[];
  commonMistakes?: string[];
  memoryTip?: string;
  synonyms?: string[];
  antonyms?: string[];
  conjugations?: { form: string; meaning: string }[];
  usageContexts?: string[];
}

export const generateDrillsForWord = (word: EnhancedWord): WordDrill[] => {
  const drills: WordDrill[] = [];

  // 1. Hidden Translation - Actually test if they remember the meaning
  drills.push({
    type: 'hidden-translation',
    question: `What does "${word.german}" mean in English?`,
    options: [
      word.english,
      getRandomEnglishWord(),
      getRandomEnglishWord(),
      getRandomEnglishWord()
    ].sort(() => Math.random() - 0.5),
    correctAnswer: word.english,
    explanation: `"${word.german}" means "${word.english}". ${word.memoryTip || ''}`,
    hideDefinition: true
  });

  // 2. New Context Usage - Use the word in a completely new scenario
  const newContexts = [
    'at a business meeting', 'during a vacation', 'while cooking', 'at the doctor',
    'shopping for clothes', 'talking to neighbors', 'during a job interview',
    'explaining to a child', 'writing an email', 'giving directions'
  ];
  const randomContext = newContexts[Math.floor(Math.random() * newContexts.length)];
  
  drills.push({
    type: 'new-context',
    question: `How would you use "${word.german}" ${randomContext}? Create a German sentence.`,
    correctAnswer: word.examples[0]?.sentence || `Example: ${word.german} ist wichtig.`,
    explanation: `Here's one way: ${word.examples[0]?.sentence} (${word.examples[0]?.translation}). The key is using "${word.german}" appropriately in context.`,
    hint: `Think about how "${word.english}" would be used ${randomContext}`
  });

  // 3. Grammar Usage - Test proper grammatical usage
  if (word.type === 'verb') {
    const subjects = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    drills.push({
      type: 'grammar-usage',
      question: `Conjugate "${word.german}" for "${randomSubject}" in present tense.`,
      correctAnswer: getConjugation(word.german, randomSubject),
      explanation: `"${word.german}" with "${randomSubject}" becomes "${getConjugation(word.german, randomSubject)}". German verbs change based on the subject.`,
      hint: `Remember German verb conjugation patterns for ${word.german}`
    });
  } else if (word.type === 'noun' && word.gender) {
    const cases = ['nominativ', 'akkusativ', 'dativ', 'genitiv'];
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    
    drills.push({
      type: 'grammar-usage',
      question: `What is the correct article for "${word.german}" in ${randomCase} case?`,
      options: ['der', 'die', 'das', 'den', 'dem', 'des'].filter(article => 
        article.startsWith(word.gender?.slice(0, 2) || 'd')
      ),
      correctAnswer: getArticle(word.gender!, randomCase),
      explanation: `"${word.german}" is ${word.gender}, so in ${randomCase} case it uses "${getArticle(word.gender!, randomCase)}".`,
      hint: `${word.gender} nouns follow specific case patterns`
    });
  }

  // 4. Pronunciation Challenge - Test without showing the word
  drills.push({
    type: 'pronunciation-guess',
    question: `Listen to this pronunciation: [${word.pronunciation}]. What German word is this?`,
    correctAnswer: word.german,
    explanation: `That's "${word.german}" [${word.pronunciation}], meaning "${word.english}".`,
    hint: `This word means "${word.english}"`
  });

  // 5. Scenario Usage - Real-world application
  const scenarios = [
    'You need to explain why security measures are being increased',
    'You want to describe a sustainable business practice',
    'You need to give instructions to a colleague',
    'You are describing a challenging situation',
    'You want to express that something is impressive'
  ];
  
  drills.push({
    type: 'scenario-usage',
    question: `Scenario: ${scenarios[Math.floor(Math.random() * scenarios.length)]}. Use "${word.german}" in your response.`,
    correctAnswer: word.examples[0]?.sentence || `Example with ${word.german}`,
    explanation: `One way to use "${word.german}": ${word.examples[0]?.sentence} (${word.examples[0]?.translation})`,
    hint: `Think about how to naturally include "${word.german}" meaning "${word.english}"`
  });

  // 6. Word Formation - Test understanding of word building
  if (word.wordFamily && word.wordFamily.length > 0) {
    const unrelatedWord = getRandomGermanWord();
    drills.push({
      type: 'word-formation',
      question: `"${word.german}" belongs to a word family. Which of these words is NOT related?`,
      options: [
        ...word.wordFamily.slice(0, 3),
        unrelatedWord
      ].sort(() => Math.random() - 0.5),
      correctAnswer: unrelatedWord,
      explanation: `"${word.german}" is related to: ${word.wordFamily.join(', ')}. They share similar roots or meanings. "${unrelatedWord}" is not related.`,
      hint: 'Look for words that share similar spelling or meaning patterns'
    });
  }

  return drills;
};

// Helper functions for conjugation and articles
function getConjugation(verb: string, subject: string): string {
  // Simple conjugation logic - in real app, this would be more sophisticated
  const stem = verb.replace(/en$/, '');
  switch (subject) {
    case 'ich': return stem + 'e';
    case 'du': return stem + 'st';
    case 'er/sie/es': return stem + 't';
    case 'wir': return verb; // infinitive
    case 'ihr': return stem + 't';
    case 'sie': return verb; // infinitive
    default: return verb;
  }
}

function getArticle(gender: string, caseType: string): string {
  // Simplified article system
  const articles = {
    'der': {
      'nominativ': 'der',
      'akkusativ': 'den',
      'dativ': 'dem',
      'genitiv': 'des'
    },
    'die': {
      'nominativ': 'die',
      'akkusativ': 'die',
      'dativ': 'der',
      'genitiv': 'der'
    },
    'das': {
      'nominativ': 'das',
      'akkusativ': 'das',
      'dativ': 'dem',
      'genitiv': 'des'
    }
  };
  return articles[gender as keyof typeof articles]?.[caseType as keyof typeof articles['der']] || gender;
}

// Helper functions for generating random content
const randomEnglishWords = [
  'happy', 'sad', 'bright', 'dark', 'fast', 'slow', 'big', 'small', 'hot', 'cold',
  'house', 'car', 'tree', 'book', 'water', 'food', 'time', 'person', 'place', 'thing',
  'beautiful', 'terrible', 'amazing', 'boring', 'interesting', 'difficult', 'easy', 'hard',
  'expensive', 'cheap', 'new', 'old', 'clean', 'dirty', 'quiet', 'loud', 'empty', 'full'
];

const randomGermanWords = [
  'der Baum', 'das Haus', 'die Katze', 'der Hund', 'das Auto', 'die Zeit', 'der Mann', 'die Frau',
  'das Kind', 'der Tag', 'die Nacht', 'das Wasser', 'die Straße', 'der Weg', 'das Leben',
  'das Buch', 'die Schule', 'der Freund', 'die Arbeit', 'das Geld', 'die Musik', 'der Sport'
];

function getRandomEnglishWord(): string {
  return randomEnglishWords[Math.floor(Math.random() * randomEnglishWords.length)];
}

function getRandomGermanWord(): string {
  return randomGermanWords[Math.floor(Math.random() * randomGermanWords.length)];
}

// Enhanced word database with more comprehensive drill content
export const enhancedWords: EnhancedWord[] = [
  {
    id: '1',
    german: 'verschärfen',
    english: 'to intensify',
    pronunciation: 'fɛʁˈʃɛʁfən',
    type: 'verb',
    difficulty: 3,
    date: '2024-01-08',
    examples: [
      {
        sentence: 'Die Polizei verschärfte die Sicherheitskontrollen.',
        translation: 'The police intensified the security checks.',
        context: 'Used in formal contexts, often with official measures'
      },
      {
        sentence: 'Die Krise verschärfte sich dramatisch.',
        translation: 'The crisis intensified dramatically.',
        context: 'Reflexive form meaning "to worsen" or "to become more intense"'
      }
    ],
    wordFamily: ['scharf', 'Verschärfung', 'verschärft'],
    memoryTip: 'Think "sharper" - making something more intense is like making it sharper',
    synonyms: ['verstärken', 'steigern'],
    conjugations: [
      { form: 'ich verschärfe', meaning: 'I intensify' },
      { form: 'du verschärfst', meaning: 'you intensify' },
      { form: 'er/sie/es verschärft', meaning: 'he/she/it intensifies' }
    ],
    usageContexts: ['security', 'crisis', 'regulations', 'measures']
  },
  {
    id: '2',
    german: 'gemütlich',
    english: 'cozy',
    pronunciation: 'ɡəˈmyːtlɪç',
    type: 'adjective',
    difficulty: 2,
    date: '2024-01-09',
    examples: [
      {
        sentence: 'Das Café ist sehr gemütlich.',
        translation: 'The café is very cozy.',
        context: 'Describes comfortable, warm, inviting places'
      },
      {
        sentence: 'Wir verbrachten einen gemütlichen Abend zu Hause.',
        translation: 'We spent a cozy evening at home.',
        context: 'Can describe relaxed, comfortable social situations'
      }
    ],
    wordFamily: ['Gemütlichkeit', 'Gemüt'],
    memoryTip: 'Think "good mood" - gemütlich places put you in a good mood',
    commonMistakes: ['Not using correct adjective endings', 'Confusing with "comfortable"'],
    usageContexts: ['home', 'restaurants', 'atmosphere', 'social situations']
  },
  {
    id: '3',
    german: 'der Zeitgeist',
    english: 'spirit of the times',
    pronunciation: 'ˈtsaɪtɡaɪst',
    gender: 'der',
    type: 'noun',
    difficulty: 3,
    date: '2024-01-10',
    examples: [
      {
        sentence: 'Dieser Film fängt den Zeitgeist der 80er Jahre ein.',
        translation: 'This film captures the spirit of the 1980s.',
        context: 'Used to describe cultural attitudes of a particular era'
      },
      {
        sentence: 'Seine Musik spiegelt den aktuellen Zeitgeist wider.',
        translation: 'His music reflects the current zeitgeist.',
        context: 'Often used in cultural criticism and analysis'
      }
    ],
    wordFamily: ['Zeit', 'Geist', 'zeitgeistig'],
    memoryTip: 'Zeit = time, Geist = spirit → the spirit of the times',
    synonyms: ['Zeitstimmung', 'Zeitcharakter'],
    usageContexts: ['culture', 'history', 'art', 'social commentary']
  },
  {
    id: '4',
    german: 'sich eingewöhnen',
    english: 'to settle in',
    pronunciation: 'zɪç ˈaɪnɡəˌvøːnən',
    type: 'reflexive verb',
    difficulty: 2,
    date: '2024-01-11',
    examples: [
      {
        sentence: 'Es dauerte Monate, bis ich mich eingewöhnt hatte.',
        translation: 'It took months until I had settled in.',
        context: 'Used when adapting to new places, jobs, or situations'
      },
      {
        sentence: 'Die Kinder gewöhnen sich schnell in der neuen Schule ein.',
        translation: 'The children are settling in quickly at the new school.',
        context: 'Present tense, showing ongoing adaptation process'
      }
    ],
    wordFamily: ['gewöhnen', 'Gewohnheit', 'gewöhnlich', 'Eingewöhnung'],
    memoryTip: 'ein = in, gewöhnen = to get used to → getting used to being "in" somewhere',
    commonMistakes: ['Forgetting reflexive pronoun', 'Wrong preposition usage'],
    usageContexts: ['moving', 'new job', 'school', 'adaptation']
  },
  {
    id: '5',
    german: 'die Nachhaltigkeit',
    english: 'sustainability',
    pronunciation: 'ˈnaːxhaltɪçkaɪt',
    gender: 'die',
    type: 'noun',
    difficulty: 3,
    date: '2024-01-12',
    examples: [
      {
        sentence: 'Nachhaltigkeit ist das Ziel unserer Umweltpolitik.',
        translation: 'Sustainability is the goal of our environmental policy.',
        context: 'Used in environmental and business contexts'
      },
      {
        sentence: 'Das Unternehmen investiert in nachhaltige Technologien.',
        translation: 'The company invests in sustainable technologies.',
        context: 'Adjective form "nachhaltig" is commonly used'
      }
    ],
    wordFamily: ['nachhaltig', 'nachhalten'],
    memoryTip: 'nach = after, halten = to hold → holding on for the future',
    synonyms: ['Dauerhaftigkeit', 'Beständigkeit'],
    usageContexts: ['environment', 'business', 'policy', 'future planning']
  }
]; 