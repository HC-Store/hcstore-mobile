import { useCallback, useEffect, useMemo, useState } from "react"
import { Dimensions, Image, RefreshControl, Platform, StatusBar } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import styled from "styled-components/native"

import { getCategorias, getProdutos } from "../../services/api"
import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

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

const ORDENS = [
    { key: "recentes", label: "Mais recentes" },
    { key: "menor", label: "Menor preço" },
    { key: "maior", label: "Maior preço" }
]

const formatPrice = (value) =>
    `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`

/* ================================================================== */
/*  TELA                                                               */
/* ================================================================== */

const ProductList = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const categoriaParam = route.params?.categoriaId ?? null

    const [products, setProducts] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [erro, setErro] = useState(false)

    const [busca, setBusca] = useState("")
    const [categoriaSel, setCategoriaSel] = useState(categoriaParam)
    const [ordem, setOrdem] = useState("recentes")
    const [mostrarFiltros, setMostrarFiltros] = useState(false)

    // Se vier outra categoria pela navegação, atualiza o filtro
    useEffect(() => {
        setCategoriaSel(categoriaParam)
    }, [categoriaParam])

    const carregar = useCallback(async () => {
        setErro(false)

        const [prods, cats] = await Promise.allSettled([
            getProdutos(),
            getCategorias()
        ])

        setCategorias(cats.status === "fulfilled" ? cats.value : [])

        if (prods.status === "fulfilled") {
            setProducts(prods.value)
        } else {
            setProducts([])
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

    const limparFiltros = () => {
        setBusca("")
        setCategoriaSel(null)
        setOrdem("recentes")
    }

    // Aplica categoria, busca e ordenação
    const visiveis = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        let lista = products.filter((p) => {
            const nome = (p.name ?? p.nome ?? "").toLowerCase()
            const okCategoria = categoriaSel ? p.categoriaId === categoriaSel : true
            const okBusca = termo ? nome.includes(termo) : true
            return okCategoria && okBusca
        })

        if (ordem === "menor") lista = [...lista].sort((a, b) => a.price - b.price)
        else if (ordem === "maior") lista = [...lista].sort((a, b) => b.price - a.price)
        else lista = [...lista].sort((a, b) => b.id - a.id)

        return lista
    }, [products, busca, categoriaSel, ordem])

    const tituloCategoria =
        categorias.find((c) => c.id === categoriaSel)?.nome || "Todos os produtos"

    /* ---------- CARD ---------- */

    const renderProduct = ({ item }) => {
        const abrir = () => navigation.navigate("ProductDetails", { product: item })

        return (
            <ProductCard style={{ width: CARD_WIDTH }} onPress={abrir} activeOpacity={0.85}>
                <ImageBox style={{ height: CARD_WIDTH * 1.25 }}>
                    {item.image ? (
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    ) : (
                        <ProductImage>HC</ProductImage>
                    )}
                </ImageBox>

                <ProductName numberOfLines={2}>
                    {item.name ?? item.nome}
                </ProductName>

                <PriceRow>
                    <ProductPrice>{formatPrice(item.price ?? item.preco)}</ProductPrice>

                    <BuyButton onPress={abrir} activeOpacity={0.8}>
                        <BuyButtonText>→</BuyButtonText>
                    </BuyButton>
                </PriceRow>
            </ProductCard>
        )
    }

    /* ---------- ESTADOS VAZIOS ---------- */

    const renderEmpty = () => {
        if (loading) {
            return (
                <SkeletonGrid>
                    {[1, 2, 3, 4].map((i) => (
                        <ProductCard key={i} style={{ width: CARD_WIDTH }} disabled>
                            <ImageBox style={{ height: CARD_WIDTH * 1.25 }} />
                            <SkeletonLine style={{ width: "80%" }} />
                            <SkeletonLine style={{ width: "45%" }} />
                        </ProductCard>
                    ))}
                </SkeletonGrid>
            )
        }

        if (erro) {
            return (
                <EmptyBox>
                    <EmptyTitle>Ops, algo deu errado</EmptyTitle>
                    <EmptyText>Não foi possível carregar os produtos.</EmptyText>
                    <RetryBtn onPress={onRefresh} activeOpacity={0.8}>
                        <RetryText>TENTAR NOVAMENTE</RetryText>
                    </RetryBtn>
                </EmptyBox>
            )
        }

        return (
            <EmptyBox>
                <EmptyTitle>Nada por aqui</EmptyTitle>
                <EmptyText>
                    {busca.trim()
                        ? `Nenhum produto encontrado para "${busca.trim()}".`
                        : "Nenhum produto nesta categoria ainda."}
                </EmptyText>
                <RetryBtn onPress={limparFiltros} activeOpacity={0.8}>
                    <RetryText>LIMPAR FILTROS</RetryText>
                </RetryBtn>
            </EmptyBox>
        )
    }

    return (
        <Container>
            <StatusBar backgroundColor={BG} barStyle="light-content" />

            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            {/* TOPO */}

            <Top>
                <TopRow>
                    <Eyebrow>CATÁLOGO</Eyebrow>

                    <FilterButton
                        $active={mostrarFiltros}
                        onPress={() => setMostrarFiltros((v) => !v)}
                        activeOpacity={0.8}
                    >
                        <FilterText $active={mostrarFiltros}>
                            {mostrarFiltros ? "FECHAR" : "FILTRAR"}
                        </FilterText>
                    </FilterButton>
                </TopRow>

                <PageTitle numberOfLines={1}>{tituloCategoria}</PageTitle>

                {!loading && !erro && (
                    <CountText>
                        {visiveis.length} {visiveis.length === 1 ? "produto" : "produtos"}
                    </CountText>
                )}

                {/* BUSCA */}

                <SearchBox>
                    <SearchInput
                        placeholder="Buscar produto..."
                        value={busca}
                        onChangeText={setBusca}
                        returnKeyType="search"
                        autoCorrect={false}
                    />

                    {!!busca && (
                        <ClearBtn onPress={() => setBusca("")} activeOpacity={0.7}>
                            <ClearText>LIMPAR</ClearText>
                        </ClearBtn>
                    )}
                </SearchBox>
            </Top>

            {/* CATEGORIAS */}

            <ChipsScroll>
                <Chip
                    $active={!categoriaSel}
                    onPress={() => setCategoriaSel(null)}
                    activeOpacity={0.8}
                >
                    <ChipText $active={!categoriaSel}>Todos</ChipText>
                </Chip>

                {categorias.map((c) => (
                    <Chip
                        key={c.id}
                        $active={categoriaSel === c.id}
                        onPress={() => setCategoriaSel(c.id)}
                        activeOpacity={0.8}
                    >
                        <ChipText $active={categoriaSel === c.id}>{c.nome}</ChipText>
                    </Chip>
                ))}
            </ChipsScroll>

            {/* ORDENAÇÃO (aparece ao tocar em FILTRAR) */}

            {mostrarFiltros && (
                <>
                    <SortLabel>ORDENAR POR</SortLabel>

                    <ChipsScroll>
                        {ORDENS.map((o) => (
                            <Chip
                                key={o.key}
                                $active={ordem === o.key}
                                onPress={() => setOrdem(o.key)}
                                activeOpacity={0.8}
                            >
                                <ChipText $active={ordem === o.key}>{o.label}</ChipText>
                            </Chip>
                        ))}
                    </ChipsScroll>
                </>
            )}

            {/* LISTA */}

            <ProductsList
                data={loading || erro ? [] : visiveis}
                renderItem={renderProduct}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                ListEmptyComponent={renderEmpty}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={ACCENT}
                        colors={[ACCENT]}
                        progressBackgroundColor="#111111"
                    />
                }
            />

            <BottomMenu active="Catalog" />
        </Container>
    )
}

