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

    useEffect(() => {
        console.log(`Marker ${id}: isSelected = ${isSelected}, title = ${title}`);
        console.log(`Rendering marker ${id}: title = ${isSelected && title ? title : 'No Title'}`);

      }, [isSelected, title]);
      

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => {
        onPress();
      }}
      title={title || undefined}
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
