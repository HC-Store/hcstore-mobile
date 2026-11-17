import AsyncStorage from "@react-native-async-storage/async-storage"

// Todas as funções engolem erros: se o armazenamento falhar, o app segue
// funcionando (apenas sem persistência).

export const loadJSON = async (key, fallback = null) => {
    try {
        const raw = await AsyncStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

export const saveJSON = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch {}
}

export const removeKey = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch {}
}
