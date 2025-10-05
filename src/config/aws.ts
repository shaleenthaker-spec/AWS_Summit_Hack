// AWS Configuration - No Authentication Required
export const AWS_CONFIG = {
  // API Gateway
  apiGatewayUrl: process.env.AWS_API_GATEWAY_URL || 'https://your-api-id.execute-api.region.amazonaws.com/dev',
  
  // S3
  s3BucketName: process.env.AWS_S3_BUCKET_NAME || 'lavatory-finder-images',
  s3Region: process.env.AWS_S3_REGION || 'us-east-1',
  
  // DynamoDB
  dynamoDbRegion: process.env.AWS_DYNAMODB_REGION || 'us-east-1',
};

// Core API Endpoints
export const API_ENDPOINTS = {
  services: '/services',
  reviews: '/reviews',
  images: '/images',
};

// DynamoDB Table Names
export const DYNAMODB_TABLES = {
  SERVICES: 'lavatory-services',
  REVIEWS: 'lavatory-reviews',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  LOCATION_ERROR: 'Unable to get your location. Please enable location services.',
};