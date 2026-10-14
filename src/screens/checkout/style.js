import styled from "styled-components/native"

const GREEN = "#00F064"
const BLACK = "#0D0D0D"
const GRAY = "#777777"

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #ffffff;
`

const Content = styled.ScrollView`
    flex: 1;
    padding-horizontal: 12px;
`

/* ETAPAS */

const StepsContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-vertical: 15px;
`

const Step = styled.View`
    align-items: center;
`

const StepCircle = styled.Text`
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background-color: ${({ completed }) =>
        completed ? GREEN : "#d9d9d9"};
    align-items: center;
    justify-content: center;
    color: ${({ completed }) =>
        completed ? "#000000" : "#777777"};
    font-size: 7px;
    font-weight: bold;
`

const StepText = styled.Text`
    font-size: 7px;
    margin-top: 3px;
    color: ${({ completed }) =>
        completed ? "#00a846" : "#888888"};
`

const StepLine = styled.View`
    width: 45px;
    height: 1px;
    margin-horizontal: 4px;
    margin-bottom: 12px;
    background-color: ${({ completed }) =>
        completed ? GREEN : "#dddddd"};
`

/* SECTION */

const Section = styled.View`
    margin-bottom: 14px;
`

const SectionHeader = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 7px;
`

const SectionNumber = styled.Text`
    width: 13px;
    height: 13px;
    background-color: ${GREEN};
    color: #000000;
    font-size: 7px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    margin-right: 6px;
`

const SectionTitle = styled.Text`
    flex: 1;
    color: #333333;
    font-size: 8px;
    font-weight: bold;
    letter-spacing: 0.6px;
`

const ChangeText = styled.Text`
    color: ${GREEN};
    font-size: 7px;
    font-weight: bold;
`

/* OPÇÕES */

const OptionCard = styled.TouchableOpacity`
    background-color: ${BLACK};
    padding: 10px;
    margin-bottom: 5px;
    border-width: ${({ selected }) => selected ? "1px" : "0px"};
    border-color: ${GREEN};
`

const OptionTop = styled.View`
    flex-direction: row;
`

const Radio = styled.View`
    width: 13px;
    height: 13px;
    border-radius: 7px;
    border-width: 1px;
    border-color: ${({ selected }) =>
        selected ? GREEN : "#666666"};
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    margin-top: 2px;
`

const RadioSelected = styled.View`
    width: 7px;
    height: 7px;
    border-radius: 4px;
    background-color: ${GREEN};
`

const OptionContent = styled.View`
    flex: 1;
`

const OptionTitle = styled.Text`
    color: #ffffff;
    font-size: 9px;
    font-weight: bold;
`

const OptionDescription = styled.Text`
    color: #999999;
    font-size: 7px;
    margin-top: 3px;
`

const OptionDetail = styled.Text`
    color: #777777;
    font-size: 7px;
    margin-top: 3px;
`

const GreenText = styled.Text`
    color: ${GREEN};
    font-size: 7px;
    font-weight: bold;
    margin-top: 6px;
`

const AddButton = styled.TouchableOpacity`
    height: 25px;
    border-width: 1px;
    border-color: ${GREEN};
    align-items: center;
    justify-content: center;
    margin-top: 9px;
`

const AddButtonText = styled.Text`
    color: ${GREEN};
    font-size: 7px;
    font-weight: bold;
`

/* PRODUTOS */

const ProductsContainer = styled.View`
    background-color: ${BLACK};
    padding-horizontal: 9px;
`

const ProductRow = styled.View`
    min-height: 65px;
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #252525;
`

const ProductImage = styled.View`
    width: 43px;
    height: 48px;
    background-color: #242424;
    margin-right: 9px;
`

const ProductInfo = styled.View`
    flex: 1;
`

const ProductName = styled.Text`
    color: #ffffff;
    font-size: 8px;
    font-weight: bold;
`

const ProductDetail = styled.Text`
    color: #777777;
    font-size: 6px;
    margin-top: 2px;
`

const ProductPrice = styled.Text`
    color: #ffffff;
    font-size: 8px;
    font-weight: bold;
`

/* RESUMO */

const CouponContainer = styled.View`
    background-color: ${BLACK};
    padding: 11px;
    margin-bottom: 12px;
`

const CouponTop = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 13px;
`

const CouponTitle = styled.Text`
    color: #ffffff;
    font-size: 7px;
    font-weight: bold;
`

const CouponBadge = styled.Text`
    color: ${GREEN};
    border-width: 1px;
    border-color: ${GREEN};
    font-size: 6px;
    padding-horizontal: 4px;
    padding-vertical: 2px;
    margin-left: 5px;
`

const DiscountText = styled.Text`
    color: ${GREEN};
    font-size: 8px;
    font-weight: bold;
    margin-left: auto;
`

const PriceRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 7px;
`

const PriceLabel = styled.Text`
    color: #999999;
    font-size: 7px;
`

const PriceValue = styled.Text`
    color: #ffffff;
    font-size: 7px;
`

const DiscountValue = styled.Text`
    color: ${GREEN};
    font-size: 7px;
    font-weight: bold;
`

const Divider = styled.View`
    height: 1px;
    background-color: #333333;
    margin-vertical: 8px;
`

const TotalRow = styled.View`
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
`

const TotalLabelArea = styled.View``

const TotalLabel = styled.Text`
    color: #ffffff;
    font-size: 11px;
    font-weight: bold;
`

const TotalInstallments = styled.Text`
    color: #777777;
    font-size: 6px;
    margin-top: 3px;
