import { FlatVectors, Vectord } from './types'
import { Constraint } from './constraint'
import { Triangle } from './triangle'


/**
 * A surface, or surface discontinuity, is an active object which will pertubed
 * displacement, strain and stress field around it. Surface discontinuities can represent
 * different type of geological objects such as [faults](https://en.wikipedia.org/wiki/Fault_(geology)), 
 * [diapirs](https://en.wikipedia.org/wiki/Diapir) or [magma chambers](https://en.wikipedia.org/wiki/Magma_chamber).
 * 
 * To access computed values on {@link Surface}, see the {@link Solution} class, or use the method {@link Surface.displ}
 * 
 * A {@link Surface} is part of a **Arch** {@link Model}.
 * 
 * <center><img style="width:60%; height:60%;" src="media://fault.jpg"></center>
 * 
 * If you want to switch from the **Okada** to **Poly3D** convention, you will have to use the {@link BurgerFilter} class.
 */
export class Surface {

    nbTriangles(): number

    nbVertices(): number

    /**
     * Compute the seismic moment of this surface, i.e., `M0 = μ.S.Δu`, with μ the shear modulus, S the area
     * of the surface and Δu the mean displacement. The shear modulus is computed form the model Young's modulus
     * and the Poisson's ratio.
     */
    seismicMoment(): number

    /**
     * @brief Get the normals as a FlatArray
     */
    normalsAsAttribute(): FlatVectors

    /**
     * @brief Create a Surface discontinuity given an array representing the
     * flat positions of the vertices and an array representing the indices of the
     * triangles.
     * @param position The vertices coordinates in flat array
     * @param index The triangles indices in flat array
     * @example
     * ```javascript
     * const arch = require('./arch')
     * 
     * // Create a surface made of one triangle
     * const surface = new arch.Surface([0,0,0, 1,0,0, 1,1,0],   [0,1,2])
     * ```
     * 
     * <br/><br/>
     * If you have access to the YouWol library `@youwol/io`, then it is possible to
     * load Gocad surfaces directly from files.
     * @example
     * ```js
     * const fs = require('fs') // 'filesystem' from node.js
     * const io = require('@youwol/io')
     * const arch = require('./arch')
     * 
     * const model = new arch.Model()
     * 
     * const objects  = io.decodeGocadTS( fs.readFileSync(filename, 'utf8') )
     * objects.forEach( object => {
     *      const vertices  = object.positions
     *      const triangles = object.indices
     *      const surface   = new arch.Surface(vertices, triangles)
     *      model.addSurface(surface)
     * })
     * ```
     */
    constructor(position: FlatVectors, index: FlatVectors)

    /**
     * Change the geometry of the discontinuities
     * @param position The new position of the vertices making the discontinuities
     */
    changeCoordinates(position: FlatVectors)

    /**
     * @brief Set the boundary type and value for each axis of the triangles making
     * a surface discontinuity.
     * 
     * For instance, in Okada convention, setting, for the x-axis, the boundary condition type to
     * traction and its value > 0 is equivalent to applying a "pressure".
     * 
     * @param {number|string} axis The axis index or the axis name.
     * For axis index it can be either 0 for the normal direction,
     * 1 for the strike direction or 2 for the dip direction.
     * For the string value, it can be either `x` or `normal`, `y` or `strike`, `z` or `dip`.
     * @param {string} type The type of boundary condition for the considered axis. For traction condition,
     * value can be either `t`, `0`, `free`, `traction`, `neumann` or `unknown`. All these values have the same 
     * meaning. For displacement condition, value can be either `b`, `1`, `displ`, `displacement`, `fixed`,
     * `dirichlet`, `locked` or `imposed`. All these values have the same meaning.
     * When an axis is free, it means that the provided boundary value will a traction component (along the axis)
     * since the displacement is unknown. Similarly, when the boundary condition is `locked`, the
     * provided value is an imposed displacement along the axis.
     * @param {number|Vectord|Function} value The boundary value for the considered axis. It can be either
     * a number, a callback or an array of values for which the length shoud be equal to the number of
     * triangles making the {@link Surface}. If, for a given axis, the condition is `traction`, then this initial value
     * corrsponds to a traction value (i.e., pressure). On the other hand, if the condition id `displacement`, then
     * this value corresponds to an imposed displacement. 
     * 
     * If the value is a callbak, then the signature is 
     * ```javascript
     * cb(x: number, y: number, z: number): number
     * ```
     * and for which (x,y,z) represents the center of the considered triangle.
     * @default Normal axis: type = `locked` and value = `0`
     * @default Strike axis: type = `free` and value = `0`
     * @default Dip axis: type = `free` and value = `0`
     * @example
     * ```javascript
     * const rho = 2100
     * const g = 9.81
     * 
     * // Make the surface to slip along the dip-direction only and allow opening
     * // with internal pressure gradient
     * surface.setBC("dip"   , "free"  , 0)
     * surface.setBC("strike", "locked", 0)
     * surface.setBC("normal", "free"  , (x,y,z) => 1e3 + rho*g*z)
     * ```
     */
    setBC(axis: number | string, type: string, value: number | Vectord | Function): void

    /**
     * @brief Convenient method to set the boundary values directly using a {@link FlatVectors}. As we
     * set the values for the 3 axis at the same time, it is obvious that the size of the array should
     * be equal to the number of triangles, `t`, times 3: `value.length === 3*t`. If a number is provided,
     * all axis of all the triangles will be set to this number.
     * @param value
     */
    setBCValues(value: number | Array<number>): void

