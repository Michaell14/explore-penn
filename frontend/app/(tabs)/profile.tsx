import React, { useState, useEffect, useRef, } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from "../../firebaseConfig";
import { getUserById } from '@/api/userApi';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import ResetPasswordSheet from '@/components/ResetPasswordSheet';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
    username: string;
    email: string;
    numPins: number;
    numReactions: number;
}

export default function ProfileScreen() {
    //edit mode toggle
    const [isEditable, setIsEditable] = useState(true);
    const [user, setUser] = useState<User | null>(null);
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

    // useEffect(() => {
    //     // Test Firestore connection
    //     const testFirestore = async () => {
    //         try {
    //             const testDocRef = doc(db, 'users', 'WwrD2UGiMJgle9Yy6THHVGUhOei2');
    //             const testDocSnapshot = await getDoc(testDocRef);
    //             if (testDocSnapshot.exists()) {
    //                 console.log('Firestore connection is working. Test document data:', testDocSnapshot.data());
    //             } else {
    //                 console.warn('Test document does not exist in Firestore.');
    //             }
    //         } catch (error) {
    //             console.error('Error testing Firestore connection:', error);
    //         }
    //     };

    //     testFirestore();
    // }, []);

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log(`User signed in: ${firebaseUser.uid}`);
                setUser(firebaseUser);

                // Start Firestore listener
                if (!unsubscribe) {
                    unsubscribe = listenForUserUpdates(firebaseUser.uid);
                }
            } else {
                console.log('User signed out');
                setUser(null);

                // Reset state for logged-out user
                setUsername('');
                setEmail('');
                setPinCount(0);
                setReactionCount(0);

                // Ensure Firestore listener is unsubscribed
                if (unsubscribe) {
                    unsubscribe();
                    unsubscribe = null;
                }

                setLoading(false); // Ensure loading stops
            }
        });

        // Cleanup both listeners on unmount
        return () => {
            console.log('Cleaning up listeners...');
            authUnsubscribe();
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const listenForUserUpdates = (uid: string) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            console.log(`Listening for updates on user: ${uid}`);

            return onSnapshot(
                userDocRef,
                (docSnapshot) => {
                    console.log(`Snapshot received for user: ${uid}`);
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        console.log('User document data:', data);

                        setUsername(data?.username || '');
                        setEmail(data?.email || '');
                        setPinCount(data?.numPins || 0);
                        setReactionCount(data?.numStickers || 0);
                    } else {
                        console.warn(`User document does not exist for UID: ${uid}`);
                        setUsername('');
                        setEmail('');
                        setPinCount(0);
                        setReactionCount(0);
                    }
                    setLoading(false); // Ensure loading is stopped
                },
                (error) => {
                    console.error('Error listening for user updates:', error);
                    setLoading(false); // Prevent infinite loading on errors
                }
            );
        } catch (error) {
            console.error('Error in Firestore listener setup:', error);
            setLoading(false); // Prevent infinite loading on exceptions
            return () => { }; // Return a no-op cleanup function
        }
    };


    // Debugging Logs for Loading State
    console.log('Loading state:', loading);

    // Handle loading state
    if (loading || !fontsLoaded) {
        console.log('Rendering loading spinner...');
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
            setLoading(true);
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
            <View className="flex-1 bg-[#F5F5FF]">
            <SafeAreaView style={{ flex: 1 }}>
                {/* header section */}
                <View className="pb-16 items-center rounded-b-[40px]" style={styles.header}>
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
                        {/* <Image source={require("../../assets/images/yellow-post-it.png")} className='absolute w-[180px] h-[180px] z-[-1] -rotate-[15deg] -mt-8 -left-[50px]' /> */}
                    </TouchableOpacity>
                    <View className="w-10"></View>
                    <TouchableOpacity className="bg-[#F0EFFD] py-5 px-2 items-center rounded-[10px] w-[100px]" >
                        <View className="flex-column items-center">
                            <Text className="text-5xl font-bold text-[#50F]">{reactionCount}</Text>
                            <Text className="text-xl text-[#50F]">Stickers</Text>
                            <Text className="text-xl text-[#50F]">placed</Text>
                        </View>
                        {/* <Image source={require("../../assets/images/yellow-post-it.png")} className='absolute w-[180px] h-[180px] z-[-1] rotate-[15deg] -mt-5 -right-10' /> */}
                    </TouchableOpacity>
                    <Image source={require("../../assets/images/smily-face.png")} style={styles.smilyface} />

                </View>}

                {/* buttons section */}
                {<View className="flex-1 px-10 py-16 mt-16" style={styles.container}>
                    <TouchableOpacity className="bg-[#F0EFFD] p-5 items-left flex-row rounded-tl-[7px] rounded-tr-[7px]" onPress={onResetPasswords}>
                        <Image source={require("../../assets/images/reset-password-icon.png")} style={styles.icon} />
                        <Text className="text-lg text-[#50F]">Reset password</Text>
                        <View
                            style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 16,
                            right: 16,
                            height: 1,
                            backgroundColor: '#9F9FD5',
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#F0EFFD] p-5 items-left flex-row" onPress={onPushNotifications}>
                        <Image source={require("../../assets/images/push-notification-bell.png")} style={styles.icon} />
                        <Text className="text-lg text-[#50F]">Push notifications</Text>
                        <View
                            style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 16,
                            right: 16,
                            height: 1,
                            backgroundColor: '#9F9FD5',
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#F0EFFD] p-5 items-left flex-row rounded-bl-[7px] rounded-br-[7px]" onPress={onPressLogout}>
                        <Image source={require("../../assets/images/logout.png")} style={styles.icon} />
                        <Text className="text-lg text-[#EF6A56]">Log out</Text>
                    </TouchableOpacity>
                </View>}
                <ResetPasswordSheet auth={auth} ref={resetPasswordRef} />
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}

// im leaving the stylesheet in the same file unless we wanna make a separate styles folder !
const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
    },
    icon: {
        width: 17,
        height: 22,
        marginLeft: 8,
        marginRight: 20,
        objectFit: "contain",
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
    container: {
        borderRadius: 19,
    }
});

