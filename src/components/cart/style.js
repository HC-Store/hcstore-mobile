import styled from "styled-components/native"


const Overlay = styled.View`
    flex: 1;

    background-color: rgba(0, 0, 0, 0.55);

    align-items: flex-end;
`


const Drawer = styled.View`
    width: 88%;
    height: 100%;

    background-color: #111111;
`


const CartHeader = styled.View`
    width: 100%;
    height: 65px;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: 0 18px;

    border-bottom-width: 1px;
    border-bottom-color: #292929;
`


const CartTitle = styled.Text`
    color: #FFFFFF;

    font-size: 20px;
    font-weight: bold;
`


const CloseButton = styled.TouchableOpacity`
    width: 40px;
    height: 40px;

    align-items: center;
    justify-content: center;
`


const Content = styled.ScrollView`
    flex: 1;

    padding: 15px;
`


const ProductCard = styled.View`
    width: 100%;

    background-color: #202020;

    flex-direction: row;

    padding: 12px;

    margin-bottom: 12px;
`


const ProductImage = styled.Text`
    width: 90px;
    height: 110px;

    background-color: #333333;

    color: #888888;

    text-align: center;
    text-align-vertical: center;

    font-size: 9px;

    margin-right: 12px;
`


const ProductInfo = styled.View`
    flex: 1;

    position: relative;
`


const ProductName = styled.Text`
    color: #FFFFFF;

    font-size: 13px;
    font-weight: bold;

    padding-right: 25px;
`


const ProductDetails = styled.Text`
    color: #999999;

    font-size: 11px;

    margin-top: 6px;
`


const ProductPrice = styled.Text`
    color: #FFFFFF;

    font-size: 13px;
    font-weight: bold;

    margin-top: 10px;
`


const RemoveButton = styled.TouchableOpacity`
    position: absolute;

    right: 0;
    top: 0;

    width: 36px;
    height: 36px;

    align-items: center;
    justify-content: center;

    z-index: 10;
`


const QuantityContainer = styled.View`
    flex-direction: row;
    align-items: center;

    margin-top: 12px;
`


const QuantityButton = styled.TouchableOpacity`
    width: 28px;
    height: 28px;

    background-color: #333333;

    align-items: center;
    justify-content: center;
`


const QuantityText = styled.Text`
    width: 35px;
    height: 28px;

    background-color: #FFFFFF;

    color: #000000;

    text-align: center;
    text-align-vertical: center;

    font-size: 11px;
`


const Summary = styled.View`
    width: 100%;

    background-color: #202020;

    padding: 16px;

    margin-top: 15px;
    margin-bottom: 40px;
`


const SummaryRow = styled.View`
    width: 100%;

    flex-direction: row;
    justify-content: space-between;

    margin-bottom: 14px;
`


const SummaryLabel = styled.Text`
    color: #AAAAAA;

    font-size: 11px;
`


const SummaryValue = styled.Text`
    color: #FFFFFF;

    font-size: 11px;
`


const TotalLabel = styled.Text`
    color: #FFFFFF;

    font-size: 16px;
    font-weight: bold;
`


const TotalValue = styled.Text`
    color: #FFFFFF;

    font-size: 16px;
    font-weight: bold;
`


const CheckoutButton = styled.TouchableOpacity`
    width: 100%;
    height: 48px;

    background-color: #00FF00;

    align-items: center;
    justify-content: center;

    margin-top: 12px;
`


const CheckoutButtonText = styled.Text`
    color: #000000;

    font-size: 12px;
    font-weight: bold;
`
const EmptyCart = styled.View`
    width: 100%;

    align-items: center;
    justify-content: center;

    padding-top: 90px;
    padding-left: 20px;
    padding-right: 20px;
`


const EmptyCartIcon = styled.View`
    margin-bottom: 18px;
`


const EmptyCartTitle = styled.Text`
    color: #FFFFFF;

    font-size: 18px;
    font-weight: bold;

    text-align: center;

    margin-bottom: 8px;
`


const EmptyCartText = styled.Text`
    color: #888888;

    font-size: 12px;

    text-align: center;
    line-height: 18px;
`


export {
    Overlay,
    Drawer,
    EmptyCart,
    EmptyCartIcon,
    EmptyCartTitle,
    EmptyCartText,
    CartHeader,
    CartTitle,
    CloseButton,
    Content,
    ProductCard,
    ProductImage,
    ProductInfo,
    ProductName,
    ProductDetails,
    ProductPrice,
    QuantityContainer,
    QuantityButton,
    QuantityText,
    RemoveButton,
    Summary,
    SummaryRow,
    SummaryLabel,
    SummaryValue,
    TotalLabel,
    TotalValue,
    CheckoutButton,
    CheckoutButtonText
}