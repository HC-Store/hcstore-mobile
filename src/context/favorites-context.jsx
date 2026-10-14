import React, {
    createContext,
    useContext,
    useMemo,
    useState
} from "react"

const FavoritesContext = createContext(null)

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([])

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
            removeFavorite
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
