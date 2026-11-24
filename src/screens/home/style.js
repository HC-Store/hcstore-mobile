import styled from "styled-components/native"

/* ------------------------------------------------------------------ */
/*  TEMA                                                               */
/* ------------------------------------------------------------------ */

const BG = "#070707"
const SURFACE = "#111111"
const BORDER = "#222222"
const ACCENT = "#00E640"
const TEXT = "#F5F5F5"
const MUTED = "#8C8C8C"
const FAINT = "#4A4A4A"

/* ------------------------------------------------------------------ */
/*  ESTRUTURA                                                          */
/* ------------------------------------------------------------------ */

export const Container = styled.View`
    flex: 1;
    background-color: ${BG};
`

export const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { paddingTop: 8, paddingBottom: 120 }
})`
    flex: 1;
`

/* ------------------------------------------------------------------ */
/*  BANNER                                                             */
/* ------------------------------------------------------------------ */

export const Hero = styled.View`
    margin: 8px 24px 32px 24px;
    padding: 24px;
    border-radius: 24px;
    background-color: ${ACCENT};
    overflow: hidden;
`

export const HeroWatermark = styled.Text`
    position: absolute;
    right: -18px;
    bottom: -40px;
    font-size: 170px;
    font-weight: 900;
    letter-spacing: -10px;
    color: #000000;
    opacity: 0.08;
`

export const HeroTag = styled.View`
    align-self: flex-start;
    background-color: #000000;
    border-radius: 999px;
    padding: 5px 11px;
    margin-bottom: 16px;
`

export const HeroTagText = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 2px;
`

export const HeroTitle = styled.Text`
    color: #000000;
    font-size: 38px;
    line-height: 40px;
    font-weight: 900;
    letter-spacing: -1.5px;
`

export const HeroSubtitle = styled.Text`
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    margin-top: 10px;
    max-width: 220px;
`

export const HeroBtn = styled.TouchableOpacity`
    align-self: flex-start;
    background-color: #000000;
    border-radius: 14px;
    padding: 14px 20px;
    margin-top: 22px;
`

export const HeroBtnText = styled.Text`
    color: ${TEXT};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
`

/* ------------------------------------------------------------------ */
/*  CATEGORIAS                                                         */
/* ------------------------------------------------------------------ */

export const ChipsScroll = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingHorizontal: 24 }
})`
    flex-grow: 0;
    margin-bottom: 36px;
`

export const Chip = styled.TouchableOpacity`
    height: 42px;
    padding: 0 18px;
    margin-right: 10px;
    border-radius: 999px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$active ? ACCENT : BORDER)};
    background-color: ${(p) => (p.$active ? "rgba(0, 230, 64, 0.1)" : SURFACE)};
    align-items: center;
    justify-content: center;
`

export const ChipText = styled.Text`
    color: ${(p) => (p.$active ? ACCENT : TEXT)};
    font-size: 13px;
    font-weight: 700;
`

/* ------------------------------------------------------------------ */
/*  SEÇÃO                                                              */
/* ------------------------------------------------------------------ */

export const Section = styled.View`
    padding: 0 24px;
`

export const SectionHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const SectionTitle = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 2.5px;
`

export const SectionSubTitle = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 4px;
    margin-bottom: 18px;
`

export const SeeAll = styled.TouchableOpacity`
    padding: 4px 0;
`

export const SeeAllText = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
`

/* ------------------------------------------------------------------ */
/*  PRODUTOS                                                           */
/* ------------------------------------------------------------------ */

export const Grid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`

export const ProductCard = styled.TouchableOpacity`
    margin-bottom: 22px;
`

export const ImageBox = styled.View`
    width: 100%;
    border-radius: 18px;
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    overflow: hidden;
    align-items: center;
    justify-content: center;
`

export const ProductImagePlaceholder = styled.Text`
    color: ${FAINT};
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -2px;
`

export const NewTag = styled.View`
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: ${ACCENT};
    border-radius: 999px;
    padding: 4px 9px;
`

export const NewTagText = styled.Text`
    color: #000000;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1.2px;
`

export const ProductName = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 600;
    line-height: 19px;
    margin-top: 12px;
`

export const ProductPrice = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
    margin-top: 4px;
`

/* Carregamento */
export const SkeletonLine = styled.View`
    height: 12px;
    border-radius: 6px;
    background-color: ${SURFACE};
    margin-top: 12px;
`

/* ------------------------------------------------------------------ */
/*  VAZIO / ERRO                                                       */
/* ------------------------------------------------------------------ */

export const EmptyBox = styled.View`
    padding: 32px 20px;
    border-radius: 18px;
    border-width: 1px;
    border-style: dashed;
    border-color: ${BORDER};
    align-items: center;
`

export const EmptyText = styled.Text`
    color: ${MUTED};
    font-size: 14px;
    text-align: center;
`

export const RetryBtn = styled.TouchableOpacity`
    margin-top: 16px;
    padding: 12px 18px;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${ACCENT};
`

export const RetryText = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.5px;
`