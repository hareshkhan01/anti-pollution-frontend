// API setup for fetching routes

const BASE_URL = 'http://localhost:3300';

/**
 * Fetches actual routes from the localhost API 
 * @param {Object} postData Payload for the POST request
 * @returns Promise that resolves to the API response
 */
export const fetchRoutesData = async (postData) => {
  try {
    // Note: Update the exact endpoint string if your API expects something other than /api/routes
    // Example: /route or /api/v1/routes
    const response = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching actual routes data:', error);
    throw error;
  }
};
