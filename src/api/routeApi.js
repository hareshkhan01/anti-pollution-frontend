// API setup for fetching routes

const BASE_URL = 'http://10.33.229.167:3000';

/**
 * Fetches actual routes from the localhost API 
 * @param {Object} postData Payload for the POST request
 * @returns Promise that resolves to the API response
 */
export const fetchRoutesData = async (postData) => {
  try {
    // Note: Update the exact endpoint string if your API expects something other than /api/routes
    // Example: /route or /api/v1/routes
    console.log("Sending routes payload to API:", postData);
    const response = await (fetch)(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.text();
        console.error("API Error Body:", errorData);
        const parsed = JSON.parse(errorData);
        if (parsed.error) {
          errorMessage = parsed.error;
        } else {
          errorMessage += `. Details: ${errorData}`;
        }
      } catch (e) {
        console.error("Error parsing API error body:", e);
        
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching actual routes data:', error);
    throw error;
  }
};
