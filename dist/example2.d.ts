/**
 * <center><img style="width:60%; height:60%;" src="media://example2.jpg"></center>
<center><blockquote><i>
Display of the surface discontinuity and Sxy on the observation grid
</i></blockquote></center>

```js
const arch = require('arch')

const model = new arch.Model()
model.setMaterial(0.25, 1, 1000)

// --------------------------------------

const vertices  = [...]
const triangles = [...]
const surface = new arch.Surface(vertices, triangles)
model.addSurface(surface)
surface.setBC("dip",    "free", 0)
surface.setBC("strike", "free", 0)
surface.setBC("normal", "free", (x,y,z) => -2000*9.81*z)

// --------------------------------------

// Add a "pre-defined" Traction-Inequality-constraint (Coulomb friction)
// NOTE: Arch for node.js does not support yet the inequalities. If needed, just let me (Frantz) know...

const c1 = arch.Coulomb()
c1.friction = 0.2
c1.cohesion = 0.01
surface.addConstraint( c1 )

// make dip displacement to be >= 0
const c2 = new arch.MinDispl('dip', 0)
surface.addConstraint(c2)

// --------------------------------------

// Add a "user-defined" Displacement Inequality Constraint
// Make:  0 < dx < 5
const c2 = new arch.UserDic( (x,y,z, dx,dy,dz) => {
    if (dx > 5) dx = 5
    if (dx < 0) dx = 0
    return [dx, dy, dz]
})
surface.addConstraint( c2 )


// --------------------------------------

// Add a remote stress
const rho = 2200 // Density between 0 and 3000
const Rh  = 0.1  // Normalized Sh according to Sv, between 0 and 2 and <= SH
const RH  = 0.6  // Normalized SH according to Sv, between 0 and 2 and >= Sh
const Sv  = rho*9.81*z
const remote = new arch.UserRemote( (x,y,z) => [Rh*Sv, 0, 0, RH*Sv, 0, Sv] )
model.addRemote( remote )

// --------------------------------------

// Solve the problem
const solver   = new arch.Solver(model)
solver.select("parallel")
solver.setNbCores(10)
solver.setMaxIter(2000)
solver.setEps(1e-9)
solver.run()

// --------------------------------------

// Post-process at some random points (with z=0)
const solution = new arch.Solution(model)
const stresses = new Array(100)
    .fill([0,0,0])
    .map( v => [Math.random(), Math.random(), 0])
    .map( p => solution.stressAt(p[0], p[1], p[2]))  // compute the stress at p
    .map (s => console.log(s))
```
 */
export declare namespace Example_2 {
}
