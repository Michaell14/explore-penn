import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.102.109.239:3000/api/users';

const getAuthToken = async () => {
    return await AsyncStorage.getItem('token');
};

// Register a new user
export const registerUser = async (userData) => {
    const token = await getAuthToken();
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Get posts created by the user
export const getMyPosts = async (userId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/myPosts/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

// Get posts reacted to by the user
export const getReactedPosts = async (userId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/myReactions/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching reacted posts:', error);
        throw error;
    }
};

// Get top posts of the user
export const getTopPins = async (userId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/myTopPosts/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.topPosts;
    } catch (error) {
        console.error('Error fetching top posts:', error);
        throw error;
    }
};
