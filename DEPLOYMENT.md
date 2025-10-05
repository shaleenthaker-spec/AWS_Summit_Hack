# Deployment Guide

## Prerequisites

1. **Install AWS CLI**: https://aws.amazon.com/cli/
2. **Install AWS SAM CLI**: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
3. **Configure AWS credentials**: `aws configure`

## Deploy Backend

```bash
cd backend
sam build
sam deploy --guided
```

Follow the prompts:
- Stack Name: `facility-finder-backend`
- AWS Region: `us-east-1` (or your preferred region)
- Confirm changes: `Y`
- Allow SAM to create IAM roles: `Y`
- Save parameters: `Y`

## Test Your API

After deployment, you'll get an API Gateway URL. Test with:

```bash
# Create a facility
curl -X POST https://YOUR_API_URL/prod/facilities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bathroom",
    "facilityType": "bathroom",
    "lat": 40.7128,
    "lon": -74.0060,
    "address": "123 Test St"
  }'

# Find nearby facilities
curl "https://YOUR_API_URL/prod/facilities/nearby?lat=40.7128&lon=-74.0060&facilityType=bathroom&limit=3"
```

## Frontend Integration

Update your frontend to use the deployed API URL:

```javascript
const API_BASE_URL = 'https://YOUR_API_URL/prod';

// Find nearby bathrooms
const findNearbyBathrooms = async (lat, lon) => {
  const response = await fetch(
    `${API_BASE_URL}/facilities/nearby?lat=${lat}&lon=${lon}&facilityType=bathroom&limit=3`
  );
  return response.json();
};

// Submit rating
const submitRating = async (facilityId, rating) => {
  const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating })
  });
  return response.json();
};
```
