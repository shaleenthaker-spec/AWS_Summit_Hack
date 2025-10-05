import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { ServiceType } from '../types/Service';

interface ServiceCardProps {
  service: ServiceType;
  onPress?: (service: ServiceType) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
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
        <Icon key={i} name="star" size={14} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={14} color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star-border" size={14} color="#d1d5db" />
      );
    }

    return stars;
  };

  const renderAmenities = () => {
    const amenityIcons: Record<string, string> = {
      'wheelchair': 'accessible',
      'baby-changing': 'child-care',
      'filtered-water': 'filter-alt',
      'refill-station': 'refresh',
      'touchless': 'touch-app',
      'refillable': 'autorenew',
    };

    return service.amenities.slice(0, 3).map((amenity, index) => (
      <View key={index} style={styles.amenityChip}>
        <Icon 
          name={amenityIcons[amenity] || 'check'} 
          size={12} 
          color="#059669" 
        />
      </View>
    ));
  };

  const serviceColor = getServiceTypeColor(service.type);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(service)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.gradient}
      >
        {/* Service Image */}
        <View style={styles.imageContainer}>
          {service.imageUrl ? (
            <Image source={{ uri: service.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: `${serviceColor}20` }]}>
              <Icon name={getServiceTypeIcon(service.type)} size={32} color={serviceColor} />
            </View>
          )}
          
          {/* Service Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: serviceColor }]}>
            <Text style={styles.typeText}>
              {getServiceTypeName(service.type)}
            </Text>
          </View>

          {/* Open/Closed Status */}
          <View style={[
            styles.statusBadge,
            { backgroundColor: service.isOpen ? '#059669' : '#dc2626' }
          ]}>
            <Icon 
              name={service.isOpen ? 'check-circle' : 'cancel'} 
              size={12} 
              color="#ffffff" 
            />
            <Text style={styles.statusText}>
              {service.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {service.name}
          </Text>
          
          <Text style={styles.address} numberOfLines={2}>
            <Icon name="location-on" size={14} color="#6b7280" />
            {' '}{service.address}
          </Text>

          {/* Rating and Distance */}
          <View style={styles.ratingDistanceContainer}>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(service.rating)}
              </View>
              <Text style={styles.ratingText}>
                {service.rating.toFixed(1)} ({service.reviewCount})
              </Text>
            </View>
            
            <View style={styles.distanceContainer}>
              <Icon name="directions-walk" size={14} color="#6b7280" />
              <Text style={styles.distanceText}>
                {service.distance.toFixed(1)} km
              </Text>
            </View>
          </View>

          {/* Amenities */}
          {service.amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesLabel}>Amenities:</Text>
              <View style={styles.amenitiesList}>
                {renderAmenities()}
                {service.amenities.length > 3 && (
                  <Text style={styles.moreAmenities}>
                    +{service.amenities.length - 3} more
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* AWS INTEGRATION PLACEHOLDER: Real-time availability indicator */}
          <View style={styles.availabilityContainer}>
            <Icon name="schedule" size={12} color="#6b7280" />
            <Text style={styles.availabilityText}>
              {/* TODO: Replace with real-time data from AWS */}
              Last updated 5 min ago
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: serviceColor }]}
            onPress={() => onPress?.(service)}
          >
            <Icon name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  ratingDistanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
  amenitiesContainer: {
    marginBottom: 8,
  },
  amenitiesLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  amenitiesList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityChip: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  moreAmenities: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
  },
  actionContainer: {
    justifyContent: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceCard;
