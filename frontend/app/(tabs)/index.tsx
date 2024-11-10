import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PinBottomSheet from '@/components/PinBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

interface PinData {
  title: string,
  description: string,
  longitude: number,
  latitude: number
}

const HomeScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [pin, setPin] = useState<PinData>();

  const handleMarkerPress = (pin: PinData) => {
    console.log(pin.longitude);
    console.log(pin.latitude)
    setPin(pin);
  };

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);

  return (
    <View style={[styles.container]}>
      {/* map section */}
      <MapView
        style={styles.map}
        // mapType="satellite"
        initialRegion={{
          // penn coords
          latitude: 39.9522,
          longitude: -75.1932,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{ latitude: 39.9522, longitude: -75.1932 }}
          title="Van Pelt Library"
          description="where best spark team is working rn"
          onPress={(e) => handleMarkerPress({
            title: "Van Pelt Library",
            description: "where best spark team is working rn",
            longitude: 39.9522,
            latitude: -75.1932
          })}
        />
        <Marker
          coordinate={{ latitude: 39.9509, longitude: -75.1939 }}
          title="Houston Hall"
          description="This is where the ping pong table is"
          onPress={(e) => handleMarkerPress({
            title: "Houston Hall",
            description: "This is where the ping pong table is",
            longitude: 39.9509,
            latitude: -75.1939
          })}
        />
      </MapView>

      <PinBottomSheet pin={pin} ref={bottomSheetRef} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //padding for weird iphone top bar thing
    //paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
  },

  header: {
    padding: 18,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  map: {
    width: Dimensions.get('window').width,
    // uhh this is for my iphone, just hardcoded it for now but might be diff for other phoens
    height: Dimensions.get('window').height - 140,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});

export default HomeScreen;
