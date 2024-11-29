import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { baseURL } from '../config';
import {webClientId, iosClientId, androidClientId} from '../config';
import { registerUser } from '../api/userApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}



WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserWithRetry = async (uid: string, retries = 3, delay = 1000): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
      try {
          console.log(`Attempt ${attempt}: Fetching user data...`);
          const response = await axios.get(`${baseURL}/api/users/${uid}`);
          console.log('User data fetched successfully:', response.data);
          return response.data; // Successfully fetched user data
      } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
              console.log('User not found on backend, retrying...');
              await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
          } else {
              console.error("Error fetching user data:", error);
              throw error; // Break retries on other errors
          }
      }
  }
  throw new Error("Failed to fetch user data after retries");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId,
    iosClientId,
    androidClientId
  });

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        await createUserIfNotExists(firebaseUser);
        await fetchUserWithRetry(firebaseUser.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Check for Google response
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);

          // Sign in with Firebase
          const firebaseUserCredential = await signInWithCredential(auth, credential);
          setUser(firebaseUserCredential.user);
        } catch (error) {
          console.error("Error signing in with Firebase:", error);
        }
      }
    };

    handleGoogleResponse();
  }, [response]);

  const signInWithGoogle = async () => {
    try {
      await promptAsync(); // Trigger Google sign-in
    } catch (error) {
      console.error("Can't sign into Google", error);
    }
  };

  const createUserIfNotExists = async (user: User) => {
    try {
        console.log('Checking if user exists...');
        const response = await axios.get(`${baseURL}/api/users/${user.uid}`);
        console.log('User exists:', response.status === 200);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            console.log('User not found, registering user...');
            try {
                await registerUser(user);
                console.log('User registered successfully');
            } catch (registrationError) {
                console.error("Error during user registration:", registrationError);
                throw registrationError;
            }
        } else {
            console.error("Error checking user existence:", error);
            throw error;
        }
    }
};
  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
