export interface ServiceType {
  id: string;
  name: string;
  type: 'bathroom' | 'water_fountain' | 'hand_sanitizer' | 'sink';
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  address: string;
  amenities: string[];
  isOpen: boolean;
  images?: string[];
  imageUrl?: string;
  distance?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  serviceId: string;
  deviceId: string;
  userName: string;
  rating: number;
  comment: string;
  amenities: string[];
  createdAt: string;
  helpfulCount: number;
  verified: boolean;
  images?: string[];
  userAvatar?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}