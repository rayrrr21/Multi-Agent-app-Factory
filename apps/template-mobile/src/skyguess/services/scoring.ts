// Geodesic Haversine Distance & Configurable Score Decay for SkyGuess (Correction 1)

export const DEFAULT_DECAY_CONSTANT = 1000;

/**
 * Calculates the great-circle distance between two points on Earth (in km)
 * using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Calculates score based on distanceKm and configurable decay constant:
 * Score = round(10,000 * Math.exp(-distanceKm / decayConstant))
 * Target behavior with k=1000:
 * <1 km = ~10,000
 * 10 km = ~9,900
 * 50 km = ~9,512
 * 200 km = ~8,187
 * 500 km = ~6,065
 * 1,000 km = ~3,679
 */
export function calculateDailyScore(
  distanceKm: number,
  decayConstant: number = DEFAULT_DECAY_CONSTANT
): number {
  if (distanceKm <= 0.5) return 10000;
  const score = Math.round(10000 * Math.exp(-distanceKm / decayConstant));
  return Math.max(0, Math.min(10000, score));
}
