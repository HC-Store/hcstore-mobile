import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StatusBar
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styled from "styled-components/native"

import { useCart } from "../../context/cart-context"
import {
    createEndereco,
    criarPagamento,
    finalizarPedido,
    getCurrentUser,
    getMyEnderecos,
    validarCupom
} from "../../services/api"

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
const ERROR = "#FF5A5F"

const TOP_SPACE = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 8 : 54

const formatPrice = (value) =>
    `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`

const PAGAMENTOS = [
    {
        key: "pix",
        icon: "flash-outline",
        title: "PIX",
        description: "Aprovação na hora com QR Code ou Copia e Cola.",
        tag: "MAIS RÁPIDO"
    },
    {
        key: "card",
        icon: "card-outline",
        title: "Cartão de crédito",
        description: "Visa, Mastercard, Elo e outros."
    },
    {
        key: "boleto",
        icon: "barcode-outline",
        title: "Boleto bancário",
        description: "Compensação em até 3 dias úteis."
    }
]

/* ================================================================== */
/*  COMPONENTES AUXILIARES (fora da tela p/ não perder o foco)         */
/* ================================================================== */

const Field = ({ label, half, small, ...props }) => {
    const [focused, setFocused] = useState(false)

    return (
        <FieldWrapper $half={half} $small={small}>
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

const SectionHead = ({ number, title, action, onAction }) => (
    <SectionHeader>
        <SectionNumber>
            <SectionNumberText>{number}</SectionNumberText>
        </SectionNumber>

        <SectionTitle>{title}</SectionTitle>

        {!!action && (
            <ChangeBtn onPress={onAction} activeOpacity={0.7}>
                <ChangeText>{action}</ChangeText>
            </ChangeBtn>
        )}
    </SectionHeader>
)

const Radio = ({ selected }) => (
    <RadioOuter $selected={selected}>{selected && <RadioInner />}</RadioOuter>
)

/* ================================================================== */
/*  TELA                                                               */
/* ================================================================== */

const Checkout = () => {
    const navigation = useNavigation()
    const { cartItems, clearCart } = useCart()
    const user = getCurrentUser()

    /* ---------- ENDEREÇO ---------- */

    const [savedAddress, setSavedAddress] = useState(null)
    const [loadingAddress, setLoadingAddress] = useState(true)
    const [alternativeAddress, setAlternativeAddress] = useState(null)
    const [showOtherAddress, setShowOtherAddress] = useState(false)
    const [addressError, setAddressError] = useState("")

    const [cep, setCep] = useState("")
    const [street, setStreet] = useState("")
    const [neighborhood, setNeighborhood] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [number, setNumber] = useState("")
    const [complement, setComplement] = useState("")
    const [loadingCep, setLoadingCep] = useState(false)
    const [cepError, setCepError] = useState("")

    /* ---------- PAGAMENTO / CUPOM ---------- */

    const [paymentMethod, setPaymentMethod] = useState("pix")
    const [placingOrder, setPlacingOrder] = useState(false)

    const [couponCode, setCouponCode] = useState("")
    const [coupon, setCoupon] = useState(null)
    const [couponError, setCouponError] = useState("")
    const [couponLoading, setCouponLoading] = useState(false)

    // Endereço principal salvo no back
    useEffect(() => {
        getMyEnderecos()
            .then((list) => setSavedAddress(list.find((a) => a.primary) ?? list[0] ?? null))
            .catch(() => setSavedAddress(null))
            .finally(() => setLoadingAddress(false))
    }, [])

    /* ---------- VALORES ---------- */

    const subtotal = cartItems.reduce(
        (sum, p) => sum + Number(p.price || 0) * p.quantity,
        0
    )
    const totalItems = cartItems.reduce((sum, p) => sum + p.quantity, 0)

    // Desconto do cupom (o back recalcula o valor oficial ao finalizar)
    const couponDiscount = coupon ? Math.min(Number(coupon.desconto || 0), subtotal) : 0
    const total = subtotal - couponDiscount

    /* ---------- CEP ---------- */

    const searchCep = async () => {
        const cleanCep = cep.replace(/\D/g, "")
        setCepError("")

        if (cleanCep.length !== 8) {
            setCepError("Digite um CEP válido.")
            return
        }

        try {
            setLoadingCep(true)

            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            if (!response.ok) throw new Error("Erro ao consultar CEP")

            const data = await response.json()

            if (data.erro) {
                setCepError("CEP não encontrado.")
                setStreet("")
                setNeighborhood("")
                setCity("")
                setState("")
                return
            }

            setStreet(data.logradouro || "")
            setNeighborhood(data.bairro || "")
            setCity(data.localidade || "")
            setState(data.uf || "")
        } catch {
            setCepError("Não foi possível consultar o CEP. Tente novamente.")
        } finally {
            setLoadingCep(false)
        }
    }

    const useAlternativeAddress = () => {
        setAddressError("")

        if (!street || !city || !state) {
            setAddressError("Consulte um CEP válido.")
            return
        }

        if (!number.trim()) {
            setAddressError("Informe o número do endereço.")
            return
        }

        setAlternativeAddress({
            cep,
            street,
            neighborhood,
            city,
            state: state.toUpperCase(),
            number: number.trim(),
            complement: complement.trim()
        })
        setShowOtherAddress(false)
    }

    const toggleOtherAddress = () => {
        if (alternativeAddress && !showOtherAddress) {
            setAlternativeAddress(null)
            return
        }
        setShowOtherAddress((v) => !v)
    }

    /* ---------- CUPOM ---------- */

    const applyCoupon = async () => {
        if (!couponCode.trim()) return

        try {
            setCouponLoading(true)
            setCouponError("")
            setCoupon(await validarCupom(couponCode.trim(), subtotal))
        } catch (error) {
            setCoupon(null)
            setCouponError(error.message)
        } finally {
            setCouponLoading(false)
        }
    }

    const removeCoupon = () => {
        setCoupon(null)
        setCouponCode("")
        setCouponError("")
    }

    /* ---------- FINALIZAR ---------- */

    const finishOrder = async () => {
        if (placingOrder) return

        if (cartItems.length === 0) {
            Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar.")
            return
        }

        const address = alternativeAddress ?? savedAddress

        if (!address) {
            Alert.alert("Endereço obrigatório", "Cadastre ou informe um endereço de entrega.")
            return
        }

        let pedido = null

        try {
            setPlacingOrder(true)

            let enderecoId = address.id

            // Endereço informado só para esta compra: salva no back (uma vez)
            if (alternativeAddress) {
                if (alternativeAddress.savedId) {
                    enderecoId = alternativeAddress.savedId
                } else {
                    const saved = await createEndereco(alternativeAddress)
                    enderecoId = saved.id
                    setAlternativeAddress({ ...alternativeAddress, savedId: saved.id })
                }
            }

            // O back confere preço, estoque e cupom e cria o pedido
            pedido = await finalizarPedido({
                enderecoId: Number(enderecoId),
                items: cartItems,
                cupomCodigo: coupon?.codigo
            })

            clearCart()
            setCoupon(null)

            // Página de pagamento do PagBank
            const { paymentUrl } = await criarPagamento(pedido.id)
            await Linking.openURL(paymentUrl)

            Alert.alert(
                "Pedido realizado!",
                `Pedido #${pedido.id} criado. Conclua o pagamento na página que abriu.`,
                [{ text: "OK", onPress: () => navigation.reset({ index: 0, routes: [{ name: "Home" }] }) }]
            )
        } catch (error) {
            if (pedido) {
                Alert.alert(
                    "Pedido criado",
                    `Seu pedido #${pedido.id} foi registrado, mas não foi possível abrir o pagamento agora (${error.message}). Ele ficou como pendente no seu perfil.`,
                    [{ text: "OK", onPress: () => navigation.navigate("Profile") }]
                )
            } else {
                Alert.alert("Erro ao finalizar pedido", error.message)
            }
        } finally {
            setPlacingOrder(false)
        }
    }

    /* ---------- ENDEREÇO EXIBIDO ---------- */

    const shown = alternativeAddress ?? savedAddress

    const addressLine = shown
        ? `${shown.street}, ${shown.number}${shown.complement ? ` - ${shown.complement}` : ""}`
        : null

    const addressDetail = shown
        ? `${shown.neighborhood ? shown.neighborhood + " • " : ""}${shown.city}/${shown.state} • CEP ${shown.cep}`
        : null

    const metodoLabel = {
        pix: "PIX",
        card: "CARTÃO",
        boleto: "BOLETO"
    }[paymentMethod]

    /* ================================================================ */
    /*  RENDER                                                           */
    /* ================================================================ */

    return (
        <Container>
            <StatusBar backgroundColor={BG} barStyle="light-content" />

            {/* TOPO */}

            <TopBar>
                <BackButton
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} color={TEXT} />
                </BackButton>

                <LogoRow>
                    <LogoBadge>
                        <LogoHC>HC</LogoHC>
                    </LogoBadge>
                    <LogoStore>STORE</LogoStore>
                </LogoRow>

                <SecureBadge>
                    <Ionicons name="lock-closed" size={14} color={ACCENT} />
                </SecureBadge>
            </TopBar>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Content keyboardShouldPersistTaps="handled">

                    {/* TÍTULO */}

                    <Eyebrow>FINALIZAR COMPRA</Eyebrow>
                    <PageTitle>
                        CHECKOUT<Accent>.</Accent>
                    </PageTitle>

                    {/* ETAPAS */}

                    <Steps>
                        <Step>
                            <StepCircle $state="done">
                                <Ionicons name="checkmark" size={14} color="#000" />
                            </StepCircle>
                            <StepText $state="done">Sacola</StepText>
                        </Step>

                        <StepLine $done />

                        <Step>
                            <StepCircle $state="current">
                                <StepNumber $state="current">2</StepNumber>
                            </StepCircle>
                            <StepText $state="current">Entrega e{"\n"}pagamento</StepText>
                        </Step>

                        <StepLine />

                        <Step>
                            <StepCircle>
                                <StepNumber>3</StepNumber>
                            </StepCircle>
                            <StepText>Conclusão</StepText>
                        </Step>
                    </Steps>

                    {cartItems.length === 0 ? (

                        /* ---------- CARRINHO VAZIO ---------- */

                        <EmptyBox>
                            <EmptyIcon>
                                <Ionicons name="bag-outline" size={30} color={ACCENT} />
                            </EmptyIcon>
                            <EmptyTitle>Seu carrinho está vazio</EmptyTitle>
                            <EmptyText>Adicione produtos para finalizar a compra.</EmptyText>

                            <OutlineBtn
                                onPress={() => navigation.navigate("ProductList")}
                                activeOpacity={0.8}
                                style={{ alignSelf: "stretch", marginTop: 22 }}
                            >
                                <OutlineBtnText>VER PRODUTOS</OutlineBtnText>
                            </OutlineBtn>
                        </EmptyBox>

                    ) : (
                        <>

                            {/* 1. ENDEREÇO */}

                            <Section>
                                <SectionHead
                                    number="1"
                                    title="ENDEREÇO DE ENTREGA"
                                    action={showOtherAddress ? "FECHAR" : "ALTERAR"}
                                    onAction={() => setShowOtherAddress((v) => !v)}
                                />

                                <Card $selected={!!shown}>
                                    {loadingAddress ? (
                                        <ActivityIndicator color={ACCENT} />
                                    ) : (
                                        <AddressTop>
                                            <AddressIcon>
                                                <Ionicons name="location-outline" size={20} color={ACCENT} />
                                            </AddressIcon>

                                            <AddressInfo>
                                                <CardTitle>
                                                    {alternativeAddress
                                                        ? "Endereço desta compra"
                                                        : user?.nome ?? "Endereço principal"}
                                                </CardTitle>

                                                <CardText>
                                                    {addressLine ?? "Nenhum endereço cadastrado. Informe um endereço abaixo."}
                                                </CardText>

                                                {!!addressDetail && <CardDetail>{addressDetail}</CardDetail>}
                                            </AddressInfo>
                                        </AddressTop>
                                    )}

                                    <OutlineBtn onPress={toggleOtherAddress} activeOpacity={0.8}>
                                        <OutlineBtnText>
                                            {showOtherAddress
                                                ? "CANCELAR"
                                                : alternativeAddress
                                                    ? "USAR ENDEREÇO PRINCIPAL"
                                                    : "ENTREGAR EM OUTRO ENDEREÇO"}
                                        </OutlineBtnText>
                                    </OutlineBtn>

                                    {/* FORMULÁRIO DE OUTRO ENDEREÇO */}

                                    {showOtherAddress && (
                                        <AddressForm>
                                            <Row style={{ alignItems: "flex-end" }}>
                                                <Field
                                                    half
                                                    label="CEP"
                                                    value={cep}
                                                    onChangeText={setCep}
                                                    placeholder="00000-000"
                                                    keyboardType="numeric"
                                                    maxLength={9}
                                                />

                                                <CepBtn onPress={searchCep} disabled={loadingCep} activeOpacity={0.85}>
                                                    {loadingCep ? (
                                                        <ActivityIndicator color="#000" />
                                                    ) : (
                                                        <CepBtnText>BUSCAR</CepBtnText>
                                                    )}
                                                </CepBtn>
                                            </Row>

                                            {!!cepError && <ErrorText>{cepError}</ErrorText>}

                                            {street !== "" && (
                                                <>
                                                    <Field label="RUA" value={street} onChangeText={setStreet} />
                                                    <Field label="BAIRRO" value={neighborhood} onChangeText={setNeighborhood} />

                                                    <Row>
                                                        <Field half label="CIDADE" value={city} onChangeText={setCity} />
                                                        <Spacer />
                                                        <Field
                                                            small
                                                            label="UF"
                                                            value={state}
                                                            onChangeText={setState}
                                                            maxLength={2}
                                                            autoCapitalize="characters"
                                                        />
                                                    </Row>

                                                    <Row>
                                                        <Field
                                                            half
                                                            label="NÚMERO"
                                                            value={number}
                                                            onChangeText={setNumber}
                                                            keyboardType="numeric"
                                                            placeholder="123"
                                                        />
                                                        <Spacer />
                                                        <Field
                                                            half
                                                            label="COMPLEMENTO"
                                                            value={complement}
                                                            onChangeText={setComplement}
                                                            placeholder="Opcional"
                                                        />
                                                    </Row>

                                                    {!!addressError && <ErrorText>{addressError}</ErrorText>}

                                                    <PrimaryBtn onPress={useAlternativeAddress} activeOpacity={0.85}>
                                                        <PrimaryBtnText>USAR ESTE ENDEREÇO</PrimaryBtnText>
                                                    </PrimaryBtn>
                                                </>
                                            )}
                                        </AddressForm>
                                    )}
                                </Card>
                            </Section>

                            {/* 2. PAGAMENTO */}

                            <Section>
                                <SectionHead number="2" title="FORMA DE PAGAMENTO" />

                                {PAGAMENTOS.map((p) => {
                                    const selected = paymentMethod === p.key
                                    return (
                                        <PayCard
                                            key={p.key}
                                            $selected={selected}
                                            onPress={() => setPaymentMethod(p.key)}
                                            activeOpacity={0.85}
                                        >
                                            <PayIcon $selected={selected}>
                                                <Ionicons
                                                    name={p.icon}
                                                    size={20}
                                                    color={selected ? "#000" : ACCENT}
                                                />
                                            </PayIcon>

                                            <PayContent>
                                                <PayTitleRow>
                                                    <CardTitle>{p.title}</CardTitle>
                                                    {!!p.tag && (
                                                        <PayTag>
                                                            <PayTagText>{p.tag}</PayTagText>
                                                        </PayTag>
                                                    )}
                                                </PayTitleRow>
                                                <CardDetail>{p.description}</CardDetail>
                                            </PayContent>

                                            <Radio selected={selected} />
                                        </PayCard>
                                    )
                                })}

                                <HintText>
                                    Você conclui o pagamento com segurança na página do PagBank.
                                </HintText>
                            </Section>

                            {/* 3. ITENS */}

                            <Section>
                                <SectionHead number="3" title={`ITENS DO PEDIDO (${totalItems})`} />

                                <Card>
                                    {cartItems.map((product, i) => {
                                        // Pega o tamanho selecionado ou o tamanho padrão/único
                                        const tamanhoExibido =
                                            product.selectedSize ?? product.size ?? product.tamanho

                                        return (
                                            <ProductRow key={`${product.id}-${tamanhoExibido || 'unico'}`} $last={i === cartItems.length - 1}>
                                                <ProductThumb>
                                                    {product.image ? (
                                                        <Image
                                                            source={{ uri: product.image }}
                                                            style={{ width: "100%", height: "100%" }}
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <ThumbText>HC</ThumbText>
                                                    )}
                                                </ProductThumb>

                                                <ProductInfo>
                                                    <ProductName numberOfLines={2}>{product.name}</ProductName>
                                                    <CardDetail>
                                                        {tamanhoExibido ? `Tam: ${tamanhoExibido} • ` : ""}Qtd: {product.quantity}
                                                    </CardDetail>
                                                </ProductInfo>

                                                <ProductPrice>
                                                    {formatPrice(Number(product.price || 0) * product.quantity)}
                                                </ProductPrice>
                                            </ProductRow>
                                        )
                                    })}
                                </Card>
                            </Section>

                            {/* RESUMO */}

                            <Section>
                                <SectionHeader>
                                    <SectionTitle style={{ marginLeft: 0 }}>RESUMO DO PEDIDO</SectionTitle>
                                </SectionHeader>

                                <Card>
                                    {/* Cupom */}

                                    {coupon ? (
                                        <CouponApplied>
                                            <CouponLeft>
                                                <Ionicons name="pricetag" size={16} color={ACCENT} />
                                                <CouponAppliedText>Cupom {coupon.codigo} aplicado</CouponAppliedText>
                                            </CouponLeft>

                                            <ChangeBtn onPress={removeCoupon} activeOpacity={0.7}>
                                                <RemoveText>REMOVER</RemoveText>
                                            </ChangeBtn>
                                        </CouponApplied>
                                    ) : (
                                        <CouponRow>
                                            <CouponInputBox $error={!!couponError}>
                                                <Ionicons name="pricetag-outline" size={16} color={FAINT} />
                                                <CouponInput
                                                    value={couponCode}
                                                    onChangeText={(t) => {
                                                        setCouponCode(t)
                                                        if (couponError) setCouponError("")
                                                    }}
                                                    placeholder="Cupom de desconto"
                                                    autoCapitalize="characters"
                                                    autoCorrect={false}
                                                    returnKeyType="done"
                                                    onSubmitEditing={applyCoupon}
                                                />
                                            </CouponInputBox>

                                            <CouponBtn
                                                onPress={applyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                $disabled={!couponCode.trim()}
                                                activeOpacity={0.85}
                                            >
                                                {couponLoading ? (
                                                    <ActivityIndicator color="#000" />
                                                ) : (
                                                    <CouponBtnText>APLICAR</CouponBtnText>
                                                )}
                                            </CouponBtn>
                                        </CouponRow>
                                    )}

                                    {!!couponError && <ErrorText>{couponError}</ErrorText>}

                                    {/* Valores */}

                                    <PriceRow style={{ marginTop: 18 }}>
                                        <PriceLabel>
                                            Subtotal ({totalItems} {totalItems === 1 ? "produto" : "produtos"})
                                        </PriceLabel>
                                        <PriceValue>{formatPrice(subtotal)}</PriceValue>
                                    </PriceRow>

                                    {couponDiscount > 0 && (
                                        <PriceRow>
                                            <PriceLabel>Desconto ({coupon.codigo})</PriceLabel>
                                            <GreenValue>- {formatPrice(couponDiscount)}</GreenValue>
                                        </PriceRow>
                                    )}

                                    <PriceRow>
                                        <PriceLabel>Frete</PriceLabel>
                                        <GreenValue>GRÁTIS</GreenValue>
                                    </PriceRow>

                                    <Divider />

                                    <TotalRow>
                                        <TotalLabel>Total a pagar</TotalLabel>
                                        <TotalPrice>{formatPrice(total)}</TotalPrice>
                                    </TotalRow>
                                </Card>
                            </Section>

                            {/* SEGURANÇA */}

                            <Security>
                                <SecurityItem>
                                    <Ionicons name="shield-checkmark-outline" size={20} color={ACCENT} />
                                    <SecurityTitle>PAGAMENTO</SecurityTitle>
                                    <SecurityText>protegido</SecurityText>
                                </SecurityItem>

                                <SecurityDivider />

                                <SecurityItem>
                                    <Ionicons name="lock-closed-outline" size={20} color={ACCENT} />
                                    <SecurityTitle>COMPRA</SecurityTitle>
                                    <SecurityText>segura</SecurityText>
                                </SecurityItem>

                                <SecurityDivider />

                                <SecurityItem>
                                    <Ionicons name="key-outline" size={20} color={ACCENT} />
                                    <SecurityTitle>DADOS</SecurityTitle>
                                    <SecurityText>criptografados</SecurityText>
                                </SecurityItem>
                            </Security>

                            {/* BOTÃO FINALIZAR */}

                            <FinishButton onPress={finishOrder} disabled={placingOrder} activeOpacity={0.85}>
                                {placingOrder ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <>
                                        <FinishText>CONCLUIR E PAGAR</FinishText>
                                        <FinishArrowBox>
                                            <FinishArrow>→</FinishArrow>
                                        </FinishArrowBox>
                                    </>
                                )}
                            </FinishButton>
                        </>
                    )}

                </Content>
            </KeyboardAvoidingView>
        </Container>
    )
}

export default Checkout

/* ================================================================== */
/*  ESTILOS                                                            */
/* ================================================================== */

const Container = styled.View`
    flex: 1;
    background-color: ${BG};
`

const TopBar = styled.View`
    height: 60px;
    padding-top: ${TOP_SPACE - 42}px;
    padding-horizontal: 24px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${BG};
    border-bottom-width: 1px;
    border-bottom-color: ${BORDER};
`

const BackButton = styled.TouchableOpacity`
    width: 38px;
    height: 38px;
    border-radius: 19px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    align-items: center;
    justify-content: center;
`

const LogoRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const LogoBadge = styled.View`
    background-color: ${ACCENT};
    padding-horizontal: 6px;
    padding-vertical: 2px;
    border-radius: 4px;
    margin-right: 4px;
`

const LogoHC = styled.Text`
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: -0.5px;
`

const LogoStore = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2px;
`

const SecureBadge = styled.View`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
`

const Content = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { padding: 24, paddingBottom: 100 }
})`
    flex: 1;
`

const Eyebrow = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2.5px;
`

const PageTitle = styled.Text`
    color: ${TEXT};
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -1px;
    margin-top: 4px;
    margin-bottom: 24px;
`

const Accent = styled.Text`
    color: ${ACCENT};
`

/* Etapas */

const Steps = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-horizontal: 10px;
`

const Step = styled.View`
    align-items: center;
`

const StepCircle = styled.View`
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background-color: ${(p) =>
        p.$state === "done" ? ACCENT : p.$state === "current" ? SURFACE_2 : SURFACE};
    border-width: 1.5px;
    border-color: ${(p) =>
        p.$state === "done" ? ACCENT : p.$state === "current" ? ACCENT : BORDER};
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
`

const StepNumber = styled.Text`
    color: ${(p) => (p.$state === "current" ? ACCENT : MUTED)};
    font-size: 11px;
    font-weight: 900;
`

const StepText = styled.Text`
    color: ${(p) => (p.$state === "done" || p.$state === "current" ? TEXT : MUTED)};
    font-size: 10px;
    font-weight: ${(p) => (p.$state === "current" ? "800" : "600")};
    text-align: center;
    line-height: 13px;
`

const StepLine = styled.View`
    flex: 1;
    height: 1.5px;
    background-color: ${(p) => (p.$done ? ACCENT : BORDER)};
    margin-horizontal: 8px;
    margin-bottom: 20px;
`

/* Seções */

const Section = styled.View`
    margin-bottom: 24px;
`

const SectionHeader = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
`

const SectionNumber = styled.View`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: rgba(0, 230, 64, 0.15);
    align-items: center;
    justify-content: center;
    margin-right: 8px;
`

const SectionNumberText = styled.Text`
    color: ${ACCENT};
    font-size: 10px;
    font-weight: 900;
`

const SectionTitle = styled.Text`
    flex: 1;
    color: ${TEXT};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

const ChangeBtn = styled.TouchableOpacity``

const ChangeText = styled.Text`
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
`

const Card = styled.View`
    padding: 16px;
    border-radius: 18px;
    border-width: 1px;
    border-color: ${(p) => (p.$selected ? "rgba(0, 230, 64, 0.4)" : BORDER)};
    background-color: ${SURFACE};
`

const CardTitle = styled.Text`
    color: ${TEXT};
    font-size: 14px;
    font-weight: 800;
`

const CardText = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    line-height: 18px;
    margin-top: 4px;
`

const CardDetail = styled.Text`
    color: ${MUTED};
    font-size: 12px;
    margin-top: 2px;
`

/* Endereço */

const AddressTop = styled.View`
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 14px;
`

const AddressIcon = styled.View`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: rgba(0, 230, 64, 0.1);
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`

const AddressInfo = styled.View`
    flex: 1;
`

const OutlineBtn = styled.TouchableOpacity`
    height: 44px;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${BORDER};
    background-color: ${SURFACE_2};
    align-items: center;
    justify-content: center;
    margin-top: 4px;
`

const OutlineBtnText = styled.Text`
    color: ${TEXT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
`

const AddressForm = styled.View`
    margin-top: 16px;
    padding-top: 16px;
    border-top-width: 1px;
    border-top-color: ${BORDER};
`

const Row = styled.View`
    flex-direction: row;
    margin-bottom: 12px;
`

const Spacer = styled.View`
    width: 12px;
`

const FieldWrapper = styled.View`
    flex: ${(p) => (p.$half ? 1 : p.$small ? 0.35 : 1)};
`

const FieldLabel = styled.Text`
    color: ${(p) => (p.$focused ? ACCENT : MUTED)};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.5px;
    margin-bottom: 6px;
`

const FieldInput = styled.TextInput`
    height: 46px;
    padding-horizontal: 14px;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$focused ? ACCENT : BORDER)};
    background-color: ${SURFACE_2};
    color: ${TEXT};
    font-size: 13px;
    font-weight: 700;
`

const CepBtn = styled.TouchableOpacity`
    height: 46px;
    padding-horizontal: 16px;
    border-radius: 12px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
    margin-left: 8px;
`

const CepBtnText = styled.Text`
    color: #000000;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1px;
`

const PrimaryBtn = styled.TouchableOpacity`
    height: 48px;
    border-radius: 12px;
    background-color: ${ACCENT};
    align-items: center;
    justify-content: center;
    margin-top: 8px;
`

const PrimaryBtnText = styled.Text`
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1.5px;
`

/* Pagamento */

const PayCard = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 14px;
    border-radius: 16px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$selected ? ACCENT : BORDER)};
    background-color: ${(p) => (p.$selected ? "rgba(0, 230, 64, 0.05)" : SURFACE)};
    margin-bottom: 10px;
