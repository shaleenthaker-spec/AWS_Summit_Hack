import { ServiceType, Review } from '../types/Service';
import { getDeviceId } from '../utils/device';
import { AWS_CONFIG, API_ENDPOINTS } from '../config/aws';

export class ApiService {
  private static apiUrl = AWS_CONFIG.apiGatewayUrl;

  static async getNearbyServices(latitude: number, longitude: number, radius: number = 5): Promise<ServiceType[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/facilities/nearby?lat=${latitude}&lon=${longitude}&radius=${radius}`
      );
      const data = await response.json();
      
      // Transform backend data to frontend format
      return (data.facilities || []).map((facility: any) => ({
        id: facility.facilityId,
        name: facility.name,
        type: facility.facilityType,
        rating: facility.ratingAverage || 0,
        reviewCount: facility.ratingCount || 0,
        latitude: facility.lat,
        longitude: facility.lon,
        address: facility.address || '',
        amenities: facility.features ? Object.keys(facility.features) : [],
        isOpen: true,
        distance: facility.distance,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to fetch nearby services:', error);
      return [];
    }
  }

  static async getServiceReviews(serviceId: string): Promise<Review[]> {
    try {
      const response = await fetch(`${this.apiUrl}${API_ENDPOINTS.reviews}/${serviceId}`);
      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Failed to fetch service reviews:', error);
      return [];
    }
  }

  static async createReview(reviewData: {
    serviceId: string;
    rating: number;
    comment: string;
    amenities?: string[];
  }): Promise<Review | null> {
    try {
      const deviceId = await getDeviceId();
      const response = await fetch(`${this.apiUrl}/facilities/${reviewData.serviceId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facilityId: reviewData.serviceId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          amenities: reviewData.amenities || [],
          deviceId,
        }),
      });
      const data = await response.json();
      
      // Create a review object from the response
      if (response.ok) {
        return {
          id: Date.now().toString(),
          serviceId: reviewData.serviceId,
          deviceId,
          userName: `User_${deviceId.slice(-4)}`,
          rating: reviewData.rating,
          comment: reviewData.comment,
          amenities: reviewData.amenities || [],
          createdAt: new Date().toISOString(),
          helpfulCount: 0,
          verified: false
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to create review:', error);
      return null;
    }
  }

  static async uploadImage(serviceId: string, imageBase64: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiUrl}${API_ENDPOINTS.images}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          image: imageBase64,
          type: 'service',
        }),
      });
      const data = await response.json();
      return data.imageUrl || null;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  }
}