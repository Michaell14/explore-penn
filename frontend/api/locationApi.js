import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/loc';

export const getLocation = async (locationId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getLocation/${locationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
};

export const getRandomFunFact = async (locationId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getRandomFunFact/${locationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching random fun fact:', error);
        throw error;
    }
};

export const getAllLocations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllLocations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all locations:', error);
        throw error;
    }
};
