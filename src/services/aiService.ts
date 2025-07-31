import OpenAI from 'openai';
import type { MediaType } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

// Check if API key is configured
export const isAIEnabled = (): boolean => {
  return !!import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';
};

// AI-powered media information enrichment
export interface AIEnrichmentResult {
  genre?: string;
  releaseDate?: string;
  description?: string;
  tags?: string[];
  rating?: number;
  success: boolean;
  error?: string;
}

export const enrichMediaData = async (
  title: string, 
  creator: string, 
  type: MediaType
): Promise<AIEnrichmentResult> => {
  if (!isAIEnabled()) {
    return { 
      success: false, 
      error: 'AI features not configured. Please add your OpenAI API key.' 
    };
  }

  try {
    const prompt = createEnrichmentPrompt(title, creator, type);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides accurate information about movies, TV shows, books, music, and games. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      return { success: false, error: 'No response from AI' };
    }

    // Parse AI response
    const parsedData = parseAIResponse(aiResponse);
    return {
      ...parsedData,
      success: true
    };

  } catch (error) {
    console.error('AI enrichment error:', error);
    return { 
      success: false, 
      error: 'Failed to get AI suggestions. Please try again.' 
    };
  }
};

// Create prompt based on media type
const createEnrichmentPrompt = (title: string, creator: string, type: MediaType): string => {
  const typeMap = {
    'movie': 'movie',
    'tv-show': 'TV show',
    'music': 'music album or song',
    'game': 'video game',
    'book': 'book'
  };

  return `Please provide information about the ${typeMap[type]} titled "${title}" by ${creator}. 

Return a JSON object with these fields:
- genre: Main genre (single word like "Action", "Drama", "RPG", etc.)
- releaseDate: Release date in YYYY-MM-DD format (if known)
- description: Brief 1-2 sentence description
- tags: Array of 3-5 relevant tags/keywords
- rating: Estimated rating out of 10 based on critical consensus (if widely known)

Example format:
{
  "genre": "Action",
  "releaseDate": "2023-06-15",
  "description": "A thrilling action movie about...",
  "tags": ["action", "thriller", "adventure"],
  "rating": 8.5
}

If you're not certain about any field, omit it from the response. Only include information you're confident about.`;
};

// Parse AI response into structured data
const parseAIResponse = (response: string): Partial<AIEnrichmentResult> => {
  try {
    // Clean up the response - remove any markdown formatting
    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(cleanResponse);
    
    return {
      genre: data.genre,
      releaseDate: data.releaseDate,
      description: data.description,
      tags: Array.isArray(data.tags) ? data.tags : [],
      rating: typeof data.rating === 'number' ? data.rating : undefined
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    // Fallback: try to extract genre from response text
    const genreMatch = response.match(/genre["\s]*:?\s*["\s]*([^",\n]+)/i);
    return {
      genre: genreMatch ? genreMatch[1].trim() : undefined
    };
  }
};

// Quick genre suggestion (lighter AI call)
export const quickGenreSuggestion = async (title: string, type: MediaType): Promise<string | null> => {
  if (!isAIEnabled()) return null;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `What genre is the ${type} "${title}"? Respond with just one word (like Action, Drama, Comedy, etc.)`
        }
      ],
      max_tokens: 10,
      temperature: 0.1
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('Quick genre suggestion error:', error);
    return null;
  }
};
