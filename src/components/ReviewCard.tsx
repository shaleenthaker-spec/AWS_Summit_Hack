import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Review } from '../types/Service';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful, onReport }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={14}
          color={i <= rating ? '#fbbf24' : '#d1d5db'}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {review.userAvatar ? (
            <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(review.userName)}</Text>
            </View>
          )}
          {review.verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={12} color="#059669" />
            </View>
          )}
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.userName}>{review.userName}</Text>
          <View style={styles.ratingDate}>
            <View style={styles.starsContainer}>
              {renderStars(review.rating)}
            </View>
            <Text style={styles.dateText}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            // TODO: Show review options (report, etc.)
            console.log('Review options for:', review.id);
          }}
        >
          <Icon name="more-vert" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Review Content */}
      <View style={styles.reviewContent}>
        <Text style={styles.comment}>{review.comment}</Text>
        
        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {review.images.slice(0, 3).map((imageUrl, index) => (
              <TouchableOpacity key={index} style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.reviewImage} />
              </TouchableOpacity>
            ))}
            {review.images.length > 3 && (
              <View style={styles.moreImagesContainer}>
                <Text style={styles.moreImagesText}>+{review.images.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Review Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.helpfulButton}
          onPress={() => onHelpful?.(review.id)}
        >
          <Icon name="thumb-up" size={16} color="#6b7280" />
          <Text style={styles.helpfulText}>
            Helpful ({review.helpfulCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => {
            // TODO: Implement reply functionality
            console.log('Reply to review:', review.id);
          }}
        >
          <Icon name="reply" size={16} color="#6b7280" />
          <Text style={styles.replyText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ratingDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContent: {
    marginBottom: 12,
  },
  comment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
  },
  moreImagesContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  helpfulText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
});

export default ReviewCard;
