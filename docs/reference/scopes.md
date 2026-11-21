# Scopes

Scopes representam o acesso solicitado pela aplicação. O CM ID aplica consentimento e revisão para limitar as informações solicitadas ao necessário.

## Scopes aceitos no portal de aplicações

| Scope | Finalidade |
| --- | --- |
| `openid` | Obrigatório para identificar uma solicitação OIDC. |
| `profile` | Solicita claims de perfil disponibilizadas pelo serviço. |
| `email` | Solicita claims relacionadas ao endereço de e-mail. |
| `offline_access` | Solicita a possibilidade de obter refresh tokens, sujeita às políticas aplicáveis. |

O scope `openid` é obrigatório. O portal aceita de um a quatro scopes distintos por solicitação.

## Scopes anunciados e capacidades específicas

Os metadados de descoberta podem anunciar scopes adicionais relacionados a capacidades específicas do serviço. Isso não significa que esses scopes estejam disponíveis no formulário convencional, que possam ser solicitados por qualquer cliente ou que a concessão seja automática.

Use somente scopes que tenham sido explicitamente aprovados para o Client ID e concedidos no fluxo de autorização. Em caso de diferença entre esta tabela e os metadados, considere os metadados como a descrição dinâmica do servidor e confirme a elegibilidade do cliente com a equipe responsável pelo serviço.

## Princípio do menor privilégio

- Solicite apenas os scopes necessários à funcionalidade.
- Explique a finalidade ao usuário antes do consentimento.
- Não condicione funcionalidades sem relação com identidade à concessão de dados adicionais.
- Permita que o usuário revise e revogue autorizações.
- Não interprete um scope como garantia de que todos os atributos pessoais estarão sempre preenchidos.

A lista acima descreve os scopes aceitos no registro de aplicações. Capacidades efetivas e claims devem ser verificadas nos metadados e na resposta do serviço.
