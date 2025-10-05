import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// Service data
const services = [
  {
    id: '1',
    name: 'City Mall Restroom',
    address: '123 Main St, Downtown',
    rating: '4.2',
    reviewCount: '156',
    distance: '0.3',
    icon: 'wc',
    color: '#2563eb',
    type: 'bathroom',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: '2',
    name: 'Central Park Water Fountain',
    address: '456 Park Ave',
    rating: '4.5',
    reviewCount: '89',
    distance: '0.7',
    icon: 'water-drop',
    color: '#059669',
    type: 'water_fountain',
    latitude: 37.7849,
    longitude: -122.4094,
  },
  {
    id: '3',
    name: 'Airport Hand Sanitizer Station',
    address: '789 Airport Blvd',
    rating: '3.8',
    reviewCount: '234',
    distance: '1.2',
    icon: 'clean-hands',
    color: '#dc2626',
    type: 'hand_sanitizer',
    latitude: 37.7949,
    longitude: -122.3994,
  },
  {
    id: '4',
    name: 'Public Library Sink',
    address: '321 Library St',
    rating: '4.0',
    reviewCount: '67',
    distance: '0.9',
    icon: 'water',
    color: '#7c3aed',
    type: 'sink',
    latitude: 37.7649,
    longitude: -122.4294,
  },
];

// ServiceCard component
const ServiceCard = ({ service }: { service: any }) => (
  <View style={styles.serviceCard}>
    <LinearGradient
      colors={['#ffffff', '#f8fafc']}
      style={styles.cardGradient}
    >
      <View style={styles.cardContent}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceAddress}>{service.address}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {service.rating} ({service.reviewCount})</Text>
            <Text style={styles.distance}>📍 {service.distance} km</Text>
          </View>
        </View>
        <View style={styles.serviceIcon}>
          <Icon name={service.icon} size={32} color={service.color} />
        </View>
      </View>
    </LinearGradient>
  </View>
);

