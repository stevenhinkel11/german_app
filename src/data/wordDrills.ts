export interface WordDrill {
  type: 'fill-blank' | 'multiple-choice' | 'sentence-builder' | 'context-clue' | 'word-family' | 'pronunciation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
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
}

export const generateDrillsForWord = (word: EnhancedWord): WordDrill[] => {
  const drills: WordDrill[] = [];

  // Fill-in-the-blank drill
  word.examples.forEach((example) => {
    const words = example.sentence.split(' ');
    const wordIndex = words.findIndex(w => w.toLowerCase().includes(word.german.toLowerCase()));
    if (wordIndex !== -1) {
      const maskedSentence = words.map((w, i) => i === wordIndex ? '____' : w).join(' ');
      drills.push({
        type: 'fill-blank',
        question: `Fill in the blank: ${maskedSentence}`,
        correctAnswer: word.german,
        explanation: `"${word.german}" means "${word.english}". ${example.context}`,
        hint: `This ${word.type} means "${word.english}"`
      });
    }
  });

  // Multiple choice drill - translation
  drills.push({
    type: 'multiple-choice',
    question: `What does "${word.german}" mean in English?`,
    options: [
      word.english,
      getRandomEnglishWord(),
      getRandomEnglishWord(),
      getRandomEnglishWord()
    ].sort(() => Math.random() - 0.5),
    correctAnswer: word.english,
    explanation: `"${word.german}" means "${word.english}". ${word.memoryTip || ''}`
  });

  // Context clue drill
  if (word.examples.length > 0) {
    const randomExample = word.examples[Math.floor(Math.random() * word.examples.length)];
    drills.push({
      type: 'context-clue',
      question: `Based on this context, what do you think "${word.german}" means? Context: "${randomExample.sentence}"`,
      correctAnswer: word.english,
      explanation: `Correct! "${word.german}" means "${word.english}". Translation: "${randomExample.translation}"`
    });
  }

  // Word family drill
  if (word.wordFamily && word.wordFamily.length > 0) {
    drills.push({
      type: 'word-family',
      question: `Which words are related to "${word.german}"?`,
      options: [...word.wordFamily, getRandomGermanWord(), getRandomGermanWord()],
      correctAnswer: word.wordFamily.join(', '),
      explanation: `These words share the same root: ${word.wordFamily.join(', ')}`
    });
  }

  // Sentence builder drill
  drills.push({
    type: 'sentence-builder',
    question: `Create a sentence using "${word.german}" about: ${getRandomContext()}`,
    correctAnswer: word.examples[0]?.sentence || `Example: ${word.german}...`,
    explanation: `Here's one way to use it: ${word.examples[0]?.sentence} (${word.examples[0]?.translation})`
  });

  // Pronunciation challenge
  drills.push({
    type: 'pronunciation',
    question: `How would you pronounce "${word.german}"?`,
    correctAnswer: word.pronunciation,
    explanation: `"${word.german}" is pronounced: ${word.pronunciation}. ${word.memoryTip ? 'Tip: ' + word.memoryTip : ''}`
  });

  return drills;
};

// Helper functions for generating random content
const randomEnglishWords = [
  'happy', 'sad', 'bright', 'dark', 'fast', 'slow', 'big', 'small', 'hot', 'cold',
  'house', 'car', 'tree', 'book', 'water', 'food', 'time', 'person', 'place', 'thing',
  'beautiful', 'terrible', 'amazing', 'boring', 'interesting', 'difficult', 'easy', 'hard'
];

const randomGermanWords = [
  'der Baum', 'das Haus', 'die Katze', 'der Hund', 'das Auto', 'die Zeit', 'der Mann', 'die Frau',
  'das Kind', 'der Tag', 'die Nacht', 'das Wasser', 'die Straße', 'der Weg', 'das Leben'
];

const contexts = [
  'going to work', 'cooking dinner', 'meeting friends', 'traveling', 'studying',
  'shopping', 'exercising', 'watching TV', 'reading', 'sleeping', 'weather',
  'family time', 'weekend plans', 'daily routine', 'hobbies'
];

function getRandomEnglishWord(): string {
  return randomEnglishWords[Math.floor(Math.random() * randomEnglishWords.length)];
}

function getRandomGermanWord(): string {
  return randomGermanWords[Math.floor(Math.random() * randomGermanWords.length)];
}

function getRandomContext(): string {
  return contexts[Math.floor(Math.random() * contexts.length)];
}

// Expanded word database with rich drill content
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
    synonyms: ['verstärken', 'steigern']
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
    commonMistakes: ['Not using correct adjective endings', 'Confusing with "comfortable"']
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
    synonyms: ['Zeitstimmung', 'Zeitcharakter']
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
        sentence: 'Es dauerte Monate, bis ich mich eingawöhnt hatte.',
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
    commonMistakes: ['Forgetting reflexive pronoun', 'Wrong preposition usage']
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
    wordFamily: ['nachhaltig', 'nachhalten', 'Nachhaltigkeit'],
    memoryTip: 'nach = after, halten = to hold → holding on for the future',
    synonyms: ['Dauerhaftigkeit', 'Beständigkeit']
  }
]; 