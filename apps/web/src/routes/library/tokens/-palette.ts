import type { Token } from "./-catalog";

export type ColorGroup = { token: Token; members: Token[] };

/** Collapse proven aliases, not colors that merely happen to match in one scheme or gamut. */
export function groupColors(
  tokens: readonly Token[],
  definitions: readonly Token[],
): ColorGroup[] {
  const byName = new Map(definitions.map((token) => [token.name, token]));
  const order = new Map(definitions.map((token, index) => [token.name, index]));
  function canonical(token: Token, seen = new Set<string>()): Token {
    if (seen.has(token.name)) return token;
    seen.add(token.name);
    const references = token.definitions.map(
      (definition) => definition.value.match(/^var\((--[\w-]+)\)$/)?.[1],
    );
    const target = references[0] ? byName.get(references[0]) : undefined;
    const global = token.definitions.every(
      (definition) => definition.scope !== "component",
    );
    const hasBase = token.definitions.some(
      (definition) =>
        !definition.context.some((context) =>
          /^@(?:media|supports|variant)\b/.test(context),
        ),
    );
    if (
      !target ||
      !global ||
      !hasBase ||
      references.some((reference) => reference !== target.name) ||
      target.definitions.some((definition) => definition.scope === "component")
    )
      return token;
    return canonical(target, seen);
  }
  const groups = new Map<string, ColorGroup>();
  for (const token of tokens) {
    const root = canonical(token);
    const group = groups.get(root.name) ?? { token: root, members: [] };
    group.members.push(token);
    groups.set(root.name, group);
  }
  return [...groups.values()].sort(
    (a, b) =>
      Number(a.token.definitions[0]?.scope !== "root") -
        Number(b.token.definitions[0]?.scope !== "root") ||
      (order.get(a.token.name) ?? 0) - (order.get(b.token.name) ?? 0),
  );
}
