# 🇩🇪 German Language Learning App

A comprehensive web-based German language learning application with flashcards, daily words, gender practice, and cultural trivia.

## ✨ Features

### 📚 Flashcard System
- **Google Sheets Integration**: Import your vocabulary from Google Sheets
- **Daily Sets**: Randomized daily word sets (10-100 cards)
- **Progress Tracking**: Mark words as "Got it", "Not quite", or "Repeat"
- **Smart Scheduling**: Cards reappear based on your performance
- **Progress Persistence**: Your progress is saved locally

### 📅 Word of the Day
- **Intermediate Vocabulary**: Carefully selected German words
- **Multiple Drills**: Translation, example sentences, and usage practice
- **Pronunciation Guide**: IPA transcription and audio pronunciation
- **Progress Streaks**: Track your daily learning consistency

### 🎯 Gender Helper
- **Article Practice**: Master der, die, das with interactive exercises
- **Rule Reference**: Quick reference for gender patterns
- **Statistics**: Track your accuracy and improvement
- **Difficulty Levels**: Words categorized by difficulty

### 🌍 Culture Trivia
- **Fun Facts**: Learn about Germany, Austria, and Switzerland
- **Categories**: Culture, history, food, geography, traditions
- **Favorites**: Save interesting facts for later
- **Interactive**: Click through facts from all German-speaking countries

### ⚙️ Customization
- **Flexible Settings**: Adjust cards per day, enable features
- **Data Export/Import**: Backup and restore your progress
- **Google Sheets Setup**: Easy integration with your vocabulary lists

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/stevenhinkel11/german_app.git
   cd german_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Go to `http://localhost:5173`
   - Start learning German! 🎉

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## 🌐 Deployment

### GitHub Pages
1. Update the `base` in `vite.config.ts` to match your repository name
2. Run the deploy command:
   ```bash
   npm run deploy
   ```

### Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 📊 Google Sheets Integration

### Setting up your vocabulary sheet:

1. **Create a Google Sheet** with these columns:
   - **German**: The German word/phrase
   - **English**: English translation
   - **Category**: Word category (nouns, verbs, adjectives, etc.)
   - **Difficulty**: Number 1-5 (1 = easy, 5 = hard)

2. **Example sheet structure**:
   ```
   German          | English        | Category    | Difficulty
   das Haus        | the house      | nouns       | 1
   laufen          | to run         | verbs       | 2
   schwierig       | difficult      | adjectives  | 3
   ```

3. **Publish to web**:
   - Go to `File` → `Share` → `Publish to web`
   - Choose "Entire Document" and "Comma-separated values (.csv)"
   - Click "Publish" and copy the URL

4. **Add to app**:
   - Go to Settings in the app
   - Paste the URL in "Google Sheets URL"
   - Click "Load from Google Sheets"

## 🎮 How to Use

### Flashcards
1. Set your daily card count in Settings
2. Click "Load from Google Sheets" or use the sample words
3. Study your daily set
4. Mark each card as "Got it", "Not quite", or "Repeat"
5. Your progress is automatically saved

### Word of the Day
1. Learn a new intermediate German word daily
2. Practice with translation, example, and usage drills
3. Use the pronunciation button to hear correct pronunciation
4. Build your daily streak!

### Gender Helper
1. Practice German article usage (der, die, das)
2. Choose the correct article for each noun
3. Check the reference guide for gender rules
4. Track your accuracy over time

### Culture Trivia
1. Discover fun facts about German-speaking countries
2. Filter by country (Germany, Austria, Switzerland)
3. Save interesting facts to your favorites
4. Learn about culture, history, food, and traditions

## 🛠️ Technical Details

### Built With
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **localStorage** for data persistence

### Project Structure
```
src/
├── components/
│   ├── FlashcardApp.tsx      # Main flashcard functionality
│   ├── WordOfTheDay.tsx      # Daily word feature
│   ├── GenderHelper.tsx      # Article practice
│   ├── CultureTrivia.tsx     # Cultural facts
│   └── SettingsPanel.tsx     # App configuration
├── App.tsx                   # Main app component
├── main.tsx                  # React entry point
└── index.css                 # Global styles
```

### Key Features
- **Responsive Design**: Works on desktop and mobile
- **Offline Capable**: All data stored locally
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: Keyboard navigation and screen reader support

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

- 🐛 [Report bugs](https://github.com/stevenhinkel11/german_app/issues)
- 💡 [Request features](https://github.com/stevenhinkel11/german_app/issues)
- 📖 [Documentation](https://github.com/stevenhinkel11/german_app/wiki)

## 🎯 Roadmap

- [ ] Mobile app version
- [ ] Spaced repetition algorithm
- [ ] Audio recordings for all words
- [ ] Grammar exercises
- [ ] User accounts and cloud sync
- [ ] Offline mode
- [ ] More languages support

---

**Happy Learning! Viel Erfolg beim Deutschlernen! 🇩🇪** 