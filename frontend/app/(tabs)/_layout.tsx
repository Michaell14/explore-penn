import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PinIcon from '../../assets/images/pin-icon.png';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  //const navigation = useNavigation();
  const router = useRouter();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={focused ? 'white' : '#771FD6'} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="pins"
          options={{
            title: 'Pins',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'square' : 'square-outline'} color={focused ? 'white' : '#771FD6'} />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="bulletin"
          options={{
            title: 'Bulletin',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'square' : 'square-outline'} color={focused ? 'white' : '#771FD6'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={focused ? 'white' : '#771FD6'} />
            ),
          }}
        />
      </Tabs>

      {/* pin button */}
      <TouchableOpacity
        style={styles.floatingButton}
        // onPress={() => navigation.navigate('pins')}
        onPress={() => router.push('/bulletin')}
      >
        <Image source={PinIcon} style={styles.pinIcon} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 90,
    height: 60,
    borderRadius: 25,
    backgroundColor: '#191C16',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  tabBarItem: {
    justifyContent: 'center',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  pinIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    bottom: 20,
  }
});
