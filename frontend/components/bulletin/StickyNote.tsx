import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface StickyNoteProps {
    text?: string; // Made optional for stickers
    color?: string; // Optional for stickers
    style?: ViewStyle;
    imageUri?: string; // For stickers
    isUserPost?: boolean;
    onDelete?: (id: string) => void; // Optional for stickers
    onMove: (x: number, y: number) => void; // Triggered on drag end
    id?: string; // Optional for stickers
}

const StickyNote: React.FC<StickyNoteProps> = ({
    text,
    color,
    style,
    imageUri,
    isUserPost,
    onDelete,
    onMove,
    id,
}) => {
    // Shared values for position
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Gesture handler for drag events
    const dragGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd(() => {
            console.log('Drag ended at:', { x: translateX.value, y: translateY.value });
            if (typeof onMove === 'function') {
                try {
                    onMove(translateX.value, translateY.value);
                } catch (error) {
                    console.error('Error in onMove:', (error as any).message || error);
                }
            } else {
                console.error('onMove is not a function:', onMove);
            }
            translateX.value = withSpring(translateX.value);
            translateY.value = withSpring(translateY.value);
        });

    // Animated style for drag movement
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View
                style={[
                    styles.shadowContainer,
                    animatedStyle,
                    style,
                ]}
            >
                {/* Delete Button for User Posts */}
                {isUserPost && onDelete && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDelete(id!)} // `!` assumes `id` is defined for user posts
                    >
                        <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                )}

                {/* Sticky Note or Sticker Content */}
                <View
                    style={[
                        styles.contentContainer,
                        color && { backgroundColor: color }, // Only for sticky notes
                    ]}
                >
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                        text && <Text style={styles.text}>{text}</Text>
                    )}
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    shadowContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        position: 'absolute',
    },
    contentContainer: {
        width: 160,
        height: 160,
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#1D1D1D',
        textAlign: 'center',
    },
    image: {
        width: 130,
        height: 130,
        resizeMode: 'contain',
    },
    deleteButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 5,
        zIndex: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default StickyNote;
