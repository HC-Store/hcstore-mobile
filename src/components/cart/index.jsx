import { useEffect, useRef, useState } from "react"
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    Modal,
    Platform,
    Pressable,
    StatusBar
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"

import { useCart } from "../../context/cart-context"

/* ================================================================== */
/*  TEMA                                                               */
/* ================================================================== */

const BG = "#0A0A0A"
const SURFACE = "#111111"
const SURFACE_2 = "#171717"
const BORDER = "#222222"
const ACCENT = "#00E640"
const TEXT = "#F5F5F5"
const MUTED = "#8C8C8C"
const FAINT = "#4A4A4A"
const DANGER = "#FF5A5F"

const { width } = Dimensions.get("window")
const DRAWER_WIDTH = Math.min(width * 0.88, 420)
const TOP_SPACE = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 50

const formatPrice = (value) =>
    `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`

/* ================================================================== */
/*  COMPONENTE                                                         */
/* ================================================================== */

const Cart = () => {
    const navigation = useNavigation()

    const {
        cartOpen,
        cartItems,
        cartCount,
        subtotal: subtotalCtx,
        closeCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart
    } = useCart()

    // Usa os totais do contexto; se não existirem, calcula aqui
    const subtotal =
        subtotalCtx ??
        cartItems.reduce((sum, p) => sum + Number(p.price || 0) * p.quantity, 0)

    const totalItems =
        cartCount ?? cartItems.reduce((sum, p) => sum + p.quantity, 0)

    const cartIsEmpty = cartItems.length === 0

    /* ---------- ANIMAÇÃO (desliza da direita) ---------- */

    const [visible, setVisible] = useState(cartOpen)
    const anim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (cartOpen) {
            setVisible(true)
            Animated.timing(anim, {
                toValue: 1,
                duration: 280,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(anim, {
                toValue: 0,
                duration: 220,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true
            }).start(({ finished }) => finished && setVisible(false))
        }
    }, [cartOpen, anim])

    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [DRAWER_WIDTH, 0]
    })

    /* ---------- AÇÕES ---------- */

    const goToCheckout = () => {
        closeCart()
        navigation.navigate("Checkout")
    }

    const goToCatalog = () => {
        closeCart()
        navigation.navigate("ProductList")
    }

    const openProduct = (product) => {
        closeCart()
        navigation.navigate("ProductDetails", { product })
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={closeCart}
        >
            {/* FUNDO ESCURO */}

            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    opacity: anim
                }}
            >
                <Pressable style={{ flex: 1 }} onPress={closeCart} />
            </Animated.View>

            {/* GAVETA */}

            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: DRAWER_WIDTH,
                    transform: [{ translateX }]
                }}
            >
                <Drawer>

                    {/* CABEÇALHO */}

                    <CartHeader>
                        <HeaderLeft>
                            <CartTitle>SUA SACOLA</CartTitle>

                            {!cartIsEmpty && (
                                <CountPill>
                                    <CountText>{totalItems}</CountText>
                                </CountPill>
                            )}
                        </HeaderLeft>

                        <CloseButton onPress={closeCart} activeOpacity={0.7} hitSlop={10}>
                            <Ionicons name="close" size={20} color={TEXT} />
                        </CloseButton>
                    </CartHeader>

                    {cartIsEmpty ? (

                        /* ---------- VAZIA ---------- */

                        <EmptyCart>
                            <EmptyCartIcon>
                                <Ionicons name="bag-outline" size={36} color={ACCENT} />
                            </EmptyCartIcon>

                            <EmptyCartTitle>
                                Sua sacola está vazia<Accent>.</Accent>
                            </EmptyCartTitle>

                            <EmptyCartText>
                                Explore o catálogo e adicione as peças que combinam com você.
                            </EmptyCartText>

                            <OutlineButton onPress={goToCatalog} activeOpacity={0.8}>
                                <OutlineButtonText>EXPLORAR CATÁLOGO</OutlineButtonText>
                            </OutlineButton>
                        </EmptyCart>

                    ) : (
                        <>
                            {/* ITENS */}

                            <Content>
                                {cartItems.map((product) => (
                                    <ProductCard key={product.id}>
                                        <ProductImage
                                            onPress={() => openProduct(product)}
                                            activeOpacity={0.85}
                                        >
                                            {product.image ? (
                                                <Image
                                                    source={{ uri: product.image }}
                                                    style={{ width: "100%", height: "100%" }}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <ImagePlaceholder>HC</ImagePlaceholder>
                                            )}
                                        </ProductImage>

                                        <ProductInfo>
                                            <ProductTop>
                                                <ProductName numberOfLines={2}>
                                                    {product.name}
                                                </ProductName>

                                                <RemoveButton
                                                    onPress={() => removeFromCart(product.id)}
                                                    hitSlop={12}
                                                    activeOpacity={0.7}
                                                >
                                                    <Ionicons name="close" size={16} color={FAINT} />
                                                </RemoveButton>
                                            </ProductTop>

                                            {!!product.size && (
                                                <ProductDetails>Tamanho: {product.size}</ProductDetails>
                                            )}

                                            <ProductUnit>{formatPrice(product.price)} cada</ProductUnit>

                                            <ProductBottom>
                                                <QuantityContainer>
                                                    <QuantityButton
                                                        onPress={() => decreaseQuantity(product.id)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Ionicons
                                                            name={product.quantity === 1 ? "trash-outline" : "remove"}
                                                            size={15}
                                                            color={product.quantity === 1 ? DANGER : TEXT}
                                                        />
                                                    </QuantityButton>

                                                    <QuantityText>{product.quantity}</QuantityText>

                                                    <QuantityButton
                                                        onPress={() => increaseQuantity(product.id)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Ionicons name="add" size={15} color={ACCENT} />
                                                    </QuantityButton>
                                                </QuantityContainer>

                                                <ProductPrice>
                                                    {formatPrice(Number(product.price || 0) * product.quantity)}
                                                </ProductPrice>
                                            </ProductBottom>
                                        </ProductInfo>
                                    </ProductCard>
                                ))}

                                <ContinueButton onPress={goToCatalog} activeOpacity={0.7}>
                                    <Ionicons name="add-circle-outline" size={17} color={ACCENT} />
                                    <ContinueText>CONTINUAR COMPRANDO</ContinueText>
                                </ContinueButton>
                            </Content>

                            {/* RESUMO FIXO */}

                            <Summary>
                                <SummaryRow>
                                    <SummaryLabel>
                                        Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})
                                    </SummaryLabel>
                                    <SummaryValue>{formatPrice(subtotal)}</SummaryValue>
                                </SummaryRow>

                                <SummaryRow>
                                    <SummaryLabel>Frete</SummaryLabel>
                                    <GreenValue>GRÁTIS</GreenValue>
                                </SummaryRow>

                                <Divider />

                                <SummaryRow style={{ marginBottom: 0 }}>
                                    <TotalLabel>Total</TotalLabel>
                                    <TotalValue>{formatPrice(subtotal)}</TotalValue>
                                </SummaryRow>

                                <CheckoutButton onPress={goToCheckout} activeOpacity={0.85}>
                                    <CheckoutButtonText>FINALIZAR COMPRA</CheckoutButtonText>
                                    <ArrowBox>
                                        <Arrow>→</Arrow>
                                    </ArrowBox>
                                </CheckoutButton>

                                <SecureRow>
                                    <Ionicons name="lock-closed-outline" size={12} color={FAINT} />
                                    <SecureText>Pagamento seguro via PagBank</SecureText>
                                </SecureRow>
                            </Summary>
                        </>
                    )}
                </Drawer>
            </Animated.View>
        </Modal>
    )
}

