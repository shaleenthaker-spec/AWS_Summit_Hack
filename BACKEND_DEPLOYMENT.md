# AWS Backend Deployment Guide

This guide will help you deploy the Lavatory Finder backend to AWS using AWS SAM (Serverless Application Model).

## Prerequisites

1. **AWS Account**: Sign up at https://aws.amazon.com
2. **AWS CLI**: Install and configure with your credentials
3. **AWS SAM CLI**: Install for serverless deployment
4. **Python 3.9+**: For Lambda functions

## Installation Steps

### 1. Install AWS CLI
```bash
# macOS
brew install awscli

# Or download from: https://aws.amazon.com/cli/
```

### 2. Install AWS SAM CLI
```bash
# macOS
brew install aws-sam-cli

# Or download from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
```

### 3. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your default output format (json)
```

## Deployment Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Build the Application
```bash
sam build
```

### 3. Deploy to AWS
```bash
sam deploy --guided
```

**Configuration prompts:**
- Stack Name: `lavatory-finder-backend`
- AWS Region: `us-east-1` (or your preferred region)
- Confirm changes before deploy: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Save parameters to configuration file: `Y`
- SAM configuration file: `samconfig.toml`

### 4. Note the API Gateway URL
After deployment, you'll see output like:
```
Outputs:
  FacilityAPI:
    Description: "API Gateway endpoint URL"
    Value: "https://abc123def4.execute-api.us-east-1.amazonaws.com/prod/"
```

**Copy this URL** - you'll need it for the mobile app configuration.

## Populate Sample Data

### 1. Install Python Dependencies
```bash
pip install boto3
```

### 2. Run Sample Data Script
```bash
python sample_data.py
```

This will populate your DynamoDB table with 6 sample facilities in the San Francisco area.

## Update Mobile App Configuration

### 1. Update AWS Configuration
Edit `src/config/aws.ts`:
```typescript
export const AWS_CONFIG = {
  apiGatewayUrl: 'https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod',
  // ... rest of config
};
```

### 2. Test the API
```bash
# Test nearby facilities endpoint
curl "https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/facilities/nearby?lat=37.7749&lon=-122.4194&radius=5"
```

## Cost Estimation

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| DynamoDB | 100K operations | ~$0.25 |
| API Gateway | 100K requests | ~$3.50 |
| Lambda | 100K invocations | ~$0.20 |
| **Total** | | **~$4/month** |

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Ensure AWS CLI is configured correctly
   aws sts get-caller-identity
   ```

2. **Build Failures**
   ```bash
   # Clean and rebuild
   sam build --use-container
   ```

3. **Deployment Timeout**
   ```bash
   # Increase timeout
   sam deploy --guided --parameter-overrides Timeout=60
   ```

### Useful Commands

```bash
# View stack status
aws cloudformation describe-stacks --stack-name lavatory-finder-backend

# View Lambda logs
sam logs -n FindNearbyFunction --stack-name lavatory-finder-backend

# Delete stack (if needed)
aws cloudformation delete-stack --stack-name lavatory-finder-backend
```

## Next Steps

1. ✅ Backend deployed successfully
2. ✅ Sample data populated
3. ✅ API Gateway URL obtained
4. 🔄 Update mobile app configuration
5. 🔄 Test mobile app with real backend
6. 🔄 Deploy to app stores

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/facilities/nearby` | Find nearby facilities |
| GET | `/facilities/{id}` | Get facility details |
| POST | `/facilities` | Create new facility |
| POST | `/facilities/{id}/rating` | Submit rating |

### Example API Calls

```bash
# Find nearby bathrooms
curl "https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/facilities/nearby?lat=37.7749&lon=-122.4194&facilityType=bathroom&radius=2"

# Submit a rating
curl -X POST "https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/facilities/facility_001/rating" \
  -H "Content-Type: application/json" \
  -d '{"facilityId": "facility_001", "rating": 5}'
```

Your backend is now ready to serve the Lavatory Finder mobile app! 🎉
