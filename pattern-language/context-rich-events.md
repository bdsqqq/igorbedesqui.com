# CONTEXT-RICH EVENTS \*\*

**consider first**: [WORKFLOW = DATA](workflow-equals-data.md)

**forces**: autonomous agents act on your behalf — you need to
reconstruct what happened after the fact. scattered log lines optimized
for writing (`log("payment failed")`) can't answer the questions you
actually ask during debugging: "which workflow, for which issue, at
what step, with what inputs?"

low-context logs force you to grep across files, correlate by timestamp,
and hope the right fields were included. they answer "something
happened" but not "what happened to THIS request." the more autonomous
the system, the wider the gap between what was logged and what you need
to know.

**therefore**: emit context-rich events at the granularity of significant
operations. each event carries the full context needed to understand that
operation in isolation — identifiers, business state, timing, outcome.
one event per operation, not many log lines scattered across the call
stack. transport (console, structured platform, both) is an orthogonal
decision.

**intended consequences**:

- ✓ debugging becomes querying — filter by workflow, step, outcome
- ✓ events are self-contained — no cross-referencing needed
- ✓ high-cardinality fields (workflow ID, issue ID) enable precise queries
- △ requires discipline — every call site must attach context, not just
  a message string
- △ event size grows with context; cost scales with dimensionality

**consider next**: [HUMAN-FRIENDLY IDENTIFIERS](human-friendly-identifiers.md)
