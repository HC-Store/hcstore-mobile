import {
    Container,
    Content,
    Category,
    CategoryTitle,
    Section,
    SectionTitle,
    SectionSubTitle,
    ProductCard,
    ProductImagePlaceholder,
    
} from "./style"

import { useNavigation } from "@react-navigation/native"

import Header from "../../components/header"

import BottomMenu from "../../components/bottom-menu"

const Home = () => {
    const navigation = useNavigation()


    return (
        <Container>

            
            <Header />


            <Content>

                <Category onPress={() => navigation.navigate("ProductList")}>
                    <CategoryTitle>Tênis</CategoryTitle>
                </Category>

                <Category onPress={() => navigation.navigate("ProductList")}>
                    <CategoryTitle>Roupas</CategoryTitle>
                </Category>

                <Category onPress={() => navigation.navigate("ProductList")}>
                    <CategoryTitle>Bonés</CategoryTitle>
                </Category>

                <Category onPress={() => navigation.navigate("ProductList")}>
                    <CategoryTitle>Acessórios</CategoryTitle>
                </Category>

                <Category onPress={() => navigation.navigate("ProductList")}>
                    <CategoryTitle>Ofertas</CategoryTitle>
                </Category>


                <Section>

                    <SectionTitle>
                        Novidades
                    </SectionTitle>

                    <SectionSubTitle>
                        Últimos lançamentos
                    </SectionSubTitle>


                    <ProductCard>
                        <ProductImagePlaceholder>
                            PRODUTO 01
                        </ProductImagePlaceholder>
                    </ProductCard>


                    <ProductCard>
                        <ProductImagePlaceholder>
                            PRODUTO 02
                        </ProductImagePlaceholder>
                    </ProductCard>

                </Section>

            </Content>


            <BottomMenu active="Home" />

        </Container>
    )
}


export default Home