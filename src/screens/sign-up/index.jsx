import { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"

import { register, login } from "../../services/api"

/* ================================================================== */
/*  TEMA                                                               */
/* ================================================================== */

const BG = "#070707"
const SURFACE = "#101010"
const SURFACE_FOCUS = "#0F1611"
const BORDER = "#222222"
const ACCENT = "#00E640"
const TEXT = "#F5F5F5"
const MUTED = "#8C8C8C"
const FAINT = "#4A4A4A"
const ERROR = "#FF5A5F"

const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 60
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ================================================================== */
/*  MÁSCARAS                                                           */
/* ================================================================== */

const onlyDigits = (v) => v.replace(/\D/g, "")

const maskCpf = (v) =>
    onlyDigits(v)
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")

const maskPhone = (v) => {
    const d = onlyDigits(v).slice(0, 11)
    if (d.length === 0) return ""
    if (d.length <= 2) return `(${d}`
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const maskDate = (v) => {
    const d = onlyDigits(v).slice(0, 8)
    if (d.length <= 2) return d
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

// "DD/MM/AAAA" -> "AAAA-MM-DD" (ou null se inválida)
const parseDate = (value) => {
    const [dia, mes, ano] = value.split("/")
    if (!dia || !mes || !ano || ano.length !== 4) return null

    const date = new Date(Number(ano), Number(mes) - 1, Number(dia))
    const valida =
        date.getFullYear() === Number(ano) &&
        date.getMonth() === Number(mes) - 1 &&
        date.getDate() === Number(dia) &&
        date < new Date() &&
        Number(ano) > 1900

    return valida ? `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}` : null
}

/* ================================================================== */
/*  CAMPO (fora da tela p/ não perder o foco)                          */
/* ================================================================== */

const Field = ({ label, error, right, half, ...inputProps }) => {
    const [focused, setFocused] = useState(false)

    return (
        <FieldWrapper $half={half}>
            <Label $focused={focused}>{label}</Label>

            <FieldBox $focused={focused} $error={!!error}>
                <Input
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...inputProps}
                />
                {right}
            </FieldBox>

            {!!error && <ErrorText>{error}</ErrorText>}
        </FieldWrapper>
    )
}

/* ================================================================== */
/*  TELA                                                               */
/* ================================================================== */

const SignUp = () => {
    const navigation = useNavigation()

    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
        nascimento: "",
        sexo: "",
        cpf: "",
        telefone: "",
        email: "",
        senha: ""
    })
    const [errors, setErrors] = useState({})
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)

    const fade = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start()
    }, [fade])

    const entrance = {
        opacity: fade,
        transform: [{
            translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [24, 0] })
        }]
    }

    const set = (field, mask) => (value) => {
        setForm((f) => ({ ...f, [field]: mask ? mask(value) : value }))
        if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
    }

    const validar = () => {
        const e = {}

        if (!form.nome.trim()) e.nome = "Informe seu nome."
        if (!form.sobrenome.trim()) e.sobrenome = "Informe seu sobrenome."
        if (!parseDate(form.nascimento)) e.nascimento = "Data inválida."
        if (!form.sexo) e.sexo = "Selecione uma opção."
        if (onlyDigits(form.cpf).length !== 11) e.cpf = "CPF deve ter 11 números."
        if (onlyDigits(form.telefone).length < 10) e.telefone = "Telefone inválido."
        if (!EMAIL_REGEX.test(form.email.trim())) e.email = "E-mail inválido."
        if (form.senha.length < 6) e.senha = "Mínimo de 6 caracteres."

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleRegister = async () => {
        if (loading) return

        if (!validar()) {
            Alert.alert("Atenção", "Confira os campos destacados.")
            return
        }

        try {
            setLoading(true)

            await register({
                nome: form.nome.trim(),
                sobrenome: form.sobrenome.trim(),
                email: form.email.trim(),
                senha: form.senha,
                cpf: onlyDigits(form.cpf),
                telefone: onlyDigits(form.telefone),
                sexo: form.sexo,
                dataNascimento: parseDate(form.nascimento)
            })

            await login(form.email.trim(), form.senha)
            navigation.navigate("Home")
        } catch (error) {
            Alert.alert("Erro ao criar conta", error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <StatusBar backgroundColor={BG} barStyle="light-content" />

            {/* BRILHO DE FUNDO */}
            <GlowArea pointerEvents="none">
                <GlowRing $size={460} $opacity={0.03} />
                <GlowRing $size={320} $opacity={0.04} />
                <GlowRing $size={190} $opacity={0.06} />
            </GlowArea>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={entrance}>
                        <Content>

                            {/* TOPO */}

                            <TopRow>
                                <BackBtn onPress={() => navigation.navigate("Login")} activeOpacity={0.7}>
                                    <BackText>← VOLTAR</BackText>
                                </BackBtn>

                                <LogoRow>
                                    <LogoBadge>
                                        <LogoHC>HC</LogoHC>
                                    </LogoBadge>
                                    <LogoStore>STORE</LogoStore>
                                </LogoRow>
                            </TopRow>

                            {/* APRESENTAÇÃO */}

                            <Hero>
                                <TaglineRow>
                                    <TaglineDash />
                                    <Tagline>CRIE SUA CONTA</Tagline>
                                </TaglineRow>

                                <Title>
                                    JUNTE-SE{"\n"}
                                    A NÓS<Accent>.</Accent>
                                </Title>

                                <Description>
                                    Crie sua conta e receba ofertas exclusivas e acesso antecipado aos drops.
                                </Description>
                            </Hero>

                            {/* DADOS PESSOAIS */}

                            <SectionLabel>DADOS PESSOAIS</SectionLabel>

                            <Row>
                                <Field
                                    half
                                    label="NOME"
                                    placeholder="Seu nome"
                                    value={form.nome}
                                    onChangeText={set("nome")}
                                    autoCapitalize="words"
                                    textContentType="givenName"
                                    error={errors.nome}
                                />
                                <Spacer />
                                <Field
                                    half
                                    label="SOBRENOME"
                                    placeholder="Sobrenome"
                                    value={form.sobrenome}
                                    onChangeText={set("sobrenome")}
                                    autoCapitalize="words"
                                    textContentType="familyName"
                                    error={errors.sobrenome}
                                />
                            </Row>

                            <Row>
                                <Field
                                    half
                                    label="NASCIMENTO"
                                    placeholder="DD/MM/AAAA"
                                    value={form.nascimento}
                                    onChangeText={set("nascimento", maskDate)}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    error={errors.nascimento}
                                />
                                <Spacer />
                                <Field
                                    half
                                    label="CPF"
                                    placeholder="000.000.000-00"
                                    value={form.cpf}
                                    onChangeText={set("cpf", maskCpf)}
                                    keyboardType="numeric"
                                    maxLength={14}
                                    error={errors.cpf}
                                />
                            </Row>

                            <FieldWrapper>
                                <Label>SEXO</Label>

                                <GenderOptions>
                                    {["Masculino", "Feminino"].map((opcao, i) => {
                                        const selected = form.sexo === opcao
                                        return (
                                            <GenderOption
                                                key={opcao}
                                                $selected={selected}
                                                $error={!!errors.sexo}
                                                $last={i === 1}
                                                onPress={() => set("sexo")(opcao)}
                                                activeOpacity={0.8}
                                            >
                                                <Circle $selected={selected}>
                                                    {selected && <CircleDot />}
                                                </Circle>
                                                <GenderText $selected={selected}>{opcao}</GenderText>
                                            </GenderOption>
                                        )
                                    })}
                                </GenderOptions>

                                {!!errors.sexo && <ErrorText>{errors.sexo}</ErrorText>}
                            </FieldWrapper>

                            {/* CONTATO E ACESSO */}

                            <SectionLabel style={{ marginTop: 12 }}>CONTATO E ACESSO</SectionLabel>

                            <Field
                                label="TELEFONE"
                                placeholder="(11) 91234-5678"
                                value={form.telefone}
                                onChangeText={set("telefone", maskPhone)}
                                keyboardType="phone-pad"
                                maxLength={15}
                                textContentType="telephoneNumber"
                                error={errors.telefone}
                            />

                            <Field
                                label="E-MAIL"
                                placeholder="exemplo@email.com"
                                value={form.email}
                                onChangeText={set("email")}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                textContentType="emailAddress"
                                error={errors.email}
                            />

                            <Field
                                label="SENHA"
                                placeholder="Mínimo de 6 caracteres"
                                value={form.senha}
                                onChangeText={set("senha")}
                                secureTextEntry={!mostrarSenha}
                                autoCapitalize="none"
                                autoComplete="password-new"
                                textContentType="newPassword"
                                returnKeyType="done"
                                onSubmitEditing={handleRegister}
                                error={errors.senha}
                                right={
                                    <TogglePill
                                        onPress={() => setMostrarSenha((v) => !v)}
                                        activeOpacity={0.7}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <ToggleText>{mostrarSenha ? "OCULTAR" : "MOSTRAR"}</ToggleText>
                                    </TogglePill>
                                }
                            />

                            <Terms>
                                Ao criar sua conta, você concorda com os{" "}
                                <TermsStrong>Termos de Uso</TermsStrong> e a{" "}
                                <TermsStrong>Política de Privacidade</TermsStrong> da HC Store.
                            </Terms>

                            {/* BOTÃO */}

                            <Btn onPress={handleRegister} disabled={loading} activeOpacity={0.85} $loading={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#000000" />
                                ) : (
                                    <>
                                        <BtnTitle>CRIAR CONTA</BtnTitle>
                                        <ArrowBox>
                                            <Arrow>→</Arrow>
                                        </ArrowBox>
                                    </>
                                )}
                            </Btn>

                            {/* JÁ TEM CONTA */}

                            <DividerRow>
                                <DividerLine />
                                <AccountText>JÁ TEM UMA CONTA?</AccountText>
                                <DividerLine />
                            </DividerRow>

                            <SignInBtn onPress={() => navigation.navigate("Login")} activeOpacity={0.75}>
                                <SignInText>ENTRAR</SignInText>
                            </SignInBtn>

                        </Content>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    )
}

export default SignUp

/* ================================================================== */
/*  ESTILOS                                                            */
/* ================================================================== */

const Container = styled.View`
    flex: 1;
    background-color: ${BG};
`

const Content = styled.View`
    padding: ${TOP_SPACE}px 24px 40px 24px;
`

/* Brilho */

const GlowArea = styled.View`
    position: absolute;
    top: -180px;
    right: -180px;
    width: 460px;
    height: 460px;
    align-items: center;
    justify-content: center;
`

const GlowRing = styled.View`
    position: absolute;
    width: ${(p) => p.$size}px;
    height: ${(p) => p.$size}px;
    border-radius: ${(p) => p.$size / 2}px;
    background-color: ${ACCENT};
    opacity: ${(p) => p.$opacity};
`

/* Topo */

const TopRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const BackBtn = styled.TouchableOpacity`
    height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    border-width: 1px;
    border-color: ${BORDER};
    align-items: center;
    justify-content: center;
`

const BackText = styled.Text`
    color: ${MUTED};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
`

const LogoRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const LogoBadge = styled.View`
    background-color: ${ACCENT};
    border-radius: 8px;
    padding: 4px 8px;
    margin-right: 8px;
`

const LogoHC = styled.Text`
    color: #000000;
    font-size: 16px;
    font-weight: 900;
`

const LogoStore = styled.Text`
    color: ${TEXT};
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 4px;
`

/* Apresentação */

const Hero = styled.View`
    margin-top: 40px;
    margin-bottom: 32px;
`

const TaglineRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 18px;
`

const TaglineDash = styled.View`
    width: 24px;
    height: 2px;
    background-color: ${ACCENT};
    margin-right: 10px;
`

const Tagline = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2.5px;
`

const Title = styled.Text`
    color: ${TEXT};
    font-size: 46px;
    line-height: 48px;
    font-weight: 900;
    letter-spacing: -1.5px;
`

const Accent = styled.Text`
    color: ${ACCENT};
`

const Description = styled.Text`
    color: ${MUTED};
    font-size: 15px;
    line-height: 22px;
    margin-top: 14px;
    max-width: 310px;
`

/* Formulário */

const SectionLabel = styled.Text`
    color: ${FAINT};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 2.5px;
    margin-bottom: 14px;
`

const Row = styled.View`
    flex-direction: row;
`

const Spacer = styled.View`
    width: 12px;
`

const FieldWrapper = styled.View`
    margin-bottom: 18px;
    ${(p) => (p.$half ? "flex: 1;" : "")}
`

const Label = styled.Text`
    color: ${(p) => (p.$focused ? ACCENT : MUTED)};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.6px;
    margin-bottom: 9px;
`

const FieldBox = styled.View`
    height: 56px;
    flex-direction: row;
    align-items: center;
    padding: 0 16px;
    border-radius: 14px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$error ? ERROR : p.$focused ? ACCENT : BORDER)};
    background-color: ${(p) => (p.$focused ? SURFACE_FOCUS : SURFACE)};
`

const Input = styled.TextInput.attrs({
    placeholderTextColor: FAINT,
    selectionColor: ACCENT
})`
    flex: 1;
    height: 100%;
    color: ${TEXT};
    font-size: 15px;
`

const ErrorText = styled.Text`
    color: ${ERROR};
    font-size: 11px;
    margin-top: 7px;
    margin-left: 4px;
`

const TogglePill = styled.TouchableOpacity`
    background-color: rgba(0, 230, 64, 0.1);
    border-radius: 999px;
    padding: 6px 10px;
    margin-left: 10px;
`

const ToggleText = styled.Text`
    color: ${ACCENT};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1px;
`

/* Sexo */

const GenderOptions = styled.View`
    flex-direction: row;
`

const GenderOption = styled.TouchableOpacity`
    flex: 1;
    height: 56px;
    margin-right: ${(p) => (p.$last ? 0 : 12)}px;
    padding: 0 16px;
    border-radius: 14px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$selected ? ACCENT : p.$error ? ERROR : BORDER)};
    background-color: ${(p) => (p.$selected ? SURFACE_FOCUS : SURFACE)};
    flex-direction: row;
    align-items: center;
`

const Circle = styled.View`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border-width: 2px;
    border-color: ${(p) => (p.$selected ? ACCENT : FAINT)};
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`

const CircleDot = styled.View`
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${ACCENT};
`

const GenderText = styled.Text`
    color: ${(p) => (p.$selected ? TEXT : MUTED)};
    font-size: 14px;
    font-weight: 700;
`

/* Termos */

const Terms = styled.Text`
    color: ${FAINT};
    font-size: 12px;
    line-height: 18px;
    margin-top: 4px;
    margin-bottom: 24px;
`

const TermsStrong = styled.Text`
    color: ${MUTED};
    font-weight: 700;
`

/* Botão principal */

const Btn = styled.TouchableOpacity`
    height: 60px;
    border-radius: 16px;
    background-color: ${ACCENT};
    opacity: ${(p) => (p.$loading ? 0.85 : 1)};
    flex-direction: row;
    align-items: center;
    justify-content: ${(p) => (p.$loading ? "center" : "space-between")};
    padding: 0 8px 0 24px;
    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.35;
    shadow-radius: 18px;
    elevation: 8;
`

const BtnTitle = styled.Text`
    color: #000000;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 3px;
`

const ArrowBox = styled.View`
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background-color: #000000;
    align-items: center;
    justify-content: center;
`

const Arrow = styled.Text`
    color: ${ACCENT};
    font-size: 20px;
    font-weight: 900;
`

/* Já tem conta */

const DividerRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 36px;
    margin-bottom: 20px;
`

const DividerLine = styled.View`
    flex: 1;
    height: 1px;
    background-color: ${BORDER};
`

const AccountText = styled.Text`
    color: ${FAINT};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    margin: 0 14px;
`

const SignInBtn = styled.TouchableOpacity`
    height: 56px;
    border-radius: 16px;
    border-width: 1.5px;
    border-color: #2e2e2e;
    align-items: center;
    justify-content: center;
`

const SignInText = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2.5px;
`