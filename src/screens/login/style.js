import styled from "styled-components/native";

/* ------------------------------------------------------------------ */
/*  CORES                                                              */
/* ------------------------------------------------------------------ */

const BG = "#070707";
const ACCENT = "#00E640";
const TEXT = "#F5F5F5";
const MUTED = "#8C8C8C";
const FAINT = "#4A4A4A";
const BORDER = "#262626";

/* ------------------------------------------------------------------ */
/*  ESTRUTURA                                                          */
/* ------------------------------------------------------------------ */

export const Container = styled.View`
    flex: 1;
    background-color: ${BG};
    padding: 0px 24px;
`;

/* ------------------------------------------------------------------ */
/*  LOGO                                                               */
/* ------------------------------------------------------------------ */

export const LogoContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 60px;
    padding-bottom: 18px;
    border-bottom-width: 1px;
    border-bottom-color: ${BORDER};
`;

export const LogoHC = styled.Text`
    color: ${TEXT};
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -2px;
`;

export const LogoStore = styled.Text`
    color: ${ACCENT};
    font-size: 15px;
    font-weight: 900;
    margin-left: 8px;
    margin-top: 8px;
    letter-spacing: 4px;
`;

/* ------------------------------------------------------------------ */
/*  TEXTOS                                                             */
/* ------------------------------------------------------------------ */

export const Title = styled.Text`
    color: ${TEXT};
    font-size: 46px;
    font-weight: 900;
    line-height: 48px;
    letter-spacing: -1.5px;
`;

export const Description = styled.Text`
    color: ${MUTED};
    font-size: 15px;
    line-height: 23px;
`;

/* ------------------------------------------------------------------ */
/*  FORMULÁRIO                                                         */
/* ------------------------------------------------------------------ */

export const LoginContainer = styled.View`
    width: 100%;
`;

export const Input = styled.TextInput.attrs({
    selectionColor: ACCENT
})`
    width: 100%;
    height: 58px;
    background-color: #101010;
    border-width: 1.5px;
    border-color: ${BORDER};
    border-radius: 14px;
    color: ${TEXT};
    font-size: 15px;
    padding-horizontal: 18px;
    margin-bottom: 18px;
`;

export const ForgotPassword = styled.TouchableOpacity`
    align-self: flex-end;
    margin-top: -6px;
    margin-bottom: 30px;
    padding: 4px 0px;
`;

export const ForgotPasswordText = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 600;
    text-decoration-line: underline;
    text-decoration-color: ${FAINT};
`;

/* ------------------------------------------------------------------ */
/*  BOTÃO ENTRAR                                                       */
/* ------------------------------------------------------------------ */

export const Btn = styled.TouchableOpacity`
    width: 100%;
    height: 60px;
    background-color: ${ACCENT};
    border-radius: 16px;
    align-items: center;
    justify-content: center;
    opacity: ${(props) => (props.disabled ? 0.8 : 1)};

    shadow-color: ${ACCENT};
    shadow-offset: 0px 8px;
    shadow-opacity: 0.35;
    shadow-radius: 18px;
    elevation: 8;
`;

export const BtnTitle = styled.Text`
    color: #000000;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 3px;
`;

/* ------------------------------------------------------------------ */
/*  CADASTRO                                                           */
/* ------------------------------------------------------------------ */

export const AccountText = styled.Text`
    color: ${FAINT};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    text-align: center;
`;

export const SignUpBtn = styled.TouchableOpacity`
    width: 100%;
    height: 56px;
    margin-top: 16px;
    border-radius: 16px;
    border-width: 1.5px;
    border-color: #2E2E2E;
    align-items: center;
    justify-content: center;
`;

export const SignUpText = styled.Text`
    color: ${TEXT};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2.5px;
`;