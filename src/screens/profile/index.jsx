import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Switch,
    StatusBar
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"

import {
    createEndereco,
    deleteEndereco,
    getCurrentUser,
    getMyEnderecos,
    getMyPedidos,
    logout
} from "../../services/api"

import { useCart } from "../../context/cart-context"
import { useFavorites } from "../../context/favorites-context"
import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

/* ================================================================== */
/*  TEMA                                                               */
/* ================================================================== */

const BG = "#070707"
const SURFACE = "#111111"
const SURFACE_2 = "#171717"
const BORDER = "#222222"
const ACCENT = "#00E640"
const TEXT = "#F5F5F5"
const MUTED = "#8C8C8C"
const FAINT = "#4A4A4A"
const DANGER = "#FF5A5F"

const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 8 : 44

/* ================================================================== */
/*  AJUDANTES                                                          */
/* ================================================================== */

const formatPrice = (value) =>
    `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`

const getInitials = (name) =>
    (name || "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "HC"

const buildUser = () => {
    const current = getCurrentUser()

    return {
        name: current?.nome ?? "",
        email: current?.email ?? "",
        memberSince: "",
        points: null
    }
}

/* ================================================================== */
/*  COMPONENTES AUXILIARES (fora da tela p/ não perder o foco)         */
/* ================================================================== */

const ActionButton = ({ title, onPress, variant = "primary", loading }) => (
    <ActionBtn $variant={variant} onPress={onPress} activeOpacity={0.85} disabled={loading}>
        {loading ? (
            <ActivityIndicator color={variant === "primary" ? "#000" : ACCENT} />
        ) : (
            <ActionBtnText $variant={variant}>{title}</ActionBtnText>
        )}
    </ActionBtn>
)

const InputField = ({ label, half, ...props }) => {
    const [focused, setFocused] = useState(false)

    return (
        <FieldWrapper $half={half}>
            <FieldLabel $focused={focused}>{label}</FieldLabel>
            <FieldInput
                $focused={focused}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...props}
            />
        </FieldWrapper>
    )
}

const EmptyMessage = ({ icon = "information-circle-outline", message }) => (
    <EmptyBox>
        <Ionicons name={icon} size={26} color={FAINT} />
        <EmptyText>{message}</EmptyText>
    </EmptyBox>
)

const Option = ({ title, selected, onPress }) => (
    <OptionBtn $selected={selected} onPress={onPress} activeOpacity={0.8}>
        <OptionText $selected={selected}>{title}</OptionText>
    </OptionBtn>
)

const MenuItem = ({ icon, title, description, onPress, right, last }) => (
    <MenuRow onPress={onPress} activeOpacity={0.7} $last={last}>
        <MenuIcon>
            <Ionicons name={icon} size={18} color={ACCENT} />
        </MenuIcon>

        <MenuContent>
            <MenuTitle>{title}</MenuTitle>
            {!!description && <MenuDescription>{description}</MenuDescription>}
        </MenuContent>

        {right ?? <Ionicons name="chevron-forward" size={18} color={FAINT} />}
    </MenuRow>
)

const GridItem = ({ icon, badge, title, description, onPress }) => (
    <GridCard onPress={onPress} activeOpacity={0.8}>
        <GridTop>
            <GridIcon>
                <Ionicons name={icon} size={18} color={ACCENT} />
            </GridIcon>
            <GridBadge>
                <GridBadgeText>{badge}</GridBadgeText>
            </GridBadge>
        </GridTop>

        <GridTitle>{title}</GridTitle>
        <GridDescription>{description}</GridDescription>
    </GridCard>
)

/* ================================================================== */
/*  TELA                                                               */
/* ================================================================== */

