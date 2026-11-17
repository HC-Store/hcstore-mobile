import { loadJSON, removeKey, saveJSON } from "./storage"

// URL do back NestJS. Defina EXPO_PUBLIC_API_URL (ex.: https://seu-back.onrender.com/api).
// No emulador Android, localhost é http://10.0.2.2:3000/api
export const API_URL =
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api"

/* ---------- SESSÃO (memória + armazenamento do aparelho) ---------- */

const SESSION_KEY = "@hcstore/session"

let token = null
let currentUser = null
let onUnauthorized = null

export const setToken = (value) => {
    token = value
}

export const getCurrentUser = () => currentUser
export const isLoggedIn = () => !!token

// Chamado quando o back recusa o token (expirado/inválido)
export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler
}

// Lê a sessão salva ao abrir o app. Retorna true se há login válido salvo.
export const restoreSession = async () => {
    const saved = await loadJSON(SESSION_KEY)

    if (saved?.token && saved?.user) {
        token = saved.token
        currentUser = saved.user
        return true
    }

    return false
}

export const logout = () => {
    token = null
    currentUser = null
    removeKey(SESSION_KEY)
}

/* ---------- HTTP ---------- */

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

    if (response.status === 401 && token && path !== "/auth/login") {
        logout()
        onUnauthorized?.()
        throw new Error("Sua sessão expirou. Entre novamente.")
    }

    if (!response.ok) {
        const message = Array.isArray(data?.message)
            ? data.message.join("\n")
            : data?.message
        throw new Error(message || "Erro ao comunicar com o servidor")
    }

    return data
}

/* ---------- AUTH / USUÁRIO ---------- */

export const login = async (email, senha) => {
    const data = await request("/auth/login", { method: "POST", body: { email, senha } })
    setToken(data.access_token)
    currentUser = data.usuario
    await saveJSON(SESSION_KEY, { token, user: currentUser })
    return data
}

export const register = (usuario) =>
    request("/usuarios", { method: "POST", body: usuario })

/* ---------- PRODUTOS ---------- */

// Converte o produto do back para o formato usado pelo app
// (carrinho, favoritos e telas usam name/price/image/images).
export const toProduct = (produto, imagens = []) => {
    const urls = imagens.map((img) => img.url)

    return {
        ...produto,
        id: produto.id,
        name: produto.nome,
        price: Number(produto.preco),
        size: produto.tamanho,
        image: urls[0] ?? null,
        images: urls
    }
}

export const getProdutos = async () => {
    const [produtos, imagens] = await Promise.all([
        request("/produtos"),
        request("/produto-imagem").catch(() => [])
    ])

    return produtos
        .filter((p) => p.ativo !== false)
        .map((p) =>
            toProduct(p, imagens.filter((img) => img.produtoId === p.id))
        )
}

export const getProduto = async (id) => {
    const [produto, imagens] = await Promise.all([
        request(`/produtos/${id}`),
        request(`/produto-imagem/produto/${id}`).catch(() => [])
    ])

    return toProduct(produto, imagens)
}

export const getCategorias = () => request("/categorias")

/* ---------- ENDEREÇOS ---------- */
// O back guarda: rua, numero, cidade, estado, cep.
// Bairro e complemento são gravados junto: rua = "Rua X - Bairro",
// numero = "100 - Apto 82".

const toAddress = (e, index) => {
    const [street, ...neighborhoodParts] = e.rua.split(" - ")
    const [number, ...complementParts] = e.numero.split(" - ")

    return {
        id: String(e.id),
        cep: e.cep,
        street,
        neighborhood: neighborhoodParts.join(" - "),
        number,
        complement: complementParts.join(" - "),
        city: e.cidade,
        state: e.estado,
        primary: index === 0
    }
}

export const getMyEnderecos = async () => {
    const data = await request("/enderecos/meus")
    return data.map(toAddress)
}

export const createEndereco = async (address) => {
    const saved = await request("/enderecos", {
        method: "POST",
        body: {
            usuarioId: currentUser.id,
            rua: address.neighborhood
                ? `${address.street} - ${address.neighborhood}`
                : address.street,
            numero: address.complement
                ? `${address.number} - ${address.complement}`
                : address.number,
            cidade: address.city,
            estado: address.state,
            cep: address.cep
        }
    })

    return saved
}

export const deleteEndereco = (id) =>
    request(`/enderecos/${id}`, { method: "DELETE" })

/* ---------- PEDIDOS ---------- */

export const getMyPedidos = () => request("/pedidos/meus")

// Finaliza a compra. O app envia só os itens; o back confere preço, estoque
// e cupom, cria o pedido e baixa o estoque.
// items: [{ id, quantity }]  (formato do carrinho)
export const finalizarPedido = ({ enderecoId, items, cupomCodigo }) =>
    request("/pedidos/checkout", {
        method: "POST",
        body: {
            enderecoId,
            cupomCodigo: cupomCodigo || null,
            items: items.map((item) => ({
                produtoId: item.id,
                quantidade: item.quantity
            }))
        }
    })

/* ---------- CUPOM / PAGAMENTO / CONFIG DO SITE ---------- */

// -> { cupomId, codigo, desconto }
export const validarCupom = (codigo, subtotal) =>
    request("/cupons/validar", { method: "POST", body: { codigo, subtotal } })

// -> { paymentUrl }  (página de pagamento do PagBank)
export const criarPagamento = (pedidoId) =>
    request("/pagamentos/checkout", { method: "POST", body: { pedidoId } })

export const getSiteConfig = () => request("/site-config")
