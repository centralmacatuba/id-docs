# OAuth 2.0

OAuth 2.0 permite que uma aplicação obtenha autorização para acessar recursos dentro dos limites concedidos pelo titular. Quando a finalidade é autenticar uma pessoa, utilize OpenID Connect sobre OAuth 2.0.

## Fluxo recomendado

Para aplicações que atuam em nome de uma pessoa, utilize **Authorization Code com PKCE S256**:

1. Descubra os metadados do issuer e obtenha o `authorization_endpoint` e o `token_endpoint`.
2. Gere um `code_verifier`, um `code_challenge` S256 e valores imprevisíveis de `state` e `nonce`.
3. Armazene os valores da transação no contexto de sessão do usuário, vinculados à tentativa de login.
4. Redirecione o navegador ao endpoint de autorização com `response_type=code`, `client_id`, `redirect_uri`, `scope`, `state`, `nonce` e os parâmetros PKCE.
5. No callback, valide e consuma a transação, incluindo `state`.
6. Troque o código no endpoint de token com o mesmo `redirect_uri` e `code_verifier`.
7. Valide o ID Token por meio de uma biblioteca OIDC confiável.

O Redirect URI enviado deve corresponder exatamente a um endereço registrado. Não reutilize `state`, `nonce` ou `code_verifier` entre tentativas. Para os exemplos com `openid-client` v6, registre um Redirect URI sem query string: a biblioteca remove os parâmetros de consulta da URL de callback ao derivar o `redirect_uri` enviado na troca do código.

## Exemplo JavaScript com openid-client

O exemplo abaixo ilustra um cliente público registrado com o método de autenticação `none`. A persistência da transação deve ser implementada no armazenamento de sessão do seu framework; as funções `saveTransactionToSession` e `consumeTransactionFromSession` representam essa camada da aplicação.

Instale a biblioteca:

```sh
pnpm add openid-client
```

Inicie a autorização no backend da aplicação:

```js
import * as oidc from "openid-client";

const issuer = "https://id.centralmacatuba.qzz.io";
const clientId = process.env.CM_ID_CLIENT_ID;
const redirectUri = "https://app.example.com/auth/callback";

const config = await oidc.discovery(
  new URL(issuer),
  clientId,
  undefined,
  oidc.None(),
);

// Verificação adicional de assinatura dos JWTs processados via JWKS.
oidc.enableNonRepudiationChecks(config);

const codeVerifier = oidc.randomPKCECodeVerifier();
const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);
const state = oidc.randomState();
const nonce = oidc.randomNonce();

await saveTransactionToSession({
  codeVerifier,
  state,
  nonce,
  redirectUri,
});

const authorizationUrl = oidc.buildAuthorizationUrl(config, {
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "openid profile email",
  code_challenge: codeChallenge,
  code_challenge_method: "S256",
  state,
  nonce,
});

// Redirecione o navegador para authorizationUrl.href.
```

No callback registrado:

```js
// A origem e o caminho vêm do Redirect URI registrado, nunca do Host.
const callbackUrl = new URL(redirectUri);
if (callbackUrl.search) {
  throw new Error("Registre o Redirect URI sem query string.");
}

const incomingCallbackUrl = new URL(request.url, callbackUrl.origin);
if (
  incomingCallbackUrl.origin !== callbackUrl.origin ||
  incomingCallbackUrl.pathname !== callbackUrl.pathname
) {
  throw new Error("Callback recebido em um endereço inesperado.");
}
callbackUrl.search = incomingCallbackUrl.search;

// Valide o callback antes de consumir a transação da sessão.
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
// Use as claims validadas pela biblioteca conforme a política da aplicação.
```

O exemplo pressupõe que os scopes solicitados foram aprovados para o cliente. O backend deve proteger a sessão, consumir a transação uma única vez e nunca registrar códigos, tokens ou valores de PKCE. Para clientes `private_key_jwt`, configure a biblioteca com esse método e mantenha a chave privada exclusivamente no backend; não reutilize a configuração `None()`.

A opção `enableNonRepudiationChecks` habilita uma verificação criptográfica adicional das assinaturas dos JWTs processados, utilizando o JWKS publicado pelo issuer. A biblioteca também autentica a comunicação direta com o endpoint de token por TLS; portanto, essa opção deve ser entendida como uma camada extra de não repúdio, não como substituta da validação de issuer, audience, expiração, nonce e demais verificações OIDC.

A API de `openid-client` pode evoluir. Consulte a documentação da versão instalada antes de atualizar a integração: [documentação oficial do openid-client](https://github.com/panva/openid-client).

## Descoberta de endpoints

Não fixe endpoints no código. Utilize os metadados OAuth Authorization Server Metadata:

```text
https://id.centralmacatuba.qzz.io/.well-known/oauth-authorization-server
```

Use os valores publicados para `authorization_endpoint`, `token_endpoint`, `jwks_uri` e demais campos relevantes. A descoberta deve validar o issuer esperado.

## Scopes

O portal de registro aceita `openid`, `profile`, `email` e `offline_access`. O scope `openid` é obrigatório para solicitações OIDC. A lista anunciada nos metadados do servidor pode incluir capacidades que não estão disponíveis no formulário de registro; não tente solicitar scopes não aprovados para o seu cliente.

## Refresh tokens

Solicite `offline_access` somente quando a aplicação realmente precisar manter uma sessão delegada entre visitas. A emissão depende das políticas aplicáveis e da concessão do usuário. Armazene refresh tokens em local protegido, aplique a política de rotação publicada pelo serviço e descarte-os ao encerrar a autorização.

## O que não fazer

- Evite implicit grant e Resource Owner Password Credentials.
- Mantenha Client IDs exclusivos para cada aplicação.
- Aceite somente Redirect URIs registrados.
- Solicite apenas os scopes necessários.
- Não trate um access token como prova de identidade do usuário; para identidade, valide o ID Token OIDC.
- Evite armazenar tokens em `localStorage` quando puder mantê-los no backend em uma sessão protegida.
