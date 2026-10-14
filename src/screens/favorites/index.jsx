import React from "react"
import { Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

import { useFavorites } from "../../context/favorites-context"

import {
    Container,
    Content,
    PageHeader,
    Eyebrow,
    PageTitle,
    PageDescription,
    CountRow,
    CountText,
    ProductGrid,
    ProductCard,
    ProductImageArea,
    ProductPlaceholder,
    FavoriteButton,
    ProductInfo,
    ProductName,
    ProductPrice,
    ProductAction,
    ProductActionText,
    EmptyContainer,
    EmptyIconArea,
    EmptyTitle,
    EmptyDescription,
    ExploreButton,
    ExploreButtonText
} from "./style"

const Favorites = () => {
    const navigation = useNavigation()

    const {
        favorites,
        removeFavorite
    } = useFavorites()

    const formatPrice = (value) => {
        const numericValue = Number(value)

        if (!Number.isFinite(numericValue)) {
            return "Consulte o preço"
        }

        return numericValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
    }

    const getProductImage = (product) => {
        const image =
            product.image ||
            product.imagem ||
            product.images?.[0] ||
            product.imagens?.[0]

        if (typeof image === "string") {
            return { uri: image }
        }

        if (image?.url) {
            return { uri: image.url }
        }

        if (image?.uri) {
            return { uri: image.uri }
        }

        return null
    }

    const openProduct = (product) => {
        navigation.navigate("ProductDetails", {
            product
        })
    }

    const goToCatalog = () => {
        navigation.navigate("ProductList")
    }

    return (
        <Container>

            <Header />

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 35
                }}
            >

                <PageHeader>
                    <Eyebrow>
                        SUA SELEÇÃO
                    </Eyebrow>

                    <PageTitle>
                        Favoritos.
                    </PageTitle>

                    <PageDescription>
                        Peças que combinam com seu estilo.
                        Salve seus produtos preferidos e
                        encontre tudo em um só lugar.
                    </PageDescription>
                </PageHeader>

                {favorites.length === 0 ? (

                    <EmptyContainer>

                        <EmptyIconArea>
                            <Ionicons
                                name="heart-outline"
                                size={36}
                                color="#00FF63"
                            />
                        </EmptyIconArea>

                        <EmptyTitle>
                            Sua lista está vazia.
                        </EmptyTitle>

                        <EmptyDescription>
                            Encontrou uma peça que gostou?
                            Toque no coração para salvá-la
                            aqui e acessar quando quiser.
                        </EmptyDescription>

                        <ExploreButton
                            onPress={goToCatalog}
                        >
                            <ExploreButtonText>
                                EXPLORAR CATÁLOGO →
                            </ExploreButtonText>
                        </ExploreButton>

                    </EmptyContainer>

                ) : (

                    <>
                        <CountRow>
                            <CountText>
                                {favorites.length}
                                {favorites.length === 1
                                    ? " PRODUTO SALVO"
                                    : " PRODUTOS SALVOS"}
                            </CountText>
                        </CountRow>

                        <ProductGrid>

                            {favorites.map((product) => {

                                const productId =
                                    product.id ?? product._id

                                const imageSource =
                                    getProductImage(product)

                                return (
                                    <ProductCard
                                        key={String(productId)}
                                        activeOpacity={0.9}
                                        onPress={() =>
                                            openProduct(product)
                                        }
                                    >

                                        <ProductImageArea>

                                            {imageSource ? (
                                                <Image
                                                    source={imageSource}
                                                    resizeMode="cover"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                />
                                            ) : (
                                                <ProductPlaceholder>
                                                    HC STORE
                                                </ProductPlaceholder>
                                            )}

                                            <FavoriteButton
                                                onPress={() =>
                                                    removeFavorite(productId)
                                                }
                                            >
                                                <Ionicons
                                                    name="heart"
                                                    size={19}
                                                    color="#00C853"
                                                />
                                            </FavoriteButton>

                                        </ProductImageArea>

                                        <ProductInfo>

                                            <ProductName
                                                numberOfLines={2}
                                            >
                                                {product.name ||
                                                    product.nome ||
                                                    "Produto HC Store"}
                                            </ProductName>

                                            <ProductPrice>
                                                {formatPrice(
                                                    product.price ??
                                                    product.preco
                                                )}
                                            </ProductPrice>

                                            <ProductAction
                                                onPress={() =>
                                                    openProduct(product)
                                                }
                                            >
                                                <ProductActionText>
                                                    VER PRODUTO →
                                                </ProductActionText>
                                            </ProductAction>

                                        </ProductInfo>

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
