import {Container, LogoContainer, LogoHC, LogoStore,LoginContainer, Title, Description,
    Input, ForgotPassword, ForgotPasswordText, Btn, BtnTitle, AccountText, SignUpBtn,
    SignUpText
} from "./style"

import { useState } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { login } from "../../services/api"


const Login = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email.trim() || !senha) {
            Alert.alert("Atenção", "Informe e-mail e senha.")
            return
        }
        try {
            setLoading(true)
            await login(email.trim(), senha)
            navigation.navigate("Home")
        } catch (error) {
            Alert.alert("Erro ao entrar", error.message)
        } finally {
            setLoading(false)
        }
    }

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
                    value={email}
                    onChangeText={setEmail}
                />

                <Input
                    placeholder="SENHA"
                    placeholderTextColor="#AAAAAA"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <ForgotPassword>
                    <ForgotPasswordText>
                        Esqueceu sua senha?
                    </ForgotPasswordText>
                </ForgotPassword>

                <Btn onPress={handleLogin} disabled={loading}>
                    <BtnTitle>{loading ? "Entrando..." : "Entrar"}</BtnTitle>
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