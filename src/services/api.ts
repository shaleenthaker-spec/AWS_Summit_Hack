import { ServiceType, Review } from '../types/Service';
import { getDeviceId } from '../utils/device';
import { AWS_CONFIG, API_ENDPOINTS } from '../config/aws';

export class ApiService {
  private static apiUrl = AWS_CONFIG.apiGatewayUrl;

  static async getNearbyServices(latitude: number, longitude: number, radius: number = 1): Promise<ServiceType[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}${API_ENDPOINTS.services}?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      const data = await response.json();
      return data.services || [];
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
      const response = await fetch(`${this.apiUrl}${API_ENDPOINTS.reviews}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewData,
          deviceId,
        }),
      });
      const data = await response.json();
      return data.review || null;
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