import { FlatVectors, Vectord, Vector } from './types'
import { Constraint } from './constraint'


/**
 * A surface, or surface discontinuity, is an active object which will pertubed
 * displacement, strain and stress field around it. Surface discontinuities can represent
 * different type of geological objects such as [faults](https://en.wikipedia.org/wiki/Fault_(geology)), 
 * [diapirs](https://en.wikipedia.org/wiki/Diapir) or [magma chambers](https://en.wikipedia.org/wiki/Magma_chamber).
 * 
 * To access computed values on [[Surface]], see the [[Solution]] class, or use the method [[Surface.displ]]
 * 
 * A [[Surface]] is part of a **Arch** [[Model]].
 * 
 * <center><img style="width:60%; height:60%;" src="media://fault.jpg"></center>
 * 
 * If you want to switch from the **Okada** to **Poly3D** convention, you will have to use the [[BurgerFilter]] class.
 */
export class Surface {

    nbTriangles(): number {return}
    nbVertices() : number {return}

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
    constructor(position: FlatVectors, index: FlatVectors) {}

    /**
     * Change the geometry of the discontinuities
     * @param position The new position of the vertices making the discontinuities
     */
    changeCoordinates(position: FlatVectors) {}

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
     * a number, a callback
     * or an array of values for which the length shoud be equal to the number of triangles making the [[Surface]].
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
    setBC(axis: number | string, type: string, value: number|Vectord|Function): void {}

    /**
     * @brief Convenient method to set the boundary values directly using a [[FlatVectors]]. As we
     * set the values for the 3 axis at the same time, it is obvious that the size of the array should
     * be equal to the number of triangles, `t`, times 3: `value.length === 3*t`. If a number is provided,
     * all axis of all the triangles will be set to this number.
     * @param value
     */
    setBCValues(value: number|Array<number>): void {}

    /**
     * Set the current displacement using a flar array [[Vectord]]
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
     * @see [[Solution.burgers]]
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
    displ(local: boolean, atTriangles: boolean): FlatVectors {return }

    // setDispl(displ: FlatVectors) { }

    /**
     * Reset displacement to zero
     */
    resetDispl() { }

    /**
     * @brief Get the computed displacement discontinuity on the positive side of the triangles.
     * If you do the substraction of [[displPlus]] and [[displMinus]], you should retrieve [[displ]]
     * @param {boolean} local Local or global coordinate system
     * @param {boolean} atTriangles Compute at triangle center, at vertices otherwise
     * @param {number} delta A small value (epsilon)
     * @returns {FlatVectors} A flat vector
     * @see [[displMinus]]
     * @see [[Solution.burgersPlus]]
     */
    displPlus(local: boolean=true, atTriangles: boolean=true, delta: number=1e-7): FlatVectors {return }

    /**
     * @brief Get the computed displacement discontinuity on the negative side of the triangles.
     * If you do the substraction of [[displPlus]] and [[displMinus]], you should retrieve [[displ]]
     * @param {boolean} local Local or global coordinate system.
     * @param {boolean} atTriangles Compute at triangle center, at vertices otherwise
     * @param {number} delta A small value (epsilon)
     * @returns {FlatVectors} A flat vector
     * @see [[displPlus]]
     * @see [[Solution.burgersMinus]]
     */
    displMinus(local: boolean=true, atTriangles: boolean=true, delta: number=1e-7): FlatVectors {return }

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
    setDisplFromVertices(burgers: number[]): void {}

    /**
     * Set the slip vectors defined at triangles (no interpolation)
     * @param burgers 
     */
    setDisplFromTriangles(burgers: number[]): void {}

    /**
     * @brief Add a pre-defined or a user-defined constraint to this surface
     * @param c The constraint
     * @default None There's no constraint
     * @see [[Constraint]]
     */
    addConstraint(c: Constraint): void {return }

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


/**
 * @brief Allows to change the convention of the computed displcement discontinuity (also known
 * as Burger vectors).
 * By default, the convention is as described by Okada. For the user, it is possible to use another
 * convention such as the Poly3D convention by mean of this class.
 * <br><br>
 * In order to do that, you will have to write the following code:
     * ```javascript
     * // Switch from Okada to Poly3D convention
     * //
     * // We recall that the Okada convention (the default one)
     * // is as follow:
     * // filter.setAxisOrder (['normal', 'strike', 'dip'])
     * // filter.setAxisRevert([ false  ,  false  ,  false])
     * 
     * const filter = new arch.BurgerFilter()
     * 
     * //                     x       y         z
     * filter.setAxisOrder (['dip', 'strike', 'normal'])
     * filter.setAxisRevert([ true,  false  ,  false  ])
     * 
     * const burgers = filter.apply( surface.displ() )
     * ```
 * Then, your `burgers` variable will be in Poly3D convention. 
 * 
 * <center><img style="width:60%; height:60%;" src="media://convention.jpg"></center>
 * 
 * <center><blockquote><i>
 * The right image shows the default convention used in Arch (Okada) for which the z-axis is
 * along the dip direction but reverted compared to Poly3D convention (left image). The x-axis
 * corresponds to the normal of the triangular element, whereas for Poly3D it is the dip direction.
 * </i></blockquote></center>
 */
 export class BurgerFilter {
    /**
     * @brief The order of the axis. An array of 3 strings which can be either `dip`,
     * `strike` or `normal`. Typically, this property is used to order the components
     * of the displacement when calling [[Surface.displ]], [[Surface.displPlus]] or [[Surface.displMinus]]
     * (or equivalently [[Solution.burgers]], [[Solution.burgersPlus]] or [[Solution.burgersMinus]]).
     * @default ['normal','strike','dip']
     * ```javascript
     * // This correspond to the Okada convention which is the default one
     * // Therefore, the following filter does nothing
     * const filter = new arch.BurgerFilter()
     * filter.setAxisOrder (['dip', 'strike', 'normal'])
     * filter.setAxisRevert([ true,  false  ,  false  ])
     * const burgers = filter.apply( surface.displ() )
     * ```
     * @see [[axisRevert]]
     */
    setAxisOrder( order: [string, string, string]) {}

    /**
     * @brief Revert of the displacement vectors axis.
     * @default [false,false,false]
     * @see [[axisOrder]]
     */
    setAxisRevert(revert: [boolean, boolean, boolean]) {}

    /**
     * @brief Apply the filter to a given burger list (provided as a flat array)
     * @param burgers The provided Burger vectors from [[Surface.displ]],
     * [[Surface.displPlus]] or [[Surface.displMinus]] (or equivalently [[Solution.burgers]],
     * [[Solution.burgersPlus]] or [[Solution.burgersMinus]]).
     * * @example
     * ```javascript
     * // Switch to the Poly3D convention
     * const filter = new arch.BurgerFilter()
     * filter.setAxisOrder (['dip', 'strike', 'normal'])
     * filter.setAxisRevert([ true,  false  ,  false  ])
     * const displ = filter.apply( surface.displPlus() )
     * ```
     */
    apply(burgers: Vectord): Vectord {return}

    /**
     * @brief Convenient method to switch to Okada convention (default one). It corresponds to
     * ```javascript
     * axisOrder  = ['normal', 'strike', 'dip']
     * axisRevert = [false   , false   , false]
     * ```
     */
    setupOkada(): void {}

    /**
     * @brief Convenient method to switch to Poly3D convention. It corresponds to
     * ```javascript
     * axisOrder  = ['dip', 'strike', 'normal']
     * axisRevert = [true , false   , false   ]
     * ```
     */
    setupPoly3D(): void {}
}
