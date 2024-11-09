import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { baseURL } from '../config';
import {webClientId, iosClientId, androidClientId} from '../config';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}



WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      // First, check if the user already exists in your backend
      const response = await axios.get(`${baseURL}/api/users/${user.uid}`);
      
      if (response.status === 404) {
        // If the user doesn't exist, proceed with registration
        await axios.post(
          `${baseURL}/api/users/register`,
          { uid: user.uid, name: user.displayName, email: user.email },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('User registered successfully');
      } else {
        console.log('User already exists');
      }
    } catch (error) {
      console.error("Error registering user:", error);
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
