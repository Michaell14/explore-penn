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
    text: string;
    color: string;
    style?: ViewStyle;
    imageUri?: string;
    isUserPost?: boolean;
    onDelete: (id: string) => void;
    onMove: (x: number, y: number) => void;
    id: string;
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
                    isUserPost && styles.userPostBorder,
                    animatedStyle,
                    style,
                ]}
            >
                {/* Delete Button for User Posts */}
                {isUserPost && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDelete(id)}
                    >
                        <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                )}

                {/* Sticky Note Content */}
                <View style={[styles.stickyNote, { backgroundColor: color }]}>
                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    )}

                    {text && <Text style={styles.text}>{text}</Text>}
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
        shadowRadius: 2,
        elevation: 3,
        position: 'absolute',
    },
    userPostBorder: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 3,
    },
    stickyNote: {
        width: 120,
        height: 120,
        borderRadius: 3,
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        
    },
    text: {
        fontSize: 10,
        color: '#373737',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 8,
        borderRadius: 5,
        resizeMode: 'cover',
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
