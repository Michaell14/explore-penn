import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StickyNoteProps {
    text: string;
    color: string; // Background color for the sticky note
}

const StickyNote: React.FC<StickyNoteProps> = ({ text, color }) => {
    return (
        <View style={[styles.stickyNote, { backgroundColor: color }]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    stickyNote: {
        width: 100,
        height: 100,
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3, // For Android shadow
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        color: '#373737',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default StickyNote;
