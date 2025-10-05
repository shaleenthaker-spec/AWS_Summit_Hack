import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { ServiceType } from '../types/Service';

interface AddReviewScreenProps {
  route?: {
    params: {
      service: ServiceType;
    };
  };
}

const AddReviewScreen: React.FC<AddReviewScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const service = route?.params?.service;
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenityOptions = [
    { id: 'clean', label: 'Clean', icon: 'cleaning-services' },
    { id: 'accessible', label: 'Accessible', icon: 'accessible' },
    { id: 'well-lit', label: 'Well Lit', icon: 'lightbulb' },
    { id: 'quiet', label: 'Quiet', icon: 'volume-off' },
    { id: 'private', label: 'Private', icon: 'lock' },
    { id: 'spacious', label: 'Spacious', icon: 'open-with' },
  ];

  const handleStarPress = (starRating: number) => {
    setRating(starRating);
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Comment Too Short', 'Please write at least 10 characters in your review.');
      return;
    }

    setIsSubmitting(true);
    try {
      // AWS INTEGRATION PLACEHOLDER: Submit review to AWS
      // TODO: Replace with actual AWS API call
      // Example: await API.post(`/services/${service.id}/reviews`, {
      //   rating, comment, amenities: selectedAmenities, userId: currentUser.id
      // });
      
      // Mock submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Review Submitted',
        'Thank you for your review! It helps other users find the best services.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to submit review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starContainer}
        >
          <Icon
            name={i <= rating ? 'star' : 'star-border'}
            size={32}
            color={i <= rating ? '#fbbf24' : '#d1d5db'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#dc2626" />
        <Text style={styles.errorText}>Service not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Write Review</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {service.name}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 ? 'Tap to rate' : 
             rating === 1 ? 'Poor' :
             rating === 2 ? 'Fair' :
             rating === 3 ? 'Good' :
             rating === 4 ? 'Very Good' : 'Excellent'}
          </Text>
        </View>

        {/* Comment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tell us more (optional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Share details about your experience..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {comment.length}/500 characters
          </Text>
        </View>

        {/* Amenities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What was good? (optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Select the amenities that stood out
          </Text>
          <View style={styles.amenitiesContainer}>
            {amenityOptions.map((amenity) => (
              <TouchableOpacity
                key={amenity.id}
                style={[
                  styles.amenityChip,
                  selectedAmenities.includes(amenity.id) && styles.amenityChipSelected
                ]}
                onPress={() => toggleAmenity(amenity.id)}
              >
                <Icon
                  name={amenity.icon}
                  size={16}
                  color={selectedAmenities.includes(amenity.id) ? '#ffffff' : '#2563eb'}
                />
                <Text style={[
                  styles.amenityText,
                  selectedAmenities.includes(amenity.id) && styles.amenityTextSelected
                ]}>
                  {amenity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>Review Guidelines</Text>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <Icon name="check" size={16} color="#059669" />
              <Text style={styles.guidelineText}>
                Be honest and constructive
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Icon name="check" size={16} color="#059669" />
              <Text style={styles.guidelineText}>
                Focus on the facility and service
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Icon name="check" size={16} color="#059669" />
              <Text style={styles.guidelineText}>
                Be respectful and helpful to others
              </Text>
            </View>
          </View>
        </View>

        {/* AWS Integration Notice */}
        <View style={styles.awsNotice}>
          <Icon name="cloud-off" size={20} color="#dc2626" />
          <Text style={styles.awsNoticeText}>
            AWS Backend Integration Required
          </Text>
          <Text style={styles.awsNoticeSubtext}>
            Reviews are currently stored locally. Connect to AWS DynamoDB for persistent storage.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  closeButton: {
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
    fontSize: 14,
    color: '#6b7280',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  starContainer: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#eff6ff',
  },
  amenityChipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  amenityText: {
    fontSize: 12,
    color: '#2563eb',
    marginLeft: 4,
    fontWeight: '500',
  },
  amenityTextSelected: {
    color: '#ffffff',
  },
  guidelinesSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidelineText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  awsNotice: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  awsNoticeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 8,
    marginBottom: 4,
  },
  awsNoticeSubtext: {
    fontSize: 12,
    color: '#dc2626',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AddReviewScreen;
