# Lavatory Finder - React Native Mobile App

A minimalistic mobile application that helps users find nearby bathrooms, water fountains, hand sanitizers, and sinks with GPS integration, ratings, reviews, and contextual advertisements.

## Features

- **GPS Map Integration**: Real-time location services with interactive maps
- **Service Discovery**: Find bathrooms, water fountains, hand sanitizers, and sinks
- **Ratings & Reviews**: User-generated content with star ratings and detailed reviews
- **Image Support**: Upload and view photos of facilities
- **Voice Controls**: Hands-free operation with voice commands
- **Touch-Minimal UI**: Designed for minimal physical contact
- **Contextual Ads**: Non-intrusive advertisement placements
- **Real-time Updates**: Live availability and status information

## Tech Stack

- **Frontend**: React Native 0.72.6
- **Navigation**: React Navigation 6
- **Maps**: React Native Maps
- **Voice**: React Native Voice
- **Location**: React Native Geolocation Service
- **Styling**: React Native Linear Gradient, Vector Icons
- **Backend**: AWS Services (Amplify, Cognito, DynamoDB, API Gateway, Lambda, S3, Pinpoint)

## Project Structure

```
├── App.tsx                          # Main app component
├── package.json                     # Dependencies and scripts
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── AdBanner.tsx            # Advertisement component
│   │   ├── ReviewCard.tsx          # Review display
│   │   ├── ServiceCard.tsx         # Service listing card
│   │   └── VoiceButton.tsx         # Voice control button
│   ├── context/                     # React context providers
│   │   ├── LocationContext.tsx     # GPS location management
│   │   └── VoiceControlContext.tsx # Voice recognition
│   ├── screens/                     # Main app screens
│   │   ├── HomeScreen.tsx          # Dashboard
│   │   ├── MapScreen.tsx           # GPS map with markers
│   │   ├── SearchScreen.tsx        # Service search
│   │   ├── ServiceDetailScreen.tsx # Service details
│   │   ├── ProfileScreen.tsx       # User settings
│   │   └── AddReviewScreen.tsx     # Review submission
│   ├── types/                       # TypeScript definitions
│   │   └── Service.ts              # Data models
│   └── config/                      # Configuration files
│       └── aws.ts                  # AWS configuration
├── AWS_INTEGRATION_GUIDE.md        # Comprehensive AWS setup
├── AI_INTEGRATION_INSTRUCTIONS.txt # AI integration guide
└── README.md                       # This file
```

## Installation

### Prerequisites

- Node.js 16+ 
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- AWS Account (for backend services)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AWS_Summit_Hack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the application**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## AWS Integration

This application requires AWS backend services for full functionality. Currently, it runs with mock data and placeholder implementations.

### Required AWS Services

- **Amazon Cognito**: User authentication and authorization
- **Amazon DynamoDB**: Data storage for services, reviews, and users
- **Amazon API Gateway**: RESTful API endpoints
- **AWS Lambda**: Serverless compute functions
- **Amazon S3**: File storage for images
- **Amazon CloudFront**: CDN for fast image delivery
- **Amazon Pinpoint**: Analytics and push notifications

### Integration Status

🟡 **Frontend Complete**: All UI components and screens are implemented
🟡 **AWS Integration Pending**: Backend services need to be implemented

All placeholder code is clearly marked with:
- `AWS INTEGRATION PLACEHOLDER` comments
- `TODO: Replace with actual AWS API call` comments
- Mock data functions that need replacement

### Quick Start with AWS

1. **Set up AWS Amplify**
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add auth
   amplify add api
   amplify add storage
   ```

2. **Follow the detailed guides**
   - See `AWS_INTEGRATION_GUIDE.md` for comprehensive setup instructions
   - See `AI_INTEGRATION_INSTRUCTIONS.txt` for AI-assisted integration

## Key Features

### 🗺️ GPS Map Integration
- Real-time location tracking
- Interactive map with service markers
- Distance calculations and routing
- Voice-controlled navigation

### 🏢 Service Discovery
- **Bathrooms**: Public restrooms with accessibility info
- **Water Fountains**: Drinking water stations
- **Hand Sanitizer**: Sanitizing stations
- **Sinks**: Hand washing facilities

### ⭐ Ratings & Reviews
- 5-star rating system
- Detailed written reviews
- Photo uploads
- Helpful votes and replies

### 🎤 Voice Controls
- Hands-free operation
- Voice search commands
- Navigation via voice
- Accessibility features

### 📱 Touch-Minimal Design
- Large touch targets
- Gesture-based navigation
- Minimal screen interactions
- Voice-first approach

### 📢 Contextual Advertising
- Non-intrusive ad placements
- Location-based targeting
- User preference integration
- Revenue optimization

## Development

### Available Scripts

```bash
npm start          # Start Metro bundler
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run test       # Run tests
npm run lint       # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

### Testing

```bash
npm test           # Run unit tests
npm run test:e2e   # Run end-to-end tests
```

## Deployment

### Mobile App Stores

1. **iOS App Store**
   - Build with Xcode
   - Submit for review
   - Handle app store guidelines

2. **Google Play Store**
   - Generate signed APK
   - Upload to Play Console
   - Handle store policies

### AWS Deployment

1. **Amplify Hosting** (for web version)
   ```bash
   amplify publish
   ```

2. **Mobile Backend**
   - Deploy Lambda functions
   - Configure API Gateway
   - Set up DynamoDB tables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the AWS Integration Guide
- Review the AI Integration Instructions
- Open an issue on GitHub

## Roadmap

### Phase 1: Core Functionality ✅
- [x] Frontend UI/UX
- [x] Navigation and routing
- [x] Location services
- [x] Voice controls

### Phase 2: AWS Integration 🚧
- [ ] Authentication system
- [ ] Data storage and retrieval
- [ ] Image upload functionality
- [ ] Real-time updates

### Phase 3: Advanced Features 📋
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Offline functionality
- [ ] Multi-language support

### Phase 4: Optimization 🎯
- [ ] Performance optimization
- [ ] Cost optimization
- [ ] Security hardening
- [ ] Scalability improvements

---

**Note**: This application is designed for the AWS Summit Hack and demonstrates a complete mobile app architecture with AWS integration points clearly marked for easy implementation.