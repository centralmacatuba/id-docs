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
- O `pnpm-lock.yaml` já é versionado. O workflow de Pages utiliza `pnpm install --frozen-lockfile`; não use `--no-frozen-lockfile` na CI.
- Se `package.json` ou as dependências mudarem, execute o workflow manual em uma branch de trabalho para sincronizar o lockfile. Revise o diff e confirme que o build frozen passa antes de integrar.

O Dependabot está configurado em `.github/dependabot.yml` para verificar semanalmente as dependências pnpm e as GitHub Actions, abrindo PRs de atualização com os rótulos correspondentes.

## Publicação pelo GitHub Pages

### Configuração necessária no GitHub

No repositório, abra **Settings → Pages** e selecione **GitHub Actions** como Build and deployment. O workflow precisa das permissões Pages e OIDC definidas no próprio job de deploy.

### DNS do domínio personalizado

Como o site usa um workflow personalizado do GitHub Actions, o arquivo `CNAME` não configura o domínio e é ignorado pelo Pages. Configure primeiro o domínio personalizado em **Settings → Pages → Custom domain** e salve `docs.id.centralmacatuba.qzz.io`. Só depois configure o DNS. Para esse subdomínio, crie um registro CNAME:

- Nome: `docs.id`
- Destino: `centralmacatuba.github.io`

Se o DNS estiver no Cloudflare, mantenha o registro como **DNS only** durante a configuração e validação inicial. Verifique o domínio personalizado no GitHub antes de criar o CNAME para reduzir o risco de takeover. Depois, aguarde a validação e habilite **Enforce HTTPS** nas configurações do Pages.

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

A documentação, a configuração VitePress, os workflows de validação/publicação e sincronização do lockfile e as atualizações automatizadas de dependências estão versionados nesta branch. O build é validado em branches de trabalho e pull requests; a publicação efetiva ocorre somente a partir da branch `principal`, após configurar GitHub Pages e o domínio personalizado. A existência de um build aprovado não significa que o site já esteja publicado ou que o serviço de identidade esteja homologado para produção.