`

const TotalPrice = styled.Text`
    color: ${GREEN};
    font-size: 20px;
    font-weight: bold;
`

/* SEGURANÇA */

const SecurityContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 17px;
`

const SecurityItem = styled.View`
    width: 32%;
    min-height: 52px;
    background-color: #111111;
    align-items: center;
    justify-content: center;
`

const SecurityIcon = styled.Text`
    color: ${GREEN};
    font-size: 12px;
`

const SecurityTitle = styled.Text`
    color: #ffffff;
    font-size: 6px;
    font-weight: bold;
    margin-top: 4px;
`

const SecurityDescription = styled.Text`
    color: #777777;
    font-size: 5px;
    margin-top: 2px;
`

const TermsText = styled.Text`
    color: ${GRAY};
    font-size: 6px;
    text-align: center;
    line-height: 9px;
    margin-horizontal: 12px;
    margin-bottom: 10px;
`

const FinishButton = styled.TouchableOpacity`
    width: 100%;
    min-height: 43px;
    background-color: ${GREEN};
    align-items: center;
    justify-content: center;
`

const FinishButtonText = styled.Text`
    color: #000000;
    font-size: 8px;
    font-weight: bold;
`

/* HEADER CHECKOUT */

const CheckoutHeader = styled.View`
    width: 100%;
    height: 50px;

    background-color: #000000;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding-horizontal: 12px;
`

const BackButton = styled.TouchableOpacity`
    width: 42px;
    height: 42px;

    align-items: center;
    justify-content: center;
`

const CheckoutLogo = styled.View`
    flex-direction: row;
    align-items: center;
`

const CheckoutLogoHC = styled.Text`
    color: #FFFFFF;

    font-size: 15px;
    font-weight: bold;
`

const CheckoutLogoStore = styled.Text`
    color: #00FF00;

    font-size: 15px;
    font-weight: bold;

    margin-left: 4px;
`

const HeaderSpacer = styled.View`
    width: 42px;
    height: 42px;
`
/* OUTRO ENDEREÇO */

const AddressForm = styled.View`
    width: 100%;

    margin-top: 12px;
    padding-top: 12px;

    border-top-width: 1px;
    border-top-color: #333333;
`

const AddressLabel = styled.Text`
    color: #999999;

    font-size: 7px;
    font-weight: bold;

    margin-bottom: 5px;
    margin-top: 8px;
`

const CepRow = styled.View`
    width: 100%;

    flex-direction: row;
    align-items: center;
`

const CepInput = styled.TextInput`
    flex: 1;
    height: 38px;

    background-color: #1A1A1A;

    border-width: 1px;
    border-color: #333333;

    color: #FFFFFF;

    padding-horizontal: 10px;

    font-size: 10px;
`

const SearchCepButton = styled.TouchableOpacity`
    width: 90px;
    height: 38px;

    background-color: ${GREEN};

    align-items: center;
    justify-content: center;

    margin-left: 7px;
`

const SearchCepButtonText = styled.Text`
    color: #000000;

    font-size: 8px;
    font-weight: bold;
`

const AddressInput = styled.TextInput`
    width: 100%;
    height: 38px;

    background-color: #1A1A1A;

    border-width: 1px;
    border-color: #333333;

    color: #FFFFFF;

    padding-horizontal: 10px;

    font-size: 9px;
`

const AddressRow = styled.View`
    width: 100%;

    flex-direction: row;

    gap: 8px;
`

const AddressHalf = styled.View`
    flex: 1;
`

const StateArea = styled.View`
    width: 65px;
`

const AddressError = styled.Text`
    color: #FF5A5A;

    font-size: 7px;

    margin-top: 6px;
`
const UseAddressButton = styled.TouchableOpacity`
    width: 100%;
    height: 38px;

    background-color: ${GREEN};

    align-items: center;
    justify-content: center;

    margin-top: 14px;
`

const UseAddressButtonText = styled.Text`
    color: #000000;

    font-size: 8px;
    font-weight: bold;
`

export {
    Container,
    Content,
    UseAddressButton,
    UseAddressButtonText,
    CheckoutHeader,
    BackButton,
    CheckoutLogo,
    CheckoutLogoHC,
    CheckoutLogoStore,
    HeaderSpacer,
    StepsContainer,
    Step,
    StepCircle,
    StepText,
    StepLine,
    Section,
    SectionHeader,
    SectionNumber,
    SectionTitle,
    ChangeText,
    OptionCard,
    OptionTop,
    Radio,
    RadioSelected,
    OptionContent,
    OptionTitle,
    OptionDescription,
    OptionDetail,
    GreenText,
    AddButton,
    AddButtonText,
    ProductsContainer,
    ProductRow,
    ProductImage,
    ProductInfo,
    ProductName,
    ProductDetail,
    ProductPrice,
    CouponContainer,
    CouponTop,
    CouponTitle,
    CouponBadge,
    DiscountText,
    PriceRow,
    PriceLabel,
    PriceValue,
    DiscountValue,
    Divider,
    TotalRow,
    TotalLabelArea,
    TotalLabel,
    TotalInstallments,
    TotalPrice,
    SecurityContainer,
    SecurityItem,
    SecurityIcon,
    SecurityTitle,
    SecurityDescription,
    TermsText,
    FinishButton,
    FinishButtonText,
    AddressForm,
AddressLabel,
CepRow,
CepInput,
SearchCepButton,
SearchCepButtonText,
AddressInput,
AddressRow,
AddressHalf,
StateArea,
AddressError
}