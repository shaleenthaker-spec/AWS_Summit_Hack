# No-Authentication AWS Integration Guide - Lavatory Finder

This guide shows how to integrate AWS services **without requiring user accounts**. The app uses device IDs to track reviews and prevent duplicates.

## 🎯 Core AWS Services (4 Total - No Auth!)

1. **Amazon DynamoDB** - Data storage
2. **Amazon API Gateway** - REST API endpoints  
3. **AWS Lambda** - Serverless functions
4. **Amazon S3** - Image storage

**Removed**: Amazon Cognito (no authentication needed!)

## 🏗️ Simplified Architecture

```
Mobile App → API Gateway → Lambda → DynamoDB
                ↓
            S3 (Images)
```

## 📋 Implementation Steps

### Step 1: Set up Core Services (20 minutes)

```bash
# Install AWS CLI
npm install -g @aws-amplify/cli

# Initialize project (skip auth)
amplify init
amplify add api  # REST API only
amplify add storage  # S3 only
```

### Step 2: Set up DynamoDB Tables (2 tables only)

```json
{
  "Services": {
    "TableName": "lavatory-services",
    "KeySchema": [
      {"AttributeName": "id", "KeyType": "HASH"}
    ],
    "AttributeDefinitions": [
      {"AttributeName": "id", "AttributeType": "S"}
    ],
    "BillingMode": "PAY_PER_REQUEST"
  },
  "Reviews": {
    "TableName": "lavatory-reviews",
    "KeySchema": [
      {"AttributeName": "id", "KeyType": "HASH"}
    ],
    "AttributeDefinitions": [
      {"AttributeName": "id", "AttributeType": "S"},
      {"AttributeName": "serviceId", "AttributeType": "S"},
      {"AttributeName": "deviceId", "AttributeType": "S"}
    ],
    "GlobalSecondaryIndexes": [
      {
        "IndexName": "ServiceDeviceIndex",
        "KeySchema": [
          {"AttributeName": "serviceId", "KeyType": "HASH"},
          {"AttributeName": "deviceId", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    ],
    "BillingMode": "PAY_PER_REQUEST"
  }
}
```

### Step 3: Create Lambda Functions (3 functions only)

```javascript
// services.js - Main services handler
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        return await getNearbyServices(event);
    }
    
    return {
        statusCode: 405,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};

async function getNearbyServices(event) {
    const { lat, lng, radius = 1 } = event.queryStringParameters || {};
    
    // Simple scan - can be optimized later
    const params = {
        TableName: 'lavatory-services'
    };
    
    const result = await dynamodb.scan(params).promise();
    
    // Filter by distance (basic implementation)
    const nearbyServices = result.Items.filter(service => {
        const distance = calculateDistance(lat, lng, service.latitude, service.longitude);
        return distance <= radius;
    });
    
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ services: nearbyServices })
    };
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    // Simple distance calculation
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111;
}
```

```javascript
// reviews.js - Reviews handler with device tracking
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { httpMethod, pathParameters, body } = event;
    
    if (httpMethod === 'GET') {
        return await getReviews(pathParameters.serviceId);
    } else if (httpMethod === 'POST') {
        return await createReview(JSON.parse(body));
    }
    
    return { 
        statusCode: 405, 
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Method not allowed' }) 
    };
};

async function getReviews(serviceId) {
    const params = {
        TableName: 'lavatory-reviews',
        FilterExpression: 'serviceId = :serviceId',
        ExpressionAttributeValues: { ':serviceId': serviceId }
    };
    
    const result = await dynamodb.scan(params).promise();
    
    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ reviews: result.Items })
    };
}

async function createReview(reviewData) {
    const { serviceId, deviceId, rating, comment, amenities } = reviewData;
    
    // Check if device already reviewed this service
    const existingReview = await dynamodb.query({
        TableName: 'lavatory-reviews',
        IndexName: 'ServiceDeviceIndex',
        KeyConditionExpression: 'serviceId = :serviceId AND deviceId = :deviceId',
        ExpressionAttributeValues: {
            ':serviceId': serviceId,
            ':deviceId': deviceId
        }
    }).promise();
    
    if (existingReview.Items.length > 0) {
        return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ 
                error: 'You have already reviewed this service',
                existingReview: existingReview.Items[0]
            })
        };
    }
    
    // Create new review
    const review = {
        id: Date.now().toString(),
        serviceId,
        deviceId,
        userName: `User_${deviceId.slice(-4)}`, // Anonymous username
        rating,
        comment,
        amenities: amenities || [],
        createdAt: new Date().toISOString(),
        helpfulCount: 0,
        verified: false
    };
    
    await dynamodb.put({
        TableName: 'lavatory-reviews',
        Item: review
    }).promise();
    
    return {
        statusCode: 201,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ review })
    };
}
```