const Profile = () => {
    const navigation = useNavigation()
    const { clearCart } = useCart()
    const { clearFavorites } = useFavorites()

    const [user] = useState(buildUser)
    const [orders, setOrders] = useState([])
    const [addresses, setAddresses] = useState([])
    const [coupons] = useState([])

    const [activeModal, setActiveModal] = useState(null)

    const [cep, setCep] = useState("")
    const [street, setStreet] = useState("")
    const [number, setNumber] = useState("")
    const [neighborhood, setNeighborhood] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [complement, setComplement] = useState("")
    const [loadingCep, setLoadingCep] = useState(false)
    const [savingAddress, setSavingAddress] = useState(false)

    const [clothingSize, setClothingSize] = useState("M")
    const [shoeSize, setShoeSize] = useState("41")
    const [dropAlerts, setDropAlerts] = useState(false)

    const loadAddresses = () =>
        getMyEnderecos().then(setAddresses).catch(() => setAddresses([]))

    useEffect(() => {
        loadAddresses()

        getMyPedidos()
            .then((list) =>
                setOrders(
                    list.map((pedido) => ({
                        id: pedido.id,
                        productName: `Pedido de ${new Date(pedido.createdAt).toLocaleDateString("pt-BR")}`,
                        status: pedido.status,
                        total: pedido.totalFinal ?? pedido.total
                    }))
                )
            )
            .catch(() => setOrders([]))
    }, [])

    const openModal = (name) => setActiveModal(name)
    const closeModal = () => setActiveModal(null)

    /* ---------- ENDEREÇOS ---------- */

    const searchCep = async () => {
        const cleanCep = cep.replace(/\D/g, "")

        if (cleanCep.length !== 8) {
            Alert.alert("CEP inválido", "Informe 8 números.")
            return
        }

        try {
            setLoadingCep(true)

            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            if (!response.ok) throw new Error("Falha na consulta")

            const data = await response.json()

            if (data.erro) {
                Alert.alert("Atenção", "CEP não encontrado.")
                return
            }

            setStreet(data.logradouro || "")
            setNeighborhood(data.bairro || "")
            setCity(data.localidade || "")
            setState(data.uf || "")
        } catch {
            Alert.alert("Erro", "Não foi possível consultar o CEP.")
        } finally {
            setLoadingCep(false)
        }
    }

    const clearAddressForm = () => {
        setCep("")
        setStreet("")
        setNumber("")
        setNeighborhood("")
        setCity("")
        setState("")
        setComplement("")
    }

    const saveAddress = async () => {
        if (
            cep.replace(/\D/g, "").length !== 8 ||
            !street.trim() ||
            !number.trim() ||
            !neighborhood.trim() ||
            !city.trim() ||
            !state.trim()
        ) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios.")
            return
        }

        try {
            setSavingAddress(true)

            await createEndereco({
                cep,
                street: street.trim(),
                number: number.trim(),
                neighborhood: neighborhood.trim(),
                city: city.trim(),
                state: state.trim().toUpperCase(),
                complement: complement.trim()
            })

            await loadAddresses()
            clearAddressForm()
            openModal("addresses")
        } catch (error) {
            Alert.alert("Erro ao salvar endereço", error.message)
        } finally {
            setSavingAddress(false)
        }
    }

    const setPrimaryAddress = (id) => {
        setAddresses((current) =>
            current.map((address) => ({ ...address, primary: address.id === id }))
        )
    }

    const deleteAddress = (id) => {
        Alert.alert("Excluir endereço", "Deseja realmente excluir este endereço?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteEndereco(id)
                    } catch {
                        Alert.alert(
                            "Não foi possível excluir",
                            "Este endereço está vinculado a um pedido e não pode ser removido."
                        )
                        return
                    }

                    setAddresses((current) => {
                        const remaining = current.filter((a) => a.id !== id)

                        if (remaining.length > 0 && !remaining.some((a) => a.primary)) {
                            remaining[0] = { ...remaining[0], primary: true }
                        }

                        return remaining
                    })
                }
            }
        ])
    }

    /* ---------- OUTROS ---------- */

    const openWhatsApp = () => {
        Alert.alert(
            "Atendimento HC Store",
            "O número oficial do WhatsApp ainda precisa ser configurado."
        )
    }

    const handleLogout = () => {
        Alert.alert("Encerrar sessão", "Deseja sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive",
                onPress: () => {
                    logout()
                    clearCart()
                    clearFavorites()
                    navigation.reset({ index: 0, routes: [{ name: "Login" }] })
                }
            }
        ])
    }

    const lastOrder = orders[0]
    const progress =
        user.points === null ? 0 : Math.min(100, Math.max(0, (user.points / 600) * 100))

    /* ================================================================ */
    /*  RENDER                                                           */
    /* ================================================================ */

    return (
        <Container>
            <StatusBar backgroundColor={BG} barStyle="light-content" />

            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            <Content>

                {/* CABEÇALHO */}

                <EyebrowRow>
                    <EyebrowDash />
                    <Eyebrow>MINHA CONTA</Eyebrow>
                </EyebrowRow>

                {/* PERFIL */}

                <ProfileCard>
                    <ProfileTop>
                        <Avatar>
                            <AvatarText>{getInitials(user.name)}</AvatarText>
                        </Avatar>

                        <ProfileInfo>
                            <NameRow>
                                <Name numberOfLines={1}>{user.name || "Minha conta"}</Name>
                                {!!user.name && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={16}
                                        color={ACCENT}
                                        style={{ marginLeft: 6 }}
                                    />
                                )}
                            </NameRow>

                            <Email numberOfLines={1}>
                                {user.email || "Dados da conta pendentes"}
                            </Email>

                            <MemberPill>
                                <MemberText>
                                    {user.memberSince
                                        ? `MEMBRO DESDE ${user.memberSince}`
                                        : "MEMBRO HC STORE"}
                                </MemberText>
                            </MemberPill>
                        </ProfileInfo>
                    </ProfileTop>

                    <LevelArea>
                        <LevelTop>
                            <LevelRow>
                                <Ionicons name="star" size={13} color={ACCENT} />
                                <LevelText>HC CLUB</LevelText>
                            </LevelRow>

                            <Points>
                                {user.points === null ? "EM BREVE" : `${user.points} PTS`}
                            </Points>
                        </LevelTop>

                        <ProgressBackground>
                            <ProgressBar style={{ width: `${progress}%` }} />
                        </ProgressBackground>

                        <LevelDescription>
                            Benefícios e pontuação serão disponibilizados futuramente.
                        </LevelDescription>
                    </LevelArea>
                </ProfileCard>

                {/* ÚLTIMO PEDIDO */}

                <SectionHeader>
                    <SectionTitle>ÚLTIMO PEDIDO</SectionTitle>

                    <SectionAction onPress={() => openModal("orders")} activeOpacity={0.7}>
                        <SectionActionText>VER TODOS</SectionActionText>
                    </SectionAction>
                </SectionHeader>

                <OrderCard>
                    {!lastOrder ? (
                        <EmptyMessage
                            icon="bag-handle-outline"
                            message="Nenhum pedido ainda. Seu histórico vai aparecer aqui."
                        />
                    ) : (
                        <>
                            <OrderTop>
                                <OrderIcon>
                                    <Ionicons name="bag-handle-outline" size={22} color={ACCENT} />
                                </OrderIcon>

                                <OrderInfo>
                                    <OrderName numberOfLines={1}>{lastOrder.productName}</OrderName>
                                    <OrderDetails>Pedido #{lastOrder.id}</OrderDetails>
                                </OrderInfo>

                                <OrderPrice>{formatPrice(lastOrder.total)}</OrderPrice>
                            </OrderTop>

                            <StatusPill>
                                <StatusDot />
                                <StatusText>{String(lastOrder.status || "").toUpperCase()}</StatusText>
                            </StatusPill>

                            <ActionButton
                                title="VER DETALHES"
                                variant="outline"
                                onPress={() => openModal("orders")}
                            />
                        </>
                    )}
                </OrderCard>

                {/* GESTÃO DA CONTA */}

                <SectionHeader>
                    <SectionTitle>GESTÃO DA CONTA</SectionTitle>
                </SectionHeader>

                <Grid>
                    <GridItem
                        icon="receipt-outline"
                        badge={`${orders.length} TOTAL`}
                        title="Meus Pedidos"
                        description="Histórico completo"
                        onPress={() => openModal("orders")}
                    />
                    <GridItem
                        icon="location-outline"
                        badge={`${addresses.length} SALVOS`}
                        title="Endereços"
                        description="Entrega e cobrança"
                        onPress={() => openModal("addresses")}
                    />
                    <GridItem
                        icon="card-outline"
                        badge="EM BREVE"
                        title="Pagamentos"
                        description="Formas de pagamento"
                        onPress={() => openModal("payments")}
                    />
                    <GridItem
                        icon="pricetag-outline"
                        badge={`${coupons.length} ATIVOS`}
                        title="Cupons"
                        description="Minhas ofertas"
                        onPress={() => openModal("coupons")}
                    />
                </Grid>

                {/* PREFERÊNCIAS */}

                <SectionHeader>
                    <SectionTitle>PREFERÊNCIAS & SUPORTE</SectionTitle>
                </SectionHeader>

                <MenuContainer>
                    <MenuItem
                        icon="shirt-outline"
                        title="Preferências de Tamanho"
                        description={`Calçados: ${shoeSize} • Roupas: ${clothingSize}`}
                        onPress={() => openModal("sizes")}
                    />
                    <MenuItem
                        icon="notifications-outline"
                        title="Alertas de Drops & Restocks"
                        description={dropAlerts ? "Ativado" : "Desativado"}
                        onPress={() => setDropAlerts((v) => !v)}
                        right={
                            <Switch
                                value={dropAlerts}
                                onValueChange={setDropAlerts}
                                trackColor={{ false: "#333333", true: ACCENT }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="#333333"
                            />
                        }
                    />
                    <MenuItem
                        icon="help-circle-outline"
                        title="Central de Ajuda & FAQ"
                        description="Dúvidas e devoluções"
                        onPress={() => openModal("faq")}
                    />
                    <MenuItem
                        icon="logo-whatsapp"
                        title="Atendimento via WhatsApp"
                        description="Fale com nossa equipe"
                        onPress={openWhatsApp}
                    />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        title="Privacidade & Termos"
                        description="Proteção de dados"
                        onPress={() => openModal("privacy")}
                        last
                    />
                </MenuContainer>

                {/* SAIR */}

                <LogoutButton onPress={handleLogout} activeOpacity={0.8}>
                    <Ionicons name="log-out-outline" size={18} color={DANGER} />
                    <LogoutText>ENCERRAR SESSÃO</LogoutText>
                </LogoutButton>

                <VersionText>HC STORE • VERSÃO EM DESENVOLVIMENTO</VersionText>

            </Content>

            <BottomMenu active="Profile" />

            {/* ============================================================ */}
            {/*  MODAL                                                       */}
            {/* ============================================================ */}

            <Modal
                visible={activeModal !== null}
                transparent
                animationType="slide"
                onRequestClose={closeModal}
            >
                <Overlay>
                    <OverlayDismiss onPress={closeModal} activeOpacity={1} />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <Sheet>
                            <SheetHandle />

                            <SheetHeader>
                                <SheetTitle>
                                    {{
                                        orders: "MEUS PEDIDOS",
                                        addresses: "MEUS ENDEREÇOS",
                                        addAddress: "NOVO ENDEREÇO",
                                        payments: "PAGAMENTOS",
                                        coupons: "MEUS CUPONS",
                                        sizes: "MEUS TAMANHOS",
                                        faq: "CENTRAL DE AJUDA",
                                        privacy: "PRIVACIDADE E TERMOS"
                                    }[activeModal] ?? ""}
                                </SheetTitle>

                                <CloseBtn onPress={closeModal} activeOpacity={0.7}>
                                    <Ionicons name="close" size={20} color={TEXT} />
                                </CloseBtn>
                            </SheetHeader>

                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 30 }}
                            >

                                {/* MEUS PEDIDOS */}

                                {activeModal === "orders" &&
                                    (orders.length === 0 ? (
                                        <EmptyMessage
                                            icon="bag-handle-outline"
                                            message="Você ainda não possui pedidos."
                                        />
                                    ) : (
                                        orders.map((order) => (
                                            <ItemCard key={order.id}>
                                                <ItemRow>
                                                    <ItemTitle>Pedido #{order.id}</ItemTitle>
                                                    <ItemPrice>{formatPrice(order.total)}</ItemPrice>
                                                </ItemRow>

                                                <ItemSub>{order.productName}</ItemSub>

                                                <StatusPill style={{ marginTop: 12, marginBottom: 0 }}>
                                                    <StatusDot />
                                                    <StatusText>
                                                        {String(order.status || "").toUpperCase()}
                                                    </StatusText>
                                                </StatusPill>
                                            </ItemCard>
                                        ))
                                    ))}

                                {/* ENDEREÇOS */}

                                {activeModal === "addresses" && (
                                    <>
                                        {addresses.length === 0 && (
                                            <EmptyMessage
                                                icon="location-outline"
                                                message="Nenhum endereço cadastrado."
                                            />
                                        )}

                                        {addresses.map((address) => (
                                            <ItemCard key={address.id} $highlight={address.primary}>
                                                <ItemRow>
                                                    <ItemTitle style={{ flex: 1 }}>
                                                        {address.street}, {address.number}
                                                    </ItemTitle>

                                                    {address.primary && (
                                                        <PrimaryTag>
                                                            <PrimaryTagText>PRINCIPAL</PrimaryTagText>
                                                        </PrimaryTag>
                                                    )}
                                                </ItemRow>

                                                {!!address.complement && (
                                                    <ItemSub>{address.complement}</ItemSub>
                                                )}

                                                <ItemSub>
                                                    {address.neighborhood} • {address.city}/{address.state}
                                                </ItemSub>

                                                <ItemSub>CEP {address.cep}</ItemSub>

                                                <ItemActions>
                                                    {!address.primary && (
                                                        <LinkBtn
                                                            onPress={() => setPrimaryAddress(address.id)}
                                                            activeOpacity={0.7}
                                                        >
                                                            <LinkText>DEFINIR COMO PRINCIPAL</LinkText>
                                                        </LinkBtn>
                                                    )}

                                                    <LinkBtn
                                                        onPress={() => deleteAddress(address.id)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <LinkText $danger>EXCLUIR</LinkText>
                                                    </LinkBtn>
                                                </ItemActions>
                                            </ItemCard>
                                        ))}

                                        <ActionButton
                                            title="+ ADICIONAR ENDEREÇO"
                                            onPress={() => {
                                                clearAddressForm()
                                                openModal("addAddress")
                                            }}
                                        />
                                    </>
                                )}

                                {/* NOVO ENDEREÇO */}

                                {activeModal === "addAddress" && (
                                    <>
                                        <CepRow>
                                            <InputField
                                                label="CEP"
                                                value={cep}
                                                onChangeText={setCep}
                                                keyboardType="numeric"
                                                maxLength={9}
                                                placeholder="00000-000"
                                                half
                                            />

                                            <CepBtn onPress={searchCep} activeOpacity={0.85}>
                                                {loadingCep ? (
                                                    <ActivityIndicator color="#000" />
                                                ) : (
                                                    <CepBtnText>BUSCAR</CepBtnText>
                                                )}
                                            </CepBtn>
                                        </CepRow>

                                        <InputField label="RUA" value={street} onChangeText={setStreet} />

                                        <Row>
                                            <InputField
                                                label="NÚMERO"
                                                value={number}
                                                onChangeText={setNumber}
                                                keyboardType="numeric"
                                                half
                                            />
                                            <Spacer />
                                            <InputField
                                                label="COMPLEMENTO"
                                                value={complement}
                                                onChangeText={setComplement}
                                                half
                                            />
                                        </Row>

                                        <InputField
                                            label="BAIRRO"
                                            value={neighborhood}
                                            onChangeText={setNeighborhood}
                                        />

                                        <Row>
                                            <InputField
                                                label="CIDADE"
                                                value={city}
                                                onChangeText={setCity}
                                                half
                                            />
                                            <Spacer />
                                            <InputField
                                                label="UF"
                                                value={state}
                                                onChangeText={setState}
                                                maxLength={2}
                                                autoCapitalize="characters"
                                                half
                                            />
                                        </Row>

                                        <ActionButton
                                            title="SALVAR ENDEREÇO"
                                            onPress={saveAddress}
                                            loading={savingAddress}
                                        />

                                        <ActionButton
                                            title="VOLTAR"
                                            variant="outline"
                                            onPress={() => openModal("addresses")}
                                        />
                                    </>
                                )}

                                {/* PAGAMENTOS */}

                                {activeModal === "payments" && (
                                    <EmptyMessage
                                        icon="card-outline"
                                        message="A gestão de pagamentos será disponibilizada quando o fluxo de pagamento da HC Store for integrado. Nenhum cartão é armazenado nesta etapa."
                                    />
                                )}

                                {/* CUPONS */}

                                {activeModal === "coupons" &&
                                    (coupons.length === 0 ? (
                                        <EmptyMessage
                                            icon="pricetag-outline"
                                            message="Nenhum cupom disponível no momento."
                                        />
                                    ) : null)}

                            </ScrollView>
                        </Sheet>
                    </KeyboardAvoidingView>
                </Overlay>
            </Modal>
        </Container>
    )
}

