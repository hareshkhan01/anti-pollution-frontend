const API_KEY = import.meta.env.VITE_OLA_MAPS_API_KEY;

/**
 * Geocodes an address string to { lat, lng } using OlaMaps.
 * @param {string} address
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export async function geocodeAddress(address) {
  const url = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(address)}&api_key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  const loc = data?.geocodingResults?.[0]?.geometry?.location;
  if (!loc) throw new Error(`No results for "${address}"`);
  return { lat: loc.lat, lng: loc.lng };
}
