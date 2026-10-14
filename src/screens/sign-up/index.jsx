import {
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
} from "./style"

import { useNavigation } from "@react-navigation/native"


const SignUp = () => {
    const navigation = useNavigation()

    return (
        <Container>

            <FormContainer>

                <Title>
                    Junte-se a nós.
                </Title>

                <Description>
                    Crie uma conta para receber ofertas exclusivas
                </Description>

                <Row>
                    <SmallInput
                        placeholder="Nome"
                        placeholderTextColor="#AAAAAA"
                    />

                    <SmallInput
                        placeholder="Sobrenome"
                        placeholderTextColor="#AAAAAA"
                    />
                </Row>

                <Label>Data de nascimento</Label>

                <DateContainer>

                    <DateInput
                        placeholder="Dia"
                        placeholderTextColor="#AAAAAA"
                        keyboardType="numeric"
                    />

                    <DateInput
                        placeholder="Mês"
                        placeholderTextColor="#AAAAAA"
                        keyboardType="numeric"
                    />

                    <DateInput
                        placeholder="Ano"
                        placeholderTextColor="#AAAAAA"
                        keyboardType="numeric"
                    />

                </DateContainer>

                <GenderCpfContainer>

                    <GenderContainer>

                        <Label>Sexo</Label>

                        <GenderOptions>

                            <GenderOption>
                                <Circle />
                                <GenderText>Masculino</GenderText>
                            </GenderOption>

                            <GenderOption>
                                <Circle />
                                <GenderText>Feminino</GenderText>
                            </GenderOption>

                        </GenderOptions>

                    </GenderContainer>

                    <CpfContainer>

                        <Label>CPF</Label>

                        <Input
                            placeholder="00000000000"
                            placeholderTextColor="#AAAAAA"
                            keyboardType="numeric"
                        />

                    </CpfContainer>

                </GenderCpfContainer>

                <Input
                    placeholder="Telefone: (xx) 0 0000 - 0000"
                    placeholderTextColor="#AAAAAA"
                    keyboardType="phone-pad"
                />

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

                <Btn  onPress={() => navigation.navigate("Home")}>
                    <BtnTitle>Criar Conta</BtnTitle>
                </Btn>

                <AccountText>
                    Já tem uma conta?
                </AccountText>

                <SignInBtn onPress={() => navigation.navigate("Login")}>
                    <SignInText>Entrar</SignInText>
                </SignInBtn>

            </FormContainer>

        </Container>
    )
}


export default SignUp