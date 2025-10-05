import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useVoiceControl } from '../context/VoiceControlContext';

const VoiceButton: React.FC = () => {
  const { isListening, toggleListening, recognizedText } = useVoiceControl();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isListening) {
      // Pulse animation when listening
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const handlePress = () => {
    // Haptic feedback
    Vibration.vibrate(50);
    toggleListening();
  };

  const getButtonColors = () => {
    if (isListening) {
      return ['#dc2626', '#ef4444'];
    }
    return ['#2563eb', '#3b82f6'];
  };

  const getIconName = () => {
    if (isListening) {
      return 'mic';
    }
    return 'mic-none';
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getButtonColors()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name={getIconName()} size={24} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
      
      {isListening && (
        <Text style={styles.listeningText}>Listening...</Text>
      )}
      
      {recognizedText && (
        <Text style={styles.recognizedText} numberOfLines={2}>
          "{recognizedText}"
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningText: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 4,
  },
  recognizedText: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 80,
  },
});

export default VoiceButton;
