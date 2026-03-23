# EXHAUSTIVE STATE MODELING \*\*

**consider first**: [WORKFLOW = DATA](workflow-equals-data.md)

**forces**: implicit control flow (async functions, if/else chains) hides
unhandled paths. failures surface at runtime, in production, as surprises.
you want the opposite — every possible state and transition explicitly
modeled, with the type system enforcing exhaustive handling. the cost is
upfront design work. the payoff is that impossible states are
unrepresentable and new events force handling at every site.

**therefore**: model workflows as finite state machines with typed states,
events, and transitions. every state declares exactly which events it
accepts and where they lead. the type system rejects unhandled paths at
compile time, not runtime. the machine definition IS the documentation.

**intended consequences**:

- ✓ impossible states are compile errors
- ✓ new events force exhaustive handling
- ✓ machines are serializable data (connects to WORKFLOW = DATA)
- ✓ visual inspection — the machine definition IS the documentation
- △ upfront modeling cost per workflow

**consider next**: [RECONCILE TO DESIRED STATE](reconcile-to-desired-state.md),
[SUSPEND WITHOUT BLOCKING](suspend-without-blocking.md),
[SELF-EXPIRING STATE](self-expiring-state.md)
