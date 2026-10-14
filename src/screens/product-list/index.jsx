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

import { useNavigation } from "@react-navigation/native"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"


const products = [
    {
        id: "1",
        name: "Nome do Produto",
        price: "R$ 199,90"
    },
    {
        id: "2",
        name: "Nome do Produto",
        price: "R$ 199,90"
    },
    {
        id: "3",
        name: "Nome do Produto",
        price: "R$ 189,90"
    },
    {
        id: "4",
        name: "Nome do Produto",
        price: "R$ 189,90"
    },
    {
        id: "5",
        name: "Nome do Produto",
        price: "R$ 159,90"
    },
    {
        id: "6",
        name: "Nome do Produto",
        price: "R$ 159,90"
    }
]


const ProductList = () => {
      const navigation = useNavigation()

    const renderProduct = ({ item }) => {

        return (
            <ProductCard>

                <ProductImage>
                    IMAGEM
                </ProductImage>

                <ProductName>
                    {item.name}
                </ProductName>

                <ProductPrice>
                    {item.price}
                </ProductPrice>

                <BuyButton onPress={() => navigation.navigate("ProductDetails")}>
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
                keyExtractor={(item) => item.id}
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