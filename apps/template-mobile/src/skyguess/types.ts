export interface LocationRecord {
  id: string;
  name: string;
  city: string;
  region: string;
  country: string;
  continent: string;
  terrain: 'Desert' | 'Forest' | 'Coastal' | 'Mountain' | 'Urban' | 'Plains' | 'Island' | 'Arid';
  latitude: number;
  longitude: number;
  imageUrl: string;
  fact: string;
  distractors: {
    city?: string;
    region?: string;
    country?: string;
    continent?: string;
    terrain?: string;
  };
}

export interface DailyGuessResult {
  guessLat: number;
  guessLng: number;
  distanceKm: number;
  score: number;
  percentile: number;
  location: LocationRecord;
}

export interface SkyRushRound {
  id: string;
  location: LocationRecord;
  questionText: string;
  optionA: string;
  optionB: string;
  correctOption: 'A' | 'B';
  category: 'TERRAIN' | 'CONTINENT' | 'COUNTRY' | 'REGION' | 'CITY' | 'ALTITUDE';
  altitudeLevel?: '30,000 FT' | '10,000 FT' | '3,000 FT';
  multiplier: number;
}

export interface SkyRushRunState {
  distanceMiles: number;
  streak: number;
  combo: number;
  lives: number;
  correctCount: number;
  isOver: boolean;
  crashLocation?: string;
}
