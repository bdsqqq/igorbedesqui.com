import postcss, { type ChildNode, type Declaration } from "postcss";
import ts from "typescript";

export type Definition = {
  value: string;
  file: string;
  line: number;
  context: string[];
  scope: "theme" | "root" | "component";
};
export type Token = { name: string; definitions: Definition[] };
export type Offset = {
  utility: string;
  kind: "layer" | "state";
  direction: "auto" | "lighten" | "darken";
  amount: number;
  references: { file: string; line: number }[];
};
export type TokenCatalog = {
  tokens: Token[];
  resets: (Definition & { name: string })[];
  offsets: Offset[];
  previewCss: string;
};

function ancestors(node: ChildNode) {
  const parents: (postcss.AtRule | postcss.Rule)[] = [];
  for (
    let parent: postcss.Node | undefined = node.parent;
    parent;
    parent = parent.parent
  ) {
    if (parent instanceof postcss.AtRule || parent instanceof postcss.Rule)
      parents.unshift(parent);
  }
  return parents;
}

/** Parse source CSS, not generated utility output: unused definitions belong in the explorer too. */
export function extractTokens(
  sources: { file: string; css: string }[],
): TokenCatalog {
  const tokens = new Map<string, Token>();
  const resets: TokenCatalog["resets"] = [];
  const declarations: { declaration: Declaration; definition: Definition }[] =
    [];
  for (const { file, css } of sources) {
    postcss.parse(css, { from: file }).walkDecls((declaration) => {
      if (!declaration.prop.startsWith("--")) return;
      const parents = ancestors(declaration);
      // Utility internals and keyframe-local variables aren't public theme definitions.
      if (
        parents.some(
          (parent) =>
            parent.type === "atrule" &&
            !["theme", "layer", "media", "supports", "variant"].includes(
              parent.name,
            ),
        )
      )
        return;
      const inTheme =
        declaration.parent?.type === "atrule" &&
        declaration.parent.name === "theme";
      const rule = parents.findLast((parent) => parent.type === "rule");
      if (!inTheme && !rule) return;
      const definition: Definition = {
        value: declaration.value,
        file,
        line: declaration.source?.start?.line ?? 1,
        scope: inTheme
          ? "theme"
          : rule?.type === "rule" &&
              rule.selector
                .split(",")
                .some((selector) => selector.trim() === ":root")
            ? "root"
            : "component",
        context: parents.map((parent) =>
          parent.type === "atrule"
            ? `@${parent.name} ${parent.params}`
            : parent.type === "rule"
              ? parent.selector
              : "",
        ),
      };
      if (declaration.prop.endsWith("*") && declaration.value === "initial") {
        const prefix = declaration.prop.slice(0, -1);
        for (const name of tokens.keys())
          if (name.startsWith(prefix)) tokens.delete(name);
        resets.push({ name: declaration.prop, ...definition });
        return;
      }
      const token = tokens.get(declaration.prop) ?? {
        name: declaration.prop,
        definitions: [],
      };
      token.definitions.push(definition);
      tokens.set(token.name, token);
      declarations.push({ declaration, definition });
    });
  }

  // Re-scope the same declarations, retaining real gamut/support conditions. No global theme mutation.
  let previewCss =
    '[data-token-theme="dark"]{color-scheme:dark}[data-token-theme="light"]{color-scheme:light}';
  for (const { declaration, definition } of declarations) {
    if (!tokens.has(declaration.prop) || definition.scope === "component")
      continue;
    const parents = ancestors(declaration);
    const scheme = definition.context
      .join(" ")
      .match(/prefers-color-scheme:\s*(light|dark)/)?.[1];
    const selector = scheme
      ? `[data-token-theme="${scheme}"]`
      : "[data-token-theme]";
    let css = `${selector}{${declaration.toString()}}`;
    for (const parent of parents.toReversed()) {
      if (parent.type !== "atrule") continue;
      if (parent.name === "media")
        css = `@media ${parent.params.replace(/\(prefers-color-scheme:\s*(?:light|dark)\)/g, "all")}{${css}}`;
      if (parent.name === "supports")
        css = `@supports ${parent.params}{${css}}`;
      if (parent.name === "variant" && parent.params === "contrast-more")
        css = `@media(prefers-contrast:more){${css}}`;
    }
    previewCss += css;
    if (definition.scope === "theme")
      previewCss += `[data-token-reference]{${declaration.toString()}}`;
  }
  return { tokens: [...tokens.values()], resets, offsets: [], previewCss };
}

/** Inventory literal numeric modifiers; don't claim to reconstruct dynamic class expressions. */
export function extractOffsets(
  sources: { file: string; text: string }[],
): Offset[] {
  const offsets = new Map<string, Offset>();
  for (const { file, text } of sources) {
    const source = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    function visit(node: ts.Node) {
      if (ts.isStringLiteralLike(node)) {
        for (const word of node.text.split(/\s+/)) {
          const match = word.match(
            /(?:^|:)(ak-(layer|state)(?:-(lighten|darken))?-(\d+(?:\.\d+)?))$/,
          );
          if (!match) continue;
          const [, utility, kind, direction, amount] = match;
          const offset = offsets.get(utility) ?? {
            utility,
            kind: kind as Offset["kind"],
            direction: (direction ?? "auto") as Offset["direction"],
            amount: Number(amount),
            references: [],
          };
          const line =
            source.getLineAndCharacterOfPosition(node.getStart(source)).line +
            1;
          if (
            !offset.references.some(
              (reference) => reference.file === file && reference.line === line,
            )
          )
            offset.references.push({ file, line });
          offsets.set(utility, offset);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  return [...offsets.values()].sort(
    (a, b) =>
      a.kind.localeCompare(b.kind) ||
      a.direction.localeCompare(b.direction) ||
      a.amount - b.amount,
  );
}