export default Profile

/* ================================================================== */
/*  ESTILOS                                                            */
/* ================================================================== */

const Container = styled.View`
    flex: 1;
    background-color: ${BG};
`

const HeaderWrapper = styled.View`
    padding-top: ${TOP_SPACE}px;
    background-color: ${BG};
`

const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { paddingTop: 16, paddingHorizontal: 24, paddingBottom: 120 }
})`
    flex: 1;
`

const EyebrowRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 14px;
`

const EyebrowDash = styled.View`
    width: 24px;
    height: 2px;
    background-color: ${ACCENT};
    margin-right: 10px;
`

const Eyebrow = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2.5px;
`

const ProfileCard = styled.View`
    background-color: ${SURFACE};
    border-radius: 20px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 20px;
    margin-bottom: 28px;
`

const ProfileTop = styled.View`
    flex-direction: row;
    align-items: center;
`

const Avatar = styled.View`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: rgba(0, 230, 64, 0.1);
    border-width: 1.5px;
    border-color: rgba(0, 230, 64, 0.35);
    align-items: center;
    justify-content: center;
`

const AvatarText = styled.Text`
    color: ${ACCENT};
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.5px;
`

const ProfileInfo = styled.View`
    flex: 1;
    margin-left: 16px;
`

const NameRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const Name = styled.Text`
    color: ${TEXT};
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.5px;
    flex-shrink: 1;
`

