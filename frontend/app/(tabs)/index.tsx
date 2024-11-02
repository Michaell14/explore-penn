import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

interface MarkerData{
  longitude: number,
  latitude: number
}

const HomeScreen: React.FC = () => {

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetTitle, setBottomSheetTitle] = useState("Nothing Selected");

  const handleMarkerPress = (marker: MarkerData) => {
    console.log(marker.longitude);
    console.log(marker.latitude)
    setBottomSheetTitle(marker.longitude.toString());
  };
  

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
  

  return (
    <View style={styles.container}>
      {/* header section */}
      <View style={styles.header}>
        <Text className = "text-4xl">Map of Penn</Text>
        <Text style={styles.description}>explore penn!</Text>
      </View>

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
          onPress={(e) => handleMarkerPress({longitude: 39.9522, latitude: -75.1932})}
        />
        <Marker
          coordinate={{ latitude: 39.9509, longitude: -75.1939 }}
          title="Van Pelt Library"
          description="where best spark team is working rn"
          onPress={(e) => handleMarkerPress({longitude: 39.9509, latitude: -75.1939})}
        />
      </MapView>
      
      <CustomBottomSheet title = {bottomSheetTitle} ref = {bottomSheetRef}/>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //padding for weird iphone top bar thing
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
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
