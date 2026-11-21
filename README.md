# Central Macatuba - ID — Documentação pública

Documentação para desenvolvedores e integradores do **Central Macatuba - ID (CM ID)**, serviço de identidade digital do ecossistema Central Macatuba.

> A Central Macatuba é um projeto independente e gratuito, sem vínculo com a Prefeitura Municipal de Macatuba.

## Site

- Domínio planejado: https://docs.id.centralmacatuba.qzz.io/
- Publicação: GitHub Pages
- Gerador: VitePress
- Idioma inicial: português brasileiro

O domínio será ativado depois de configurar GitHub Pages no repositório e o registro DNS correspondente.

## Desenvolvimento local

Requisitos:
- Node.js 22 ou superior.
- pnpm 12.12.1.

Instale as dependências e inicie o servidor:

```sh
pnpm install
pnpm dev
```

Gere a versão estática:

```sh
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
├── protocols/
├── reference/
├── public/
│   ├── CNAME
│   └── logo.svg
├── index.md
├── security.md
├── status.md
├── faq.md
└── changelog.md
```

## Integração contínua e dependências

O workflow `.github/workflows/deploy-pages.yml`:
1. Instala Node.js 22 e pnpm 12.12.1.
2. Instala as dependências.
3. Compila o site com VitePress.
4. Publica o artefato no GitHub Pages somente quando a branch `principal` recebe alterações.

Branches `feat/**` e pull requests para `principal` executam a etapa de build para validar o conteúdo, mas não publicam o site. Esse build também funciona como CI do projeto; não há necessidade de um segundo workflow `ci.yml` que repita a mesma instalação e compilação.

O workflow `.github/workflows/sync-pnpm-lockfile.yml` é manual:
- Execute-o pela aba **Actions → Sync pnpm lockfile → Run workflow**, selecionando uma branch de trabalho.
- Ele usa pnpm 12.12.1 e Node.js 22, gera ou atualiza somente `pnpm-lock.yaml`, valida o modo frozen e faz commit apenas quando o arquivo muda.
- A branch `principal` é deliberadamente excluída para evitar commits diretos nela.
- Depois que o lockfile for gerado e versionado, altere a instalação do workflow de Pages para `pnpm install --frozen-lockfile`.

O Dependabot está configurado em `.github/dependabot.yml` para verificar semanalmente as dependências pnpm e as GitHub Actions, abrindo PRs de atualização com os rótulos correspondentes.

## Publicação pelo GitHub Pages

### Configuração necessária no GitHub

No repositório, abra **Settings → Pages** e selecione **GitHub Actions** como Build and deployment. O workflow precisa das permissões Pages e OIDC definidas no próprio job de deploy.

### DNS do domínio personalizado

O arquivo `docs/public/CNAME` publica o domínio personalizado no artefato:

```text
docs.id.centralmacatuba.qzz.io
```

No DNS, crie um registro CNAME:

- Nome: `docs.id`
- Destino: `centralmacatuba.github.io`

Se o DNS estiver no Cloudflare, mantenha o registro como **DNS only** durante a configuração e validação inicial do domínio personalizado. Depois, confira o status HTTPS no GitHub Pages.

## Princípios editoriais

- Documentar somente capacidades públicas efetivamente implementadas.
- Usar os metadados OIDC/OAuth publicados pelo issuer como fonte de verdade para endpoints e capacidades dinâmicas.
- Não publicar contratos administrativos internos, tokens, segredos, headers privados ou detalhes de infraestrutura.
- Não prometer disponibilidade de produção enquanto staging, segurança, requisitos jurídicos e operação não estiverem homologados.
- Atualizar a documentação quando o comportamento do serviço ou os metadados de descoberta mudarem.

## Fontes

- Repositório privado de implementação: mantido separadamente; não é referenciado em exemplos públicos.
- Issuer padrão documentado: https://id.centralmacatuba.qzz.io
- Descoberta OIDC: https://id.centralmacatuba.qzz.io/.well-known/openid-configuration
- Metadados OAuth: https://id.centralmacatuba.qzz.io/.well-known/oauth-authorization-server

## Estado do scaffold

Esta branch inicializa a documentação, a configuração VitePress, o workflow de validação/publicação, a sincronização manual do lockfile e as atualizações automatizadas de dependências. Antes de integrar à branch principal, gere e versione `pnpm-lock.yaml`, altere o workflow de Pages para instalação frozen e valide a publicação de teste no GitHub Pages.
