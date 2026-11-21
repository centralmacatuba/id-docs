# Node.js e aplicações com backend

Para aplicações Node.js, use uma biblioteca OIDC mantida e mantenha o fluxo OAuth no backend sempre que possível. O exemplo utiliza `openid-client` v6 e corresponde a um cliente público com método `none`; aplicações registradas com `private_key_jwt` precisam de configuração própria de autenticação do cliente.

## Instalação

```sh
pnpm add openid-client
```

## Configuração e descoberta

```js
import * as oidc from "openid-client";

const issuer = new URL("https://id.centralmacatuba.qzz.io");
const clientId = process.env.CM_ID_CLIENT_ID;
const redirectUri = "https://app.example.com/auth/callback";

const config = await oidc.discovery(
  issuer,
  clientId,
  undefined,
  oidc.None(),
);

// Habilita a verificação adicional da assinatura dos JWTs processados.
// Requer que o issuer publique um jwks_uri compatível.
oidc.enableNonRepudiationChecks(config);
```

Mantenha `clientId` e demais configurações no ambiente do servidor. O exemplo não inclui credenciais confidenciais.

## Iniciar a autenticação

```js
const codeVerifier = oidc.randomPKCECodeVerifier();
const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);
const state = oidc.randomState();
const nonce = oidc.randomNonce();

// Implemente estas funções com o armazenamento de sessão do seu framework.
// Os valores devem ser vinculados à sessão e consumidos uma única vez.
await saveTransactionToSession({ codeVerifier, state, nonce, redirectUri });

const authorizationUrl = oidc.buildAuthorizationUrl(config, {
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "openid profile email",
  code_challenge: codeChallenge,
  code_challenge_method: "S256",
  state,
  nonce,
});

// Responda com um redirecionamento HTTP para authorizationUrl.href.
```

## Processar o callback

```js
// Use a origem e o caminho do Redirect URI registrado; nunca confie no Host.
const callbackUrl = new URL(redirectUri);
if (callbackUrl.search) {
  throw new Error("Registre o Redirect URI sem query string.");
}

// Em http.Server, request.url normalmente contém apenas caminho e query.
// A origem fixa impede que o cabeçalho Host controle o endereço usado.
const incomingCallbackUrl = new URL(request.url, callbackUrl.origin);
if (
  incomingCallbackUrl.origin !== callbackUrl.origin ||
  incomingCallbackUrl.pathname !== callbackUrl.pathname
) {
  throw new Error("Callback recebido em um endereço inesperado.");
}
callbackUrl.search = incomingCallbackUrl.search;

// Só consuma a transação após validar o endereço do callback.
const transaction = await consumeTransactionFromSession();

const tokens = await oidc.authorizationCodeGrant(
  config,
  callbackUrl,
  {
    pkceCodeVerifier: transaction.codeVerifier,
    expectedState: transaction.state,
    expectedNonce: transaction.nonce,
    idTokenExpected: true,
  },
);

const claims = tokens.claims();
// Crie uma sessão local após a validação bem-sucedida.
```

As funções de sessão e o objeto `request` são abstrações: conecte-os ao framework utilizado. Não aceite parâmetros de sessão enviados pelo navegador sem integridade e vinculação à sessão original. Registre o Redirect URI sem query string: `openid-client` deriva o parâmetro `redirect_uri` da URL de callback removendo sua query, que contém os parâmetros de resposta OAuth.

A verificação de assinatura habilitada com `enableNonRepudiationChecks` é uma camada adicional de não repúdio; a biblioteca também autentica a comunicação direta com o endpoint de token por TLS. Mantenha o `jwks_uri` publicado pelo issuer acessível e atualizado.

## Requisitos para produção

- Proteja a sessão com cookie `HttpOnly`, `Secure` e `SameSite` adequado.
- Consuma a transação de autenticação uma única vez.
- Não registre códigos, tokens, cookies ou valores PKCE.
- Valide o ID Token pela biblioteca; não confie em JWT apenas decodificado.
- Use `private_key_jwt` apenas em backend e mantenha a chave privada fora do repositório.
- Consulte [erros e diagnóstico](/reference/errors) para tratar falhas.

Consulte também o [guia OAuth 2.0](/protocols/oauth2) e a [documentação oficial do openid-client](https://github.com/panva/openid-client).
