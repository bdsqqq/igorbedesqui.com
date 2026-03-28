# SUSPEND WITHOUT BLOCKING ★★

**consider first**: [EXHAUSTIVE STATE MODELING](exhaustive-state-modeling.md)

**forces**: a workflow reaches a point where it needs external input —
human reply, CI result, approval. two concerns compete:

- **resume speed** — when the event arrives, resume fast. users notice
  latency.
- **durability** — when the server crashes, recover without data loss.
  correctness matters more than speed.

a single mechanism that handles both makes tradeoffs for one that hurt
the other. serializing on every suspend is durable but slow. keeping
everything in memory is fast but fragile. conflating the two means every
architectural choice is a compromise between the wrong axes.

**therefore**: treat suspension and crash recovery as independent
concerns with independent mechanisms. how the workflow suspends (state
transition, process exit, queue message) is a separate decision from how
it recovers (snapshots, event-sourcing, rehydration). each can be
optimized for its own axis without dragging the other along.

**intended consequences**:

- ✓ resume path optimized for speed without sacrificing durability
- ✓ recovery path optimized for correctness without constraining suspend
- ✓ can change one mechanism without redesigning the other
- △ two mechanisms means two things to get right

**consider next**: [SELF-EXPIRING STATE](self-expiring-state.md),
[CARRY, DON'T INTERPRET](carry-dont-interpret.md)
