# Histórico da documentação

Este histórico registra as mudanças relevantes da documentação pública do Central Macatuba - ID. A versão documental não representa, por si só, a versão ou o estado de homologação do serviço de identidade.

## 0.1.0 — documentação pública (21/11/2026)

Primeira versão publicada da documentação para desenvolvedores e integradores.

### Conteúdo e guias

- Estrutura inicial com VitePress e publicação pelo GitHub Pages.
- Guias de diagnóstico para erros OAuth e OIDC.
- Guias de integração para Node.js/backend, SPA e aplicativos nativos/desktop.
- Orientações para registro de aplicações, OpenID Connect, OAuth, descoberta, scopes e segurança.
- Checklist de preparação para produção e política de versionamento documental.
- Política de segurança com instruções para reporte privado de vulnerabilidades.
- Referência OIDC ampliada para descoberta de claims e logout condicionado às capacidades publicadas pelo issuer.
- Orientação para solicitar um canal privado de reporte de vulnerabilidades sem divulgar detalhes em público.

### Exemplos, referências e validação

- Exemplos OAuth atualizados para associar e consumir cada transação pelo `state`, rejeitando valores ausentes, duplicados ou incompatíveis sem trocar o código.
- Verificação automatizada da sintaxe dos exemplos JavaScript e testes de PKCE S256.
- Verificador de links locais com parser compartilhado de cercas CommonMark, links inline e links de referência completos, colapsados, abreviados e com espaços.
- Testes para destinos existentes e ausentes, além da equivalência entre URLs `.html` e páginas Markdown.
- Cobertura automatizada para validação de exemplos, metadados OIDC/OAuth, callbacks OAuth e URLs canônicas do VitePress.
- URLs canônicas específicas por página e histórico Git completo para datas de atualização do VitePress.

### Automação e manutenção

- Auditoria de segurança dos workflows com zizmor e revisão de português brasileiro com LanguageTool.
- Sincronização automática do lockfile em alterações de dependências nas branches de trabalho.
- Proteção contra persistência desnecessária de credenciais nos checkouts dos workflows.
- Verificação mensal dos metadados públicos do issuer.
- Atualização do Vite transitivo para a versão corrigida 6.4.6, fixada em `pnpm-workspace.yaml`, com lockfile regenerado e validado em modo frozen.

## Não lançado

Ainda não há mudanças adicionais documentadas para uma próxima versão.