export default Cart

/* ================================================================== */
/*  ESTILOS                                                            */
/* ================================================================== */

const Drawer = styled.View`
    flex: 1;
    background-color: ${BG};
    border-left-width: 1px;
    border-left-color: ${BORDER};
    padding-top: ${TOP_SPACE}px;
`

/* Cabeçalho */

const CartHeader = styled.View`
    height: 68px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom-width: 1px;
    border-bottom-color: ${BORDER};
`

const HeaderLeft = styled.View`
    flex-direction: row;
    align-items: center;
`

const CartTitle = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 900;
    letter-spacing: 2.5px;
`

const CountPill = styled.View`
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    margin-left: 10px;
    border-radius: 12px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
`

const CountText = styled.Text`
    color: #000000;
    font-size: 11px;
    font-weight: 900;
`

const CloseButton = styled.TouchableOpacity`
    width: 38px;
    height: 38px;
    border-radius: 19px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    align-items: center;
    justify-content: center;
`

const Accent = styled.Text`
    color: ${ACCENT};
`

/* Lista */

const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { padding: 18, paddingBottom: 24 }
})`
    flex: 1;
`

const ProductCard = styled.View`
    flex-direction: row;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
`

const ProductImage = styled.TouchableOpacity`
    width: 84px;
    height: 104px;
    border-radius: 14px;
    overflow: hidden;
    background-color: ${SURFACE_2};
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`

const ImagePlaceholder = styled.Text`
    color: ${FAINT};
    font-size: 18px;
    font-weight: 900;
