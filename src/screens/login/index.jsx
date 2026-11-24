import { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"

import { useNavigation } from "@react-navigation/native"
import { login } from "../../services/api"

/* ------------------------------------------------------------------ */
/*  TEMA                                                               */
/* ------------------------------------------------------------------ */

const COLORS = {
    bg: "#070707",
    surface: "#101010",
    surfaceFocus: "#0F1611",
    border: "#222222",
    accent: "#00E640",
    accentDark: "#00B833",
    text: "#F5F5F5",
    muted: "#8C8C8C",
    faint: "#4A4A4A",
    error: "#FF5A5F"
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ------------------------------------------------------------------ */
/*  CAMPO DE FORMULÁRIO                                                */
/* ------------------------------------------------------------------ */

const Field = ({ label, error, right, inputRef, ...inputProps }) => {
    const [focused, setFocused] = useState(false)

    const borderColor = error
        ? COLORS.error
        : focused
            ? COLORS.accent
            : COLORS.border

    return (
        <View style={styles.fieldWrapper}>
            <Text style={[styles.label, focused && { color: COLORS.accent }]}>
                {label}
            </Text>

            <View
                style={[
                    styles.field,
                    { borderColor },
                    focused && { backgroundColor: COLORS.surfaceFocus }
                ]}
            >
                <TextInput
                    ref={inputRef}
                    placeholderTextColor={COLORS.faint}
                    selectionColor={COLORS.accent}
                    style={styles.input}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...inputProps}
                />
                {right}
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
}

/* ------------------------------------------------------------------ */
/*  TELA                                                               */
/* ------------------------------------------------------------------ */

const Login = () => {
    const navigation = useNavigation()

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const senhaRef = useRef(null)

    // Animação de entrada
    const fade = useRef(new Animated.Value(0)).current
    // Animação do botão ao pressionar
    const btnScale = useRef(new Animated.Value(1)).current

    useEffect(() => {
        Animated.timing(fade, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
        }).start()
    }, [fade])

    const entrance = {
        opacity: fade,
        transform: [{
            translateY: fade.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0]
            })
        }]
    }

    const pressIn = () =>
        Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true }).start()

    const pressOut = () =>
        Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()

    const validar = () => {
        const novo = {}

        if (!email.trim()) novo.email = "Informe seu e-mail."
        else if (!EMAIL_REGEX.test(email.trim())) novo.email = "E-mail inválido."

        if (!senha) novo.senha = "Informe sua senha."

        setErrors(novo)
        return Object.keys(novo).length === 0
    }

    const handleLogin = async () => {
        if (loading || !validar()) return

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

    const handleForgot = () => {
        // TODO: trocar pela rota de recuperação quando ela existir
        Alert.alert("Recuperar senha", "Em breve você poderá redefinir sua senha por aqui.")
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.bg} barStyle="light-content" />

            {/* BRILHO DE FUNDO */}
            <View pointerEvents="none" style={styles.glowTop}>
                <View style={[styles.glowRing, { width: 460, height: 460, opacity: 0.03 }]} />
                <View style={[styles.glowRing, { width: 320, height: 320, opacity: 0.04 }]} />
                <View style={[styles.glowRing, { width: 190, height: 190, opacity: 0.06 }]} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={entrance}>

                        {/* CABEÇALHO */}

                        <View style={styles.header}>
                            <View style={styles.logoRow}>
                                <View style={styles.logoBadge}>
                                    <Text style={styles.logoHC}>HC</Text>
                                </View>
                                <Text style={styles.logoStore}>STORE</Text>
                            </View>

                            <View style={styles.estPill}>
                                <Text style={styles.estText}>EST. 2026</Text>
                            </View>
                        </View>

                        {/* APRESENTAÇÃO */}

                        <View style={styles.hero}>
                            <View style={styles.taglineRow}>
                                <View style={styles.taglineDash} />
                                <Text style={styles.tagline}>SUA IDENTIDADE. SEU ESTILO.</Text>
                            </View>

                            <Text style={styles.title}>
                                BEM-VINDO{"\n"}
                                DE VOLTA<Text style={{ color: COLORS.accent }}>.</Text>
                            </Text>

                            <Text style={styles.description}>
                                Entre na sua conta e continue descobrindo seu próximo estilo.
                            </Text>
                        </View>

                        {/* FORMULÁRIO */}

                        <Field
                            label="E-MAIL"
                            placeholder="exemplo@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="email"
                            textContentType="emailAddress"
                            returnKeyType="next"
                            value={email}
                            error={errors.email}
                            onChangeText={(t) => {
                                setEmail(t)
                                if (errors.email) setErrors((e) => ({ ...e, email: null }))
                            }}
                            onSubmitEditing={() => senhaRef.current?.focus()}
                            blurOnSubmit={false}
                        />

                        <Field
                            inputRef={senhaRef}
                            label="SENHA"
                            placeholder="Digite sua senha"
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                            autoComplete="password"
                            textContentType="password"
                            returnKeyType="go"
                            value={senha}
                            error={errors.senha}
                            onChangeText={(t) => {
                                setSenha(t)
                                if (errors.senha) setErrors((e) => ({ ...e, senha: null }))
                            }}
                            onSubmitEditing={handleLogin}
                            right={
                                <TouchableOpacity
                                    onPress={() => setMostrarSenha((v) => !v)}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    style={styles.togglePill}
                                >
                                    <Text style={styles.toggleText}>
                                        {mostrarSenha ? "OCULTAR" : "MOSTRAR"}
                                    </Text>
                                </TouchableOpacity>
                            }
                        />

                        <TouchableOpacity
                            onPress={handleForgot}
                            activeOpacity={0.7}
                            style={styles.forgot}
                        >
                            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
                        </TouchableOpacity>

                        {/* BOTÃO ENTRAR */}

                        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                            <Pressable
                                onPress={handleLogin}
                                onPressIn={pressIn}
                                onPressOut={pressOut}
                                disabled={loading}
                                style={({ pressed }) => [
                                    styles.primaryBtn,
                                    pressed && { backgroundColor: COLORS.accentDark },
                                    loading && { opacity: 0.85 }
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#000000" />
                                ) : (
                                    <>
                                        <Text style={styles.primaryBtnText}>ENTRAR</Text>
                                        <View style={styles.arrowCircle}>
                                            <Text style={styles.arrow}>→</Text>
                                        </View>
                                    </>
                                )}
                            </Pressable>
                        </Animated.View>

                        {/* DIVISOR */}

                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>NOVO POR AQUI?</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* CADASTRO */}

                        <TouchableOpacity
                            onPress={() => navigation.navigate("SignUp")}
                            activeOpacity={0.75}
                            style={styles.secondaryBtn}
                        >
                            <Text style={styles.secondaryBtnText}>CRIAR MINHA CONTA</Text>
                        </TouchableOpacity>

                        {/* RODAPÉ */}

                        <View style={styles.footer}>
                            <Text style={styles.footerBrand}>HCSTORE</Text>
                            <Text style={styles.footerText}>
                                MODA <Text style={{ color: COLORS.accent }}>•</Text> ESTILO{" "}
                                <Text style={{ color: COLORS.accent }}>•</Text> PERSONALIDADE
                            </Text>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

