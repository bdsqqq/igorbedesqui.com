# HUMAN-FRIENDLY IDENTIFIERS \*\*

**consider first**: [WORKFLOW = DATA](workflow-equals-data.md)

**forces**: identifiers leak into every human touchpoint — logs, URLs,
filenames, slack threads, terminal output. every time someone debugs,
reviews, or discusses work, they interact with IDs. most ID schemes
optimize for machine concerns (uniqueness, collision resistance) and
treat human readability as a non-goal.

but humans are the ones who copy-paste IDs between tools, scan log
output for a specific workflow, sort directories to find recent work,
and glance at a string to know what kind of thing it refers to. when
IDs are opaque, every interaction with the system has a small friction
cost that compounds across a day.

**therefore**: design identifiers for the humans who will read, copy,
sort, and discuss them. an ID should be self-describing (what kind of
thing), temporally sortable (when it was created), and mechanically
selectable (no characters that break copy behavior).

**intended consequences**:

- ✓ reduced friction at every human-ID interaction
- ✓ type and recency visible at a glance without lookup
- ✓ IDs work as filenames, URL slugs, and log keys without escaping
- △ longer than opaque IDs
- △ format encodes assumptions (timestamp granularity, prefix registry)

**consider next**: [INJECT AT THE BOUNDARY](inject-at-the-boundary.md)
