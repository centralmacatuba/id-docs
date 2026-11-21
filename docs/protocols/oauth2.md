# OAuth 2.0

OAuth 2.0 permite que uma aplicação obtenha autorização para agir dentro dos limites concedidos pelo titular. Quando a finalidade é autenticar uma pessoa, utilize OpenID Connect sobre OAuth.

## Fluxo para aplicações com usuário

O fluxo recomendado é **Authorization Code com PKCE S256**.

- Utilize um Client ID registrado.
- Envie um Redirect URI idêntico ao cadastrado.
- Gere um `state` imprevisível e valide-o no retorno.
- Gere um `code_verifier` por tentativa de autorização.
- Utilize `S256` para o `code_challenge`.
- Troque o código pelo endpoint de token indicado nos metadados.
- Não coloque tokens em URLs ou logs.

Aplicações públicas não devem depender de um segredo estático que possa ser extraído do navegador ou do pacote instalado.

## Endpoints

Não fixe os endpoints no código. Leia o documento OAuth Authorization Server Metadata:

```text
https://id.centralmacatuba.qzz.io/.well-known/oauth-authorization-server
```

Utilize os valores publicados para `authorization_endpoint`, `token_endpoint`, `jwks_uri` e demais campos relevantes.

## Scopes

O portal de registro atualmente permite `openid`, `profile`, `email` e `offline_access`. O scope `openid` é obrigatório para as solicitações de aplicações deste portal.

## Refresh tokens

Solicite `offline_access` somente quando a aplicação realmente precisar manter uma sessão delegada entre visitas. Armazene refresh tokens em local protegido, aplique rotação conforme os metadados e políticas do serviço e descarte-os ao encerrar a autorização.

## O que não fazer

- Não utilize implicit grant.
- Não utilize Resource Owner Password Credentials.
- Não reutilize Client IDs entre aplicações diferentes.
- Não aceite Redirect URIs não registrados.
- Não solicite scopes apenas por conveniência.
- Não trate um access token como prova de identidade do usuário; para identidade, valide o ID Token OIDC.
