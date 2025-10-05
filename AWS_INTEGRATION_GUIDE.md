# AWS Integration Guide for Lavatory Finder App

This document provides comprehensive instructions for integrating AWS services into the Lavatory Finder React Native application. All placeholder code and mock data should be replaced with actual AWS implementations.

## Table of Contents

1. [AWS Services Overview](#aws-services-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Storage](#data-storage)
4. [API Gateway & Lambda](#api-gateway--lambda)
5. [File Storage & CDN](#file-storage--cdn)
6. [Analytics & Monitoring](#analytics--monitoring)
7. [Push Notifications](#push-notifications)
8. [Ad Integration](#ad-integration)
9. [Implementation Steps](#implementation-steps)
10. [Code Replacements](#code-replacements)

## AWS Services Overview

### Required Services
- **Amazon Cognito**: User authentication and authorization
- **Amazon DynamoDB**: Primary data storage for services, reviews, and user data
- **Amazon API Gateway**: RESTful API endpoints
- **AWS Lambda**: Serverless compute for business logic
- **Amazon S3**: File storage for images and assets
- **Amazon CloudFront**: CDN for fast image delivery
- **Amazon Pinpoint**: Analytics and push notifications
- **AWS Amplify**: Frontend integration and deployment

### Optional Services
- **Amazon Location Service**: Enhanced mapping and geolocation
- **Amazon Rekognition**: Image analysis for content moderation
- **AWS AppSync**: Real-time subscriptions for live updates
- **Amazon Polly**: Text-to-speech for accessibility

## Authentication & Authorization

### 1. Amazon Cognito Setup

```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify project
amplify init

# Add authentication
amplify add auth

# Configure Cognito User Pool
amplify add auth
```

### 2. Replace Authentication Code

**File: `src/services/auth.ts`** (Create this file)

```typescript
import { Auth } from 'aws-amplify';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export class AuthService {
  static async signUp(email: string, password: string, name: string): Promise<void> {
    // TODO: Replace with actual Cognito signup
    await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name,
      },
    });
  }

  static async signIn(email: string, password: string): Promise<User> {
    // TODO: Replace with actual Cognito signin
    const user = await Auth.signIn(email, password);
    return {
      id: user.attributes.sub,
      email: user.attributes.email,
      name: user.attributes.name,
    };
  }

  static async signOut(): Promise<void> {
    // TODO: Replace with actual Cognito signout
    await Auth.signOut();
  }

  static async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with actual Cognito current user
    try {
      const user = await Auth.currentAuthenticatedUser();
      return {
        id: user.attributes.sub,
        email: user.attributes.email,
        name: user.attributes.name,
      };
    } catch (error) {
      return null;
    }
  }
}
```

## Data Storage

### 1. DynamoDB Tables

Create the following DynamoDB tables:

```json
{
  "Services": {
    "TableName": "lavatory-services",
    "KeySchema": [
      {"AttributeName": "id", "KeyType": "HASH"}
    ],
    "AttributeDefinitions": [
      {"AttributeName": "id", "AttributeType": "S"},
      {"AttributeName": "type", "AttributeType": "S"},
      {"AttributeName": "createdAt", "AttributeType": "S"}
    ],
    "GlobalSecondaryIndexes": [
      {
        "IndexName": "TypeIndex",
        "KeySchema": [
          {"AttributeName": "type", "KeyType": "HASH"},
          {"AttributeName": "createdAt", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    ]
  },
  "Reviews": {
    "TableName": "lavatory-reviews",
    "KeySchema": [
      {"AttributeName": "id", "KeyType": "HASH"}
    ],
    "AttributeDefinitions": [
      {"AttributeName": "id", "AttributeType": "S"},
      {"AttributeName": "serviceId", "AttributeType": "S"},
      {"AttributeName": "userId", "AttributeType": "S"},
      {"AttributeName": "createdAt", "AttributeType": "S"}
    ],
    "GlobalSecondaryIndexes": [
      {
        "IndexName": "ServiceIndex",
        "KeySchema": [
          {"AttributeName": "serviceId", "KeyType": "HASH"},
          {"AttributeName": "createdAt", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    ]
  }
}
```

### 2. Replace Data Service Code

**File: `src/services/data.ts`** (Create this file)

```typescript
import { API } from 'aws-amplify';
import { ServiceType, Review, NearbyServicesRequest } from '../types/Service';

export class DataService {
  static async getNearbyServices(request: NearbyServicesRequest): Promise<ServiceType[]> {
    // TODO: Replace with actual API Gateway call
    const response = await API.get('lavatoryApi', `/services/nearby`, {
      queryStringParameters: {
        lat: request.latitude.toString(),
        lng: request.longitude.toString(),
        radius: request.radius.toString(),
        types: request.serviceTypes?.join(','),
      },
    });
    return response.services;
  }

  static async getServiceDetails(serviceId: string): Promise<ServiceType> {
    // TODO: Replace with actual API Gateway call
    const response = await API.get('lavatoryApi', `/services/${serviceId}`);
    return response.service;
  }

  static async searchServices(query: string, filters: any): Promise<ServiceType[]> {
    // TODO: Replace with actual API Gateway call
    const response = await API.post('lavatoryApi', '/services/search', {
      body: { query, filters },
    });
    return response.services;
  }

  static async createReview(review: any): Promise<Review> {
    // TODO: Replace with actual API Gateway call
    const response = await API.post('lavatoryApi', '/reviews', {
      body: review,
    });
    return response.review;
  }

  static async getServiceReviews(serviceId: string): Promise<Review[]> {
    // TODO: Replace with actual API Gateway call
    const response = await API.get('lavatoryApi', `/services/${serviceId}/reviews`);
    return response.reviews;
  }
}
```

## API Gateway & Lambda

### 1. Lambda Functions

Create the following Lambda functions:

```python
# services_handler.py
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('lavatory-services')

def lambda_handler(event, context):
    if event['httpMethod'] == 'GET':
        return get_nearby_services(event)
    elif event['httpMethod'] == 'POST':
        return create_service(event)
    else:
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }

def get_nearby_services(event):
    # TODO: Implement geospatial query logic
    # Use DynamoDB or Amazon Location Service for proximity search
    query_params = event.get('queryStringParameters', {})
    lat = float(query_params.get('lat', 0))
    lng = float(query_params.get('lng', 0))
    radius = float(query_params.get('radius', 1))
    
    # Implement actual proximity search
    services = []  # Replace with actual DynamoDB query
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'services': services,
            'totalCount': len(services)
        })
    }
```

### 2. API Gateway Configuration

```yaml
# serverless.yml or CloudFormation template
Resources:
  LavatoryAPI:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: lavatory-finder-api
      Description: API for Lavatory Finder app
      
  ServicesResource:
    Type: AWS::ApiGateway::Resource
    Properties:
      RestApiId: !Ref LavatoryAPI
      ParentId: !GetAtt LavatoryAPI.RootResourceId
      PathPart: services
      
  GetNearbyServicesMethod:
    Type: AWS::ApiGateway::Method
    Properties:
      RestApiId: !Ref LavatoryAPI
      ResourceId: !Ref ServicesResource
      HttpMethod: GET
      AuthorizationType: AWS_IAM
      Integration:
        Type: AWS_PROXY
        IntegrationHttpMethod: POST
        Uri: !Sub 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${ServicesLambda.Arn}/invocations'
```

## File Storage & CDN

### 1. S3 Bucket Setup

```json
{
  "ServiceImagesBucket": {
    "Type": "AWS::S3::Bucket",
    "Properties": {
      "BucketName": "lavatory-finder-images",
      "PublicReadPolicy": false,
      "CorsConfiguration": {
        "CorsRules": [
          {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST"],
            "AllowedOrigins": ["*"],
            "MaxAge": 3600
          }
        ]
      }
    }
  }
}
```

### 2. Replace Image Service Code

**File: `src/services/image.ts`** (Create this file)

```typescript
import { Storage } from 'aws-amplify';

export class ImageService {
  static async uploadServiceImage(
    serviceId: string, 
    imageFile: File, 
    userId: string
  ): Promise<string> {
    // TODO: Replace with actual S3 upload
    const fileName = `${serviceId}/${Date.now()}-${imageFile.name}`;
    const result = await Storage.put(fileName, imageFile, {
      contentType: imageFile.type,
      metadata: {
        serviceId,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    // Return CloudFront URL
    return `https://d1234567890.cloudfront.net/${result.key}`;
  }

  static async uploadReviewImage(
    reviewId: string, 
    imageFile: File, 
    userId: string
  ): Promise<string> {
    // TODO: Replace with actual S3 upload
    const fileName = `reviews/${reviewId}/${Date.now()}-${imageFile.name}`;
    const result = await Storage.put(fileName, imageFile, {
      contentType: imageFile.type,
      metadata: {
        reviewId,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    return `https://d1234567890.cloudfront.net/${result.key}`;
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    // TODO: Replace with actual S3 deletion
    const key = imageUrl.split('/').pop();
    await Storage.remove(key);
  }
}
```

## Analytics & Monitoring

### 1. Amazon Pinpoint Setup

```typescript
// src/services/analytics.ts
import { Analytics } from 'aws-amplify';

export class AnalyticsService {
  static async trackEvent(eventType: string, properties: any): Promise<void> {
    // TODO: Replace with actual Pinpoint analytics
    await Analytics.record({
      name: eventType,
      attributes: properties,
    });
  }

  static async trackServiceView(serviceId: string, userId?: string): Promise<void> {
    await this.trackEvent('service_view', {
      serviceId,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackSearch(query: string, resultsCount: number): Promise<void> {
    await this.trackEvent('service_search', {
      query,
      resultsCount,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackReviewSubmission(serviceId: string, rating: number): Promise<void> {
    await this.trackEvent('review_submit', {
      serviceId,
      rating,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## Push Notifications

### 1. Pinpoint Push Notifications

```typescript
// src/services/notifications.ts
import { PushNotification } from '@aws-amplify/pushnotification';

export class NotificationService {
  static async initialize(): Promise<void> {
    // TODO: Replace with actual Pinpoint initialization
    PushNotification.initialize({
      appId: 'your-pinpoint-app-id',
    });
  }

  static async requestPermission(): Promise<boolean> {
    // TODO: Replace with actual permission request
    const permission = await PushNotification.requestPermissions();
    return permission === 'granted';
  }

  static async subscribeToServiceUpdates(serviceId: string): Promise<void> {
    // TODO: Replace with actual subscription
    await PushNotification.subscribeToTopic(`service-${serviceId}`);
  }

  static async sendServiceUpdateNotification(
    serviceId: string, 
    message: string
  ): Promise<void> {
    // TODO: Replace with actual notification sending
    // This would typically be done from a Lambda function
  }
}
```

## Ad Integration

### 1. Replace Ad Service Code

**File: `src/services/ads.ts`** (Create this file)

```typescript
import { Analytics } from 'aws-amplify';

export interface AdContent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  advertiser: string;
}

export class AdService {
  static async getAd(
    placementId: string, 
    userId?: string, 
    location?: { lat: number; lng: number }
  ): Promise<AdContent | null> {
    // TODO: Replace with actual ad server integration
    // Options: Amazon DSP, Google AdMob, or custom ad server
    
    // Example with Amazon DSP:
    // const response = await fetch('https://your-ad-server.com/ads', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     placementId,
    //     userId,
    //     location,
    //     deviceInfo: await this.getDeviceInfo(),
    //   }),
    // });
    // return await response.json();

    // Mock implementation - REMOVE when real integration is complete
    return null;
  }

  static async trackAdImpression(adId: string, userId?: string): Promise<void> {
    // TODO: Replace with actual ad tracking
    await Analytics.record({
      name: 'ad_impression',
      attributes: {
        adId,
        userId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  static async trackAdClick(adId: string, userId?: string): Promise<void> {
    // TODO: Replace with actual ad click tracking
    await Analytics.record({
      name: 'ad_click',
      attributes: {
        adId,
        userId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private static async getDeviceInfo(): Promise<any> {
    // TODO: Get device information for ad targeting
    return {
      platform: 'react-native',
      // Add more device info as needed
    };
  }
}
```

## Implementation Steps

### Phase 1: Core Infrastructure (Week 1-2)
1. Set up AWS Amplify project
2. Configure Amazon Cognito for authentication
3. Create DynamoDB tables
4. Set up API Gateway and Lambda functions
5. Configure S3 bucket for image storage

### Phase 2: Data Integration (Week 3-4)
1. Replace mock data services with real API calls
2. Implement image upload functionality
3. Set up CloudFront CDN
4. Configure DynamoDB queries and indexes

### Phase 3: Advanced Features (Week 5-6)
1. Integrate Amazon Pinpoint for analytics
2. Set up push notifications
3. Implement ad integration
4. Add real-time features with AppSync (optional)

### Phase 4: Testing & Optimization (Week 7-8)
1. Performance testing and optimization
2. Security audit and hardening
3. Load testing for scalability
4. Production deployment

## Code Replacements

### 1. Replace All Mock Data Calls

Search for these patterns in the codebase and replace:

```typescript
// FIND AND REPLACE:
// Mock data for development - REMOVE when AWS integration is complete
// WITH: Actual AWS API call implementation

// FIND AND REPLACE:
// TODO: Replace with actual AWS API call
// WITH: Implemented AWS service calls

// FIND AND REPLACE:
// AWS INTEGRATION PLACEHOLDER
// WITH: Actual AWS integration code
```

### 2. Environment Configuration

Create `src/config/aws.ts`:

```typescript
export const AWS_CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  userPoolId: process.env.AWS_USER_POOL_ID,
  userPoolWebClientId: process.env.AWS_USER_POOL_WEB_CLIENT_ID,
  identityPoolId: process.env.AWS_IDENTITY_POOL_ID,
  apiGatewayUrl: process.env.AWS_API_GATEWAY_URL,
  s3Bucket: process.env.AWS_S3_BUCKET,
  cloudFrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN,
  pinpointAppId: process.env.AWS_PINPOINT_APP_ID,
};
```

### 3. Amplify Configuration

Create `src/aws-exports.js` (auto-generated by Amplify CLI):

```javascript
const awsconfig = {
    "aws_project_region": "us-east-1",
    "aws_cognito_identity_pool_id": "us-east-1:xxx",
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "us-east-1_xxx",
    "aws_user_pools_web_client_id": "xxx",
    "oauth": {},
    "aws_cognito_username_attributes": ["EMAIL"],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": ["EMAIL"],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": ["SMS"],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": ["EMAIL"],
    "aws_appsync_graphqlEndpoint": "https://xxx.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_appsync_apiKey": "da2-xxx",
    "aws_user_files_s3_bucket": "xxx",
    "aws_user_files_s3_bucket_region": "us-east-1"
};

export default awsconfig;
```

## Security Considerations

1. **API Security**: Use AWS IAM roles and policies
2. **Data Encryption**: Enable encryption at rest and in transit
3. **Authentication**: Implement proper JWT token handling
4. **Input Validation**: Validate all inputs on Lambda functions
5. **CORS Configuration**: Properly configure CORS for API Gateway
6. **Image Security**: Implement content moderation for uploaded images

## Monitoring & Logging

1. **CloudWatch**: Set up logging for all Lambda functions
2. **X-Ray**: Enable distributed tracing
3. **Pinpoint Analytics**: Track user engagement
4. **Cost Monitoring**: Set up billing alerts
5. **Performance Monitoring**: Monitor API response times

## Deployment

1. **Amplify Hosting**: Deploy React Native web version
2. **App Store**: Build and deploy mobile apps
3. **CI/CD**: Set up automated deployment pipelines
4. **Environment Management**: Separate dev/staging/prod environments

---

**Important Notes:**
- All placeholder code is clearly marked with "AWS INTEGRATION PLACEHOLDER" comments
- Mock data functions should be completely replaced with real AWS service calls
- Test thoroughly in development environment before production deployment
- Monitor costs and usage to avoid unexpected charges
- Keep AWS credentials secure and never commit them to version control
