import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { forwardRef, useMemo, useCallback, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useForm, Controller } from "react-hook-form"
import { createUserWithEmailAndPassword } from "firebase/auth";

interface Props {
    auth: any;
}
type FormData = {
    password: string,
    confirmPassword: string
};

type Ref = BottomSheet;

const ResetPasswordSheet = forwardRef<Ref, Props>((props, ref) => {

    const snapPoints = useMemo(() => ["20%", "75%"], []);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    // Reset password
    const onSubmit = (data: FormData) => {

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
            >
                <BottomSheetView className="items-center">
                    <Text className="text-2xl font-bold text-[#3D00B8] p-4">Password reset</Text>
                    <View style={styles.inputContent}>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="border rounded-2xl p-4"
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
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className="border rounded-2xl p-4"
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
                    <View className="items-center">
                        <TouchableOpacity style={styles.resetBtn} onPress={handleSubmit(onSubmit)}>
                            <Text style={{ color: "#F5F5FF", fontWeight: 600, fontSize: 16 }}>Reset</Text>
                        </TouchableOpacity>
                    </View>
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
    textInput: {
        backgroundColor: "#DEE2FE",
        borderColor: "rgba(61, 0, 184, 0.15)"
    },
    inputContent: {
        marginBottom: 16,
        width: "80%"
    },
    headingText: {
        fontSize: 24,
        fontWeight: 600,
        marginBottom: 10
    },
    resetBtn: {
        alignItems: 'center',
        backgroundColor: '#3D00B8',
        borderRadius: 9,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 10
    },
});

export default ResetPasswordSheet;