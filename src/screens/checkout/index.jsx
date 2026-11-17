import { useEffect, useState } from "react"
import { Alert, Linking, Text, TextInput, TouchableOpacity, View } from "react-native"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useCart } from "../../context/cart-context"
import {
    createEndereco,
    criarPagamento,
    finalizarPedido,
    getCurrentUser,
    getMyEnderecos,
    validarCupom
} from "../../services/api"

import {
    CheckoutHeader,
    BackButton,
    CheckoutLogo,
    CheckoutLogoHC,
    CheckoutLogoStore,
    HeaderSpacer,
    Container,
    Content,
    AddressForm,
AddressLabel,
CepRow,
CepInput,
SearchCepButton,
SearchCepButtonText,
AddressInput,
AddressRow,
AddressHalf,
StateArea,
AddressError,

    StepsContainer,
    Step,
    StepCircle,
    StepText,
    StepLine,

    Section,
    SectionHeader,
    SectionNumber,
    SectionTitle,
    ChangeText,

    OptionCard,
    OptionTop,
    Radio,
    RadioSelected,
    OptionContent,
    OptionTitle,
    OptionDescription,
    OptionDetail,
    GreenText,

    AddButton,
    AddButtonText,
    UseAddressButton,
    UseAddressButtonText,

    ProductsContainer,
    ProductRow,
    ProductImage,
    ProductInfo,
    ProductName,
    ProductDetail,
    ProductPrice,

    CouponContainer,
    CouponTop,
    CouponTitle,
    DiscountText,

    PriceRow,
    PriceLabel,
    PriceValue,
    DiscountValue,

    Divider,

    TotalRow,
    TotalLabelArea,
    TotalLabel,
    TotalInstallments,
    TotalPrice,

    SecurityContainer,
    SecurityItem,
    SecurityIcon,
    SecurityTitle,
    SecurityDescription,

    TermsText,

    FinishButton,
    FinishButtonText
} from "./style"


