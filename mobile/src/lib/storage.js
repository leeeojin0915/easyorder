import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get(key) {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    return { key, value };
  },
  async set(key, value) {
    await AsyncStorage.setItem(key, value);
    return { key, value };
  },
  async delete(key) {
    const existed = (await AsyncStorage.getItem(key)) !== null;
    await AsyncStorage.removeItem(key);
    return { key, deleted: existed };
  },
};
