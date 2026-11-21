# Registrar uma aplicação

O registro é feito pelo titular da conta no portal de desenvolvedores do CM ID:

**[Abrir portal de aplicações](https://id.centralmacatuba.qzz.io/conta/aplicacoes/desenvolvedor)**

O portal permite enviar solicitações, acompanhar a revisão e consultar o Client ID depois do provisionamento.

## Requisitos

- Ter uma conta CM ID.
- Confirmar o endereço de e-mail da conta.
- Informar um nome, uma descrição e uma finalidade clara para a aplicação.
- Informar um e-mail de contato técnico válido.
- Cadastrar pelo menos um Redirect URI HTTPS.
- Solicitar somente os scopes necessários.

## Informações solicitadas

| Campo | Descrição |
| --- | --- |
| Nome | Nome público da aplicação, entre 3 e 100 caracteres. |
| Descrição | Resumo da aplicação, até 1.000 caracteres. |
| Finalidade | Explicação de como a aplicação utilizará a identidade, entre 20 e 2.000 caracteres. |
| Tipo | `web`, `spa`, `native` ou `desktop`. |
| Ambiente | `development`, `staging` ou `production`. |
| Website | Site oficial da aplicação, quando disponível. |
| Logo | URL pública do logo, quando disponível. |
| Privacidade e termos | URLs das políticas aplicáveis, quando disponíveis. |
| Contato técnico | E-mail utilizado para comunicações sobre a integração. |
| Redirect URIs | URLs de retorno após a autenticação. |
| Post-Logout Redirect URIs | URLs para retorno após o encerramento da sessão. |
| Scopes | Permissões de identidade solicitadas. |
| Método de autenticação | `none` ou `private_key_jwt`. |
| JWKS | Conjunto de chaves públicas, obrigatório para `private_key_jwt`. |

## Regras para URLs

O portal valida URLs antes de aceitar a solicitação:

- Utilize HTTPS.
- Não utilize curingas (`*`).
- Não inclua usuário, senha ou fragmento na URL.
- Não informe portas explícitas.
- Não utilize endereços IP, `localhost`, domínios locais ou internos.
- Cada lista aceita até 10 URLs.
- Redirect URIs devem ser registrados exatamente como serão enviados pelo cliente durante a autorização.

Não use uma URL genérica ou ampla para cobrir vários ambientes. Registre cada callback necessário de forma explícita.

## Scopes disponíveis para aplicações

O portal atualmente aceita:

- `openid` — obrigatório para uma solicitação OIDC.
- `profile` — solicita claims de perfil disponibilizadas pelo serviço.
- `email` — solicita claims relacionadas ao endereço de e-mail.
- `offline_access` — solicita a possibilidade de obter refresh tokens, sujeita à política e ao consentimento aplicáveis.

O scope `openid` é obrigatório. A solicitação deve conter pelo menos um e no máximo quatro scopes, sem duplicatas.

## Métodos de autenticação do cliente

### `none`

Indicado para clientes públicos que não conseguem manter um segredo confidencial, como aplicações executadas no navegador ou instaladas no dispositivo do usuário. Utilize Authorization Code com PKCE.

### `private_key_jwt`

Autentica o cliente com uma asserção assinada por uma chave privada mantida pelo desenvolvedor. O portal exige um JWKS público válido. Nunca envie a chave privada: somente as chaves públicas devem ser cadastradas.

A seleção do método deve corresponder à arquitetura real do cliente. Não tente embutir um segredo estático em uma SPA ou aplicativo distribuído.

## Revisão e provisionamento

Após o envio, a solicitação passa por revisão. Os estados operacionais incluem:

- **Pendente:** solicitação recebida.
- **Em análise:** revisão iniciada.
- **Ajustes solicitados:** o titular precisa corrigir informações.
- **Aprovada:** solicitação aprovada; o provisionamento ainda pode estar pendente.
- **Provisionando:** cliente OAuth em processo de criação.
- **Provisionada:** cliente criado e associado à solicitação.
- **Rejeitada:** solicitação não aprovada.
- **Cancelada:** solicitação cancelada antes do provisionamento.
- **Revogação solicitada / revogada:** processo de retirada de uma aplicação provisionada.

A aprovação não equivale ao provisionamento. O Client ID só fica associado à solicitação após a criação do cliente pelo fluxo operacional.

## Limites atuais

O portal aplica limites de até cinco novas solicitações por conta em 24 horas e até cinco solicitações pendentes simultaneamente. Esses limites podem ser ajustados pela operação do serviço.

## Cancelamento e revogação

O titular pode cancelar solicitações ainda não provisionadas, conforme o estado permitido pelo serviço. Para uma aplicação provisionada, o titular pode solicitar revogação. A revogação operacional desativa o cliente e invalida tokens e consentimentos associados.

## Boas práticas

- Mantenha os Redirect URIs mínimos e específicos.
- Separe callbacks de desenvolvimento, staging e produção.
- Proteja a chave privada de `private_key_jwt` em um cofre seguro.
- Solicite somente os scopes necessários.
- Mantenha contatos técnicos e URLs de privacidade atualizados.
- Nunca publique tokens, chaves privadas ou credenciais em issues, repositórios ou mensagens.
