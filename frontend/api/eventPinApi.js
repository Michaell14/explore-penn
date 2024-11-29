// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://localhost:3000/api/eventPins';

// const getAuthToken = async () => {
//   return await AsyncStorage.getItem('token');
// };

// export const fetchCurrentEventPins = async () => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.get(`${API_BASE_URL}/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching eventPins:', error);
//     throw error;
//   }
// };

// export const fetchHistoricalEventPins = async (beforeDate) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.get(`${API_BASE_URL}/historical`, {
//       headers: { Authorization: `Bearer ${token}` },
//       params: { beforeDate },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching historical eventPins:', error);
//     throw error;
//   }
// };

// export const fetchEventPinDetails = async (eventPinId) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.get(`${API_BASE_URL}/${eventPinId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching eventPin details:', error);
//     throw error;
//   }
// };

// export const fetchEventPinPosts = async (eventPinId) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.get(`${API_BASE_URL}/${eventPinId}/posts`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching posts for eventPin:', error);
//     throw error;
//   }
// };

// export const createEventPin = async (newEventPinData) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.post(`${API_BASE_URL}/`, newEventPinData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error adding eventPin:', error);
//     throw error;
//   }
// };

// export const createEventPinPost = async (eventPinId, newPostData) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.post(`${API_BASE_URL}/${eventPinId}/posts`, newPostData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error adding post to eventPin:', error);
//     throw error;
//   }
// };

// export const moveEventPinPost = async (eventPinId, postId, newCoords) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/${eventPinId}/posts/move`,
//       { post_id: postId, ...newCoords },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error moving post for eventPin:', error);
//     throw error;
//   }
// };

// export const fetchEventPinsByLocation = async (latitude, longitude, radius) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/location`,
//       { latitude, longitude, radius },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching eventPins by location:', error);
//     throw error;
//   }
// };

// export const deleteEventPin = async (eventPinId) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/${eventPinId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting eventPin:', error);
//     throw error;
//   }
// };

// export const deleteEventPinPost = async (eventPinId, postId) => {
//   const token = await getAuthToken();
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/${eventPinId}/posts/${postId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting post from eventPin:', error);
//     throw error;
//   }
// };
