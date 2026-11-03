
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"

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

    // ALTERAR PARA A DATA REAL DO PRÓXIMO DROP
    const dropDate = new Date("2026-10-04T20:00:00")

    const calculateTimeLeft = () => {

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

    useEffect(() => {

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)

    }, [])

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
                    DROP 01:
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
    
    
     <DropImagePlaceholder>
        <PlaceholderText>
            IMAGEM DO DROP
        </PlaceholderText>
     </DropImagePlaceholder>

                    <ConceptText>
                        O OFF-GRID é um mergulho na textura brutalista
                        da cidade. Criamos uma fusão entre a estética
                        utilitária das ruas e o acabamento premium.
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
