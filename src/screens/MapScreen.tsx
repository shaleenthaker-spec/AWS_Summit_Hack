import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useLocation } from '../context/LocationContext';
import { useVoiceControl } from '../context/VoiceControlContext';
import AdBanner from '../components/AdBanner';
import { ServiceType } from '../types/Service';

const { width, height } = Dimensions.get('window');

// AWS INTEGRATION PLACEHOLDER: Replace with actual AWS API calls
const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  // TODO: Replace with actual AWS API call
  // Example: const response = await API.get('/services/nearby', { lat, lng, radius: 2000 });
  
  // Mock data for development - REMOVE when AWS integration is complete
  return [
    {
      id: '1',
      name: 'City Mall Restroom',
      type: 'bathroom',
      rating: 4.2,
      reviewCount: 156,
      distance: 0.3,
      isOpen: true,
      address: '123 Main St, Downtown',
      amenities: ['wheelchair', 'baby-changing'],
      imageUrl: null,
      latitude: latitude + 0.001,
      longitude: longitude + 0.001,
    },
    {
      id: '2',
      name: 'Central Park Water Fountain',
      type: 'water_fountain',
      rating: 4.5,
      reviewCount: 89,
      distance: 0.7,
      isOpen: true,
      address: '456 Park Ave',
      amenities: ['filtered-water', 'refill-station'],
      imageUrl: null,
      latitude: latitude - 0.002,
      longitude: longitude + 0.003,
    },
    {
      id: '3',
      name: 'Airport Hand Sanitizer Station',
      type: 'hand_sanitizer',
      rating: 3.8,
      reviewCount: 234,
      distance: 1.2,
      isOpen: true,
      address: '789 Airport Blvd',
      amenities: ['touchless', 'refillable'],
      imageUrl: null,
      latitude: latitude + 0.005,
      longitude: longitude - 0.002,
    },
    {
      id: '4',
      name: 'Public Library Sink',
      type: 'sink',
      rating: 4.0,
      reviewCount: 67,
      distance: 0.9,
      isOpen: true,
      address: '321 Library St',
      amenities: ['hot-water', 'soap'],
      imageUrl: null,
      latitude: latitude - 0.003,
      longitude: longitude - 0.001,
    },
  ];
};

