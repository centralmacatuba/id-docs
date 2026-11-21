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

## Publicação pelo GitHub Pages

O workflow `.github/workflows/deploy-pages.yml`:
1. Instala Node.js 22 e pnpm 12.12.1.
2. Instala as dependências.
3. Compila o site com VitePress.
4. Publica o artefato no GitHub Pages somente quando a branch `principal` recebe alterações.

Branches `feat/**` e pull requests executam a etapa de build para validar o conteúdo, mas não publicam o site.

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

Esta branch inicializa a documentação, a configuração VitePress e o workflow de publicação. Antes de integrar à branch principal, gere e versione `pnpm-lock.yaml` com pnpm 12.12.1, execute build local e valide a publicação de teste no GitHub Pages. O workflow está configurado para instalar sem lockfile enquanto o primeiro lockfile ainda não foi gerado; depois de versioná-lo, altere a instalação para `pnpm install --frozen-lockfile`.
