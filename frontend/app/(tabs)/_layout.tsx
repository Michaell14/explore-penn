import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Dimensions } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: ['index', 'profile'].includes(route.name) ? styles.tabBar : { display: 'none' },
      })}
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
              style={{ width: 40, height: 40 }}
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
            null
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
    marginLeft: 30,
    width: 110,
    height: 60,
    paddingTop: 5,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#E3E3FF',

    borderTopColor: "#E3E3FF"
    // borderTopWidth: 2.4,
    // borderColor: 'white',
  },
});
