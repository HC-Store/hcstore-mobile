import { useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, Image, Platform, StatusBar } from "react-native"
import { useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import styled from "styled-components/native"

import { getProduto } from "../../services/api"
import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"
import { useFavorites } from "../../context/favorites-context"
import { useCart } from "../../context/cart-context"

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
const IMAGE_SIZE = width - 48

const formatPrice = (value) =>
    `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`

/* ================================================================== */
/*  ACORDEÃO (fora da tela)                                            */
/* ================================================================== */

const AccordionItem = ({ icon, title, open, onPress, children, last }) => (
    <AccordionBox $last={last}>
        <AccordionHeader onPress={onPress} activeOpacity={0.7}>
            <AccordionLeft>
                <AccordionIconBox>
                    <Ionicons name={icon} size={16} color={ACCENT} />
                </AccordionIconBox>
                <AccordionText>{title}</AccordionText>
            </AccordionLeft>

            <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={18}
                color={open ? ACCENT : FAINT}
            />
        </AccordionHeader>

        {open && <AccordionBody>{children}</AccordionBody>}
    </AccordionBox>
)

/* ================================================================== */
/*  TELA                                                               */
/* ================================================================== */

const ProductDetails = () => {
    const route = useRoute()

    const { addToCart, openCart } = useCart()
    const { toggleFavorite, isFavorite } = useFavorites()

    const [product, setProduct] = useState(route.params?.product ?? null)
    const [openSection, setOpenSection] = useState("desc")
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)

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
                <StatusBar backgroundColor={BG} barStyle="light-content" />
                <HeaderWrapper>
                    <Header />
                </HeaderWrapper>
                <LoadingBox>
                    <ActivityIndicator color={ACCENT} size="large" />
                    <LoadingText>Carregando produto...</LoadingText>
                </LoadingBox>
                <BottomMenu active="Catalog" />
            </Container>
        )
    }

    const toggleSection = (key) =>
        setOpenSection((current) => (current === key ? null : key))

    const productId = product.id ?? product._id
    const favorito = isFavorite(productId)
    const price = Number(product.price ?? product.preco ?? 0)
    const images = product.images ?? []
    const mainImage = selectedImage ?? product.image

    // "P, M, G" -> ["P", "M", "G"]
    const tamanhos = String(product.tamanho ?? product.size ?? "")
        .split(/[,;/|]/)
        .map((t) => t.trim())
        .filter(Boolean)

    // Verifica se é tamanho único
    const isTamanhoUnico =
        tamanhos.length === 1 &&
        ["único", "unico", "u"].includes(tamanhos[0].toLowerCase())

    const descricao =
        [
            product.descricao,
            product.marca && `Marca: ${product.marca}`,
            product.composicaoMaterial && `Composição: ${product.composicaoMaterial}`,
            product.instrucaoLavagem && `Lavagem: ${product.instrucaoLavagem}`
        ]
            .filter(Boolean)
            .join("\n\n") || "Sem descrição."

    const medidas =
        [
            product.tamanho && `Tamanho: ${product.tamanho}`,
            product.quantidadePorTamanho && `Disponibilidade: ${product.quantidadePorTamanho}`
        ]
            .filter(Boolean)
            .join("\n") || "Sem informações de tamanho."

    const handleAddToCart = () => {
        const tamanhoFinal =
            selectedSize || (tamanhos.length === 1 ? tamanhos[0] : null)

        const productToAdd = {
            ...product,
            selectedSize: tamanhoFinal
        }

        addToCart(productToAdd)
        openCart()
    }

    return (
        <Container>
            <StatusBar backgroundColor={BG} barStyle="light-content" />

            {/* ENVOLVEMOS O HEADER COM UM ESPAÇAMENTO PARA DESCER A LOGO E OS ÍCONES */}
            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            <Content>

                {/* IMAGEM PRINCIPAL */}

                <ImageWrapper style={{ height: IMAGE_SIZE * 1.1 }}>
                    {mainImage ? (
                        <Image
                            source={{ uri: mainImage }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    ) : (
                        <>
                            <Watermark>HC</Watermark>
                            <PlaceholderText>IMAGEM DO PRODUTO</PlaceholderText>
                        </>
                    )}

                    <RefTag>
                        <RefTagText>REF. {String(productId).padStart(3, "0")}</RefTagText>
                    </RefTag>

                    <FavoriteButton
                        $active={favorito}
                        onPress={() => toggleFavorite(product)}
                        activeOpacity={0.8}
                        hitSlop={8}
                    >
                        <Ionicons
                            name={favorito ? "heart" : "heart-outline"}
                            size={20}
                            color={favorito ? "#000000" : ACCENT}
                        />
                    </FavoriteButton>
                </ImageWrapper>

                {/* MINIATURAS */}

                {images.length > 1 && (
                    <ThumbnailsContainer>
                        {images.map((url) => {
                            const ativo = (selectedImage ?? product.image) === url
                            return (
                                <Thumbnail
                                    key={url}
                                    $active={ativo}
                                    onPress={() => setSelectedImage(url)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: url }}
                                        style={{ width: "100%", height: "100%" }}
                                        resizeMode="cover"
                                    />
                                </Thumbnail>
                            )
                        })}
                    </ThumbnailsContainer>
                )}

                {/* TÍTULO E PREÇO */}

                {!!product.marca && <Brand>{String(product.marca).toUpperCase()}</Brand>}

                <ProductTitle>
                    {product.name ?? product.nome ?? "Produto HC Store"}
                </ProductTitle>

                <PriceRow>
                    <Price>{formatPrice(price)}</Price>
                    <PixTag>
                        <PixTagText>EM ATÉ 3X</PixTagText>
                    </PixTag>
                </PriceRow>

                <Installment>
                    ou <InstallmentStrong>3x de {formatPrice(price / 3)}</InstallmentStrong> sem juros
                </Installment>

                {/* TAMANHOS (Exibe apenas se houver tamanhos e não for tamanho único) */}

                {tamanhos.length > 0 && !isTamanhoUnico && (
                    <>
                        <SectionLabel>TAMANHOS DISPONÍVEIS</SectionLabel>
                        <SizesRow>
                            {tamanhos.map((t) => {
                                const isSelected = selectedSize === t
                                return (
                                    <SizeChip
                                        key={t}
                                        $selected={isSelected}
                                        onPress={() => setSelectedSize(t)}
                                        activeOpacity={0.8}
                                    >
                                        <SizeText $selected={isSelected}>{t}</SizeText>
                                    </SizeChip>
                                )
                            })}
                        </SizesRow>
                    </>
                )}

                {/* BOTÃO */}

                <BuyButton onPress={handleAddToCart} activeOpacity={0.85}>
                    <BuyLeft>
                        <Ionicons name="bag-add-outline" size={20} color="#000000" />
                        <BuyButtonText>ADICIONAR AO CARRINHO</BuyButtonText>
                    </BuyLeft>

                    <ArrowBox>
                        <Arrow>→</Arrow>
                    </ArrowBox>
                </BuyButton>

                {/* BENEFÍCIOS */}

                <Benefits>
                    <Benefit>
                        <Ionicons name="car-outline" size={20} color={ACCENT} />
                        <BenefitTitle>Frete grátis</BenefitTitle>
                        <BenefitText>acima de R$ 200</BenefitText>
                    </Benefit>

                    <BenefitDivider />

                    <Benefit>
                        <Ionicons name="swap-horizontal-outline" size={20} color={ACCENT} />
                        <BenefitTitle>Troca fácil</BenefitTitle>
                        <BenefitText>na primeira compra</BenefitText>
                    </Benefit>

                    <BenefitDivider />

                    <Benefit>
                        <Ionicons name="shield-checkmark-outline" size={20} color={ACCENT} />
                        <BenefitTitle>Compra segura</BenefitTitle>
                        <BenefitText>dados protegidos</BenefitText>
                    </Benefit>
                </Benefits>

                {/* INFORMAÇÕES */}

                <AccordionGroup>
                    <AccordionItem
                        icon="document-text-outline"
                        title="DESCRIÇÃO DO PRODUTO"
                        open={openSection === "desc"}
                        onPress={() => toggleSection("desc")}
                    >
                        <AccordionContent>{descricao}</AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        icon="resize-outline"
                        title="TAMANHOS E MEDIDAS"
                        open={openSection === "sizes"}
                        onPress={() => toggleSection("sizes")}
                    >
                        <AccordionContent>{medidas}</AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        icon="return-down-back-outline"
                        title="TROCAS E DEVOLUÇÕES"
                        open={openSection === "returns"}
                        onPress={() => toggleSection("returns")}
                        last
                    >
                        <AccordionContent>
                            {product.enviosDevolucoes ||
                                "Consulte nossa política de trocas e devoluções."}
                        </AccordionContent>
                    </AccordionItem>
                </AccordionGroup>

            </Content>

            <BottomMenu active="Catalog" />
        </Container>
    )
}

