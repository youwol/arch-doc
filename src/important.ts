/**
 * - [[Forward]] is still a work in progress and some available solvers might not work as expected...
- Constraints **only** apply with the solver `seidel` or `jacobi` in [[Forward]]
- In some cases, the `seidel` and `jacobi` solvers may diverge. These cases are
  1. when triangles intersects (in some cases)
  2. when two close triangles make a small angle between them
- [[Remote]] strain is not yet implemented
*/
export namespace Important {}