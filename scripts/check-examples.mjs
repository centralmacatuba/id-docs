import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const docsDirectory = new URL("../docs/", import.meta.url).pathname;
const repositoryRoot = new URL("../", import.meta.url).pathname;
const temporaryDirectory = await mkdtemp(join(tmpdir(), "cm-id-doc-examples-"));
const failures = [];
let checked = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    const source = await readFile(path, "utf8");
    const blocks = [...source.matchAll(new RegExp("```(?:js|javascript|mjs)\\s*\\n([\\s\\S]*?)\\n```", "g"))];
    for (let index = 0; index < blocks.length; index += 1) {
      const snippet = blocks[index][1];
      if (!snippet.trim()) continue;

      checked += 1;
      const temporaryFile = join(temporaryDirectory, "example-" + checked + ".mjs");
      await writeFile(temporaryFile, snippet, "utf8");
      const result = spawnSync(process.execPath, ["--check", temporaryFile], { encoding: "utf8" });
      if (result.status !== 0) {
        failures.push({
          file: relative(repositoryRoot, path),
          block: index + 1,
          error: (result.stderr || result.stdout || "Falha de sintaxe").trim(),
        });
      }
    }
  }
}

try {
  await walk(docsDirectory);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

if (failures.length) {
  for (const failure of failures) {
    process.stderr.write("\n" + failure.file + " — bloco JS " + failure.block + "\n" + failure.error + "\n");
  }
  process.exitCode = 1;
} else {
  process.stdout.write("Sintaxe JavaScript válida em " + checked + " bloco(s) de código.\n");
}
