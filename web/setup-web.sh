#!/bin/bash

# Lavatory Finder Web App Setup Script
echo "🚽 Setting up Lavatory Finder Web App..."

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

# Install web dependencies
echo "📦 Installing web dependencies..."
npm install

echo "✅ Web app setup complete!"
echo ""
echo "🚀 To run the web app:"
echo "   npm start"
echo ""
echo "🌐 The app will open at: http://localhost:3000"
echo ""
echo "📱 Features:"
echo "   ✅ Location services (browser geolocation)"
echo "   ✅ Service search and filtering"
echo "   ✅ Interactive navigation"
echo "   ✅ Responsive design"
echo "   ✅ Mock data for demonstration"
echo "   ✅ Ready for AWS backend integration"
echo ""
echo "🔧 To stop the app: Press Ctrl+C"
