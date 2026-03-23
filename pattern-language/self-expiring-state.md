# SELF-EXPIRING STATE \*

**consider first**: [EXHAUSTIVE STATE MODELING](exhaustive-state-modeling.md),
[SUSPEND WITHOUT BLOCKING](suspend-without-blocking.md)

**forces**: long-lived resources wait for events that might never arrive —
the human forgot, CI never reported back, the webhook was lost. orphaned
resources accumulate: in-memory state consumes memory, files consume
disk, stale entries pollute listings, and operators are misled into
thinking work is in progress.

the obvious fix is an external sweeper — a cron job that scans for stale
resources and cleans them up. but external sweepers add operational
complexity (another process to monitor, another failure mode) and they
separate the retention policy from the resource that defines it. the
timeout rule lives in the sweeper config; the resource definition lives
elsewhere. they drift apart.

**therefore**: resources declare their own expiration. the timeout and
its consequence are part of the resource definition, not an external
process. when a resource has outlived its deadline, the system reclaims
it — no sweeper needed. the retention policy is visible where the
resource is defined, not hidden in an external cron.

**intended consequences**:

- ✓ no orphaned resources — every suspended resource has a deadline
- ✓ retention policy colocated with definition — visible, reviewable
- ✓ self-contained — no external processes to deploy or monitor
- △ only applicable where resources have a defined lifecycle
- △ timeout duration is a judgment call per resource type

**consider next**: [RECONCILE TO DESIRED STATE](reconcile-to-desired-state.md)
