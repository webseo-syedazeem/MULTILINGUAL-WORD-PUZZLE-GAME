import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "word_connect_auth_token_v1";

export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export async function setToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // ignore
  }
}

export async function clearToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}
