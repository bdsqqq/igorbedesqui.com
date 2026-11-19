import assert from "node:assert/strict";
import test from "node:test";
import { groupColors } from "./-palette.ts";

const token = (name, value, options = {}) => ({
  name,
  definitions: [
    {
      value,
      file: "theme.css",
      line: 1,
      context: [":root"],
      scope: "root",
      ...options,
    },
  ],
});

test("groups exact reference chains while preserving every alias and source definition", () => {
  const base = token("--gray-00", "#111");
  base.definitions.push({
    ...base.definitions[0],
    value: "#fff",
    context: ["@media (prefers-color-scheme: light)", ":root"],
  });
  const alias = token("--color-canvas", "var(--gray-00)", {
    scope: "theme",
    context: ["@theme"],
  });
  const chained = token("--surface", "var(--color-canvas)");
  const groups = groupColors([alias, chained, base], [alias, chained, base]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].token, base);
  assert.deepEqual(groups[0].members, [alias, chained, base]);
  assert.equal(groups[0].token.definitions.length, 2);
});

test("equal fills, conditional aliases, fallbacks, and component scopes are not interchangeable", () => {
  const base = token("--base", "#111");
  const equal = token("--different", "#111");
  const conditional = token("--light-only", "var(--base)", {
    context: ["@media (prefers-color-scheme: light)", ":root"],
  });
  const fallback = token("--fallback", "var(--base, #fff)");
  const local = token("--local", "var(--base)", {
    scope: "component",
    context: [".component"],
  });
  const varying = token("--varying", "var(--base)");
  varying.definitions.push({
    ...varying.definitions[0],
    value: "var(--different)",
    context: ["@media (prefers-color-scheme: light)", ":root"],
  });
  const tokens = [base, equal, conditional, fallback, local, varying];
  assert.equal(groupColors(tokens, tokens).length, tokens.length);
});

test("searching an alias still points at its canonical source; cycles terminate without losing names", () => {
  const base = token("--base", "#111");
  const alias = token("--alias", "var(--base)");
  assert.equal(groupColors([alias], [base, alias])[0].token, base);
  const cycle = [token("--a", "var(--b)"), token("--b", "var(--a)")];
  assert.deepEqual(
    groupColors(cycle, cycle)
      .flatMap((group) => group.members.map((token) => token.name))
      .sort(),
    ["--a", "--b"],
  );
});
