// AWS Core Services Configuration for Lavatory Finder App
// Simplified to only essential services

export const AWS_CONFIG = {
  // Region configuration
  region: process.env.AWS_REGION || 'us-east-1',
  
  // Core Services Only
  // 1. Authentication (Amazon Cognito)
  userPoolId: process.env.AWS_USER_POOL_ID || '',
  userPoolWebClientId: process.env.AWS_USER_POOL_WEB_CLIENT_ID || '',
  identityPoolId: process.env.AWS_IDENTITY_POOL_ID || '',
  
  // 2. API Gateway
  apiGatewayUrl: process.env.AWS_API_GATEWAY_URL || '',
  apiGatewayName: process.env.AWS_API_GATEWAY_NAME || 'lavatoryApi',
  
  // 3. Storage (S3)
  s3Bucket: process.env.AWS_S3_BUCKET || 'lavatory-finder-images',
  s3Region: process.env.AWS_S3_REGION || 'us-east-1',
  
  // 4. DynamoDB
  dynamoDbRegion: process.env.AWS_DYNAMODB_REGION || 'us-east-1',
};

// Core API Endpoints (Simplified)
export const API_ENDPOINTS = {
  services: '/services',
  reviews: '/reviews',
  images: '/images',
};

// DynamoDB Table Names (Core Only)
export const DYNAMODB_TABLES = {
  SERVICES: 'lavatory-services',
  REVIEWS: 'lavatory-reviews',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  LOCATION_ERROR: 'Location access is required for this feature.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
};

// Default Values
export const DEFAULTS = {
  SEARCH_RADIUS: 1000, // meters
  MAX_SEARCH_RESULTS: 50,
  REVIEWS_PER_PAGE: 20,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  CACHE_DURATION: 300000, // 5 minutes
  REQUEST_TIMEOUT: 30000, // 30 seconds
};

export default AWS_CONFIG;
