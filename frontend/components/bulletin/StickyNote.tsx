import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';

interface StickyNoteProps {
    id: string;
    isUserPost: boolean;
    text: string;
    color: string;
    style?: ViewStyle;
    imageUri?: string;
}

const StickyNote: React.FC<StickyNoteProps> = ({ id, isUserPost, text, color, style, imageUri }) => {
    return (
        <View
            style={[
                styles.shadowContainer,
                isUserPost && styles.userPostBorder,
                style,
            ]}
        >
            <View style={[styles.stickyNote, { backgroundColor: color }]}>
                {imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                    />
                )}

                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shadowContainer: {
        width: 120,
        height: 120,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'visible', // Ensure shadow is visible
    },
    stickyNote: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Clip overflowing content inside the sticky note
    },
    text: {
        fontSize: 8,
        color: '#373737',
        textAlign: 'center',
    },
    userPostBorder: {
        borderWidth: 2,
        borderColor: '#8C7DFF',
        borderStyle: 'dotted',
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 8,
        borderRadius: 5,
        resizeMode: 'cover',
    },
});

export default StickyNote;
