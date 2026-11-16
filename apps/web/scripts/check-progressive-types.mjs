import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const configPath = path.join(root, "tsconfig.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error)
  throw new Error(
    ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
  );
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
assert.equal(parsed.options.strict, true, "API contracts need strict checking");
assert.equal(
  parsed.options.strictNullChecks ?? parsed.options.strict,
  true,
  "API contracts need strict null checking",
);
const fixtures = parsed.fileNames.filter((file) =>
  /progressive-[^/]+\.types\.tsx$/.test(file),
);
assert.ok(fixtures.length > 0, "no progressive API consumers discovered");
// Consumers do not import the application root merely to obtain bundler globals.
const roots = [
  ...fixtures,
  ...parsed.fileNames.filter((file) => file.endsWith(".d.ts")),
  path.join(root, "node_modules/vite/client.d.ts"),
];
const bandPath = path.join(root, "components/Band.tsx");

function check(loosen = false) {
  const host = ts.createCompilerHost(parsed.options);
  const read = host.readFile.bind(host);
  if (loosen)
    host.readFile = (file) => {
      const source = read(file);
      if (path.resolve(file) !== bandPath || source === undefined)
        return source;
      assert.ok(
        source.includes("gridless?: false;"),
        "negative control no longer matches Band",
      );
      return source.replace("gridless?: false;", "gridless?: boolean;");
    };
  const program = ts.createProgram(roots, parsed.options, host);
  return ts.getPreEmitDiagnostics(program);
}
const baseline = check();
if (baseline.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(baseline, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (file) => file,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else {
  // An in-memory compiler host weakens one real union; the working tree is untouched.
  const negative = check(true);
  assert.ok(
    negative.some(
      (diagnostic) =>
        diagnostic.code === 2578 &&
        diagnostic.file?.fileName.endsWith("progressive-layouts.types.tsx"),
    ),
    "loosened mode union was not detected by an unused @ts-expect-error",
  );
  console.log(
    `progressive APIs: ${fixtures.length} consumer fixtures typechecked; weakened-union negative control rejected`,
  );
  console.log(
    `strictNullChecks=true; exactOptionalPropertyTypes=${parsed.options.exactOptionalPropertyTypes ?? false} (explicit undefined follows the absent-prop path)`,
  );
}
