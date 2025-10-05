import React, { createContext, useContext, useState, ReactNode } from 'react';
import Voice from '@react-native-voice/voice';

interface VoiceControlContextType {
  isListening: boolean;
  isSupported: boolean;
  results: string[];
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  clearResults: () => void;
  toggleListening: () => Promise<void>;
  recognizedText: string;
}

const VoiceControlContext = createContext<VoiceControlContextType | undefined>(undefined);

export const useVoiceControl = () => {
  const context = useContext(VoiceControlContext);
  if (context === undefined) {
    throw new Error('useVoiceControl must be used within a VoiceControlProvider');
  }
  return context;
};

interface VoiceControlProviderProps {
  children: ReactNode;
}

export const VoiceControlProvider: React.FC<VoiceControlProviderProps> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');

  React.useEffect(() => {
    // Check if voice recognition is supported
    Voice.isAvailable().then((available: number) => {
      setIsSupported(available === 1);
    });

    // Voice recognition events
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setError(null);
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    Voice.onSpeechResults = (e: any) => {
      if (e.value) {
        setResults(e.value);
        setRecognizedText(e.value[0] || '');
      }
    };

    Voice.onSpeechError = (e: any) => {
      setError(e.error?.message || 'Speech recognition error');
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setError(null);
      setResults([]);
      await Voice.start('en-US');
    } catch (err) {
      setError('Failed to start voice recognition');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (err) {
      setError('Failed to stop voice recognition');
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
    setRecognizedText('');
  };

  const toggleListening = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const value = {
    isListening,
    isSupported,
    results,
    error,
    startListening,
    stopListening,
    clearResults,
    toggleListening,
    recognizedText,
  };

  return (
    <VoiceControlContext.Provider value={value}>
      {children}
    </VoiceControlContext.Provider>
  );
};