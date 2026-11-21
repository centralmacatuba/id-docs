# Histórico da documentação

## Não lançado

- Guia de diagnóstico para erros OAuth e OIDC.
- Guias de integração para Node.js/backend, SPA e aplicativos nativos/desktop.
- Checklist de preparação para produção e política de versionamento documental.
- Política de segurança com instruções para reporte privado de vulnerabilidades.
- Verificação automatizada de sintaxe de exemplos JavaScript e testes de PKCE S256.
- Verificador de links locais com parser compartilhado de cercas CommonMark, links inline e links de referência completos, colapsados, abreviados e com espaços, além de testes para destinos existentes, ausentes e equivalência entre URLs `.html` e páginas Markdown.
- Exemplos OAuth atualizados para associar e consumir cada transação pelo `state`, rejeitando valores ausentes, duplicados ou incompatíveis sem trocar o código.
- Referência OIDC ampliada para descoberta de claims e logout condicionado às capacidades publicadas pelo issuer.
- Orientação de segurança com procedimento seguro para solicitar um canal privado de reporte sem divulgar detalhes em público.
- Cobertura automatizada para validação de exemplos, metadados OIDC/OAuth, callbacks OAuth e URLs canônicas do VitePress.
- URLs canônicas específicas por página e histórico Git completo para datas de atualização do VitePress.
- Auditoria de segurança dos workflows com zizmor e revisão de português brasileiro com LanguageTool.
- Sincronização automática do lockfile em alterações de dependências nas branches de trabalho.
- Proteção contra persistência desnecessária de credenciais nos checkouts dos workflows.
- Verificação mensal dos metadados públicos do issuer.
- Atualização do Vite transitivo para a versão corrigida 6.4.6, fixada em `pnpm-workspace.yaml`, com lockfile regenerado e validado em modo frozen.

## 0.1.0 — início da documentação pública

- Estrutura inicial com VitePress.
- Configuração de publicação pelo GitHub Pages.
- Primeiros guias de registro de aplicações, OpenID Connect, OAuth, descoberta, scopes e segurança.
- Conteúdo limitado às capacidades identificadas na implementação do CM ID.
