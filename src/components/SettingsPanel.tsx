import React, { useState, useEffect } from 'react';
import { Settings, Download, Upload, RotateCcw, Save, ExternalLink } from 'lucide-react';

interface AppSettings {
  cardsPerDay: number;
  googleSheetUrl: string;
  enableNotifications: boolean;
  darkMode: boolean;
  autoAdvance: boolean;
  showPronunciation: boolean;
  studyReminders: boolean;
  language: 'en' | 'de';
}

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    cardsPerDay: 20,
    googleSheetUrl: '',
    enableNotifications: false,
    darkMode: false,
    autoAdvance: false,
    showPronunciation: true,
    studyReminders: true,
    language: 'en'
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    setUnsavedChanges(false);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Settings saved successfully!';
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
  };

  const resetSettings = () => {
    const defaultSettings: AppSettings = {
      cardsPerDay: 20,
      googleSheetUrl: '',
      enableNotifications: false,
      darkMode: false,
      autoAdvance: false,
      showPronunciation: true,
      studyReminders: true,
      language: 'en'
    };
    setSettings(defaultSettings);
    setUnsavedChanges(true);
  };

  const exportData = () => {
    const data = {
      settings,
      flashcardProgress: localStorage.getItem('flashcard-progress'),
      triviaFavorites: localStorage.getItem('trivia-favorites'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `german-app-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
          setUnsavedChanges(true);
        }
        if (data.flashcardProgress) {
          localStorage.setItem('flashcard-progress', data.flashcardProgress);
        }
        if (data.triviaFavorites) {
          localStorage.setItem('trivia-favorites', data.triviaFavorites);
        }
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          </div>
          {unsavedChanges && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-600">Unsaved changes</span>
              <button onClick={saveSettings} className="btn-primary text-sm flex items-center gap-1">
                <Save size={14} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Flashcard Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">📚 Flashcard Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cards per Day</label>
            <select
              value={settings.cardsPerDay}
              onChange={(e) => handleSettingChange('cardsPerDay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 cards</option>
              <option value={20}>20 cards</option>
              <option value={30}>30 cards</option>
              <option value={50}>50 cards</option>
              <option value={100}>100 cards</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Google Sheets URL</label>
            <input
              type="url"
              value={settings.googleSheetUrl}
              onChange={(e) => handleSettingChange('googleSheetUrl', e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Make sure your Google Sheet is published to the web and has columns: German, English, Category, Difficulty
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoAdvance"
              checked={settings.autoAdvance}
              onChange={(e) => handleSettingChange('autoAdvance', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="autoAdvance" className="text-sm font-medium">
              Auto-advance to next card after marking
            </label>
          </div>
        </div>
      </div>

      {/* Learning Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">🎓 Learning Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showPronunciation"
              checked={settings.showPronunciation}
              onChange={(e) => handleSettingChange('showPronunciation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="showPronunciation" className="text-sm font-medium">
              Always show pronunciation guides
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="studyReminders"
              checked={settings.studyReminders}
              onChange={(e) => handleSettingChange('studyReminders', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="studyReminders" className="text-sm font-medium">
              Enable daily study reminders
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interface Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">⚙️ App Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="darkMode"
              checked={settings.darkMode}
              onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="darkMode" className="text-sm font-medium">
              Dark mode (coming soon)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enableNotifications"
              checked={settings.enableNotifications}
              onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="enableNotifications" className="text-sm font-medium">
              Enable browser notifications
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">💾 Data Management</h3>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={exportData}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={16} />
              Export Data
            </button>
            
            <label className="btn-secondary flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={resetSettings}
              className="btn-danger flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset Settings
            </button>
            
            <button
              onClick={() => {
                if (confirm('This will clear all your progress data. Are you sure?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="btn-danger flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Clear All Data
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Export your data to backup your progress and settings. You can import it later to restore your data.
          </p>
        </div>
      </div>

      {/* Help & Support */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">❓ Help & Support</h3>
        <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to set up Google Sheets</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Create a Google Sheet with columns: German, English, Category, Difficulty</li>
                <li>2. Fill in your vocabulary words</li>
                <li>3. Go to File → Share → Publish to web</li>
                <li>4. Choose "Entire Document" and "Web page" or "Comma-separated values (.csv)"</li>
                <li>5. Click "Publish" and copy the URL</li>
                <li>6. Paste the URL in the settings above</li>
              </ol>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Supported URL formats:</strong><br/>
                  • /pubhtml URLs (like yours)<br/>
                  • /edit#gid= URLs<br/>
                  • Direct spreadsheet URLs
                </p>
              </div>
            </div>

          <div className="flex gap-4 flex-wrap">
            <a
              href="https://github.com/stevenhinkel11/german_app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <ExternalLink size={16} />
              GitHub Repository
            </a>
            
            <a
              href="https://github.com/stevenhinkel11/german_app/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Report Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 