function normalizeReferenceLabel(label) {
  return label.replace(/\\(.)/g, "$1").trim().replace(/\s+/g, " ").toLowerCase();
}

export function extractFencedCodeBlocks(source) {
  const lines = source.split(/\r?\n/);
  const blocks = [];
  const backtick = String.fromCharCode(96);
  const openingPattern = new RegExp("^( {0,3})(" + backtick + "{3,}|~{3,})(.*)$");
  const closingPattern = new RegExp("^( {0,3})(" + backtick + "+|~+)[ \t]*$");

  for (let index = 0; index < lines.length; index += 1) {
    const opening = openingPattern.exec(lines[index]);
    if (!opening) continue;

    const fence = opening[2];
    const info = opening[3].trim();
    if (fence[0] === backtick && info.includes(backtick)) continue;

    const marker = fence[0];
    let closing = index + 1;
    for (; closing < lines.length; closing += 1) {
      const candidate = closingPattern.exec(lines[closing]);
      if (candidate && candidate[2][0] === marker && candidate[2].length >= fence.length) break;
    }

    blocks.push({
      info,
      content: lines.slice(index + 1, closing).join("\n"),
      startLine: index + 1,
      endLine: Math.min(closing + 1, lines.length),
    });
    index = closing;
  }

  return blocks;
}

export function stripFencedCodeBlocks(source) {
  const lines = source.split(/\r?\n/);
  for (const block of extractFencedCodeBlocks(source)) {
    for (let line = block.startLine - 1; line < block.endLine; line += 1) lines[line] = "";
  }
  return lines.join("\n");
}

export function extractMarkdownLinks(source) {
  let content = stripFencedCodeBlocks(source);
  const definitions = new Map();
  const definitionPattern = /^ {0,3}\[([^\]]+)\]:[ \t]*(?:<([^>]+)>|(\S+))(?:[ \t]+(?:"[^"]*"|'[^']*'|\([^)]*\)))?[ \t]*$/gm;

  content = content.replace(definitionPattern, (_match, label, angled, bare) => {
    definitions.set(normalizeReferenceLabel(label), angled ?? bare);
    return "";
  });

  const links = [];
  const inlinePattern = /!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:[ \t]+["'][^"']*["'])?\)/g;
  for (const match of content.matchAll(inlinePattern)) {
    links.push({ href: match[1].replace(/^<|>$/g, ""), index: match.index });
  }

  const referencePattern = /(?<!\])!?\[([^\]]+)\](?:[ \t]*\[([^\]]*)\])?/g;
  for (const match of content.matchAll(referencePattern)) {
    if (/^\s*\(/.test(content.slice(match.index + match[0].length))) continue;
    const label = normalizeReferenceLabel(match[2] === undefined || match[2] === "" ? match[1] : match[2]);
    const href = definitions.get(label);
    if (href !== undefined) links.push({ href, index: match.index });
  }

  return links.sort((left, right) => left.index - right.index);
}
