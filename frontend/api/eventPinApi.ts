import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:3000/api/eventPins";

// Helper function to get the auth token
const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("token");
};

// =====================
// Types
// =====================
interface Coordinate {
  lat: number;
  lng: number;
}

interface Pin {
  id?: string;
  header: string;
  description: string;
  loc_description?: string;
  org_id: string;
  coordinate: Coordinate;
  start_time: string;
  end_time: string;
  photo?: string | null;
  isActive?: boolean;
}

interface ImageData {
  images: string[];
  uploadedBy: string;
}

interface PostData {
  x: number;
  y: number;
  rotation: number;
  words: string;
  picture?: string | null;
}

interface StickerData {
  x: number;
  y: number;
  rotation: number;
  type: string;
}

interface PositionData {
  x: number;
  y: number;
  rotation: number;
}

// =====================
// Pins APIs
// =====================

export const fetchCurrentPins = async (): Promise<Pin[]> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<Pin[]> = await axios.get(`${API_BASE_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pins:", error);
    throw error;
  }
};

export const fetchPinsByLocation = async (
  latitude: number,
  longitude: number,
  radius: number
): Promise<Pin[]> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<Pin[]> = await axios.post(
      `${API_BASE_URL}/location`,
      { latitude, longitude, radius },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pins by location:", error);
    throw error;
  }
};

export const fetchHistoricalPins = async (): Promise<Pin[]> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<Pin[]> = await axios.get(
      `${API_BASE_URL}/historical`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching historical pins:", error);
    throw error;
  }
};

export const fetchPinDetails = async (pinId: string): Promise<Pin> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<Pin> = await axios.get(
      `${API_BASE_URL}/${pinId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pin details:", error);
    throw error;
  }
};

export const addPin = async (newPinData: Pin): Promise<Pin> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<Pin> = await axios.post(
      `${API_BASE_URL}/`,
      newPinData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding pin:", error);
    throw error;
  }
};

export const deletePin = async (pinId: string): Promise<void> => {
  const token = await getAuthToken();
  try {
    await axios.delete(`${API_BASE_URL}/${pinId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting pin:", error);
    throw error;
  }
};

export const archivePin = async (pinId: string): Promise<void> => {
  const token = await getAuthToken();
  try {
    await axios.delete(`${API_BASE_URL}/${pinId}/archive`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error archiving pin:", error);
    throw error;
  }
};

// =====================
// Images APIs
// =====================

export const addPinImages = async (
  pinId: string,
  imageData: ImageData
): Promise<void> => {
  const token = await getAuthToken();
  try {
    await axios.post(`${API_BASE_URL}/${pinId}/images`, imageData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error adding images to pin:", error);
    throw error;
  }
};

export const fetchPinImages = async (
  pinId: string
): Promise<{ id: string; imageUrl: string; uploadedBy: string }[]> => {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/${pinId}/images`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images for pin:", error);
    throw error;
  }
};

export const deletePinImage = async (
  pinId: string,
  imageId: string
): Promise<void> => {
  const token = await getAuthToken();
  try {
    await axios.delete(`${API_BASE_URL}/${pinId}/images/${imageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting image from pin:", error);
    throw error;
  }
};

// =====================
// Posts APIs
// =====================

export const fetchPosts = async (
  pinId: string
): Promise<PostData[]> => {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/${pinId}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts for pin:", error);
    throw error;
  }
};

export const addPost = async (
  pinId: string,
  postData: PostData
): Promise<void> => {
  const token = await getAuthToken();
  try {
    await axios.post(`${API_BASE_URL}/${pinId}/posts`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

// =====================
// Stickers APIs
// =====================

export const fetchStickers = async (
  pinId: string
): Promise<StickerData[]> => {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/${pinId}/stickers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stickers:", error);
    throw error;
  }
};

export const addSticker = async (
  pinId: string,
  stickerData: StickerData
): Promise<void> => {
  const token = await getAuthToken();
  try {
    await axios.post(`${API_BASE_URL}/${pinId}/stickers`, stickerData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error adding sticker:", error);
    throw error;
  }
};