const MapScreen: React.FC = () => {
  const { currentLocation, isLoading: locationLoading, refreshLocation } = useLocation();
  const { isListening, recognizedText } = useVoiceControl();
  const mapRef = useRef<MapView>(null);
  
  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [filterType, setFilterType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    if (!currentLocation) return;
    
    setLoading(true);
    try {
      // AWS INTEGRATION PLACEHOLDER: Replace with actual API call
      const nearbyServices = await fetchNearbyServices(
        currentLocation.latitude,
        currentLocation.longitude
      );
      setServices(nearbyServices);
    } catch (error) {
      console.error('Failed to load services:', error);
      Alert.alert('Error', 'Failed to load nearby services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const centerMapOnLocation = () => {
    if (currentLocation && mapRef.current) {
      const region: Region = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(region);
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const handleMarkerPress = (service: ServiceType) => {
    setSelectedService(service);
    
    // Center map on selected service
    if (mapRef.current) {
      const region: Region = {
        latitude: service.latitude,
        longitude: service.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'bathroom':
        return 'wc';
      case 'water_fountain':
        return 'water-drop';
      case 'hand_sanitizer':
        return 'clean-hands';
      case 'sink':
        return 'water';
      default:
        return 'place';
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'bathroom':
        return '#2563eb';
      case 'water_fountain':
        return '#059669';
      case 'hand_sanitizer':
        return '#dc2626';
      case 'sink':
        return '#7c3aed';
      default:
        return '#6b7280';
    }
  };

  const filteredServices = filterType 
    ? services.filter(service => service.type === filterType)
    : services;

  useEffect(() => {
    if (currentLocation) {
      setMapRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      loadServices();
    }
  }, [currentLocation]);

  // Voice command processing
  useEffect(() => {
    if (recognizedText) {
      const command = recognizedText.toLowerCase().trim();
      
      if (command.includes('center') || command.includes('my location')) {
        centerMapOnLocation();
      } else if (command.includes('bathroom') || command.includes('toilet')) {
        setFilterType('bathroom');
      } else if (command.includes('water') || command.includes('fountain')) {
        setFilterType('water_fountain');
      } else if (command.includes('sanitizer') || command.includes('hand')) {
        setFilterType('hand_sanitizer');
      } else if (command.includes('sink')) {
        setFilterType('sink');
      } else if (command.includes('all') || command.includes('clear')) {
        setFilterType(null);
      }
    }
  }, [recognizedText]);

  if (locationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="my-location" size={48} color="#d1d5db" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="location-off" size={48} color="#dc2626" />
        <Text style={styles.errorText}>Location access required</Text>
        <Text style={styles.errorSubtext}>
          Please enable location services to use the map
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshLocation}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
        loadingIndicatorColor="#2563eb"
        loadingBackgroundColor="#ffffff"
      >
        {/* Service Markers */}
        {filteredServices.map((service) => (
          <Marker
            key={service.id}
            coordinate={{
              latitude: service.latitude,
              longitude: service.longitude,
            }}
            onPress={() => handleMarkerPress(service)}
            title={service.name}
            description={`${service.distance.toFixed(1)} km • ${service.rating.toFixed(1)} ⭐`}
          >
            <View style={[
              styles.markerContainer,
              { backgroundColor: getMarkerColor(service.type) }
            ]}>
              <Icon 
                name={getMarkerIcon(service.type)} 
                size={20} 
                color="#ffffff" 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Top Controls */}
      <View style={styles.topControls}>
        {/* Voice Status */}
        {isListening && (
          <View style={styles.voiceStatus}>
            <Icon name="mic" size={16} color="#dc2626" />
            <Text style={styles.voiceStatusText}>Listening...</Text>
          </View>
        )}

        {/* Center Location Button */}
        <TouchableOpacity style={styles.centerButton} onPress={centerMapOnLocation}>
          <Icon name="my-location" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              !filterType && styles.filterButtonActive
            ]}
            onPress={() => setFilterType(null)}
          >
            <Text style={[
              styles.filterButtonText,
              !filterType && styles.filterButtonTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {['bathroom', 'water_fountain', 'hand_sanitizer', 'sink'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                filterType === type && styles.filterButtonActive
              ]}
              onPress={() => setFilterType(type)}
            >
              <Icon 
                name={getMarkerIcon(type)} 
                size={16} 
                color={filterType === type ? '#ffffff' : getMarkerColor(type)} 
              />
              <Text style={[
                styles.filterButtonText,
                filterType === type && styles.filterButtonTextActive,
                { color: filterType === type ? '#ffffff' : getMarkerColor(type) }
              ]}>
                {type.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Service Info */}
      {selectedService && (
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.selectedServiceContainer}
        >
          <View style={styles.selectedServiceContent}>
            <View style={styles.selectedServiceInfo}>
              <Text style={styles.selectedServiceName}>{selectedService.name}</Text>
              <Text style={styles.selectedServiceAddress}>{selectedService.address}</Text>
              <View style={styles.selectedServiceDetails}>
                <Text style={styles.selectedServiceRating}>
                  ⭐ {selectedService.rating.toFixed(1)} ({selectedService.reviewCount})
                </Text>
                <Text style={styles.selectedServiceDistance}>
                  📍 {selectedService.distance.toFixed(1)} km
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={() => {
                // TODO: Open navigation app
                console.log('Open directions to:', selectedService.name);
              }}
            >
              <Icon name="directions" size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}

      {/* Map Overlay Ad - AWS INTEGRATION PLACEHOLDER */}
      <View style={styles.mapOverlayAd}>
        <AdBanner
          adId="map-overlay-banner"
          style={styles.overlayAdBanner}
        />
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Icon name="search" size={24} color="#2563eb" />
            <Text style={styles.loadingOverlayText}>Finding services...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  map: {
    width: width,
    height: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  topControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'flex-end',
  },
  voiceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  voiceStatusText: {
    fontSize: 12,
    color: '#dc2626',
    marginLeft: 4,
    fontWeight: '500',
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  filterContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 80,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
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
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedServiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  markerContainer: {
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
  mapOverlayAd: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  overlayAdBanner: {
    height: 60,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingOverlayText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
});

export default MapScreen;
