import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"

import { loadJSON, saveJSON } from "../services/storage"

const CART_KEY = "@hcstore/cart"

const CartContext = createContext(null)

/* ------------------------------------------------------------------ */
/*  AJUDANTES                                                          */
/* ------------------------------------------------------------------ */

// Garante que todo item tenha id, nome, preço numérico e quantidade válida
const normalizeItem = (product, quantity = 1) => ({
    ...product,
    id: product.id ?? product._id,
    name: product.name ?? product.nome ?? "Produto HC Store",
    price: Number(product.price ?? product.preco ?? 0) || 0,
    quantity: Math.max(1, Math.floor(Number(quantity) || 1))
})

// Limpa o que veio salvo no aparelho (remove itens quebrados)
const sanitizeSaved = (saved) =>
    Array.isArray(saved)
        ? saved
              .filter((item) => item && (item.id ?? item._id) != null && Number(item.quantity) > 0)
              .map((item) => normalizeItem(item, item.quantity))
        : []

/* ------------------------------------------------------------------ */
/*  PROVIDER                                                           */
/* ------------------------------------------------------------------ */

export const CartProvider = ({ children }) => {
    const [cartOpen, setCartOpen] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [ready, setReady] = useState(false)
    const loaded = useRef(false)

    // Recupera o carrinho salvo no aparelho
    useEffect(() => {
        loadJSON(CART_KEY, [])
            .then((saved) => {
                const items = sanitizeSaved(saved)
                if (items.length > 0) {
                    // Se o usuário já adicionou algo enquanto carregava, mantém o atual
                    setCartItems((current) => (current.length === 0 ? items : current))
                }
            })
            .catch(() => {})
            .finally(() => {
                loaded.current = true
                setReady(true)
            })
    }, [])

    // Salva a cada mudança (só depois de ler o que estava salvo)
    useEffect(() => {
        if (loaded.current) {
            saveJSON(CART_KEY, cartItems)
        }
    }, [cartItems, ready])

    /* ---------- ABRIR / FECHAR ---------- */

    const openCart = useCallback(() => setCartOpen(true), [])
    const closeCart = useCallback(() => setCartOpen(false), [])

    /* ---------- ADICIONAR ---------- */

    // addToCart(produto)          -> +1
    // addToCart(produto, 3)       -> +3
    const addToCart = useCallback((product, quantity = 1) => {
        if (!product) return

        const novo = normalizeItem(product, quantity)

        setCartItems((current) => {
            const existe = current.some((item) => item.id === novo.id)

            if (existe) {
                return current.map((item) =>
                    item.id === novo.id
                        ? { ...item, quantity: item.quantity + novo.quantity }
                        : item
                )
            }

            return [...current, novo]
        })
    }, [])

    /* ---------- QUANTIDADE ---------- */

    const increaseQuantity = useCallback((productId) => {
        setCartItems((current) =>
            current.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        )
    }, [])

    const decreaseQuantity = useCallback((productId) => {
        setCartItems((current) =>
            current
                .map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        )
    }, [])

    // Define a quantidade exata (0 remove o item)
    const updateQuantity = useCallback((productId, quantity) => {
        const q = Math.floor(Number(quantity) || 0)

        setCartItems((current) =>
            q <= 0
                ? current.filter((item) => item.id !== productId)
                : current.map((item) => (item.id === productId ? { ...item, quantity: q } : item))
        )
    }, [])

    /* ---------- REMOVER / LIMPAR ---------- */

    const removeFromCart = useCallback((productId) => {
        setCartItems((current) => current.filter((item) => item.id !== productId))
    }, [])

    const clearCart = useCallback(() => setCartItems([]), [])

    /* ---------- CONSULTAS ---------- */

    const isInCart = useCallback(
        (productId) => cartItems.some((item) => item.id === productId),
        [cartItems]
    )

    const getQuantity = useCallback(
        (productId) => cartItems.find((item) => item.id === productId)?.quantity ?? 0,
        [cartItems]
    )

    /* ---------- TOTAIS ---------- */

    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    )

    const subtotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    )

    /* ---------- VALOR DO CONTEXTO ---------- */

    const value = useMemo(
        () => ({
            ready,
            cartOpen,
            cartItems,
            cartCount,
            subtotal,

            openCart,
            closeCart,

            addToCart,
            increaseQuantity,
            decreaseQuantity,
            updateQuantity,
            removeFromCart,
            clearCart,

            isInCart,
            getQuantity
        }),
        [
            ready,
            cartOpen,
            cartItems,
            cartCount,
            subtotal,
            openCart,
            closeCart,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            updateQuantity,
            removeFromCart,
            clearCart,
            isInCart,
            getQuantity
        ]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/* ------------------------------------------------------------------ */
/*  HOOK                                                               */
/* ------------------------------------------------------------------ */

export const useCart = () => {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error("useCart precisa estar dentro de <CartProvider>.")
    }

    return context
}