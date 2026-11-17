# hcstore-mobile

## Build com EAS

1. `npm install -g eas-cli` e `eas login`
2. `eas init` (cria o `projectId` no `app.json`)
3. Em `eas.json`, troque `https://URL-DO-SEU-BACKEND/api` pela URL pública do back nos perfis `preview` e `production`
4. APK para testar no celular: `eas build --platform android --profile preview`
5. Loja (Android App Bundle): `eas build --platform android --profile production`

Antes do primeiro build, confira também:
- a pasta `assets/` (`icon.png`, `android-icon-*.png`, `favicon.png`) precisa existir, pois o `app.json` aponta para esses arquivos;
- o identificador `com.hcstore.mobile` (`app.json`) não pode mais ser trocado depois que o app for publicado na loja.
