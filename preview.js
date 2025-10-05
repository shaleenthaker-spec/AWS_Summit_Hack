// Simple Node.js preview server to show the app UI
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lavatory Finder - App Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 375px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            padding: 50px 20px 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .greeting {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 4px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 8px;
        }
        .location-text {
            font-size: 12px;
            color: #6b7280;
        }
        .voice-button {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .quick-access {
            padding: 20px;
            display: flex;
            gap: 12px;
            overflow-x: auto;
        }
        .quick-btn {
            min-width: 80px;
            height: 80px;
            border-radius: 20px;
            border: 2px solid;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            text-decoration: none;
        }
        .quick-btn.bathroom { border-color: #2563eb; color: #2563eb; }
        .quick-btn.water { border-color: #059669; color: #059669; }
        .quick-btn.sanitizer { border-color: #dc2626; color: #dc2626; }
        .quick-btn.sink { border-color: #7c3aed; color: #7c3aed; }
        .quick-btn-text {
            font-size: 10px;
            font-weight: 600;
            margin-top: 4px;
            text-transform: capitalize;
        }
        .services {
            padding: 20px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 16px;
        }
        .service-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
        }
        .service-info {
            flex: 1;
            margin-right: 12px;
        }
        .service-name {
            font-size: 16px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 4px;
        }
        .service-address {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .rating-distance {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #6b7280;
        }
        .service-icon {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
        }
        .ad-banner {
            margin: 20px;
            height: 80px;
            border-radius: 12px;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border: 1px dashed #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
        }
        .tabs {
            display: flex;
            background: white;
            border-top: 1px solid #e5e7eb;
            padding: 10px 0;
        }
        .tab {
            flex: 1;
            text-align: center;
            padding: 8px;
            color: #6b7280;
            text-decoration: none;
        }
        .tab.active {
            color: #2563eb;
        }
        .tab-icon {
            font-size: 24px;
            margin-bottom: 4px;
        }
        .tab-label {
            font-size: 12px;
            font-weight: 500;
        }
        .preview-info {
            background: #eff6ff;
            padding: 16px;
            margin: 20px;
            border-radius: 12px;
            border: 1px solid #dbeafe;
        }
        .preview-info h3 {
            margin: 0 0 8px 0;
            color: #2563eb;
            font-size: 16px;
        }
        .preview-info p {
            margin: 0;
            color: #374151;
            font-size: 14px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div>
                    <div class="greeting">Find Your Nearest</div>
                    <div class="title">Lavatory Services</div>
                    <div class="location-text">📍 Location updated</div>
                </div>
                <div class="voice-button">🎤</div>
            </div>
        </div>

        <!-- Quick Access -->
        <div class="quick-access">
            <div class="quick-btn bathroom">
                🚽
                <div class="quick-btn-text">Bathroom</div>
            </div>
            <div class="quick-btn water">
                💧
                <div class="quick-btn-text">Water Fountain</div>
            </div>
            <div class="quick-btn sanitizer">
                🧴
                <div class="quick-btn-text">Hand Sanitizer</div>
            </div>
            <div class="quick-btn sink">
                🚰
                <div class="quick-btn-text">Sink</div>
            </div>
        </div>

        <!-- Services -->
        <div class="services">
            <div class="section-title">Nearby Services</div>
            
            <div class="service-card">
                <div class="service-info">
                    <div class="service-name">City Mall Restroom</div>
                    <div class="service-address">123 Main St, Downtown</div>
                    <div class="rating-distance">
                        <span>⭐ 4.2 (156)</span>
                        <span>📍 0.3 km</span>
                    </div>
                </div>
                <div class="service-icon" style="color: #2563eb;">🚽</div>
            </div>

            <div class="service-card">
                <div class="service-info">
                    <div class="service-name">Central Park Water Fountain</div>
                    <div class="service-address">456 Park Ave</div>
                    <div class="rating-distance">
                        <span>⭐ 4.5 (89)</span>
                        <span>📍 0.7 km</span>
                    </div>
                </div>
                <div class="service-icon" style="color: #059669;">💧</div>
            </div>

            <div class="service-card">
                <div class="service-info">
                    <div class="service-name">Airport Hand Sanitizer Station</div>
                    <div class="service-address">789 Airport Blvd</div>
                    <div class="rating-distance">
                        <span>⭐ 3.8 (234)</span>
                        <span>📍 1.2 km</span>
                    </div>
                </div>
                <div class="service-icon" style="color: #dc2626;">🧴</div>
            </div>

            <!-- Ad Banner -->
            <div class="ad-banner">
                📢 Advertisement Space
            </div>
        </div>

        <!-- Bottom Tabs -->
        <div class="tabs">
            <div class="tab active">
                <div class="tab-icon">🏠</div>
                <div class="tab-label">Home</div>
            </div>
        <div class="tab" onclick="showTab('map')">
          <div class="tab-icon">🗺️</div>
          <div class="tab-label">Map</div>
        </div>
        <div class="tab" onclick="showTab('search')">
          <div class="tab-icon">🔍</div>
          <div class="tab-label">Search</div>
        </div>
            <div class="tab">
                <div class="tab-icon">👤</div>
                <div class="tab-label">Profile</div>
            </div>
        </div>
    </div>

    <div class="preview-info">
        <h3>📱 App Preview</h3>
        <p>This shows how the Lavatory Finder app will look on a mobile device. The app features:</p>
        <ul>
            <li>🎤 Voice controls for hands-free operation</li>
            <li>🗺️ GPS map integration with service markers</li>
            <li>⭐ Ratings and reviews for each service</li>
            <li>📢 Contextual advertisements</li>
            <li>🎯 Touch-minimal design for hygiene</li>
        </ul>
        <p><strong>To run the full app:</strong> Use React Native with iOS/Android simulators</p>
    </div>

    <script>
        // Tab switching functionality
        function showTab(tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            event.target.closest('.tab').classList.add('active');
            
            // Show different content based on tab
            const container = document.querySelector('.container');
            
            if (tabName === 'map') {
                container.innerHTML = `
                    <div class="header">
                        <div class="header-content">
                            <div>
                                <div class="greeting">🗺️</div>
                                <div class="title">Map View</div>
                                <div class="location-text">📍 Find services near you</div>
                            </div>
                            <div class="voice-button">🎤</div>
                        </div>
                    </div>
                    
                    <div style="height: 300px; margin: 20px; background: #f9fafb; border: 2px dashed #e5e7eb; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="font-size: 64px; margin-bottom: 16px;">🗺️</div>
                        <div style="font-size: 18px; font-weight: bold; color: #6b7280; margin-bottom: 8px;">Interactive Map</div>
                        <div style="font-size: 14px; color: #9ca3af;">4 services shown</div>
                        
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <div style="width: 40px; height: 40px; border-radius: 20px; background: #2563eb; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">🚽</div>
                            <div style="width: 40px; height: 40px; border-radius: 20px; background: #059669; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">💧</div>
                            <div style="width: 40px; height: 40px; border-radius: 20px; background: #dc2626; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">🧴</div>
                        </div>
                    </div>
                    
                    <div style="margin: 20px; padding: 16px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">City Mall Restroom</div>
                        <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">123 Main St, Downtown</div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 12px; color: #6b7280;">⭐ 4.2 (156)</span>
                            <span style="font-size: 12px; color: #6b7280;">📍 0.3 km</span>
                        </div>
                    </div>
                    
                    <div class="tabs">
                        <div class="tab">
                            <div class="tab-icon">🏠</div>
                            <div class="tab-label">Home</div>
                        </div>
                        <div class="tab active">
                            <div class="tab-icon">🗺️</div>
                            <div class="tab-label">Map</div>
                        </div>
                        <div class="tab" onclick="showTab('search')">
                            <div class="tab-icon">🔍</div>
                            <div class="tab-label">Search</div>
                        </div>
                        <div class="tab" onclick="showTab('profile')">
                            <div class="tab-icon">👤</div>
                            <div class="tab-label">Profile</div>
                        </div>
                    </div>
                `;
            } else if (tabName === 'search') {
                container.innerHTML = `
                    <div class="header">
                        <div class="header-content">
                            <div>
                                <div class="greeting">🔍</div>
                                <div class="title">Search Services</div>
                                <div class="location-text">Find exactly what you need</div>
                            </div>
                            <div class="voice-button">🎤</div>
                        </div>
                    </div>
                    
                    <div style="padding: 20px;">
                        <div style="display: flex; align-items: center; background: #f9fafb; border-radius: 12px; padding: 12px 16px; border: 1px solid #e5e7eb;">
                            <span style="font-size: 20px; color: #6b7280;">🔍</span>
                            <input type="text" placeholder="Search for bathrooms, water fountains..." style="flex: 1; font-size: 16px; color: #111827; margin-left: 8px; border: none; background: transparent; outline: none;">
                        </div>
                    </div>
                    
                    <div style="padding: 0 20px 20px;">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Quick Search</div>
                        <div style="display: flex; gap: 8px; overflow-x: auto;">
                            <div style="background: #eff6ff; padding: 8px 16px; border-radius: 20px; border: 1px solid #dbeafe; font-size: 14px; color: #2563eb; white-space: nowrap;">Public restrooms</div>
                            <div style="background: #eff6ff; padding: 8px 16px; border-radius: 20px; border: 1px solid #dbeafe; font-size: 14px; color: #2563eb; white-space: nowrap;">Water fountains</div>
                            <div style="background: #eff6ff; padding: 8px 16px; border-radius: 20px; border: 1px solid #dbeafe; font-size: 14px; color: #2563eb; white-space: nowrap;">Hand sanitizer</div>
                        </div>
                    </div>
                    
                    <div style="padding: 0 20px 20px;">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">4 results found</div>
                        
                        <div style="background: white; border-radius: 16px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center;">
                            <div style="flex: 1; margin-right: 12px;">
                                <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">City Mall Restroom</div>
                                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">123 Main St, Downtown</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-size: 12px; color: #6b7280;">⭐ 4.2 (156)</span>
                                    <span style="font-size: 12px; color: #6b7280;">📍 0.3 km</span>
                                </div>
                            </div>
                            <div style="width: 60px; height: 60px; border-radius: 30px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #2563eb;">🚽</div>
                        </div>
                    </div>
                    
                    <div class="tabs">
                        <div class="tab">
                            <div class="tab-icon">🏠</div>
                            <div class="tab-label">Home</div>
                        </div>
                        <div class="tab" onclick="showTab('map')">
                            <div class="tab-icon">🗺️</div>
                            <div class="tab-label">Map</div>
                        </div>
                        <div class="tab active">
                            <div class="tab-icon">🔍</div>
                            <div class="tab-label">Search</div>
                        </div>
                        <div class="tab" onclick="showTab('profile')">
                            <div class="tab-icon">👤</div>
                            <div class="tab-label">Profile</div>
                        </div>
                    </div>
                `;
            } else if (tabName === 'profile') {
                container.innerHTML = `
                    <div class="header">
                        <div class="header-content">
                            <div>
                                <div class="greeting">⚙️</div>
                                <div class="title">Settings</div>
                                <div class="location-text">Customize your experience</div>
                            </div>
                            <div class="voice-button">🎤</div>
                        </div>
                    </div>
                    
                    <div style="padding: 20px;">
                        <div style="background: #eff6ff; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #dbeafe; margin-bottom: 20px;">
                            <div style="font-size: 24px; color: #2563eb; margin-bottom: 8px;">ℹ️</div>
                            <div style="font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 4px;">No Account Required</div>
                            <div style="font-size: 14px; color: #374151; line-height: 20px;">This app works without creating an account. Your reviews are tracked by device ID to prevent duplicates.</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">Preferences</div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                                <div style="display: flex; align-items: center;">
                                    <span style="font-size: 20px; color: #2563eb; margin-right: 12px;">🔔</span>
                                    <span style="font-size: 16px; color: #111827;">Push Notifications</span>
                                </div>
                                <div style="width: 44px; height: 24px; border-radius: 12px; background: #2563eb; position: relative;">
                                    <div style="width: 20px; height: 20px; border-radius: 10px; background: white; position: absolute; right: 2px; top: 2px;"></div>
                                </div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                                <div style="display: flex; align-items: center;">
                                    <span style="font-size: 20px; color: #dc2626; margin-right: 12px;">🎤</span>
                                    <span style="font-size: 16px; color: #111827;">Voice Control</span>
                                </div>
                                <div style="width: 44px; height: 24px; border-radius: 12px; background: #2563eb; position: relative;">
                                    <div style="width: 20px; height: 20px; border-radius: 10px; background: white; position: absolute; right: 2px; top: 2px;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
                            <div style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Device Information</div>
                            <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Device ID: User_****</div>
                            <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Platform: React Native</div>
                            <div style="font-size: 14px; color: #6b7280;">Version: 1.0.0</div>
                        </div>
                    </div>
                    
                    <div class="tabs">
                        <div class="tab">
                            <div class="tab-icon">🏠</div>
                            <div class="tab-label">Home</div>
                        </div>
                        <div class="tab" onclick="showTab('map')">
                            <div class="tab-icon">🗺️</div>
                            <div class="tab-label">Map</div>
                        </div>
                        <div class="tab" onclick="showTab('search')">
                            <div class="tab-icon">🔍</div>
                            <div class="tab-label">Search</div>
                        </div>
                        <div class="tab active">
                            <div class="tab-icon">👤</div>
                            <div class="tab-label">Profile</div>
                        </div>
                    </div>
                `;
            }
            
            // Re-add event listeners for new elements
            setupEventListeners();
        }
        
        function setupEventListeners() {
            document.querySelectorAll('.quick-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    alert('Quick access to: ' + this.querySelector('.quick-btn-text').textContent);
                });
            });

            document.querySelectorAll('.voice-button').forEach(btn => {
                btn.addEventListener('click', function() {
                    alert('🎤 Voice control activated! Say "Find bathroom" or "Show water fountains"');
                });
            });
        }
        
        // Initial setup
        setupEventListeners();
    </script>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`📱 Lavatory Finder App Preview running at http://localhost:${PORT}`);
  console.log('Open this URL in your browser to see the app design!');
});
