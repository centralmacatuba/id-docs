# Primeiros passos

O **Central Macatuba - ID (CM ID)** é o serviço de identidade digital do ecossistema Central Macatuba. Ele permite que aplicações integradas utilizem uma identidade central para autenticar pessoas, respeitando os fluxos de autorização e o consentimento do titular.

## Antes de integrar

1. Identifique o tipo da aplicação e o ambiente em que ela será executada.
2. Leia os conceitos de [OpenID Connect](/protocols/openid-connect) e [OAuth 2.0](/protocols/oauth2).
3. Consulte os documentos de descoberta publicados pelo issuer.
4. Registre a aplicação pelo portal de desenvolvedores.
5. Implemente o fluxo Authorization Code com PKCE quando a aplicação atuar em nome de uma pessoa.
6. Teste os fluxos em ambiente de desenvolvimento antes de solicitar liberação para produção.

## Endereço do issuer

O issuer padrão do serviço é:

```text
https://id.centralmacatuba.qzz.io
```

O endereço efetivo deve ser confirmado pelo documento de descoberta OpenID Connect. Não acrescente `/api/auth` ao issuer: a descoberta é publicada na raiz do domínio.

## Tipos de aplicação aceitos no portal

| Tipo | Quando selecionar |
| --- | --- |
| `web` | Aplicação web executada em servidor ou com backend próprio. |
| `spa` | Single-page application executada no navegador. |
| `native` | Aplicativo nativo para dispositivos móveis. |
| `desktop` | Aplicação instalada em computadores. |

O portal também solicita o ambiente: `development`, `staging` ou `production`.

## Próximo passo

Acesse [Registrar uma aplicação](/getting-started/register-application) para conhecer os requisitos e enviar uma solicitação.
