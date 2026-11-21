# Descoberta e endpoints

O CM ID publica metadados padronizados na raiz do issuer. A descoberta é a fonte de verdade para os endpoints e capacidades disponíveis.

## Issuer padrão

```text
https://id.centralmacatuba.qzz.io
```

## OpenID Connect Discovery

```text
GET /.well-known/openid-configuration
```

URL completa:

```text
https://id.centralmacatuba.qzz.io/.well-known/openid-configuration
```

## OAuth Authorization Server Metadata

```text
GET /.well-known/oauth-authorization-server
```

URL completa:

```text
https://id.centralmacatuba.qzz.io/.well-known/oauth-authorization-server
```

## Como consumir

Exemplo com JavaScript:

```js
const issuer = "https://id.centralmacatuba.qzz.io";

const response = await fetch(
  new URL("/.well-known/openid-configuration", issuer)
);

if (!response.ok) {
  throw new Error(`Falha na descoberta OIDC: ${response.status}`);
}

const metadata = await response.json();

console.log({
  issuer: metadata.issuer,
  authorizationEndpoint: metadata.authorization_endpoint,
  tokenEndpoint: metadata.token_endpoint,
  jwksUri: metadata.jwks_uri,
});
```

O exemplo apenas lê os metadados. Ele não substitui uma biblioteca OIDC para iniciar o fluxo, trocar códigos ou validar tokens.

## JWKS

O endereço do conjunto de chaves públicas deve ser obtido do campo `jwks_uri` dos metadados. Não construa o endereço manualmente nem armazene chaves públicas indefinidamente.

O endpoint administrativo de consulta de chaves não é uma API pública de integração. Clientes externos devem utilizar exclusivamente o JWKS público indicado pela descoberta.

## Regras

- Não acrescente `/api/auth` ao issuer.
- Não fixe endpoints que podem mudar.
- Valide se o issuer retornado corresponde exatamente ao issuer esperado.
- Utilize HTTPS.
- Trate falhas de descoberta como falhas de configuração, sem fallback silencioso para endpoints inventados.
