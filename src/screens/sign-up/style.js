import styled from "styled-components/native";


const Container = styled.View`
    flex: 1;
    background-color: #000000;

    justify-content: center;
    align-items: center;

    padding: 12px;
`


const FormContainer = styled.View`
    width: 100%;

    background-color: #303030;

    border-radius: 18px;

    padding: 20px 8px 25px 8px;
`


const Title = styled.Text`
    color: #FFFFFF;

    font-size: 22px;
    font-weight: bold;

    text-align: center;
`


const Description = styled.Text`
    color: #AAAAAA;

    font-size: 8px;

    text-align: center;

    margin-top: 5px;
    margin-bottom: 30px;
`


const Row = styled.View`
    width: 100%;

    flex-direction: row;
    justify-content: space-between;

    margin-bottom: 8px;
`


const Input = styled.TextInput`
    width: 100%;
    height: 38px;

    background-color: #080808;

    border-width: 1px;
    border-color: #AAAAAA;

    color: #FFFFFF;

    font-size: 9px;

    padding: 0 12px;

    margin-bottom: 10px;
`


const SmallInput = styled.TextInput`
    width: 46%;
    height: 38px;

    background-color: #080808;

    border-width: 1px;
    border-color: #AAAAAA;

    color: #FFFFFF;

    font-size: 9px;

    padding: 0 12px;
`


const Label = styled.Text`
    color: #FFFFFF;

    font-size: 11px;
    font-weight: bold;

    margin-bottom: 5px;
`


const DateContainer = styled.View`
    width: 75%;

    flex-direction: row;
    justify-content: space-between;

    margin-bottom: 8px;
`


const DateInput = styled.TextInput`
    width: 30%;
    height: 38px;

    background-color: #080808;

    border-width: 1px;
    border-color: #AAAAAA;

    color: #FFFFFF;

    font-size: 9px;

    text-align: center;
`


const GenderCpfContainer = styled.View`
    width: 100%;

    flex-direction: row;
    justify-content: space-between;

    margin-bottom: 10px;
`


const GenderContainer = styled.View`
    width: 53%;
`


const CpfContainer = styled.View`
    width: 44%;
`


const GenderOptions = styled.View`
    flex-direction: row;

    margin-top: 5px;
`


const GenderOption = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;

    margin-right: 12px;
`


const Circle = styled.View`
    width: 9px;
    height: 9px;

    border-radius: 5px;

    border-width: 1px;
    border-color: #AAAAAA;

    margin-right: 4px;
`


const GenderText = styled.Text`
    color: #AAAAAA;

    font-size: 8px;
`


const Btn = styled.TouchableOpacity`
    width: 92%;
    height: 40px;

    align-self: center;

    background-color: #00FF00;

    justify-content: center;
    align-items: center;

    margin-top: 3px;
`


const BtnTitle = styled.Text`
    color: #000000;

    font-size: 14px;
    font-weight: bold;
`


const AccountText = styled.Text`
    color: #AAAAAA;

    font-size: 11px;

    text-align: center;

    margin-top: 14px;
`


const SignInBtn = styled.TouchableOpacity`
    align-items: center;

    margin-top: 7px;
`


const SignInText = styled.Text`
    color: #00FF00;

    font-size: 12px;
    font-weight: bold;
`


export {
    Container,
    FormContainer,
    Title,
    Description,
    Row,
    Input,
    SmallInput,
    Label,
    DateContainer,
    DateInput,
    GenderCpfContainer,
    GenderContainer,
    CpfContainer,
    GenderOptions,
    GenderOption,
    Circle,
    GenderText,
    Btn,
    BtnTitle,
    AccountText,
    SignInBtn,
    SignInText
}