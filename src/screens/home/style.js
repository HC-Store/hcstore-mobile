import styled from "styled-components/native";


const Container = styled.View`
    flex: 1;
    background-color: #FFFFFF;
`


const LogoHC = styled.Text`
    color: #FFFFFF;

    font-size: 12px;
    font-weight: bold;
`


const LogoStore = styled.Text`
    color: #00FF00;

    font-size: 12px;
    font-weight: bold;

    margin-left: 3px;
`


const HeaderIcon = styled.Text`
    color: #FFFFFF;

    margin-left: auto;
`


const Content = styled.ScrollView`
    flex: 1;
`


const Category = styled.TouchableOpacity`
    width: 100%;
    height: 100px;

    background-color: #BDBDBD;

    padding: 10px;

    margin-bottom: 4px;
`


const CategoryTitle = styled.Text`
    color: #FFFFFF;

    font-size: 12px;
    font-weight: bold;
`


const Section = styled.View`
    width: 100%;

    background-color: #000000;

    padding-top: 8px;
`


const SectionTitle = styled.Text`
    color: #00FF00;

    font-size: 16px;
    font-weight: bold;

    padding-left: 8px;
`


const SectionSubTitle = styled.Text`
    color: #FFFFFF;

    font-size: 10px;
    font-weight: bold;

    padding-left: 8px;

    margin-top: 3px;
    margin-bottom: 8px;
`


const ProductCard = styled.View`
    width: 100%;
    height: 230px;

    background-color: #FFFFFF;

    margin-bottom: 4px;
`


const ProductImagePlaceholder = styled.Text`
    flex: 1;

    color: #777777;

    text-align: center;
    text-align-vertical: center;
`



export {
    Container,
    Content,
    Category,
    CategoryTitle,
    Section,
    SectionTitle,
    SectionSubTitle,
    ProductCard,
    ProductImagePlaceholder,
}