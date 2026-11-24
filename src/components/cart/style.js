import styled from "styled-components/native"
import { Platform, StatusBar } from "react-native"

/* ------------------------------------------------------------------ */
/*  CORES                                                              */
/* ------------------------------------------------------------------ */

const BG = "#0A0A0A"
const SURFACE = "#111111"
const SURFACE_2 = "#171717"
const BORDER = "#222222"
const ACCENT = "#00E640"
const TEXT = "#F5F5F5"
const MUTED = "#8C8C8C"
const FAINT = "#4A4A4A"

const TOP_SPACE = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44

/* ------------------------------------------------------------------ */
/*  ESTRUTURA                                                          */
/* ------------------------------------------------------------------ */

const Overlay = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.7);
    align-items: flex-end;
`

const Drawer = styled.View`
    width: 88%;
    height: 100%;
    background-color: ${BG};
    border-left-width: 1px;
    border-left-color: ${BORDER};
    padding-top: ${TOP_SPACE}px;
`

/* ------------------------------------------------------------------ */
/*  CABEÇALHO                                                          */
/* ------------------------------------------------------------------ */

const CartHeader = styled.View`
    width: 100%;
    height: 72px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom-width: 1px;
    border-bottom-color: ${BORDER};
`

const CartTitle = styled.Text`
    color: ${TEXT};
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 2.5px;
`

const CloseButton = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    align-items: center;
    justify-content: center;
`

/* ------------------------------------------------------------------ */
/*  LISTA                                                              */
/* ------------------------------------------------------------------ */

const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { padding: 20, paddingBottom: 40 }
})`
    flex: 1;
`

const ProductCard = styled.View`
    width: 100%;
    flex-direction: row;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
`

const ProductImage = styled.Text`
    width: 88px;
    height: 108px;
    border-radius: 14px;
    overflow: hidden;
    background-color: ${SURFACE_2};
    color: ${FAINT};
    font-size: 18px;
    font-weight: 900;
    text-align: center;
    text-align-vertical: center;
    line-height: 108px;
    margin-right: 14px;
`

const ProductInfo = styled.View`
    flex: 1;
    position: relative;
`

const ProductName = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 700;
    line-height: 19px;
    padding-right: 30px;
`

const ProductDetails = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 5px;
`

const ProductPrice = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
    margin-top: 8px;
`

const RemoveButton = styled.TouchableOpacity`
    position: absolute;
    right: -4px;
    top: -4px;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    align-items: center;
    justify-content: center;
    z-index: 10;
`

/* ------------------------------------------------------------------ */
/*  QUANTIDADE                                                         */
/* ------------------------------------------------------------------ */

const QuantityContainer = styled.View`
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    height: 36px;
    margin-top: 12px;
    border-radius: 10px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE_2};
    overflow: hidden;
`

const QuantityButton = styled.TouchableOpacity`
    width: 34px;
    height: 36px;
    align-items: center;
    justify-content: center;
`

const QuantityText = styled.Text`
    min-width: 30px;
    height: 36px;
    color: ${TEXT};
    font-size: 14px;
    font-weight: 900;
    text-align: center;
    text-align-vertical: center;
    line-height: 36px;
`

/* ------------------------------------------------------------------ */
/*  RESUMO                                                             */
/* ------------------------------------------------------------------ */

const Summary = styled.View`
    width: 100%;
    padding: 18px;
    margin-top: 12px;
    margin-bottom: 30px;
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
`

const SummaryRow = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`

const SummaryLabel = styled.Text`
    color: ${MUTED};
    font-size: 13px;
`

const SummaryValue = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 700;
`

const TotalLabel = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 800;
`

const TotalValue = styled.Text`
    color: ${ACCENT};
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.5px;
`

const CheckoutButton = styled.TouchableOpacity`
    width: 100%;
    height: 58px;
    margin-top: 16px;
    border-radius: 16px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.3;
    shadow-radius: 16px;
    elevation: 6;
`

const CheckoutButtonText = styled.Text`
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2.5px;
`

/* ------------------------------------------------------------------ */
/*  SACOLA VAZIA                                                       */
/* ------------------------------------------------------------------ */

const EmptyCart = styled.View`
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 80px 24px 0 24px;
`

const EmptyCartIcon = styled.View`
    width: 84px;
    height: 84px;
    border-radius: 42px;
    background-color: rgba(0, 230, 64, 0.1);
    border-width: 1.5px;
    border-color: rgba(0, 230, 64, 0.35);
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`

const EmptyCartTitle = styled.Text`
    color: ${TEXT};
    font-size: 20px;
    font-weight: 900;
    text-align: center;
    margin-bottom: 8px;
`

const EmptyCartText = styled.Text`
    color: ${MUTED};
    font-size: 14px;
    line-height: 21px;
    text-align: center;
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