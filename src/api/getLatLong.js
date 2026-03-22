const BASE_URL = 'https://api.olamaps.io';

export const fetchLatLongByAddr = async (address) => {
    try {
        const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;

        const url = `${BASE_URL}/places/v1/geocode?address=${encodeURIComponent(address)}&language=English&api_key=${apiKey}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching lat long:', error);
        throw error;
    }
};