// app/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';

const Index = () => {
  const {signOut, user} = useAuth()
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut().then(() => router.replace('/auth/sign-in'));
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome {user?.displayName}</Text>
      <Button title="Log Out" onPress={handleSignOut} />
    </View>
  );
};

export default Index;
