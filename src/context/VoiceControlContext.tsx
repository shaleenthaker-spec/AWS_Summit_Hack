import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { Alert, Vibration } from 'react-native';

interface VoiceControlContextType {
  isListening: boolean;
  recognizedText: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  toggleListening: () => Promise<void>;
  clearRecognizedText: () => void;
}

const VoiceControlContext = createContext<VoiceControlContextType | undefined>(undefined);

interface VoiceControlProviderProps {
  children: ReactNode;
}

export const VoiceControlProvider: React.FC<VoiceControlProviderProps> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    // Voice event handlers
    Voice.onSpeechStart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        setRecognizedText(text);
        console.log('Recognized text:', text);
        
        // Provide haptic feedback
        Vibration.vibrate(100);
        
        // Process voice commands
        processVoiceCommand(text);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setIsListening(false);
      console.error('Voice recognition error:', e.error);
      Alert.alert('Voice Error', 'Failed to recognize speech. Please try again.');
    };

    // Cleanup on unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const processVoiceCommand = (text: string) => {
    const command = text.toLowerCase().trim();
    
    // Voice commands for navigation and actions
    if (command.includes('find') || command.includes('search')) {
      // Navigate to search screen
      console.log('Voice command: Search');
      // TODO: Add navigation logic here
    } else if (command.includes('map') || command.includes('show map')) {
      // Navigate to map screen
      console.log('Voice command: Show map');
      // TODO: Add navigation logic here
    } else if (command.includes('home') || command.includes('main')) {
      // Navigate to home screen
      console.log('Voice command: Go home');
      // TODO: Add navigation logic here
    } else if (command.includes('bathroom') || command.includes('toilet') || command.includes('restroom')) {
      // Search for bathrooms
      console.log('Voice command: Find bathroom');
      // TODO: Add search logic here
    } else if (command.includes('water') || command.includes('fountain')) {
      // Search for water fountains
      console.log('Voice command: Find water fountain');
      // TODO: Add search logic here
    }
  };

  const startListening = async (): Promise<void> => {
    try {
      await Voice.start('en-US');
      setRecognizedText('');
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      Alert.alert('Error', 'Failed to start voice recognition. Please check your microphone permissions.');
    }
  };

  const stopListening = async (): Promise<void> => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  };

  const toggleListening = async (): Promise<void> => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const clearRecognizedText = (): void => {
    setRecognizedText('');
  };

  const value: VoiceControlContextType = {
    isListening,
    recognizedText,
    startListening,
    stopListening,
    toggleListening,
    clearRecognizedText,
  };

  return (
    <VoiceControlContext.Provider value={value}>
      {children}
    </VoiceControlContext.Provider>
  );
};

export const useVoiceControl = (): VoiceControlContextType => {
  const context = useContext(VoiceControlContext);
  if (context === undefined) {
    throw new Error('useVoiceControl must be used within a VoiceControlProvider');
  }
  return context;
};