const Email = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 2px;
`

const MemberPill = styled.View`
    align-self: flex-start;
    background-color: rgba(0, 230, 64, 0.08);
    border-radius: 999px;
    padding: 3px 8px;
    margin-top: 8px;
`

const MemberText = styled.Text`
    color: ${ACCENT};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.2px;
`

const LevelArea = styled.View`
    margin-top: 20px;
    padding-top: 16px;
    border-top-width: 1px;
    border-top-color: ${BORDER};
`

const LevelTop = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`

const LevelRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const LevelText = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.5px;
    margin-left: 5px;
`

const Points = styled.Text`
    color: ${TEXT};
    font-size: 11px;
    font-weight: 800;
`

const ProgressBackground = styled.View`
    height: 6px;
    background-color: ${BORDER};
    border-radius: 3px;
    overflow: hidden;
`

const ProgressBar = styled.View`
    height: 100%;
    background-color: ${ACCENT};
    border-radius: 3px;
`

const LevelDescription = styled.Text`
    color: ${MUTED};
    font-size: 11px;
    margin-top: 8px;
`

const SectionHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`

const SectionTitle = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2px;
`

const SectionAction = styled.TouchableOpacity`
    padding: 4px 0;
`

const SectionActionText = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
`

const OrderCard = styled.View`
    background-color: ${SURFACE};
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 18px;
    margin-bottom: 28px;
`

