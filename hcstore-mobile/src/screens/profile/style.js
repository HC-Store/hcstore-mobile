import styled from "styled-components/native"

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #f4f4f4;
`

const Content = styled.ScrollView`
    flex: 1;
    padding-horizontal: 14px;
`

/* PERFIL */

const ProfileCard = styled.View`
    background-color: #07150f;
    padding: 14px;
    margin-top: 10px;
`

const ProfileTop = styled.View`
    flex-direction: row;
    align-items: center;
`


const Avatar = styled.Text`
    width: 45px;
    height: 45px;
    background-color: #151515;
    color: #00ff63;
    font-size: 11px;
    font-weight: bold;
    text-align: center;
    text-align-vertical: center;
`


const ProfileInfo = styled.View`
    flex: 1;
    margin-left: 12px;
`

const NameRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const Name = styled.Text`
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
`

const Verified = styled.Text`
    color: #00ff63;
    font-size: 10px;
    margin-left: 5px;
`

const Email = styled.Text`
    color: #aaaaaa;
    font-size: 9px;
    margin-top: 3px;
`

const MemberSince = styled.Text`
    color: #777777;
    font-size: 7px;
    margin-top: 4px;
`

const LevelArea = styled.View`
    margin-top: 15px;
`

const LevelTop = styled.View`
    flex-direction: row;
    justify-content: space-between;
`

const LevelText = styled.Text`
    color: #ffffff;
    font-size: 8px;
    font-weight: bold;
`

const Points = styled.Text`
    color: #00ff63;
    font-size: 8px;
    font-weight: bold;
`

const ProgressBackground = styled.View`
    width: 100%;
    height: 5px;
    background-color: #242424;
    margin-top: 8px;
`

const ProgressBar = styled.View`
    width: 70%;
    height: 100%;
    background-color: #00e85a;
`

const LevelDescription = styled.Text`
    color: #888888;
    font-size: 7px;
    margin-top: 5px;
`

/* SECTION */

const SectionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 7px;
`

const SectionTitle = styled.Text`
    color: #777777;
    font-size: 8px;
    letter-spacing: 1px;
`

const SectionAction = styled.Text`
    color: #00c853;
    font-size: 8px;
    font-weight: bold;
`

/* PEDIDO */

const OrderCard = styled.View`
    background-color: #111111;
    padding: 10px;
`

const OrderTop = styled.View`
    flex-direction: row;
    align-items: center;
`

const ProductImage = styled.View`
    width: 42px;
    height: 42px;
    background-color: #292929;
`

const OrderInfo = styled.View`
    flex: 1;
    margin-left: 9px;
`

const ProductName = styled.Text`
    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
`

const ProductDetails = styled.Text`
    color: #777777;
    font-size: 8px;
    margin-top: 4px;
`

const OrderPrice = styled.Text`
    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
`

const DeliveryRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 12px;
`

const DeliveryStatus = styled.Text`
    color: #00e85a;
    font-size: 8px;
    font-weight: bold;
`

const DeliveryDate = styled.Text`
    color: #aaaaaa;
    font-size: 7px;
`

const TrackButton = styled.TouchableOpacity`
    border-width: 1px;
    border-color: #555555;
    height: 34px;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
`

const TrackButtonText = styled.Text`
    color: #ffffff;
    font-size: 9px;
    font-weight: bold;
`

/* GRID */

const Grid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`

const GridCard = styled.TouchableOpacity`
    width: 49%;
    background-color: #111111;
    padding: 10px;
    min-height: 82px;
    margin-bottom: 4px;
`

const GridTop = styled.View`
    flex-direction: row;
    justify-content: space-between;
`

const GridIcon = styled.Text`
    color: #ffffff;
    font-size: 11px;
`

const GridBadge = styled.Text`
    color: #00ff63;
    font-size: 7px;
    font-weight: bold;
`

const GridTitle = styled.Text`
    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
    margin-top: 10px;
`

const GridDescription = styled.Text`
    color: #777777;
    font-size: 7px;
    margin-top: 3px;
`

/* PREFERÊNCIAS */

const PreferencesContainer = styled.View`
    background-color: #111111;
`

const PreferenceItem = styled.TouchableOpacity`
    min-height: 55px;
    padding-horizontal: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #292929;
`

const PreferenceLeft = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`

const PreferenceIcon = styled.Text`
    color: #aaaaaa;
    width: 25px;
    font-size: 12px;
`

const PreferenceContent = styled.View`
    flex: 1;
`

const PreferenceTitle = styled.Text`
    color: #ffffff;
    font-size: 9px;
`

const PreferenceDescription = styled.Text`
    color: #777777;
    font-size: 7px;
    margin-top: 3px;
`

const Arrow = styled.Text`
    color: #777777;
    font-size: 18px;
`

const Switch = styled.View`
    width: 31px;
    height: 17px;
    border-radius: 10px;
    background-color: #00e85a;
    justify-content: center;
    align-items: flex-end;
    padding-horizontal: 2px;
`

const SwitchCircle = styled.View`
    width: 13px;
    height: 13px;
    border-radius: 7px;
    background-color: #ffffff;
`

const OnlineText = styled.Text`
    color: #00ff63;
    font-size: 7px;
    font-weight: bold;
`

/* LOGOUT */

const LogoutButton = styled.TouchableOpacity`
    height: 43px;
    background-color: #111111;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`

const LogoutText = styled.Text`
    color: #ffffff;
    font-size: 9px;
`

const VersionText = styled.Text`
    color: #999999;
    font-size: 7px;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
`

export {
    Container,
    Content,

    ProfileCard,
    ProfileTop,
    Avatar,
    ProfileInfo,
    NameRow,
    Name,
    Verified,
    Email,
    MemberSince,

    LevelArea,
    LevelTop,
    LevelText,
    Points,
    ProgressBackground,
    ProgressBar,
    LevelDescription,

    SectionHeader,
    SectionTitle,
    SectionAction,

    OrderCard,
    OrderTop,
    ProductImage,
    OrderInfo,
    ProductName,
    ProductDetails,
    OrderPrice,
    DeliveryRow,
    DeliveryStatus,
    DeliveryDate,
    TrackButton,
    TrackButtonText,

    Grid,
    GridCard,
    GridTop,
    GridIcon,
    GridBadge,
    GridTitle,
    GridDescription,

    PreferencesContainer,
    PreferenceItem,
    PreferenceLeft,
    PreferenceIcon,
    PreferenceContent,
    PreferenceTitle,
    PreferenceDescription,
    Arrow,
    Switch,
    SwitchCircle,
    OnlineText,

    LogoutButton,
    LogoutText,

    VersionText
}