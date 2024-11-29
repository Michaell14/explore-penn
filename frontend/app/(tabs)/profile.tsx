import React, { useState, useEffect, useRef, } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from "../../firebaseConfig";
import { getUserById } from '@/api/userApi';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import ResetPasswordSheet from '@/components/ResetPasswordSheet';

interface UserProfile {
    username: string;
    email: string;
    numPins: number;
    numReactions: number;
}

export default function ProfileScreen() {
    //edit mode toggle
    const [isEditable, setIsEditable] = useState(true);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [pinCount, setPinCount] = useState<number>(0);
    const [reactionCount, setReactionCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [fontsLoaded] = useFonts({
        Yorkmade: require('../../assets/fonts/Yorkmade.otf'),
        "SF UI Display": require('../../assets/fonts/sf-ui-display-black.otf'),
    });
    const resetPasswordRef = useRef<BottomSheet>(null);
    const onOpenResetPass = () => resetPasswordRef.current?.expand();
    const onCloseResetPass = () => resetPasswordRef.current?.close();

    const fetchUserProfile = async (uid: string) => {
        try {
            setLoading(true);
            const response = await getUserById(uid);
            const { username, email, numPins, numStickers} = response; // Assuming response contains these fields
            setUsername(username);
            setEmail(email);
            setPinCount(numPins);
            setReactionCount(numStickers);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(`User signed in: ${user.uid}`);
                fetchUserProfile(user.uid);
            } else {
                console.log("User signed out");
                // Reset profile state on sign-out
                setUsername('');
                setEmail('');
                setPinCount(0);
                setReactionCount(0);
                setLoading(false);
            }
        });
        return unsubscribe; // Cleanup listener on unmount
    }, []);

    // Handle loading state
    if (loading || !fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3D00B8" />
            </View>
        );
    }

    function onResetPasswords() {
        onOpenResetPass();
    }
    function onPushNotifications() {
    }
    const onPressLogout = async (): Promise<void> => {
        try {
            setLoading(true); // Show loading state during logout
            await signOut(auth);
            router.push("../landing");
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-[#D9D9FF]">
                {/* header section */}
                <View className="bg-[#D9D9FF] pb-16 items-center rounded-b-[40px]" style={styles.header}>
                    <Text style={{
                        fontFamily: 'Yorkmade',
                        fontSize: 40,
                        color: '#3D00B8',
                    }} >{username}</Text>
                    <Text className="text-md text-[#3D00B8]">{email}</Text>
                </View>

                {/* status section */}
                {<View className="flex-row p-2 items-center justify-center">
                    <Image source={require("../../assets/images/winner.png")} style={styles.winner} />
                    <TouchableOpacity className="bg-[#F0EFFD] py-5 px-2 items-center rounded-[10px] w-[100px]">
                        <View className="flex-column items-center">
                            <Text className="text-5xl font-bold text-[#50F]">{pinCount}</Text>
                            <Text className="text-xl text-[#50F]">Pins</Text>
                            <Text className="text-xl text-[#50F]">posted</Text>
                        </View>
                    </TouchableOpacity>
                    <View className="w-10"></View>
                    <TouchableOpacity className="bg-[#F0EFFD] py-5 px-2 items-center rounded-[10px] w-[100px]" >
                        <View className="flex-column items-center">
                            <Text className="text-5xl font-bold text-[#50F]">{reactionCount}</Text>
                            <Text className="text-xl text-[#50F]">Stickers</Text>
                            <Text className="text-xl text-[#50F]">placed</Text>
                        </View>
                    </TouchableOpacity>
                    <Image source={require("../../assets/images/smily-face.png")} style={styles.smilyface} />

                </View>}

                {/* buttons section */}
                {<View className="flex-1 px-10 py-16">
                    <TouchableOpacity className="bg-[#F0EFFD] py-3 items-left" onPress={onResetPasswords}>
                        <View className="flex-row">
                            <Image source={require("../../assets/images/reset-password-icon.png")} style={styles.resetpasswordIcon} />
                            <Text className="text-lg text-[#50F]">Reset password</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#F0EFFD] py-3 items-left" onPress={onPushNotifications}>
                        <View className="flex-row">
                            <Image source={require("../../assets/images/push-notification-bell.png")} style={styles.resetpasswordIcon} />
                            <Text className="text-lg text-[#50F]">Push notifications</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#F0EFFD] py-3 items-left" onPress={onPressLogout}>
                        <View className="flex-row">
                            <Image source={require("../../assets/images/logout.png")} style={styles.logoutIcon} />
                            <Text className="text-lg text-[#EF6A56]">Log out</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
                <ResetPasswordSheet auth={auth} ref={resetPasswordRef} />
            </View>
        </TouchableWithoutFeedback>
    );
}

// im leaving the stylesheet in the same file unless we wanna make a separate styles folder !
const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
    },
    resetpasswordIcon: {
        width: 17,
        height: 22,
        marginLeft: 8,
        marginRight: 20
    },
    resetpasswordArrowIcon: {
        width: 18,
        height: 16,
        marginLeft: 60
    },
    logoutIcon: {
        width: 18,
        height: 16,
        marginLeft: 8,
        marginRight: 20,
    },
    winner: {
        width: 60,
        height: 80,
        top: 50,
        left: 10,
        objectFit: "cover"
    },
    smilyface: {
        width: 40,
        height: 40,
        top: -60,
        left: -20,
        objectFit: "cover"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9FF',
    },
});