export default ProductList

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

/* Topo */

const Top = styled.View`
    padding: 12px 24px 0 24px;
`

const TopRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const Eyebrow = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2.5px;
`

const PageTitle = styled.Text`
    color: ${TEXT};
    font-size: 32px;
    line-height: 36px;
    font-weight: 900;
    letter-spacing: -1px;
    margin-top: 6px;
`

const CountText = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 4px;
`

const FilterButton = styled.TouchableOpacity`
    height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$active ? ACCENT : BORDER)};
    background-color: ${(p) => (p.$active ? ACCENT : SURFACE)};
    align-items: center;
    justify-content: center;
`

const FilterText = styled.Text`
    color: ${(p) => (p.$active ? "#000000" : TEXT)};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

/* Busca */

const SearchBox = styled.View`
    height: 52px;
    margin-top: 18px;
    margin-bottom: 16px;
    padding: 0 16px;
    border-radius: 14px;
    border-width: 1.5px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    flex-direction: row;
    align-items: center;
`

const SearchInput = styled.TextInput.attrs({
    placeholderTextColor: FAINT,
    selectionColor: ACCENT
})`
    flex: 1;
    height: 100%;
    color: ${TEXT};
    font-size: 15px;
`

const ClearBtn = styled.TouchableOpacity`
    padding: 6px 0 6px 10px;
