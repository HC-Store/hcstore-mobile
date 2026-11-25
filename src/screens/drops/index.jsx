import { useEffect, useRef, useState } from "react"
import { Animated, Image, Platform, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"

import { getSiteConfig } from "../../services/api"
import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

/* ================================================================== */
/*  TEMA                                                               */
/* ================================================================== */

const BG = "#070707"
const SURFACE = "#111111"
const BORDER = "#222222"
const ACCENT = "#00E640"
const TEXT = "#F5F5F5"
const MUTED = "#8C8C8C"
const FAINT = "#4A4A4A"

const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 8 : 44

/* ================================================================== */
/*  CONTADOR                                                           */
/* ================================================================== */

// Quantos dias faltam para o lançamento (contando a partir de agora)
const DIAS_PARA_LANCAMENTO = 3

const pad = (n) => String(n).padStart(2, "0")

const formatDate = (date) =>
    `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} às ${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`

const calcTimeLeft = (date) => {
    const diff = date.getTime() - Date.now()

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        done: false
    }
}

/* ================================================================== */
/*  TELA                                                               */
/* ================================================================== */

const Drops = () => {
    const navigation = useNavigation()

    // Textos e imagem do drop vêm da configuração do site (back)
    const [drop, setDrop] = useState(null)
    const [loading, setLoading] = useState(true)

    // Data do lançamento: agora + 3 dias (fixada quando a tela abre)
    const dropDate = useRef(
        new Date(Date.now() + DIAS_PARA_LANCAMENTO * 24 * 60 * 60 * 1000)
    ).current

    const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(dropDate))

    const pulse = useRef(new Animated.Value(1)).current

    useEffect(() => {
        getSiteConfig()
            .then((config) => setDrop(config?.colecoes ?? null))
            .catch(() => setDrop(null))
            .finally(() => setLoading(false))
    }, [])

    // Atualiza o contador a cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calcTimeLeft(dropDate))
        }, 1000)

        return () => clearInterval(timer)
    }, [dropDate])

    // Bolinha verde pulsando
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 0.25, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true })
            ])
        )
        loop.start()
        return () => loop.stop()
    }, [pulse])

    const lancado = timeLeft.done
    const temImagem = /^https?:\/\//.test(drop?.bannerImagem ?? "")

    const blocos = [
        { label: "DIAS", value: timeLeft.days },
        { label: "HORAS", value: timeLeft.hours },
        { label: "MIN", value: timeLeft.minutes },
        { label: "SEG", value: timeLeft.seconds }
    ]

    return (
        <Container>
            <StatusBar backgroundColor={BG} barStyle="light-content" />

            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            <Content>

                {/* STATUS */}

                <StatusRow>
                    <Animated.View style={{ opacity: pulse }}>
                        <StatusDot $live={lancado} />
                    </Animated.View>

                    <StatusText $live={lancado}>
                        {lancado ? "DISPONÍVEL AGORA" : "PRÓXIMO LANÇAMENTO"}
                    </StatusText>
                </StatusRow>

                {/* TÍTULO */}

                <DropTitle>
                    {loading ? "..." : drop?.dropTitulo ?? "DROP"}
                    <Accent>.</Accent>
                </DropTitle>

                {!!drop?.dropSubtitulo && (
                    <DropSubtitle>{drop.dropSubtitulo}</DropSubtitle>
                )}

                {/* CONTADOR */}

                <TimerContainer>
                    {blocos.map((b, i) => (
                        <TimerItem key={b.label} $last={i === blocos.length - 1}>
                            <TimerNumber $done={lancado}>{pad(b.value)}</TimerNumber>
                            <TimerLabel>{b.label}</TimerLabel>
                        </TimerItem>
                    ))}
                </TimerContainer>

                <DateText>
                    {lancado ? "Lançado em " : "Lança em "}
                    <DateStrong>{formatDate(dropDate)}</DateStrong>
                </DateText>

                {/* BANNER */}

                <BannerBox>
                    {temImagem ? (
                        <Image
                            source={{ uri: drop.bannerImagem }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    ) : (
                        <>
                            <BannerWatermark>HC</BannerWatermark>
                            <PlaceholderText>
                                {drop?.dropSubtitulo ?? "IMAGEM DO DROP"}
                            </PlaceholderText>
                        </>
                    )}

                    <BannerTag>
                        <BannerTagText>{lancado ? "NO AR" : "EM BREVE"}</BannerTagText>
                    </BannerTag>
                </BannerBox>

                {/* CONCEITO */}

                <ConceptContainer>
                    <ConceptHeader>
                        <ConceptDash />
                        <ConceptTitle>O CONCEITO</ConceptTitle>
                    </ConceptHeader>

                    <ConceptText>
                        {drop?.dropDescricao ?? "Em breve novidades."}
                    </ConceptText>
                </ConceptContainer>

                {/* BOTÃO */}

                <CheckButton
                    onPress={() => navigation.navigate("ProductList")}
                    activeOpacity={0.85}
                >
                    <CheckText>{lancado ? "VER COLEÇÃO" : "CONFERIR PRODUTOS"}</CheckText>

                    <ArrowBox>
                        <Arrow>→</Arrow>
                    </ArrowBox>
                </CheckButton>

            </Content>

            <BottomMenu active="Drops" />
        </Container>
    )
}

