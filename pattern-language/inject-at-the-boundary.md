# INJECT AT THE BOUNDARY \*\*

**consider first**: [INDEPENDENTLY INVOCABLE UNITS](independently-invocable-units.md)

**forces**: workflows need to interact with external systems —
persistence, agents, APIs. you need them testable in isolation (fast,
deterministic). but they also need real external systems in production
(slow, non-deterministic). direct calls couple workflow logic to specific
implementations; mocking at every call site scatters the boundary.

**therefore**: define adapter interfaces for each I/O boundary. inject
implementations. workflows call adapters; adapters call external systems.
the boundary is explicit, singular, and swappable. domain code speaks in
domain terms only — integration modules handle external vocabulary,
payload shapes, and authentication. external service names never appear
in domain code.

**intended consequences**:

- ✓ workflows testable without external systems
- ✓ swap implementations without changing workflow logic
- ✓ domain vocabulary stays coherent — adding integrations doesn't change domain code
- △ one more layer of indirection per I/O boundary
- △ boundary abstractions must be designed carefully

**consider next**: [CARRY, DON'T INTERPRET](carry-dont-interpret.md)
