import { Platform } from "react-native";

// Smart default backend URL:
// - Real Android phone on same Wi-Fi / network: http://192.168.100.240:4000
// - Android Emulator: http://10.0.2.2:4000
// - Web, iOS Simulator, Desktop: http://localhost:4000
const LOCAL_PORT = "4000";
const DEFAULT_URL = "http://192.168.100.240:4000";

export const API_BASE_URL = DEFAULT_URL;

export const isBackendConfigured = () => !!API_BASE_URL;

