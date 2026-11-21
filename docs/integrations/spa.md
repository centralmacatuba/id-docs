# Single-page applications (SPA)

Uma SPA é um cliente público: o código e os parâmetros enviados ao navegador podem ser inspecionados pelo usuário. Portanto, ela não pode proteger um client secret nem uma chave privada.

## Arquitetura preferida: Backend for Frontend

Sempre que possível, utilize um backend intermediário (BFF):

1. O navegador inicia o login no backend da aplicação.
2. O backend inicia Authorization Code com PKCE e armazena a transação em sessão.
3. O backend processa o callback e valida a resposta OIDC.
4. O navegador recebe apenas um cookie de sessão protegido.
5. Chamadas da SPA aos recursos da aplicação são mediadas pelo backend.

Essa arquitetura reduz a exposição de tokens ao JavaScript executado no navegador.

## Cliente público executado no navegador

Se a aplicação realmente precisar falar diretamente com o issuer:

- Registre-a como `spa` com método `none`.
- Utilize Authorization Code com PKCE S256.
- Gere `state`, `nonce` e `code_verifier` novos para cada tentativa.
- Armazene a transação em armazenamento temporário protegido contra acesso de outras sessões e consuma-a uma única vez.
- Nunca inclua client secret ou chave privada.
- Valide issuer, audience, assinatura, expiração, nonce e demais requisitos do ID Token por meio de biblioteca OIDC apropriada ao navegador.

Antes de implementar a troca de código diretamente no navegador, confirme que os endpoints do issuer permitem as requisições cross-origin necessárias (CORS) e que esse modelo é suportado. Não presuma que CORS está habilitado apenas porque a descoberta funciona. Se não houver suporte, use BFF.

## Armazenamento

Evite guardar access tokens e refresh tokens em `localStorage`. Scripts executados na mesma origem podem lê-los. Prefira BFF com cookie `HttpOnly`; se a arquitetura exigir tokens no navegador, avalie cuidadosamente a exposição a XSS, minimize a duração e siga as recomendações da biblioteca escolhida.

## Checklist

- [ ] Cliente público com método `none`.
- [ ] PKCE S256 obrigatório.
- [ ] Nenhum segredo incluído no bundle.
- [ ] Redirect URI HTTPS exato e registrado.
- [ ] `state` e `nonce` validados.
- [ ] Suporte CORS confirmado antes de trocar códigos no navegador.
- [ ] Estratégia contra XSS e roubo de tokens revisada.
