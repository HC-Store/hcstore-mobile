import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"

import { loadJSON, saveJSON } from "../services/storage"

const FAVORITES_KEY = "@hcstore/favorites"

const FavoritesContext = createContext(null)

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([])
    const loaded = useRef(false)

    useEffect(() => {
        loadJSON(FAVORITES_KEY, []).then((saved) => {
            if (Array.isArray(saved) && saved.length > 0) {
                setFavorites((current) => (current.length === 0 ? saved : current))
            }
            loaded.current = true
        })
    }, [])

    useEffect(() => {
        if (loaded.current) {
            saveJSON(FAVORITES_KEY, favorites)
        }
    }, [favorites])

    const clearFavorites = () => setFavorites([])

    const getProductId = (product) =>
        product?.id ?? product?._id

    const isFavorite = (id) =>
        favorites.some(
            (product) => String(getProductId(product)) === String(id)
        )

    const toggleFavorite = (product) => {
        const id = getProductId(product)

        if (id === undefined || id === null) {
            console.warn("Produto sem ID não pode ser favoritado.")
            return
        }

        setFavorites((current) => {
            const exists = current.some(
                (item) =>
                    String(getProductId(item)) === String(id)
            )

            if (exists) {
                return current.filter(
                    (item) =>
                        String(getProductId(item)) !== String(id)
                )
            }

            return [...current, product]
        })
    }

    const removeFavorite = (id) => {
        setFavorites((current) =>
            current.filter(
                (product) =>
                    String(getProductId(product)) !== String(id)
            )
        )
    }

    const value = useMemo(
        () => ({
            favorites,
            isFavorite,
            toggleFavorite,
            removeFavorite,
            clearFavorites
        }),
        [favorites]
    )

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext)

    if (!context) {
        throw new Error(
            "useFavorites precisa estar dentro de FavoritesProvider"
        )
    }

    return context
}