`

const PayIcon = styled.View`
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background-color: ${(p) => (p.$selected ? ACCENT : "rgba(0, 230, 64, 0.1)")};
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`

const PayContent = styled.View`
    flex: 1;
    margin-right: 10px;
`

const PayTitleRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 2px;
`

const PayTag = styled.View`
    background-color: rgba(0, 230, 64, 0.15);
    padding-horizontal: 6px;
    padding-vertical: 2px;
    border-radius: 4px;
    margin-left: 8px;
`

const PayTagText = styled.Text`
    color: ${ACCENT};
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 1px;
`

const RadioOuter = styled.View`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border-width: 2px;
    border-color: ${(p) => (p.$selected ? ACCENT : FAINT)};
    align-items: center;
    justify-content: center;
`

const RadioInner = styled.View`
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${ACCENT};
`

const HintText = styled.Text`
    color: ${MUTED};
    font-size: 11px;
    text-align: center;
    margin-top: 4px;
`

/* Produtos / Itens */

const ProductRow = styled.View`
    flex-direction: row;
    align-items: center;
    padding-vertical: 10px;
    border-bottom-width: ${(p) => (p.$last ? 0 : 1)}px;
    border-bottom-color: ${BORDER};
`

const ProductThumb = styled.View`
    width: 48px;
    height: 58px;
    border-radius: 10px;
    overflow: hidden;
    background-color: ${SURFACE_2};
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`

