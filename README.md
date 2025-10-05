# Lavatory Finder - Mobile App

A React Native mobile application for finding nearby lavatory services including bathrooms, water fountains, hand sanitizer dispensers, and sinks. Features GPS integration, ratings, reviews, and minimal contact design.

## 🚀 Features

- **GPS Integration**: Find services near your current location
- **Service Types**: Bathrooms, water fountains, hand sanitizer, sinks
- **Ratings & Reviews**: User-generated content with photos
- **Voice Control**: Hands-free operation for hygiene
- **Minimal Contact**: Touch-minimal design
- **Contextual Ads**: Non-intrusive advertising placements
- **No Account Required**: Device-based tracking prevents duplicate reviews

## 📱 Tech Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Maps**: React Native Maps
- **Location**: React Native Geolocation Service
- **Voice**: React Native Voice
- **Storage**: AsyncStorage + Device Info
- **AWS Integration**: API Gateway, Lambda, DynamoDB, S3

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── config/
│   └── aws.ts          # AWS configuration
├── context/            # React Context providers
├── screens/            # App screens
├── services/
│   └── api.ts          # API service layer
├── types/
│   └── Service.ts      # TypeScript type definitions
└── utils/
    └── device.ts       # Device ID utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- AWS Account (for backend)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **iOS Setup:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Run the app:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Start Metro bundler
   npm start
   ```

## 🌐 AWS Integration

This app is designed to work with AWS services. See the comprehensive integration guide:

- **Complete Guide**: [AWS_INTEGRATION_GUIDE.md](./AWS_INTEGRATION_GUIDE.md)

### Core AWS Services (No Auth Required)
1. **Amazon API Gateway** - REST API endpoints
2. **AWS Lambda** - Serverless functions
3. **Amazon DynamoDB** - NoSQL database
4. **Amazon S3** - Image storage

### Cost Estimation
- **Monthly Cost**: ~$4 (depending on usage)
- **Free Tier**: Most services have generous free tiers

## 📱 App Features

### Home Screen
- Current location display
- Nearby services list
- Quick access buttons
- Voice control integration

### Map Screen
- Interactive GPS map
- Service markers with types
- Distance indicators
- Filter options

### Search Screen
- Text-based search
- Category filters
- Advanced filters (amenities, rating)
- Search history

### Service Detail Screen
- Complete service information
- Photo gallery
- Reviews and ratings
- Add review functionality
- Directions integration

### Profile Screen
- App settings
- Review history
- Preferences
- About information

## 🎨 Design Principles

### Minimal Contact Design
- Large touch targets
- Voice control options
- Gesture-based navigation
- Minimal typing required

### Hygiene Focus
- Touch-minimal interactions
- Voice commands
- Quick access patterns
- Sanitization reminders

### Accessibility
- High contrast colors
- Large fonts
- Voice control
- Screen reader support

## 🔒 Privacy & Security

### Data Collection
- **Location**: Only when app is active
- **Reviews**: Anonymous device-based tracking
- **Images**: Optional user uploads
- **No Personal Data**: No accounts required

### Device Tracking
- Unique device IDs prevent duplicate reviews
- Anonymous usernames (User_1234)
- Local storage for preferences
- No cross-device tracking

## 🧪 Testing

### Manual Testing
1. **Location Services**: Test GPS accuracy
2. **Voice Control**: Test voice commands
3. **Offline Mode**: Test without internet
4. **Device Rotation**: Test landscape mode
5. **Deep Links**: Test navigation

### Automated Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📦 Building for Production

### iOS
```bash
# Build for App Store
npm run build:ios:release

# Archive in Xcode
# Product → Archive → Distribute App
```

### Android
```bash
# Build APK
npm run build:android:release

# Build AAB for Play Store
npm run build:android:bundle
```

## 🚀 Deployment

### App Stores
1. **iOS**: Apple App Store
2. **Android**: Google Play Store

### AWS Backend
1. Deploy Lambda functions
2. Configure API Gateway
3. Set up DynamoDB tables
4. Configure S3 buckets
5. Update app configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
1. **Metro bundler issues**: `npx react-native start --reset-cache`
2. **iOS build issues**: Clean build folder in Xcode
3. **Android build issues**: `cd android && ./gradlew clean`
4. **AWS connection issues**: Check credentials and region

### Getting Help
- Check the [AWS Integration Guide](./AWS_INTEGRATION_GUIDE.md)
- Open an issue on GitHub
- Contact the development team

## 🔮 Future Enhancements

### Planned Features
- [ ] Offline mode with sync
- [ ] Push notifications
- [ ] Social sharing
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Machine learning recommendations

### Technical Improvements
- [ ] Performance optimization
- [ ] Code splitting
- [ ] Advanced caching
- [ ] Error boundaries
- [ ] Automated testing
- [ ] CI/CD pipeline
- [ ] Monitoring and logging
- [ ] Security enhancements

---

**Built with ❤️ for public hygiene and accessibility**