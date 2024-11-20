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
import { useAuth } from '@/hooks/useAuth';

type LandingPageProps = {
  onDismiss: () => void;
};

export default function LandingPage({ onDismiss }: LandingPageProps) {
  // const {signInWithGoogle} = useAuth();
  const signUpSheetRef = useRef<BottomSheet>(null);
  const loginSheetRef = useRef<BottomSheet>(null);

  const onOpenSignUp = () => signUpSheetRef.current?.expand();
  const onCloseSignUp = () => signUpSheetRef.current?.close();
  const onOpenLogin = () => loginSheetRef.current?.expand();
  const onCloseLogin = () => loginSheetRef.current?.close();

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

            <Image
              // placeholder until dslaysigners mary and ruth cook
              source={require("./../assets/images/pin.png")}
              style={styles.pinImage}
            />

            <TouchableOpacity onPress={() => { onCloseSignUp(); onOpenLogin() }} className = "mt-20">
              <View className="rounded-[10px] border border-solid border-[#CEF7A0] w-[261px] items-center mb-4 flex-row justify-center">
                <Image source={require("./../assets/images/mail-icon.png")} style={styles.mailIcon}/>
                <Text className="text-lg font-semibold py-3 text-[#CEF7A0]">Login with Email</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { signInWithGoogle() }}>
              <View className="rounded-[10px] border border-solid border-[#CEF7A0] w-[261px] items-center mb-4 flex-row justify-center">
                <Image source={require("./../assets/images/google-icon.png")} style={styles.googleIcon}/>
                <Text className="text-lg font-semibold py-3 text-[#CEF7A0]">Login with Google</Text>
              </View>
            </TouchableOpacity>

            <View className="flex-row">
              <Text className="text-slate-300">Don't have an account? </Text>
              <Text className="text-[#CEF7A0]" onPress={() => { onCloseLogin(); onOpenSignUp() }}>Sign Up</Text>
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
  pinImage: {
    width: 260,
    height: 260,
    objectFit: "contain",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    objectFit: "cover"
  },
  mailIcon: {
    width: 19.5,
    height: 15,
    marginRight: 8,
    objectFit: "cover"
  }
});