`

const ProductInfo = styled.View`
    flex: 1;
    justify-content: space-between;
`

const ProductTop = styled.View`
    flex-direction: row;
    align-items: flex-start;
`

const ProductName = styled.Text`
    flex: 1;
    color: ${TEXT};
    font-size: 14px;
    font-weight: 700;
    line-height: 19px;
    margin-right: 6px;
`

const RemoveButton = styled.TouchableOpacity`
    padding: 2px;
`

const ProductDetails = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 4px;
`

const ProductUnit = styled.Text`
    color: ${FAINT};
    font-size: 11px;
    margin-top: 3px;
`

const ProductBottom = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
`

const QuantityContainer = styled.View`
    flex-direction: row;
    align-items: center;
    height: 34px;
    border-radius: 10px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE_2};
`

const QuantityButton = styled.TouchableOpacity`
    width: 32px;
    height: 100%;
    align-items: center;
    justify-content: center;
`

const QuantityText = styled.Text`
    min-width: 22px;
    color: ${TEXT};
    font-size: 14px;
    font-weight: 900;
    text-align: center;
`

const ProductPrice = styled.Text`
    color: ${ACCENT};
    font-size: 14px;
    font-weight: 900;
`

const ContinueButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 46px;
    margin-top: 4px;
    border-radius: 14px;
    border-width: 1.5px;
    border-style: dashed;
    border-color: ${BORDER};
`

const ContinueText = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.6px;
    margin-left: 8px;
`

/* Resumo fixo */

const Summary = styled.View`
    padding: 18px 18px ${Platform.OS === "ios" ? 34 : 20}px 18px;
    border-top-width: 1px;
    border-top-color: ${BORDER};
    background-color: #0d0d0d;
`

const SummaryRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`

const SummaryLabel = styled.Text`
    color: ${MUTED};
    font-size: 13px;
`

const SummaryValue = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 700;
`

const GreenValue = styled.Text`
    color: ${ACCENT};
    font-size: 13px;
    font-weight: 800;
`

const Divider = styled.View`
    height: 1px;
    background-color: ${BORDER};
    margin: 4px 0 14px 0;
`

const TotalLabel = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 800;
`

const TotalValue = styled.Text`
    color: ${ACCENT};
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.5px;
`

const CheckoutButton = styled.TouchableOpacity`
    height: 58px;
    margin-top: 16px;
    border-radius: 16px;
    background-color: ${ACCENT};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 20px;
    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.3;
    shadow-radius: 16px;
    elevation: 6;
`

const CheckoutButtonText = styled.Text`
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2px;
`

const ArrowBox = styled.View`
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background-color: #000000;
    align-items: center;
    justify-content: center;
`

const Arrow = styled.Text`
    color: ${ACCENT};
    font-size: 19px;
    font-weight: 900;
`

const SecureRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
`

const SecureText = styled.Text`
    color: ${FAINT};
    font-size: 11px;
    margin-left: 6px;
`

/* Vazia */

const EmptyCart = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 28px 60px 28px;
`

const EmptyCartIcon = styled.View`
    width: 84px;
    height: 84px;
    border-radius: 42px;
    background-color: rgba(0, 230, 64, 0.1);
    border-width: 1.5px;
    border-color: rgba(0, 230, 64, 0.35);
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`

const EmptyCartTitle = styled.Text`
    color: ${TEXT};
    font-size: 20px;
    font-weight: 900;
    text-align: center;
`

const EmptyCartText = styled.Text`
    color: ${MUTED};
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    margin-top: 8px;
`

const OutlineButton = styled.TouchableOpacity`
    align-self: stretch;
    height: 52px;
    margin-top: 26px;
    border-radius: 14px;
    border-width: 1.5px;
    border-color: ${ACCENT};
    align-items: center;
    justify-content: center;
`

const OutlineButtonText = styled.Text`
    color: ${ACCENT};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
`