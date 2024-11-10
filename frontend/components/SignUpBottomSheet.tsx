import { View, Text, StyleSheet, TextInput, Button, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { forwardRef, useMemo, useCallback, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useForm, Controller } from "react-hook-form"
import { createUserWithEmailAndPassword } from "firebase/auth";

interface Props {
    auth: any;
}
type FormData = {
    username: string;
    email: string;
    password: string,
    confirmPassword: string
};

type Ref = BottomSheet;

const SignUpBottomSheet = forwardRef<Ref, Props>((props, ref) => {

    const snapPoints = useMemo(() => ["35%", "75%"], []);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    // Signs a new user up
    const onSubmit = (data: FormData) => {
        if (data.password != data.confirmPassword) {
            console.log("passwords dont match");
            return;
        }
        console.log(data);

        createUserWithEmailAndPassword(props.auth, data.email, data.password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log('signed in');
                console.log(user);
                console.log(user.uid);
                //props.onDismiss();

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
            })
    }

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <>

            <BottomSheet
                ref={ref}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{ backgroundColor: "#F2F0EF" }}
            >
                <BottomSheetView className="items-center flex-1" style={styles.contentContainer}>
                    <Text style={styles.headingText}>Sign Up with Email</Text>

                    <View style={styles.inputContent}>
                        <Text>Enter Username</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Username"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    autoCorrect={false}
                                />
                            )}
                            name="username"
                        />
                        {errors.username && <Text>This is required.</Text>}
                    </View>

                    <View style={styles.inputContent}>
                        <Text className="text-4xl">Enter Email</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                pattern: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Email"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    autoCorrect={false}
                                />
                            )}
                            name="email"
                        />
                        {errors.email && <Text>This is required.</Text>}
                    </View>

                    <View style={styles.inputContent}>
                        <Text className="text-4xl">Enter Password</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter Password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={true}
                                    autoCorrect={false}
                                />
                            )}
                            name="password"
                        />
                        {errors.password && <Text>This is required.</Text>}
                    </View>

                    <View style={styles.inputContent}>
                        <Text className="text-4xl">Confirm Password</Text>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Confirm Password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={true}
                                    autoCorrect={false}
                                />
                            )}
                            name="confirmPassword"
                        />
                        {errors.confirmPassword && <Text>This is required.</Text>}
                    </View>
                    <Button title="Submit" onPress={handleSubmit(onSubmit)} />

                </BottomSheetView>
            </BottomSheet>
        </>

    )
});

const styles = StyleSheet.create({
    contentContainer: {
        padding: 36,
        backgroundColor: "#F2F0EF"
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "120%",
    },
    textInput: {
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 20,
        padding: 5,
        width: "100%",
    },
    inputContent: {
        marginBottom: 16,
        width: "100%"
    },
    headingText: {
        fontSize: 24,
        fontWeight: 600,
        marginBottom: 10
    }
});

export default SignUpBottomSheet;