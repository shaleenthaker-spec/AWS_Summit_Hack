import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useLocation } from '../context/LocationContext';
import { useVoiceControl } from '../context/VoiceControlContext';

const ProfileScreen: React.FC = () => {
  const { currentLocation, refreshLocation } = useLocation();
  const { isListening, recognizedText } = useVoiceControl();
  
  const [settings, setSettings] = useState({
    notifications: true,
    voiceControl: true,
    locationTracking: true,
    dataUsage: 'standard', // 'low', 'standard', 'high'
  });

  const handleSettingToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleDataUsageChange = (usage: string) => {
    setSettings(prev => ({
      ...prev,
      dataUsage: usage
    }));
  };

  const showAbout = () => {
    Alert.alert(
      'About Lavatory Finder',
      'Version 1.0.0\n\nFind nearby bathrooms, water fountains, hand sanitizers, and sinks with ease.\n\nBuilt with React Native and AWS.',
      [{ text: 'OK' }]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us. Location data is only used to find nearby services and is not stored permanently.\n\nFor more details, visit our website.',
      [{ text: 'OK' }]
    );
  };

  const showTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'By using this app, you agree to our terms of service. Please use responsibly and respect the facilities you visit.',
      [{ text: 'OK' }]
    );
  };

  const contactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Need help? Contact us at:\n\nEmail: support@lavatoryfinder.com\nPhone: 1-800-LAVATORY\n\nWe\'re here to help!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.header}
      >
        <Text style={styles.title}>Profile & Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voice Status */}
        {isListening && (
          <View style={styles.voiceStatus}>
            <Icon name="mic" size={16} color="#dc2626" />
            <Text style={styles.voiceStatusText}>Voice control active</Text>
            {recognizedText && (
              <Text style={styles.voiceRecognizedText}>"{recognizedText}"</Text>
            )}
          </View>
        )}

        {/* Location Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="location-on" size={20} color="#059669" />
            <Text style={styles.statusTitle}>Location Services</Text>
          </View>
          {currentLocation ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                ✅ Location active (Accuracy: {currentLocation.accuracy?.toFixed(0)}m)
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={refreshLocation}
              >
                <Icon name="refresh" size={16} color="#2563eb" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.locationError}>
              ❌ Location access required for full functionality
            </Text>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="notifications" size={20} color="#2563eb" />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, settings.notifications && styles.toggleActive]}
              onPress={() => handleSettingToggle('notifications')}
            >
              <View style={[styles.toggleThumb, settings.notifications && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="mic" size={20} color="#dc2626" />
              <Text style={styles.settingLabel}>Voice Control</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, settings.voiceControl && styles.toggleActive]}
              onPress={() => handleSettingToggle('voiceControl')}
            >
              <View style={[styles.toggleThumb, settings.voiceControl && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="my-location" size={20} color="#059669" />
              <Text style={styles.settingLabel}>Location Tracking</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, settings.locationTracking && styles.toggleActive]}
              onPress={() => handleSettingToggle('locationTracking')}
            >
              <View style={[styles.toggleThumb, settings.locationTracking && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Usage</Text>
          <Text style={styles.sectionSubtitle}>Choose how much data to use for images and maps</Text>
          
          {['low', 'standard', 'high'].map((usage) => (
            <TouchableOpacity
              key={usage}
              style={styles.dataOption}
              onPress={() => handleDataUsageChange(usage)}
            >
              <View style={styles.dataOptionInfo}>
                <Text style={styles.dataOptionLabel}>
                  {usage === 'low' ? 'Low Data' : usage === 'standard' ? 'Standard' : 'High Quality'}
                </Text>
                <Text style={styles.dataOptionDescription}>
                  {usage === 'low' ? 'Basic maps, no images' : 
                   usage === 'standard' ? 'Standard maps, compressed images' : 
                   'High-res maps, full quality images'}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                settings.dataUsage === usage && styles.radioButtonActive
              ]}>
                {settings.dataUsage === usage && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={showAbout}>
            <Icon name="info" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>About</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={showPrivacyPolicy}>
            <Icon name="privacy-tip" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={showTermsOfService}>
            <Icon name="description" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={contactSupport}>
            <Icon name="support-agent" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Contact Support</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* AWS Integration Status - AWS INTEGRATION PLACEHOLDER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backend Status</Text>
          <View style={styles.statusIndicator}>
            <Icon name="cloud-off" size={16} color="#dc2626" />
            <Text style={styles.statusText}>AWS Backend Not Connected</Text>
          </View>
          <Text style={styles.statusDescription}>
            This app is currently running with mock data. Connect to AWS services for full functionality.
          </Text>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>Built with React Native & AWS</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  voiceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 16,
  },
  voiceStatusText: {
    fontSize: 12,
    color: '#dc2626',
    marginLeft: 8,
    fontWeight: '500',
  },
  voiceRecognizedText: {
    fontSize: 10,
    color: '#dc2626',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  statusCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#059669',
    flex: 1,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
  },
  refreshButtonText: {
    fontSize: 12,
    color: '#2563eb',
    marginLeft: 4,
    fontWeight: '500',
  },
  locationError: {
    fontSize: 12,
    color: '#dc2626',
  },
  section: {
    marginVertical: 16,
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
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  dataOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dataOptionInfo: {
    flex: 1,
  },
  dataOptionLabel: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  dataOptionDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#2563eb',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#dc2626',
    marginLeft: 8,
    fontWeight: '500',
  },
  statusDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default ProfileScreen;
