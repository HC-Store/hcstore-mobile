import { Modal, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import { useCart } from "../../context/cart-context"

import {
    Overlay,
    Drawer,
    CartHeader,
    CartTitle,
    CloseButton,
    Content,
    ProductCard,
    ProductImage,
    ProductInfo,
    ProductName,
    ProductDetails,
    ProductPrice,
    QuantityContainer,
    QuantityButton,
    QuantityText,
    RemoveButton,
    Summary,
    SummaryRow,
    SummaryLabel,
    SummaryValue,
    TotalLabel,
    TotalValue,
    CheckoutButton,
    CheckoutButtonText,
    EmptyCart,
    EmptyCartIcon,
    EmptyCartTitle,
    EmptyCartText
} from "./style"


const Cart = () => {

    const navigation = useNavigation()

    const {
        cartOpen,
        cartItems,
        closeCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart
    } = useCart()


    const subtotal = cartItems.reduce(
        (total, product) =>
            total + product.price * product.quantity,
        0
    )


    const goToCheckout = () => {

        closeCart()

        navigation.navigate("Checkout")
    }


    const cartIsEmpty = cartItems.length === 0


    return (

        <Modal
            visible={cartOpen}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={closeCart}
        >

            <Overlay>

                <Pressable
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    }}
                    onPress={closeCart}
                />


                <Drawer>

                    <CartHeader>

                        <CartTitle>
                            Sua sacola
                        </CartTitle>


                        <CloseButton
                            onPress={closeCart}
                        >

                            <Ionicons
                                name="close"
                                size={25}
                                color="#FFFFFF"
                            />

                        </CloseButton>

                    </CartHeader>


                    <Content
                        showsVerticalScrollIndicator={false}
                    >

                        {cartIsEmpty ? (

                            <EmptyCart>

                                <EmptyCartIcon>

                                    <Ionicons
                                        name="bag-outline"
                                        size={45}
                                        color="#777777"
                                    />

                                </EmptyCartIcon>


                                <EmptyCartTitle>
                                    Sua sacola está vazia
                                </EmptyCartTitle>


                                <EmptyCartText>
                                    Adicione produtos para continuar comprando.
                                </EmptyCartText>

                            </EmptyCart>

                        ) : (

                            <>

                                {cartItems.map(product => (

                                    <ProductCard
                                        key={product.id}
                                    >

                                        <ProductImage>
                                            IMAGEM
                                        </ProductImage>


                                        <ProductInfo>

                                            <RemoveButton
                                                onPress={() =>
                                                    removeFromCart(product.id)
                                                }
                                                hitSlop={{
                                                    top: 15,
                                                    bottom: 15,
                                                    left: 15,
                                                    right: 15
                                                }}
                                            >

                                                <Ionicons
                                                    name="trash-outline"
                                                    size={20}
                                                    color="#999999"
                                                />

                                            </RemoveButton>


                                            <ProductName>
                                                {product.name}
                                            </ProductName>


                                            <ProductDetails>
                                                Tamanho: {product.size}
                                            </ProductDetails>


                                            <QuantityContainer>

                                                <QuantityButton
                                                    onPress={() =>
                                                        decreaseQuantity(product.id)
                                                    }
                                                >

                                                    <Ionicons
                                                        name="remove"
                                                        size={15}
                                                        color="#FFFFFF"
                                                    />

                                                </QuantityButton>


                                                <QuantityText>
                                                    {product.quantity}
                                                </QuantityText>


                                                <QuantityButton
                                                    onPress={() =>
                                                        increaseQuantity(product.id)
                                                    }
                                                >

                                                    <Ionicons
                                                        name="add"
                                                        size={15}
                                                        color="#FFFFFF"
                                                    />

                                                </QuantityButton>

                                            </QuantityContainer>


                                            <ProductPrice>

                                                R$ {
                                                    product.price
                                                        .toFixed(2)
                                                        .replace(".", ",")
                                                }

                                            </ProductPrice>

                                        </ProductInfo>

                                    </ProductCard>

                                ))}


                                <Summary>

                                    <SummaryRow>

                                        <SummaryLabel>
                                            Subtotal
                                        </SummaryLabel>

                                        <SummaryValue>

                                            R$ {
                                                subtotal
                                                    .toFixed(2)
                                                    .replace(".", ",")
                                            }

                                        </SummaryValue>

                                    </SummaryRow>


                                    <SummaryRow>

                                        <SummaryLabel>
                                            Frete
                                        </SummaryLabel>

                                        <SummaryValue>
                                            Calculado no checkout
                                        </SummaryValue>

                                    </SummaryRow>


                                    <SummaryRow>

                                        <TotalLabel>
                                            Total
                                        </TotalLabel>

                                        <TotalValue>

                                            R$ {
                                                subtotal
                                                    .toFixed(2)
                                                    .replace(".", ",")
                                            }

                                        </TotalValue>

                                    </SummaryRow>


                                    <CheckoutButton
                                        onPress={goToCheckout}
                                    >

                                        <CheckoutButtonText>
                                            FINALIZAR COMPRA
                                        </CheckoutButtonText>

                                    </CheckoutButton>

                                </Summary>

                            </>

                        )}

                    </Content>

                </Drawer>

            </Overlay>

        </Modal>

    )
}


export default Cart