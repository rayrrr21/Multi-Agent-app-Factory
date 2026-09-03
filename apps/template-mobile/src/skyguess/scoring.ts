// Geodesic distance calculation & distance-decay scoring for SkyGuess

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
  const R = 6371; // Earth's radius in kilometers
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

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculates the score (0 to 10,000 points) based on geodesic distance (in km).
 * Smooth exponential decay:
 * <1 km = ~10,000 pts
 * <50 km = ~8,200 pts
 * <200 km = ~4,500 pts
 * <500 km = ~1,350 pts
 * >2000 km = near 0 pts
 */
export function calculateDailyScore(distanceKm: number): number {
  if (distanceKm <= 0.5) return 10000;
  const score = Math.round(10000 * Math.exp(-distanceKm / 250));
  return Math.max(0, Math.min(10000, score));
}

/**
 * Estimates top percentile based on score (10,000 pts = top 1%).
 */
export function calculatePercentile(score: number): number {
  if (score >= 9500) return 1;
  if (score >= 8500) return 5;
  if (score >= 7000) return 12;
  if (score >= 5000) return 25;
  if (score >= 3000) return 42;
  if (score >= 1000) return 65;
  return 88;
}
