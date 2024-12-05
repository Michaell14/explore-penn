import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { baseURL } from '../../config.js';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';
// import { getExpoPushToken, saveExpoPushToken } from '@/hooks/fcmToken';
// import { startBackgroundUpdate } from '@/hooks/registerBackground';


const SignInScreen: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (error: any) {
      console.log("Can't sign into Google", error);
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Button title="Sign In with Google" onPress={handleGoogleSignIn} />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
