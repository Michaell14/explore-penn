import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { forwardRef, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useForm, Controller } from "react-hook-form"
import { createUserWithEmailAndPassword } from "firebase/auth";

interface Props {
    auth: any;
}
type FormData = {
    username: string;
    email: string;
    password: string
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
    // const handleSheetChanges = useCallback((index: number) => {
    //     console.log('handleSheetChanges', index);
    // }, []);

    return (
        <>

            <BottomSheet
                ref={ref}
                snapPoints={snapPoints}
                //onChange={handleSheetChanges}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{ backgroundColor: "#F5F5FF" }}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        style={[props.style, styles.backdrop]}
                    />
                )}
            >
                <BottomSheetView className="items-center flex-1" style={styles.contentContainer}>
                    <Image
                        // placeholder until dslaysigners mary and ruth cook
                        source={require("../../assets/images/new.png")}
                        style={styles.newImage}
                    />
                    <Image
                        // placeholder until dslaysigners mary and ruth cook
                        source={require("../../assets/images/account.png")}
                        style={styles.headerImg}
                    />
                    <View style = {{marginTop: 180}}></View>
                    <View style={styles.inputContent}>
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
                                    placeholderTextColor="#3D00B8"
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
                                    placeholderTextColor="#3D00B8"
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
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Password"
                                    placeholderTextColor="#3D00B8"
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

                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
                        <Text style = {{color: "#F5F5FF", fontWeight: 600, fontSize: 16}}>Sign Up</Text>
                    </TouchableOpacity>

                </BottomSheetView>
            </BottomSheet>
        </>

    )
});

const styles = StyleSheet.create({
    contentContainer: {
        padding: 36,
        backgroundColor: "#F5F5FF"
    },
    textInput: {
        borderRadius: 9,
        padding: 16,
        width: "100%",
        backgroundColor: "#E3E3FF"
    },
    inputContent: {
        marginBottom: 18,
        width: "100%"
    },
    newImage: {
        width: 220,
        height: 215,
        objectFit: "contain",
        position: "absolute",
        top: -30
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the color here
    },
    submitBtn: {
        alignItems: 'center',
        backgroundColor: '#3D00B8',
        borderRadius: 9,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 10
    },
    headerImg: {
        width: 310,
        height: 300,
        objectFit: "contain",
        position: "absolute",
        top: 25
    }
});

export default SignUpBottomSheet;