const Checkout = () => {
    const navigation = useNavigation()
    const [alternativeAddress, setAlternativeAddress] = useState(null)
const [addressError, setAddressError] = useState("")

    const [paymentMethod, setPaymentMethod] = useState("pix")
    const [showOtherAddress, setShowOtherAddress] = useState(false)

const [cep, setCep] = useState("")
const [street, setStreet] = useState("")
const [neighborhood, setNeighborhood] = useState("")
const [city, setCity] = useState("")
const [state, setState] = useState("")

const [number, setNumber] = useState("")
const [complement, setComplement] = useState("")

const [loadingCep, setLoadingCep] = useState(false)
const [cepError, setCepError] = useState("")

const searchCep = async () => {

    const cleanCep = cep.replace(/\D/g, "")

    setCepError("")

    if (cleanCep.length !== 8) {
        setCepError("Digite um CEP válido.")
        return
    }

    try {

        setLoadingCep(true)

        const response = await fetch(
            `https://viacep.com.br/ws/${cleanCep}/json/`
        )

        if (!response.ok) {
            throw new Error("Erro ao consultar CEP")
        }

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

    } catch (error) {

        console.log("Erro ao buscar CEP:", error)

        setCepError(
            "Não foi possível consultar o CEP. Tente novamente."
        )

    } finally {

        setLoadingCep(false)
    }
}






    const {
        cartItems,
        clearCart
    } = useCart()

    const [savedAddress, setSavedAddress] = useState(null)
    const [placingOrder, setPlacingOrder] = useState(false)

    const [couponCode, setCouponCode] = useState("")
    const [coupon, setCoupon] = useState(null)
    const [couponError, setCouponError] = useState("")
    const [couponLoading, setCouponLoading] = useState(false)
    const user = getCurrentUser()

    // Endereço principal salvo no back
    useEffect(() => {
        getMyEnderecos()
            .then((list) => setSavedAddress(list[0] ?? null))
            .catch(() => setSavedAddress(null))
    }, [])


    const subtotal = cartItems.reduce(
        (total, product) =>
            total + product.price * product.quantity,
        0
    )


    const totalItems = cartItems.reduce(
        (total, product) =>
            total + product.quantity,
        0
    )


    // Desconto do cupom (o back recalcula o valor oficial ao finalizar)
    const couponDiscount = coupon ? Math.min(coupon.desconto, subtotal) : 0


    const total =
        subtotal - couponDiscount


    const formatPrice = (value) => {

        return value
            .toFixed(2)
            .replace(".", ",")
    }

    const applyCoupon = async () => {

        if (!couponCode.trim()) {
            return
        }

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

    const finishOrder = async () => {

        if (cartItems.length === 0) {
            Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar.")
            return
        }

        const address = alternativeAddress ?? savedAddress

        if (!address) {
            Alert.alert(
                "Endereço obrigatório",
                "Cadastre ou informe um endereço de entrega."
            )
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
                [{ text: "OK", onPress: () => navigation.navigate("Home") }]
            )
        } catch (error) {
            if (pedido) {
                // Pedido existe, mas o pagamento não abriu
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

    const newAddress = {
        cep,
        street,
        neighborhood,
        city,
        state,
        number,
        complement
    }

    setAlternativeAddress(newAddress)

    setShowOtherAddress(false)
}

    


    return (

        <Container>

           <CheckoutHeader>

    <BackButton
        onPress={() => navigation.goBack()}
        hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }}
    >
        <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
        />
    </BackButton>

    <CheckoutLogo>
        <CheckoutLogoHC>
            HC
        </CheckoutLogoHC>

        <CheckoutLogoStore>
            STORE
        </CheckoutLogoStore>
    </CheckoutLogo>

    <HeaderSpacer />

</CheckoutHeader>


            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 35
                }}
            >


                {/* ETAPAS */}

                <StepsContainer>

                    <Step>

                        <StepCircle completed>
                            ✓
                        </StepCircle>

                        <StepText completed>
                            Sacola
                        </StepText>

                    </Step>


                    <StepLine completed />


                    <Step>

                        <StepCircle completed>
                            ✓
                        </StepCircle>

                        <StepText completed>
                            Pagamento
                        </StepText>

                    </Step>


                    <StepLine />


                    <Step>

                        <StepCircle>
                            3
                        </StepCircle>

                        <StepText>
                            Conclusão
                        </StepText>

                    </Step>

                </StepsContainer>



                {/* ENDEREÇO */}

                <Section>

                    <SectionHeader>

                        <SectionNumber>
                            1
                        </SectionNumber>

                        <SectionTitle>
                            ENDEREÇO DE ENTREGA
                        </SectionTitle>

                        <ChangeText>
                            ALTERAR
                        </ChangeText>

                    </SectionHeader>


                    <OptionCard selected>

                        <OptionTop>

                            <Radio selected>

                                <RadioSelected />

                            </Radio>

<OptionContent>

    <OptionTitle>
        {alternativeAddress
            ? "Endereço desta compra"
            : (user?.nome ?? "Endereço principal")
        }
    </OptionTitle>

    <OptionDescription>

        {alternativeAddress
            ? `${alternativeAddress.street}, ${alternativeAddress.number}${alternativeAddress.complement
                ? ` - ${alternativeAddress.complement}`
                : ""
            }`
            : savedAddress
                ? `${savedAddress.street}, ${savedAddress.number}${savedAddress.complement ? ` - ${savedAddress.complement}` : ""}`
                : "Nenhum endereço cadastrado. Use “Outro endereço”."
        }

    </OptionDescription>

    <OptionDetail>

        {alternativeAddress
            ? `${alternativeAddress.neighborhood} - ${alternativeAddress.city}/${alternativeAddress.state} • CEP ${alternativeAddress.cep}`
            : savedAddress
                ? `${savedAddress.neighborhood ? savedAddress.neighborhood + " - " : ""}${savedAddress.city}/${savedAddress.state} • CEP ${savedAddress.cep}`
                : ""
        }

    </OptionDetail>

