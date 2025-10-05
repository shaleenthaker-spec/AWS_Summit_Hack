import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useLocation } from '../context/LocationContext';
import { useVoiceControl } from '../context/VoiceControlContext';
import ServiceCard from '../components/ServiceCard';
import AdBanner from '../components/AdBanner';
import VoiceButton from '../components/VoiceButton';
import { ServiceType } from '../types/Service';

const { width } = Dimensions.get('window');

// AWS INTEGRATION PLACEHOLDER: Replace with actual AWS API calls
// This function should fetch nearby services from AWS DynamoDB/API Gateway
const fetchNearbyServices = async (latitude: number, longitude: number): Promise<ServiceType[]> => {
  // TODO: Replace with actual AWS API call
  // Example: const response = await API.get('/services/nearby', { lat, lng, radius: 1000 });
  
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
      imageUrl: null, // Will be populated from AWS S3
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
  ];
};

const HomeScreen: React.FC = () => {
  const { currentLocation, isLoading: locationLoading, refreshLocation } = useLocation();
  const { isListening, recognizedText } = useVoiceControl();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshLocation(), loadServices()]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (currentLocation) {
      loadServices();
    }
  }, [currentLocation]);

  const getServiceTypeIcon = (type: string) => {
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

  const getServiceTypeColor = (type: string) => {
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

  return (
    <View style={styles.container}>
      {/* Header with Voice Control */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Find Your Nearest</Text>
            <Text style={styles.title}>Lavatory Services</Text>
            {currentLocation && (
              <Text style={styles.locationText}>
                <Icon name="location-on" size={14} color="#6b7280" /> 
                {' '}Location updated
              </Text>
            )}
          </View>
          <VoiceButton />
        </View>
        
        {isListening && (
          <View style={styles.voiceIndicator}>
            <Icon name="mic" size={20} color="#dc2626" />
            <Text style={styles.voiceText}>
              {recognizedText || 'Listening...'}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Ad Banner - AWS INTEGRATION PLACEHOLDER */}
      <AdBanner
        adId="home-top-banner"
        style={styles.topAdBanner}
      />

      {/* Quick Access Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickAccessContainer}
        contentContainerStyle={styles.quickAccessContent}
      >
        {['bathroom', 'water_fountain', 'hand_sanitizer', 'sink'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.quickAccessButton, { borderColor: getServiceTypeColor(type) }]}
            onPress={() => {
              // TODO: Filter services by type
              console.log(`Quick access: ${type}`);
            }}
          >
            <Icon 
              name={getServiceTypeIcon(type)} 
              size={24} 
              color={getServiceTypeColor(type)} 
            />
            <Text style={[styles.quickAccessText, { color: getServiceTypeColor(type) }]}>
              {type.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      <ScrollView
        style={styles.servicesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Nearby Services</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Finding nearby services...</Text>
          </View>
        ) : services.length > 0 ? (
          services.map((service, index) => (
            <View key={service.id}>
              <ServiceCard service={service} />
              
              {/* Ad Banner between services - AWS INTEGRATION PLACEHOLDER */}
              {index === Math.floor(services.length / 2) && (
                <AdBanner
                  adId="services-list-banner"
                  style={styles.midListAdBanner}
                />
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="location-off" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {locationLoading ? 'Getting your location...' : 'No services found nearby'}
            </Text>
            <Text style={styles.emptySubtext}>
              Try refreshing or check your location settings
            </Text>
          </View>
        )}

        {/* Bottom Ad Banner - AWS INTEGRATION PLACEHOLDER */}
        <AdBanner
          adId="home-bottom-banner"
          style={styles.bottomAdBanner}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  voiceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'center',
  },
  voiceText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  topAdBanner: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 80,
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
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
  },
  midListAdBanner: {
    marginVertical: 16,
    height: 100,
  },
  bottomAdBanner: {
    marginVertical: 20,
    height: 80,
  },
});

export default HomeScreen;
