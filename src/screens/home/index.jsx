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

import { useEffect, useState } from "react"
import { Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { getCategorias, getProdutos } from "../../services/api"

import Header from "../../components/header"

import BottomMenu from "../../components/bottom-menu"

const Home = () => {
    const navigation = useNavigation()
    const [categorias, setCategorias] = useState([])
    const [novidades, setNovidades] = useState([])

    useEffect(() => {
        getCategorias().then(setCategorias).catch(() => setCategorias([]))

        getProdutos()
            .then((data) =>
                setNovidades([...data].sort((a, b) => b.id - a.id).slice(0, 2))
            )
            .catch(() => setNovidades([]))
    }, [])


    return (
        <Container>

            
            <Header />


            <Content>

                {categorias.map((categoria) => (
                    <Category
                        key={categoria.id}
                        onPress={() =>
                            navigation.navigate("ProductList", { categoriaId: categoria.id })
                        }
                    >
                        <CategoryTitle>{categoria.nome}</CategoryTitle>
                    </Category>
                ))}

                <Category onPress={() => navigation.navigate("ProductList")}>
                    <CategoryTitle>Todos os produtos</CategoryTitle>
                </Category>


                <Section>

                    <SectionTitle>
                        Novidades
                    </SectionTitle>

                    <SectionSubTitle>
                        Últimos lançamentos
                    </SectionSubTitle>


                    {novidades.map((product) => (
                        <ProductCard key={product.id}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                activeOpacity={0.9}
                                onPress={() =>
                                    navigation.navigate("ProductDetails", { product })
                                }
                            >
                                {product.image ? (
                                    <Image
                                        source={{ uri: product.image }}
                                        style={{ flex: 1 }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <ProductImagePlaceholder>
                                        {product.name}
                                    </ProductImagePlaceholder>
                                )}
                            </TouchableOpacity>
                        </ProductCard>
                    ))}

                </Section>

            </Content>


            <BottomMenu active="Home" />

        </Container>
    )
}


export default Home