</OptionContent>

                        </OptionTop>


     <AddButton
    onPress={() => {

        if (alternativeAddress && !showOtherAddress) {
            setAlternativeAddress(null)
            return
        }

        setShowOtherAddress(!showOtherAddress)
    }}
>
    <AddButtonText>

        {showOtherAddress
            ? "CANCELAR"
            : alternativeAddress
                ? "USAR ENDEREÇO PRINCIPAL"
                : "ENTREGAR EM OUTRO ENDEREÇO"
        }

    </AddButtonText>
</AddButton>

{showOtherAddress && (

    <AddressForm>

        <AddressLabel>
            CEP
        </AddressLabel>

        <CepRow>

            <CepInput
                value={cep}
                onChangeText={setCep}
                placeholder="00000-000"
                placeholderTextColor="#777777"
                keyboardType="numeric"
                maxLength={9}
            />

            <SearchCepButton
                onPress={searchCep}
                disabled={loadingCep}
            >

                <SearchCepButtonText>
                    {loadingCep
                        ? "BUSCANDO..."
                        : "BUSCAR"
                    }
                </SearchCepButtonText>

            </SearchCepButton>

        </CepRow>


        {cepError !== "" && (

            <AddressError>
                {cepError}
            </AddressError>

        )}


        {street !== "" && (

            <>

                <AddressLabel>
                    RUA
                </AddressLabel>

                <AddressInput
                    value={street}
                    onChangeText={setStreet}
                />


                <AddressLabel>
                    BAIRRO
                </AddressLabel>

                <AddressInput
                    value={neighborhood}
                    onChangeText={setNeighborhood}
                />


                <AddressRow>

                    <AddressHalf>

                        <AddressLabel>
                            CIDADE
                        </AddressLabel>

                        <AddressInput
                            value={city}
                            onChangeText={setCity}
                        />

                    </AddressHalf>


                    <StateArea>

                        <AddressLabel>
                            UF
                        </AddressLabel>

                        <AddressInput
                            value={state}
                            onChangeText={setState}
                            maxLength={2}
                        />

                    </StateArea>

                </AddressRow>


                <AddressRow>

                    <AddressHalf>

                        <AddressLabel>
                            NÚMERO
                        </AddressLabel>

                        <AddressInput
                            value={number}
                            onChangeText={setNumber}
                            keyboardType="numeric"
                            placeholder="123"
                            placeholderTextColor="#777777"
                        />

                    </AddressHalf>


                    <AddressHalf>

                        <AddressLabel>
                            COMPLEMENTO
                        </AddressLabel>

                        <AddressInput
                            value={complement}
                            onChangeText={setComplement}
                            placeholder="Opcional"
                            placeholderTextColor="#777777"
                        />

                    </AddressHalf>


                </AddressRow>

                {addressError !== "" && (
    <AddressError>
        {addressError}
    </AddressError>
)}

<UseAddressButton
    onPress={useAlternativeAddress}
>
    <UseAddressButtonText>
        USAR ESTE ENDEREÇO
    </UseAddressButtonText>
</UseAddressButton>

            </>

        )}

    </AddressForm>

)}

                    </OptionCard>

                </Section>



                {/* PAGAMENTO */}

                <Section>

                    <SectionHeader>

                        <SectionNumber>
                            2
                        </SectionNumber>

                        <SectionTitle>
                            FORMA DE PAGAMENTO
                        </SectionTitle>

                    </SectionHeader>



                    {/* PIX */}

                    <OptionCard
                        selected={
                            paymentMethod === "pix"
                        }
                        onPress={() =>
                            setPaymentMethod("pix")
                        }
                    >

                        <OptionTop>

                            <Radio
                                selected={
                                    paymentMethod === "pix"
                                }
                            >

                                {
                                    paymentMethod === "pix" && (
                                        <RadioSelected />
                                    )
                                }

                            </Radio>


                            <OptionContent>

                                <OptionTitle>
                                    PIX Instantâneo
                                </OptionTitle>

                                <OptionDescription>
                                    Aprovação em segundos. QR Code e Copia e Cola.
                                </OptionDescription>

                                <GreenText>
                                    5% DE DESCONTO NO PIX
                                </GreenText>

                            </OptionContent>

                        </OptionTop>

                    </OptionCard>



                    {/* CARTÃO */}

                    <OptionCard
                        selected={
                            paymentMethod === "card"
                        }
                        onPress={() =>
                            setPaymentMethod("card")
                        }
                    >

                        <OptionTop>

                            <Radio
                                selected={
                                    paymentMethod === "card"
                                }
                            >

                                {
                                    paymentMethod === "card" && (
                                        <RadioSelected />
                                    )
                                }

                            </Radio>


                            <OptionContent>

                                <OptionTitle>
                                    Cartão de Crédito
                                </OptionTitle>

                                <OptionDescription>
                                    Visa, Mastercard, Elo e outros.
                                </OptionDescription>

                                <OptionDetail>
                                    Até 6x sem juros
                                </OptionDetail>

                            </OptionContent>

                        </OptionTop>

                    </OptionCard>



                    {/* BOLETO */}

                    <OptionCard
                        selected={
                            paymentMethod === "boleto"
                        }
                        onPress={() =>
                            setPaymentMethod("boleto")
                        }
                    >

                        <OptionTop>

                            <Radio
                                selected={
                                    paymentMethod === "boleto"
                                }
                            >

                                {
                                    paymentMethod === "boleto" && (
                                        <RadioSelected />
                                    )
                                }

                            </Radio>


                            <OptionContent>

                                <OptionTitle>
                                    Boleto Bancário
                                </OptionTitle>

                                <OptionDescription>
                                    Compensação em até 3 dias úteis.
                                </OptionDescription>

                                <OptionDetail>
                                    Vencimento após emissão
                                </OptionDetail>

                            </OptionContent>

                        </OptionTop>

                    </OptionCard>

                </Section>



                {/* ITENS DO PEDIDO */}

                <Section>

                    <SectionHeader>

                        <SectionNumber>
                            3
                        </SectionNumber>

                        <SectionTitle>
                            ITENS DO PEDIDO
                        </SectionTitle>

                    </SectionHeader>


                    <ProductsContainer>

                        {
                            cartItems.map(product => (

                                <ProductRow
                                    key={product.id}
                                >

                                    <ProductImage />


                                    <ProductInfo>

                                        <ProductName>
                                            {product.name}
                                        </ProductName>


                                        {
                                            product.size && (

                                                <ProductDetail>
                                                    Tam: {product.size}
                                                </ProductDetail>

                                            )
                                        }


                                        <ProductDetail>
                                            Qtd: {product.quantity}
                                        </ProductDetail>

                                    </ProductInfo>


                                    <ProductPrice>

                                        R$ {
                                            formatPrice(
                                                product.price *
                                                product.quantity
                                            )
                                        }

                                    </ProductPrice>

                                </ProductRow>

                            ))
                        }

                    </ProductsContainer>

                </Section>



                {/* RESUMO */}

                <CouponContainer>

                    <CouponTop>

                        <CouponTitle>
                            RESUMO DO PEDIDO
                        </CouponTitle>

                        

                    </CouponTop>



                    <PriceRow>

                        <PriceLabel>

                            Subtotal ({totalItems} {
                                totalItems === 1
                                    ? "produto"
                                    : "produtos"
                            })

                        </PriceLabel>

                        <PriceValue>

                            R$ {
                                formatPrice(subtotal)
                            }

                        </PriceValue>

                    </PriceRow>



                    <View style={{ marginVertical: 12 }}>

                        {coupon ? (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ color: "#00FF63", fontWeight: "bold" }}>
                                    Cupom {coupon.codigo} aplicado
                                </Text>
                                <TouchableOpacity onPress={removeCoupon}>
                                    <Text style={{ color: "#AAAAAA" }}>REMOVER</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TextInput
                                    value={couponCode}
                                    onChangeText={setCouponCode}
                                    placeholder="CUPOM DE DESCONTO"
                                    placeholderTextColor="#777777"
                                    autoCapitalize="characters"
                                    style={{ flex: 1, borderWidth: 1, borderColor: "#444", color: "#FFF", paddingHorizontal: 10, height: 40 }}
                                />
                                <TouchableOpacity
                                    onPress={applyCoupon}
                                    disabled={couponLoading}
                                    style={{ marginLeft: 8, backgroundColor: "#00FF63", paddingHorizontal: 14, height: 40, justifyContent: "center" }}
                                >
                                    <Text style={{ fontWeight: "bold" }}>
                                        {couponLoading ? "..." : "APLICAR"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {couponError !== "" && (
                            <Text style={{ color: "#FF5252", marginTop: 6 }}>
                                {couponError}
                            </Text>
                        )}

                    </View>

                    {
                        couponDiscount > 0 && (

                            <PriceRow>

                                <PriceLabel>
                                    Desconto ({coupon.codigo})
                                </PriceLabel>

                                <DiscountValue>

                                    - R$ {
                                        formatPrice(
                                            couponDiscount
                                        )
                                    }

                                </DiscountValue>

                            </PriceRow>

                        )
                    }



                    <PriceRow>

                        <PriceLabel>
                            Frete
                        </PriceLabel>

                        <DiscountValue>
                            GRÁTIS
                        </DiscountValue>

                    </PriceRow>



                    <Divider />



                    <TotalRow>

                        <TotalLabelArea>

                            <TotalLabel>
                                Total a Pagar
                            </TotalLabel>

                            <TotalInstallments>

                                Valor total do pedido

                            </TotalInstallments>

                        </TotalLabelArea>


                        <TotalPrice>

                            R$ {
                                formatPrice(total)
                            }

                        </TotalPrice>

                    </TotalRow>

                </CouponContainer>



                {/* SEGURANÇA */}

                <SecurityContainer>

                    <SecurityItem>

                        <SecurityIcon>
                            ♢
                        </SecurityIcon>

                        <SecurityTitle>
                            PAGAMENTO
                        </SecurityTitle>

                        <SecurityDescription>
                            PROTEGIDO
                        </SecurityDescription>

                    </SecurityItem>


                    <SecurityItem>

                        <SecurityIcon>
                            ◉
                        </SecurityIcon>

                        <SecurityTitle>
                            COMPRA
                        </SecurityTitle>

                        <SecurityDescription>
                            SEGURA
                        </SecurityDescription>

                    </SecurityItem>


                    <SecurityItem>

                        <SecurityIcon>
                            ▣
                        </SecurityIcon>

                        <SecurityTitle>
                            DADOS
                        </SecurityTitle>

                        <SecurityDescription>
                            CRIPTOGRAFADOS
                        </SecurityDescription>

                    </SecurityItem>

                </SecurityContainer>



                <TermsText>

                    AO FINALIZAR, VOCÊ CONCORDA COM OS TERMOS DE COMPRA
                    E POLÍTICA DE PRIVACIDADE DA HC STORE.

                </TermsText>



                <FinishButton onPress={finishOrder} disabled={placingOrder}>

                    <FinishButtonText>

                        {
                            paymentMethod === "pix"
                                ? `⚡ FINALIZAR PEDIDO NO PIX • R$ ${formatPrice(total)}`
                                : paymentMethod === "card"
                                    ? `FINALIZAR PEDIDO NO CARTÃO • R$ ${formatPrice(total)}`
                                    : `GERAR BOLETO • R$ ${formatPrice(total)}`
                        }

                    </FinishButtonText>

                </FinishButton>


            </Content>

        </Container>

    )
}


export default Checkout