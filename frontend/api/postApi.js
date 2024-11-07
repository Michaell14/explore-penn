import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/pins';

export const getTopPins = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/topPins`);
        return response.data;
    } catch (error) {
        console.error('Error fetching top pins:', error);
        throw error;
    }
};

export const addPin = async (pinData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/postPin`, pinData);
        return response.data;
    } catch (error) {
        console.error('Error adding pin:', error);
        throw error;
    }
};

export const getPin = async (pinId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${pinId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pin details:', error);
        throw error;
    }
};

export const getReactions = async (pinId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${pinId}/getReactions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reactions:', error);
        throw error;
    }
};

export const postReaction = async (pinId, reactionData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${pinId}/postReactions`, reactionData);
        return response.data;
    } catch (error) {
        console.error('Error posting reaction:', error);
        throw error;
    }
};
