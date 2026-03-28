# INDEPENDENTLY INVOCABLE UNITS \*\*

**forces**: coupling to infrastructure (server, runtime, specific DI
container) makes testing slow, composition rigid, and reasoning
local-only. a component that requires its host context to function can't
be tested in isolation, can't be composed freely, and can't be understood
without understanding its environment.

the same force appears at every scale: a workflow that only runs inside
the server. a function that closes over module state. a react component
that depends on a context provider three levels up. an integration that
hardcodes API calls. in each case, a requirement is implicit — hidden in
the environment rather than declared at the boundary.

**therefore**: shape every significant boundary so it's invocable
standalone — as a function call, a CLI pipe, or a test fixture — without
its host. requirements are declared at the boundary (props, not context;
adapter interfaces, not hardcoded imports; stdin/stdout, not server
routes). the dependency is visible in the signature, not discovered at
runtime.

**intended consequences**:

- ✓ units testable in isolation — fast, deterministic
- ✓ units composable without full system — mix and match
- ✓ dependencies visible in signatures — no hidden requirements
- ✓ agents can self-verify via tests (the laboratory)
- △ explicit dependencies are more verbose than implicit ones

**consider next**: [INJECT AT THE BOUNDARY](inject-at-the-boundary.md),
[ERRORS AS VALUES](errors-as-values.md),
[SCHEMA-DERIVED TYPES](schema-derived-types.md),
[CARRY, DON'T INTERPRET](carry-dont-interpret.md),
[COLOCATE BY BEHAVIOR](colocate-by-behavior.md)
