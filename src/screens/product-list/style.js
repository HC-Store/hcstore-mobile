import styled from "styled-components/native";

/* ------------------------------------------------------------------ */
/*  CORES                                                              */
/* ------------------------------------------------------------------ */

const BG = "#070707";
const SURFACE = "#111111";
const BORDER = "#222222";
const ACCENT = "#00E640";
const TEXT = "#F5F5F5";
const MUTED = "#8C8C8C";
const FAINT = "#4A4A4A";

/* ------------------------------------------------------------------ */
/*  ESTRUTURA                                                          */
/* ------------------------------------------------------------------ */

const Container = styled.View`
    flex: 1;
    background-color: ${BG};
`;

const HeaderIcon = styled.Text`
    color: ${TEXT};
    margin-left: auto;
`;

/* ------------------------------------------------------------------ */
/*  TOPO                                                               */
/* ------------------------------------------------------------------ */

const TopContainer = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px 18px 20px;
`;

const PageTitle = styled.Text`
    color: ${TEXT};
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -1px;
`;

const FilterButton = styled.TouchableOpacity`
    height: 38px;
    padding: 0 16px;
    border-radius: 999px;
    border-width: 1.5px;
    border-color: ${ACCENT};
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
`;

const FilterText = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.5px;
`;

/* ------------------------------------------------------------------ */
/*  LISTA                                                              */
/* ------------------------------------------------------------------ */

const ProductsList = styled.FlatList`
    width: 100%;
    padding: 0 12px;
`;

const ProductCard = styled.View`
    width: 48%;
    margin: 1%;
    margin-bottom: 16px;
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    border-radius: 18px;
    overflow: hidden;
`;

const ProductImage = styled.Text`
    width: 100%;
    height: 145px;
    background-color: #161616;
    color: ${FAINT};
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -1px;
    text-align: center;
    text-align-vertical: center;
    line-height: 145px;
`;

const ProductName = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 600;
    line-height: 19px;
    margin: 12px 12px 0 12px;
`;

const ProductPrice = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
    margin: 4px 12px 12px 12px;
`;

const BuyButton = styled.TouchableOpacity`
    height: 40px;
    margin: 0 12px 12px 12px;
    border-radius: 12px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
`;

const BuyButtonText = styled.Text`
    color: #000000;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 2px;
`;

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
};