const OrderTop = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 14px;
`

const OrderIcon = styled.View`
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
`

const OrderInfo = styled.View`
    flex: 1;
    margin-left: 12px;
    margin-right: 12px;
`

const OrderName = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 800;
`

const OrderDetails = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 2px;
`

const OrderPrice = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
`

const StatusPill = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: rgba(0, 230, 64, 0.08);
    align-self: flex-start;
    padding: 5px 10px;
    border-radius: 999px;
    margin-bottom: 16px;
`

const StatusDot = styled.View`
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: ${ACCENT};
    margin-right: 6px;
`

const StatusText = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1px;
`

const Grid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 28px;
`

const GridCard = styled.TouchableOpacity`
    width: 48%;
    background-color: ${SURFACE};
    border-radius: 16px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 16px;
    margin-bottom: 14px;
`

const GridTop = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`

const GridIcon = styled.View`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
`

const GridBadge = styled.View`
    background-color: ${SURFACE_2};
    border-radius: 999px;
    padding: 3px 8px;
`

const GridBadgeText = styled.Text`
    color: ${MUTED};
    font-size: 9px;
    font-weight: 800;
`

const GridTitle = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 900;
`

const GridDescription = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 2px;
`

const MenuContainer = styled.View`
    background-color: ${SURFACE};
    border-radius: 18px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 0 16px;
    margin-bottom: 28px;
`

