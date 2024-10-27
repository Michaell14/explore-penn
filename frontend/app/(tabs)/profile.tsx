import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen() {
    //edit mode toggle
    const [isEditable, setIsEditable] = useState(false);

    return (
        <View style={styles.container}>
            {/* header section */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Profile</Text>
                <View style={styles.profilePicContainer}>
                    <Image
                        // placeholder until dslaysigners mary and ruth cook
                        source={{ uri: 'https://via.placeholder.com/100' }}
                        style={styles.profilePic}
                    />
                    <TouchableOpacity style={styles.editIcon}>
                        <Icon name="pencil" size={16} color="#333" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.profileName}>michael meowli</Text>
                <Text style={styles.profileEmail}>email@school.upenn.edu</Text>
            </View>

            {/* account section */}
            <View style={styles.accountContainer}>
                <View style={styles.accountHeader}>
                    <Text style={styles.accountTitle}>My Account</Text>
                    <TouchableOpacity onPress={() => setIsEditable(!isEditable)}>
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    editable={isEditable}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    editable={isEditable}
                />

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// im leaving the stylesheet in the same file unless we wanna make a separate styles folder !
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#d3d3d3',
        paddingBottom: 32,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    profilePicContainer: {
        position: 'relative',
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#aaa',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
    },
    editIconText: {
        fontSize: 16,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 8,
    },
    profileEmail: {
        fontSize: 16,
        color: '#666',
    },
    accountContainer: {
        flex: 1,
        padding: 24,
    },
    accountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    accountTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editButton: {
        fontSize: 16,
        color: '#007bff',
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    logoutButton: {
        backgroundColor: '#d3d3d3',
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
