
import { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity } from "react-native"
import { useRoute } from "@react-navigation/native"
import { getProduto } from "../../services/api"
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

    const [product, setProduct] = useState(route.params?.product ?? null)
    const [openSection, setOpenSection] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    // Atualiza com os dados completos do back (descrição, imagens...)
    useEffect(() => {
        const id = route.params?.product?.id ?? route.params?.id

        if (id) {
            getProduto(id).then(setProduct).catch(() => {})
        }
    }, [route.params])

    if (!product) {
        return (
            <Container>
                <Header />
                <BottomMenu active="Catalog" />
            </Container>
        )
    }

    const toggleSection = (key) =>
        setOpenSection((current) => (current === key ? null : key))

    const mainImage = selectedImage ?? product.image

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
                    Ref. {String(product.id).padStart(3, "0")}
                </ProductCode>

                {/* IMAGEM PRINCIPAL COM FAVORITOS */}

                <ImageWrapper>

                    {mainImage ? (
                        <Image
                            source={{ uri: mainImage }}
                            style={{ width: "100%", height: 280 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <MainImage>
                            IMAGEM DO PRODUTO
                        </MainImage>
                    )}

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

                    {(product.images ?? []).map((url) => (
                        <TouchableOpacity
                            key={url}
                            onPress={() => setSelectedImage(url)}
                            style={{ marginRight: 8 }}
                        >
                            <Image
                                source={{ uri: url }}
                                style={{ width: 55, height: 55 }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}

                </ThumbnailsContainer>

                {/* PREÇO */}

                <Price>
                    {formattedPrice}
                </Price>

                <Installment>
                    ou 3x de {(Number(product.price ?? product.preco ?? 0) / 3).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} sem juros
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

                <Accordion onPress={() => toggleSection("desc")}>

                    <AccordionText>
                        DESCRIÇÃO DO PRODUTO
                    </AccordionText>

                    <AccordionIcon>{openSection === "desc" ? "−" : "+"}</AccordionIcon>

                </Accordion>

                {openSection === "desc" && (
                    <Text style={{ color: "#333", fontSize: 12, marginBottom: 10, lineHeight: 18 }}>
                        {[product.descricao, product.marca && `Marca: ${product.marca}`, product.composicaoMaterial && `Composição: ${product.composicaoMaterial}`, product.instrucaoLavagem && `Lavagem: ${product.instrucaoLavagem}`].filter(Boolean).join("\n\n") || "Sem descrição."}
                    </Text>
                )}

                {/* TAMANHOS */}

                <Accordion onPress={() => toggleSection("sizes")}>

                    <AccordionText>
                        TAMANHOS E MEDIDAS
                    </AccordionText>

                    <AccordionIcon>{openSection === "sizes" ? "−" : "+"}</AccordionIcon>

                </Accordion>

                {openSection === "sizes" && (
                    <Text style={{ color: "#333", fontSize: 12, marginBottom: 10, lineHeight: 18 }}>
                        {[product.tamanho && `Tamanho: ${product.tamanho}`, product.quantidadePorTamanho && `Disponibilidade: ${product.quantidadePorTamanho}`].filter(Boolean).join("\n") || "Sem informações de tamanho."}
                    </Text>
                )}

                {/* TROCAS */}

                <Accordion onPress={() => toggleSection("returns")}>

                    <AccordionText>
                        TROCAS E DEVOLUÇÕES
                    </AccordionText>

                    <AccordionIcon>{openSection === "returns" ? "−" : "+"}</AccordionIcon>

                </Accordion>

                {openSection === "returns" && (
                    <Text style={{ color: "#333", fontSize: 12, marginBottom: 10, lineHeight: 18 }}>
                        {product.enviosDevolucoes || "Consulte nossa política de trocas e devoluções."}
                    </Text>
                )}

            </Content>

            <BottomMenu active="Catalog" />

        </Container>
    )
}

export default ProductDetails
