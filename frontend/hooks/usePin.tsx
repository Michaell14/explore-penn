import React, { createContext, useContext, useState } from 'react';
import { PinData } from '@/api/eventPinApi';

interface PinContextType {
  selectedPin: PinData | null;
  selectPin: (pin: PinData) => void;
  clearPin: () => void;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const PinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);

  const selectPin = (pin: PinData) => {
    if (selectedPin?.id !== pin.id) {
      console.log('Pin selected:', pin);
      setSelectedPin(pin);
    }
  };

  const clearPin = () => setSelectedPin(null);

  return (
    <PinContext.Provider value={{ selectedPin, selectPin, clearPin }}>
      {children}
    </PinContext.Provider>
  );
};

export const usePin = (): PinContextType => {
  const context = useContext(PinContext);
  if (!context) {
    throw new Error('usePin must be used within a PinProvider');
  }
  return context;
};
