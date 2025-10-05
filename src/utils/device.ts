import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const DEVICE_ID_KEY = 'lavatory_finder_device_id';

// Generate a unique device identifier
export const generateDeviceId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const screenData = `${Dimensions.get('window').width}x${Dimensions.get('window').height}`;
  const platform = Platform.OS;
  
  // Combine various device characteristics for uniqueness
  const deviceString = `${platform}-${screenData}-${timestamp}-${random}`;
  
  // Create a hash-like string
  return btoa(deviceString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

// Get or create device ID
export const getDeviceId = async (): Promise<string> => {
  try {
    // Try to get existing device ID
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      // Generate new device ID
      deviceId = generateDeviceId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Failed to get device ID:', error);
    // Fallback to a generated ID
    return generateDeviceId();
  }
};

// Check if device has already reviewed a service
export const hasDeviceReviewed = async (serviceId: string): Promise<boolean> => {
  try {
    const deviceId = await getDeviceId();
    const reviewedServices = await AsyncStorage.getItem('reviewed_services');
    
    if (!reviewedServices) {
      return false;
    }
    
    const reviewed = JSON.parse(reviewedServices);
    return reviewed[serviceId] === deviceId;
  } catch (error) {
    console.error('Failed to check review status:', error);
    return false;
  }
};

// Mark service as reviewed by this device
export const markServiceAsReviewed = async (serviceId: string): Promise<void> => {
  try {
    const deviceId = await getDeviceId();
    const reviewedServices = await AsyncStorage.getItem('reviewed_services');
    
    let reviewed = {};
    if (reviewedServices) {
      reviewed = JSON.parse(reviewedServices);
    }
    
    reviewed[serviceId] = deviceId;
    await AsyncStorage.setItem('reviewed_services', JSON.stringify(reviewed));
  } catch (error) {
    console.error('Failed to mark service as reviewed:', error);
  }
};

// Get device info for analytics (anonymous)
export const getDeviceInfo = () => {
  return {
    platform: Platform.OS,
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
    isTablet: Dimensions.get('window').width > 768,
  };
};
