import { Text, StyleSheet } from 'react-native'
import React, { forwardRef, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { PinData } from '@/api/eventPinApi';
  
interface Props {
    pin: PinData | null;
}

type Ref = BottomSheet;

const PinBottomSheet = forwardRef<Ref, Props>((props, ref) => {

    const pin = props.pin;
    
    const snapPoints = useMemo(() => ["25%", "50%", "70%", "100%"], [])

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <BottomSheet
            ref={ref}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            index = {1}
            >
            <BottomSheetView style={styles.contentContainer}>
                <Text>{pin?.header}</Text>
                <Text>{pin?.loc_description}</Text>
                <Text>{pin?.start_time}</Text>
                <Text>{pin?.end_time}</Text>
                <Text>{pin?.description}</Text>
            </BottomSheetView>
        </BottomSheet>
    )
});

const styles = StyleSheet.create({

    contentContainer: {
      flex: 1,
      padding: 36,
      alignItems: 'center',
    },
});

export default PinBottomSheet;