const MenuRow = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 16px 0;
    border-bottom-width: ${(p) => (p.$last ? 0 : 1)}px;
    border-bottom-color: ${BORDER};
`

const MenuIcon = styled.View`
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`

const MenuContent = styled.View`
    flex: 1;
    margin-right: 10px;
`

const MenuTitle = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 800;
`

const MenuDescription = styled.Text`
    color: ${MUTED};
    font-size: 11px;
    margin-top: 2px;
`

const LogoutButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 52px;
    background-color: rgba(255, 90, 95, 0.08);
    border-radius: 14px;
    border-width: 1px;
    border-color: rgba(255, 90, 95, 0.2);
    margin-bottom: 16px;
`

const LogoutText = styled.Text`
    color: ${DANGER};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1.5px;
    margin-left: 8px;
`

const VersionText = styled.Text`
    color: ${FAINT};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 20px;
`

const EmptyBox = styled.View`
    align-items: center;
    justify-content: center;
    padding: 24px 12px;
`

const EmptyText = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    text-align: center;
    margin-top: 8px;
    line-height: 18px;
`

const Overlay = styled.View`
    flex: 1;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.8);
`

const OverlayDismiss = styled.TouchableOpacity`
    flex: 1;
`

const Sheet = styled.View`
    background-color: ${BG};
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 12px 24px 24px 24px;
    max-height: 80%;
`

