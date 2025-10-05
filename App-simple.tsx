import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Simplified ServiceCard component
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

// Simplified HomeScreen
const HomeScreen = () => {
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
    },
  ];

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

        {/* Ad Banner Placeholder */}
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
  const [activeTab, setActiveTab] = React.useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'map':
        return (
          <View style={styles.placeholderScreen}>
            <Icon name="map" size={64} color="#d1d5db" />
            <Text style={styles.placeholderText}>Map Screen</Text>
            <Text style={styles.placeholderSubtext}>GPS integration with service markers</Text>
          </View>
        );
      case 'search':
        return (
          <View style={styles.placeholderScreen}>
            <Icon name="search" size={64} color="#d1d5db" />
            <Text style={styles.placeholderText}>Search Screen</Text>
            <Text style={styles.placeholderSubtext}>Advanced search with filters</Text>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.placeholderScreen}>
            <Icon name="person" size={64} color="#d1d5db" />
            <Text style={styles.placeholderText}>Profile Screen</Text>
            <Text style={styles.placeholderSubtext}>User settings and preferences</Text>
          </View>
        );
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
          label="Profile"
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
  adBanner: {
    marginVertical: 20,
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
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
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
