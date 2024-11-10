import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import SignUpBottomSheet from '@/components/SignUpBottomSheet';
import LoginBottomSheet from '@/components/LoginBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type LandingPageProps = {
  onDismiss: () => void;
};

export default function LandingPage({ onDismiss }: LandingPageProps) {
  const signUpSheetRef = useRef<BottomSheet>(null);
  const loginSheetRef = useRef<BottomSheet>(null);

  const onOpenSignUp = () => signUpSheetRef.current?.expand();
  const onOpenLogin = () => loginSheetRef.current?.expand();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log("user is signed in with: " + user.uid);
      if (onDismiss) {
        onDismiss();
      } else {
        if (router.canDismiss()) {
          router.dismissAll();
        }
        
        router.push("/(tabs)/")
      }
    } else {
      console.log("user is not signed in");
    }
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GestureHandlerRootView style={styles.container}>
          <View className="flex-1 items-center justify-center">
            <LinearGradient
              colors={['rgb(107, 52, 223)', 'rgb(35, 11, 35)', "#1C0821"]}
              style={styles.background}
            />

            <TouchableOpacity onPress={onOpenLogin}>
              <View className="rounded-[10px] border border-solid border-[#CEF7A0] w-[261px] items-center mb-4">
                <Text className="text-lg font-semibold py-3 text-[#CEF7A0]">Log In with Email</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { }}>
              <View className="rounded-[10px] border border-solid border-[#CEF7A0] w-[261px] items-center mb-4">
                <Text className="text-lg font-semibold py-3 text-[#CEF7A0]">Log In with Google</Text>
              </View>
            </TouchableOpacity>

            <View className="flex-row">
              <Text className="text-slate-300">Don't have an account? </Text>
              <Text className="text-[#CEF7A0]" onPress={onOpenSignUp}>Sign Up</Text>
            </View>
          </View>

          <SignUpBottomSheet auth={auth} ref={signUpSheetRef} />
          <LoginBottomSheet auth={auth} ref={loginSheetRef} />
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
