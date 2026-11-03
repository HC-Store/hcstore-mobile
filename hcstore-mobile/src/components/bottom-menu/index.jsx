import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

import {
    Container,
    MenuItem,
    MenuText
} from "./style"

const BottomMenu = ({ active }) => {

    const navigation = useNavigation()

    const goTo = (screen) => {
        navigation.navigate(screen)
    }

    return (
        <Container>

            <MenuItem
                onPress={() => goTo("Home")}
            >
                <Ionicons
                    name={
                        active === "Home"
                            ? "home"
                            : "home-outline"
                    }
                    size={22}
                    color={
                        active === "Home"
                            ? "#00FF5A"
                            : "#707070"
                    }
                />

                <MenuText active={active === "Home"}>
                    Home
                </MenuText>
            </MenuItem>


            <MenuItem
                onPress={() => goTo("ProductList")}
            >
                <Ionicons
                    name={
                        active === "Catalog"
                            ? "grid"
                            : "grid-outline"
                    }
                    size={22}
                    color={
                        active === "Catalog"
                            ? "#00FF5A"
                            : "#707070"
                    }
                />

                <MenuText active={active === "Catalog"}>
                    Catálogo
                </MenuText>
            </MenuItem>


            <MenuItem
                onPress={() => goTo("Drops")}
            >
                <Ionicons
                    name={
                        active === "Drops"
                            ? "flame"
                            : "flame-outline"
                    }
                    size={22}
                    color={
                        active === "Drops"
                            ? "#00FF5A"
                            : "#707070"
                    }
                />

                <MenuText active={active === "Drops"}>
                    Drops
                </MenuText>
            </MenuItem>


            <MenuItem
                onPress={() => navigation.navigate("Favorites")}
            >
                <Ionicons
                    name={
                        active === "Favorites"
                            ? "heart"
                            : "heart-outline"
                    }
                    size={22}
                    color={
                        active === "Favorites"
                            ? "#00FF5A"
                            : "#707070"
                    }
                />

                <MenuText active={active === "Favorites"}>
                    Favoritos
                </MenuText>
            </MenuItem>


            <MenuItem
                onPress={() => goTo("Profile")}
            >
                <Ionicons
                    name={
                        active === "Profile"
                            ? "person"
                            : "person-outline"
                    }
                    size={22}
                    color={
                        active === "Profile"
                            ? "#00FF5A"
                            : "#707070"
                    }
                />

                <MenuText active={active === "Profile"}>
                    Perfil
                </MenuText>
            </MenuItem>

        </Container>
    )
}

export default BottomMenu