// Map Screen Component
const MapScreen = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredServices = filterType 
    ? services.filter(service => service.type === filterType)
    : services;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <Text style={styles.title}>🗺️ Map View</Text>
        <Text style={styles.subtitle}>Find services near you</Text>
      </LinearGradient>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Icon name="map" size={64} color="#d1d5db" />
          <Text style={styles.mapText}>Interactive Map</Text>
          <Text style={styles.mapSubtext}>
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} shown
          </Text>
          
          {/* Service Markers */}
          <View style={styles.markersContainer}>
            {filteredServices.slice(0, 3).map((service, index) => (
              <TouchableOpacity
                key={service.id}
                style={[styles.marker, { backgroundColor: service.color }]}
                onPress={() => setSelectedService(service)}
              >
                <Icon name={service.icon} size={16} color="#ffffff" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterButton, !filterType && styles.filterButtonActive]}
          onPress={() => setFilterType(null)}
        >
          <Text style={[styles.filterButtonText, !filterType && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        {[
          { type: 'bathroom', icon: 'wc', color: '#2563eb' },
          { type: 'water_fountain', icon: 'water-drop', color: '#059669' },
          { type: 'hand_sanitizer', icon: 'clean-hands', color: '#dc2626' },
          { type: 'sink', icon: 'water', color: '#7c3aed' },
        ].map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[styles.filterButton, filterType === item.type && styles.filterButtonActive]}
            onPress={() => setFilterType(item.type)}
          >
            <Icon 
              name={item.icon} 
              size={16} 
              color={filterType === item.type ? '#ffffff' : item.color} 
            />
            <Text style={[
              styles.filterButtonText,
              filterType === item.type && styles.filterButtonTextActive,
              { color: filterType === item.type ? '#ffffff' : item.color }
            ]}>
              {item.type.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Service Info */}
      {selectedService && (
        <View style={styles.selectedServiceContainer}>
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.selectedServiceGradient}
          >
            <View style={styles.selectedServiceContent}>
              <View style={styles.selectedServiceInfo}>
                <Text style={styles.selectedServiceName}>{selectedService.name}</Text>
                <Text style={styles.selectedServiceAddress}>{selectedService.address}</Text>
                <View style={styles.selectedServiceDetails}>
                  <Text style={styles.selectedServiceRating}>
                    ⭐ {selectedService.rating} ({selectedService.reviewCount})
                  </Text>
                  <Text style={styles.selectedServiceDistance}>
                    📍 {selectedService.distance} km
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={() => alert('Opening directions to ' + selectedService.name)}
              >
                <Icon name="directions" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Ad Banner */}
      <View style={styles.adBanner}>
        <LinearGradient
          colors={['#f8fafc', '#ffffff']}
          style={styles.adGradient}
        >
          <Icon name="ads-click" size={20} color="#d1d5db" />
          <Text style={styles.adText}>Map Advertisement</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

// Search Screen Component
const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(services);
      return;
    }

    const results = services.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredResults = selectedFilters.length > 0
      ? results.filter(service => selectedFilters.includes(service.type))
      : results;

    setSearchResults(filteredResults);
  };

  React.useEffect(() => {
    performSearch();
  }, [searchQuery, selectedFilters]);

  const toggleFilter = (type: string) => {
    setSelectedFilters(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getQuickSuggestions = () => [
    'Public restrooms',
    'Water fountains',
    'Hand sanitizer',
    'Wheelchair accessible',
    'Near me',
    'Open now',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <Text style={styles.title}>🔍 Search Services</Text>
        <Text style={styles.subtitle}>Find exactly what you need</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for bathrooms, water fountains..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="clear" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Suggestions */}
      {!searchQuery && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Quick Search</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {getQuickSuggestions().map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setSearchQuery(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filtersToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter-list" size={20} color="#6b7280" />
          <Text style={styles.filtersToggleText}>
            Filters {showFilters ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterButtons}
          >
            {[
              { type: 'bathroom', icon: 'wc', color: '#2563eb' },
              { type: 'water_fountain', icon: 'water-drop', color: '#059669' },
              { type: 'hand_sanitizer', icon: 'clean-hands', color: '#dc2626' },
              { type: 'sink', icon: 'water', color: '#7c3aed' },
            ].map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.filterButton,
                  selectedFilters.includes(item.type) && styles.filterButtonActive
                ]}
                onPress={() => toggleFilter(item.type)}
              >
                <Icon 
                  name={item.icon} 
                  size={16} 
                  color={selectedFilters.includes(item.type) ? '#ffffff' : item.color} 
                />
                <Text style={[
                  styles.filterButtonText,
                  selectedFilters.includes(item.type) && styles.filterButtonTextActive,
                  { color: selectedFilters.includes(item.type) ? '#ffffff' : item.color }
                ]}>
                  {item.type.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsHeader}>
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
        </Text>
        
        <FlatList
          data={searchResults}
          renderItem={({ item }) => <ServiceCard service={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="search-off" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySubtext}>
                Try different keywords or adjust your filters
              </Text>
            </View>
          }
        />
      </View>

      {/* Ad Banner */}
      <View style={styles.adBanner}>
        <LinearGradient
          colors={['#f8fafc', '#ffffff']}
          style={styles.adGradient}
        >
          <Icon name="ads-click" size={20} color="#d1d5db" />
          <Text style={styles.adText}>Search Advertisement</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

// HomeScreen Component
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Find Your Nearest</Text>
            <Text style={styles.title}>Lavatory Services</Text>
            <Text style={styles.locationText}>
              <Icon name="location-on" size={14} color="#6b7280" /> 
              {' '}Location updated
            </Text>
          </View>
          <View style={styles.voiceButton}>
            <Icon name="mic" size={24} color="#ffffff" />
          </View>
        </View>
      </LinearGradient>

      {/* Quick Access Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickAccessContainer}
        contentContainerStyle={styles.quickAccessContent}
      >
        {[
          { type: 'bathroom', icon: 'wc', color: '#2563eb' },
          { type: 'water fountain', icon: 'water-drop', color: '#059669' },
          { type: 'hand sanitizer', icon: 'clean-hands', color: '#dc2626' },
          { type: 'sink', icon: 'water', color: '#7c3aed' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.quickAccessButton, { borderColor: item.color }]}
            onPress={() => alert(`Quick access to: ${item.type}`)}
          >
            <Icon name={item.icon} size={24} color={item.color} />
            <Text style={[styles.quickAccessText, { color: item.color }]}>
              {item.type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Nearby Services</Text>
        
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}

        {/* Ad Banner */}
        <View style={styles.adBanner}>
          <LinearGradient
            colors={['#f8fafc', '#ffffff']}
            style={styles.adGradient}
          >
            <Icon name="ads-click" size={20} color="#d1d5db" />
            <Text style={styles.adText}>Advertisement Space</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

// ProfileScreen Component (No Account Required)
const ProfileScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    voiceControl: true,
    locationTracking: true,
  });

  const toggleSetting = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <Text style={styles.title}>⚙️ Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </LinearGradient>

      <ScrollView style={styles.profileContent} showsVerticalScrollIndicator={false}>
        {/* No Account Required Notice */}
        <View style={styles.noticeContainer}>
          <Icon name="info" size={24} color="#2563eb" />
          <Text style={styles.noticeTitle}>No Account Required</Text>
          <Text style={styles.noticeText}>
            This app works without creating an account. Your reviews are tracked by device ID to prevent duplicates.
          </Text>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="notifications" size={20} color="#2563eb" />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, settings.notifications && styles.toggleActive]}
              onPress={() => toggleSetting('notifications')}
            >
              <View style={[styles.toggleThumb, settings.notifications && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="mic" size={20} color="#dc2626" />
              <Text style={styles.settingLabel}>Voice Control</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, settings.voiceControl && styles.toggleActive]}
              onPress={() => toggleSetting('voiceControl')}
            >
              <View style={[styles.toggleThumb, settings.voiceControl && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="my-location" size={20} color="#059669" />
              <Text style={styles.settingLabel}>Location Tracking</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, settings.locationTracking && styles.toggleActive]}
              onPress={() => toggleSetting('locationTracking')}
            >
              <View style={[styles.toggleThumb, settings.locationTracking && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => alert('About Lavatory Finder\nVersion 1.0.0\n\nFind nearby bathrooms, water fountains, hand sanitizers, and sinks with ease.')}
          >
            <Icon name="info" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>About</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => alert('Privacy Policy\n\nYour privacy is important. Location data is only used to find nearby services. No personal information is collected.')}
          >
            <Icon name="privacy-tip" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => alert('Contact Support\n\nEmail: support@lavatoryfinder.com\n\nWe\'re here to help!')}
          >
            <Icon name="support-agent" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Contact Support</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Device Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceText}>Device ID: User_****</Text>
            <Text style={styles.deviceText}>Platform: React Native</Text>
            <Text style={styles.deviceText}>Version: 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Simple Tab Navigation