const ThumbText = styled.Text`
    color: ${FAINT};
    font-size: 12px;
    font-weight: 900;
`

const ProductInfo = styled.View`
    flex: 1;
    margin-right: 10px;
`

const ProductName = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 700;
    line-height: 17px;
`

const ProductPrice = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 800;
`

/* Resumo */

const CouponRow = styled.View`
    flex-direction: row;
    align-items: center;
`

const CouponInputBox = styled.View`
    flex: 1;
    height: 44px;
    flex-direction: row;
    align-items: center;
    padding-horizontal: 12px;
    border-radius: 12px;
    border-width: 1.5px;
    border-color: ${(p) => (p.$error ? ERROR : BORDER)};
    background-color: ${SURFACE_2};
    margin-right: 8px;
`

const CouponInput = styled.TextInput`
    flex: 1;
    color: ${TEXT};
    font-size: 12px;
    font-weight: 700;
    margin-left: 8px;
`

const CouponBtn = styled.TouchableOpacity`
    height: 44px;
    padding-horizontal: 16px;
    border-radius: 12px;
    background-color: ${(p) => (p.$disabled ? BORDER : ACCENT)};
    align-items: center;
    justify-content: center;
`

const CouponBtnText = styled.Text`
    color: #000000;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1px;
`

const CouponApplied = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 12px;
    background-color: rgba(0, 230, 64, 0.1);
    border-width: 1px;
    border-color: rgba(0, 230, 64, 0.3);