`

const ClearText = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
`

/* Chips (categorias / ordenação) */

const ChipsScroll = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: { paddingHorizontal: 24 }
})`
    flex-grow: 0;
    margin-bottom: 16px;
`

const Chip = styled.TouchableOpacity`
    height: 38px;
    padding: 0 16px;
    margin-right: 8px;
    border-radius: 999px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$active ? ACCENT : BORDER)};
    background-color: ${(p) => (p.$active ? "rgba(0, 230, 64, 0.1)" : SURFACE)};
    align-items: center;
    justify-content: center;
`

const ChipText = styled.Text`
    color: ${(p) => (p.$active ? ACCENT : TEXT)};
    font-size: 13px;
    font-weight: 700;
`

const SortLabel = styled.Text`
    color: ${FAINT};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    margin: 0 24px 10px 24px;
`

/* Lista */

const ProductsList = styled.FlatList.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { paddingTop: 4, paddingBottom: 120, flexGrow: 1 },
    columnWrapperStyle: { justifyContent: "space-between", paddingHorizontal: 24 }
})`
    flex: 1;
`

const ProductCard = styled.TouchableOpacity`
    margin-bottom: 24px;
`

const ImageBox = styled.View`
    width: 100%;
    border-radius: 18px;
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    overflow: hidden;
    align-items: center;
    justify-content: center;
`

const ProductImage = styled.Text`
    color: ${FAINT};
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -2px;
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

const BuyButton = styled.TouchableOpacity`
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
`

const BuyButtonText = styled.Text`
    color: #000000;
    font-size: 16px;
    font-weight: 900;
`

/* Carregamento */

const SkeletonGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 24px;
`

const SkeletonLine = styled.View`
    height: 12px;
    border-radius: 6px;
    background-color: ${SURFACE};
    margin-top: 12px;
`

/* Vazio / erro */

const EmptyBox = styled.View`
    margin: 8px 24px 0 24px;
    padding: 36px 20px;
    border-radius: 18px;
    border-width: 1px;
    border-style: dashed;
    border-color: ${BORDER};
    align-items: center;
`

const EmptyTitle = styled.Text`
    color: ${TEXT};
    font-size: 17px;
    font-weight: 900;
    margin-bottom: 6px;
`

const EmptyText = styled.Text`
    color: ${MUTED};
    font-size: 14px;
    line-height: 20px;
    text-align: center;
`

const RetryBtn = styled.TouchableOpacity`
    margin-top: 18px;
    padding: 12px 18px;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${ACCENT};
`

const RetryText = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.5px;
`