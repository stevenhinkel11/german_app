import { useState } from 'react';
import { BookOpen, Calendar, HelpCircle, Globe, Settings } from 'lucide-react';
import FlashcardApp from './components/FlashcardApp';
import WordOfTheDay from './components/WordOfTheDay';
import GenderHelper from './components/GenderHelper';
import CultureTrivia from './components/CultureTrivia';
import SettingsPanel from './components/SettingsPanel';

type Tab = 'flashcards' | 'word-of-day' | 'gender-helper' | 'trivia' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('flashcards');

  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'word-of-day', label: 'Word of the Day', icon: Calendar },
    { id: 'gender-helper', label: 'Gender Helper', icon: HelpCircle },
    { id: 'trivia', label: 'Culture Trivia', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🇩🇪 German Language Learning
          </h1>
          <p className="text-gray-600">Master German with flashcards, daily words, and cultural insights</p>
        </header>

        <nav className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <main className="max-w-4xl mx-auto">
          {activeTab === 'flashcards' && <FlashcardApp />}
          {activeTab === 'word-of-day' && <WordOfTheDay />}
          {activeTab === 'gender-helper' && <GenderHelper />}
          {activeTab === 'trivia' && <CultureTrivia />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

export default App; 