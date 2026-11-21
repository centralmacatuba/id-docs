import assert from "node:assert/strict";
import test from "node:test";
import { extractFencedCodeBlocks, extractMarkdownLinks, stripFencedCodeBlocks } from "../scripts/markdown-utils.mjs";

test("uma cerca menor não encerra uma cerca CommonMark maior", () => {
  const ticks = String.fromCharCode(96);
  const source = [
    ticks.repeat(4) + "js",
    "const first = true;",
    ticks.repeat(3),
    "const second = true;",
    ticks.repeat(4),
  ].join("\n");
  const [block] = extractFencedCodeBlocks(source);

  assert.equal(block.info, "js");
  assert.ok(block.content.includes(ticks.repeat(3)));
  assert.match(block.content, /const second = true/);
  assert.equal(stripFencedCodeBlocks(source).trim(), "");
});

test("reconhece fences com tis e ignora links dentro do bloco", () => {
  const source = [
    "~~~md",
    "[falso](/missing)",
    "~~~~",
    "[válido](/present)",
  ].join("\n");
  const links = extractMarkdownLinks(source);

  assert.deepEqual(links.map((link) => link.href), ["/present"]);
});

test("extrai links de referência sem tratar definições como links separados", () => {
  const source = [
    "[texto][ref]",
    "[com espaço] [ref]",
    "[colapsado][]",
    "[atalho]",
    "",
    "[ref]: /one",
    "[colapsado]: /two",
    "[atalho]: /three",
  ].join("\n");

  assert.deepEqual(extractMarkdownLinks(source).map((link) => link.href), ["/one", "/two", "/three"]);
});
