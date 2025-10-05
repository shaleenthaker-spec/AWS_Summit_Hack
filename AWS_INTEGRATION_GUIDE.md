# AWS Integration Guide - Lavatory Finder

## 🎯 Overview
Complete guide for integrating AWS services with the Lavatory Finder mobile app. **No authentication required** - uses device-based tracking.

## 🏗️ Architecture
```
Mobile App → API Gateway → Lambda → DynamoDB
                ↓
            S3 (Images)
```

## 📋 Core AWS Services (4 Total)

1. **Amazon DynamoDB** - Data storage
2. **Amazon API Gateway** - REST API endpoints  
3. **AWS Lambda** - Serverless functions
4. **Amazon S3** - Image storage

## 🚀 Quick Setup (30 minutes)

### Step 1: Install AWS CLI
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add api  # REST API
amplify add storage  # S3
amplify push
```

### Step 2: DynamoDB Tables
```json
{
  "Services": {
    "TableName": "lavatory-services",
    "KeySchema": [{"AttributeName": "id", "KeyType": "HASH"}],
    "AttributeDefinitions": [{"AttributeName": "id", "AttributeType": "S"}],
    "BillingMode": "PAY_PER_REQUEST"
  },
  "Reviews": {
    "TableName": "lavatory-reviews",
    "KeySchema": [{"AttributeName": "id", "KeyType": "HASH"}],
    "AttributeDefinitions": [
      {"AttributeName": "id", "AttributeType": "S"},
      {"AttributeName": "serviceId", "AttributeType": "S"},
      {"AttributeName": "deviceId", "AttributeType": "S"}
    ],
    "GlobalSecondaryIndexes": [{
      "IndexName": "ServiceDeviceIndex",
      "KeySchema": [
        {"AttributeName": "serviceId", "KeyType": "HASH"},
        {"AttributeName": "deviceId", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"}
    }],
    "BillingMode": "PAY_PER_REQUEST"
  }
}
```

### Step 3: Lambda Functions

**services.js** - Get nearby services
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        const { lat, lng, radius = 1 } = event.queryStringParameters || {};
        
        const params = { TableName: 'lavatory-services' };
        const result = await dynamodb.scan(params).promise();
        
        const nearbyServices = result.Items.filter(service => {
            const distance = calculateDistance(lat, lng, service.latitude, service.longitude);
            return distance <= radius;
        });
        
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ services: nearbyServices })
        };
    }
};

function calculateDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111;
}
```

**reviews.js** - Handle reviews with device tracking
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { httpMethod, pathParameters, body } = event;
    
    if (httpMethod === 'GET') {
        return await getReviews(pathParameters.serviceId);
    } else if (httpMethod === 'POST') {
        return await createReview(JSON.parse(body));
    }
};

async function createReview(reviewData) {
    const { serviceId, deviceId, rating, comment, amenities } = reviewData;
    
    // Check for existing review from same device
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
        userName: `User_${deviceId.slice(-4)}`,
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

**images.js** - Image upload
```javascript
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

Replace mock data functions in your components:

**Before (Mock):**
```typescript
const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  return [
    // ... mock data
  ];
};
```

**After (Real AWS):**
```typescript
import { apiService } from '../services/api';

const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  return await apiService.getNearbyServices(latitude, longitude);
};
```

### Step 5: Device ID Implementation

The app uses device IDs to prevent duplicate reviews:

```typescript
// src/utils/device.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions } from 'react-native';

export const getDeviceId = async (): Promise<string> => {
  let deviceId = await AsyncStorage.getItem('lavatory_finder_device_id');
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    await AsyncStorage.setItem('lavatory_finder_device_id', deviceId);
  }
  
  return deviceId;
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

## ✅ Implementation Checklist

- [ ] DynamoDB tables created with sample data
- [ ] API Gateway endpoints responding
- [ ] Lambda functions deployed
- [ ] S3 bucket configured
- [ ] App fetching real data
- [ ] Device ID generation working
- [ ] Duplicate review prevention working
- [ ] Image upload working

## 🎯 Key Benefits

1. **No Authentication** - Users start immediately
2. **Privacy Friendly** - No personal data collection
3. **Low Cost** - ~$4/month
4. **Device Tracking** - Prevents duplicate reviews
5. **Anonymous Usage** - Users stay anonymous

## 📝 Sample Data Setup

```javascript
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

## 🔧 Troubleshooting

**Common Issues:**
1. **CORS Errors** - Ensure all Lambda responses include `'Access-Control-Allow-Origin': '*'`
2. **Device ID Issues** - Check AsyncStorage permissions
3. **Image Upload Fails** - Verify S3 bucket permissions
4. **Duplicate Reviews** - Check ServiceDeviceIndex in DynamoDB

**Debug Commands:**
```bash
# Test API endpoints
curl -X GET "https://your-api-id.execute-api.region.amazonaws.com/dev/services?lat=37.7749&lng=-122.4194"

# Check DynamoDB tables
aws dynamodb describe-table --table-name lavatory-services
aws dynamodb describe-table --table-name lavatory-reviews

# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/
```

This streamlined guide contains everything needed to integrate AWS services with your Lavatory Finder app!