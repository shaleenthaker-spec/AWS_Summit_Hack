import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useLocation } from '../context/LocationContext';
import AdBanner from '../components/AdBanner';
import ReviewCard from '../components/ReviewCard';
import { ServiceType, Review } from '../types/Service';

const { width } = Dimensions.get('window');

type ServiceDetailRouteParams = {
  ServiceDetail: {
    service: ServiceType;
  };
};

type ServiceDetailRouteProp = RouteProp<ServiceDetailRouteParams, 'ServiceDetail'>;

// AWS INTEGRATION PLACEHOLDER: Replace with actual AWS API calls
const fetchServiceDetails = async (serviceId: string): Promise<ServiceType> => {
  // TODO: Replace with actual AWS API call
  // Example: const response = await API.get(`/services/${serviceId}`);
  
  // Mock data for development - REMOVE when AWS integration is complete
  return {
    id: serviceId,
    name: 'City Mall Restroom',
    type: 'bathroom',
    rating: 4.2,
    reviewCount: 156,
    distance: 0.3,
    isOpen: true,
    address: '123 Main St, Downtown',
    amenities: ['wheelchair', 'baby-changing', 'hot-water', 'soap'],
    imageUrl: null,
    latitude: 37.7749,
    longitude: -122.4194,
  };
};

const fetchServiceReviews = async (serviceId: string): Promise<Review[]> => {
  // TODO: Replace with actual AWS API call
  // Example: const response = await API.get(`/services/${serviceId}/reviews`);
  
  // Mock reviews for development - REMOVE when AWS integration is complete
  return [
    {
      id: '1',
      serviceId,
      userId: 'user1',
      userName: 'Sarah M.',
      userAvatar: null,
      rating: 5,
      comment: 'Very clean and well-maintained. Great accessibility features!',
      images: [],
      createdAt: '2024-01-15T10:30:00Z',
      helpfulCount: 12,
      verified: true,
    },
    {
      id: '2',
      serviceId,
      userId: 'user2',
      userName: 'Mike R.',
      userAvatar: null,
      rating: 4,
      comment: 'Good location and clean facilities. Could use better ventilation.',
      images: [],
      createdAt: '2024-01-12T14:20:00Z',
      helpfulCount: 8,
      verified: false,
    },
  ];
};

const ServiceDetailScreen: React.FC = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const navigation = useNavigation();
  const { currentLocation } = useLocation();
  
  const [service, setService] = useState<ServiceType>(route.params.service);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    loadServiceDetails();
  }, []);

  const loadServiceDetails = async () => {
    setLoading(true);
    try {
      // AWS INTEGRATION PLACEHOLDER: Replace with actual API calls
      const [serviceDetails, serviceReviews] = await Promise.all([
        fetchServiceDetails(service.id),
        fetchServiceReviews(service.id)
      ]);
      setService(serviceDetails);
      setReviews(serviceReviews);
    } catch (error) {
      console.error('Failed to load service details:', error);
      Alert.alert('Error', 'Failed to load service details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const getServiceTypeName = (type: string) => {
    switch (type) {
      case 'bathroom':
        return 'Restroom';
      case 'water_fountain':
        return 'Water Fountain';
      case 'hand_sanitizer':
        return 'Hand Sanitizer';
      case 'sink':
        return 'Sink';
      default:
        return 'Service';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="star" size={16} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={16} color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star-border" size={16} color="#d1d5db" />
      );
    }

    return stars;
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityIcons: Record<string, string> = {
      'wheelchair': 'accessible',
      'baby-changing': 'child-care',
      'hot-water': 'water',
      'soap': 'cleaning-services',
      'filtered-water': 'filter-alt',
      'refill-station': 'refresh',
      'touchless': 'touch-app',
      'refillable': 'autorenew',
    };
    return amenityIcons[amenity] || 'check';
  };

  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {service.name}
          </Text>
          <View style={styles.headerSubtitle}>
            <Icon name={getServiceTypeIcon(service.type)} size={16} color={getServiceTypeColor(service.type)} />
            <Text style={styles.headerSubtitleText}>
              {getServiceTypeName(service.type)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {
            // TODO: Implement sharing functionality
            console.log('Share service:', service.name);
          }}
        >
          <Icon name="share" size={24} color="#6b7280" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Image */}
        <View style={styles.imageContainer}>
          {service.imageUrl ? (
            <Image source={{ uri: service.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: `${getServiceTypeColor(service.type)}20` }]}>
              <Icon name={getServiceTypeIcon(service.type)} size={64} color={getServiceTypeColor(service.type)} />
            </View>
          )}
          
          {/* Status Badge */}
          <View style={[
            styles.statusBadge,
            { backgroundColor: service.isOpen ? '#059669' : '#dc2626' }
          ]}>
            <Icon 
              name={service.isOpen ? 'check-circle' : 'cancel'} 
              size={16} 
              color="#ffffff" 
            />
            <Text style={styles.statusText}>
              {service.isOpen ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.infoSection}>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(service.rating)}
            </View>
            <Text style={styles.ratingText}>
              {service.rating.toFixed(1)} ({service.reviewCount} reviews)
            </Text>
          </View>

          <View style={styles.distanceContainer}>
            <Icon name="location-on" size={20} color="#6b7280" />
            <Text style={styles.address}>{service.address}</Text>
          </View>

          <View style={styles.distanceInfo}>
            <Icon name="directions-walk" size={16} color="#6b7280" />
            <Text style={styles.distanceText}>
              {service.distance.toFixed(1)} km away
            </Text>
          </View>
        </View>

        {/* Ad Banner - AWS INTEGRATION PLACEHOLDER */}
        <AdBanner
          adId="service-detail-banner"
          style={styles.detailAdBanner}
        />

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {service.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Icon 
                  name={getAmenityIcon(amenity)} 
                  size={20} 
                  color="#059669" 
                />
                <Text style={styles.amenityText}>
                  {amenity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => {
              // TODO: Open navigation app
              console.log('Get directions to:', service.name);
            }}
          >
            <Icon name="directions" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Get Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              // TODO: Navigate to add review screen
              console.log('Add review for:', service.name);
            }}
          >
            <Icon name="rate-review" size={20} color="#2563eb" />
            <Text style={styles.secondaryButtonText}>Write Review</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllReviews(!showAllReviews)}
              >
                <Text style={styles.showMoreText}>
                  {showAllReviews ? 'Show Less' : `Show All (${reviews.length})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {displayReviews.length > 0 ? (
            displayReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <View style={styles.noReviewsContainer}>
              <Icon name="rate-review" size={32} color="#d1d5db" />
              <Text style={styles.noReviewsText}>No reviews yet</Text>
              <Text style={styles.noReviewsSubtext}>
                Be the first to share your experience
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Ad Banner - AWS INTEGRATION PLACEHOLDER */}
        <AdBanner
          adId="service-detail-bottom-banner"
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitleText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 4,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
    flex: 1,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  detailAdBanner: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: 80,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  showMoreText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 4,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  bottomAdBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 100,
  },
});

export default ServiceDetailScreen;
