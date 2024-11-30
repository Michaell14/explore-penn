import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
//import { useNavigation } from '@react-navigation/native';
import PinIcon from '../../assets/images/pin-icon.png';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  //const navigation = useNavigation();
  const router = useRouter();
  return (
    <>
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
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={focused ? 'black' : '#771FD6'} />
            ),
          }}
        />
        <Tabs.Screen
          name="bulletin"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'square' : 'square-outline'} color={focused ? 'black' : '#771FD6'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={focused ? 'black' : '#771FD6'} />
            ),
          }}
        />
      </Tabs>

      {/* pin button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.replace('../bulletin')}
      >
        <Image source={PinIcon} style={styles.pinIcon} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 45,
    marginLeft: 30,
    width: "35%",
    height: 52,
    paddingTop: 5,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderColor: "#E0E0F4",
    backgroundColor: '#E0E0F4',
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
  },
  pinIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    bottom: 20,
  }
});