const TabButton = ({ icon, label, isActive, onPress }: any) => (
  <TouchableOpacity style={styles.tabButton} onPress={onPress}>
    <Icon 
      name={icon} 
      size={24} 
      color={isActive ? '#2563eb' : '#6b7280'} 
    />
    <Text style={[styles.tabLabel, { color: isActive ? '#2563eb' : '#6b7280' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'map':
        return <MapScreen />;
      case 'search':
        return <SearchScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderContent()}
      
      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTabs}>
        <TabButton
          icon="home"
          label="Home"
          isActive={activeTab === 'home'}
          onPress={() => setActiveTab('home')}
        />
        <TabButton
          icon="map"
          label="Map"
          isActive={activeTab === 'map'}
          onPress={() => setActiveTab('map')}
        />
        <TabButton
          icon="search"
          label="Search"
          isActive={activeTab === 'search'}
          onPress={() => setActiveTab('search')}
        />
        <TabButton
          icon="person"
          label="Settings"
          isActive={activeTab === 'profile'}
          onPress={() => setActiveTab('profile')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  voiceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickAccessContainer: {
    marginVertical: 20,
  },
  quickAccessContent: {
    paddingHorizontal: 20,
  },
  quickAccessButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAccessText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  servicesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  serviceCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  serviceAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 12,
    color: '#6b7280',
  },
  distance: {
    fontSize: 12,
    color: '#6b7280',
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Map Screen Styles
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  markersContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  filterContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  selectedServiceContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedServiceGradient: {
    borderRadius: 12,
    padding: 16,
  },
  selectedServiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedServiceInfo: {
    flex: 1,
    marginRight: 12,
  },
  selectedServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  selectedServiceAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  selectedServiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedServiceRating: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedServiceDistance: {
    fontSize: 12,
    color: '#6b7280',
  },
  directionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Search Screen Styles
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  suggestionsContent: {
    paddingHorizontal: 20,
  },
  suggestionChip: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  suggestionText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filtersToggleText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  filterButtons: {
    paddingLeft: 20,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  // Profile Screen Styles
  profileContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noticeContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 8,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  deviceInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  deviceText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  // Ad Banner Styles
  adBanner: {
    margin: 20,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  adGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  adText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
  // Bottom Tabs Styles
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
