import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const webRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceRoots = ["components", "src", "lib"];
const sourcePattern = /\.(?:[cm]?[jt]sx?|mdx|css)$/;

/** Audit production source only; fixtures and generated build output never enter the inventory. */
export async function readMigrationSources(root = webRoot) {
  const sources = new Map();
  async function walk(directory) {
    for (const entry of (
      await readdir(path.join(root, directory), { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name))) {
      const name = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await walk(name);
      else if (sourcePattern.test(name))
        sources.set(name, await readFile(path.join(root, name), "utf8"));
    }
  }
  for (const directory of sourceRoots) await walk(directory);
  return sources;
}

function visit(node, callback) {
  callback(node);
  ts.forEachChild(node, (child) => visit(child, callback));
}

/** Public leaf pages come from router declarations, so new static routes join the smoke test automatically. */
export function staticPageRoutes(sources) {
  const routes = new Set();
  for (const [file, text] of sources) {
    if (!file.startsWith("src/routes/") || !file.endsWith(".tsx")) continue;
    const source = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const factories = new Set();
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        statement.moduleSpecifier.text !== "@tanstack/react-router"
      )
        continue;
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings))
        for (const element of bindings.elements) {
          if ((element.propertyName ?? element.name).text === "createFileRoute")
            factories.add(element.name.text);
        }
    }
    visit(source, (node) => {
      if (
        !ts.isCallExpression(node) ||
        !ts.isIdentifier(node.expression) ||
        !factories.has(node.expression.text)
      )
        return;
      const argument = node.arguments[0];
      if (!argument || !ts.isStringLiteralLike(argument)) return;
      const route = argument.text.replace(/\/$/, "") || "/";
      // /writing is an Outlet-only layout, with no public index content.
      if (
        route.includes("$") ||
        /^\/api(?:\/|$)/.test(route) ||
        route === "/writing"
      )
        return;
      routes.add(route);
    });
  }
  return [...routes].sort();
}

function strings(node) {
  const values = [];
  visit(node, (child) => {
    if (
      ts.isStringLiteralLike(child) ||
      ts.isTemplateHead(child) ||
      ts.isTemplateMiddle(child) ||
      ts.isTemplateTail(child)
    )
      values.push(child.text);
  });
  return values;
}

// Colons inside arbitrary selectors/values do not separate Tailwind variants.
function utility(token) {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i++) {
    if ("[(".includes(token[i])) depth++;
    else if ("])".includes(token[i])) depth--;
    else if (token[i] === ":" && depth === 0) start = i + 1;
  }
  return token.slice(start).replace(/^!|!$/g, "");
}

const isRadixBehavior = (specifier) =>
  /^(?:@radix-ui\/(?!react-icons(?:\/|$))[^/]+|radix-ui)(?:\/|$)/.test(
    specifier,
  );
const classFactories = new Set(["cn", "clsx", "cva", "CVAWithPerms"]);

/**
 * Check syntax and local composition, rather than grep counts. This deliberately
 * doesn't claim to prove rendered styles or follow arbitrary component wrappers.
 */
