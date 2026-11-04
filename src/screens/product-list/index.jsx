import {
    Container,
    TopContainer,
    PageTitle,
    FilterButton,
    FilterText,
    ProductsList,
    ProductCard,
    ProductImage,
    ProductName,
    ProductPrice,
    BuyButton,
    BuyButtonText
} from "./style"

import { useEffect, useState } from "react"
import { ActivityIndicator, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { getProdutos } from "../../services/api"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"




const ProductList = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const categoriaId = route.params?.categoriaId
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProdutos()
            .then((data) =>
                setProducts(
                    categoriaId
                        ? data.filter((p) => p.categoriaId === categoriaId)
                        : data
                )
            )
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [categoriaId])

    const formatPrice = (value) =>
        Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

    const renderProduct = ({ item }) => {

        return (
            <ProductCard>

                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: "100%", height: 145 }}
                        resizeMode="cover"
                    />
                ) : (
                    <ProductImage>
                        IMAGEM
                    </ProductImage>
                )}

                <ProductName>
                    {item.nome}
                </ProductName>

                <ProductPrice>
                    {formatPrice(item.preco)}
                </ProductPrice>

                <BuyButton onPress={() => navigation.navigate("ProductDetails", { product: item })}>
                    <BuyButtonText>
                        COMPRAR
                    </BuyButtonText>
                </BuyButton>

            </ProductCard>
        )
    }


    return (
        <Container>

            <Header />


            <TopContainer>

                <PageTitle>
                    Produtos
                </PageTitle>

                <FilterButton>
                    <FilterText>
                        FILTRAR
                    </FilterText>
                </FilterButton>

            </TopContainer>


            <ProductsList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => String(item.id)}
                ListEmptyComponent={loading ? <ActivityIndicator color="#000" /> : null}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                paddingBottom: 80
            }}
            />

            <BottomMenu active="Catalog" />

        </Container>
    )
}


export default ProductList