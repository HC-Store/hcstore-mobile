import styled from "styled-components/native"

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #FFFFFF;
`

const Content = styled.ScrollView`
    flex: 1;
    background-color: #000000;
`

const LaunchText = styled.Text`
    color: #00E85A;
    font-size: 14px;
    margin-top: 25px;
    text-align: center;
    background-color: #FFFFFF;
`

const DropTitle = styled.Text`
    color: #000000;
    font-size: 31px;
    font-weight: 900;
    text-align: center;
    background-color: #FFFFFF;
    padding-top: 10px;
`

const TimerContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    padding-top: 15px;
    padding-bottom: 28px;
`

const TimerItem = styled.View`
    align-items: center;
    min-width: 65px;
`

const TimerNumber = styled.Text`
    color: #000000;
    font-size: 25px;
    font-weight: bold;
`

const TimerLabel = styled.Text`
    color: #00E85A;
    font-size: 11px;
`

const DropImagePlaceholder = styled.View`
    width: 100%;
    height: 220px;
    background-color: #222222;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
`

const PlaceholderText = styled.Text`
    color: #888888;
    font-size: 11px;
`

const ConceptContainer = styled.View`
    background-color: #000000;
    padding: 22px 14px 80px 14px;
    min-height: 400px;
`

const ConceptTitle = styled.Text`
    color: #FFFFFF;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
`

const ConceptText = styled.Text`
    color: #FFFFFF;
    font-size: 12px;
    line-height: 18px;
`

const CheckButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-top: 30px;
`

const CheckText = styled.Text`
    color: #00FF55;
    font-size: 16px;
    font-weight: bold;
`

const Arrow = styled.Text`
    color: #00FF55;
    font-size: 25px;
    margin-left: 18px;
`

export {
    Container,
    Content,
    LaunchText,
    DropTitle,
    TimerContainer,
    TimerItem,
    TimerNumber,
    TimerLabel,
    DropImagePlaceholder,
    PlaceholderText,
    ConceptContainer,
    ConceptTitle,
    ConceptText,
    CheckButton,
    CheckText,
    Arrow
}