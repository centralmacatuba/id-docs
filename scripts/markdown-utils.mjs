function normalizeReferenceLabel(label) {
  return label.replace(/\\(.)/g, "$1").trim().replace(/\\s+/g, " ").toLowerCase();
}

export function extractFencedCodeBlocks(source) {
  const lines = source.split(/\\r?\\n/);
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    const opening = /^( {0,3})(`{3,}|~{3,})(.*)$/.exec(lines[index]);
    if (!opening) continue;
    const fence = opening[2];
    const info = opening[3].trim();
    if (fence[0] === "`" && info.includes("`")) continue;
    const marker = fence[0] === "`" ? "`" : "~";
    const closingPattern = new RegExp("^ {0,3}" + marker + "{" + fence.length + ",}[ \\t]*$");
    let closing = index + 1;
    while (closing < lines.length && !closingPattern.test(lines[closing])) closing += 1;
    blocks.push({ info, content: lines.slice(index + 1, closing).join("\\n"), startLine: index + 1, endLine: Math.min(closing + 1, lines.length) });
    index = closing;
  }
  return blocks;
}

export function stripFencedCodeBlocks(source) {
  const lines = source.split(/\\r?\\n/);
  for (const block of extractFencedCodeBlocks(source)) {
    for (let line = block.startLine - 1; line < block.endLine; line += 1) lines[line] = "";
  }
  return lines.join("\\n");
}

export function extractMarkdownLinks(source) {
  let content = stripFencedCodeBlocks(source);
  const definitions = new Map();
  const definitionPattern = /^ {0,3}\\[([^\\]]+)\\]:[ \\t]*(?:<([^>]+)>|(\\S+))(?:[ \\t]+(?:"[^"]*"|\'[^\']*\'|\\([^)]*\\)))?[ \\t]*$/gm;
  content = content.replace(definitionPattern, (_match, label, angled, bare) => {
    definitions.set(normalizeReferenceLabel(label), angled ?? bare);
    return "";
  });
  const links = [];
  const inlinePattern = /!?\\[[^\\]]*\\]\\((<[^>]+>|[^)\\s]+)(?:[ \\t]+["\'][^"\']*["\'])?\\)/g;
  for (const match of content.matchAll(inlinePattern)) links.push({ href: match[1].replace(/^<|>$/g, ""), index: match.index });
  const referencePattern = /!?\\[([^\\]]+)\\](?:\\[([^\\]]*)\\])?/g;
  for (const match of content.matchAll(referencePattern)) {
    if (/^\\s*\\(/.test(content.slice(match.index + match[0].length))) continue;
    const label = normalizeReferenceLabel(match[2] === undefined || match[2] === "" ? match[1] : match[2]);
    const href = definitions.get(label);
    if (href !== undefined) links.push({ href, index: match.index });
  }
  return links.sort((left, right) => left.index - right.index);
}
