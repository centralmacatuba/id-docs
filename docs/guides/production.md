# Preparação para produção

Este checklist ajuda a revisar uma integração antes de disponibilizá-la a usuários. A aprovação do cadastro ou a existência desta documentação não representa homologação automática do serviço nem da aplicação cliente.

## 1. Cadastro e ambientes

- [ ] A solicitação da aplicação foi aprovada e provisionada.
- [ ] O Client ID utilizado corresponde ao ambiente correto.
- [ ] Desenvolvimento, staging e produção usam registros e callbacks separados quando necessário.
- [ ] Redirect URIs e Post-Logout Redirect URIs são mínimos, HTTPS e exatos.
- [ ] Nome, finalidade, contato técnico e URLs de privacidade estão atualizados.

## 2. Fluxo e protocolo

- [ ] A aplicação utiliza Authorization Code.
- [ ] PKCE S256 está habilitado para clientes públicos.
- [ ] `state` é aleatório, vinculado à sessão e validado no callback.
- [ ] `nonce` é aleatório, vinculado à transação e validado no ID Token OIDC.
- [ ] O código de autorização é consumido uma única vez.
- [ ] Os endpoints são obtidos por descoberta e o issuer é validado.
- [ ] O ID Token é validado por uma biblioteca OIDC mantida.
- [ ] A aplicação não utiliza implicit grant nem Resource Owner Password Credentials.

## 3. Segredos, tokens e sessão

- [ ] Chaves privadas de `private_key_jwt` ficam em secret manager ou armazenamento equivalente.
- [ ] JWKS publicado contém somente chaves públicas.
- [ ] Tokens não são gravados em logs, URLs, analytics ou ferramentas de erro.
- [ ] Tokens são mantidos no backend sempre que a arquitetura permitir.
- [ ] Cookies de sessão usam `HttpOnly`, `Secure` e política `SameSite` adequada.
- [ ] Sessões têm expiração, rotação e encerramento controlados.
- [ ] Refresh tokens são armazenados com proteção equivalente a credenciais de alto valor e descartados quando a autorização termina.

## 4. Privacidade e consentimento

- [ ] O usuário recebe explicação clara sobre dados e permissões solicitados.
- [ ] A aplicação solicita somente scopes necessários.
- [ ] Termos e Política de Privacidade aplicáveis foram aceitos pelo titular quando exigido pelo serviço.
- [ ] Claims opcionais são tratadas como ausentes quando não fornecidas.
- [ ] A aplicação define retenção, exclusão e atendimento a solicitações dos titulares.

## 5. Operação e resiliência

- [ ] Timeouts e tratamento de indisponibilidade estão implementados.
- [ ] Retentativas usam backoff e não repetem operações não idempotentes.
- [ ] Erros OAuth são tratados sem expor detalhes internos ao usuário.
- [ ] Relógios dos servidores estão sincronizados.
- [ ] Logs têm acesso restrito e minimização de dados.
- [ ] Há monitoramento de falhas de descoberta, callbacks e troca de tokens.
- [ ] Dependências são atualizadas e verificadas continuamente.

## 6. Testes antes da liberação

- [ ] Login concluído com sucesso.
- [ ] Cancelamento/recusa de consentimento tratados.
- [ ] `state` incorreto ou ausente rejeitado.
- [ ] `nonce` incorreto rejeitado.
- [ ] Código expirado ou reutilizado rejeitado.
- [ ] Redirect URI divergente rejeitado.
- [ ] Falha de descoberta e indisponibilidade tratadas.
- [ ] Revogação e encerramento de sessão testados conforme as capacidades disponíveis.

## Liberação

Não promova a integração apenas porque o build passou. Confirme o ambiente, a aprovação do cliente, a disponibilidade do issuer, os requisitos jurídicos e a validação operacional antes de habilitar usuários reais.
