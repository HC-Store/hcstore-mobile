
import styled from "styled-components/native"

const Container = styled.View`
    flex: 1;
    background-color: #FFFFFF;
`

const Content = styled.ScrollView`
    flex: 1;
    padding: 15px;
`

/* INFORMAÇÕES DO PRODUTO */

const ProductTitle = styled.Text`
    color: #000000;
    font-size: 18px;
    font-weight: bold;
`

const ProductCode = styled.Text`
    color: #777777;
    font-size: 9px;
    margin-top: 3px;
    margin-bottom: 12px;
`

/* IMAGEM PRINCIPAL */

const ImageWrapper = styled.View`
    width: 100%;
    position: relative;
`

const MainImage = styled.Text`
    width: 100%;
    height: 280px;
    background-color: #D9D9D9;
    color: #777777;
    text-align: center;
    text-align-vertical: center;
`

/* CORAÇÃO SOBRE A IMAGEM */

const FavoriteButton = styled.TouchableOpacity`
    position: absolute;
    top: 12px;
    right: 12px;

    width: 36px;
    height: 36px;
    border-radius: 18px;

    background-color: #FFFFFF;

    align-items: center;
    justify-content: center;

    z-index: 10;
    elevation: 3;
`

/* MINIATURAS */

const ThumbnailsContainer = styled.View`
    width: 100%;
    flex-direction: row;
    margin-top: 8px;
    margin-bottom: 15px;
`

const Thumbnail = styled.Text`
    width: 55px;
    height: 55px;
    background-color: #D9D9D9;
    color: #777777;
    text-align: center;
    text-align-vertical: center;
    margin-right: 8px;
`

/* PREÇO */

const Price = styled.Text`
    color: #000000;
    font-size: 18px;
    font-weight: bold;
`

const Installment = styled.Text`
    color: #777777;
    font-size: 10px;
    margin-top: 3px;
    margin-bottom: 12px;
`

/* BOTÃO ADICIONAR AO CARRINHO */

const BuyButton = styled.TouchableOpacity`
    width: 100%;
    height: 42px;
    background-color: #00FF00;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
`

const BuyButtonText = styled.Text`
    color: #000000;
    font-size: 12px;
    font-weight: bold;
`

/* INFORMAÇÕES DE ENTREGA */

const InfoHighlight = styled.Text`
    color: #00B900;
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 3px;
`

const InfoText = styled.Text`
    color: #555555;
    font-size: 9px;
    margin-bottom: 15px;
`

/* ACCORDIONS */

const Accordion = styled.TouchableOpacity`
    width: 100%;
    height: 42px;
    background-color: #000000;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    margin-bottom: 5px;
`

const AccordionText = styled.Text`
    color: #FFFFFF;
    font-size: 10px;
    font-weight: bold;
`

const AccordionIcon = styled.Text`
    color: #00FF00;
    font-size: 18px;
`

/* EXPORTAÇÃO DOS COMPONENTES */

export {
    Container,
    Content,
    ProductTitle,
    ProductCode,
    MainImage,
    ImageWrapper,
    FavoriteButton,
    ThumbnailsContainer,
    Thumbnail,
    Price,
    Installment,
    BuyButton,
    BuyButtonText,
    InfoText,
    InfoHighlight,
    Accordion,
    AccordionText,
    AccordionIcon,
}

