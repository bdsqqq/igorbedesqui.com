# COLOCATE BY BEHAVIOR \*\*

**consider first**: [INDEPENDENTLY INVOCABLE UNITS](independently-invocable-units.md)

**forces**: code must be organized somehow. two axes compete.

organizing by TECHNICAL LAYER (hooks/, ui/, api/, styles/) groups code
by what it IS. adding or modifying a feature means touching files
scattered across the codebase. understanding one feature requires reading
across multiple directories. the distance between related code creates
coupling that's invisible in the file tree.

organizing by FEATURE (triggers/, notify/, review/) groups code by what
it DOES. a single feature lives in one place. adding a feature means
adding one module. deleting a feature means deleting one directory.

the same force appears at every scale: separating HTML, CSS, and JS into
distant files vs. CSS-in-JS with JSX. separating hooks/ from components/
vs. colocating hooks with the components that use them. horizontal splits
by layer vs. vertical slices by behavior.

**therefore**: organize by feature, not by technical layer. a module
contains everything needed to understand and modify one behavior — its
types, logic, adapters, and tests. the directory name describes what the
code does, not what technology it uses. a contributor looking for "how
workflows start" navigates to triggers/, not webhooks/.

**intended consequences**:

- ✓ feature changes are localized — add/modify in one place
- ✓ navigation by behavior — find code by what it does
- ✓ deleting a feature means deleting one module
- △ shared utilities still need a home (lib/)
- △ cross-feature concerns require deliberate coordination

**consider next**: [INJECT AT THE BOUNDARY](inject-at-the-boundary.md)
