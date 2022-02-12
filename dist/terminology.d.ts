/**
 * - **Stress arrays**: All stress arrays are in the form `[xx,xy,xz,yy,yz,zz]`
```ts
const stress = [1,6,3,5,2,8]
```
- **Flat array**: a flat array is an array of dimension 1. As an example, a flat array
for representing 3D coordinates of points will be `[x,y,z ... x,y,z]`.
Another example is for stresses in flat array: `[xx,xy,xz,yy,yz,zz...xx,xy,xz,yy,yz,zz]`
```ts
// A list of 3 stresses
const stresses = [1,6,3,5,2,8, 1,6,3,5,2,8, 1,6,3,5,2,8]
```
- **Active object**: a triangulated surface that will perturbed the nearby stress
field due to non-zero displacements on some or all of the triangles maling this object.
Examples of active objects are faults, salt structures and magma chambers. They are represented
by the class [[Surface]]
- **Passive object**: as opposed to an active object, a passive object will not affect the nearby
stress field. It is mainly used to compute the stress field at its point locations. They are represented
by observation points (or grids).
*/
export declare namespace Terminology { }