export function auditMigrationSources(sources, { boundaries = true } = {}) {
  const diagnostics = [];
  const inventories = new Map();
  function report(file, source, node, rule, message) {
    const position = typeof node === "number" ? node : node.getStart(source);
    const { line, character } = source.getLineAndCharacterOfPosition(position);
    diagnostics.push({
      file,
      line: line + 1,
      column: character + 1,
      rule,
      message,
    });
  }

  for (const [file, text] of [...sources].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (file.endsWith(".css")) continue;
    const source = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const contexts = [];
    const ariakitButtons = new Set();
    const ariakitControls = new Set();
    const ariakitNamespaces = new Set();
    const reactCreateElements = new Set(["createElement"]);
    const buttonJsx = [];
    // Imports may live after the component declarations in this codebase.
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !statement.moduleSpecifier.text.startsWith("@ariakit/react")
      )
        continue;
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings))
        ariakitNamespaces.add(bindings.name.text);
      if (bindings && ts.isNamedImports(bindings))
        for (const element of bindings.elements)
          ariakitControls.add(element.name.text);
    }
    const isAriakitRender = (node) => {
      const expression = node.parent;
      const attribute = expression?.parent;
      const owner = attribute?.parent?.parent;
      if (
        !expression ||
        !ts.isJsxExpression(expression) ||
        !attribute ||
        !ts.isJsxAttribute(attribute) ||
        attribute.name.getText(source) !== "render" ||
        !owner ||
        !(ts.isJsxOpeningElement(owner) || ts.isJsxSelfClosingElement(owner))
      )
        return false;
      const tag = owner.tagName.getText(source);
      return (
        ariakitControls.has(tag) ||
        [...ariakitNamespaces].some((name) => tag.startsWith(`${name}.`))
      );
    };
    const addContext = (node, inherited = false) => {
      contexts.push({
        node,
        inherited,
        tokens: strings(node)
          .flatMap((value) => value.split(/\s+/))
          .filter(Boolean)
          .map(utility),
      });
    };

    visit(source, (node) => {
      let module;
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
        module = node.moduleSpecifier;
      else if (
        ts.isImportEqualsDeclaration(node) &&
        ts.isExternalModuleReference(node.moduleReference)
      )
        module = node.moduleReference.expression;
      else if (
        ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          node.expression.getText(source) === "require")
      )
        module = node.arguments[0];
      if (
        module &&
        ts.isStringLiteralLike(module) &&
        isRadixBehavior(module.text)
      )
        report(
          file,
          source,
          module,
          "radix-behavior",
          `replace behavior import ${module.text}; @radix-ui/react-icons is allowed`,
        );

      if (
        ts.isImportDeclaration(node) &&
        node.moduleSpecifier.text.startsWith("@ariakit/react")
      ) {
        const bindings = node.importClause?.namedBindings;
        if (bindings && ts.isNamespaceImport(bindings))
          ariakitNamespaces.add(bindings.name.text);
        if (bindings && ts.isNamedImports(bindings))
          for (const element of bindings.elements) {
            if ((element.propertyName ?? element.name).text === "Button")
              ariakitButtons.add(element.name.text);
          }
      }
      if (
        ts.isImportDeclaration(node) &&
        node.moduleSpecifier.text === "react"
      ) {
        const bindings = node.importClause?.namedBindings;
        if (bindings && ts.isNamedImports(bindings))
          for (const element of bindings.elements) {
            if ((element.propertyName ?? element.name).text === "createElement")
              reactCreateElements.add(element.name.text);
          }
      }
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(source);
        if (tag === "button" && !isAriakitRender(node))
          report(
            file,
            source,
            node,
            "native-button",
            "use Ariakit Button or the shared Button wrapper",
          );
        buttonJsx.push({ tag, node });
        for (const attribute of node.attributes.properties) {
          if (
            ts.isJsxAttribute(attribute) &&
            attribute.name.getText(source) === "className" &&
            attribute.initializer
          )
            addContext(attribute.initializer, /^[A-Z]/.test(tag));
        }
      }
      if (ts.isCallExpression(node)) {
        const callee = node.expression.getText(source);
        if (
          (reactCreateElements.has(callee) ||
            /^(?:React\.)?(?:createElement|jsx|jsxs)$/.test(callee)) &&
          ts.isStringLiteralLike(node.arguments[0] ?? source) &&
          node.arguments[0].text === "button"
        )
          report(
            file,
            source,
            node,
            "native-button",
            "use Ariakit Button or the shared Button wrapper",
          );
        if (classFactories.has(callee)) {
          // An outer class composition already owns all nested string fragments.
          let parent = node.parent;
          while (
            parent &&
            !ts.isJsxAttribute(parent) &&
            !(
              ts.isCallExpression(parent) &&
              classFactories.has(parent.expression.getText(source))
            )
          )
            parent = parent.parent;
          // Standalone helpers are fragments; their callers can supply ak-frame.
          if (!parent) addContext(node, true);
        }
      }
    });

    const usesAriakitButton = buttonJsx.some(
      ({ tag }) =>
        ariakitButtons.has(tag) ||
        [...ariakitNamespaces].some((name) => tag === `${name}.Button`),
    );
    inventories.set(file, { source, contexts, usesAriakitButton });
    for (const { node, inherited, tokens } of contexts) {
      const has = (token) => tokens.includes(token);
      const frameModifiers = tokens.filter((token) =>
        /^-?ak-frame-/.test(token),
      );
      if (!inherited && frameModifiers.length && !has("ak-frame"))
        report(
          file,
          source,
          node,
          "frame-base",
          "ak-frame-* modifiers need ak-frame in the same class composition",
        );
      if (
        tokens.some((token) =>
          /^ak-frame-bordering(?:-(?!inherit)[\w[.-]+)?$/.test(token),
        ) &&
        !tokens.some((token) => /^ak-layer-(?:lighten|darken)-/.test(token))
      )
        report(
          file,
          source,
          node,
          "frame-bordering",
          "adaptive bordering needs an explicit ak-layer-lighten-* or ak-layer-darken-* relationship; numeric layers use ak-frame-border/ring",
        );
      if (has("ak-layer") && has("ak-text"))
        report(
          file,
          source,
          node,
          "text-erases-layer",
          "ak-text makes the background transparent; put it on a descendant or use ak-ink",
        );
      if (
        has("ak-frame") &&
        tokens.some((token) =>
          /^(?:border|border-[0248]|border-\[[\d.]+px\])$/.test(token),
        )
      )
        report(
          file,
          source,
          node,
          "frame-native-border",
          "use ak-frame-border for silhouette borders so concentric radius math includes their width",
        );
    }
  }

  if (boundaries) {
    const requiredFrames = [
      "components/ui/Button/index.tsx",
      "components/ui/Popover.tsx",
      "components/ui/Dialog.tsx",
    ];
    for (const file of requiredFrames) {
      const inventory = inventories.get(file);
      if (!inventory) {
        diagnostics.push({
          file,
          line: 1,
          column: 1,
          rule: "migration-boundary",
          message:
            "required shared primitive is missing; update the boundary contract if it moves",
        });
        continue;
      }
      const realFrame = inventory.contexts.some(
        ({ tokens }) =>
          tokens.includes("ak-frame") &&
          tokens.some((token) =>
            /^ak-frame-(?!border|ring|join|row|col|force|cover|start|end|backdrop|m-)[^\s]+/.test(
              token,
            ),
          ),
      );
      if (!realFrame)
        report(
          file,
          inventory.source,
          0,
          "migration-boundary",
          "shared surface needs ak-frame with an explicit radius/padding in an actual class composition",
        );
    }
    const button = inventories.get("components/ui/Button/ClientButton.tsx");
    if (!button?.usesAriakitButton)
      diagnostics.push({
        file: "components/ui/Button/ClientButton.tsx",
        line: 1,
        column: 1,
        rule: "button-boundary",
        message:
          "shared Button must render the imported Ariakit Button; an unused import does not satisfy migration",
      });

    const cssFile = "src/routes/-main.css";
    // Preserve quoted URLs/globs such as @source "dist/*.js" while stripping comments.
    const css =
      sources
        .get(cssFile)
        ?.replace(
          /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\/\*[\s\S]*?\*\//g,
          (match, quoted) => quoted ?? match.replace(/[^\n]/g, " "),
        ) ?? "";
    const cssSource = ts.createSourceFile(
      cssFile,
      css,
      ts.ScriptTarget.Latest,
      true,
    );
    if (!/@import\s+["']@ariakit\/tailwind["']/.test(css))
      report(
        cssFile,
        cssSource,
        0,
        "theme-boundary",
        "import @ariakit/tailwind in the application stylesheet",
      );
    if (/--color-transparent\s*:/.test(css))
      report(
        cssFile,
        cssSource,
        css.search(/--color-transparent\s*:/),
        "transparent-token",
        "--color-transparent overrides ak-layer-transparent semantics; remove the token",
      );
    for (const token of [
      "color-canvas",
      "color-primary",
      "radius-field",
      "spacing-field",
      "radius-card",
      "spacing-card",
      "radius-dialog",
      "spacing-dialog",
      "radius-badge",
      "spacing-badge",
      "spacing-px",
    ]) {
      if (!new RegExp(`--${token}\\s*:`).test(css))
        report(
          cssFile,
          cssSource,
          0,
          "theme-boundary",
          `missing semantic theme token --${token}`,
        );
    }
    const bodyCss = [...css.matchAll(/(?:^|[}\s])body\s*\{([^}]+)\}/g)].some(
      (match) =>
        /@apply[^;]*\bak-layer\b[^;]*\bak-layer-canvas\b/.test(match[1]),
    );
    const root = inventories.get("src/routes/__root.tsx");
    const bodyJsx = root?.contexts.some(({ node, tokens }) => {
      let ancestor = node.parent;
      while (
        ancestor &&
        !ts.isJsxOpeningElement(ancestor) &&
        !ts.isJsxSelfClosingElement(ancestor)
      )
        ancestor = ancestor.parent;
      return (
        ancestor?.tagName.getText(root.source) === "body" &&
        tokens.includes("ak-layer") &&
        tokens.includes("ak-layer-canvas")
      );
    });
    if (!bodyCss && !bodyJsx)
      report(
        cssFile,
        cssSource,
        0,
        "canvas-boundary",
        "body must establish ak-layer ak-layer-canvas in CSS or root JSX",
      );
  }
  return diagnostics.sort(
    (a, b) =>
      a.file.localeCompare(b.file) ||
      a.line - b.line ||
      a.column - b.column ||
      a.rule.localeCompare(b.rule),
  );
}

export function formatDiagnostics(diagnostics) {
  return diagnostics
    .map(
      ({ file, line, column, rule, message }) =>
        `${file}:${line}:${column} [${rule}] ${message}`,
    )
    .join("\n");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const sources = await readMigrationSources();
  const diagnostics = auditMigrationSources(sources);
  if (diagnostics.length) {
    console.error(formatDiagnostics(diagnostics));
    process.exitCode = 1;
  } else
    console.log(
      `ariakit migration: checked ${sources.size} production source files`,
    );
}
