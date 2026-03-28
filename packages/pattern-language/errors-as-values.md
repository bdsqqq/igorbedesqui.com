# ERRORS AS VALUES \*\*

**consider first**: [INDEPENDENTLY INVOCABLE UNITS](independently-invocable-units.md)

**forces**: you want callers to handle expected failures (git command
fails, file not found) explicitly. but you also want unexpected failures
(null pointer, out of memory) to propagate without ceremony. try/catch
conflates both — error types invisible to callers, compositions of
fallible operations become nested pyramids.

throwing also makes failure implicit — it's not in the function signature.
the caller discovers errors at runtime, not compile time. this violates
INDEPENDENTLY INVOCABLE UNITS: a requirement (error handling) is hidden
rather than declared at the boundary.

**therefore**: make expected failures values in the type system. return
discriminated results; compose via chaining. reserve exceptions for truly
unexpected errors.

**intended consequences**:

- ✓ error types visible in signatures — callers know what can fail
- ✓ short-circuit composition without nesting
- ✓ tagged unions enable exhaustive matching at handling sites
- △ new contributors must learn the result API

**consider next**: [SCHEMA-DERIVED TYPES](schema-derived-types.md)
