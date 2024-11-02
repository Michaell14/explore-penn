// app/auth/sign-in.tsx
import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import {baseURL} from '../../config.js';

const SignInScreen = () => {
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();

  // Handle Google Sign-In button press
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(); // Call Google sign-in      
      router.replace('/')
    } catch (error:any) {
      console.log("Can't sign into Google", error)
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
