export interface WordExample {
  sentence: string;
  translation: string;
  context: string;
}

export interface Conjugation {
  form: string;
  meaning: string;
}

export interface EnhancedWord {
  id: string;
  german: string;
  english: string;
  pronunciation: string;
  type: string;
  difficulty: number;
  gender?: string;
  examples: WordExample[];
  memoryTip?: string;
  wordFamily?: string[];
  synonyms?: string[];
  usageContexts?: string[];
  commonMistakes?: string[];
  conjugations?: Conjugation[];
}

export const enhancedWords: EnhancedWord[] = [
  {
    id: '1',
    german: 'Freund',
    english: 'friend',
    pronunciation: 'froynt',
    type: 'noun',
    difficulty: 1,
    gender: 'der',
    examples: [
      {
        sentence: 'Mein bester Freund hilft mir immer.',
        translation: 'My best friend always helps me.',
        context: 'Expressing close friendship'
      },
      {
        sentence: 'Ich gehe heute Abend mit meinem Freund ins Kino.',
        translation: 'I\'m going to the movies with my friend tonight.',
        context: 'Making plans with friends'
      }
    ],
    memoryTip: 'Think of "friend" - a friend brings you joy (Freude)',
    wordFamily: ['Freundschaft', 'freundlich', 'Freundin', 'befreundet'],
    synonyms: ['Kumpel', 'Bekannter'],
    usageContexts: ['casual conversation', 'introductions', 'social situations'],
    commonMistakes: ['Confusing with "Freundin" (female friend/girlfriend)']
  },
  {
    id: '2',
    german: 'Haus',
    english: 'house',
    pronunciation: 'house',
    type: 'noun',
    difficulty: 1,
    gender: 'das',
    examples: [
      {
        sentence: 'Wir haben ein neues Haus gekauft.',
        translation: 'We bought a new house.',
        context: 'Discussing home ownership'
      },
      {
        sentence: 'Das Haus ist sehr groß und schön.',
        translation: 'The house is very big and beautiful.',
        context: 'Describing a house'
      }
    ],
    memoryTip: 'Same as English "house" - easy to remember!',
    wordFamily: ['Hausbau', 'Haustür', 'Hausarbeit', 'Haushalt'],
    synonyms: ['Wohnung', 'Heim'],
    usageContexts: ['real estate', 'describing homes', 'daily life'],
    commonMistakes: ['Gender confusion - it\'s "das Haus", not "der Haus"']
  },
  {
    id: '3',
    german: 'laufen',
    english: 'to run/walk',
    pronunciation: 'LAU-fen',
    type: 'verb',
    difficulty: 2,
    examples: [
      {
        sentence: 'Ich laufe jeden Morgen im Park.',
        translation: 'I run in the park every morning.',
        context: 'Describing daily exercise routine'
      },
      {
        sentence: 'Wir laufen zum Supermarkt.',
        translation: 'We\'re walking to the supermarket.',
        context: 'Casual movement/transportation'
      }
    ],
    memoryTip: 'Think of "lauf" as the sound of running steps',
    wordFamily: ['Läufer', 'Lauf', 'ablaufen', 'verlaufen'],
    synonyms: ['rennen', 'joggen', 'gehen'],
    usageContexts: ['exercise', 'movement', 'transportation'],
    commonMistakes: ['Can mean both "run" and "walk" depending on context'],
    conjugations: [
      { form: 'ich laufe', meaning: 'I run/walk' },
      { form: 'du läufst', meaning: 'you run/walk' },
      { form: 'er/sie/es läuft', meaning: 'he/she/it runs/walks' },
      { form: 'wir laufen', meaning: 'we run/walk' }
    ]
  },
  {
    id: '4',
    german: 'verstehen',
    english: 'to understand',
    pronunciation: 'fer-SHTE-hen',
    type: 'verb',
    difficulty: 2,
    examples: [
      {
        sentence: 'Ich verstehe dich nicht.',
        translation: 'I don\'t understand you.',
        context: 'Expressing confusion'
      },
      {
        sentence: 'Verstehst du die Aufgabe?',
        translation: 'Do you understand the task?',
        context: 'Academic/work context'
      }
    ],
    memoryTip: 'Ver-stehen: "stand under" something to understand it',
    wordFamily: ['Verständnis', 'verständlich', 'Verständigung'],
    synonyms: ['begreifen', 'kapieren'],
    usageContexts: ['learning', 'communication', 'problem-solving'],
    commonMistakes: ['Separable prefix usage can be confusing'],
    conjugations: [
      { form: 'ich verstehe', meaning: 'I understand' },
      { form: 'du verstehst', meaning: 'you understand' },
      { form: 'er/sie/es versteht', meaning: 'he/she/it understands' },
      { form: 'wir verstehen', meaning: 'we understand' }
    ]
  },
  {
    id: '5',
    german: 'Arbeit',
    english: 'work',
    pronunciation: 'AR-bite',
    type: 'noun',
    difficulty: 2,
    gender: 'die',
    examples: [
      {
        sentence: 'Ich gehe zur Arbeit.',
        translation: 'I\'m going to work.',
        context: 'Daily routine'
      },
      {
        sentence: 'Die Arbeit ist sehr interessant.',
        translation: 'The work is very interesting.',
        context: 'Discussing job satisfaction'
      }
    ],
    memoryTip: 'Think of "working hard" - Arbeit requires effort',
    wordFamily: ['arbeiten', 'Arbeiter', 'Arbeitgeber', 'Arbeitsplatz'],
    synonyms: ['Job', 'Beruf', 'Tätigkeit'],
    usageContexts: ['employment', 'career', 'daily life'],
    commonMistakes: ['Feminine gender - "die Arbeit", not "der Arbeit"']
  },
  {
    id: '6',
    german: 'schön',
    english: 'beautiful/nice',
    pronunciation: 'shern',
    type: 'adjective',
    difficulty: 1,
    examples: [
      {
        sentence: 'Das Wetter ist heute schön.',
        translation: 'The weather is nice today.',
        context: 'Describing weather'
      },
      {
        sentence: 'Sie ist eine schöne Frau.',
        translation: 'She is a beautiful woman.',
        context: 'Describing appearance'
      }
    ],
    memoryTip: 'Beautiful things make you want to "show" them off',
    wordFamily: ['Schönheit', 'verschönern', 'Schönheitsreparaturen'],
    synonyms: ['hübsch', 'attraktiv', 'gut aussehend'],
    usageContexts: ['appearance', 'aesthetics', 'weather', 'general positivity'],
    commonMistakes: ['Adjective endings change based on case and article']
  },
  {
    id: '7',
    german: 'Zeit',
    english: 'time',
    pronunciation: 'tssite',
    type: 'noun',
    difficulty: 1,
    gender: 'die',
    examples: [
      {
        sentence: 'Ich habe keine Zeit.',
        translation: 'I don\'t have time.',
        context: 'Expressing being busy'
      },
      {
        sentence: 'Die Zeit vergeht schnell.',
        translation: 'Time passes quickly.',
        context: 'Philosophical observation'
      }
    ],
    memoryTip: 'Time is like a "sight" - you can see it passing',
    wordFamily: ['zeitlos', 'Zeitschrift', 'rechtzeitig', 'Zeitpunkt'],
    synonyms: ['Moment', 'Periode', 'Dauer'],
    usageContexts: ['scheduling', 'philosophy', 'daily life'],
    commonMistakes: ['Feminine gender - "die Zeit", not "der Zeit"']
  },
  {
    id: '8',
    german: 'sprechen',
    english: 'to speak',
    pronunciation: 'SHPRE-khen',
    type: 'verb',
    difficulty: 2,
    examples: [
      {
        sentence: 'Ich spreche Deutsch.',
        translation: 'I speak German.',
        context: 'Stating language ability'
      },
      {
        sentence: 'Können wir später sprechen?',
        translation: 'Can we talk later?',
        context: 'Scheduling conversation'
      }
    ],
    memoryTip: 'When you speak, you "spray" words out',
    wordFamily: ['Sprache', 'Sprecher', 'Gespräch', 'versprechen'],
    synonyms: ['reden', 'sagen', 'erzählen'],
    usageContexts: ['communication', 'language learning', 'conversation'],
    commonMistakes: ['Strong verb - "ich sprach" (past), not "ich sprechte"'],
    conjugations: [
      { form: 'ich spreche', meaning: 'I speak' },
      { form: 'du sprichst', meaning: 'you speak' },
      { form: 'er/sie/es spricht', meaning: 'he/she/it speaks' },
      { form: 'wir sprechen', meaning: 'we speak' }
    ]
  },
  {
    id: '9',
    german: 'Wasser',
    english: 'water',
    pronunciation: 'VAS-ser',
    type: 'noun',
    difficulty: 1,
    gender: 'das',
    examples: [
      {
        sentence: 'Ich trinke viel Wasser.',
        translation: 'I drink a lot of water.',
        context: 'Health and hydration'
      },
      {
        sentence: 'Das Wasser ist kalt.',
        translation: 'The water is cold.',
        context: 'Describing temperature'
      }
    ],
    memoryTip: 'Water makes a "washing" sound - Wasser',
    wordFamily: ['Wasserflasche', 'Wasserfall', 'wässrig', 'bewässern'],
    synonyms: ['H2O', 'Flüssigkeit'],
    usageContexts: ['food and drink', 'health', 'nature'],
    commonMistakes: ['Neuter gender - "das Wasser", not "die Wasser"']
  },
  {
    id: '10',
    german: 'wichtig',
    english: 'important',
    pronunciation: 'VIKH-tikh',
    type: 'adjective',
    difficulty: 2,
    examples: [
      {
        sentence: 'Das ist sehr wichtig.',
        translation: 'That is very important.',
        context: 'Emphasizing significance'
      },
      {
        sentence: 'Pünktlichkeit ist wichtig.',
        translation: 'Punctuality is important.',
        context: 'Discussing values'
      }
    ],
    memoryTip: 'Important things have "weight" - wichtig sounds like "weighty"',
    wordFamily: ['Wichtigkeit', 'unwichtig', 'Wichtigtuerei'],
    synonyms: ['bedeutend', 'wesentlich', 'relevant'],
    usageContexts: ['emphasis', 'priority', 'values'],
    commonMistakes: ['Adjective endings change based on case and article']
  }
]; 