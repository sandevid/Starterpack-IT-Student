# Property-Based Tests

This directory contains property-based tests for the Starterpack IT Student application using fast-check.

## Overview

Property-based testing verifies that certain properties hold true across a wide range of randomly generated inputs. Unlike traditional unit tests that check specific examples, property tests validate universal invariants.

## Test Files

### calendar.property.test.ts

Tests calendar event properties:

- **Property 51: Date Round-Trip Preservation** - Verifies that formatting a date for storage and then parsing it for display produces an equivalent date value
- **Property 14: Calendar Event Ordering** - Verifies that calendar events are always sorted chronologically

### goals.property.test.ts

Tests goal progress calculation properties:

- **Property 23: Goal Progress Calculation** - Verifies that progress percentage equals (completed steps / total steps) × 100, bounded between 0 and 100
- **Property 31: Goal Progress Boundary Cases** - Verifies that progress is 100% when all steps are complete and 0% when there are no steps

### validation.property.test.ts

Tests validation schema properties:

- **Property 21: Todo Tag Validation** - Verifies that only valid tags (math, english, science, ipa, ips, general) are accepted
- **Property 33: Playlist URL Validation** - Verifies that only Spotify URLs containing "open.spotify.com" are accepted

### rls.property.test.ts

Tests Row Level Security (RLS) data isolation properties:

- **Property 6: Data Isolation via RLS** - Verifies that users can only access their own data through filtering logic

Note: These are unit tests that verify the RLS filtering concept. For full integration testing with a real database, see `tests/TEST-DATABASE-SETUP.md`.

## Running Tests

Run all property-based tests:

```bash
npm test -- tests/properties/
```

Run a specific test file:

```bash
npm test -- tests/properties/calendar.property.test.ts
```

Run with verbose output:

```bash
npm test -- tests/properties/ --reporter=verbose
```

## Test Configuration

Property-based tests use the following configuration:

- **Test runs**: Each property is tested with 100 random inputs by default (configured via fast-check)
- **Shrinking**: When a test fails, fast-check automatically shrinks the failing input to find the minimal counterexample
- **Seeding**: Failed tests display a seed value that can be used to reproduce the exact failure

## Understanding Property Test Output

When a property test fails, you'll see:

```
Error: Property failed after 28 tests
{ seed: 469491187, path: "27", endOnFailure: true }
Counterexample: [new Date(NaN)]
Shrunk 0 time(s)
```

- **seed**: Random seed used for this test run (use to reproduce)
- **path**: Path through the shrinking process
- **Counterexample**: The minimal input that caused the failure
- **Shrunk X time(s)**: How many times fast-check simplified the failing input

## Adding New Property Tests

To add a new property test:

1. Create or open a test file in `tests/properties/`
2. Import fast-check: `import { fc, test } from '@fast-check/vitest'`
3. Use `test.prop()` to define a property test:

```typescript
test.prop([fc.integer(), fc.integer()])('addition is commutative', (a, b) => {
  expect(a + b).toBe(b + a)
})
```

4. Document which property from the design document you're testing

## Property Test Generators

Common fast-check generators used in these tests:

- `fc.string({ minLength, maxLength })` - Random strings
- `fc.integer({ min, max })` - Random integers
- `fc.date({ min, max })` - Random dates
- `fc.boolean()` - Random booleans
- `fc.uuid()` - Random UUIDs
- `fc.array(generator, { minLength, maxLength })` - Random arrays
- `fc.record({ field: generator })` - Random objects
- `fc.constantFrom(...values)` - Pick from specific values
- `fc.option(generator, { nil })` - Optional values

## Best Practices

1. **Document properties**: Always include a comment referencing the design document property number
2. **Filter invalid inputs**: Use `.filter()` to exclude invalid values (e.g., `NaN` dates)
3. **Keep tests focused**: Each test should verify one property
4. **Use meaningful names**: Test names should clearly describe the property being tested
5. **Handle edge cases**: Consider boundary conditions (empty arrays, zero values, etc.)

## References

- [fast-check documentation](https://github.com/dubzzz/fast-check)
- [Property-Based Testing Guide](https://github.com/dubzzz/fast-check/blob/main/documentation/Guides.md)
- Design Document: `.kiro/specs/starterpack-it-student/design.md` (Correctness Properties section)
