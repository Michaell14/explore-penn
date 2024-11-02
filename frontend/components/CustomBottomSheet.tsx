import { Text, StyleSheet } from 'react-native'
import React, { forwardRef, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

interface Props {
    title: string;
}

type Ref = BottomSheet;

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {

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
                <Text>{props.title}</Text>
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

export default CustomBottomSheet