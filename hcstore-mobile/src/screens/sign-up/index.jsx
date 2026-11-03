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

import { useState } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { register, login } from "../../services/api"


const SignUp = () => {
    const navigation = useNavigation()
    const [form, setForm] = useState({
        nome: "", sobrenome: "", dia: "", mes: "", ano: "",
        sexo: "", cpf: "", telefone: "", email: "", senha: ""
    })
    const [loading, setLoading] = useState(false)
    const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))

    const handleRegister = async () => {
        const { nome, sobrenome, dia, mes, ano, sexo, cpf, telefone, email, senha } = form
        if (!nome || !sobrenome || !dia || !mes || !ano || !sexo || !cpf || !telefone || !email || !senha) {
            Alert.alert("Atenção", "Preencha todos os campos.")
            return
        }
        const dataNascimento = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`
        try {
            setLoading(true)
            await register({
                nome, sobrenome, email: email.trim(), senha,
                cpf: cpf.replace(/\D/g, ""),
                telefone: telefone.replace(/\D/g, ""),
                sexo, dataNascimento
            })
            await login(email.trim(), senha)
            navigation.navigate("Home")
        } catch (error) {
            Alert.alert("Erro ao criar conta", error.message)
        } finally {
            setLoading(false)
        }
    }

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
                        value={form.nome}
                        onChangeText={set("nome")}
                    />

                    <SmallInput
                        placeholder="Sobrenome"
                        placeholderTextColor="#AAAAAA"
                        value={form.sobrenome}
                        onChangeText={set("sobrenome")}
                    />
                </Row>

                <Label>Data de nascimento</Label>

                <DateContainer>

                    <DateInput
                        placeholder="Dia"
                        placeholderTextColor="#AAAAAA"
                        value={form.dia}
                        onChangeText={set("dia")}
                        keyboardType="numeric"
                    />

                    <DateInput
                        placeholder="Mês"
                        placeholderTextColor="#AAAAAA"
                        value={form.mes}
                        onChangeText={set("mes")}
                        keyboardType="numeric"
                    />

                    <DateInput
                        placeholder="Ano"
                        placeholderTextColor="#AAAAAA"
                        value={form.ano}
                        onChangeText={set("ano")}
                        keyboardType="numeric"
                    />

                </DateContainer>

                <GenderCpfContainer>

                    <GenderContainer>

                        <Label>Sexo</Label>

                        <GenderOptions>

                            <GenderOption onPress={() => set("sexo")("Masculino")}>
                                <Circle style={form.sexo === "Masculino" ? { backgroundColor: "#000" } : null} />
                                <GenderText>Masculino</GenderText>
                            </GenderOption>

                            <GenderOption onPress={() => set("sexo")("Feminino")}>
                                <Circle style={form.sexo === "Feminino" ? { backgroundColor: "#000" } : null} />
                                <GenderText>Feminino</GenderText>
                            </GenderOption>

                        </GenderOptions>

                    </GenderContainer>

                    <CpfContainer>

                        <Label>CPF</Label>

                        <Input
                            placeholder="00000000000"
                            placeholderTextColor="#AAAAAA"
                            value={form.cpf}
                            onChangeText={set("cpf")}
                            keyboardType="numeric"
                        />

                    </CpfContainer>

                </GenderCpfContainer>

                <Input
                    placeholder="Telefone: (xx) 0 0000 - 0000"
                    placeholderTextColor="#AAAAAA"
                    value={form.telefone}
                    onChangeText={set("telefone")}
                    keyboardType="phone-pad"
                />

                <Input
                    placeholder="ENDEREÇO DE E-MAIL"
                    placeholderTextColor="#AAAAAA"
                    value={form.email}
                    onChangeText={set("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Input
                    placeholder="SENHA"
                    placeholderTextColor="#AAAAAA"
                    value={form.senha}
                    onChangeText={set("senha")}
                    secureTextEntry
                />

                <Btn onPress={handleRegister} disabled={loading}>
                    <BtnTitle>{loading ? "Criando..." : "Criar Conta"}</BtnTitle>
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