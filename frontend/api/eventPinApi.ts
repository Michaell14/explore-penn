import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "@/config";

const API_BASE_URL = baseURL + "/eventPins";

// Helper function to get the auth token
const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("token");
};

// =====================
// Types
// =====================

export interface PinData {
  id?: string;
  header: string;
  description: string;
  loc_description?: string;
  org_id: string;
  coords: [number, number];
  start_time: any;
  end_time: any;
  photo?: string | null;
  isActive?: boolean;
}


interface ImageData {
  images: string[];
  uploadedBy: string;
}

export interface PostData {
  id: string,
  x: number;
  y: number;
  rotation: number;
  words: string;
  picture?: string | null;
  uid: string;
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

const formatTimestamp = (timestamp: { _seconds: number }): string => {
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
});
};


export const fetchCurrentPins = async (): Promise<PinData[]> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<PinData[]> = await axios.get(`${API_BASE_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map(pin => ({
      ...pin,
      start_time: formatTimestamp(pin.start_time),
      end_time: formatTimestamp(pin.end_time),
      photo: pin.photo || null,
    }));
  } catch (error) {
    console.error("Error fetching pins:", error);
    throw error;
  }
};


export const fetchPinsByLocation = async (
  latitude: number,
  longitude: number,
  radius: number
): Promise<PinData[]> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<PinData[]> = await axios.post(
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

export const fetchHistoricalPins = async (): Promise<PinData[]> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<PinData[]> = await axios.get(
      `${API_BASE_URL}/historical`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching historical pins:", error);
    throw error;
  }
};

export const fetchPinDetails = async (pinId: string): Promise<PinData> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<PinData> = await axios.get(
      `${API_BASE_URL}/${pinId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pin details:", error);
    throw error;
  }
};

export const addPin = async (newPinData: PinData): Promise<PinData> => {
  const token = await getAuthToken();
  try {
    const response: AxiosResponse<PinData> = await axios.post(
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
      // headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map((post: PostData) => ({
      ...post,
      id: post.id,
      uid: post.uid || "Unknown",
    }));
  } catch (error) {
    console.error("Error fetching posts for pin:", error);
    throw error;
  }
};

export const addPost = async (
  pinId: string,
  postData: PostData
): Promise<PostData> => {
  const token = await getAuthToken();
  try {
    const response = await axios.post(`${API_BASE_URL}/${pinId}/posts`, postData, {
      // headers: { Authorization: `Bearer ${token}` },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};


export const deletePost = async (pinId: string, postId: string): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    await axios.delete(`${API_BASE_URL}/${pinId}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const movePost = async (
  pinId: string,
  postId: string,
  x: number,
  y: number,
  rotation: number
): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    await axios.post(
      `${API_BASE_URL}/${pinId}/posts/move`,
      { post_id: postId, x, y, rotation },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error moving post:", error);
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

