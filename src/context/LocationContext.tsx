import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { LocationData } from '../types/Service';

interface LocationContextType {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await Geolocation.requestAuthorization('whenInUse');
      
      if (hasPermission === 'granted') {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            });
            setLoading(false);
          },
          (error) => {
            setError(error.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      } else {
        setError('Location permission denied');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to get location');
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const value = {
    location,
    loading,
    error,
    requestLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};