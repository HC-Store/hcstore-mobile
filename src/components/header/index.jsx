import { useState } from "react"
import { Modal, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

import Cart from "../cart"
import { useCart } from "../../context/cart-context"

import {
    HeaderContainer,
    LogoContainer,
    LogoHC,
    LogoStore,
    HeaderActions,
    IconButton,
    ModalContainer,
    MenuOverlay,
    MenuTop,
    SearchContainer,
    SearchText,
    MenuItem,
    MenuText
} from "./style"


const Header = () => {

    const navigation = useNavigation()

    const [menuOpen, setMenuOpen] = useState(false)

    const {
        openCart
    } = useCart()


    const navigateTo = (screen) => {
        setMenuOpen(false)
        navigation.navigate(screen)
    }


    const openCartFromMenu = () => {
        setMenuOpen(false)
        openCart()
    }


    return (
        <>

            <HeaderContainer>

                <LogoContainer>

                    <LogoHC>
                        HC
                    </LogoHC>

                    <LogoStore>
                        STORE
                    </LogoStore>

                </LogoContainer>


                <HeaderActions>

                    {/* SACOLA */}

                    <IconButton
                        onPress={openCart}
                        hitSlop={{
                            top: 12,
                            bottom: 12,
                            left: 12,
                            right: 12
                        }}
                    >

                        <Ionicons
                            name="bag-outline"
                            size={23}
                            color="#FFFFFF"
                        />

                    </IconButton>


                    {/* MENU */}

                    <IconButton
                        onPress={() => setMenuOpen(true)}
                    >

                        <Ionicons
                            name="menu-outline"
                            size={28}
                            color="#FFFFFF"
                        />

                    </IconButton>

                </HeaderActions>

            </HeaderContainer>


            {/* MENU LATERAL */}

            <Modal
                visible={menuOpen}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setMenuOpen(false)}
            >

                <ModalContainer>

                    <Pressable
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                        onPress={() => setMenuOpen(false)}
                    />


                    <MenuOverlay>

                        <MenuTop>

                            <IconButton
                                onPress={() => setMenuOpen(false)}
                            >

                                <Ionicons
                                    name="close-outline"
                                    size={30}
                                    color="#FFFFFF"
                                />

                            </IconButton>

                        </MenuTop>


                        <SearchContainer>

                            <Ionicons
                                name="search-outline"
                                size={17}
                                color="#777777"
                            />

                            <SearchText>
                                Buscar
                            </SearchText>

                        </SearchContainer>


                        <MenuItem
                            onPress={() =>
                                navigateTo("ProductList")
                            }
                        >
                            <MenuText>
                                Catálogo
                            </MenuText>
                        </MenuItem>


                        <MenuItem
                            onPress={() =>
                                navigateTo("Drops")
                            }
                        >
                            <MenuText>
                                Drops
                            </MenuText>
                        </MenuItem>


                        <MenuItem
                            onPress={() =>
                                navigateTo("Favorites")
                            }
                        >
                            <MenuText>
                                Favoritos
                            </MenuText>
                        </MenuItem>


                        <MenuItem
                            onPress={openCartFromMenu}
                        >
                            <MenuText>
                                Carrinho
                            </MenuText>
                        </MenuItem>


                        <MenuItem
                            onPress={() =>
                                navigateTo("Profile")
                            }
                        >
                            <MenuText>
                                Perfil
                            </MenuText>
                        </MenuItem>

                    </MenuOverlay>

                </ModalContainer>

            </Modal>


            <Cart />

        </>
    )
}


export default Header