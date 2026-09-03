export type TerrainType =
  | 'Dense Urban'
  | 'Desert'
  | 'Tropical Coast'
  | 'Alpine Mountain'
  | 'Island'
  | 'Agricultural Geometry'
  | 'River Delta'
  | 'Historic Urban'
  | 'Volcanic Arctic'
  | 'Savanna Plains';

export type UsageStatus = 'development' | 'approved-production';

export interface LocationRecord {
  id: string;
  name: string;
  city: string;
  region: string;
  country: string;
  continent: string;
  terrain: TerrainType;
  latitude: number;
  longitude: number;
  imageUrl: string;
  crop30k?: string; // High altitude crop (least context)
  crop10k?: string; // Mid altitude crop
  crop3k?: string;  // Low altitude crop (full context)
  fact: string;
  distractors: {
    city: string;
    region: string;
    country: string;
    continent: string;
    terrain: TerrainType;
  };
  // Explicit licensing & metadata (Correction 3)
  imageSource: string;
  license: string;
  attribution: string;
  sourceReference: string;
  usageStatus: UsageStatus;
  exifStripped: boolean;
}

export interface DailyGuessResult {
  guessLat: number;
  guessLng: number;
  distanceKm: number;
  score: number;
  location: LocationRecord;
}

export interface SkyRushQuestion {
  prompt: string;
  optionA: string;
  optionB: string;
  correct: 'A' | 'B';
  category: 'Country' | 'Region' | 'City' | 'Terrain';
}

export interface SkyRushRunState {
  distanceMiles: number;
  streak: number;
  combo: number;
  lives: number;
  correctCount: number;
  isOver: boolean;
}
