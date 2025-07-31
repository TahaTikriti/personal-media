import type { MediaItem, MediaType } from '../types';
import { generateId } from '../utils';

// Sample mock data for testing the app
const mockDataSamples: Omit<MediaItem, 'id' | 'dateAdded' | 'dateUpdated'>[] = [
  // Movies
  {
    title: "Inception",
    creator: "Christopher Nolan",
    type: "movie",
    genre: "Sci-Fi",
    releaseDate: "2010-07-16",
    status: "completed",
    rating: 9,
    notes: "A mind-bending thriller about dreams within dreams. Brilliant cinematography and complex narrative structure.",
    tags: ["sci-fi", "thriller", "mind-bending", "leonardo-dicaprio", "christopher-nolan"]
  },
  {
    title: "The Shawshank Redemption",
    creator: "Frank Darabont",
    type: "movie",
    genre: "Drama",
    releaseDate: "1994-09-23",
    status: "completed",
    rating: 10,
    notes: "A powerful story of hope and friendship in the most unlikely place. Timeless classic.",
    tags: ["drama", "prison", "friendship", "hope", "classic"]
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    creator: "Bob Persichetti",
    type: "movie",
    genre: "Animation",
    releaseDate: "2018-12-14",
    status: "owned",
    rating: 8,
    notes: "Revolutionary animation style with a fresh take on the Spider-Man story.",
    tags: ["animation", "superhero", "spider-man", "multiverse", "family"]
  },

  // TV Shows
  {
    title: "Breaking Bad",
    creator: "Vince Gilligan",
    type: "tv-show",
    genre: "Drama",
    releaseDate: "2008-01-20",
    status: "completed",
    rating: 10,
    notes: "The transformation of Walter White from teacher to drug kingpin. Masterful storytelling.",
    tags: ["drama", "crime", "transformation", "walter-white", "intense"]
  },
  {
    title: "The Office",
    creator: "Greg Daniels",
    type: "tv-show",
    genre: "Comedy",
    releaseDate: "2005-03-24",
    status: "currently-using",
    rating: 9,
    notes: "Hilarious mockumentary about office life. Perfect comfort show for rewatching.",
    tags: ["comedy", "mockumentary", "office", "workplace", "comfort-show"]
  },
  {
    title: "Stranger Things",
    creator: "The Duffer Brothers",
    type: "tv-show",
    genre: "Sci-Fi",
    releaseDate: "2016-07-15",
    status: "owned",
    rating: 8,
    notes: "80s nostalgia meets supernatural horror. Great ensemble cast and atmosphere.",
    tags: ["sci-fi", "horror", "80s", "supernatural", "netflix"]
  },

  // Books
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    creator: "Douglas Adams",
    type: "book",
    genre: "Comedy",
    releaseDate: "1979-10-12",
    status: "completed",
    rating: 9,
    notes: "Hilarious sci-fi comedy about the universe and everything. Don't forget your towel!",
    tags: ["sci-fi", "comedy", "space", "british-humor", "classic"]
  },
  {
    title: "Dune",
    creator: "Frank Herbert",
    type: "book",
    genre: "Sci-Fi",
    releaseDate: "1965-06-01",
    status: "currently-using",
    rating: 9,
    notes: "Epic space opera about politics, religion, and ecology on the desert planet Arrakis.",
    tags: ["sci-fi", "epic", "space-opera", "politics", "desert"]
  },
  {
    title: "The Name of the Wind",
    creator: "Patrick Rothfuss",
    type: "book",
    genre: "Fantasy",
    releaseDate: "2007-03-27",
    status: "wishlist",
    notes: "First book in The Kingkiller Chronicle. Beautiful prose and compelling magic system.",
    tags: ["fantasy", "magic", "adventure", "storytelling", "kingkiller"]
  },

  // Games
  {
    title: "The Witcher 3: Wild Hunt",
    creator: "CD Projekt RED",
    type: "game",
    genre: "RPG",
    releaseDate: "2015-05-19",
    status: "completed",
    rating: 10,
    notes: "Masterpiece RPG with incredible world-building, characters, and side quests.",
    tags: ["rpg", "fantasy", "open-world", "witcher", "masterpiece"]
  },
  {
    title: "Hades",
    creator: "Supergiant Games",
    type: "game",
    genre: "Action",
    releaseDate: "2020-09-17",
    status: "currently-using",
    rating: 9,
    notes: "Perfect roguelike with amazing art, music, and narrative integration.",
    tags: ["roguelike", "action", "mythology", "indie", "supergiant"]
  },
  {
    title: "Cyberpunk 2077",
    creator: "CD Projekt RED",
    type: "game",
    genre: "RPG",
    releaseDate: "2020-12-10",
    status: "owned",
    rating: 7,
    notes: "Ambitious cyberpunk RPG with great atmosphere, though had a rocky launch.",
    tags: ["rpg", "cyberpunk", "futuristic", "open-world", "cd-projekt"]
  },

  // Music
  {
    title: "Dark Side of the Moon",
    creator: "Pink Floyd",
    type: "music",
    genre: "Rock",
    releaseDate: "1973-03-01",
    status: "owned",
    rating: 10,
    notes: "Progressive rock masterpiece exploring themes of conflict, greed, and mental illness.",
    tags: ["progressive-rock", "concept-album", "classic", "psychedelic", "masterpiece"]
  },
  {
    title: "Blonde",
    creator: "Frank Ocean",
    type: "music",
    genre: "R&B",
    releaseDate: "2016-08-20",
    status: "completed",
    rating: 9,
    notes: "Experimental R&B album with innovative production and deeply personal lyrics.",
    tags: ["r&b", "experimental", "alternative", "personal", "innovative"]
  },
  {
    title: "OK Computer",
    creator: "Radiohead",
    type: "music",
    genre: "Alternative",
    releaseDate: "1997-06-16",
    status: "completed",
    rating: 10,
    notes: "Prophetic album about technology and alienation. Influential alternative rock.",
    tags: ["alternative-rock", "experimental", "technology", "influential", "90s"]
  }
];

