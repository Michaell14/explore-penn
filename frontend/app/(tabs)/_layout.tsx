import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Dimensions } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused 
                ? require('../../assets/images/map-icon-active.png') 
                : require('../../assets/images/map-icon.png')}
              style={{ width: 40, height: 40, overflow: 'visible' }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bulletin"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/bulletin-icon.png')}
              style={{ width: 27, height: 27 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused 
                ? require('../../assets/images/profile-icon-active.png') 
                : require('../../assets/images/profile-icon.png')}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 70,
    marginLeft: Dimensions.get('window').width / 2 - 100,
    width: 200,
    height: 60,
    paddingTop: 5,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#E0E0F4',
    borderWidth: 2,
    borderTopWidth: 2.4,
    borderColor: 'white',
  },
});
