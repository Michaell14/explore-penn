import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = `${baseURL}/api/loc`;

const getAuthToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const getLocation = async (locationId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/getLocation/${locationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
};

export const getRandomFunFact = async (locationId) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/getRandomFunFact/${locationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching random fun fact:', error);
        throw error;
    }
};

export const getAllLocations = async () => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllLocations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all locations:', error);
        throw error;
    }
};
