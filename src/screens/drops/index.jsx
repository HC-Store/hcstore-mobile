
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { Image } from "react-native"
import { getSiteConfig } from "../../services/api"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

import {
    Container,
    Content,
    LaunchText,
    DropImagePlaceholder,
    DropTitle,
    TimerContainer,
    TimerItem,
    TimerNumber,
    TimerLabel,
    ConceptContainer,
    ConceptTitle,
    ConceptText,
    CheckButton,
    CheckText,
    PlaceholderText,
    Arrow
} from "./style"

const Drops = () => {

    const navigation = useNavigation()

    // Dados do drop vêm da configuração do site (back)
    const [drop, setDrop] = useState(null)

    useEffect(() => {
        getSiteConfig()
            .then((config) => setDrop(config?.colecoes ?? null))
            .catch(() => setDrop(null))
    }, [])

    const dropDate = drop?.dataLancamento
        ? new Date(drop.dataLancamento)
        : null

    const calculateTimeLeft = () => {
        if (!dropDate || Number.isNaN(dropDate.getTime())) {
            return { days: 0, hours: 0, minutes: 0 }
        }


        const now = new Date()
        const difference = dropDate.getTime() - now.getTime()

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0
            }
        }

        return {
            days: Math.floor(
                difference / (1000 * 60 * 60 * 24)
            ),
            hours: Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            ),
            minutes: Math.floor(
                (difference / (1000 * 60)) % 60
            )
        }
    }

    const [timeLeft, setTimeLeft] = useState(
        calculateTimeLeft
    )

    // Recria o contador quando os dados do drop chegam do back
    useEffect(() => {

        setTimeLeft(calculateTimeLeft())

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)

    }, [drop])

    const formatNumber = (number) => {
        return String(number).padStart(2, "0")
    }

    const handleCheckDrop = () => {
        navigation.navigate("ProductList")
    }

    return (
        <Container>

            <Header />

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 30
                }}
            >

                <LaunchText>
                    Próximo lançamento
                </LaunchText>

                <DropTitle>
                    {drop?.dropTitulo ?? "DROP"}
                </DropTitle>

                <TimerContainer>

                    <TimerItem>
                        <TimerNumber>
                            {formatNumber(timeLeft.days)}
                        </TimerNumber>

                        <TimerLabel>
                            Dias
                        </TimerLabel>
                    </TimerItem>

                    <TimerItem>
                        <TimerNumber>
                            {formatNumber(timeLeft.hours)}
                        </TimerNumber>

                        <TimerLabel>
                            Horas
                        </TimerLabel>
                    </TimerItem>

                    <TimerItem>
                        <TimerNumber>
                            {formatNumber(timeLeft.minutes)}
                        </TimerNumber>

                        <TimerLabel>
                            Mins
                        </TimerLabel>
                    </TimerItem>

                </TimerContainer>

                <ConceptContainer>

                    <ConceptTitle>
                        O Conceito
                    </ConceptTitle>
    
    
     {/^https?:\/\//.test(drop?.bannerImagem ?? "") ? (
                        <Image
                            source={{ uri: drop.bannerImagem }}
                            style={{ width: "100%", height: 200 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <DropImagePlaceholder>
                            <PlaceholderText>
                                {drop?.dropSubtitulo ?? "IMAGEM DO DROP"}
                            </PlaceholderText>
                        </DropImagePlaceholder>
                    )}

                    <ConceptText>
                        {drop?.dropDescricao ?? "Em breve novidades."}
                    </ConceptText>

                    <CheckButton
                        onPress={handleCheckDrop}
                    >

                        <CheckText>
                            CONFERIR
                        </CheckText>

                        <Arrow>
                            →
                        </Arrow>

                    </CheckButton>

                </ConceptContainer>

            </Content>

            <BottomMenu active="Drops" />

        </Container>
    )
}

export default Drops
