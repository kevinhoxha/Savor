import AsyncStorage from '@react-native-async-storage/async-storage'
import { convertTimestamps, revertTimestamps } from './helperFunctions'

const cache = {
  async set(key, value, ttl = 3600) {
    // Default TTL: 3600 seconds (1 hour)
    const now = new Date().getTime()
    const expires = now + ttl * 1000 // Convert TTL to milliseconds

    const item = {
      value: convertTimestamps(value),
      expires,
    }

    try {
      const jsonValue = JSON.stringify(item)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      console.error('Error saving to cache', e)
    }
  },
  async get(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      if (jsonValue != null) {
        const item = JSON.parse(jsonValue)
        item.value = revertTimestamps(item.value)
        const now = new Date().getTime()

        if (now < item.expires) {
          return {
            ...item.value,
            data: () => item.value['data'],
            exists: () => true,
          }
        }

        await this.remove(key)
      }
    } catch (e) {
      console.error('Error reading from cache', e)
    }

    return null
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      console.error('Error removing from cache', e)
    }
  },
}

export default cache
