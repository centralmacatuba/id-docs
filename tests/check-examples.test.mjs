import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

const checker = new URL("../scripts/check-examples.mjs", import.meta.url);
const markdownUtils = new URL("../scripts/markdown-utils.mjs", import.meta.url);
const block = (language, source) => `\`\`\`${language}\n${source}\n\`\`\``;

async function runChecker(t, files) {
  const root = await mkdtemp(join(tmpdir(), "cm-id-example-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const script = join(root, "scripts", "check-examples.mjs");
  const scratch = join(root, "scratch");
  await mkdir(dirname(script));
  await mkdir(scratch);
  await mkdir(join(root, "docs"));
  await copyFile(checker, script);
  await copyFile(markdownUtils, join(root, "scripts", "markdown-utils.mjs"));
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, "docs", name);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, content);
  }

  const result = spawnSync(process.execPath, [script], {
    cwd: scratch,
    encoding: "utf8",
    env: { ...process.env, TMPDIR: scratch, TMP: scratch, TEMP: scratch },
  });
  assert.ifError(result.error);
  assert.deepEqual(await readdir(scratch), []);
  return result;
}

test("verifica os três tipos de blocos JS sem executar os exemplos", async (t) => {
  const result = await runChecker(t, {
    "nested/page.md": [
      block("js", "throw new Error('não execute este exemplo');"),
      block("javascript", "await Promise.resolve();"),
      block("mjs", "export const value = 42;"),
    ].join("\n\n"),
    "ignored.txt": block("js", "const = ;"),
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /válida em 3 bloco\(s\)/);
});

test("ignora cercas de outros idiomas e blocos JS vazios", async (t) => {
  const result = await runChecker(t, {
    "index.md": [block("text", "const = ;"), block("js", "  ")].join("\n\n"),
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /válida em 0 bloco\(s\)/);
});

test("reconhece cercas CommonMark com tis e comprimentos maiores", async (t) => {
  const ticks = String.fromCharCode(96);
  const result = await runChecker(t, {
    "fences.md": [
      "~~~js",
      "const tildeExample = true;",
      "~~~~",
      "",
      ticks.repeat(4) + "javascript title",
      "const backtickExample = true;",
      ticks.repeat(4),
    ].join("\\n"),
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /válida em 2 bloco\\(s\\)/);
});
test("lista erros de sintaxe em vários arquivos com o número do bloco", async (t) => {
  const result = await runChecker(t, {
    "a.md": [block("js", "const valid = true;"), block("mjs", "export const = ;")].join("\n\n"),
    "nested/b.md": block("javascript", "const broken = ;"),
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /docs[/\\]a\.md — bloco JS 2\n/);
  assert.match(result.stderr, /docs[/\\]nested[/\\]b\.md — bloco JS 1\n/);
  assert.match(result.stderr, /SyntaxError/);
  assert.equal(result.stdout, "");
});
