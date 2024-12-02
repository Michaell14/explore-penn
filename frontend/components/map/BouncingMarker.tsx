import React, { useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';

interface BouncingMarkerProps {
  coordinate: { latitude: number; longitude: number };
  id: string;
  isSelected: boolean;
  onPress: () => void;
  staticImageSource: any;
  gifImageSource: any;
  title?: string;
}

const BouncingMarker: React.FC<BouncingMarkerProps> = ({
  coordinate,
  id,
  isSelected,
  onPress,
  staticImageSource,
  gifImageSource,
  title,
}) => {
  // Debugging Props
  useEffect(() => {
    console.log(`Props for marker ${id}:`, { coordinate, isSelected, title });
  }, [coordinate, isSelected, title]);

  // Validate Coordinate
  if (!coordinate || !coordinate.latitude || !coordinate.longitude) {
    console.error(`Invalid coordinate for marker ${id}`);
    return null; // Don't render the marker
  }

  // Validate Image Sources
  if (!staticImageSource || !gifImageSource) {
    console.error(`Missing image sources for marker ${id}`);
    return null; // Don't render the marker
  }

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress || (() => console.warn(`No onPress handler for marker ${id}`))}
      title={title || 'Untitled'}
    >
      <Image
        source={isSelected ? gifImageSource : staticImageSource}
        style={styles.markerImage}
      />
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',

  },
});

export default BouncingMarker;
