import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from "../../firebaseConfig";
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
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
            <View className="flex-1 bg-[#1B1B1B]">
                {/* header section */}
                <View className="bg-[#0F0E0E] pb-16  items-center rounded-b-[40px]" style={styles.header}>
                    <View className="relative">
                        <Image
                            // placeholder until dslaysigners mary and ruth cook
                            source={{ uri: 'https://via.placeholder.com/100' }}
                            className="w-[100px] h-[100px] rounded-full bg-slate-300"
                        />
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-white rounded-lg p-2">
                            <Icon name="pencil" size={16} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-2xl font-semibold mt-8 text-[#ECEEF2]">Hungry Hippo</Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#666',
                    }}>email@school.upenn.edu</Text>
                </View>

                {/* account section */}
                <View className="flex-1 p-6">
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-lg font-bold text-[#CEF7A0]">My Account</Text>
                        {/*}
                        <TouchableOpacity onPress={() => setIsEditable(!isEditable)}>
                            <Text className = "text-lg color-[#007bff]">Edit</Text>
                        </TouchableOpacity>*/}
                    </View>

                    <TextInput
                        className="h-10 border-black border rounded-[20px] px-3 mb-4 text-[#ECEEF280]"
                        placeholder="Email"
                        editable={isEditable}
                        clearButtonMode="while-editing"
                    />
                    <TextInput
                        className="h-10 border-black border rounded-[20px] px-3 mb-4 text-[#ECEEF280]"
                        placeholder="Password"
                        secureTextEntry={true}
                        editable={isEditable}
                        clearButtonMode="while-editing"
                    />

                    <TouchableOpacity className="bg-[#d3d3d3] rounded-[20px] py-3 mt-4 items-center" onPress={onPressLogout}>
                        <Text className="text-lg font-bold text-[#333]">Log out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

// im leaving the stylesheet in the same file unless we wanna make a separate styles folder !
const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
    }
});
