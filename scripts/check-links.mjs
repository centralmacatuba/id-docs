import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const docsRoot = resolve("docs");
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

    const fence = String.fromCharCode(96).repeat(3);
    const source = (await readFile(path, "utf8")).replace(new RegExp(fence + "[\\s\\S]*?" + fence, "g"), "");
    const links = [...source.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\)/g)];

    for (const match of links) {
      let href = match[1].replace(/^<|>$/g, "");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("//") ||
        /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(href)
      ) continue;

      try {
        href = decodeURIComponent(href.split("#")[0].split("?")[0]);
      } catch {
        failures.push(relative(process.cwd(), path) + ": URL local contém escape percentual inválido: " + match[1]);
        continue;
      }
      if (!href) continue;
      checked += 1;

      const target = href.startsWith("/")
        ? resolve(docsRoot, "." + href)
        : resolve(dirname(path), href);
      const candidates = [];
      if (extname(target)) {
        candidates.push(target);
        if (/\.html$/i.test(target)) {
          candidates.push(target.replace(/\.html$/i, ".md"));
        }
        if (href.startsWith("/")) candidates.push(resolve(docsRoot, "public", "." + href));
      } else {
        candidates.push(target + ".md", join(target, "index.md"), join(target, "index.html"));
        if (href.startsWith("/")) candidates.push(resolve(docsRoot, "public", "." + href));
      }

      let exists = false;
      for (const candidate of candidates) {
        try {
          if ((await stat(candidate)).isFile()) {
            exists = true;
            break;
          }
        } catch {
          // Tenta o próximo destino compatível com clean URLs do VitePress.
        }
      }

      if (!exists) {
        failures.push(relative(process.cwd(), path) + ": link local não encontrado: " + match[1]);
      }
    }
  }
}

await walk(docsRoot);

if (failures.length) {
  for (const failure of failures) process.stderr.write(failure + "\n");
  process.stderr.write("\n" + failures.length + " problema(s) em links locais.\n");
  process.exitCode = 1;
} else {
  process.stdout.write("Links locais verificados: " + checked + ". Nenhum destino ausente.\n");
}