`

const CouponLeft = styled.View`
    flex-direction: row;
    align-items: center;
`

const CouponAppliedText = styled.Text`
    color: ${ACCENT};
    font-size: 12px;
    font-weight: 800;
    margin-left: 8px;
`

const RemoveText = styled.Text`
    color: ${ERROR};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1px;
`

const PriceRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`

const PriceLabel = styled.Text`
    color: ${MUTED};
    font-size: 13px;
`

const PriceValue = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 700;
`

const GreenValue = styled.Text`
    color: ${ACCENT};
    font-size: 13px;
    font-weight: 800;
`

const Divider = styled.View`
    height: 1px;
    background-color: ${BORDER};
    margin-vertical: 12px;
`

const TotalRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const TotalLabel = styled.Text`
    color: ${TEXT};
    font-size: 15px;
    font-weight: 800;
`

const TotalPrice = styled.Text`
    color: ${ACCENT};
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.5px;
`

const ErrorText = styled.Text`
    color: ${ERROR};
    font-size: 11px;
    font-weight: 700;
    margin-top: 6px;
`

/* Segurança */

const Security = styled.View`
    flex-direction: row;
    padding: 16px;
    border-radius: 16px;
    border-width: 1px;
    border-color: ${BORDER};
    background-color: ${SURFACE};
    margin-bottom: 24px;
