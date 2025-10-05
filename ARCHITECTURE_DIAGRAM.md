# 🏗️ Lavatory Finder - System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  📱 React Native App          │  🌐 Web Application            │
│  (iOS/Android)                │  (HTML5/CSS3/JS)               │
│                               │                                │
│  • Location Services          │  • Browser Geolocation         │
│  • Voice Control              │  • Responsive Design           │
│  • Offline Support            │  • Progressive Web App         │
│  • Device ID Generation       │  • Real-time Updates           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│                    Amazon API Gateway                          │
│                                                               │
│  • REST API Endpoints        • CORS Handling                  │
│  • Request/Response Transform • Rate Limiting                 │
│  • Authentication (Optional)  • Security Policies             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LAMBDA FUNCTIONS LAYER                     │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Find Nearby Services     │  📝 Create Facility            │
│  • GPS coordinate processing  │  • Facility validation         │
│  • Distance calculations      │  • Data sanitization           │
│  • Result filtering          │  • UUID generation             │
│                               │                                │
│  ⭐ Submit Rating            │  📸 Image Upload               │
│  • Device ID validation      │  • Base64 image processing     │
│  • Duplicate prevention      │  • S3 storage management       │
│  • Rating aggregation        │  • URL generation              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  🗄️ Amazon DynamoDB         │  🖼️ Amazon S3                  │
│                               │                                │
│  Facilities Table:            │  Image Storage:                │
│  • facilityId (PK)           │  • service-images/             │
│  • facilityType (GSI)        │  • review-images/              │
│  • location data             │  • Public URLs                 │
│  • rating statistics         │  • CDN ready                   │
│                               │                                │
│  Reviews Table:               │                                │
│  • reviewId (PK)             │                                │
│  • serviceId + deviceId (GSI)│                                │
│  • anonymous user data       │                                │
│  • rating & comments         │                                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Request → API Gateway → Lambda Function → DynamoDB/S3 → Response

1. 📱 User opens app and requests location
2. 🌍 App gets GPS coordinates
3. 📡 App sends request to API Gateway
4. ⚡ API Gateway routes to Find Nearby Services Lambda
5. 🔍 Lambda queries DynamoDB for facilities
6. 📊 Lambda calculates distances and filters results
7. 📤 Lambda returns JSON response
8. 📱 App displays nearby services to user
```

## Security & Privacy Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIVACY-FIRST DESIGN                        │
├─────────────────────────────────────────────────────────────────┤
│  🔒 No Authentication Required                                 │
│  • Users start immediately                                     │
│  • No account creation needed                                  │
│  • No personal data collection                                 │
│                               │                                │
│  🆔 Device-Based Tracking                                     │
│  • Unique device ID generation                                 │
│  • Anonymous usernames (User_1234)                            │
│  • No cross-device tracking                                   │
│  • Local storage for preferences                               │
│                               │                                │
│  🛡️ Security Measures                                         │
│  • HTTPS encryption for all communications                    │
│  • Input validation and sanitization                          │
│  • Rate limiting to prevent abuse                             │
│  • CORS policies for web access                               │
└─────────────────────────────────────────────────────────────────┘
```

## Scalability Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTO-SCALING DESIGN                         │
├─────────────────────────────────────────────────────────────────┤
│  📈 Lambda Functions          │  🗄️ DynamoDB                  │
│  • 0 to 1000+ concurrent      │  • On-demand billing           │
│  • Automatic scaling          │  • Single-digit millisecond    │
│  • Pay-per-request            │  • Global tables support       │
│                               │                                │
│  🌐 API Gateway               │  🖼️ S3 Storage                │
│  • 10,000+ requests/second    │  • Unlimited storage           │
│  • Global edge locations      │  • CDN integration ready       │
│  • Built-in caching           │  • 99.999999999% durability    │
└─────────────────────────────────────────────────────────────────┘
```

## Cost Optimization

```
Monthly Cost Breakdown (Typical Usage):
┌─────────────────────────────────────────────────────────────────┐
│  Service              │  Usage           │  Cost               │
├─────────────────────────────────────────────────────────────────┤
│  DynamoDB             │  100K operations │  $0.25              │
│  API Gateway          │  100K requests   │  $3.50              │
│  Lambda               │  100K invocations│  $0.20              │
│  S3 Storage           │  1GB + 1K reqs   │  $0.023             │
├─────────────────────────────────────────────────────────────────┤
│  TOTAL                │                  │  ~$4.00/month       │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
Frontend Technologies:
┌─────────────────────────────────────────────────────────────────┐
│  React Native (Mobile)         │  HTML5/CSS3/JS (Web)          │
│  • React Navigation            │  • Responsive Design           │
│  • React Native Maps           │  • Browser APIs                │
│  • React Native Voice          │  • Progressive Web App         │
│  • AsyncStorage                │  • Service Workers             │
└─────────────────────────────────────────────────────────────────┘

Backend Technologies:
┌─────────────────────────────────────────────────────────────────┐
│  AWS Serverless Stack                                          │
│  • Lambda (Python 3.9)        │  • DynamoDB (NoSQL)           │
│  • API Gateway (REST)          │  • S3 (Object Storage)        │
│  • SAM (Infrastructure)        │  • CloudWatch (Monitoring)    │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
Development → Staging → Production
     │           │          │
     ▼           ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Local   │ │ AWS     │ │ AWS     │
│ Testing │ │ Dev     │ │ Prod    │
│         │ │ Env     │ │ Env     │
└─────────┘ └─────────┘ └─────────┘
     │           │          │
     ▼           ▼          ▼
┌─────────────────────────────────┐
│        AWS SAM Deploy           │
│  • Infrastructure as Code       │
│  • Environment-specific configs │
│  • Automated rollback           │
│  • Blue-green deployments       │
└─────────────────────────────────┘
```
