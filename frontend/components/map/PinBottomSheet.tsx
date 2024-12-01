import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { forwardRef, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { PinData } from '@/api/eventPinApi';

interface Props {
    pin: PinData | null;
}

type Ref = BottomSheet;

const PinBottomSheet = forwardRef<Ref, Props>((props, ref) => {

    const pin = props.pin;

    const snapPoints = useMemo(() => ["25%", "50%", "70%"], [])

    const onPressViewBoard = async (): Promise<void> => {
    }


    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <BottomSheet
            ref={ref}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            index={-1}
            enablePanDownToClose={true}
            backgroundStyle={{ backgroundColor: "#F2F3FD" }}
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text style={styles.header}>{pin?.header}</Text>

                <View style={styles.hr}>
                    <Text style={styles.locDescription}>{pin?.loc_description}</Text>
                </View>
                <Text style={styles.time}>{pin?.start_time} - {pin?.end_time}</Text>
                <Text style={styles.description}>{pin?.description}</Text>
                <TouchableOpacity className="bg-[#F2F3FD] mt-4 p-5 items-left flex-row" onPress={onPressViewBoard}>
                    <Image source={require("../../assets/images/down-arrow.png")} style={styles.viewBoardIcon} />
                    <Text className="text-lg text-[#3D00B8]">View Board</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    )
});

const styles = StyleSheet.create({

    contentContainer: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
        backgroundColor: "#F2F3FD"
    },
    header: {
        color: "#3D00B8",
        fontWeight: 600,
        fontSize: 24,
        marginTop: -15,
    },
    hr: {
        borderBottomColor: '#D6D6D6',
        borderBottomWidth: 1,
        marginTop: 30,
        marginBottom: 30,
        width: "130%",
        alignItems: "center"
    },
    description: {
        fontSize: 16,
        marginTop: 20,
    },
    locDescription: {
        backgroundColor: "#EF6A56",
        color: "white",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 25,
        position: "absolute",
        marginTop: -12,
        fontSize: 16,
    },
    time: {
        fontSize: 18,
        marginTop: 10
    },
    viewBoardIcon: {
        width: 26,
        height: 26,
        marginLeft: 0,
        marginRight: 6,
    },
});

export default PinBottomSheet;