import OpenAI from 'openai';
import type { MediaItem } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface SearchSuggestion {
  type: 'filter' | 'natural';
  query: string;
  description: string;
  filters?: {
    type?: string;
    genre?: string;
    status?: string;
    yearRange?: [number, number];
  };
}

export async function enhanceSearchQuery(
  query: string,
  mediaItems: MediaItem[]
): Promise<{
  enhancedQuery: string;
  suggestions: SearchSuggestion[];
  matchingItems: MediaItem[];
}> {
  if (!import.meta.env.VITE_OPENAI_API_KEY || !query.trim()) {
    return {
      enhancedQuery: query,
      suggestions: [],
      matchingItems: []
    };
  }

  try {
    // Get unique genres, types, and other metadata from existing items
    const availableGenres = [...new Set(mediaItems.flatMap(item => item.genre ? [item.genre] : []))];
    const availableTypes = [...new Set(mediaItems.map(item => item.type))];
    const availableCreators = [...new Set(mediaItems.map(item => item.creator))];

    const prompt = `
You are a smart search assistant for a personal media collection. 

User's query: "${query}"

Available media types: ${availableTypes.join(', ')}
Available genres: ${availableGenres.join(', ')}
Sample creators: ${availableCreators.slice(0, 10).join(', ')}

Analyze the user's search query and provide:
1. An enhanced search query (if the original can be improved)
2. Search suggestions that might help find what they're looking for
3. Identify key search terms for matching

Respond with a JSON object like this:
{
  "enhancedQuery": "improved version of the query",
  "keyTerms": ["term1", "term2", "term3"],
  "suggestions": [
    {
      "type": "filter",
      "query": "suggested search",
      "description": "What this search would find",
      "filters": {
        "type": "movie",
        "genre": "action"
      }
    }
  ]
}

Focus on understanding natural language like:
- "sci-fi movies" → type: movie, genre: science fiction
- "books I haven't read" → type: book, status: to-watch
- "games from the 90s" → type: game, year range
- "Christopher Nolan films" → creator search
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3
    });

    const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
    
    // Perform semantic matching on the collection
    const matchingItems = performSemanticSearch(query, mediaItems, aiResponse.keyTerms || []);

    return {
      enhancedQuery: aiResponse.enhancedQuery || query,
      suggestions: aiResponse.suggestions || [],
      matchingItems
    };

  } catch (error) {
    console.error('AI search enhancement error:', error);
    // Fallback to basic search
    return {
      enhancedQuery: query,
      suggestions: [],
      matchingItems: performBasicSearch(query, mediaItems)
    };
  }
}

function performSemanticSearch(query: string, items: MediaItem[], keyTerms: string[]): MediaItem[] {
  const searchTerms = [
    ...query.toLowerCase().split(' '),
    ...keyTerms.map(term => term.toLowerCase())
  ];

  return items.filter(item => {
    const searchableText = [
      item.title,
      item.creator,
      item.genre,
      item.description,
      item.type,
      item.status,
      ...(item.tags || [])
    ].join(' ').toLowerCase();

    return searchTerms.some(term => 
      searchableText.includes(term) ||
      // Fuzzy matching for similar words
      searchableText.split(' ').some(word => 
        word.includes(term) || term.includes(word)
      )
    );
  });
}

function performBasicSearch(query: string, items: MediaItem[]): MediaItem[] {
  const searchTerm = query.toLowerCase();
  return items.filter(item => {
    const searchableText = [
      item.title,
      item.creator,
      item.genre,
      item.description,
      item.type,
      ...(item.tags || [])
    ].join(' ').toLowerCase();

    return searchableText.includes(searchTerm);
  });
}

// Generate smart search suggestions based on user's collection
export function generateSearchSuggestions(mediaItems: MediaItem[]): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];
  
  // Get common genres and types
  const genreCounts = mediaItems.reduce((acc, item) => {
    if (item.genre) {
      acc[item.genre] = (acc[item.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const typeCounts = mediaItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Add genre-based suggestions
  Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .forEach(([genre, count]) => {
      suggestions.push({
        type: 'filter',
        query: genre.toLowerCase(),
        description: `${count} ${genre} items`,
        filters: { genre }
      });
    });

  // Add type-based suggestions
  Object.entries(typeCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      suggestions.push({
        type: 'filter',
        query: `my ${type}s`,
        description: `${count} ${type}s in collection`,
        filters: { type }
      });
    });

  // Add status suggestions
  suggestions.push(
    {
      type: 'filter',
      query: 'to watch',
      description: 'Items you plan to watch/read/play',
      filters: { status: 'to-watch' }
    },
    {
      type: 'filter',
      query: 'completed',
      description: 'Items you\'ve finished',
      filters: { status: 'completed' }
    }
  );

  return suggestions.slice(0, 6);
}
