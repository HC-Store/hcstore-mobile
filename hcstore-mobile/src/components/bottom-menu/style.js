import styled from "styled-components/native"

const Container = styled.View`
    width: 100%;
    height: 65px;

    background-color: #080808;

    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    border-top-width: 1px;
    border-top-color: #1f1f1f;

    position: absolute;

    bottom: 0;
    left: 0;
    right: 0;

    z-index: 100;
`

const MenuItem = styled.TouchableOpacity`
    flex: 1;
    height: 100%;

    align-items: center;
    justify-content: center;
`

const MenuText = styled.Text`
    font-size: 9px;
    font-weight: 600;

    margin-top: 3px;

    color: ${({ active }) =>
        active ? "#00FF5A" : "#707070"};
`

export {
    Container,
    MenuItem,
    MenuText
}