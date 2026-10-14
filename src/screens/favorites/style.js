import styled from "styled-components/native"

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #f4f4f4;
`

export const Content = styled.ScrollView`
    flex: 1;
    padding-horizontal: 14px;
`

export const PageHeader = styled.View`
    margin-top: 24px;
    margin-bottom: 24px;
`

export const Eyebrow = styled.Text`
    color: #00a84b;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 7px;
`

export const PageTitle = styled.Text`
    color: #111111;
    font-size: 29px;
    font-weight: 900;
`

export const PageDescription = styled.Text`
    color: #777777;
    font-size: 12px;
    margin-top: 8px;
    line-height: 19px;
`

export const CountRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
`

export const CountText = styled.Text`
    color: #555555;
    font-size: 11px;
    font-weight: bold;
`

export const ProductGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`

export const ProductCard = styled.TouchableOpacity`
    width: 48.5%;
    background-color: #ffffff;
    margin-bottom: 15px;
    overflow: hidden;
`

export const ProductImageArea = styled.View`
    height: 175px;
    background-color: #e7e7e7;
    align-items: center;
    justify-content: center;
`

export const ProductImage = styled.Image`
    width: 100%;
    height: 100%;
`

export const ProductPlaceholder = styled.Text`
    color: #999999;
    font-size: 10px;
    letter-spacing: 1px;
`

export const FavoriteButton = styled.TouchableOpacity`
    position: absolute;
    top: 9px;
    right: 9px;
    width: 34px;
    height: 34px;
    background-color: #ffffff;
    border-radius: 17px;
    align-items: center;
    justify-content: center;
`

export const ProductInfo = styled.View`
    padding: 12px;
`

export const ProductName = styled.Text`
    color: #111111;
    font-size: 12px;
    font-weight: bold;
    min-height: 34px;
`

export const ProductPrice = styled.Text`
    color: #111111;
    font-size: 14px;
    font-weight: 900;
    margin-top: 8px;
`

export const ProductAction = styled.TouchableOpacity`
    background-color: #111111;
    height: 36px;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
`

export const ProductActionText = styled.Text`
    color: #ffffff;
    font-size: 9px;
    font-weight: bold;
    letter-spacing: 1px;
`

export const EmptyContainer = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-horizontal: 30px;
    padding-top: 75px;
    padding-bottom: 75px;
`

export const EmptyIconArea = styled.View`
    width: 85px;
    height: 85px;
    background-color: #111111;
    border-radius: 43px;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
`

export const EmptyTitle = styled.Text`
    color: #111111;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
`

export const EmptyDescription = styled.Text`
    color: #777777;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    margin-top: 12px;
`

export const ExploreButton = styled.TouchableOpacity`
    background-color: #111111;
    padding-horizontal: 30px;
    height: 45px;
    justify-content: center;
    align-items: center;
    margin-top: 26px;
`

export const ExploreButtonText = styled.Text`
    color: #00ff63;
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 1px;
`
