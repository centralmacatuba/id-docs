# Central Macatuba - ID — Documentação pública

Documentação para desenvolvedores e integradores do **Central Macatuba - ID (CM ID)**, serviço de identidade digital do ecossistema Central Macatuba.

> A Central Macatuba é um projeto independente e gratuito, sem vínculo com a Prefeitura Municipal de Macatuba.

## Site publicado

- **Documentação:** https://docs.id.centralmacatuba.qzz.io/
- **Hospedagem:** GitHub Pages
- **Gerador:** VitePress
- **Idioma:** português brasileiro

O site está publicado no domínio personalizado. Alterações enviadas à branch `principal` são validadas e, quando aprovadas, publicadas pelo workflow do GitHub Actions.

> **Importante:** a publicação deste site não significa que o serviço CM ID esteja homologado ou liberado para uso em produção. Consulte a [página de estado do serviço](https://docs.id.centralmacatuba.qzz.io/status) e os metadados públicos do issuer antes de integrar.

## Desenvolvimento local

Requisitos:
- Node.js 22 ou superior.
- pnpm 12.12.1.

Instale as dependências e inicie o servidor:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Gere e visualize a versão estática:

```sh
pnpm check:examples
pnpm check:links
pnpm test
pnpm build
pnpm preview
```

A saída de produção fica em `docs/.vitepress/dist`.

## Estrutura

```text
docs/
├── .vitepress/
│   └── config.mts
├── getting-started/
├── integrations/
├── protocols/
├── reference/
├── guides/
├── public/
│   └── logo.svg
├── index.md
├── security.md
├── status.md
├── faq.md
└── changelog.md
scripts/
tests/
CONTRIBUTING.md
```

## Integração contínua e dependências

O workflow `.github/workflows/deploy-pages.yml`:
1. Instala Node.js 22 e pnpm 12.12.1.
2. Instala dependências com `pnpm install --frozen-lockfile`.
3. Verifica a sintaxe dos exemplos JavaScript, os links locais e executa testes automatizados.
4. Compila o site com VitePress.
5. Publica o artefato no GitHub Pages a partir da branch `principal`.

Solicitações de alteração direcionadas a `principal` executam as etapas de validação e build, mas não publicam o site. A execução manual na branch `principal` também publica; para validar sem publicar, execute o workflow manualmente em outra branch.

O workflow `.github/workflows/check-links.yml` verifica links locais das páginas Markdown, incluindo os caminhos sem extensão usados pelo VitePress. A checagem é local e não depende da disponibilidade de sites externos.

O workflow `.github/workflows/check-issuer-metadata.yml` verifica mensalmente (e sob demanda) os documentos públicos de descoberta OIDC e OAuth. A checagem valida issuer, campos essenciais e uso de HTTPS; ela não substitui uma revisão humana de mudanças de contrato.

O workflow `.github/workflows/sync-pnpm-lockfile.yml`:
- Sincroniza automaticamente o lockfile quando as declarações de dependências mudam em branches `feat/**`.
- Também pode ser executado manualmente pela aba **Actions → Sync pnpm lockfile → Run workflow**.
- Usa pnpm 12.12.1 e Node.js 22, gera ou atualiza somente `pnpm-lock.yaml`, valida o modo frozen e faz commit apenas quando o arquivo muda.
- A branch `principal` é deliberadamente excluída para evitar commits diretos nela.

O zizmor analisa os arquivos de workflow e as configurações do GitHub Actions nas solicitações de alteração e nos envios para `principal`.

O workflow `.github/workflows/languagetool.yml` revisa a ortografia e a gramática do conteúdo em português nas solicitações de alteração, usando LanguageTool e reviewdog.

O `pnpm-lock.yaml` é versionado. O workflow de Pages utiliza instalação frozen; não use `--no-frozen-lockfile` na CI. O Vite está fixado em 6.4.6 por meio de override em `pnpm-workspace.yaml`, versão corrigida para o alerta GHSA-p4f5-76q4-ffq7 identificado na dependência transitiva do VitePress 1.x. Vue também é declarado diretamente para disponibilizar o runtime usado pelos módulos de página gerados durante a renderização do VitePress.

As atualizações semanais das dependências pnpm e das GitHub Actions são acompanhadas pelo Dependabot, configurado em `.github/dependabot.yml` com período mínimo de sete dias para atualizações.

## Domínio e publicação

O domínio personalizado `docs.id.centralmacatuba.qzz.io` já está configurado no GitHub Pages e é o endereço público oficial desta documentação. O workflow de deploy utiliza GitHub Actions; o arquivo `CNAME` não é o mecanismo de configuração do domínio nesse fluxo.

## Princípios editoriais

- Documentar somente capacidades públicas efetivamente implementadas.
- Usar os metadados OIDC/OAuth publicados pelo issuer como fonte de verdade para endpoints e capacidades dinâmicas.
- Não publicar contratos administrativos internos, tokens, segredos, headers privados ou detalhes de infraestrutura.
- Não prometer disponibilidade de produção enquanto staging, segurança, requisitos jurídicos e operação não estiverem homologados.
- Atualizar a documentação quando o comportamento do serviço ou os metadados de descoberta mudarem.

## Fontes

- Issuer padrão documentado: https://id.centralmacatuba.qzz.io
- Descoberta OIDC: https://id.centralmacatuba.qzz.io/.well-known/openid-configuration
- Metadados OAuth: https://id.centralmacatuba.qzz.io/.well-known/oauth-authorization-server

## Estado do projeto

Este repositório contém a documentação pública, a configuração VitePress, os workflows, os testes e os scripts de validação. O site de documentação está publicado no GitHub Pages em [docs.id.centralmacatuba.qzz.io](https://docs.id.centralmacatuba.qzz.io/), com atualizações publicadas a partir da branch `principal` após a validação da CI.

A publicação da documentação e a aprovação da compilação não comprovam, isoladamente, a disponibilidade, a segurança operacional ou a homologação do serviço de identidade para produção. Consulte a página de estado e os metadados de descoberta antes de realizar integrações.
