import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const checker = fileURLToPath(new URL("../scripts/check-links.mjs", import.meta.url));

async function runChecker(markdown, files = {}) {
  const root = await mkdtemp(join(tmpdir(), "cm-id-link-check-"));
  try {
    const docs = join(root, "docs");
    await mkdir(docs, { recursive: true });
    await writeFile(join(docs, "index.md"), markdown, "utf8");
    for (const [path, content] of Object.entries(files)) {
      const target = join(docs, path);
      await mkdir(join(target, ".."), { recursive: true });
      await writeFile(target, content, "utf8");
    }
    return spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("aceita links locais existentes e ignora links dentro de cercas", async () => {
  const fence = String.fromCharCode(96).repeat(3);
  const markdown = [
    "[página](/existing)",
    "",
    fence + "md",
    "[exemplo](/missing)",
    fence,
  ].join("\n");
  const result = await runChecker(markdown, { "existing.md": "# Existe\n" });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Links locais verificados: 1/);
});

test("falha quando um destino local não existe", async () => {
  const result = await runChecker("[ausente](/inexistente)\n");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /link local não encontrado: \/inexistente/);
});
