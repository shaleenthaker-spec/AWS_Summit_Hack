# 🚽 Lavatory Finder - Getting Started Guide

This guide will help you get the Lavatory Finder app running on your system.

## 📋 Prerequisites

Before you begin, ensure you have:

- **macOS** (for iOS development)
- **Administrator access** (for installing tools)
- **AWS Account** (free tier is sufficient)
- **Xcode** (for iOS development)

## 🚀 Quick Start (30 minutes)

### Step 1: Install Node.js and npm

1. **Download Node.js**: Go to https://nodejs.org
2. **Install**: Download and run the LTS version installer
3. **Verify**: Open Terminal and run:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Project Dependencies

```bash
# Navigate to project directory
cd /Users/shaleenthaker/Desktop/AWS_Summit_Hackathon/AWS_Summit_Hack-1

# Install dependencies
npm install

# Install React Native CLI globally
npm install -g react-native-cli
```

### Step 3: Install iOS Dependencies

```bash
# Install CocoaPods (if not already installed)
sudo gem install cocoapods

# Install iOS dependencies
cd ios
pod install
cd ..
```

### Step 4: Set Up AWS Backend

1. **Install AWS CLI**:
   ```bash
   brew install awscli
   ```

2. **Install AWS SAM CLI**:
   ```bash
   brew install aws-sam-cli
   ```

3. **Configure AWS**:
   ```bash
   aws configure
   # Enter your AWS credentials
   ```

4. **Deploy Backend**:
   ```bash
   cd backend
   sam build
   sam deploy --guided
   ```

5. **Populate Sample Data**:
   ```bash
   pip install boto3
   python sample_data.py
   ```

### Step 5: Configure Mobile App

1. **Get API Gateway URL** from the deployment output
2. **Update configuration** in `src/config/aws.ts`:
   ```typescript
   export const AWS_CONFIG = {
     apiGatewayUrl: 'https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod',
     // ... rest of config
   };
   ```

### Step 6: Run the App

```bash
# Start Metro bundler
npm start

# In a new terminal, run iOS app
npm run ios

# Or run Android app (if Android Studio is set up)
npm run android
```

## 🎯 What You'll See

The app will show:
- **Home Screen**: Current location and nearby services
- **Map Screen**: Interactive map with service markers
- **Search Screen**: Find services by type or location
- **Profile Screen**: App settings and preferences

## 🔧 Troubleshooting

### Common Issues

1. **"node not found"**
   - Install Node.js from https://nodejs.org
   - Restart Terminal after installation

2. **"pod not found"**
   - Install CocoaPods: `sudo gem install cocoapods`
   - Run `pod install` in the `ios` directory

3. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

4. **iOS build issues**
   - Open `ios/tempapp.xcworkspace` in Xcode
   - Clean build folder (Product → Clean Build Folder)
   - Try building again

5. **AWS deployment issues**
   - Check AWS credentials: `aws sts get-caller-identity`
   - Ensure you have the necessary permissions
   - Check the AWS region is correct

### Getting Help

- **Documentation**: Check the README.md and other .md files
- **AWS Issues**: See AWS_INTEGRATION_GUIDE.md
- **Backend Issues**: See BACKEND_DEPLOYMENT.md
- **No Auth Setup**: See NO_AUTH_AWS_GUIDE.md

## 📱 Testing the App

### Test Location Services
1. Allow location permissions when prompted
2. Verify your location appears on the home screen
3. Check that nearby services are fetched

### Test AWS Integration
1. Ensure backend is deployed and running
2. Check that services appear in the app
3. Try submitting a rating/review

### Test Voice Control
1. Tap the voice button
2. Say commands like "Find bathrooms nearby"
3. Verify voice commands work

## 🎉 Success!

If everything is working:
- ✅ App launches without errors
- ✅ Location services work
- ✅ Nearby services are displayed
- ✅ AWS backend responds to requests
- ✅ Voice control is functional

## 📚 Next Steps

1. **Customize the app** for your needs
2. **Add more services** to the database
3. **Deploy to app stores** when ready
4. **Set up monitoring** and analytics
5. **Add more features** like offline mode

## 💰 Cost Management

The app is designed to be cost-effective:
- **Monthly cost**: ~$4 for typical usage
- **Free tier**: Most AWS services have generous free tiers
- **Pay-per-use**: Only pay for what you use

## 🆘 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check AWS CloudWatch logs for backend issues
4. Use React Native debugging tools for frontend issues

---

**Happy coding! 🚽✨**
