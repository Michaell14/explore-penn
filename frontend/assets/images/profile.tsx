import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from "../../firebaseConfig";
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import ResetPasswordIcon from '../../assets/images/reset-password-icon.png';

export default function ProfileScreen() {
    //edit mode toggle
    const [isEditable, setIsEditable] = useState(true);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const uid = user.uid;
            const email = user.email;
            // ... other user properties
            console.log(uid);
            console.log(email);
        } else {
            // User is signed out
        }
    });
    function onResetPasswords() {
    }
    function onPushNotifications() {
    }
    function onPressLogout() {
        signOut(auth).then(() => {
            console.log("logged out");
            router.push("../landing")
        }).catch((error) => {
            // An error happened.
        });
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-[#D9D9FF]">
                {/* header section */}
                <View className="bg-[#D9D9FF] pb-16 items-center rounded-b-[40px]" style={styles.header}>
                    <Text className="text-5xl font-Yorkmade mt-16 text-[#3D00B8]">Hungry Hippo</Text>
                    <Text style={{
                        fontFamily: 'SF UI Display',
                        fontSize: 18,
                        color: '#3D00B8',
                    }}>email@school.upenn.edu</Text>
                </View>

                {/* status section */}
                {<View className="flex-row p-2 items-center justify-center">
                    <Image source={require("../../assets/images/winner.png")} style={styles.winner} />
                    <TouchableOpacity className="bg-[#F0EFFD] py-10 px-2 items-center rounded-[10px] w-[100px]">
                        <View className="flex-column items-center">
                            <Text className="text-5xl font-bold text-[#50F]">35</Text>
                            <Text className="text-xl text-[#50F]">Pins</Text>
                            <Text className="text-xl text-[#50F]">posted</Text>
                        </View>
                    </TouchableOpacity>
                    <View className="w-10"></View>
                    <TouchableOpacity className="bg-[#F0EFFD] py-10 px-2 items-center rounded-[10px] w-[100px]" >
                        <View className="flex-column items-center">
                            <Text className="text-5xl font-bold text-[#50F]">70</Text>
                            <Text className="text-xl text-[#50F]">Stickers</Text>
                            <Text className="text-xl text-[#50F]">placed</Text>
                        </View>
                    </TouchableOpacity>
                    <Image source={require("../../assets/images/smily-face.png")} style={styles.smilyface} />
                </View>}

                {/* buttons section */}
                {<View className="flex-1 p-8">

                    <TouchableOpacity className="bg-[#F0EFFD] py-3 items-left" onPress={onResetPasswords}>
                        <View className="flex-row">
                            <Image source={require("../../assets/images/reset-password-icon.png")} style={styles.resetpasswordIcon} />
                            <Text className="text-2xl text-[#50F]">Reset Passwords</Text>
                            <Image source={require("../../assets/images/reset-password-rightarrow.png")} style={styles.resetpasswordArrowIcon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#F0EFFD] py-3 items-left" onPress={onPushNotifications}>
                        <View className="flex-row">
                            <Image source={require("../../assets/images/push-notification-bell.png")} style={styles.resetpasswordIcon} />
                            <Text className="text-2xl text-[#50F]">Push notificaitons</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#F0EFFD] py-3 items-left" onPress={onPressLogout}>
                        <View className="flex-row">
                            <Image source={require("../../assets/images/logout.png")} style={styles.resetpasswordIcon} />
                            <Text className="text-2xl text-[#EF6A56]">Log out</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
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
        // width: 35,
        // height: 0,
        marginLeft: 8,
        marginRight: 20,
        // objectFit: "cover"
    },
    resetpasswordArrowIcon: {
        // width: 35,
        // height: 0,
        marginLeft: 60
        // objectFit: "cover"
    },
    winner: {
        width: 60,
        height: 80,
        top: 60,
        objectFit: "cover"
    },
    smilyface: {
        width: 40,
        height: 40,
        top: -60,
        objectFit: "cover"
    },
});