```javascript
// images.js - Image upload handler
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { serviceId, reviewId, image, type } = JSON.parse(event.body);
    
    const imageBuffer = Buffer.from(image, 'base64');
    const fileName = `${type}/${serviceId || reviewId}/${Date.now()}.jpg`;
    
    await s3.putObject({
        Bucket: process.env.STORAGE_BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ContentType: 'image/jpeg'
    }).promise();
    
    const imageUrl = `https://${process.env.STORAGE_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    
    return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
    };
};
```

### Step 4: Update React Native App

```typescript
// src/services/api.ts
import { API } from '@aws-amplify/api';
import { getDeviceId } from '../utils/device';

export class ApiService {
  private static apiName = 'lavatoryApi';

  static async getNearbyServices(latitude: number, longitude: number, radius: number = 1) {
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
      return [];
    }
  }

  static async getServiceReviews(serviceId: string) {
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
  }) {
    try {
      const deviceId = await getDeviceId();
      const response = await API.post(this.apiName, '/reviews', {
        body: {
          ...reviewData,
          deviceId, // Use device ID instead of user ID
        },
      });
      return response.review;
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  }

  static async uploadImage(serviceId: string, imageBase64: string) {
    try {
      const response = await API.post(this.apiName, '/images', {
        body: {
          serviceId,
          image: imageBase64,
          type: 'service',
        },
      });
      return response.imageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }
}
```

### Step 5: Device ID Implementation

```typescript
// src/utils/device.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions } from 'react-native';

const DEVICE_ID_KEY = 'lavatory_finder_device_id';

export const generateDeviceId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const screenData = `${Dimensions.get('window').width}x${Dimensions.get('window').height}`;
  const platform = Platform.OS;
  
  const deviceString = `${platform}-${screenData}-${timestamp}-${random}`;
  return btoa(deviceString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

export const getDeviceId = async (): Promise<string> => {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = generateDeviceId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Failed to get device ID:', error);
    return generateDeviceId();
  }
};

export const hasDeviceReviewed = async (serviceId: string): Promise<boolean> => {
  try {
    const deviceId = await getDeviceId();
    const reviewedServices = await AsyncStorage.getItem('reviewed_services');
    
    if (!reviewedServices) {
      return false;
    }
    
    const reviewed = JSON.parse(reviewedServices);
    return reviewed[serviceId] === deviceId;
  } catch (error) {
    console.error('Failed to check review status:', error);
    return false;
  }
};
```

## 💰 Cost Estimation (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| DynamoDB | 100,000 operations | $0.25 |
| API Gateway | 100,000 requests | $3.50 |
| Lambda | 100,000 invocations | $0.20 |
| S3 | 1GB storage + 1,000 requests | $0.023 |
| **TOTAL** | | **~$4/month** |

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Initialize Amplify (skip auth)
amplify init
amplify add api  # REST API only
amplify add storage  # S3 only

# 3. Deploy
amplify push

# 4. Run the app
npm run ios
```

## 📝 Code Replacements

### Replace Mock Data Functions

**FIND THIS:**
```typescript
const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  // Mock data for development - REMOVE when AWS integration is complete
  return [
    // ... mock data
  ];
};
```

**REPLACE WITH:**
```typescript
import { apiService } from '../services/api';

const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  return await apiService.getNearbyServices(latitude, longitude);
};
```

### Replace Review Creation

**FIND THIS:**
```typescript
// TODO: Replace with actual AWS API call
await new Promise(resolve => setTimeout(resolve, 1500));
```

**REPLACE WITH:**
```typescript
const review = await apiService.createReview({
  serviceId,
  rating,
  comment,
  amenities: selectedAmenities,
});
```

## ✅ Success Checklist

- [ ] DynamoDB tables created with sample data
- [ ] API Gateway endpoints responding
- [ ] Lambda functions deployed and working
- [ ] S3 bucket configured for images
- [ ] App successfully fetching real data
- [ ] Device ID generation working
- [ ] Duplicate review prevention working
- [ ] Image upload functionality working

## 🎯 Benefits of No-Auth Approach

1. **No Account Creation** - Users can start using immediately
2. **Privacy Friendly** - No personal data collection
3. **Lower Costs** - No Cognito charges
4. **Simpler Setup** - Fewer services to configure
5. **Faster Development** - Skip authentication complexity
6. **Device Tracking** - Still prevents duplicate reviews
7. **Anonymous Usage** - Users stay anonymous

## 🔧 Sample Data Setup

```javascript
// Add sample services to DynamoDB
const sampleServices = [
  {
    id: '1',
    name: 'City Mall Restroom',
    type: 'bathroom',
    rating: 4.2,
    reviewCount: 156,
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Main St, Downtown',
    amenities: ['wheelchair', 'baby-changing'],
    isOpen: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Central Park Water Fountain',
    type: 'water_fountain',
    rating: 4.5,
    reviewCount: 89,
    latitude: 37.7849,
    longitude: -122.4094,
    address: '456 Park Ave',
    amenities: ['filtered-water'],
    isOpen: true,
    createdAt: new Date().toISOString()
  }
];

// Insert into DynamoDB
for (const service of sampleServices) {
  await dynamodb.put({
    TableName: 'lavatory-services',
    Item: service
  }).promise();
}
```

This approach gives you a **fully functional app** with **no authentication required** while still preventing duplicate reviews through device tracking!
