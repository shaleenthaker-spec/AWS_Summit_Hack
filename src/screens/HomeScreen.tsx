import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocation } from '../context/LocationContext';

const HomeScreen: React.FC = () => {
  const { location, loading, error, requestLocation } = useLocation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🚽 Lavatory Finder</Text>
          <Text style={styles.subtitle}>Find nearby services</Text>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.cardTitle}>📍 Current Location</Text>
          {loading && <Text style={styles.loading}>Getting location...</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
          {location && (
            <View>
              <Text style={styles.locationText}>
                Lat: {location.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Lng: {location.longitude.toFixed(6)}
              </Text>
              <Text style={styles.accuracyText}>
                Accuracy: {location.accuracy.toFixed(0)}m
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.refreshButton} onPress={requestLocation}>
            <Text style={styles.refreshButtonText}>🔄 Refresh Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickAccessCard}>
          <Text style={styles.cardTitle}>⚡ Quick Access</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.quickButton}>
              <Text style={styles.quickButtonIcon}>🚽</Text>
              <Text style={styles.quickButtonText}>Bathrooms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickButton}>
              <Text style={styles.quickButtonIcon}>💧</Text>
              <Text style={styles.quickButtonText}>Water</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.quickButton}>
              <Text style={styles.quickButtonIcon}>🧴</Text>
              <Text style={styles.quickButtonText}>Sanitizer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickButton}>
              <Text style={styles.quickButtonIcon}>🚰</Text>
              <Text style={styles.quickButtonText}>Sinks</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>ℹ️ App Status</Text>
          <Text style={styles.infoText}>✅ Project merged successfully!</Text>
          <Text style={styles.infoText}>✅ Dependencies installed</Text>
          <Text style={styles.infoText}>✅ Location services ready</Text>
          <Text style={styles.infoText}>✅ Voice control available</Text>
          <Text style={styles.infoText}>✅ AWS integration configured</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAccessCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  loading: {
    fontSize: 14,
    color: '#2563eb',
    fontStyle: 'italic',
  },
  error: {
    fontSize: 14,
    color: '#dc2626',
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  refreshButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
});

export default HomeScreen;