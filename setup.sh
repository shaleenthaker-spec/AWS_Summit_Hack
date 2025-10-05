#!/bin/bash

# Lavatory Finder App Setup Script
echo "🚽 Setting up Lavatory Finder App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   1. Go to https://nodejs.org"
    echo "   2. Download and install the LTS version"
    echo "   3. Restart your terminal"
    echo "   4. Run this script again"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Install iOS dependencies
echo "🍎 Setting up iOS dependencies..."
cd ios
if command -v pod &> /dev/null; then
    pod install
else
    echo "⚠️  CocoaPods not found. Installing..."
    sudo gem install cocoapods
    pod install
fi
cd ..

# Install React Native CLI globally
echo "⚛️  Installing React Native CLI..."
npm install -g react-native-cli

# Create environment file
echo "🔧 Creating environment configuration..."
cat > .env << EOF
# AWS Configuration
AWS_API_GATEWAY_URL=https://your-api-id.execute-api.region.amazonaws.com/prod
AWS_S3_BUCKET_NAME=lavatory-finder-images
AWS_S3_REGION=us-east-1
AWS_DYNAMODB_REGION=us-east-1

# Development
NODE_ENV=development
EOF

echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Set up AWS backend (see AWS_INTEGRATION_GUIDE.md)"
echo "   2. Update .env file with your AWS endpoints"
echo "   3. Run: npm run ios (for iOS) or npm run android (for Android)"
echo ""
echo "📚 Documentation:"
echo "   - README.md - General app information"
echo "   - AWS_INTEGRATION_GUIDE.md - Complete AWS setup"
echo "   - NO_AUTH_AWS_GUIDE.md - Simplified AWS setup (no auth)"
