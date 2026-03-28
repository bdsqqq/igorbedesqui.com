# RECONCILE TO DESIRED STATE \*\*

**consider first**: [EXHAUSTIVE STATE MODELING](exhaustive-state-modeling.md)

**forces**: autonomous agents are useful because they're stochastic —
they explore, improvise, take unexpected actions. restricting their side
effects limits capability. but you need guaranteed lifecycle outcomes:
PRs created, notifications sent, retries bounded. autonomy and
guarantees pull in opposite directions.

**therefore**: wrap agent execution in a deterministic lifecycle. the
machine defines desired outcomes as states. each transition checks
current reality and converges — it doesn't assume what the agent did or
didn't do. the agent takes its shot; the machine ensures the target is
hit.

**intended consequences**:

- ✓ agents retain full autonomy within steps
- ✓ lifecycle outcomes guaranteed regardless of agent behavior
- ✓ transitions are idempotent — safe to re-run after crash
- △ some work may be duplicated (agent creates PR, machine also checks/creates)

**consider next**: [SUSPEND WITHOUT BLOCKING](suspend-without-blocking.md)
