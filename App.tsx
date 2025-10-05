import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import SearchScreen from './src/screens/SearchScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddReviewScreen from './src/screens/AddReviewScreen';

// Import components
import { VoiceControlProvider } from './src/context/VoiceControlContext';
import { LocationProvider } from './src/context/LocationContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Stack Navigator
function MainStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetailScreen}
        options={{
          gestureEnabled: true,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AddReview" 
        component={AddReviewScreen}
        options={{
          gestureEnabled: true,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Map':
              iconName = 'map';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <VoiceControlProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <MainStack />
        </NavigationContainer>
      </VoiceControlProvider>
    </LocationProvider>
  );
}