/* ------------------------------------------------------------------ */
/*  ESTILOS                                                            */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg
    },

    scroll: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 20 : 64,
        paddingBottom: 32
    },

    /* Brilho */
    glowTop: {
        position: "absolute",
        top: -180,
        right: -180,
        width: 460,
        height: 460,
        alignItems: "center",
        justifyContent: "center"
    },
    glowRing: {
        position: "absolute",
        borderRadius: 999,
        backgroundColor: COLORS.accent
    },

    /* Cabeçalho */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    logoBadge: {
        backgroundColor: COLORS.accent,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8
    },
    logoHC: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: 0.5
    },
    logoStore: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 4
    },
    estPill: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    estText: {
        color: COLORS.muted,
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 2
    },

    /* Apresentação */
    hero: {
        marginTop: 56,
        marginBottom: 40
    },
    taglineRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18
    },
    taglineDash: {
        width: 24,
        height: 2,
        backgroundColor: COLORS.accent,
        marginRight: 10
    },
    tagline: {
        color: COLORS.accent,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 2.5
    },
    title: {
        color: COLORS.text,
        fontSize: 46,
        lineHeight: 48,
        fontWeight: "900",
        letterSpacing: -1.5
    },
    description: {
        color: COLORS.muted,
        fontSize: 15,
        lineHeight: 22,
        marginTop: 16,
        maxWidth: 300
    },

    /* Campos */
    fieldWrapper: {
        marginBottom: 20
    },
    label: {
        color: COLORS.muted,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.6,
        marginBottom: 10
    },
    field: {
        height: 58,
        backgroundColor: COLORS.surface,
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        flex: 1,
        height: "100%",
        color: COLORS.text,
        fontSize: 15
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 8,
        marginLeft: 4
    },
    togglePill: {
        backgroundColor: "rgba(0, 230, 64, 0.1)",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginLeft: 10
    },
    toggleText: {
        color: COLORS.accent,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 1
    },

    /* Esqueci a senha */
    forgot: {
        alignSelf: "flex-end",
        marginTop: -4,
        marginBottom: 28,
        paddingVertical: 4
    },
    forgotText: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: "600",
        textDecorationLine: "underline",
        textDecorationColor: COLORS.faint
    },

    /* Botão principal */
    primaryBtn: {
        height: 60,
        borderRadius: 16,
        backgroundColor: COLORS.accent,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 24,
        paddingRight: 8,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 8
    },
    primaryBtnText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 3
    },
    arrowCircle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center"
    },
    arrow: {
        color: COLORS.accent,
        fontSize: 20,
        fontWeight: "900"
    },

    /* Divisor */
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border
    },
    dividerText: {
        color: COLORS.faint,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 2,
        marginHorizontal: 14
    },

    /* Botão secundário */
    secondaryBtn: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: "#2E2E2E",
        alignItems: "center",
        justifyContent: "center"
    },
    secondaryBtnText: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 2.5
    },

    /* Rodapé */
    footer: {
        alignItems: "center",
        marginTop: 48
    },
    footerBrand: {
        color: COLORS.faint,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 4,
        marginBottom: 6
    },
    footerText: {
        color: "#3A3A3A",
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 2
    }
})

export default Login