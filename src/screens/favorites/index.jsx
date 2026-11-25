import React from "react"
import { Dimensions, Image, Platform, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"
import { useFavorites } from "../../context/favorites-context"

/* ================================================================== */
/*  TEMA                                                               */
/* ================================================================== */

const BG = "#070707"
const SURFACE = "#111111"
const BORDER = "#222222"
const ACCENT = "#00E640"
const TEXT = "#F5F5F5"
const MUTED = "#8C8C8C"
const FAINT = "#4A4A4A"

const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 8 : 44

const { width } = Dimensions.get("window")
const CARD_WIDTH = (width - 48 - 14) / 2

/* ================================================================== */
/*  AJUDANTES                                                          */
/* ================================================================== */

const formatPrice = (value) => {
    const n = Number(value)
    if (!Number.isFinite(n)) return "Consulte o preço"
    return `R$ ${n.toFixed(2).replace(".", ",")}`
}

const getProductImage = (product) => {
    const image =
        product.image ||
        product.imagem ||
        product.images?.[0] ||
        product.imagens?.[0]

    if (typeof image === "string") return { uri: image }
    if (image?.url) return { uri: image.url }
    if (image?.uri) return { uri: image.uri }
    return null
}

/* ================================================================== */
/*  TELA                                                               */
/* ================================================================== */

const Favorites = () => {
    const navigation = useNavigation()
    const { favorites, removeFavorite } = useFavorites()

    const openProduct = (product) =>
        navigation.navigate("ProductDetails", { product })

    const goToCatalog = () => navigation.navigate("ProductList")

    const vazio = favorites.length === 0

    return (
        <Container>
            <StatusBar backgroundColor={BG} barStyle="light-content" />

            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            <Content>

                {/* CABEÇALHO */}

                <PageHeader>
                    <EyebrowRow>
                        <EyebrowDash />
                        <Eyebrow>SUA SELEÇÃO</Eyebrow>
                    </EyebrowRow>

                    <PageTitle>
                        FAVORITOS<Accent>.</Accent>
                    </PageTitle>

                    <PageDescription>
                        Peças que combinam com seu estilo, todas em um só lugar.
                    </PageDescription>
                </PageHeader>

                {vazio ? (

                    /* ---------- LISTA VAZIA ---------- */

                    <EmptyContainer>
                        <EmptyIconArea>
                            <Ionicons name="heart-outline" size={34} color={ACCENT} />
                        </EmptyIconArea>

                        <EmptyTitle>Sua lista está vazia</EmptyTitle>

                        <EmptyDescription>
                            Encontrou uma peça que gostou? Toque no coração para
                            salvá-la aqui e acessar quando quiser.
                        </EmptyDescription>

                        <ExploreButton onPress={goToCatalog} activeOpacity={0.85}>
                            <ExploreButtonText>EXPLORAR CATÁLOGO</ExploreButtonText>
                            <ArrowBox>
                                <Arrow>→</Arrow>
                            </ArrowBox>
                        </ExploreButton>
                    </EmptyContainer>

                ) : (

                    /* ---------- LISTA ---------- */

                    <>
                        <CountRow>
                            <CountPill>
                                <Ionicons name="heart" size={12} color="#000000" />
                                <CountText>
                                    {favorites.length}{" "}
                                    {favorites.length === 1 ? "PRODUTO SALVO" : "PRODUTOS SALVOS"}
                                </CountText>
                            </CountPill>

                            <SeeMore onPress={goToCatalog} activeOpacity={0.7}>
                                <SeeMoreText>VER MAIS</SeeMoreText>
                            </SeeMore>
                        </CountRow>

                        <ProductGrid>
                            {favorites.map((product) => {
                                const productId = product.id ?? product._id
                                const imageSource = getProductImage(product)

                                return (
                                    <ProductCard
                                        key={String(productId)}
                                        style={{ width: CARD_WIDTH }}
                                        activeOpacity={0.85}
                                        onPress={() => openProduct(product)}
                                    >
                                        <ProductImageArea style={{ height: CARD_WIDTH * 1.25 }}>
                                            {imageSource ? (
                                                <Image
                                                    source={imageSource}
                                                    resizeMode="cover"
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            ) : (
                                                <ProductPlaceholder>HC</ProductPlaceholder>
                                            )}

                                            <FavoriteButton
                                                onPress={() => removeFavorite(productId)}
                                                activeOpacity={0.8}
                                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                            >
                                                <Ionicons name="heart" size={18} color={ACCENT} />
                                            </FavoriteButton>
                                        </ProductImageArea>

                                        <ProductName numberOfLines={2}>
                                            {product.name || product.nome || "Produto HC Store"}
                                        </ProductName>

                                        <PriceRow>
                                            <ProductPrice>
                                                {formatPrice(product.price ?? product.preco)}
                                            </ProductPrice>

                                            <ProductAction
                                                onPress={() => openProduct(product)}
                                                activeOpacity={0.8}
                                            >
                                                <ProductActionText>→</ProductActionText>
                                            </ProductAction>
                                        </PriceRow>
                                    </ProductCard>
                                )
                            })}
                        </ProductGrid>
                    </>
                )}

            </Content>

            <BottomMenu active="Favorites" />
        </Container>
    )
}

export default Favorites

/* ================================================================== */
/*  ESTILOS                                                            */
/* ================================================================== */

const Container = styled.View`
    flex: 1;
    background-color: ${BG};
`

const HeaderWrapper = styled.View`
    padding-top: ${TOP_SPACE}px;
    background-color: ${BG};
`

const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { flexGrow: 1, paddingTop: 16, paddingHorizontal: 24, paddingBottom: 120 }
})`
    flex: 1;
`

