// hooks/useAuth.ts
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { makeRedirectUri } from 'expo-auth-session';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up Google Sign-In request
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '414478752713-6fam2g2c75qhc7ihenps0sbk1b3dqj7g.apps.googleusercontent.com', 
    redirectUri: makeRedirectUri(),
  });

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Check for a successful Google Sign-In response
    if (response?.type === 'success') {
      const { id_token } = response.params;

      // Use the id_token to create a Firebase credential and sign in
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setUser(userCredential.user);
        })
        .catch((error) => {
          console.error("Sign in error:", error);
        });
    }
  }, [response]);

  const signInWithGoogle = async () => {
    await promptAsync();
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
