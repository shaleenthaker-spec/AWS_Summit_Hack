# AWS Core Services Integration Guide - Lavatory Finder

This guide focuses on only the **essential AWS services** needed to make the Lavatory Finder app functional. We've eliminated optional services to reduce complexity and costs.

## 🎯 Core AWS Services Only

### **Required Services (5 total)**
1. **Amazon Cognito** - User authentication
2. **Amazon DynamoDB** - Data storage
3. **Amazon API Gateway** - REST API endpoints
4. **AWS Lambda** - Serverless functions
5. **Amazon S3** - Image storage

### **Removed Services (Cost Optimization)**
- ❌ Amazon CloudFront (use S3 direct URLs)
- ❌ Amazon Pinpoint (use basic analytics)
- ❌ AWS AppSync (use REST API instead)
- ❌ Amazon Location Service (use basic GPS)
- ❌ Amazon Rekognition (manual image moderation)

## 🏗️ Simplified Architecture

```
Mobile App → API Gateway → Lambda → DynamoDB
                ↓
            S3 (Images)
```

## 📋 Implementation Steps

### Step 1: Set up Core Services (1 hour)

```bash
# Install AWS CLI
npm install -g @aws-amplify/cli

# Initialize project
amplify init
amplify add auth
amplify add api
amplify add storage
```

### Step 2: Configure Cognito (Authentication)
```javascript
// src/config/auth.js
export const authConfig = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_XXXXXXXXX',
  userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
};
```

### Step 3: Set up DynamoDB Tables (2 tables only)
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
      {"AttributeName": "latitude", "AttributeType": "N"},
      {"AttributeName": "longitude", "AttributeType": "N"}
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
      {"AttributeName": "createdAt", "AttributeType": "S"}
    ]
  }
}
```

### Step 4: Create Lambda Functions (3 functions only)
```python
# services.py - Main services handler
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
services_table = dynamodb.Table('lavatory-services')

def lambda_handler(event, context):
    if event['httpMethod'] == 'GET':
        return get_nearby_services(event)
    elif event['httpMethod'] == 'POST':
        return create_service(event)

def get_nearby_services(event):
    query_params = event.get('queryStringParameters', {})
    lat = float(query_params.get('lat', 0))
    lng = float(query_params.get('lng', 0))
    radius = float(query_params.get('radius', 1))
    
    # Simple proximity search (can be enhanced later)
    response = services_table.scan()
    services = response['Items']
    
    # Filter by distance (basic implementation)
    nearby_services = []
    for service in services:
        distance = calculate_distance(lat, lng, service['latitude'], service['longitude'])
        if distance <= radius:
            service['distance'] = distance
            nearby_services.append(service)
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'services': nearby_services})
    }

def calculate_distance(lat1, lng1, lat2, lng2):
    # Simple distance calculation
    return ((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2) ** 0.5 * 111  # Rough km conversion
```

```python
# reviews.py - Reviews handler
import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
reviews_table = dynamodb.Table('lavatory-reviews')

def lambda_handler(event, context):
    if event['httpMethod'] == 'GET':
        return get_reviews(event)
    elif event['httpMethod'] == 'POST':
        return create_review(event)

def get_reviews(event):
    service_id = event['pathParameters']['serviceId']
    response = reviews_table.query(
        IndexName='ServiceIndex',
        KeyConditionExpression='serviceId = :service_id',
        ExpressionAttributeValues={':service_id': service_id}
    )
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reviews': response['Items']})
    }

def create_review(event):
    review_data = json.loads(event['body'])
    review_data['id'] = str(datetime.now().timestamp())
    review_data['createdAt'] = datetime.now().isoformat()
    
    reviews_table.put_item(Item=review_data)
    
    return {
        'statusCode': 201,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'review': review_data})
    }
```

```python
# images.py - Image upload handler
import json
import boto3
import base64
import uuid

s3 = boto3.client('s3')
BUCKET_NAME = 'lavatory-finder-images'

def lambda_handler(event, context):
    if event['httpMethod'] == 'POST':
        return upload_image(event)

