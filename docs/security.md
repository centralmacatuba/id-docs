# Segurança

A segurança das integrações depende tanto do CM ID quanto de cada aplicação cliente.

## Requisitos básicos

- HTTPS em todos os ambientes publicados.
- Authorization Code com PKCE S256 para clientes públicos.
- Redirect URIs exatos, sem curingas.
- Validação de `state` e `nonce` quando aplicável.
- Validação de ID Tokens com biblioteca OIDC mantida.
- Armazenamento seguro de tokens e chaves privadas.
- Scopes mínimos e consentimento explícito.
- Aceite dos Termos de Uso e da Política de Privacidade vigentes na conta CM ID antes de concluir a autenticação.
- Proteção de sessão no backend, cookies seguros e prevenção de CSRF conforme o framework utilizado.
- Dependências atualizadas e monitoradas.

## Proteção de credenciais

Nunca publique:

- Client secrets ou tokens;
- Chaves privadas;
- Códigos de autorização;
- Códigos de recuperação;
- Cookies de sessão;
- Dados pessoais de usuários.

Não coloque credenciais em query strings, screenshots, issues, logs ou mensagens de suporte.

Prefira manter tokens no backend e associar o navegador a uma sessão protegida por cookie httpOnly, Secure e SameSite adequado ao fluxo. Evite armazenar access tokens ou refresh tokens em localStorage.

## Redirect URIs

Registre apenas callbacks controlados pela aplicação. O CM ID exige HTTPS e rejeita curingas, credenciais embutidas, fragmentos, portas explícitas, endereços IP e hosts locais/internos.

## Reportar um problema

Não publique detalhes exploráveis de uma vulnerabilidade em issues públicas. Utilize um canal privado de contato mantido pelo projeto e inclua apenas as informações necessárias para reproduzir e corrigir o problema.

## Privacidade

A aplicação integradora é responsável por explicar ao usuário quais dados solicita, por que os utiliza, por quanto tempo os mantém e como exercer direitos relacionados aos dados pessoais.