`

const SecurityItem = styled.View`
    flex: 1;
    align-items: center;
`

const SecurityTitle = styled.Text`
    color: ${TEXT};
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 1px;
    margin-top: 6px;
`

const SecurityText = styled.Text`
    color: ${MUTED};
    font-size: 9px;
    margin-top: 1px;
`

const SecurityDivider = styled.View`
    width: 1px;
    background-color: ${BORDER};
`

/* Botão finalizar */

const FinishButton = styled.TouchableOpacity`
    height: 58px;
    border-radius: 16px;
    background-color: ${ACCENT};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 8px;
    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.35;
    shadow-radius: 18px;
    elevation: 8;
    margin-bottom: 20px;
`

const FinishText = styled.Text`
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 2px;
`

const FinishArrowBox = styled.View`
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background-color: #000000;
    align-items: center;
    justify-content: center;
`

const FinishArrow = styled.Text`
    color: ${ACCENT};
    font-size: 19px;
    font-weight: 900;
`

/* Vazio */

const EmptyBox = styled.View`
    align-items: center;
    justify-content: center;
    padding-vertical: 60px;
`

const EmptyIcon = styled.View`
    width: 64px;
    height: 64px;
    border-radius: 32px;
    background-color: rgba(0, 230, 64, 0.1);
    border-width: 1px;
    border-color: rgba(0, 230, 64, 0.3);
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
`

const EmptyTitle = styled.Text`
    color: ${TEXT};
    font-size: 18px;
    font-weight: 900;
`

const EmptyText = styled.Text`
    color: ${MUTED};
    font-size: 13px;
    margin-top: 4px;
`