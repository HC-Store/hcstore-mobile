import {
    createContext,
    useContext,
    useState
} from "react"


const CartContext = createContext()


export const CartProvider = ({ children }) => {

    const [cartOpen, setCartOpen] = useState(false)
    const [cartItems, setCartItems] = useState([])


    // ABRIR CARRINHO
    const openCart = () => {
        setCartOpen(true)
    }


    // FECHAR CARRINHO
    const closeCart = () => {
        setCartOpen(false)
    }


    // ADICIONAR PRODUTO
    const addToCart = (product) => {

        setCartItems((currentItems) => {

            const productAlreadyExists =
                currentItems.find(
                    item => item.id === product.id
                )


            // SE JÁ EXISTIR, AUMENTA A QUANTIDADE
            if (productAlreadyExists) {

                return currentItems.map(item => {

                    if (item.id === product.id) {

                        return {
                            ...item,
                            quantity: item.quantity + 1
                        }

                    }

                    return item

                })

            }


            // SE NÃO EXISTIR, ADICIONA
            return [
                ...currentItems,
                {
                    ...product,
                    quantity: 1
                }
            ]

        })

    }


    // AUMENTAR QUANTIDADE
    const increaseQuantity = (productId) => {

        setCartItems((currentItems) =>

            currentItems.map(item => {

                if (item.id === productId) {

                    return {
                        ...item,
                        quantity: item.quantity + 1
                    }

                }

                return item

            })

        )

    }


    // DIMINUIR QUANTIDADE
    const decreaseQuantity = (productId) => {

        setCartItems((currentItems) =>

            currentItems
                .map(item => {

                    if (item.id === productId) {

                        return {
                            ...item,
                            quantity: item.quantity - 1
                        }

                    }

                    return item

                })
                .filter(item => item.quantity > 0)

        )

    }


    // REMOVER PRODUTO
    const removeFromCart = (productId) => {

        setCartItems((currentItems) =>

            currentItems.filter(
                item => item.id !== productId
            )

        )

    }


    return (

        <CartContext.Provider
            value={{
                cartOpen,
                cartItems,

                openCart,
                closeCart,

                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart
            }}
        >

            {children}

        </CartContext.Provider>

    )
}


export const useCart = () => {

    return useContext(CartContext)

}
