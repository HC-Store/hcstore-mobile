import { NavigationContainer } from "@react-navigation/native"
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



const Stack = createNativeStackNavigator()


export default function App() {

    return (

        <CartProvider>
            <FavoritesProvider>

            <NavigationContainer>

                <Stack.Navigator
                    initialRouteName="Login"
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