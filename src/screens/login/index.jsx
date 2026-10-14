import {Container, LogoContainer, LogoHC, LogoStore,LoginContainer, Title, Description,
    Input, ForgotPassword, ForgotPasswordText, Btn, BtnTitle, AccountText, SignUpBtn,
    SignUpText
} from "./style"

import { useNavigation } from "@react-navigation/native"


const Login = () => {
    const navigation = useNavigation()

    return (
        <Container>

            <LogoContainer>
                <LogoHC>HC</LogoHC>
                <LogoStore>STORE</LogoStore>
            </LogoContainer>

            <LoginContainer>

                <Title>
                    Bem-vindo(a) de volta!
                </Title>

                <Description>
                    Insira suas credenciais para acessar seu arquivo.
                </Description>

                <Input
                    placeholder="ENDEREÇO DE E-MAIL"
                    placeholderTextColor="#AAAAAA"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Input
                    placeholder="SENHA"
                    placeholderTextColor="#AAAAAA"
                    secureTextEntry
                />

                <ForgotPassword>
                    <ForgotPasswordText>
                        Esqueceu sua senha?
                    </ForgotPasswordText>
                </ForgotPassword>

                <Btn onPress={() => navigation.navigate("Home")}>
                    <BtnTitle>Entrar</BtnTitle>
                </Btn>

                <AccountText>
                    Não tem uma conta?
                </AccountText>

                <SignUpBtn onPress={() => navigation.navigate("SignUp")}>
                    <SignUpText>
                        Cadastre-se agora
                    </SignUpText>
                </SignUpBtn>

            </LoginContainer>

        </Container>
    )
}


export default Login