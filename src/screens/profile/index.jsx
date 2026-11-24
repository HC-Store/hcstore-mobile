import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Switch
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
            <Header />

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
                                    ) : (
                                        coupons.map((coupon) => (
                                            <ItemCard key={coupon.id} $highlight>
                                                <ItemTitle style={{ color: ACCENT }}>
                                                    {coupon.code}
                                                </ItemTitle>
                                            </ItemCard>
                                        ))
                                    ))}

                                {/* TAMANHOS */}

                                {activeModal === "sizes" && (
                                    <>
                                        <GroupLabel>TAMANHO DE ROUPAS</GroupLabel>

                                        <OptionsWrap>
                                            {["PP", "P", "M", "G", "GG", "XG"].map((size) => (
                                                <Option
                                                    key={size}
                                                    title={size}
                                                    selected={clothingSize === size}
                                                    onPress={() => setClothingSize(size)}
                                                />
                                            ))}
                                        </OptionsWrap>

                                        <GroupLabel>NUMERAÇÃO DE CALÇADOS</GroupLabel>

                                        <OptionsWrap>
                                            {Array.from({ length: 12 }, (_, i) => String(i + 35)).map(
                                                (size) => (
                                                    <Option
                                                        key={size}
                                                        title={size}
                                                        selected={shoeSize === size}
                                                        onPress={() => setShoeSize(size)}
                                                    />
                                                )
                                            )}
                                        </OptionsWrap>

                                        <ActionButton title="CONFIRMAR" onPress={closeModal} />
                                    </>
                                )}

                                {/* FAQ */}

                                {activeModal === "faq" && (
                                    <EmptyMessage
                                        icon="help-circle-outline"
                                        message="As perguntas frequentes, políticas de troca e devolução e canais de suporte serão disponibilizados aqui."
                                    />
                                )}

                                {/* PRIVACIDADE */}

                                {activeModal === "privacy" && (
                                    <EmptyMessage
                                        icon="shield-checkmark-outline"
                                        message="Os documentos oficiais de privacidade e termos da HC Store serão vinculados nesta área."
                                    />
                                )}

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

const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { paddingTop: 16, paddingHorizontal: 24, paddingBottom: 120 }
})`
    flex: 1;
`

const EyebrowRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
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

/* Perfil */

const ProfileCard = styled.View`
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    border-radius: 22px;
    padding: 20px;
`

const ProfileTop = styled.View`
    flex-direction: row;
    align-items: center;
`

const Avatar = styled.View`
    width: 68px;
    height: 68px;
    border-radius: 34px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
    margin-right: 16px;
`

const AvatarText = styled.Text`
    color: #000000;
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -1px;
`

const ProfileInfo = styled.View`
    flex: 1;
`

const NameRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const Name = styled.Text`
    color: ${TEXT};
    font-size: 20px;
    font-weight: 900;
    flex-shrink: 1;
`

const Email = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 3px;
`

const MemberPill = styled.View`
    align-self: flex-start;
    margin-top: 10px;
    border-radius: 999px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 4px 10px;
`

const MemberText = styled.Text`
    color: ${MUTED};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.5px;
`

const LevelArea = styled.View`
    margin-top: 20px;
    padding-top: 18px;
    border-top-width: 1px;
    border-top-color: ${BORDER};
`

const LevelTop = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const LevelRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const LevelText = styled.Text`
    color: ${TEXT};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
    margin-left: 6px;
`

const Points = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

const ProgressBackground = styled.View`
    height: 6px;
    border-radius: 3px;
    background-color: ${SURFACE_2};
    margin-top: 12px;
    overflow: hidden;
`

const ProgressBar = styled.View`
    height: 100%;
    border-radius: 3px;
    background-color: ${ACCENT};
`

const LevelDescription = styled.Text`
    color: ${FAINT};
    font-size: 12px;
    line-height: 18px;
    margin-top: 10px;
`

/* Seções */

const SectionHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
    margin-bottom: 14px;
`

const SectionTitle = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2.5px;
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

/* Último pedido */

const OrderCard = styled.View`
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    border-radius: 20px;
    padding: 18px;
`

const OrderTop = styled.View`
    flex-direction: row;
    align-items: center;
`

const OrderIcon = styled.View`
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
    margin-right: 14px;
`

const OrderInfo = styled.View`
    flex: 1;
`

const OrderName = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 700;
`

const OrderDetails = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 3px;
`

const OrderPrice = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
    margin-left: 10px;
`

const StatusPill = styled.View`
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    margin-top: 16px;
    margin-bottom: 4px;
    padding: 6px 12px;
    border-radius: 999px;
    background-color: rgba(0, 230, 64, 0.1);
`

const StatusDot = styled.View`
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: ${ACCENT};
    margin-right: 8px;
`

const StatusText = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

/* Grid */

const Grid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`

const GridCard = styled.TouchableOpacity`
    width: 48.5%;
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    border-radius: 18px;
    padding: 16px;
    margin-bottom: 12px;
`

const GridTop = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
`

const GridIcon = styled.View`
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
`

const GridBadge = styled.View`
    border-radius: 999px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 3px 8px;
