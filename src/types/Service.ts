// Service types and interfaces for the lavatory finder app

export interface Location {
  latitude: number;
  longitude: number;
}

export interface ServiceType {
  id: string;
  name: string;
  type: 'bathroom' | 'water_fountain' | 'hand_sanitizer' | 'sink';
  rating: number;
  reviewCount: number;
  distance: number; // in kilometers
  isOpen: boolean;
  address: string;
  amenities: string[];
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  // AWS INTEGRATION PLACEHOLDER: Additional fields from DynamoDB
  createdAt?: string;
  updatedAt?: string;
  businessHours?: BusinessHours;
  priceRange?: 'free' | 'paid';
  accessibility?: AccessibilityInfo;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string; // HH:MM format
  close: string; // HH:MM format
  is24Hours: boolean;
  isClosed: boolean;
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  babyChangingStation: boolean;
  genderNeutral: boolean;
  familyRestroom: boolean;
  handrails: boolean;
  wideStall: boolean;
}

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[]; // URLs to images stored in S3
  createdAt: string;
  helpfulCount: number;
  verified: boolean;
}

export interface AdPlacement {
  id: string;
  position: 'home-top' | 'home-bottom' | 'services-list' | 'map-overlay' | 'detail-bottom';
  adType: 'banner' | 'interstitial' | 'native';
  content: AdContent;
  targetAudience?: string[];
  isActive: boolean;
}

export interface AdContent {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  advertiser: string;
}

// AWS INTEGRATION PLACEHOLDER: API Response types
export interface NearbyServicesResponse {
  services: ServiceType[];
  totalCount: number;
  nextToken?: string; // For pagination
  searchRadius: number;
}

export interface ServiceDetailsResponse {
  service: ServiceType;
  reviews: Review[];
  relatedServices: ServiceType[];
}

export interface SearchFilters {
  serviceTypes: string[];
  maxDistance: number; // in kilometers
  minRating: number;
  amenities: string[];
  isOpenNow: boolean;
  priceRange: string[];
  accessibility: string[];
}

// AWS INTEGRATION PLACEHOLDER: API Request types
export interface NearbyServicesRequest {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  serviceTypes?: string[];
  filters?: SearchFilters;
  limit?: number;
  nextToken?: string;
}

export interface CreateReviewRequest {
  serviceId: string;
  userId: string;
  rating: number;
  comment: string;
  images?: File[];
}

export interface UpdateServiceRequest {
  serviceId: string;
  updates: Partial<ServiceType>;
}

// AWS INTEGRATION PLACEHOLDER: Analytics and tracking
export interface AnalyticsEvent {
  eventType: 'service_view' | 'service_search' | 'review_submit' | 'ad_click' | 'ad_impression';
  serviceId?: string;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Voice control commands
export interface VoiceCommand {
  action: 'search' | 'navigate' | 'filter' | 'refresh';
  target: string;
  parameters?: Record<string, any>;
}
