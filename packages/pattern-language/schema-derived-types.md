# SCHEMA-DERIVED TYPES \*\*

**consider first**: [INDEPENDENTLY INVOCABLE UNITS](independently-invocable-units.md),
[ERRORS AS VALUES](errors-as-values.md)

**forces**: you need runtime validation (external data is untrustworthy)
AND compile-time types (internal code needs type safety). maintaining
both separately means they drift apart — change the type, forget the
validator. the shape of data is a requirement that should be declared
once, not maintained in two places.

**therefore**: define schema once; derive type from schema. single source
of truth for shape and type. validation and type inference from the same
artifact.

**intended consequences**:

- ✓ types and validation always in sync
- ✓ detailed error messages for free
- ✓ the schema IS the documentation of data shape
- △ schema library API may be less widely known