def upload_image(event):
    body = json.loads(event['body'])
    image_data = base64.b64decode(body['image'])
    file_name = f"{body['serviceId']}/{uuid.uuid4()}.jpg"
    
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=file_name,
        Body=image_data,
        ContentType='image/jpeg'
    )
    
    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}"
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'imageUrl': image_url})
    }
```

### Step 5: Update React Native App

Replace the mock data functions with these simplified API calls:

```typescript
// src/services/api.ts
import { API } from 'aws-amplify';

export const apiService = {
  async getNearbyServices(lat: number, lng: number, radius: number = 1) {
    try {
      const response = await API.get('lavatoryApi', '/services', {
        queryStringParameters: {
          lat: lat.toString(),
          lng: lng.toString(),
          radius: radius.toString()
        }
      });
      return response.services || [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return [];
    }
  },

  async getServiceReviews(serviceId: string) {
    try {
      const response = await API.get('lavatoryApi', `/reviews/${serviceId}`);
      return response.reviews || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  },

  async createReview(reviewData: any) {
    try {
      const response = await API.post('lavatoryApi', '/reviews', {
        body: reviewData
      });
      return response.review;
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  },

  async uploadImage(serviceId: string, imageBase64: string) {
    try {
      const response = await API.post('lavatoryApi', '/images', {
        body: {
          serviceId,
          image: imageBase64
        }
      });
      return response.imageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }
};
```

## 💰 Cost Estimation (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| Cognito | 1,000 users | $0.0055 |
| DynamoDB | 100,000 reads/writes | $0.25 |
| API Gateway | 100,000 requests | $3.50 |
| Lambda | 100,000 invocations | $0.20 |
| S3 | 1GB storage + 1,000 requests | $0.023 |
| **Total** | | **~$4/month** |

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Initialize Amplify
amplify init

# 3. Add core services
amplify add auth
amplify add api
amplify add storage

# 4. Deploy
amplify push

# 5. Run the app
npm run ios
```

## 📝 Code Replacements

Find and replace these patterns in your codebase:

### Replace Mock Data Functions
```typescript
// FIND THIS:
const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  // Mock data for development - REMOVE when AWS integration is complete
  return [
    // ... mock data
  ];
};

// REPLACE WITH:
const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  return await apiService.getNearbyServices(latitude, longitude);
};
```

### Replace Mock Reviews
```typescript
// FIND THIS:
const fetchServiceReviews = async (serviceId: string): Promise<Review[]> => {
  // Mock reviews for development - REMOVE when AWS integration is complete
  return [
    // ... mock reviews
  ];
};

// REPLACE WITH:
const fetchServiceReviews = async (serviceId: string): Promise<Review[]> => {
  return await apiService.getServiceReviews(serviceId);
};
```

## 🔧 Configuration Files

### aws-exports.js (Auto-generated)
```javascript
const awsconfig = {
    "aws_project_region": "us-east-1",
    "aws_cognito_identity_pool_id": "us-east-1:xxx",
    "aws_cognito_region": "us-east-1", 
    "aws_user_pools_id": "us-east-1_xxx",
    "aws_user_pools_web_client_id": "xxx",
    "aws_appsync_graphqlEndpoint": "https://xxx.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_user_files_s3_bucket": "lavatory-finder-images",
    "aws_user_files_s3_bucket_region": "us-east-1"
};
export default awsconfig;
```

## ✅ Success Checklist

- [ ] Cognito user authentication working
- [ ] DynamoDB tables created with sample data
- [ ] API Gateway endpoints responding
- [ ] Lambda functions deployed
- [ ] S3 bucket configured for images
- [ ] App successfully fetching real data
- [ ] Image upload functionality working
- [ ] Reviews can be created and retrieved

## 🎯 Next Steps After Core Integration

1. **Add sample data** to DynamoDB tables
2. **Test all API endpoints** with real data
3. **Implement error handling** in the app
4. **Add loading states** for better UX
5. **Deploy to production** environment

This simplified approach gives you a **fully functional app** with minimal AWS services and costs, while maintaining all core functionality!
