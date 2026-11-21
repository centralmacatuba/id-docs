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

- Assinatura usando uma chave pública publicada pelo JWKS indicado nos metadados.
- `iss` igual ao issuer descoberto.
- `aud` contendo o Client ID da aplicação.
- `exp` e demais verificações temporais.
- `nonce`, quando enviado na solicitação.
- `azp`, quando aplicável.

A lista de chaves públicas pode mudar. Bibliotecas OIDC devem atualizar o JWKS conforme os cabeçalhos de cache e o comportamento de descoberta.

## Claims e consentimento

Os scopes `profile` e `email` solicitam acesso às claims correspondentes, além do scope obrigatório `openid`. Solicite somente os dados necessários e explique ao usuário por que a aplicação precisa deles.

## Logout

Consulte o documento de descoberta para identificar os recursos de encerramento de sessão publicados. Não presuma que todos os provedores implementam os mesmos parâmetros ou mecanismos de logout.

## Referências

- [Descoberta e endpoints](/reference/discovery)
- [Scopes](/reference/scopes)
- [Segurança](/security)