/* Cabeçalho */

const PageHeader = styled.View`
    margin-bottom: 28px;
`

const EyebrowRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 14px;
`

const EyebrowDash = styled.View`
    width: 24px;
    height: 2px;
    background-color: ${ACCENT};
    margin-right: 10px;
`

const Eyebrow = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2.5px;
`

const PageTitle = styled.Text`
    color: ${TEXT};
    font-size: 44px;
    line-height: 46px;
    font-weight: 900;
    letter-spacing: -1.5px;
`

const Accent = styled.Text`
    color: ${ACCENT};
`

const PageDescription = styled.Text`
    color: ${MUTED};
    font-size: 15px;
    line-height: 22px;
    margin-top: 10px;
    max-width: 300px;
`

/* Contador */

const CountRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
`

const CountPill = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: ${ACCENT};
    border-radius: 999px;
    padding: 6px 12px;
`

const CountText = styled.Text`
    color: #000000;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.5px;
    margin-left: 6px;
`

const SeeMore = styled.TouchableOpacity`
    padding: 4px 0;
`

const SeeMoreText = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
`

/* Produtos */

const ProductGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`

const ProductCard = styled.TouchableOpacity`
    margin-bottom: 24px;
`

const ProductImageArea = styled.View`
    width: 100%;
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    overflow: hidden;
    align-items: center;
    justify-content: center;
`

const ProductPlaceholder = styled.Text`
    color: ${FAINT};
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -2px;
`

const FavoriteButton = styled.TouchableOpacity`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: rgba(0, 0, 0, 0.7);
    border-width: 1px;
    border-color: rgba(0, 230, 64, 0.35);
    align-items: center;
    justify-content: center;
`

const ProductName = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 600;
    line-height: 19px;
    margin-top: 12px;
    min-height: 38px;
`

const PriceRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
`

const ProductPrice = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
`

const ProductAction = styled.TouchableOpacity`
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
`

const ProductActionText = styled.Text`
    color: #000000;
    font-size: 16px;
    font-weight: 900;
`

/* Lista vazia */

const EmptyContainer = styled.View`
    flex: 1;
    align-items: center;
    padding: 36px 24px;
    border-radius: 22px;
    border-width: 1px;
    border-style: dashed;
    border-color: ${BORDER};
`

const EmptyIconArea = styled.View`
    width: 76px;
    height: 76px;
    border-radius: 38px;
    background-color: rgba(0, 230, 64, 0.1);
    border-width: 1.5px;
    border-color: rgba(0, 230, 64, 0.35);
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`

const EmptyTitle = styled.Text`
    color: ${TEXT};
    font-size: 20px;
    font-weight: 900;
    margin-bottom: 8px;
`

const EmptyDescription = styled.Text`
    color: ${MUTED};
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    max-width: 280px;
`

const ExploreButton = styled.TouchableOpacity`
    align-self: stretch;
    height: 58px;
    margin-top: 28px;
    border-radius: 16px;
    background-color: ${ACCENT};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 22px;
    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.3;
    shadow-radius: 16px;
    elevation: 6;
`

const ExploreButtonText = styled.Text`
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