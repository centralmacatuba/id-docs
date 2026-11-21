import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "pt-BR",
  title: "Central Macatuba - ID",
  description: "Documentação pública para integrar aplicações ao serviço de identidade Central Macatuba - ID.",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Central Macatuba - ID",
    nav: [
      { text: "Início", link: "/" },
      { text: "Primeiros passos", link: "/getting-started/" },
      { text: "Protocolos", link: "/protocols/openid-connect" },
      { text: "Referência", link: "/reference/discovery" },
      { text: "Segurança", link: "/security" }
    ],
    sidebar: [
      {
        text: "Comece aqui",
        items: [
          { text: "Visão geral", link: "/getting-started/" },
          { text: "Registrar uma aplicação", link: "/getting-started/register-application" }
        ]
      },
      {
        text: "Protocolos",
        items: [
          { text: "OpenID Connect", link: "/protocols/openid-connect" },
          { text: "OAuth 2.0", link: "/protocols/oauth2" }
        ]
      },
      {
        text: "Referência técnica",
        items: [
          { text: "Descoberta e endpoints", link: "/reference/discovery" },
          { text: "Scopes", link: "/reference/scopes" }
        ]
      },
      {
        text: "Operação",
        items: [
          { text: "Segurança", link: "/security" },
          { text: "Estado do serviço", link: "/status" },
          { text: "Perguntas frequentes", link: "/faq" },
          { text: "Histórico", link: "/changelog" }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/centralmacatuba/id-docs" }
    ],
    footer: {
      message: "Projeto independente e gratuito, sem vínculo com a Prefeitura Municipal de Macatuba.",
      copyright: "Central Macatuba · Central Macatuba - ID"
    },
    search: {
      provider: "local"
    },
    editLink: {
      pattern: "https://github.com/centralmacatuba/id-docs/edit/principal/docs/:path",
      text: "Editar esta página no GitHub"
    }
  }
});