const SheetHandle = styled.View`
    width: 36px;
    height: 4px;
    background-color: ${BORDER};
    border-radius: 2px;
    align-self: center;
    margin-bottom: 16px;
`

const SheetHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`

const SheetTitle = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 900;
    letter-spacing: 2px;
`

const CloseBtn = styled.TouchableOpacity`
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    align-items: center;
    justify-content: center;
`

const ItemCard = styled.View`
    background-color: ${SURFACE};
    border-radius: 16px;
    border-width: 1px;
    border-color: ${(p) => (p.$highlight ? ACCENT : BORDER)};
    padding: 16px;
    margin-bottom: 12px;
`

const ItemRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
`

const ItemTitle = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 800;
`

const ItemPrice = styled.Text`
    color: ${ACCENT};
    font-size: 14px;
    font-weight: 900;
`

const ItemSub = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 2px;
`

const ItemActions = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    padding-top: 12px;
    border-top-width: 1px;
    border-top-color: ${BORDER};
`

const PrimaryTag = styled.View`
    background-color: rgba(0, 230, 64, 0.1);
    border-radius: 999px;
    padding: 3px 8px;
`

const PrimaryTagText = styled.Text`
    color: ${ACCENT};
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1px;
`

const LinkBtn = styled.TouchableOpacity`
    padding: 4px 0;
`

const LinkText = styled.Text`
    color: ${(p) => (p.$danger ? DANGER : ACCENT)};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.2px;
`

const ActionBtn = styled.TouchableOpacity`
    height: 52px;
    border-radius: 14px;
    background-color: ${(p) => (p.$variant === "primary" ? ACCENT : SURFACE)};
    border-width: ${(p) => (p.$variant === "primary" ? 0 : 1.5)}px;
    border-color: ${(p) => (p.$variant === "primary" ? "transparent" : ACCENT)};
    align-items: center;
    justify-content: center;
    margin-top: 12px;
`

const ActionBtnText = styled.Text`
    color: ${(p) => (p.$variant === "primary" ? "#000" : ACCENT)};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1.8px;
`

const FieldWrapper = styled.View`
    flex: ${(p) => (p.$half ? 1 : "none")};
    margin-bottom: 14px;
`

const FieldLabel = styled.Text`
    color: ${(p) => (p.$focused ? ACCENT : MUTED)};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    margin-bottom: 6px;
`

const FieldInput = styled.TextInput.attrs({
    placeholderTextColor: FAINT,
    selectionColor: ACCENT
})`
    height: 50px;
    background-color: ${SURFACE};
    border-radius: 14px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$focused ? ACCENT : BORDER)};
    padding: 0 16px;
    color: ${TEXT};
    font-size: 14px;
`

const Row = styled.View`
    flex-direction: row;
    align-items: center;
`

const Spacer = styled.View`
    width: 12px;
`

const CepRow = styled.View`
    flex-direction: row;
    align-items: flex-end;
`

const CepBtn = styled.TouchableOpacity`
    height: 50px;
    padding: 0 18px;
    background-color: ${ACCENT};
    border-radius: 14px;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    margin-left: 10px;
`

const CepBtnText = styled.Text`
    color: #000;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.5px;
`