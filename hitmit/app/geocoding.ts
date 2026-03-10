// ============================================================================
// GEOCODING – Stadt → Koordinaten
// ============================================================================

export interface LatLng {
  lat: number;
  lng: number;
}

const CITY_COORDS: Record<string, LatLng> = {
  münchen: { lat: 48.1351, lng: 11.582 },
  stuttgart: { lat: 48.7758, lng: 9.1829 },
  ingolstadt: { lat: 48.7665, lng: 11.4258 },
  wolfsburg: { lat: 52.4227, lng: 10.7865 },
  hamburg: { lat: 53.5511, lng: 9.9937 },
  berlin: { lat: 52.52, lng: 13.405 },
  frankfurt: { lat: 50.1109, lng: 8.6821 },
  köln: { lat: 50.9375, lng: 6.9603 },
  düsseldorf: { lat: 51.2277, lng: 6.7735 },
  nürnberg: { lat: 49.4521, lng: 11.0767 },
};

export function getCoordsByCity(city: string): LatLng | null {
  const key = city.trim().toLowerCase();
  return CITY_COORDS[key] ?? null;
}

export async function geocodeCity(city: string): Promise<LatLng | null> {
  const cached = getCoordsByCity(city);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)},Germany&limit=1`,
      { headers: { "User-Agent": "HITMIT/1.0" } },
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Nominatim unavailable – return null
  }
  return null;
}
