
import { useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

import {
    Container,
    Content,
    ProductTitle,
    ProductCode,
    MainImage,
    ImageWrapper,
    FavoriteButton,
    ThumbnailsContainer,
    Thumbnail,
    Price,
    Installment,
    BuyButton,
    BuyButtonText,
    InfoText,
    InfoHighlight,
    Accordion,
    AccordionText,
    AccordionIcon,
} from "./style"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

import { useFavorites } from "../../context/favorites-context"
import { useCart } from "../../context/cart-context"

const ProductDetails = () => {

    const route = useRoute()

    const { addToCart, openCart } = useCart()
    const { toggleFavorite, isFavorite } = useFavorites()

    const product = route.params?.product ?? {
        id: "1",
        name: "Camiseta Oversized HC Store",
        price: 119.90,
        size: "M"
    }

    const productId = product.id ?? product._id

    const handleAddToCart = () => {
        addToCart(product)
        openCart()
    }

    const handleToggleFavorite = () => {
        toggleFavorite(product)
    }

    const formattedPrice = Number(
        product.price ?? product.preco ?? 0
    ).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return (
        <Container>

            <Header />

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 30
                }}
            >

                {/* INFORMAÇÕES DO PRODUTO */}

                <ProductTitle>
                    {product.name ?? product.nome ?? "Produto HC Store"}
                </ProductTitle>

                <ProductCode>
                    Ref. 001
                </ProductCode>

                {/* IMAGEM PRINCIPAL COM FAVORITOS */}

                <ImageWrapper>

                    <MainImage>
                        IMAGEM DO PRODUTO
                    </MainImage>

                    <FavoriteButton
                        onPress={handleToggleFavorite}
                        activeOpacity={0.8}
                        hitSlop={8}
                    >
                        <Ionicons
                            name={
                                isFavorite(productId)
                                    ? "heart"
                                    : "heart-outline"
                            }
                            size={20}
                            color="#00C853"
                        />
                    </FavoriteButton>

                </ImageWrapper>

                {/* MINIATURAS */}

                <ThumbnailsContainer>

                    <Thumbnail>IMG</Thumbnail>

                    <Thumbnail>IMG</Thumbnail>

                    <Thumbnail>IMG</Thumbnail>

                </ThumbnailsContainer>

                {/* PREÇO */}

                <Price>
                    {formattedPrice}
                </Price>

                <Installment>
                    ou 3x de R$ 39,97 sem juros
                </Installment>

                {/* ADICIONAR AO CARRINHO */}

                <BuyButton onPress={handleAddToCart}>

                    <BuyButtonText>
                        ADICIONAR AO CARRINHO
                    </BuyButtonText>

                </BuyButton>

                {/* INFORMAÇÕES DE ENTREGA */}

                <InfoHighlight>
                    Frete grátis acima de R$ 200
                </InfoHighlight>

                <InfoText>
                    Consulte o prazo e as opções de entrega.
                </InfoText>

                {/* DESCRIÇÃO */}

                <Accordion>

                    <AccordionText>
                        DESCRIÇÃO DO PRODUTO
                    </AccordionText>

                    <AccordionIcon>+</AccordionIcon>

                </Accordion>

                {/* TAMANHOS */}

                <Accordion>

                    <AccordionText>
                        TAMANHOS E MEDIDAS
                    </AccordionText>

                    <AccordionIcon>+</AccordionIcon>

                </Accordion>

                {/* TROCAS */}

                <Accordion>

                    <AccordionText>
                        TROCAS E DEVOLUÇÕES
                    </AccordionText>

                    <AccordionIcon>+</AccordionIcon>

                </Accordion>

            </Content>

            <BottomMenu active="Catalog" />

        </Container>
    )
}

export default ProductDetails
