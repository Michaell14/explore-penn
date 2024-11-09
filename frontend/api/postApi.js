import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api/pins';

const getAuthToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const getTopPins = async () => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/topPins`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching top pins:', error);
        throw error;
    }
};

export const addPin = async (pinData) => {
    const token = await getAuthToken();
    try {
        const response = await axios.post(`${API_BASE_URL}/postPin`, pinData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding pin:', error);
        throw error;
    }
};

export const getPin = async (pinId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/${pinId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching pin details:', error);
        throw error;
    }
};

export const getReactions = async (pinId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/${pinId}/getReactions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching reactions:', error);
        throw error;
    }
};

export const postReaction = async (pinId, reactionData) => {
    const token = await getAuthToken();
    try {
        const response = await axios.post(`${API_BASE_URL}/${pinId}/postReactions`, reactionData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error posting reaction:', error);
        throw error;
    }
};
