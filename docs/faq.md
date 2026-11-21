# Perguntas frequentes

## O CM ID é a Central Macatuba inteira?

Não. CM significa Central Macatuba. CM ID é o nome abreviado do serviço de identidade digital Central Macatuba - ID.

## O serviço possui vínculo com a Prefeitura de Macatuba?

Não. A Central Macatuba é um projeto independente, gratuito e sem vínculo com a Prefeitura Municipal de Macatuba.

## Como descubro os endpoints?

Consulte `/.well-known/openid-configuration` ou `/.well-known/oauth-authorization-server` no issuer. Não copie endpoints de exemplos antigos.

## Posso usar OAuth para autenticar usuários?

Para autenticação de pessoas, utilize OpenID Connect sobre OAuth 2.0. OAuth isoladamente é um protocolo de autorização.

## Posso cadastrar uma aplicação sem e-mail verificado?

Não. O portal exige que o titular tenha confirmado o e-mail da conta.

## A aprovação já fornece um Client ID?

Não necessariamente. A aprovação e o provisionamento são etapas distintas. O Client ID é associado após a criação do cliente.

## Posso usar HTTP ou curingas nos Redirect URIs?

Não. As URLs devem utilizar HTTPS, sem curingas, e corresponder exatamente ao callback registrado.

## Onde encontro os scopes?

Consulte [Scopes](/reference/scopes). A lista aceita no portal pode mudar conforme a política do serviço.

## Posso enviar uma chave privada no cadastro?

Não. Para `private_key_jwt`, cadastre somente as chaves públicas no JWKS. A chave privada permanece sob controle do desenvolvedor.