// Generate mock data with proper IDs and timestamps
export const generateMockData = (): MediaItem[] => {
  const now = new Date();
  
  return mockDataSamples.map((item) => {
    // Spread dates over the past 3 months for realistic demo
    const daysAgo = Math.floor(Math.random() * 90);
    const dateAdded = new Date(now);
    dateAdded.setDate(dateAdded.getDate() - daysAgo);
    
    // Some items were updated after being added
    const wasUpdated = Math.random() > 0.7; // 30% chance of being updated
    const dateUpdated = wasUpdated 
      ? new Date(dateAdded.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Updated within a week
      : dateAdded;
    
    return {
      ...item,
      id: generateId(),
      dateAdded: dateAdded.toISOString(),
      dateUpdated: dateUpdated.toISOString()
    };
  });
};

// Get a smaller sample for quick testing
export const generateSampleData = (count: number = 5): MediaItem[] => {
  const allMockData = generateMockData();
  const shuffled = [...allMockData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get mock data by type for targeted testing
export const getMockDataByType = (type: MediaType, count: number = 3): MediaItem[] => {
  const allMockData = generateMockData();
  const filtered = allMockData.filter(item => item.type === type);
  return filtered.slice(0, count);
};

// Demo scenarios for different use cases
export const getDemoScenarios = () => ({
  quickDemo: {
    name: "Quick Demo (5 items)",
    description: "Perfect for showcasing core features",
    data: generateSampleData(5)
  },
  
  fullCollection: {
    name: "Full Collection (15 items)",
    description: "Complete demo with all media types",
    data: generateMockData()
  },
  
  movieLover: {
    name: "Movie Enthusiast",
    description: "Movie-focused collection",
    data: [
      ...getMockDataByType("movie", 3),
      ...generateSampleData(2).filter(item => item.type !== "movie")
    ]
  },
  
  gamer: {
    name: "Gaming Collection",
    description: "Game-focused collection",
    data: [
      ...getMockDataByType("game", 3),
      ...generateSampleData(2).filter(item => item.type !== "game")
    ]
  },
  
  bookworm: {
    name: "Book Collection",
    description: "Book-focused collection",
    data: [
      ...getMockDataByType("book", 3),
      ...generateSampleData(2).filter(item => item.type !== "book")
    ]
  }
});
