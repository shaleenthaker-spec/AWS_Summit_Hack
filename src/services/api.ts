// Simplified API Service for Lavatory Finder
// No authentication required - uses device ID for tracking
// Uses only core AWS services: DynamoDB, API Gateway, Lambda, S3

import { API } from '@aws-amplify/api';
import { ServiceType, Review } from '../types/Service';
import { getDeviceId } from '../utils/device';

export class ApiService {
  private static apiName = 'lavatoryApi';

  // Services API
  static async getNearbyServices(
    latitude: number, 
    longitude: number, 
    radius: number = 1
  ): Promise<ServiceType[]> {
    try {
      const response = await API.get(this.apiName, '/services', {
        queryStringParameters: {
          lat: latitude.toString(),
          lng: longitude.toString(),
          radius: radius.toString(),
        },
      });
      return response.services || [];
    } catch (error) {
      console.error('Failed to fetch nearby services:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  static async getServiceDetails(serviceId: string): Promise<ServiceType | null> {
    try {
      const response = await API.get(this.apiName, `/services/${serviceId}`);
      return response.service || null;
    } catch (error) {
      console.error('Failed to fetch service details:', error);
      return null;
    }
  }

  static async searchServices(query: string, filters?: any): Promise<ServiceType[]> {
    try {
      const response = await API.post(this.apiName, '/services/search', {
        body: { query, filters },
      });
      return response.services || [];
    } catch (error) {
      console.error('Failed to search services:', error);
      return [];
    }
  }

  // Reviews API
  static async getServiceReviews(serviceId: string): Promise<Review[]> {
    try {
      const response = await API.get(this.apiName, `/reviews/${serviceId}`);
      return response.reviews || [];
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
      const response = await API.post(this.apiName, '/reviews', {
        body: {
          ...reviewData,
          deviceId, // Use device ID instead of user ID
          userName: `User ${deviceId.slice(-4)}`, // Generate anonymous username
        },
      });
      return response.review || null;
    } catch (error) {
      console.error('Failed to create review:', error);
      return null;
    }
  }

  // Images API
  static async uploadServiceImage(
    serviceId: string, 
    imageBase64: string
  ): Promise<string | null> {
    try {
      const response = await API.post(this.apiName, '/images', {
        body: {
          serviceId,
          image: imageBase64,
          type: 'service',
        },
      });
      return response.imageUrl || null;
    } catch (error) {
      console.error('Failed to upload service image:', error);
      return null;
    }
  }

  static async uploadReviewImage(
    reviewId: string, 
    imageBase64: string
  ): Promise<string | null> {
    try {
      const response = await API.post(this.apiName, '/images', {
        body: {
          reviewId,
          image: imageBase64,
          type: 'review',
        },
      });
      return response.imageUrl || null;
    } catch (error) {
      console.error('Failed to upload review image:', error);
      return null;
    }
  }

  // Helper method to convert file to base64
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  }
}

// Export singleton instance
export const apiService = ApiService;
