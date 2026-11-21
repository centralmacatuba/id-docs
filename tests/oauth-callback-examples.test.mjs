import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { compileFunction } from "node:vm";

const redirectUri = "https://app.example.test/auth/callback";
const transaction = { codeVerifier: "verifier", state: "saved-state", nonce: "saved-nonce" };

for (const page of ["integrations/nodejs.md", "protocols/oauth2.md"]) {
  test(`${page}: valida o callback antes de consumir a sessão e trocar o código`, async (t) => {
    const markdown = await readFile(new URL(`../docs/${page}`, import.meta.url), "utf8");
    const blocks = [...markdown.matchAll(/^```js\r?\n([\s\S]*?)^```/gm)]
      .map((match) => match[1])
      .filter((source) => source.includes("oidc.authorizationCodeGrant("));
    assert.equal(blocks.length, 1, "deve haver um exemplo de callback na página");

    const runCallback = compileFunction(`return (async () => {\n${blocks[0]}\n})();`, [
      "redirectUri", "request", "consumeTransactionFromSession", "oidc", "config",
    ], { filename: page });

    await t.test("usa o endereço registrado, os parâmetros recebidos e os valores da sessão", async () => {
      const config = {};
      const consume = t.mock.fn(async () => transaction);
      const grant = t.mock.fn(async () => ({ claims: () => ({}) }));
      const query = "?code=received-code&state=saved-state";

      await runCallback(redirectUri, {
        url: `/auth/callback${query}`,
        headers: { host: "other.example.test" },
      }, consume, { authorizationCodeGrant: grant }, config);

      assert.equal(consume.mock.callCount(), 1);
      assert.equal(consume.mock.calls[0].arguments[0], "saved-state");
      assert.equal(grant.mock.callCount(), 1);
      const [usedConfig, url, checks] = grant.mock.calls[0].arguments;
      assert.equal(usedConfig, config);
      assert.equal(url.href, `${redirectUri}${query}`);
      assert.deepEqual(checks, {
        pkceCodeVerifier: transaction.codeVerifier,
        expectedState: transaction.state,
        expectedNonce: transaction.nonce,
        idTokenExpected: true,
      });
    });

    for (const [name, registered, incoming, error] of [
      ["origem diferente", redirectUri, "https://other.example.test/auth/callback?code=test&state=saved-state", /endereço inesperado/],
      ["caminho diferente", redirectUri, "/auth/other?code=test&state=saved-state", /endereço inesperado/],
      ["query no URI registrado", `${redirectUri}?fixed=value`, "/auth/callback?code=test&state=saved-state", /sem query string/],
      ["state ausente", redirectUri, "/auth/callback?code=test", /exatamente um parâmetro state/],
      ["state duplicado", redirectUri, "/auth/callback?code=test&state=saved-state&state=other", /exatamente um parâmetro state/],
    ]) {
      await t.test(`rejeita ${name} sem consumir a sessão`, async () => {
        const consume = t.mock.fn(async () => transaction);
        const grant = t.mock.fn(async () => ({ claims: () => ({}) }));

        await assert.rejects(runCallback(registered, { url: incoming }, consume, {
          authorizationCodeGrant: grant,
        }, {}), error);
        assert.equal(consume.mock.callCount(), 0);
        assert.equal(grant.mock.callCount(), 0);
      });
    }

    await t.test("rejeita uma transação que não corresponde ao state recebido", async () => {
      const consume = t.mock.fn(async () => ({ ...transaction, state: "different-state" }));
      const grant = t.mock.fn(async () => ({ claims: () => ({}) }));

      await assert.rejects(runCallback(redirectUri, {
        url: "/auth/callback?code=received-code&state=saved-state",
      }, consume, { authorizationCodeGrant: grant }, {}), /Transação OAuth não encontrada/);
      assert.equal(consume.mock.calls[0].arguments[0], "saved-state");
      assert.equal(grant.mock.callCount(), 0);
    });
  });
}
