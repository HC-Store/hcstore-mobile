import styled from "styled-components/native"


const HeaderContainer = styled.View`
    width: 100%;
    height: 50px;

    background-color: #000000;

    flex-direction: row;
    align-items: center;

    padding: 0 12px;
`


const LogoContainer = styled.View`
    flex-direction: row;
    align-items: center;
`


const LogoHC = styled.Text`
    color: #FFFFFF;

    font-size: 15px;
    font-weight: bold;
`


const LogoStore = styled.Text`
    color: #00FF00;

    font-size: 15px;
    font-weight: bold;

    margin-left: 4px;
`


const HeaderActions = styled.View`
    margin-left: auto;

    flex-direction: row;
    align-items: center;
`


const IconButton = styled.TouchableOpacity`
    width: 42px;
    height: 42px;

    align-items: center;
    justify-content: center;
`


const ModalContainer = styled.View`
    flex: 1;

    background-color: rgba(0, 0, 0, 0.45);
`


const CloseArea = styled.Pressable`
    position: absolute;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`


const MenuOverlay = styled.View`
    position: absolute;

    top: 0;
    right: 0;

    width: 70%;
    height: 100%;

    background-color: #151515;

    padding-top: 20px;
`


const MenuTop = styled.View`
    width: 100%;
    height: 45px;

    align-items: flex-end;
    justify-content: center;

    padding-right: 8px;
`


const SearchContainer = styled.View`
    height: 42px;

    flex-direction: row;
    align-items: center;

    background-color: #222222;

    margin: 10px 15px 20px 15px;

    padding: 0 12px;

    border-radius: 8px;
`


const SearchText = styled.Text`
    color: #777777;

    font-size: 13px;

    margin-left: 8px;
`


const MenuItem = styled.TouchableOpacity`
    width: 100%;
    height: 52px;

    justify-content: center;

    padding-left: 22px;

    border-bottom-width: 1px;
    border-bottom-color: #242424;
`


const MenuText = styled.Text`
    color: #FFFFFF;

    font-size: 15px;
`


export {
    HeaderContainer,
    LogoContainer,
    LogoHC,
    LogoStore,
    HeaderActions,
    IconButton,
    ModalContainer,
    CloseArea,
    MenuOverlay,
    MenuTop,
    SearchContainer,
    SearchText,
    MenuItem,
    MenuText
}