import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';

interface StickyNoteProps {
    text: string;
    color: string;
    style?: ViewStyle;
    imageUri?: string;
}

const StickyNote: React.FC<StickyNoteProps> = ({ text, color, style, imageUri }) => {
    // console.log('Rendering StickyNote:');
    // console.log('Text:', text);
    // console.log('Color:', color);
    // console.log('Image URI:', imageUri);

    return (
        <View style={[styles.stickyNote, { backgroundColor: color }, style]}>
            {/* Render the image if imageUri is defined */}
            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    style={{
                        width: 80,
                        height: 80,
                        marginBottom: text ? 8 : 0,
                        borderRadius: 5,
                        resizeMode: 'cover',
                    }}
                />
            ) : null}

            {/* Render the text if it exists */}
            {text ? <Text style={styles.text}>{text}</Text> : null}
        </View>
    );
};


const styles = StyleSheet.create({
    stickyNote: {
        width: 120,
        height: 120,
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3, 
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    text: {
        fontSize: 8,
        color: '#373737',
        textAlign: 'center',
    },
});

export default StickyNote;