export default Drops

/* ================================================================== */
/*  ESTILOS                                                            */
/* ================================================================== */

const Container = styled.View`
    flex: 1;
    background-color: ${BG};
`

const HeaderWrapper = styled.View`
    padding-top: ${TOP_SPACE}px;
    background-color: ${BG};
`

const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { paddingTop: 16, paddingHorizontal: 24, paddingBottom: 120 }
})`
    flex: 1;
`

/* Status */

const StatusRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 14px;
`

const StatusDot = styled.View`
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-right: 10px;
    background-color: ${(p) => (p.$live ? "#FF3B3B" : ACCENT)};
`

const StatusText = styled.Text`
    color: ${(p) => (p.$live ? "#FF3B3B" : ACCENT)};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2.5px;
`

/* Título */

const DropTitle = styled.Text`
    color: ${TEXT};
    font-size: 46px;
    line-height: 48px;
    font-weight: 900;
    letter-spacing: -1.5px;
`

const Accent = styled.Text`
    color: ${ACCENT};
`

const DropSubtitle = styled.Text`
    color: ${MUTED};
    font-size: 15px;
    line-height: 22px;
    margin-top: 8px;
`

/* Contador */

const TimerContainer = styled.View`
    flex-direction: row;
    margin-top: 28px;
`

const TimerItem = styled.View`
    flex: 1;
    height: 86px;
    margin-right: ${(p) => (p.$last ? 0 : 10)}px;
    border-radius: 16px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    align-items: center;
    justify-content: center;
`

const TimerNumber = styled.Text`
    color: ${(p) => (p.$done ? FAINT : ACCENT)};
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -1px;
`

const TimerLabel = styled.Text`
    color: ${MUTED};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.8px;
    margin-top: 4px;
`

const DateText = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 14px;
`

const DateStrong = styled.Text`
    color: ${TEXT};
    font-weight: 700;
`

/* Banner */

const BannerBox = styled.View`
    width: 100%;
    height: 220px;
    margin-top: 32px;
    border-radius: 22px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    overflow: hidden;
    align-items: center;
    justify-content: center;
`

const BannerWatermark = styled.Text`
    position: absolute;
    right: -10px;
    bottom: -36px;
    font-size: 160px;
    font-weight: 900;
    letter-spacing: -10px;
    color: ${ACCENT};
    opacity: 0.06;
`

const PlaceholderText = styled.Text`
    color: ${FAINT};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2px;
    text-align: center;
    padding: 0 24px;
`

const BannerTag = styled.View`
    position: absolute;
    top: 14px;
    left: 14px;
    background-color: ${ACCENT};
    border-radius: 999px;
    padding: 5px 11px;
`

const BannerTagText = styled.Text`
    color: #000000;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

/* Conceito */

const ConceptContainer = styled.View`
    margin-top: 32px;
`

const ConceptHeader = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
`

const ConceptDash = styled.View`
    width: 24px;
    height: 2px;
    background-color: ${ACCENT};
    margin-right: 10px;
`

const ConceptTitle = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2.5px;
`

const ConceptText = styled.Text`
    color: ${MUTED};
    font-size: 15px;
    line-height: 24px;
`

/* Botão */

const CheckButton = styled.TouchableOpacity`
    height: 60px;
    margin-top: 32px;
    border-radius: 16px;
    background-color: ${ACCENT};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 24px;
    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.35;
    shadow-radius: 18px;
    elevation: 8;
`

const CheckText = styled.Text`
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 2.5px;
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