`

const GridBadgeText = styled.Text`
    color: ${MUTED};
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 1px;
`

const GridTitle = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 800;
`

const GridDescription = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 3px;
`

/* Menu */

const MenuContainer = styled.View`
    background-color: ${SURFACE};
    border-width: 1px;
    border-color: ${BORDER};
    border-radius: 20px;
    padding: 0 16px;
`

const MenuRow = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 16px 0;
    border-bottom-width: ${(p) => (p.$last ? 0 : 1)}px;
    border-bottom-color: ${BORDER};
`

const MenuIcon = styled.View`
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
    margin-right: 14px;
`

const MenuContent = styled.View`
    flex: 1;
    margin-right: 10px;
`

const MenuTitle = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 700;
`

const MenuDescription = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 3px;
`

/* Sair */

const LogoutButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 56px;
    margin-top: 28px;
    border-radius: 16px;
    border-width: 1.5px;
    border-color: rgba(255, 90, 95, 0.4);
    background-color: rgba(255, 90, 95, 0.06);
`

const LogoutText = styled.Text`
    color: ${DANGER};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
    margin-left: 8px;
`

const VersionText = styled.Text`
    color: #3a3a3a;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
    margin-top: 22px;
`

/* Botões e campos */

const ActionBtn = styled.TouchableOpacity`
    height: 54px;
    margin-top: 14px;
    border-radius: 14px;
    align-items: center;
    justify-content: center;
    border-width: 1.5px;
    border-color: ${(p) => (p.$variant === "outline" ? "#2E2E2E" : ACCENT)};
    background-color: ${(p) => (p.$variant === "outline" ? "transparent" : ACCENT)};
`

const ActionBtnText = styled.Text`
    color: ${(p) => (p.$variant === "outline" ? TEXT : "#000000")};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
`

const FieldWrapper = styled.View`
    margin-top: 14px;
    ${(p) => (p.$half ? "flex: 1;" : "")}
`

const FieldLabel = styled.Text`
    color: ${(p) => (p.$focused ? ACCENT : MUTED)};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
`

const FieldInput = styled.TextInput.attrs({
    placeholderTextColor: FAINT,
    selectionColor: ACCENT
})`
    height: 50px;
    padding: 0 14px;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$focused ? ACCENT : BORDER)};
    background-color: ${SURFACE_2};
    color: ${TEXT};
    font-size: 15px;
`

const Row = styled.View`
    flex-direction: row;
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
    margin-left: 12px;
    padding: 0 20px;
    border-radius: 12px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
`

const CepBtnText = styled.Text`
    color: #000000;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

const EmptyBox = styled.View`
    align-items: center;
    padding: 20px 10px;
`

const EmptyText = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    margin-top: 10px;
`

const OptionBtn = styled.TouchableOpacity`
    min-width: 54px;
    height: 46px;
    padding: 0 14px;
    margin: 0 8px 8px 0;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$selected ? ACCENT : BORDER)};
    background-color: ${(p) => (p.$selected ? ACCENT : SURFACE_2)};
    align-items: center;
    justify-content: center;
`

const OptionText = styled.Text`
    color: ${(p) => (p.$selected ? "#000000" : TEXT)};
    font-size: 14px;
    font-weight: 800;
`

const OptionsWrap = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`

const GroupLabel = styled.Text`
    color: ${MUTED};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    margin-top: 10px;
    margin-bottom: 12px;
`

/* Modal */

const Overlay = styled.View`
    flex: 1;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.75);
`

const OverlayDismiss = styled.TouchableOpacity`
    flex: 1;
`

const Sheet = styled.View`
    max-height: 640px;
    min-height: 320px;
    background-color: #0d0d0d;
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    border-width: 1px;
    border-color: ${BORDER};
    padding: 10px 24px 0 24px;
`

const SheetHandle = styled.View`
    align-self: center;
    width: 42px;
    height: 4px;
    border-radius: 2px;
    background-color: #333333;
    margin-bottom: 16px;
`

const SheetHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`

const SheetTitle = styled.Text`
    color: ${TEXT};
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 1px;
`

const CloseBtn = styled.TouchableOpacity`
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: ${SURFACE_2};
    align-items: center;
    justify-content: center;
`

const ItemCard = styled.View`
    margin-top: 12px;
    padding: 16px;
    border-radius: 16px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$highlight ? "rgba(0, 230, 64, 0.4)" : BORDER)};
    background-color: ${SURFACE};
`

const ItemRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const ItemTitle = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 800;
`

const ItemPrice = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
`

const ItemSub = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 5px;
`

const ItemActions = styled.View`
    flex-direction: row;
    margin-top: 14px;
    padding-top: 12px;
    border-top-width: 1px;
    border-top-color: ${BORDER};
`

const LinkBtn = styled.TouchableOpacity`
    margin-right: 20px;
    padding: 2px 0;
`

const LinkText = styled.Text`
    color: ${(p) => (p.$danger ? DANGER : ACCENT)};
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.2px;
`

const PrimaryTag = styled.View`
    margin-left: 10px;
    padding: 3px 8px;
    border-radius: 999px;
    background-color: ${ACCENT};
`

const PrimaryTagText = styled.Text`
    color: #000000;
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 1px;
`