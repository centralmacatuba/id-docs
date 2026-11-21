# OpenID Connect

OpenID Connect (OIDC) é uma camada de identidade construída sobre OAuth 2.0. No CM ID, OIDC permite que uma aplicação solicite autenticação de uma pessoa e receba informações de identidade conforme os scopes concedidos.

## Descoberta

O issuer publica o documento OpenID Connect Discovery em:

```text
https://id.centralmacatuba.qzz.io/.well-known/openid-configuration
```

Leia esse documento em tempo de configuração ou utilize uma biblioteca OIDC que faça descoberta automática. Os endpoints, algoritmos e capacidades efetivamente suportados devem ser obtidos dos metadados publicados, não copiados de exemplos desatualizados.

## Fluxo recomendado

Para aplicações que autenticam uma pessoa:

1. Inicie uma sessão de autorização com o endpoint indicado em `authorization_endpoint`.
2. Utilize o fluxo Authorization Code.
3. Gere um `code_verifier` aleatório e derive o `code_challenge` com SHA-256.
4. Envie `code_challenge_method=S256`.
5. Valide o parâmetro `state` e, quando aplicável, `nonce`.
6. Troque o authorization code no endpoint indicado em `token_endpoint`, enviando o `code_verifier`.
7. Valide o ID Token com uma biblioteca OIDC confiável.

Não implemente validação criptográfica de JWT manualmente.

## Validação do ID Token

A aplicação deve validar, no mínimo, conforme OIDC Core e utilizando uma biblioteca mantida:

- A assinatura, usando as chaves públicas publicadas no JWKS indicado pelos metadados.
- `iss`, que deve corresponder exatamente ao issuer descoberto.
- `aud`, que deve conter o Client ID da aplicação.
- `exp` e as demais verificações temporais.
- `nonce`, quando enviado na solicitação.
- `azp`, quando aplicável.

A lista de chaves públicas pode mudar. Bibliotecas OIDC devem atualizar o JWKS conforme os cabeçalhos de cache e o comportamento de descoberta.

## Claims e consentimento

Consulte `claims_supported` no documento de descoberta para conhecer as claims anunciadas pelo issuer. Os scopes `profile` e `email` solicitam acesso às claims correspondentes, além do scope obrigatório `openid`; a presença de uma claim na lista de metadados não garante que ela será preenchida em todos os tokens ou para todos os usuários.

- Trate claims opcionais como ausentes quando não forem emitidas.
- Não presuma que `profile` ou `email` garantam todos os atributos possíveis.
- Solicite somente os dados necessários e explique ao usuário por que a aplicação precisa deles.
- Utilize os valores validados pela biblioteca OIDC; não confie em claims obtidas apenas pela decodificação do JWT.
- Reavalie a disponibilidade das claims quando os metadados do issuer mudarem.

## Logout

Consulte o documento de descoberta para identificar se `end_session_endpoint` está publicado. O suporte a logout iniciado pelo RP, seus parâmetros e os Redirect URIs de pós-logout dependem das capacidades anunciadas e da configuração aprovada para o cliente.

Quando disponível, utilize uma biblioteca OIDC para construir a solicitação de logout. Não presuma que `id_token_hint`, `post_logout_redirect_uri` ou outros parâmetros sejam aceitos sem confirmação nos metadados e nas instruções do serviço.

Encerrar a sessão local da aplicação não encerra necessariamente a sessão do provedor de identidade; da mesma forma, o logout no provedor não substitui a invalidação da sessão local e a limpeza segura dos tokens.

## Referências

- [Descoberta e endpoints](/reference/discovery)
- [Scopes](/reference/scopes)
- [Segurança](/security)
