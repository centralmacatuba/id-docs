# Versionamento da documentação

A documentação acompanha o comportamento público efetivamente suportado pelo CM ID. Ela não deve prometer compatibilidade com capacidades futuras nem manter exemplos que contradigam os metadados publicados.

## Política atual

- A versão principal publicada descreve a versão vigente do serviço.
- Mudanças relevantes são registradas em [Histórico](/changelog).
- Mudanças incompatíveis devem ser destacadas com data, impacto, migração necessária e período de transição quando conhecido.
- Exemplos de endpoints e capacidades dinâmicas devem orientar o leitor a usar a descoberta do issuer.
- Não serão criadas versões paralelas da documentação até existir uma política real de suporte simultâneo a versões do serviço.
- Uma versão arquivada só deve ser publicada quando houver consumidores que precisem consultar contratos antigos e uma fonte confiável que identifique o comportamento daquela versão.

## Quando atualizar

Atualize a documentação quando houver alteração em:

- endpoints, issuer ou metadados;
- scopes, claims ou consentimento;
- cadastro, autenticação de clientes ou ciclo de aprovação;
- fluxos OAuth/OIDC, tokens ou revogação;
- requisitos de segurança ou limites operacionais.

## Revisão

Toda mudança técnica deve ser conferida com a implementação pública e os metadados efetivos. Se a capacidade não puder ser confirmada, descreva a incerteza em vez de apresentá-la como garantida.
