# Integrações

Escolha o guia conforme o tipo de cliente e a arquitetura da aplicação. Antes de implementar, registre a aplicação e confirme o Client ID provisionado.

## Guias disponíveis

- [Node.js e backend](./nodejs): integração de servidor com `openid-client` e sessão protegida.
- [Single-page applications](./spa): clientes públicos executados no navegador e alternativa Backend for Frontend.
- [Aplicativos nativos e desktop](./native): Authorization Code com PKCE e navegador do sistema.

## Recomendações por arquitetura

| Arquitetura | Abordagem recomendada |
| --- | --- |
| Web com backend | Backend for Frontend ou cliente confidencial com `private_key_jwt`, conforme o registro. |
| SPA | Preferir BFF; se usar cliente público direto, PKCE S256 e validar previamente o suporte CORS necessário. |
| Aplicativo nativo | Navegador externo do sistema, PKCE S256 e Redirect URI HTTPS associado ao aplicativo. |
| Desktop | Navegador externo do sistema e retorno por URI HTTPS associado ou mecanismo suportado pelo ambiente. |

Não distribua chaves privadas, client secrets ou tokens de longa duração em código de navegador, binários ou pacotes instaláveis.