export default ProductDetails

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
    contentContainerStyle: { paddingTop: 12, paddingHorizontal: 24, paddingBottom: 120 }
})`
    flex: 1;
`

/* Carregando */

const LoadingBox = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`

const LoadingText = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 12px;
`

/* Imagem */

const ImageWrapper = styled.View`
    width: 100%;
    border-radius: 24px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    overflow: hidden;
    align-items: center;
    justify-content: center;
`

const Watermark = styled.Text`
    position: absolute;
    right: -14px;
    bottom: -44px;
    font-size: 180px;
    font-weight: 900;
    letter-spacing: -10px;
    color: ${ACCENT};
    opacity: 0.05;
`

const PlaceholderText = styled.Text`
    color: ${FAINT};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
`

const RefTag = styled.View`
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 5px 10px;
    border-radius: 999px;
    background-color: rgba(0, 0, 0, 0.7);
    border-width: 1px;
    border-color: ${BORDER};
`

const RefTagText = styled.Text`
    color: ${MUTED};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.5px;
`

const FavoriteButton = styled.TouchableOpacity`
    position: absolute;
    top: 14px;
    right: 14px;
    width: 42px;
    height: 42px;
    border-radius: 21px;
    background-color: ${(p) => (p.$active ? ACCENT : "rgba(0, 0, 0, 0.7)")};
    border-width: 1px;
    border-color: ${(p) => (p.$active ? ACCENT : "rgba(0, 230, 64, 0.35)")};
    align-items: center;
    justify-content: center;
`

