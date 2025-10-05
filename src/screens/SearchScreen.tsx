import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useLocation } from '../context/LocationContext';
import { useVoiceControl } from '../context/VoiceControlContext';
import ServiceCard from '../components/ServiceCard';
import AdBanner from '../components/AdBanner';
import { ServiceType, SearchFilters } from '../types/Service';

// AWS INTEGRATION PLACEHOLDER: Replace with actual AWS API calls
const searchServices = async (
  query: string,
  latitude: number,
  longitude: number,
  filters?: SearchFilters
): Promise<ServiceType[]> => {
  // TODO: Replace with actual AWS API call
  // Example: const response = await API.post('/services/search', { query, lat, lng, filters });
  
  // Mock search results for development - REMOVE when AWS integration is complete
  const allServices: ServiceType[] = [
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
  ];

  // Simple mock search filtering
  if (!query.trim()) return allServices;
  
  return allServices.filter(service =>
    service.name.toLowerCase().includes(query.toLowerCase()) ||
    service.address.toLowerCase().includes(query.toLowerCase()) ||
    service.type.toLowerCase().includes(query.toLowerCase())
  );
};

const SearchScreen: React.FC = () => {
  const { currentLocation } = useLocation();
  const { recognizedText, clearRecognizedText } = useVoiceControl();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ServiceType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    serviceTypes: [],
    maxDistance: 5,
    minRating: 0,
    amenities: [],
    isOpenNow: false,
    priceRange: [],
    accessibility: [],
  });

  // Voice command processing
  useEffect(() => {
    if (recognizedText) {
      setSearchQuery(recognizedText);
      clearRecognizedText();
      performSearch(recognizedText);
    }
  }, [recognizedText]);

  const performSearch = async (query: string = searchQuery) => {
    if (!currentLocation) return;
    
    setIsSearching(true);
    try {
      // AWS INTEGRATION PLACEHOLDER: Replace with actual API call
      const results = await searchServices(
        query,
        currentLocation.latitude,
        currentLocation.longitude,
        filters
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = () => {
    performSearch();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const getQuickSearchSuggestions = () => {
    return [
      'Public restrooms',
      'Water fountains',
      'Hand sanitizer',
      'Wheelchair accessible',
      'Baby changing',
      'Near me',
      'Open now',
    ];
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

  const renderQuickSuggestion = (suggestion: string) => (
    <TouchableOpacity
      key={suggestion}
      style={styles.suggestionChip}
      onPress={() => {
        setSearchQuery(suggestion);
        performSearch(suggestion);
      }}
    >
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </TouchableOpacity>
  );

  const renderServiceCard = ({ item }: { item: ServiceType }) => (
    <ServiceCard service={item} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <Text style={styles.title}>Search Services</Text>
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
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="clear" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchSubmit}
          disabled={isSearching}
        >
          <Icon name="search" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Top Ad Banner - AWS INTEGRATION PLACEHOLDER */}
      <AdBanner
        adId="search-top-banner"
        style={styles.topAdBanner}
      />

      {/* Quick Suggestions */}
      {!searchQuery && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Quick Search</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {getQuickSearchSuggestions().map(renderQuickSuggestion)}
          </ScrollView>
        </View>
      )}

      {/* Service Type Filters */}
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
            {['bathroom', 'water_fountain', 'hand_sanitizer', 'sink'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  filters.serviceTypes.includes(type) && styles.filterButtonActive
                ]}
                onPress={() => {
                  const newTypes = filters.serviceTypes.includes(type)
                    ? filters.serviceTypes.filter(t => t !== type)
                    : [...filters.serviceTypes, type];
                  setFilters({ ...filters, serviceTypes: newTypes });
                }}
              >
                <Icon 
                  name={getServiceTypeIcon(type)} 
                  size={16} 
                  color={filters.serviceTypes.includes(type) ? '#ffffff' : getServiceTypeColor(type)} 
                />
                <Text style={[
                  styles.filterButtonText,
                  filters.serviceTypes.includes(type) && styles.filterButtonTextActive,
                  { color: filters.serviceTypes.includes(type) ? '#ffffff' : getServiceTypeColor(type) }
                ]}>
                  {type.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <Icon name="search" size={32} color="#d1d5db" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.resultsHeader}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </Text>
            }
            ListFooterComponent={
              <AdBanner
                adId="search-results-banner"
                style={styles.bottomAdBanner}
              />
            }
          />
        ) : searchQuery ? (
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>
              Try different keywords or adjust your filters
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="search" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Start your search</Text>
            <Text style={styles.emptySubtext}>
              Search for bathrooms, water fountains, and more
            </Text>
          </View>
        )}
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topAdBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    height: 80,
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
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
  bottomAdBanner: {
    marginVertical: 20,
    height: 100,
  },
});

export default SearchScreen;
