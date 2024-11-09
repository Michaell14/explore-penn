import AsyncStorage from '@react-native-async-storage/async-storage';

import baseURL from '../config.js';
const getAuthToken = async () => {
    return await AsyncStorage.getItem('token'); // Retrieve the stored token
};

export const fetchLocations = async () => {
    const token = await getAuthToken();
    const response = await fetch(`${baseURL}/locations`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch locations');
    }

    return await response.json();
};

export const addLocation = async (locationData) => {
    const token = await getAuthToken();
    const response = await fetch(`${baseURL}/locations`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
    });

    if (!response.ok) {
        throw new Error('Failed to add location');
    }

    return await response.text();
};

export const fetchPosts = async () => {
    const token = await getAuthToken();
    const response = await fetch(`${baseURL}/posts`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }

    return await response.json();
};

export const addPost = async (postData) => {
    const token = await getAuthToken();
    const response = await fetch(`${baseURL}/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        throw new Error('Failed to add post');
    }

    return await response.text();
};