/* Miniaturas */

const ThumbnailsContainer = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false
})`
    flex-grow: 0;
    margin-top: 12px;
`

const Thumbnail = styled.TouchableOpacity`
    width: 64px;
    height: 64px;
    margin-right: 10px;
    border-radius: 14px;
    overflow: hidden;
    border-width: 2px;
    border-color: ${(p) => (p.$active ? ACCENT : BORDER)};
    opacity: ${(p) => (p.$active ? 1 : 0.6)};
`

/* Título e preço */

const Brand = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2.5px;
    margin-top: 24px;
`

const ProductTitle = styled.Text`
    color: ${TEXT};
    font-size: 28px;
    line-height: 32px;
    font-weight: 900;
    letter-spacing: -0.8px;
    margin-top: 8px;
`

const PriceRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 16px;
`

const Price = styled.Text`
    color: ${ACCENT};
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -1px;
`

const PixTag = styled.View`
    margin-left: 12px;
    padding: 4px 9px;
    border-radius: 999px;
    background-color: rgba(0, 230, 64, 0.1);
`

const PixTagText = styled.Text`
    color: ${ACCENT};
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1.2px;
`

const Installment = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 4px;
`

const InstallmentStrong = styled.Text`
    color: ${TEXT};
    font-weight: 700;
`

/* Tamanhos */

const SectionLabel = styled.Text`
    color: ${MUTED};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    margin-top: 24px;
    margin-bottom: 10px;
`

const SizesRow = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`

const SizeChip = styled.TouchableOpacity`
    min-width: 48px;
    height: 44px;
    padding: 0 14px;
    margin: 0 8px 8px 0;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$selected ? ACCENT : BORDER)};
    background-color: ${(p) => (p.$selected ? "rgba(0, 230, 64, 0.15)" : SURFACE)};
    align-items: center;
    justify-content: center;
`

const SizeText = styled.Text`
    color: ${(p) => (p.$selected ? ACCENT : TEXT)};
    font-size: 14px;
    font-weight: 800;
`

/* Botão */

const BuyButton = styled.TouchableOpacity`
    height: 60px;
    margin-top: 24px;
    border-radius: 16px;
    background-color: ${ACCENT};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 20px;
    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.35;
    shadow-radius: 18px;
    elevation: 8;
`

const BuyLeft = styled.View`
    flex-direction: row;
    align-items: center;
`

const BuyButtonText = styled.Text`
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 1.8px;
    margin-left: 10px;
`

const ArrowBox = styled.View`
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background-color: #000000;
    align-items: center;
    justify-content: center;
`

const Arrow = styled.Text`
    color: ${ACCENT};
    font-size: 20px;
    font-weight: 900;
`

/* Benefícios */

const Benefits = styled.View`
    flex-direction: row;
    margin-top: 20px;
    padding: 16px 8px;
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
`

const Benefit = styled.View`
    flex: 1;
    align-items: center;
`

const BenefitDivider = styled.View`
    width: 1px;
    background-color: ${BORDER};
`

const BenefitTitle = styled.Text`
    color: ${TEXT};
    font-size: 12px;
    font-weight: 800;
    margin-top: 8px;
`

const BenefitText = styled.Text`
    color: ${MUTED};
    font-size: 10px;
    margin-top: 2px;
    text-align: center;
`

/* Acordeão */

const AccordionGroup = styled.View`
    margin-top: 24px;
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    padding: 0 16px;
`

const AccordionBox = styled.View`
    border-bottom-width: ${(p) => (p.$last ? 0 : 1)}px;
    border-bottom-color: ${BORDER};
`

const AccordionHeader = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
`

const AccordionLeft = styled.View`
    flex-direction: row;
    align-items: center;
`

const AccordionIconBox = styled.View`
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`

const AccordionText = styled.Text`
    color: ${TEXT};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

const AccordionBody = styled.View`
    padding: 0 0 18px 44px;
`

const AccordionContent = styled.Text`
    color: ${MUTED};
    font-size: 14px;
    line-height: 21px;
`