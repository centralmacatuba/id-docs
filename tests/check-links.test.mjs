import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
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

test("ignora cercas CommonMark com tis e comprimentos diferentes", async () => {
  const markdown = [
    "[válido](/guide)",
    "",
    "~~~~md",
    "[falso](/missing)",
    "~~~",
    "[continua na cerca](/also-missing)",
    "~~~~",
  ].join("\\n");
  const result = await runChecker(markdown, { "guide.md": "# Guia\\n" });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Links locais verificados: 1/);
});

test("resolve links de referência completos, colapsados e abreviados", async () => {
  const markdown = [
    "[guia][guia-ref]",
    "[guia colapsado][]",
    "[guia abreviado]",
    "[ausente][ausente-ref]",
    "",
    "[guia-ref]: /guide",
    "[guia colapsado]: /guide/index.md",
    "[guia abreviado]: /guide",
    "[ausente-ref]: /missing",
  ].join("\\n");
  const result = await runChecker(markdown, { "guide/index.md": "# Guia\\n" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /link local não encontrado: \\/missing/);
  assert.match(result.stderr, /1 problema\\(s\\)/);
});
test("falha quando um destino local não existe", async () => {
  const result = await runChecker("[ausente](/inexistente)\n");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /link local não encontrado: \/inexistente/);
});

test("resolve URLs limpas, destinos relativos e imagens públicas", async () => {
  const result = await runChecker("[guia](/guide/)\n", {
    "guide/index.md": [
      '[nome com espaço](<../reference/with space.md> "Título")',
      "[URL codificada](../reference/with%20space?view=full#details)",
      "[página HTML](/manual)",
      "![logo](/logo.svg)",
      "[arquivo público sem extensão](/download)",
    ].join("\n"),
    "reference/with space.md": "# Referência\n",
    "manual/index.html": "<!doctype html>",
    "public/logo.svg": "<svg/>",
    "public/download": "arquivo",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Links locais verificados: 6\./);
});

test("ignora links externos, fragmentos e consultas da página atual", async () => {
  const result = await runChecker([
    "#section",
    "?view=full#section",
    "//example.test/path",
    "HTTPS://example.test/path",
    "mailto:contact@example.test",
    "tel:+551234567890",
  ].map((href) => `[link](${href})`).join("\n"));

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Links locais verificados: 0\./);
});

test("distingue escapes inválidos de destinos ausentes e continua a verificação", async () => {
  const result = await runChecker("[guia](/guide)\n", {
    "guide.md": "[inválido](/bad%ZZ)\n[ausente](/missing?view=full#section)\n[arquivo](/folder.svg)\n",
    "folder.svg/child.txt": "diretório, não arquivo",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /guide\.md: URL local contém escape percentual inválido: \/bad%ZZ/);
  assert.match(result.stderr, /guide\.md: link local não encontrado: \/missing\?view=full#section/);
  assert.match(result.stderr, /guide\.md: link local não encontrado: \/folder\.svg/);
  assert.match(result.stderr, /3 problema\(s\)/);
});

test("aceita destino .html quando a página Markdown correspondente existe", async () => {
  const result = await runChecker("[página HTML](/guide.html)\n", {
    "guide.md": "# Guia\n",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Links locais verificados: 1\./);
});


test("rejeita destinos relativos e absolutos que escapam de docs/", async () => {
  const result = await runChecker("[relativo](../README.md)\n[absoluto](/../README.md)\n");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /destino local fora de docs\/: \.\.\/README\.md/);
  assert.match(result.stderr, /destino local fora de docs\/: \/\.\.\/README\.md/);
  assert.match(result.stderr, /2 problema\(s\)/);
});

test("rejeita links simbólicos que apontam para fora de docs/", async () => {
  const root = await mkdtemp(join(tmpdir(), "cm-id-link-check-symlink-"));
  try {
    const docs = join(root, "docs");
    await mkdir(docs, { recursive: true });
    await writeFile(join(docs, "index.md"), "[fora](outside.md)\n", "utf8");
    const outside = join(root, "outside");
    await mkdir(outside, { recursive: true });
    await writeFile(join(outside, "secret.md"), "# Fora de docs\n", "utf8");
    // Directory junctions work on Windows without the symlink privilege.
    await symlink(outside, join(docs, "outside"), "junction");
    await writeFile(join(docs, "index.md"), "[fora](outside/secret.md)\n", "utf8");
    const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /destino local aponta para fora de docs\//);
    assert.match(result.stderr, /secret\.md/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
