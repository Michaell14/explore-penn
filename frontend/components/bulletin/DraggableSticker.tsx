import React from 'react';
import { Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface DraggableStickerProps {
    id: string;
    uri: any;
    x: number;
    y: number;
    onMove: (id: string, x: number, y: number) => void;
}

const DraggableSticker: React.FC<DraggableStickerProps> = ({
    id,
    uri,
    x,
    y,
    onMove,
}) => {
    const translateX = useSharedValue(x);
    const translateY = useSharedValue(y);

    const dragGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = x + event.translationX;
            translateY.value = y + event.translationY;
        })
        .onEnd(() => {
            onMove(id, translateX.value, translateY.value);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.Image
                source={uri}
                style={[
                    {
                        position: 'absolute',
                        width: 'auto',
                        height: 50,
                        resizeMode: 'contain',
                    },
                    animatedStyle,
                ]}
            />
        </GestureDetector>
    );
};

export default DraggableSticker;
