import Constants from "expo-constants";

const { extra } = Constants.expoConfig;

// export const baseURL = extra?.baseURL || "http://10.102.135.175:3000/api";
export const baseURL = "http://10.102.68.50:3000/api";
export const webClientId = extra?.webClientId || "";
export const iosClientId = extra?.iosClientId || "";
export const androidClientId = extra?.androidClientId || "";
