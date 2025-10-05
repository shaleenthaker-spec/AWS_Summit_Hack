// Frontend Integration Example
// Replace YOUR_API_URL with your actual deployed API Gateway URL

const API_BASE_URL = 'https://YOUR_API_URL/prod';

class FacilityService {
  // Find nearby facilities of a specific type
  async findNearby(facilityType, lat, lon, limit = 3) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/facilities/nearby?lat=${lat}&lon=${lon}&facilityType=${facilityType}&limit=${limit}`
      );
      const data = await response.json();
      return data.facilities;
    } catch (error) {
      console.error('Error finding nearby facilities:', error);
      return [];
    }
  }

  // Submit a rating for a facility
  async submitRating(facilityId, rating) {
    try {
      const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating })
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }

  // Get facility details
  async getFacility(facilityId) {
    try {
      const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting facility:', error);
      throw error;
    }
  }

  // Create a new facility
  async createFacility(facilityData) {
    try {
      const response = await fetch(`${API_BASE_URL}/facilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
  }
}

// Usage Examples for Your Frontend

const facilityService = new FacilityService();

// When user clicks "Find Bathrooms" button
async function onFindBathroomsClick() {
  const userLocation = await getUserLocation(); // Your geolocation function
  const bathrooms = await facilityService.findNearby('bathroom', userLocation.lat, userLocation.lon, 3);
  displayNearbyFacilities(bathrooms);
}

// When user clicks "Find Water Fountains" button
async function onFindWaterFountainsClick() {
  const userLocation = await getUserLocation();
  const fountains = await facilityService.findNearby('water_fountain', userLocation.lat, userLocation.lon, 3);
  displayNearbyFacilities(fountains);
}

// When user clicks "Find Hand Sanitizers" button
async function onFindHandSanitizersClick() {
  const userLocation = await getUserLocation();
  const sanitizers = await facilityService.findNearby('hand_sanitizer', userLocation.lat, userLocation.lon, 3);
  displayNearbyFacilities(sanitizers);
}

// When user clicks "Find Sinks" button
async function onFindSinksClick() {
  const userLocation = await getUserLocation();
  const sinks = await facilityService.findNearby('sink', userLocation.lat, userLocation.lon, 3);
  displayNearbyFacilities(sinks);
}

// When user submits a rating
async function onSubmitRating(facilityId, rating) {
  try {
    const result = await facilityService.submitRating(facilityId, rating);
    showSuccessMessage(`Rating submitted! New average: ${result.newAverage}`);
  } catch (error) {
    showErrorMessage('Failed to submit rating');
  }
}

// Helper function to get user's current location
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocation not supported'));
    }
  });
}

// Helper function to display facilities in your UI
function displayNearbyFacilities(facilities) {
  const container = document.getElementById('nearby-facilities'); // Your UI container
  
  if (facilities.length === 0) {
    container.innerHTML = '<p>No facilities found nearby.</p>';
    return;
  }

  const facilitiesHTML = facilities.map(facility => `
    <div class="facility-card">
      <h3>${facility.name}</h3>
      <p>Type: ${facility.facilityType.replace('_', ' ')}</p>
      <p>Distance: ${facility.distance} km</p>
      <p>Rating: ${facility.ratingAverage.toFixed(1)} (${facility.ratingCount} reviews)</p>
      <p>Address: ${facility.address}</p>
      <div class="rating-section">
        <label>Rate this facility:</label>
        <select onchange="onSubmitRating('${facility.facilityId}', this.value)">
          <option value="">Select rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
    </div>
  `).join('');

  container.innerHTML = facilitiesHTML;
}
