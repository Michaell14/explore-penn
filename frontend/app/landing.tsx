import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type LandingPageProps = {
  onDismiss: () => void;
};

export default function LandingPage({ onDismiss }: LandingPageProps) {
  const router = useRouter();

  const handlePress = () => {
    onDismiss(); // calling onDismiss to switch to the main tabs layout
  };

  return (
    <ImageBackground
      source={require('../assets/images/image.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.overlay} onPress={handlePress}>
        {/* <Text style={styles.overlayText}>Tap anywhere to continue</Text> */}
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});
