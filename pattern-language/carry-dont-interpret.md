# CARRY, DON'T INTERPRET \*\*

**consider first**: [INDEPENDENTLY INVOCABLE UNITS](independently-invocable-units.md),
[SUSPEND WITHOUT BLOCKING](suspend-without-blocking.md)

**forces**: when a step suspends, the system must persist enough to
resume it later. steps have internal continuation state — thread IDs,
checkpoints, partial results — that varies by implementation.

if the orchestrator interprets step state, it couples to every step
implementation. add a new step type, update the orchestrator. change a
step's internal format, update the orchestrator. the orchestrator becomes
a bottleneck that must understand all steps simultaneously.

but opacity has costs. operations and debugging benefit from visibility
into what steps are doing. the temptation to let the orchestrator peek
inside — to validate, normalize, display — recurs every time someone
adds a new step, builds a dashboard, or debugs a stuck workflow.

**therefore**: steps return an opaque continuation that the orchestrator
stores and returns unchanged on resume. only the step that produced the
state interprets it. if the orchestrator needs visibility, extract a
small stable set of shared metadata (status, timing, identity) separate
from the opaque payload.

**intended consequences**:

- ✓ orchestrator stays generic — no coupling to step internals
- ✓ steps evolve their continuation format independently
- ✓ adding a new step type requires no orchestrator changes
- △ deep inspection requires step-owned tooling, not central queries
- △ version migration of opaque state is a step concern
