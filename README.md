# 📚 Personal Media Collection

A modern, AI-powered web application for tracking and organizing your personal media collection including movies, TV shows, music, games, and books. Built with React, TypeScript, and Tailwind CSS.

![Personal Media Collection](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-38B2AC)

## ✨ Features

### 📖 Core Features
- **Multiple Media Types**: Track movies, TV shows, music albums, video games, and books
- **Smart Organization**: Sort and filter by title, creator, genre, release date, rating, and status
- **Status Tracking**: Mark items as owned, wishlist, currently using, or completed
- **Rating System**: Rate your media from 1-5 stars
- **Tags & Notes**: Add custom tags and personal notes to each item
- **Statistics Dashboard**: View collection insights and breakdowns by type, status, and ratings

### 🤖 AI-Powered Features
- **Auto-Complete**: AI suggests missing information like genre, release date, and creator
- **Smart Enrichment**: Automatically populate media details using AI
- **Intelligent Search**: Enhanced search capabilities with AI assistance

### 🔧 Advanced Features
- **Bulk Operations**: Select multiple items for bulk deletion
- **Data Management**: Import/export your collection as JSON
- **Demo Data**: Try the app with sample data
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Efficient navigation with hotkeys
- **Local Storage**: Your data persists between sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Optional: OpenAI API key for AI features

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd personal-media
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
   - Navigate to `http://localhost:5173`
   - The app is ready to use!

## 🤖 Setting Up AI Features (Optional)

The app works great without AI, but you can enable enhanced features:

1. **Get OpenAI API Key**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key (starts with `sk-...`)

2. **Configure Environment**
   - Create a `.env.local` file in the project root
   - Add your API key:
     ```
     VITE_OPENAI_API_KEY=sk-your-actual-key-here
     ```
   - Restart the development server

3. **AI Features Available**
   - Auto-complete missing media information
   - Smart genre suggestions
   - Enhanced data enrichment

For detailed AI setup instructions, see [AI_SETUP.md](./AI_SETUP.md).

## 📱 How to Use

### Getting Started

1. **First Visit**
   - Click "Try Demo Data" to see the app in action with sample media
   - Or click "Add Media" to start with your own collection

2. **Adding Media**
   - Click the "Add Media" button
   - Fill in the basic details (title, creator, type)
   - Use the AI ✨ button to auto-complete missing information
   - Add custom tags, ratings, and notes
   - Save your item

### Managing Your Collection

#### Search & Filter
- **Search**: Type in the search box to find items by title, creator, or tags
- **Filter by Type**: Select specific media types (movies, books, etc.)
- **Filter by Status**: Show only owned, wishlist, or completed items
- **Sort Options**: Sort by title, creator, release date, rating, or date added

#### Editing Items
- Click the edit (pencil) icon on any media card
- Modify any information and save changes
- Use AI assistance to enrich data

#### Bulk Operations
- Click "Bulk Select & Delete" when you have 5+ items
- Click items to select them (checkbox appears)
- Use "Select All" to select all visible items
- Delete multiple items at once
- Press Esc to exit selection mode

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+A` | Select all items (in selection mode) |
| `Delete` | Delete selected items (in selection mode) |
| `Esc` | Exit selection mode |

### Data Management

#### Export Your Collection
- Click the "Export" button in the header
- Downloads a JSON file with all your media data
- Filename includes the current date

#### Import Data
- Click "Import" and select a previously exported JSON file
- Supports any valid media collection JSON format
- Your existing data will be replaced

#### Demo Data
- Click "Demo Data" to try different sample collections
- Choose to replace current data or add to existing collection
- Great for testing features or getting inspiration

## 🎯 Media Types & Statuses

### Supported Media Types
- **Movies**: Films and documentaries
- **TV Shows**: Series and mini-series
- **Music**: Albums, EPs, and compilations
- **Games**: Video games for any platform
- **Books**: Physical books, ebooks, audiobooks

### Status Options
- **Owned**: Items you currently own
- **Wishlist**: Items you want to acquire
- **Currently Using**: Items you're actively consuming
- **Completed**: Finished movies, read books, completed games

## 📊 Statistics Dashboard

The statistics panel shows:
- **Total Items**: Complete count of your collection
- **By Type**: Breakdown of movies, books, games, etc.
- **By Status**: Distribution across owned, wishlist, etc.
- **Average Rating**: Your overall rating across all items
- **Recent Activity**: Newly added items

Toggle the stats panel with the "Show/Hide Stats" button.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── MediaCard.tsx   # Individual media item display
│   ├── MediaForm.tsx   # Add/edit media form
│   ├── SearchAndFilter.tsx # Search and filtering
│   ├── Statistics.tsx  # Collection statistics
│   └── MockDataModal.tsx # Demo data interface
├── hooks/              # Custom React hooks
│   └── useMediaCollection.ts # Collection management
├── services/           # External services
│   ├── aiService.ts    # OpenAI integration
│   └── aiSearchService.ts # AI search features
├── data/               # Sample data
│   └── mockData.ts     # Demo collections
├── types.ts            # TypeScript definitions
├── constants.ts        # App constants
└── utils.ts            # Utility functions
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Production Deployment
npm run build        # Creates optimized build in 'dist/'
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard (for AI features)
4. Deploy automatically on every push

### Other Platforms
1. Run `npm run build`
2. Deploy the `dist/` folder to any static hosting service
3. Configure environment variables as needed

## 💡 Tips & Best Practices

### Organizing Your Collection
- **Use Tags**: Add genres, franchises, or custom categories
- **Rate Everything**: Helps with sorting and recommendations
- **Add Notes**: Track where you heard about items, thoughts, etc.
- **Regular Updates**: Keep status current as you consume media

### Efficient Usage
- **Bulk Operations**: Use for managing large collections
- **AI Assistance**: Let AI fill in details to save time
- **Export Regularly**: Backup your collection data
- **Filter Wisely**: Use combinations of filters for specific views

### Data Tips
- **Consistent Naming**: Use consistent creator names (e.g., "Christopher Nolan" vs "C. Nolan")
- **Specific Genres**: Be specific with genres for better filtering
- **Date Format**: Use YYYY format for release dates for better sorting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔧 Technical Details

- **Frontend**: React 19.1 with TypeScript
- **Styling**: Tailwind CSS 4.1
- **Build Tool**: Vite 7.0
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT models
- **Storage**: Browser LocalStorage

## 📞 Support

If you encounter any issues or have questions:
1. Check this README for common solutions
2. Review the [AI_SETUP.md](./AI_SETUP.md) for AI-related issues
3. Create an issue in the project repository

---

Made with ❤️ for media enthusiasts everywhere!
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
