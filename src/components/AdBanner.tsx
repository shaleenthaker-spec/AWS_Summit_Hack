import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface AdBannerProps {
  adId: string;
  style?: any;
  onPress?: () => void;
}

// AWS INTEGRATION PLACEHOLDER: Replace with actual AWS Ad Server integration
// This component should fetch ads from AWS Pinpoint, Amazon DSP, or custom ad server
const AdBanner: React.FC<AdBannerProps> = ({ adId, style, onPress }) => {
  const [adLoaded, setAdLoaded] = useState(false);

  // AWS INTEGRATION PLACEHOLDER: Fetch ad content from AWS
  // TODO: Replace with actual AWS API call
  // Example: const adContent = await AdService.getAd(adId, { userId, location, preferences });
  
  // Mock ad data for development - REMOVE when AWS integration is complete
  const mockAdContent = {
    id: adId,
    title: 'Premium Cleaning Services',
    description: 'Professional bathroom maintenance and cleaning',
    imageUrl: null, // Will be populated from AWS S3
    ctaText: 'Learn More',
    advertiser: 'CleanPro Services',
    adType: 'native', // 'banner', 'interstitial', 'native'
    isSponsored: true,
  };

  React.useEffect(() => {
    // Simulate ad loading delay
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // AWS INTEGRATION PLACEHOLDER: Analytics tracking
  const handleAdPress = () => {
    // TODO: Track ad click with AWS Pinpoint Analytics
    // Example: Analytics.record({ eventType: 'ad_click', adId, userId, timestamp });
    
    console.log(`Ad clicked: ${adId}`);
    onPress?.();
  };

  const handleAdImpression = () => {
    // TODO: Track ad impression with AWS Pinpoint Analytics
    // Example: Analytics.record({ eventType: 'ad_impression', adId, userId, timestamp });
    
    console.log(`Ad impression: ${adId}`);
  };

  if (!adLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <View style={styles.loadingContent}>
          <Icon name="ads-click" size={20} color="#d1d5db" />
          <Text style={styles.loadingText}>Loading ad...</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleAdPress}
      activeOpacity={0.8}
      onLayout={handleAdImpression}
    >
      <LinearGradient
        colors={['#f8fafc', '#ffffff']}
        style={styles.gradient}
      >
        {/* Sponsored Badge */}
        <View style={styles.sponsoredBadge}>
          <Icon name="campaign" size={12} color="#6b7280" />
          <Text style={styles.sponsoredText}>Sponsored</Text>
        </View>

        {/* Ad Content */}
        <View style={styles.content}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={2}>
              {mockAdContent.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {mockAdContent.description}
            </Text>
            <View style={styles.advertiserContainer}>
              <Icon name="business" size={12} color="#6b7280" />
              <Text style={styles.advertiser}>{mockAdContent.advertiser}</Text>
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity style={styles.ctaButton} onPress={handleAdPress}>
            <Text style={styles.ctaText}>{mockAdContent.ctaText}</Text>
            <Icon name="arrow-forward" size={14} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Ad Image Placeholder */}
        <View style={styles.imageContainer}>
          {mockAdContent.imageUrl ? (
            <Image source={{ uri: mockAdContent.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="image" size={24} color="#d1d5db" />
            </View>
          )}
        </View>
      </LinearGradient>

      {/* AWS INTEGRATION PLACEHOLDER: Ad attribution and privacy notice */}
      <View style={styles.attribution}>
        <TouchableOpacity style={styles.infoButton}>
          <Icon name="info-outline" size={12} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#9ca3af',
  },
  gradient: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sponsoredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sponsoredText: {
    fontSize: 8,
    color: '#6b7280',
    marginLeft: 2,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  textContent: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
    lineHeight: 16,
  },
  advertiserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advertiser: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 4,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attribution: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  infoButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdBanner;
