# Erros e diagnóstico

Esta página reúne erros padronizados comuns em OAuth 2.0 e OpenID Connect. A resposta depende do endpoint e do contexto: erros no endpoint de autorização normalmente retornam ao Redirect URI como parâmetros de erro quando isso é seguro; erros no endpoint de token são apresentados como objeto JSON OAuth. Não presuma um formato único para todos os endpoints.

## Erros OAuth comuns

| Código | Significado | O que verificar |
| --- | --- | --- |
| `invalid_request` | Parâmetro ausente, duplicado ou inválido. | `client_id`, `redirect_uri`, `response_type`, `scope`, `state` e parâmetros PKCE. |
| `invalid_client` | Falha na autenticação do cliente. | Método registrado, assinatura e JWKS público para `private_key_jwt`. |
| `invalid_grant` | Concessão ou código inválido, expirado, reutilizado ou incompatível. | Código de autorização, Redirect URI e `code_verifier`; códigos são de uso único. |
| `unauthorized_client` | Cliente não autorizado a utilizar o fluxo solicitado. | Tipo de cliente, grant type e configuração aprovada. |
| `unsupported_grant_type` | Grant type não suportado. | Utilize o fluxo documentado e anunciado pelo issuer. |
| `invalid_scope` | Scope solicitado inválido ou não concedido. | Scopes registrados e consentidos para o cliente. |
| `access_denied` | Titular ou servidor recusou a autorização. | Consentimento, estado da conta e decisão do usuário. |
| `server_error` | Erro inesperado no servidor de autorização. | Tente novamente com segurança e consulte o estado operacional. |
| `temporarily_unavailable` | Serviço temporariamente indisponível. | Aguarde e repita com backoff; não crie loops de redirecionamento. |

A lista é uma referência de interoperabilidade, não uma garantia de que todos os códigos serão emitidos em cada situação pelo CM ID.

## Diagnóstico por etapa

### Descoberta

- Confirme que o issuer corresponde exatamente ao esperado.
- Verifique se os documentos de descoberta respondem com HTTP bem-sucedido e JSON válido.
- Obtenha endpoints a partir dos metadados; não os deduza por convenção.
- Confirme que todas as URLs de endpoint utilizam HTTPS.

### Redirecionamento de autorização

- Confira se o Redirect URI corresponde exatamente ao registrado.
- Confirme `response_type=code`.
- Inclua `scope=openid` para autenticação OIDC.
- Gere um `state` novo e imprevisível para cada tentativa.
- Utilize PKCE com `code_challenge_method=S256`.

### Troca do código

- Envie o código apenas uma vez.
- Utilize o mesmo Redirect URI da solicitação de autorização.
- Envie o `code_verifier` associado à transação original.
- Para `private_key_jwt`, confirme o relógio do servidor, o `kid`, o algoritmo e a chave pública cadastrada.

### Validação do ID Token

- Utilize uma biblioteca OIDC mantida.
- Valide assinatura, issuer, audience, expiração, nonce e demais requisitos aplicáveis.
- Não confie em claims apenas porque o JWT foi decodificado.
- Trate claims opcionais como ausentes; consulte `claims_supported` e a resposta recebida.

## Registro seguro para depuração

Registre o horário, o endpoint lógico, o identificador de correlação disponível e o código de erro. Nunca registre códigos de autorização, access tokens, refresh tokens, ID Tokens completos, cookies, chaves privadas ou dados pessoais desnecessários.

Se o problema persistir, confirme primeiro a configuração e o estado do serviço. Ao solicitar suporte, forneça uma descrição mínima e sanitizada do fluxo, sem credenciais ou tokens.
