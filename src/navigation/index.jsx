import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Login from "../screens/login"
import SignUp from "../screens/sign-up"
import Home from "../screens/home"
import ProductList from "../screens/product-list"
import ProductDetails from "../screens/product-details"
import Cart from "../screens/cart"
import Drops from "../screens/drops"
import Profile from "../screens/profile"
import Checkout from "../screens/checkout"

const Stack = createNativeStackNavigator()

const Navigation = () => {

    return (
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
                    name="Cart"
                    component={Cart}
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
                    name="Checkout"
                    component={Checkout}
                />

            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default Navigation