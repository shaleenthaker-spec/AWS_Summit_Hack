import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions } from 'react-native';

const DEVICE_ID_KEY = 'lavatory_finder_device_id';

export const generateDeviceId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const screenData = `${Dimensions.get('window').width}x${Dimensions.get('window').height}`;
  const platform = Platform.OS;
  
  const deviceString = `${platform}-${screenData}-${timestamp}-${random}`;
  return btoa(deviceString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

export const getDeviceId = async (): Promise<string> => {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = generateDeviceId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Failed to get device ID:', error);
    return generateDeviceId();
  }
};

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