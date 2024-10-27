// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from '../hooks/useAuth'; // Import AuthProvider

export default function Layout() {
  return (
    <AuthProvider>
      <AuthenticatedLayout />
    </AuthProvider>
  );
}

// Separate layout component to use AuthProvider properly
function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) { // Only proceed if loading is false
      if (!user) {
        router.replace('/auth/sign-in'); // Redirect to the sign-in screen if not authenticated
      } else {
        router.replace('/'); // Redirect to the home screen if authenticated
      }
    }
  }, [user, loading]);

  if (loading) {
    // Display a loading indicator while checking authentication state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />; // Slot renders the current route (either main or auth)
}
