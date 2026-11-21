# Contribuindo com a documentação do CM ID

Obrigado por ajudar a melhorar a documentação pública do Central Macatuba - ID.

## Escopo

Este repositório contém documentação pública para desenvolvedores e integradores. Não inclua credenciais, tokens, dados pessoais, headers privados, endpoints administrativos ou detalhes de implementação não destinados à integração pública.

A Central Macatuba é um projeto independente e gratuito, sem vínculo com a Prefeitura Municipal de Macatuba.

## Ambiente

- Node.js 22 ou superior.
- pnpm 12.12.1.

```sh
pnpm install --frozen-lockfile
pnpm check:examples
pnpm check:links
pnpm test
pnpm build
```

O workflow de CI também verifica links locais das páginas Markdown. A checagem offline não garante a disponibilidade de sites externos.

## Conteúdo técnico

- Confirme cada afirmação com o comportamento público do serviço e os metadados de descoberta.
- Capacidades anunciadas não garantem que o portal permita registrá-las.
- Só informe disponibilidade de produção ou homologação após confirmação.
- Prefira exemplos completos, mínimos e seguros.
- Explique claramente quando uma função é pseudocódigo ou uma abstração que o integrador precisa implementar.
- Atualize o histórico e os guias relacionados quando uma mudança alterar o comportamento documentado.

## Pull requests

- Use uma descrição clara do problema e da mudança.
- Informe os arquivos e protocolos afetados.
- Inclua evidências de validação local.
- Destaque mudanças incompatíveis e passos de migração.
- Altere `pnpm-lock.yaml` somente quando puder reproduzir a sincronização com pnpm.

## Revisão automatizada

Os pull requests passam por verificações automatizadas:

- VitePress build, testes, exemplos JavaScript e links locais.
- zizmor para auditoria de segurança dos workflows e da configuração do GitHub Actions.
- LanguageTool com reviewdog para revisão de português brasileiro.
- Dependabot para atualizações de dependências e GitHub Actions.

As sugestões de estilo devem ser avaliadas no contexto técnico. Preserve nomes oficiais de protocolos, parâmetros, scopes, claims e APIs, mesmo quando uma ferramenta de linguagem sugerir traduzi-los.

## Revisão

Toda contribuição pode ser revisada quanto à precisão técnica, segurança, clareza, acessibilidade e consistência com o restante da documentação.