    /**
     * Set the current displacement using a flar array {@link Vectord}
     */
    //setDispl(burgers: Vectord): void

    /**
     * @brief Get the imposed or the computed (after solving the model) displacement vectors
     * on this Surface as a flat array (also called Burger's vectors).
     * Note that this attribute is provided at triangles, not at vertices. This is why you have the
     * second parameter `atTriangles`
     * @param local True if you want displacement vectors in local coordinate system (e.g., to
     * display iso-contours on the surface), false for the global coordinate system (e.g., if
     * you want to deform the surface according to the displacement field)
     * @param atTriangles True if you want the returned displacement field to be at triangles,
     * otherwise it will be defined (interpolated) at vertices (e.g., if you want to deform the
     * surface according to the displacement field)
     * @returns {FlatVectors} A flat array of displacement vectors
     * @see {@link Solution.burgers}
     * @example
     * ```javascript
     * // Get the displacement field at nodes in global coordinate system
     * const displ = surface.displ(false, false)
     * 
     * // Iterating first way
     * for (let i=0; i<displ.length; i+=3) { // notice the increment since the array is flat
     *     console.log(displ[i], displ[i+1], displ[i+2])
     * }
     * 
     * // Iterating second way
     * for (let i=0; i<displ.length/3; i++) {
     *     console.log(displ[3*i], displ[3*i+1], displ[3*i+2])
     * }
     * ```
     */
    displ(local: boolean, atTriangles: boolean): FlatVectors

    // setDispl(displ: FlatVectors) { }

    /**
     * Reset displacement to zero
     */
    resetDispl()

    /**
     * @brief Get the computed displacement discontinuity on the positive side of the triangles.
     * If you do the substraction of {@link displPlus} and {@link displMinus}, you should retrieve {@link displ}
     * @param {boolean} local Local or global coordinate system (default true)
     * @param {boolean} atTriangles Compute at triangle center, at vertices otherwise (default true)
     * @param {number} delta A small value call epsilon (default 1e-7)
     * @returns {FlatVectors} A flat vector
     * @see {@link displMinus}
     * @see {@link Solution.burgersPlus}
     */
    displPlus(local: boolean, atTriangles: boolean, delta: number): FlatVectors

    /**
     * @brief Get the computed displacement discontinuity on the negative side of the triangles.
     * If you do the substraction of {@link displPlus} and {@link displMinus}, you should retrieve {@link displ}
     * @param {boolean} local Local or global coordinate system (default true)
     * @param {boolean} atTriangles Compute at triangle center, at vertices otherwise (default true)
     * @param {number} delta A small value called epsilon (default 1e-7)
     * @returns {FlatVectors} A flat vector
     * @see {@link displPlus}
     * @see {@link Solution.burgersMinus}
     */
    displMinus(local: boolean, atTriangles: boolean, delta: number): FlatVectors

    /**
     * Get the slip vectors as a flat array at vertices (interpolate)
     * @param local True when using triangle local coordinate systems
     */
    //getDisplAtVertices(local: boolean): number[]

    /**
     * Get the slip vectors as a flat array at triangles (no interpolation)
     * @param local True when using triangle local coordinate systems
     * @example
     * Interpolate slip vectors from vertices to triangles
     * ```ts
     * // Convert Burgers defined at vertices, to triangles (local csys) 
     * const burgers = [...] // displ defined at vertices (from a file)
     * surface.setDisplFromVertices(burgers)
     * burgers = surface.getDisplAtTriangles(true)
     * // Now burgers are at triangles (interpolated)
     * ```
     */
    //getDisplAtTriangles(local: boolean): number[]

    /**
     * Set the slip vectors defined at vertices (interpolate)
     * @param burgers 
     */
    setDisplFromVertices(burgers: number[]): void

    /**
     * Set the slip vectors defined at triangles (no interpolation)
     * @param burgers 
     */
    setDisplFromTriangles(burgers: number[]): void

    /**
     * @brief Add a pre-defined or a user-defined constraint to this surface
     * @param c The constraint
     * @default None There's no constraint
     * @see {@link Constraint}
     */
    addConstraint(c: Constraint): void

    /**
     * Iterate over all {@link Triangle} making this {@link Surface}.
     * 
     * Example:
     * ```js
     * surface.forEachTriangle( t => {
     *      console.log('area', t->area())
     *      console.log('displ', t->displ())
     * })
     * ```
     */
    forEachTriangle(cb: (t: Triangle, i: number) => void): void

    /**
     * Iterate over all vertices making this {@link Surface}.
     * 
     * Example:
     * ```js
     * surface.forEachVertex( v => {
     *      console.log(`vertex index ${v.index} has position ${v.position}`)
     * })
     * ```
     */
    forEachVertex(cb: (v: { position: number[], index: number }, i: number) => void): void

    /**
     * @brief Get the triangle's normal at index i
     * @param i The index of the triangle
     * @example
     * ```ts
     * const n = surface.normal(3)
     * console.log(`Normal of triangle index 3 is ${n}`)
     * ```
     */
    // normal(i: number): Vector {return }

    /**
     * @brief Get the triangle's center at index i
     * @param i The index of the triangle
     * @example
     * ```ts
     * for (let i=0; i<surface.nbTriangles; ++i) {
     *   console.log(`Center of triangle index ${i} is ${surface.center(i)}`)
     * }
     * ```
     */
    // center(i: number): Vector {return }
}
