import styled from "styled-components/native";


const Container = styled.View`
    flex: 1;
    background-color: #000000;

    align-items: center;
    justify-content: flex-start;

    padding: 45px 10px 20px 10px;
`


const LogoContainer = styled.View`
    align-items: center;

    margin-top: 10px;
    margin-bottom: 45px;
`


const LogoHC = styled.Text`
    color: #FFFFFF;

    font-size: 52px;
    font-weight: bold;

    line-height: 58px;
`


const LogoStore = styled.Text`
    color: #00FF00;

    font-size: 35px;
    font-weight: bold;

    line-height: 40px;
`


const LoginContainer = styled.View`
    width: 100%;

    background-color: #303030;

    border-radius: 18px;

    padding: 16px 18px 14px 18px;
`


const Title = styled.Text`
    color: #FFFFFF;

    font-size: 16px;
    font-weight: bold;

    text-align: center;
`


const Description = styled.Text`
    color: #BDBDBD;

    font-size: 8px;

    text-align: center;

    margin-top: 5px;
    margin-bottom: 24px;
`


const Input = styled.TextInput`
    width: 100%;
    height: 40px;

    background-color: #080808;

    border-width: 1px;
    border-color: #AAAAAA;

    color: #FFFFFF;

    font-size: 9px;

    padding-left: 12px;

    margin-bottom: 12px;
`


const ForgotPassword = styled.TouchableOpacity`
    align-self: flex-end;

    margin-top: -7px;
    margin-bottom: 18px;
`


const ForgotPasswordText = styled.Text`
    color: #AAAAAA;

    font-size: 10px;
`


const Btn = styled.TouchableOpacity`
    width: 100%;
    height: 40px;

    background-color: #00FF00;

    align-items: center;
    justify-content: center;
`


const BtnTitle = styled.Text`
    color: #000000;

    font-size: 14px;
    font-weight: bold;
`


const AccountText = styled.Text`
    color: #999999;

    font-size: 10px;

    text-align: center;

    margin-top: 13px;
`


const SignUpBtn = styled.TouchableOpacity`
    align-items: center;

    margin-top: 5px;
`


const SignUpText = styled.Text`
    color: #00FF00;

    font-size: 12px;
    font-weight: bold;
`


export {
    Container,
    LogoContainer,
    LogoHC,
    LogoStore,
    LoginContainer,
    Title,
    Description,
    Input,
    ForgotPassword,
    ForgotPasswordText,
    Btn,
    BtnTitle,
    AccountText,
    SignUpBtn,
    SignUpText
}