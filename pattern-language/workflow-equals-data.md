# WORKFLOW = DATA \*\*

**forces**: you're building a system where agents perform multi-step work
that may be interrupted. a running process is opaque while alive and gone
when it dies. you want workflows to survive interruptions (container
restarts, agent crashes). you also want them inspectable, queryable,
and debuggable as simple data.

**therefore**: a workflow is a record with state, not a running process.
the record describes current phase, accumulated context, and what event
it's waiting for. processes come and go; the record persists.

**intended consequences**:

- ✓ container restarts don't lose work — records rehydrate on boot
- ✓ workflows queryable as data (list, filter, inspect)
- ✓ clear separation: static metadata vs dynamic execution state
- △ requires explicit state machine design

**consider next**: [EXHAUSTIVE STATE MODELING](exhaustive-state-modeling.md),
[HUMAN-FRIENDLY IDENTIFIERS](human-friendly-identifiers.md)
