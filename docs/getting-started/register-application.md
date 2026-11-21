# Registrar uma aplicação

O registro é feito pelo titular da conta no portal de desenvolvedores do CM ID:

**[Abrir portal de aplicações](https://id.centralmacatuba.qzz.io/conta/aplicacoes/desenvolvedor)**

É necessário entrar na conta e confirmar o endereço de e-mail antes de enviar uma solicitação. O portal permite acompanhar a revisão e consultar o Client ID depois do provisionamento.

## Informações solicitadas

| Campo | Requisito |
| --- | --- |
| Nome | Obrigatório; entre 3 e 100 caracteres. |
| Descrição | Obrigatória; até 1.000 caracteres. |
| Finalidade | Obrigatória; entre 20 e 2.000 caracteres. |
| Tipo | `web`, `spa`, `native` ou `desktop`. |
| Ambiente | `development`, `staging` ou `production`. |
| Website | Opcional; URL HTTPS válida. |
| Logo | Opcional; URL HTTPS válida. |
| Privacidade e termos | URLs opcionais para as políticas aplicáveis. |
| Contato técnico | Obrigatório; endereço de e-mail válido. |
| Redirect URIs | Pelo menos uma URL HTTPS. |
| Post-Logout Redirect URIs | Opcional; até 10 URLs HTTPS. |
| Scopes | Entre um e quatro scopes distintos, incluindo `openid`. |
| Método de autenticação | `none` ou `private_key_jwt`. |
| JWKS | Obrigatório para `private_key_jwt`; não envie para `none`. |

## Tipos de aplicação

| Tipo | Quando selecionar |
| --- | --- |
| `web` | Aplicação web executada em servidor ou com backend próprio. |
| `spa` | Aplicação de página única executada no navegador. |
| `native` | Aplicativo nativo para dispositivos móveis. |
| `desktop` | Aplicação instalada em computadores. |

O tipo `web` e `spa` é tratado como cliente web no registro OAuth. `native` e `desktop` são tratados como clientes nativos.

O ambiente identifica onde a aplicação será utilizada: `development`, `staging` ou `production`. Registre callbacks específicos para cada ambiente necessário.

## Regras para URLs

As URLs de website, logo, privacidade, termos, redirect e post-logout devem obedecer às validações do portal:

- Utilize HTTPS.
- Não utilize curingas (`*`).
- Não inclua usuário, senha ou fragmento.
- Não informe portas explícitas.
- Não utilize endereços IP, `localhost`, subdomínios `.localhost`, domínios `.local` ou `.internal`.
- Cada lista de redirect e post-logout aceita até 10 URLs distintas.
- Redirect URIs devem corresponder exatamente aos valores enviados pelo cliente durante a autorização.

Não use uma URL genérica para cobrir vários ambientes. Registre cada callback necessário de forma explícita.

## Scopes disponíveis no portal

| Scope | Finalidade |
| --- | --- |
| `openid` | Obrigatório para uma solicitação OpenID Connect. |
| `profile` | Solicita claims de perfil disponibilizadas pelo serviço. |
| `email` | Solicita claims relacionadas ao endereço de e-mail. |
| `offline_access` | Solicita a possibilidade de obter refresh tokens, sujeita às políticas aplicáveis. |

O scope `openid` é obrigatório. O portal aceita de um a quatro scopes distintos por solicitação. A lista de scopes efetivamente anunciada pelo issuer pode incluir capacidades adicionais que não estão disponíveis no formulário de registro de aplicações; consulte sempre os metadados de descoberta e não solicite permissões que o portal não oferece.

## Métodos de autenticação do cliente

### `none`

Para clientes públicos que não conseguem manter uma credencial confidencial, como SPAs e aplicativos instalados. Utilize Authorization Code com PKCE S256.

### `private_key_jwt`

Autentica o cliente por uma asserção assinada com uma chave privada mantida pelo desenvolvedor. O cadastro recebe somente o JWKS público; nunca envie a chave privada.

O portal valida o JWKS e aceita de uma a cinco chaves públicas com `kid` obrigatório e único. São aceitos tipos de chave EC, OKP/Ed25519 e RSA (com módulo de pelo menos 2048 bits). Material privado é rejeitado.

A seleção do método deve corresponder à arquitetura real do cliente. Não tente embutir um segredo estático em uma SPA ou aplicativo distribuído.

## Revisão e provisionamento

A solicitação passa por revisão. Os estados apresentados pelo fluxo incluem:

- **Pendente (`pending`):** solicitação recebida.
- **Em análise (`under_review`):** revisão iniciada.
- **Ajustes solicitados (`changes_requested`):** o titular precisa corrigir informações.
- **Aprovada (`approved`):** solicitação aprovada; ainda não significa que o cliente OAuth foi criado.
- **Provisionando (`provisioning`):** cliente em processo de criação.
- **Provisionada (`provisioned`):** cliente criado e Client ID associado à solicitação.
- **Rejeitada (`rejected`):** solicitação não aprovada.
- **Cancelada (`cancelled`):** solicitação cancelada antes do provisionamento.
- **Revogação solicitada (`revocation_requested`):** o titular pediu a retirada de uma aplicação provisionada.
- **Revogada (`revoked`):** cliente desativado e credenciais/tokens/concessões associados invalidados pelo fluxo de revogação.

A aprovação não equivale ao provisionamento. O Client ID só fica associado à solicitação após a criação e a confirmação do cliente.

## Limites de solicitações

O portal aplica atualmente:

- Até cinco novas solicitações por conta em uma janela de 24 horas.
- Até cinco solicitações pendentes simultaneamente.

Esses limites são controles operacionais e podem mudar. Ao atingir um limite, aguarde a liberação de uma solicitação ou o término da janela aplicável.

## Cancelamento e revogação

O titular pode cancelar solicitações ainda não provisionadas enquanto estiverem em estados permitidos pelo serviço. Para uma aplicação provisionada, o titular pode solicitar revogação. A revogação efetivada desativa o cliente e revoga os access tokens, refresh tokens e consentimentos associados.

## Boas práticas

- Mantenha os Redirect URIs mínimos e específicos.
- Separe callbacks de desenvolvimento, staging e produção.
- Proteja a chave privada de `private_key_jwt` em um cofre seguro.
- Publique apenas chaves públicas no JWKS.
- Solicite somente os scopes necessários.
- Mantenha contatos técnicos e URLs de privacidade atualizados.
- Nunca publique tokens, chaves privadas ou credenciais em issues, repositórios ou mensagens.
