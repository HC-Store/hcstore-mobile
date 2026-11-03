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
import { ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { getProdutos } from "../../services/api"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"




const ProductList = () => {
    const navigation = useNavigation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProdutos()
            .then((data) => setProducts(data.filter((p) => p.ativo !== false)))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [])

    const formatPrice = (value) =>
        Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

    const renderProduct = ({ item }) => {

        return (
            <ProductCard>

                <ProductImage>
                    IMAGEM
                </ProductImage>

                <ProductName>
                    {item.nome}
                </ProductName>

                <ProductPrice>
                    {formatPrice(item.preco)}
                </ProductPrice>

                <BuyButton onPress={() => navigation.navigate("ProductDetails", { id: item.id })}>
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