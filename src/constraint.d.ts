import { Vector, Vectord } from './types'

/**
 * Empty interface for a constraint
 */
export interface Constraint {
}

/**
 * Contraint Function signature
 * @param t an array of length 3 representing either the traction or the displacement vector
 * @param id The id of the triangle for the considered triangulated discontinuity (surface)
 * @return an array of length 3 representing either the modified traction or displacement vector
 */
export type ConstraintFct = (t: number[], id: number) => number[]

// --------------------------------------------------------------------------

/** 
 * Represent a user-defined constraint on traction. The implementation is
 * provided by a callback.
 * ```javascript
 * const c = new arch.UserTic( t => [t[0]<0?0:t[0], t[1], t[2]] )
 * surface.addConstraint(c)
 * ```
 * 
 * Another example for coulomb friction
 * ```javascript
 * const c = new arch.UserTic()
 * 
 * // We assume a distribution of friction and cohesion
 * // Arrays frictionArray and cohesionArray are given for triangles
 * 
 * // tract is the traction before convertion to displacement
 * // id    is the id of the triangle for the considered surface
 * c.setFunction( (tract, id) => {
 *      const μ = frictionArray[id]
 *      const C = cohesionArray[id]
 *      const σ = tract[0]
 *      const τ = μ*σ + C
 *      const t = Math.sqrt(tract[1]**2 + tract[2]**2)
 *
 *      if (t >= τ) {
 *          const δ = τ/t
 *          tract[1] -= δ*tract[1]
 *          tract[2] -= δ*tract[2]
 *      } else {
 *          tract[1] = tract[2] = 0 // stick
 *      }
 *
 *      return tract
 * })
 * 
 * surface.addConstraint(c)
 * ```
 * @see [[UserDic]]
 * @category Constraints
 */
export class UserTic implements Constraint {
    /**
     * @param cb The arrow function
     * @see func
     */
    constructor(cb: Function)

    /**
     * @brief The arrow function that will change the ``.
     * This arrow function should return the modified traction
     */
    setFunction( cb: ConstraintFct)

    /**
     * @brief Call the arrow function [[func]] (provided for convenience)
     */
    //evaluateAt(x: number, y: number, z: number, tx: number, ty: number, tz: number): [number, number, number]
}

/**
 * Coulomb friction constraint.
 * Compare to other [implementation](https://www.researchgate.net/publication/257550613_Linear_complementarity_formulation_for_3D_frictional_sliding_problems),
 * here we do not use linear approximation of the frictional cone into a pyramid. The technique used here is described
 * in [this publication](https://link.springer.com/article/10.1007/s10596-009-9170-x).
 * 
 * Example of use
 * @example
 * ```javascript
 * const surface = new arch.Surface(vertices, triangles)
 * const c1 = new arch.Coulomb()
 * c1.setFriction([0, 0, 0.1, 0.2, 0, 0 ...]) // length = nb triangles for surface
 * // or c1.setFriction(0.3)
 * c1.setCohesion(0.01)
 * surface.addConstraint(c1)
 * ```
 * <center><img style="width:40%; height:40%;" src="media://friction.jpg"></center>
 * <center><blockquote>
 * Example of using the Coulomb friction constraint in order to study the principal stress directions inside an extensional relay.
 * Excerpt from:<a href="https://www.sciencedirect.com/science/article/abs/pii/S0191814110000179"><i> Soliva, Roger, et al. "Field evidences for the role of static friction on fracture orientation
 * in extensional relays along strike-slip faults: comparison with photoelasticity and 3-D numerical
 * modeling." Journal of Structural Geology 32.11 (2010): 1721-1731</a></i>
 * </blockquote></center>
 * @see [[UserTic]]
 * @category Constraints
 */
export class Coulomb implements Constraint {
    constructor()
    constructor(friction: number|string|Vectord, cohesion: number|string|Vectord)

    /**
     * @brief The static sliding friction coefficient
     * @default 0
     */
    public friction: number | string | Vectord
    
    /**
     * @brief The cohesion
     * @default 0
     */
    public cohesion: number | string | Vectord

    /**
     * If you want to test the linearization problem, as in Kaven et al., by means of a simpler
     * numerical implementation of the friction pyramid, then set this flag to true. Otherwise
     * (default value), we use the non-linear (quadratic) constraint.
     * <center><img style="width:40%; height:40%;" src="media://fric-cone.jpg"></center>
     * <center><blockquote>
     * Excerpt from:<a href="https://link.springer.com/article/10.1007/s10596-011-9272-0"><i> Kaven, 
     * J. O., Hickman, S. H., Davatzes, N. C., & Mutlu, O. (2012). Linear complementarity formulation 
     * for 3D frictional sliding problems. Computational Geosciences, 16(3), 613-624.</a></i>
     * </blockquote></center>
     * @default false
     */
    // public linear: boolean

    /**
     * @brief The lambda coefficient in [0..1] (default = 0).
     * Description of this parameter will come soon...
     */
    //public lambda: number | string | Function

    /**
     * @brief If the surface has to stick when the Coulomb criterion is not met (default = true)
     */
    //public stick: boolean
}

// --------------------------------------------------------------------------

/**
 * Represent a user-defined constraint on displacement. The implementation is
 * provided by a callback.
 * ```javascript
 * const c = new arch.UserDic( (u, id) => {
 *      if (u[0]<0) u[0]=0
 *      return u
 * })
 * surface.addConstraint(c)
 * ```
 * @see [[UserTic]]
 * @category Constraints
 */
export class UserDic implements Constraint {
    constructor()

    /**
     * @param cb The arrow function
     * @see func
     */
    constructor(cb: ConstraintFct)

    /**
     * @brief The arrow function that will change the `(dx, dy, dz)` displacement at point `(x, y, z)`.
     * This arrow function should return the modified displacement
     */
    func: (x: number, y: number, z: number, dx: number, dy: number, dz: number) => Vector

    /**
     * @brief Call the arrow function [[func]] (provided for convenience)
     */
    //evaluateAt(x: number, y: number, z: number, dx: number, dy: number, dz: number): [number, number, number]
}
