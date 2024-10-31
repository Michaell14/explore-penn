import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001'; // Change this if needed based on your setup

const getAuthToken = async () => {
    return await AsyncStorage.getItem('token'); // Retrieve the stored token
};

export const fetchLocations = async () => {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/locations`, {
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
    const response = await fetch(`${API_BASE_URL}/locations`, {
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
    const response = await fetch(`${API_BASE_URL}/posts`, {
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
    const response = await fetch(`${API_BASE_URL}/posts`, {
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
