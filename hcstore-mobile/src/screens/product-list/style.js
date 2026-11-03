import styled from "styled-components/native";


const Container = styled.View`
    flex: 1;
    background-color: #FFFFFF;
`


const HeaderIcon = styled.Text`
    color: #FFFFFF;

    margin-left: auto;
`


const TopContainer = styled.View`
    width: 100%;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 12px;
`


const PageTitle = styled.Text`
    color: #000000;

    font-size: 16px;
    font-weight: bold;
`


const FilterButton = styled.TouchableOpacity`
    background-color: #000000;

    padding: 7px 12px;

    border-radius: 3px;
`


const FilterText = styled.Text`
    color: #00FF00;

    font-size: 9px;
    font-weight: bold;
`


const ProductsList = styled.FlatList`
    width: 100%;

    padding: 0 8px;
`


const ProductCard = styled.View`
    width: 48%;

    margin: 1%;
    margin-bottom: 18px;
`


const ProductImage = styled.Text`
    width: 100%;
    height: 145px;

    background-color: #BDBDBD;

    color: #FFFFFF;

    text-align: center;
    text-align-vertical: center;
`


const ProductName = styled.Text`
    color: #000000;

    font-size: 11px;
    font-weight: bold;

    margin-top: 6px;
`


const ProductPrice = styled.Text`
    color: #000000;

    font-size: 10px;

    margin-top: 3px;
    margin-bottom: 6px;
`


const BuyButton = styled.TouchableOpacity`
    width: 100%;

    background-color: #00FF00;

    padding: 7px;

    align-items: center;
`


const BuyButtonText = styled.Text`
    color: #000000;

    font-size: 9px;
    font-weight: bold;
`


export {
    Container,
    HeaderIcon,
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
}