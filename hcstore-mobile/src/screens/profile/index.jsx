
import React, { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Switch as NativeSwitch,
    Alert,
    Linking
} from "react-native"

import { useNavigation } from "@react-navigation/native"

import Header from "../../components/header"
import BottomMenu from "../../components/bottom-menu"

import {
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
    OnlineText,
    LogoutButton,
    LogoutText,
    VersionText
} from "./style"

const GREEN = "#00FF63"

// Dados reais serão carregados da API futuramente.
const initialUser = {
    name: "",
    email: "",
    memberSince: "",
    points: null,
    level: ""
}

const Profile = () => {

    const navigation = useNavigation()

    const [user] = useState(initialUser)
    const [orders] = useState([])
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

    const [clothingSize, setClothingSize] = useState("M")
    const [shoeSize, setShoeSize] = useState("41")
    const [dropAlerts, setDropAlerts] = useState(false)

    const openModal = (name) => setActiveModal(name)
    const closeModal = () => setActiveModal(null)

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

    const searchCep = async () => {

        const cleanCep = cep.replace(/\D/g, "")

        if (cleanCep.length !== 8) {
            Alert.alert("CEP inválido", "Informe 8 números.")
            return
        }

        try {
            setLoadingCep(true)

            const response = await fetch(
                `https://viacep.com.br/ws/${cleanCep}/json/`
            )

            if (!response.ok) {
                throw new Error("Falha na consulta")
            }

            const data = await response.json()

            if (data.erro) {
                Alert.alert("Atenção", "CEP não encontrado.")
                return
            }

            setStreet(data.logradouro || "")
            setNeighborhood(data.bairro || "")
            setCity(data.localidade || "")
            setState(data.uf || "")

        } catch (error) {
            Alert.alert(
                "Erro",
                "Não foi possível consultar o CEP."
            )
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

    const saveAddress = () => {

        if (
            cep.replace(/\D/g, "").length !== 8 ||
            !street.trim() ||
            !number.trim() ||
            !neighborhood.trim() ||
            !city.trim() ||
            !state.trim()
        ) {
            Alert.alert(
                "Atenção",
                "Preencha todos os campos obrigatórios."
            )
            return
        }

        const newAddress = {
            id: Date.now().toString(),
            cep,
            street: street.trim(),
            number: number.trim(),
            neighborhood: neighborhood.trim(),
            city: city.trim(),
            state: state.trim(),
            complement: complement.trim(),
            primary: addresses.length === 0
        }

        setAddresses((current) => [
            ...current,
            newAddress
        ])

        clearAddressForm()
        openModal("addresses")
    }

    const setPrimaryAddress = (id) => {
        setAddresses((current) =>
            current.map((address) => ({
                ...address,
                primary: address.id === id
            }))
        )
    }

    const deleteAddress = (id) => {

        Alert.alert(
            "Excluir endereço",
            "Deseja realmente excluir este endereço?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        setAddresses((current) => {
                            const remaining = current.filter(
                                (address) => address.id !== id
                            )

                            if (
                                remaining.length > 0 &&
                                !remaining.some((address) => address.primary)
                            ) {
                                remaining[0] = {
                                    ...remaining[0],
                                    primary: true
                                }
                            }

                            return remaining
                        })
                    }
                }
            ]
        )
    }

    const openWhatsApp = async () => {
        Alert.alert(
            "Atendimento HC Store",
            "O número oficial do WhatsApp ainda precisa ser configurado."
        )
    }

    const handleLogout = () => {

        Alert.alert(
            "Encerrar sessão",
            "Deseja sair da sua conta?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    onPress: () => {
                        // Temporário: a autenticação real ainda
                        // precisa invalidar a sessão/token.
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "Login" }]
                        })
                    }
                }
            ]
        )
    }

    const ActionButton = ({ title, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: GREEN,
                padding: 13,
                alignItems: "center",
                marginTop: 15
            }}
        >
            <Text style={{
                color: "#000",
                fontSize: 11,
                fontWeight: "bold"
            }}>
                {title}
            </Text>
        </TouchableOpacity>
    )

    const InputField = ({
        label,
        value,
        onChangeText,
        keyboardType = "default",
        maxLength
    }) => (
        <View style={{ marginTop: 12 }}>
            <Text style={{
                color: "#AAA",
                fontSize: 11,
                marginBottom: 6
            }}>
                {label}
            </Text>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                maxLength={maxLength}
                placeholderTextColor="#777"
                style={{
                    backgroundColor: "#222",
                    color: "#FFF",
                    paddingHorizontal: 12,
                    height: 42,
                    fontSize: 12
                }}
            />
        </View>
    )

    const EmptyMessage = ({ message }) => (
        <Text style={{
            color: "#AAA",
            fontSize: 12,
            lineHeight: 20,
            marginTop: 10
        }}>
            {message}
        </Text>
    )

    const Option = ({ title, selected, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: selected ? GREEN : "#222",
                paddingVertical: 11,
                paddingHorizontal: 15,
                marginRight: 8,
                marginBottom: 8
            }}
        >
            <Text style={{
                color: selected ? "#000" : "#FFF",
                fontWeight: "bold",
                fontSize: 12
            }}>
                {title}
            </Text>
        </TouchableOpacity>
    )

    return (
        <Container>

            <Header />

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 35
                }}
            >

                {/* PERFIL */}

                <ProfileCard>
                    <ProfileTop>

                        <Avatar>HC</Avatar>

                        <ProfileInfo>
                            <NameRow>
                                <Name>
                                    {user.name || "Minha conta"}
                                </Name>
                                {!!user.name && (
                                    <Verified>●</Verified>
                                )}
                            </NameRow>

                            <Email>
                                {user.email || "Dados da conta pendentes"}
                            </Email>

                            <MemberSince>
                                {user.memberSince
                                    ? `MEMBRO DESDE ${user.memberSince}`
                                    : "HC STORE"}
                            </MemberSince>
                        </ProfileInfo>

                    </ProfileTop>

                    <LevelArea>
                        <LevelTop>
                            <LevelText>
                                ★ HC CLUB
                            </LevelText>
                            <Points>
                                {user.points === null
                                    ? "Em breve"
                                    : `${user.points} PTS`}
                            </Points>
                        </LevelTop>

                        <ProgressBackground>
                            <ProgressBar style={{
                                width: user.points === null
                                    ? "0%"
                                    : `${Math.min(
                                        100,
                                        Math.max(0, user.points / 600 * 100)
                                    )}%`
                            }} />
                        </ProgressBackground>

                        <LevelDescription>
                            Benefícios e pontuação serão
                            disponibilizados futuramente.
                        </LevelDescription>
                    </LevelArea>
                </ProfileCard>

                {/* PEDIDOS */}

                <SectionHeader>
                    <SectionTitle>
                        ÚLTIMO PEDIDO
                    </SectionTitle>

                    <TouchableOpacity
                        onPress={() => openModal("orders")}
                    >
                        <SectionAction>
                            VER TODOS
                        </SectionAction>
                    </TouchableOpacity>
                </SectionHeader>

                <OrderCard>
                    {orders.length === 0 ? (
                        <EmptyMessage
                            message="Nenhum pedido disponível. Seu histórico aparecerá aqui após a integração com sua conta."
                        />
                    ) : (
                        <>
                            <OrderTop>
                                <ProductImage />

                                <OrderInfo>
                                    <ProductName>
                                        {orders[0].productName}
                                    </ProductName>

                                    <ProductDetails>
                                        Pedido #{orders[0].id}
                                    </ProductDetails>
                                </OrderInfo>

                                <OrderPrice>
                                    {formatPrice(orders[0].total)}
                                </OrderPrice>
                            </OrderTop>

                            <DeliveryRow>
                                <DeliveryStatus>
                                    {orders[0].status}
                                </DeliveryStatus>
                            </DeliveryRow>

                            <TrackButton
                                onPress={() => openModal("orders")}
                            >
                                <TrackButtonText>
                                    VER DETALHES
                                </TrackButtonText>
                            </TrackButton>
                        </>
                    )}
                </OrderCard>

                {/* GESTÃO DA CONTA */}

                <SectionTitle style={{
                    marginTop: 18,
                    marginBottom: 8
                }}>
                    GESTÃO DA CONTA
                </SectionTitle>

                <Grid>

                    <GridCard
                        onPress={() => openModal("orders")}
                    >
                        <GridTop>
                            <GridIcon>▣</GridIcon>
                            <GridBadge>
                                {orders.length} TOTAL
                            </GridBadge>
                        </GridTop>

                        <GridTitle>Meus Pedidos</GridTitle>
                        <GridDescription>
                            Histórico completo
                        </GridDescription>
                    </GridCard>

                    <GridCard
                        onPress={() => openModal("addresses")}
                    >
                        <GridTop>
                            <GridIcon>◇</GridIcon>
                            <GridBadge>
                                {addresses.length} SALVOS
                            </GridBadge>
                        </GridTop>

                        <GridTitle>Endereços</GridTitle>
                        <GridDescription>
                            Entrega e cobrança
                        </GridDescription>
                    </GridCard>

                    <GridCard
                        onPress={() => openModal("payments")}
                    >
                        <GridTop>
                            <GridIcon>▰</GridIcon>
                            <GridBadge>EM BREVE</GridBadge>
                        </GridTop>

                        <GridTitle>Pagamentos</GridTitle>
                        <GridDescription>
                            Formas de pagamento
                        </GridDescription>
                    </GridCard>

                    <GridCard
                        onPress={() => openModal("coupons")}
                    >
                        <GridTop>
                            <GridIcon>⌘</GridIcon>
                            <GridBadge>
                                {coupons.length} ATIVOS
                            </GridBadge>
                        </GridTop>

                        <GridTitle>Cupons</GridTitle>
                        <GridDescription>
                            Minhas ofertas
                        </GridDescription>
                    </GridCard>

                </Grid>

                {/* PREFERÊNCIAS */}

                <SectionTitle style={{
                    marginTop: 18,
                    marginBottom: 8
                }}>
                    PREFERÊNCIAS & SUPORTE
                </SectionTitle>

                <PreferencesContainer>

                    <PreferenceItem
                        onPress={() => openModal("sizes")}
                    >
                        <PreferenceLeft>
                            <PreferenceIcon>▱</PreferenceIcon>
                            <PreferenceContent>
                                <PreferenceTitle>
                                    Preferências de Tamanho
                                </PreferenceTitle>
                                <PreferenceDescription>
                                    Calçados: {shoeSize} • Roupas: {clothingSize}
                                </PreferenceDescription>
                            </PreferenceContent>
                        </PreferenceLeft>
                        <Arrow>›</Arrow>
                    </PreferenceItem>

                    <PreferenceItem
                        onPress={() => setDropAlerts(!dropAlerts)}
                    >
                        <PreferenceLeft>
                            <PreferenceIcon>♧</PreferenceIcon>
                            <PreferenceContent>
                                <PreferenceTitle>
                                    Alertas de Drops & Restocks
                                </PreferenceTitle>
                                <PreferenceDescription>
                                    Preferência de notificações
                                </PreferenceDescription>
                            </PreferenceContent>
                        </PreferenceLeft>

                        <NativeSwitch
                            value={dropAlerts}
                            onValueChange={setDropAlerts}
                            trackColor={{
                                false: "#555",
                                true: "#00E85A"
                            }}
                            thumbColor="#FFF"
                        />
                    </PreferenceItem>

                    <PreferenceItem
                        onPress={() => openModal("faq")}
                    >
                        <PreferenceLeft>
                            <PreferenceIcon>▣</PreferenceIcon>
                            <PreferenceContent>
                                <PreferenceTitle>
                                    Central de Ajuda & FAQ
                                </PreferenceTitle>
                                <PreferenceDescription>
                                    Dúvidas e devoluções
                                </PreferenceDescription>
                            </PreferenceContent>
                        </PreferenceLeft>
                        <Arrow>›</Arrow>
                    </PreferenceItem>

                    <PreferenceItem onPress={openWhatsApp}>
                        <PreferenceLeft>
                            <PreferenceIcon>☑</PreferenceIcon>
                            <PreferenceContent>
                                <PreferenceTitle>
                                    Atendimento via WhatsApp
                                </PreferenceTitle>
                                <PreferenceDescription>
                                    Fale com nossa equipe
                                </PreferenceDescription>
                            </PreferenceContent>
                        </PreferenceLeft>
                        <Arrow>›</Arrow>
                    </PreferenceItem>

                    <PreferenceItem
                        onPress={() => openModal("privacy")}
                    >
                        <PreferenceLeft>
                            <PreferenceIcon>◇</PreferenceIcon>
                            <PreferenceContent>
                                <PreferenceTitle>
                                    Política de Privacidade & Termos
                                </PreferenceTitle>
                                <PreferenceDescription>
                                    Privacidade e proteção de dados
                                </PreferenceDescription>
                            </PreferenceContent>
                        </PreferenceLeft>
                        <Arrow>›</Arrow>
                    </PreferenceItem>

                </PreferencesContainer>

                {/* LOGOUT */}

                <LogoutButton onPress={handleLogout}>
                    <LogoutText>
                        ⎋ ENCERRAR SESSÃO
                    </LogoutText>
                </LogoutButton>

                <VersionText>
                    HC Store • Versão em desenvolvimento
                </VersionText>

            </Content>

            <BottomMenu active="Profile" />

            {/* MODAIS */}

            <Modal
                visible={activeModal !== null}
                transparent
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.75)",
                    justifyContent: "flex-end"
                }}>

                    <View style={{
                        backgroundColor: "#111",
                        height: "78%",
                        padding: 20
                    }}>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={{
                                alignSelf: "flex-end",
                                padding: 8
                            }}
                        >
                            <Text style={{
                                color: "#FFF",
                                fontSize: 20
                            }}>
                                ✕
                            </Text>
                        </TouchableOpacity>

                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >

                            {/* MEUS PEDIDOS */}

                            {activeModal === "orders" && (
                                <>
                                    <ModalTitle title="MEUS PEDIDOS" />

                                    {orders.length === 0 ? (
                                        <EmptyMessage
                                            message="Você ainda não possui pedidos disponíveis. O histórico real será carregado da API da HC Store."
                                        />
                                    ) : (
                                        orders.map((order) => (
                                            <View
                                                key={order.id}
                                                style={{
                                                    padding: 14,
                                                    backgroundColor: "#222",
                                                    marginTop: 10
                                                }}
                                            >
                                                <Text style={{ color: "#FFF" }}>
                                                    Pedido #{order.id}
                                                </Text>
                                                <Text style={{ color: GREEN }}>
                                                    {order.status}
                                                </Text>
                                                <Text style={{ color: "#FFF" }}>
                                                    {formatPrice(order.total)}
                                                </Text>
                                            </View>
                                        ))
                                    )}
                                </>
                            )}

                            {/* ENDEREÇOS */}

                            {activeModal === "addresses" && (
                                <>
                                    <ModalTitle title="MEUS ENDEREÇOS" />

                                    {addresses.length === 0 && (
                                        <EmptyMessage
                                            message="Nenhum endereço cadastrado neste dispositivo."
                                        />
                                    )}

                                    {addresses.map((address) => (
                                        <View
                                            key={address.id}
                                            style={{
                                                backgroundColor: "#222",
                                                padding: 14,
                                                marginTop: 12
                                            }}
                                        >
                                            <Text style={{
                                                color: "#FFF",
                                                fontWeight: "bold"
                                            }}>
                                                {address.street}, {address.number}
                                            </Text>

                                            <Text style={{
                                                color: "#AAA",
                                                marginTop: 6
                                            }}>
                                                {address.neighborhood} - {address.city}/{address.state}
                                            </Text>

                                            <Text style={{
                                                color: "#AAA",
                                                marginTop: 4
                                            }}>
                                                CEP: {address.cep}
                                            </Text>

                                            {address.primary && (
                                                <Text style={{
                                                    color: GREEN,
                                                    marginTop: 8
                                                }}>
                                                    ENDEREÇO PRINCIPAL
                                                </Text>
                                            )}

                                            {!address.primary && (
                                                <ActionButton
                                                    title="DEFINIR COMO PRINCIPAL"
                                                    onPress={() =>
                                                        setPrimaryAddress(address.id)
                                                    }
                                                />
                                            )}

                                            <TouchableOpacity
                                                onPress={() =>
                                                    deleteAddress(address.id)
                                                }
                                                style={{ marginTop: 15 }}
                                            >
                                                <Text style={{ color: "#FF7777" }}>
                                                    Excluir endereço
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
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
                                    <ModalTitle title="NOVO ENDEREÇO" />

                                    <InputField
                                        label="CEP"
                                        value={cep}
                                        onChangeText={setCep}
                                        keyboardType="numeric"
                                        maxLength={9}
                                    />

                                    <ActionButton
                                        title={
                                            loadingCep
                                                ? "CONSULTANDO..."
                                                : "BUSCAR CEP"
                                        }
                                        onPress={searchCep}
                                    />

                                    <InputField
                                        label="Rua"
                                        value={street}
                                        onChangeText={setStreet}
                                    />

                                    <InputField
                                        label="Número"
                                        value={number}
                                        onChangeText={setNumber}
                                    />

                                    <InputField
                                        label="Complemento"
                                        value={complement}
                                        onChangeText={setComplement}
                                    />

                                    <InputField
                                        label="Bairro"
                                        value={neighborhood}
                                        onChangeText={setNeighborhood}
                                    />

                                    <InputField
                                        label="Cidade"
                                        value={city}
                                        onChangeText={setCity}
                                    />

                                    <InputField
                                        label="Estado (UF)"
                                        value={state}
                                        onChangeText={setState}
                                        maxLength={2}
                                    />

                                    <ActionButton
                                        title="SALVAR ENDEREÇO"
                                        onPress={saveAddress}
                                    />

                                    <ActionButton
                                        title="VOLTAR"
                                        onPress={() =>
                                            openModal("addresses")
                                        }
                                    />
                                </>
                            )}

                            {/* PAGAMENTOS */}

                            {activeModal === "payments" && (
                                <>
                                    <ModalTitle title="PAGAMENTOS" />

                                    <EmptyMessage
                                        message="A gestão de pagamentos será disponibilizada quando integrarmos o fluxo de pagamento da HC Store. Nenhum cartão será armazenado nesta etapa."
                                    />
                                </>
                            )}

                            {/* CUPONS */}

                            {activeModal === "coupons" && (
                                <>
                                    <ModalTitle title="MEUS CUPONS" />

                                    {coupons.length === 0 ? (
                                        <EmptyMessage
                                            message="Nenhum cupom disponível no momento."
                                        />
                                    ) : (
                                        coupons.map((coupon) => (
                                            <Text
                                                key={coupon.id}
                                                style={{
                                                    color: GREEN,
                                                    marginTop: 12
                                                }}
                                            >
                                                {coupon.code}
                                            </Text>
                                        ))
                                    )}
                                </>
                            )}

                            {/* TAMANHOS */}

                            {activeModal === "sizes" && (
                                <>
                                    <ModalTitle title="MEUS TAMANHOS" />

                                    <Text style={{
                                        color: "#FFF",
                                        marginTop: 15,
                                        marginBottom: 12
                                    }}>
                                        Tamanho de roupas
                                    </Text>

                                    <View style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap"
                                    }}>
                                        {["PP", "P", "M", "G", "GG", "XG"].map(
                                            (size) => (
                                                <Option
                                                    key={size}
                                                    title={size}
                                                    selected={clothingSize === size}
                                                    onPress={() =>
                                                        setClothingSize(size)
                                                    }
                                                />
                                            )
                                        )}
                                    </View>

                                    <Text style={{
                                        color: "#FFF",
                                        marginTop: 20,
                                        marginBottom: 12
                                    }}>
                                        Numeração de calçados
                                    </Text>

                                    <View style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap"
                                    }}>
                                        {Array.from(
                                            { length: 12 },
                                            (_, index) => String(index + 35)
                                        ).map((size) => (
                                            <Option
                                                key={size}
                                                title={size}
                                                selected={shoeSize === size}
                                                onPress={() =>
                                                    setShoeSize(size)
                                                }
                                            />
                                        ))}
                                    </View>

                                    <ActionButton
                                        title="CONFIRMAR"
                                        onPress={closeModal}
                                    />
                                </>
                            )}

                            {/* FAQ */}

                            {activeModal === "faq" && (
                                <>
                                    <ModalTitle title="CENTRAL DE AJUDA" />

                                    <EmptyMessage
                                        message="As perguntas frequentes, políticas de troca e devolução e canais de suporte serão disponibilizados aqui."
                                    />
                                </>
                            )}

                            {/* PRIVACIDADE */}

                            {activeModal === "privacy" && (
                                <>
                                    <ModalTitle title="PRIVACIDADE E TERMOS" />

                                    <EmptyMessage
                                        message="Os documentos oficiais de privacidade e termos da HC Store serão vinculados nesta área."
                                    />
                                </>
                            )}

                        </ScrollView>

                    </View>
                </View>
            </Modal>

        </Container>
    )
}

const ModalTitle = ({ title }) => (
    <Text style={{
        color: "#FFF",
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 15
    }}>
        {title}
    </Text>
)

export default Profile
