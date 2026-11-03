// URL do back NestJS. Defina EXPO_PUBLIC_API_URL (ex.: https://seu-back.onrender.com/api).
// No emulador Android, localhost é http://10.0.2.2:3000/api
export const API_URL =
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api"

let token = null

export const setToken = (value) => {
    token = value
}

async function request(path, { method = "GET", body } = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = Array.isArray(data?.message)
            ? data.message.join("\n")
            : data?.message
        throw new Error(message || "Erro ao comunicar com o servidor")
    }

    return data
}

export const login = async (email, senha) => {
    const data = await request("/auth/login", { method: "POST", body: { email, senha } })
    setToken(data.access_token)
    return data
}

export const register = (usuario) =>
    request("/usuarios", { method: "POST", body: usuario })

export const getProdutos = () => request("/produtos")
export const getProduto = (id) => request(`/produtos/${id}`)
export const getCategorias = () => request("/categorias")
