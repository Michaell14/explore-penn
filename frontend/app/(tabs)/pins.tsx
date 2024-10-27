import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const Pins: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* header section */}
      <View style={styles.header}>
        <Text style={styles.title}>Pins</Text>
      </View>

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
});

export default Pins;
