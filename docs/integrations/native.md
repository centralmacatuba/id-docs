# Aplicativos nativos e desktop

Aplicativos móveis e desktop distribuídos aos usuários são clientes públicos: não conseguem manter um segredo de cliente confidencial. Não embuta client secrets ou chaves privadas nos binários.

## Fluxo recomendado

1. Registre o cliente como `native` ou `desktop`, com método `none`.
2. Utilize Authorization Code com PKCE S256.
3. Gere `state`, `nonce` e `code_verifier` novos para cada tentativa e derive o `code_challenge` S256 correspondente.
4. Armazene esses valores de forma segura, vinculados à tentativa de autenticação, para validá-los no retorno.
5. Abra a página de autorização no navegador externo do sistema, não em uma WebView incorporada, enviando o `code_challenge`, `state` e `nonce`.
6. Receba o callback somente em um Redirect URI HTTPS previamente registrado.
7. Troque o código com o `code_verifier` original.
8. Valide o ID Token por meio de uma biblioteca OIDC apropriada à plataforma.

## Redirect URI HTTPS

O portal de registro do CM ID exige URLs HTTPS e rejeita esquemas personalizados, curingas, hosts locais e portas explícitas. Portanto, não presuma que esquemas como `myapp://callback` serão aceitos.

Quando a plataforma suportar associação de links HTTPS ao aplicativo (por exemplo, Universal Links ou Android App Links), configure e valide a associação do domínio conforme a documentação do sistema operacional e registre o endereço HTTPS exato no portal. A associação do domínio ao aplicativo é responsabilidade do desenvolvedor e precisa ser testada em dispositivos reais.

Se a plataforma ou o ambiente não oferecer um mecanismo HTTPS de retorno compatível com as regras do portal, confirme previamente com o mantenedor do serviço qual fluxo é suportado; não contorne a validação com callbacks não registrados.

## Armazenamento e segurança

- Proteja tokens no armazenamento seguro do sistema operacional.
- Não grave tokens em logs, backups não protegidos ou preferências compartilhadas.
- Valide o estado da transação no retorno ao aplicativo.
- Trate cancelamento, retorno duplicado, código expirado e troca interrompida.
- Considere que o aplicativo pode ser desinstalado ou que o usuário pode revogar a autorização.
