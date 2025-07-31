# AI Setup Instructions

## 🤖 Setting up AI Features

### 1. Get Your OpenAI API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### 2. Local Development Setup
1. Open `.env.local` in your project root
2. Replace `your_openai_api_key_here` with your actual API key:
   ```
   VITE_OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Save the file
4. Restart your development server: `npm run dev`

### 3. Vercel Production Setup
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: `sk-your-actual-key-here`
   - **Environment**: Production (and Preview if you want)
4. Click **Save**
5. Redeploy your app or trigger a new deployment

### 4. How to Use AI Features
1. **Add New Media**: Click "Add Media" button
2. **Fill Basic Info**: Enter Title, Creator, and select Type
3. **AI Enhancement**: Click the "✨ Enhance with AI" button
4. **Auto-Population**: Watch as AI fills in:
   - Genre (e.g., "Action", "Drama")
   - Release Date (if known)
   - Description (brief summary)
   - Relevant Tags
   - Rating (if widely known)

### 5. AI Features Included
- **Smart Data Enhancement**: Automatic form filling
- **Intelligent Genre Detection**: Real-time suggestions
- **Content Analysis**: Detailed information extraction
- **Cost Effective**: Uses GPT-3.5-turbo for fast, affordable responses

### 6. Fallback Behavior
- **Without API Key**: App works with basic keyword-based suggestions
- **AI Errors**: Form remains fully functional for manual entry
- **Network Issues**: Graceful error handling with user feedback

### 7. Security Notes
- ✅ API key is only used client-side for demo purposes
- ✅ Never commit API keys to git (protected by .gitignore)
- ✅ Environment variables are secure in Vercel
- 🔄 For production apps, consider server-side API calls

## 🎯 Next Steps
Once AI features are working, we can add:
- **Smart Recommendations**: "You might also like..." 
- **Bulk Import with AI**: Upload CSV and auto-enhance all items
- **Natural Language Search**: "Show me sci-fi movies from the 90s"
- **Collection Analysis**: AI insights about your collection

---
**Ready to test?** Add your API key and try adding a movie like "Inception" by "Christopher Nolan"!
