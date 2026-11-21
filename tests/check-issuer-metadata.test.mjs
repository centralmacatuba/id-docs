import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const checker = fileURLToPath(new URL("../scripts/check-issuer-metadata.mjs", import.meta.url));
const issuer = "https://issuer.example.test";
const discoveryUrl = `${issuer}/.well-known/openid-configuration`;
const oauthUrl = `${issuer}/.well-known/oauth-authorization-server`;
const common = {
  issuer,
  authorization_endpoint: `${issuer}/authorize`,
  token_endpoint: `${issuer}/token`,
};
const discovery = {
  ...common,
  jwks_uri: `${issuer}/jwks`,
  code_challenge_methods_supported: ["plain", "S256"],
};

function json(metadata) {
  return { body: JSON.stringify(metadata), status: 200 };
}

function runChecker({ oidc = json(discovery), oauth = json(common), origin = `${issuer}/` } = {}) {
  const responses = { [discoveryUrl]: oidc, [oauthUrl]: oauth };
  // Preload the fetch fixture in the child so the CLI runs without network access.
  const preload = `
    const responses = ${JSON.stringify(responses)};
    globalThis.fetch = async (url) => {
      const href = String(url);
      if (!Object.hasOwn(responses, href)) throw new Error('Unexpected fetch: ' + href);
      const { body, status } = responses[href];
      return new Response(body, { status });
    };
  `;
  const result = spawnSync(process.execPath, [
    `--import=data:text/javascript,${encodeURIComponent(preload)}`,
    checker,
  ], {
    encoding: "utf8",
    env: { ...process.env, CM_ID_ISSUER: origin },
  });
  assert.ifError(result.error);
  return result;
}

test("aceita metadados válidos e normaliza a barra final do issuer", () => {
  const result = runChecker();

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.stdout.trim().split("\n"), [
    `OK — OpenID Connect Discovery: ${discoveryUrl}`,
    `OK — OAuth Authorization Server Metadata: ${oauthUrl}`,
  ]);
  assert.equal(result.stderr, "");
});

for (const [name, overrides, diagnostic] of [
  ["sem JWKS", { jwks_uri: undefined }, /Campo obrigatório ausente ou inválido: jwks_uri/],
  ["com endpoint vazio", { token_endpoint: "" }, /Campo obrigatório ausente ou inválido: token_endpoint/],
  ["com endpoint numérico", { authorization_endpoint: 42 }, /Campo obrigatório ausente ou inválido: authorization_endpoint/],
  ["com outro issuer", { issuer: "https://other.example.test" }, /Issuer inesperado/],
  ["com endpoint opcional sem HTTPS", { userinfo_endpoint: "http://issuer.example.test/userinfo" }, /userinfo_endpoint não utiliza HTTPS/],
  ["sem suporte a S256", { code_challenge_methods_supported: ["plain"] }, /não anunciam PKCE S256/],
]) {
  test(`rejeita descoberta OIDC ${name} e ainda verifica OAuth`, () => {
    const result = runChecker({ oidc: json({ ...discovery, ...overrides }) });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /FALHA — OpenID Connect Discovery:/);
    assert.match(result.stderr, diagnostic);
    assert.equal(result.stdout.trim(), `OK — OAuth Authorization Server Metadata: ${oauthUrl}`);
  });
}

test("relata falhas HTTP e respostas que não são JSON", () => {
  const result = runChecker({
    oidc: { body: "unavailable", status: 503 },
    oauth: { body: "<html>unexpected response</html>", status: 200 },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /FALHA — OpenID Connect Discovery: HTTP 503/);
  assert.match(result.stderr, /FALHA — OAuth Authorization Server Metadata:/);
  assert.equal(result.stdout, "");
});

test("rejeita um issuer sem HTTPS", () => {
  const result = runChecker({ origin: "http://issuer.example.test" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /O issuer deve utilizar HTTPS/);
  assert.equal(result.stdout, "");
});
