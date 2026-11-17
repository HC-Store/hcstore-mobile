import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { CartProvider } from "./src/context/cart-context"

import Login from "./src/screens/login"
import SignUp from "./src/screens/sign-up"
import Home from "./src/screens/home"
import ProductList from "./src/screens/product-list"
import ProductDetails from "./src/screens/product-details"
import Checkout from "./src/screens/checkout"
import Drops from "./src/screens/drops"
import Profile from "./src/screens/profile"
import Favorites from "./src/screens/favorites"
import { FavoritesProvider } from "./src/context/favorites-context"
import { restoreSession, setUnauthorizedHandler } from "./src/services/api"



const Stack = createNativeStackNavigator()
const navigationRef = createNavigationContainerRef()


export default function App() {

    // Lê o login salvo antes de decidir a primeira tela
    const [initialRoute, setInitialRoute] = useState(null)

    useEffect(() => {
        restoreSession().then((logged) =>
            setInitialRoute(logged ? "Home" : "Login")
        )

        // Token recusado pelo back (expirado): volta para o login
        setUnauthorizedHandler(() => {
            if (navigationRef.isReady()) {
                navigationRef.reset({ index: 0, routes: [{ name: "Login" }] })
            }
        })
    }, [])

    if (!initialRoute) {
        return (
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#000" }}>
                <ActivityIndicator color="#00FF63" />
            </View>
        )
    }

    return (

        <CartProvider>
            <FavoritesProvider>

            <NavigationContainer ref={navigationRef}>

                <Stack.Navigator
                    initialRouteName={initialRoute}
                    screenOptions={{
                        headerShown: false
                    }}
                >

                    <Stack.Screen
                        name="Login"
                        component={Login}
                    />

                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                    />

                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />

                    <Stack.Screen
                        name="ProductList"
                        component={ProductList}
                    />

                    <Stack.Screen
                        name="ProductDetails"
                        component={ProductDetails}
                    />

                    <Stack.Screen
                        name="Checkout"
                        component={Checkout}
                    />
                    <Stack.Screen
                       name="Drops"
                       component={Drops}
                    />

                    <Stack.Screen
                      name="Profile"
                      component={Profile}
                    />
                    <Stack.Screen
                        name="Favorites"
                        component={Favorites}
                    />

                </Stack.Navigator>

            </NavigationContainer>
            </FavoritesProvider>
        </CartProvider>

    )
}