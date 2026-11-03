import { useState } from "react"

import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useCart } from "../../context/cart-context"

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
        cartItems
    } = useCart()


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


    const pixDiscount =
        paymentMethod === "pix"
            ? subtotal * 0.05
            : 0


    const total =
        subtotal - pixDiscount


    const formatPrice = (value) => {

        return value
            .toFixed(2)
            .replace(".", ",")
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
            : "Lucas Mendes"
        }
    </OptionTitle>

    <OptionDescription>

        {alternativeAddress
            ? `${alternativeAddress.street}, ${alternativeAddress.number}${alternativeAddress.complement
                ? ` - ${alternativeAddress.complement}`
                : ""
            }`
            : "Av. Paulista, 1000, Apto 82 - Bela Vista"
        }

    </OptionDescription>

    <OptionDetail>

        {alternativeAddress
            ? `${alternativeAddress.neighborhood} - ${alternativeAddress.city}/${alternativeAddress.state} • CEP ${alternativeAddress.cep}`
            : "São Paulo - SP, CEP 01310-100"
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

                        {
                            paymentMethod === "pix" && (

                                <DiscountText>
                                    PIX -5%
                                </DiscountText>

                            )
                        }

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



                    {
                        paymentMethod === "pix" && (

                            <PriceRow>

                                <PriceLabel>
                                    Desconto PIX (5%)
                                </PriceLabel>

                                <DiscountValue>

                                    - R$ {
                                        formatPrice(
                                            pixDiscount
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

                                {
                                    paymentMethod === "pix"
                                        ? "Valor com desconto no PIX"
                                        : "Valor total do pedido"
                                }

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



                <FinishButton>

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