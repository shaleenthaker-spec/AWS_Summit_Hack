#!/bin/bash

# Lavatory Finder Web App Launcher
echo "🚽 Launching Lavatory Finder Web App..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Navigate to web-simple directory
cd web-simple

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found in web-simple directory"
    exit 1
fi

echo "✅ Starting web server on http://localhost:3000"
echo ""
echo "🌐 Open your browser and go to: http://localhost:3000"
echo ""
echo "📱 Features:"
echo "   ✅ Location services (browser geolocation)"
echo "   ✅ Service search and filtering"
echo "   ✅ Interactive navigation"
echo "   ✅ Responsive design"
echo "   ✅ Mock data for demonstration"
echo ""
echo "🔧 To stop the server: Press Ctrl+C"
echo ""

# Start the server
python3 -m http.server 3000
