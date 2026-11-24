import { useCallback, useEffect, useState } from "react"
import { Dimensions, Image, RefreshControl } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { getCategorias, getProdutos } from "../../services/api"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

import {
    Container,
    Content,
    Hero,
    HeroWatermark,
    HeroTag,
    HeroTagText,
    HeroTitle,
    HeroSubtitle,
    HeroBtn,
    HeroBtnText,
    ChipsScroll,
    Chip,
    ChipText,
    Section,
    SectionHeader,
    SectionTitle,
    SectionSubTitle,
    SeeAll,
    SeeAllText,
    Grid,
    ProductCard,
    ImageBox,
    NewTag,
    NewTagText,
    ProductImagePlaceholder,
    ProductName,
    ProductPrice,
    SkeletonLine,
    EmptyBox,
    EmptyText,
    RetryBtn,
    RetryText
} from "./style"

const ACCENT = "#00E640"

const { width } = Dimensions.get("window")
const CARD_WIDTH = (width - 48 - 14) / 2

const formatPrice = (value) =>
    `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`

const Home = () => {
    const navigation = useNavigation()

    const [categorias, setCategorias] = useState([])
    const [novidades, setNovidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [erro, setErro] = useState(false)

    const carregar = useCallback(async () => {
        setErro(false)

        const [cats, prods] = await Promise.allSettled([
            getCategorias(),
            getProdutos()
        ])

        setCategorias(cats.status === "fulfilled" ? cats.value : [])

        if (prods.status === "fulfilled") {
            setNovidades([...prods.value].sort((a, b) => b.id - a.id).slice(0, 4))
        } else {
            setNovidades([])
            setErro(true)
        }
    }, [])

    useEffect(() => {
        carregar().finally(() => setLoading(false))
    }, [carregar])

    const onRefresh = async () => {
        setRefreshing(true)
        await carregar()
        setRefreshing(false)
    }

    const abrirLista = (categoriaId) =>
        navigation.navigate("ProductList", categoriaId ? { categoriaId } : undefined)

    return (
        <Container>
            <Header />

            <Content
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={ACCENT}
                        colors={[ACCENT]}
                        progressBackgroundColor="#111111"
                    />
                }
            >

                {/* BANNER */}

                <Hero>
                    <HeroWatermark>HC</HeroWatermark>

                    <HeroTag>
                        <HeroTagText>DROP 2026</HeroTagText>
                    </HeroTag>

                    <HeroTitle>NOVA{"\n"}COLEÇÃO.</HeroTitle>

                    <HeroSubtitle>
                        Peças novas pra você vestir sua identidade.
                    </HeroSubtitle>

                    <HeroBtn onPress={() => abrirLista()} activeOpacity={0.85}>
                        <HeroBtnText>VER TUDO  →</HeroBtnText>
                    </HeroBtn>
                </Hero>

                {/* CATEGORIAS */}

                <Section style={{ marginBottom: 14 }}>
                    <SectionTitle>CATEGORIAS</SectionTitle>
                </Section>

                <ChipsScroll>
                    <Chip $active onPress={() => abrirLista()} activeOpacity={0.8}>
                        <ChipText $active>Todos</ChipText>
                    </Chip>

                    {categorias.map((categoria) => (
                        <Chip
                            key={categoria.id}
                            onPress={() => abrirLista(categoria.id)}
                            activeOpacity={0.8}
                        >
                            <ChipText>{categoria.nome}</ChipText>
                        </Chip>
                    ))}
                </ChipsScroll>

                {/* NOVIDADES */}

                <Section>
                    <SectionHeader>
                        <SectionTitle>NOVIDADES</SectionTitle>

                        <SeeAll onPress={() => abrirLista()} activeOpacity={0.7}>
                            <SeeAllText>VER TODOS</SeeAllText>
                        </SeeAll>
                    </SectionHeader>

                    <SectionSubTitle>Últimos lançamentos da loja</SectionSubTitle>

                    {loading ? (
                        <Grid>
                            {[1, 2, 3, 4].map((i) => (
                                <ProductCard key={i} style={{ width: CARD_WIDTH }} disabled>
                                    <ImageBox style={{ height: CARD_WIDTH * 1.25 }} />
                                    <SkeletonLine style={{ width: "80%" }} />
                                    <SkeletonLine style={{ width: "40%" }} />
                                </ProductCard>
                            ))}
                        </Grid>
                    ) : erro ? (
                        <EmptyBox>
                            <EmptyText>Não foi possível carregar os produtos.</EmptyText>
                            <RetryBtn onPress={onRefresh} activeOpacity={0.8}>
                                <RetryText>TENTAR NOVAMENTE</RetryText>
                            </RetryBtn>
                        </EmptyBox>
                    ) : novidades.length === 0 ? (
                        <EmptyBox>
                            <EmptyText>Nenhum lançamento por enquanto.</EmptyText>
                        </EmptyBox>
                    ) : (
                        <Grid>
                            {novidades.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    style={{ width: CARD_WIDTH }}
                                    activeOpacity={0.85}
                                    onPress={() =>
                                        navigation.navigate("ProductDetails", { product })
                                    }
                                >
                                    <ImageBox style={{ height: CARD_WIDTH * 1.25 }}>
                                        {product.image ? (
                                            <Image
                                                source={{ uri: product.image }}
                                                style={{ width: "100%", height: "100%" }}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <ProductImagePlaceholder>HC</ProductImagePlaceholder>
                                        )}

                                        <NewTag>
                                            <NewTagText>NOVO</NewTagText>
                                        </NewTag>
                                    </ImageBox>

                                    <ProductName numberOfLines={2}>{product.name}</ProductName>
                                    <ProductPrice>{formatPrice(product.price)}</ProductPrice>
                                </ProductCard>
                            ))}
                        </Grid>
                    )}
                </Section>

            </Content>

            <BottomMenu active="Home" />
        </Container>
    )
}

export default Home