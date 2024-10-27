import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Explore: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* header section */}
      <View style={styles.header}>
        <Text style={styles.title}>Map of Penn</Text>
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 39.9522, longitude: -75.1932 }}
          title="Van Pelt Library"
          description="where best spark team is working rn"
        />
      </MapView>
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
});

export default Explore;
