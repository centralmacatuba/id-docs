import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { resolveConfig } from "vitepress";

test("gera URLs canônicas para a página inicial, índices e páginas comuns", async () => {
  const docs = fileURLToPath(new URL("../docs/", import.meta.url));
  const { transformHead } = await resolveConfig(docs, "build");

  for (const [page, path] of [
    ["index.md", "/"],
    ["integrations/index.md", "/integrations/"],
    ["reference/discovery.md", "/reference/discovery"],
  ]) {
    assert.deepEqual(await transformHead({ page }), [
      ["link", { rel: "canonical", href: `https://docs.id.centralmacatuba.qzz.io${path}` }],
    ], page);
  }
});
