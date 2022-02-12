import { Model } from './model'
import { FlatVectors, FlatTensors, Vector, Tensor, Vectord, Vectorb } from './types'
import { UserRemote } from './remote'

/*
 * Provides some solvers for
 * 1. Forward modeling ([[Solver]])
 * 2. Slip inversion ([[SlipInversion]]) using any types of data
 * 3. Friction and Cohesion inversion ([[FrictionInversion]]) using any types of data
 * 4. Far field stress inversion (coming very soon...) using any types of data. This part will be done in a separate JavaScript library directly
 */




/**
 * Function callback for the `onProgress` method on [[Solver]]
 * @param position The current iteration
 * @param value The current residual
 * @param context The context. 1 is for the matrix building. 2 is for the system solving.
 * @example
 * ```ts
 * const solver = new arch.Solver(model, 'seidel', 1e-9, 200)
 * solver.onMessage( c => console.log(c) )
 * solver.onProgress( (i, c, context) => {
 *     if (context === 1) {
 *         console.log(`building system: ${c.toFixed(0)}%`)
 *     }
 *     else {
 *         console.log(`iter ${i}: residual ${c}`)
 *     }
 * })
 * ```
 *
 * @category Solvers
 */
export type SolverProgressCB = (position: number, value: number, context: number) => void

/**
 * Function callback for the `onProgress` method on [[Solution]]
 * @param position The current index
 * @param value The current percentage
 * ```ts
 * const solution = solver.run()
 * solution.onProgress( (i,p) => {
 *   console.log(`nb-pts so far: ${i}, realized: ${p.toFixed(0)}%`))
 * }
 * solution.displ(positions)
 * ```
 * @category Solvers
 */
export type SolutionProgressCB = (position: number, value: number) => void


/**
 * @note WARNING: This class is still a work in progress and some available solvers might
 * not work as expected...
 * <br><br>
 * 
 * Create a special solver that can be reused any time if the
 * remote, the boundary values of the surface discontinuities, the young
 * modulus or the density are changed.
 * 
 * Available solvers are `seidel` (default), `jacobi`, `gmres` and `cgns`.
 * 
 * <br><br>
 * Basically, it avoids to rebuild the system matrix each time the remote stresses change,
 * which is time consuming.
 * <br><br>
 * This class is meant to be used for superposition, for teaching
 * purpose, or for investigating new ideas.
 * <br><br>
 * Usage
 * @example
 * ```javascript
 * const solver = arch.Solver(model)
 * 
 * remote.setFunction( (x,y,z) => [1, 0, 0, 0, 0, 0] )
 * solver.run()
 * 
 * const solution = new arch.Solution(model)
 * const U1 = solution.displ(positions)
 * 
 * // Since the remote changed, the solution will be 
 * // recomputed automatically without rebuilding the
 * // system matrix
 * remote.setFunction( (x,y,z) => [0, 1, 0, 0, 0, 0] )
 * solver.run()
 * const U2 = solution.displ(pos)
 * 
 * // ... etc
 * ```
 * 
 * @category Solvers
 */
export class Solver {
    /**
     * Default values are:
     * - solver: `seidel`
     * - tol: 1e-9
     * - maxIter: 200
     * - cores: 1
     */
    constructor(model: Model)

    /**
     * Default values are:
     * - solver: `seidel`
     * - maxIter: 200
     * - cores: 1
     */
    // constructor(model: Model, tol: number)
    /**
     * Default solver is `seidel`
     */
    // constructor(model: Model, tol: number, maxIter: number)

    /**
     * @brief Construct a solver for the model which allows to call multiple time run()
     * without rebuilding the system each time if and only if:
     * - the number of triangles in the model does not change
     * - the geometry of the surfaces changed
     * - the bc type of each triangle does not change
     * - we do not change the poisson's ratio
     * 
     * On the other hand, it is possible to
     * - change the remote
     * - add new remotes
     * - add pressure in discontinuities if traction was prescribed along the normal direction
     * 
     * If a changed is detected in the model (the number of triangles changed, the bc type of at least
     * one triangle changed, the geometry of surfaces changed), then the system matrix
     * is rebuild automatically.
     * 
     * <br><br>
     * However, we cannot detect (yet?) when the geometry of a surface changes, and therefore
     * we provide the [[dirty]] property to set to true.
     * 
     * @param {Model} model The model
     * @param {string} solverName The name of the solver to use for the computation
     * (`seidel`, `jacobi`, `gmres`, `cgns`). Default is `seidel` (if `solverName` is unknown).
     * @param {number} tol The tolerence of the solver (usually 1e-9)
     * @param {number} maxIter The maximum nulber of iterations (usually 200)
     */
    // constructor(model: Model, solverName: string, tol: number, maxIter: number)

    /**
     * @brief Compute the solution by running the solver.
     * @returns {Solution} A [[Solution]] object in order to get the computed displacement
     * on surface discontnuities and to perform the post-process at some points.
     * @see [[Solution]]
     */
    run(): Solution

    /**
     * Set the memory of the system to be released after each run or not
     * (default is true)
     */
    // setAutoReleaseMemory(b: boolean): void

    /**
     * Force the memory to be release
     */
    // releaseMemory(): void

    /**
     * Set the callback function to call to notify (i) the progress on the matrix allocation
     * and construction, and (ii) the convergence of the solver.
     * @example
     * ```ts
     * const solver = new arch.Solver(model, 'seidel', 1e-9, 200)
     * solver.onMessage( c => console.log(c) )
     * solver.onProgress( (i, c, context) => {
     *     if (context === 1) {
     *         console.log(`building system: ${c.toFixed(0)}%`)
     *     }
     *     else {
     *         console.log(`iter ${i}: residual ${c}`)
     *     }
     * })
     * ```
     */
    onProgress(cb: SolverProgressCB): void

    /**
     * Set the callback function to call to khnow if the user want to stop the
     * computation.
     * @param cb The callback to pass with signature `cb(): boolean`
     * @example
     * ```ts
     * let stop = false
     * 
     * const solver = new Solver(model)
     * solver.stopRequested( () => stop ) // assume multithreaded
     * 
     * ...
     * 
     * // later on while the solver is performing a long run
     * // in a web-worker...
     * stop = true
     * ```
     */
    stopRequested(cb: Function): void ;

    /**
     * Call when the solver end either when the computation if done or when the user
     * stop the solver.
     * @param cb Signature is `cb(): void`
     */
    onEnd(cb: Function): void ;

    /**
     * Notification when an error is sent by the solver
     * @param cb Signature is `cb(msg: string): void`
     */
    onError(cb: Function): void ;

    /**
     * Notification when a warning is sent by the solver
     * @param cb Signature is `cb(msg: string): void`
     */
    onWarning(cb: Function): void ;

    /**
     * Notification when a message is sent by the solver
     * @param cb Signature is `cb(msg: string): void`
     */
    onMessage(cb: Function): void ;

    /**
     * @brief Set the solver as dirty meaning that the underlaying system matrix
     * will be rebuild. This happens, for example, when:
     * - the number of triangles in the model changed (automatically detected)
     * - the bc type of at least one triangle changed (automatically detected)
     * - the poisson's ratio changed                  (automatically detected)
     * - the geometry of at least one surface changed (not detected for now!!!)
     * 
     * For instance, if you change the geometry of a surface (deformation,
     * translation, scale, rotation...), then as it is not detected, you will have to
     * make sure to call `solver.dirty = true`.
     * @note The `solver.dirty = false` will never work.
     */
    //public dirty: boolean

    /**
     * @brief Represent the tolerence of the solver. Default value is set to `1e-9`.
     * The solver continue to run until its current tolerence is greater than [[eps]] or
     * the current number of iterations is less than [[maxIter]]
     * @default 1e-9
     */
    setEps(v: number)

    /**
     * @brief Represent the maximum number of iteration of the solver. Default value is set to `200`.
     * The solver continue to run until its current tolerence is greater than [[eps]] or
     * the current number of iterations is less than [[maxIter]]
     * @default 200
     */
    setMaxIter(v: number)

    /**
     * @brief Set the number of threads to use by the solver.
     * @default 1
     * @note If the lib was compiled in mono thread, then this number is irrelevant and you will
     * be notified
     */
     setNbCores(n: number)

    /**
     * @brief Set the name of the solver to use. Possible values are **seidel**, **jacobi**, **gmres**,
     * **cgns** and **parallel**.
     * @default **seidel**
     * @note If the lib was compiled in mono thread, then the "parallel" solver is irrelevant.
     */
    select(name: string)
}

// -------------------------------------------------------

/**
 * The object which is returned after calling [[Solver.run]], or created given a [[Model]] and
 * the computed Burger's vectors on the discontinuities making the [[Model]].
 * @example
 * ```javascript
 * solver.run()
 * const solution = new arch.Solution(model)
 * 
 * const displOnSurfaces = solution.burgers(true, true) // locally and at triangle centers
 * 
 * const pos = [] ;
 * for (let i=0; i<10; ++i) pos.push(4*(Math.random()-0.5), 4*(Math.random()-0.5), 0)
 * 
 * const displ   = solution.displ (pos)
 * const strain  = solution.strain(pos)
 * const stress  = solution.stress(pos)
 * ```
 * 
 * @category Solvers
 */
export class Solution {

    constructor(model: Model)

    /**
     * @brief Set to true if you want the return arrays to be [flat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/flat).
     */
    //public flat: boolean

    /**
     * @brief Set the number of threads to use for computing displacement, strain or stress at
     * observation points. It is understood that this procedure applies only for multiple
     * observation points, i.e., when calling [[displ]], [[strain]] or [[stress]] only.
     * @default 1
     */
    setNbCores(n: number)

    /**
     * @brief This threshold is used to compute the D+ and D- on each side
     * of each triangle. Typically, it is used to shift by a small amount along the normal,
     * the center of the triangle in order to avoid numerical instabilities.
     * Depending on the model sizes, it can be judicious to increase or decrease its value.
     * 
     * More info can be found in the following paper:
     * ___
     * [Maerten, F., Maerten, L., & Pollard, D. D. (2014). iBem3D, a three-dimensional iterative boundary element method using angular dislocations for modeling geologic structures. Computers & Geosciences, 72, 1-17.](https://www.sciencedirect.com/science/article/pii/S0098300414001496), Appendix A.2.2. Corrective displacement for triangular elements, Eq. 27
     * ___
     * And an application is here:
     * ___
     * [Maerten, F., & Maerten, L. (2008). Iterative 3d bem solver on complex faults geometry using angular dislocation approach in heterogeneous, isotropic elastic whole or halfspace. Brebbia, editor, Boundary Elements and other Mesh Reduction Methods, 30, 201-208.](https://www.witpress.com/elibrary/wit-transactions-on-modelling-and-simulation/47/19333)
     * ___
     * @default 1e-8
     * @see [[burgersMinus]]
     * @see [[burgersPlus]]
     */
    // public delta: number

    /**
     * @brief Get the computed displacement vectors on surface discontinuities,
     * also known as Burger's vectors.
     * For a given triangle, the Burger's vector, `b`, can be written as the difference
     * between `b(+)`, the displacment on the positive side of the triangle, and `b(-)`, the
     * displacment on the negtive side of the triangle. That is to say: `b = b(+) - b(-)`, with `b`
     * provided by [[burgers]], `b(+)` provided by [[burgersPlus]] and `b(-)` provided by [[burgersMinus]].
     * @param {boolean} local Local or global coordinate system 
     * @param {boolean} atTriangles Compute at triangle center, at vertices otherwise
     * @returns {Array<FlatVectors>} An array of flat vectors. Each entry corresponds to the burger
     * vectors of a [[Surface]].
     * @warning The returned array comprises all [[Surface]]. This is why the return type is an array
     * of [[FlatVectors]] (one entry for each [[Surface]]) and **not** a [[FlatVectors]]. The order of
     * the corresponding surface is the same as the addition in the model.
     */
    burgers(local: boolean, atTriangles: boolean): Array<FlatVectors>

    /**
     * @brief Get the computed displacement discontinuity on the positive side of the triangles.
     * If you do the substraction of [[burgersPlus]] and [[burgersMinus]], you should retrieve [[burgers]]
     * @param {boolean} local Local or global coordinate system 
     * @param {boolean} atTriangles Compute at triangle center, at vertices otherwise
     * @returns {Array<FlatVectors>} An array of flat vectors. Each entry corresponds to a [[Surface]].
     * @warning The returned array comprises all [[Surface]]. This is why the return type is an array
     * of [[FlatVectors]] (one entry for each [[Surface]]) and **not** a [[FlatVectors]]. The order of
     * the corresponding surface is the same as the addition in the model.
     * @see [[delta]]
     */
    // burgersPlus(local: boolean, atTriangles: boolean): Array<FlatVectors>

    /**
     * @brief Get the computed displacement discontinuity on the negative side of the triangles.
     * If you do the substraction of [[burgersPlus]] and [[burgersMinus]], you should retrieve [[burgers]]
     * @param {boolean} local Local or global coordinate system 
     * @param {boolean} atTriangles Compute at triangle center, at vertices otherwise
     * @returns {Array<FlatVectors>} An array of flat vectors. Each entry corresponds to a [[Surface]].
     * @warning The returned array comprises all [[Surface]]. This is why the return type is an array
     * of [[FlatVectors]] (one entry for each [[Surface]]) and **not** a [[FlatVectors]]. The order of
     * the corresponding surface is the same as the addition in the model.
     * @see [[delta]]
     */
    // burgersMinus(local: boolean, atTriangles: boolean): Array<FlatVectors>

    /**
     * @brief Get the residual tractions after computing the Burger's vectors.
     * For a model without any inequality constraints, the residual should be zero. However, 
     * for example for frictional model, residual tractions are different from zero.
     * @returns {Array<FlatVectors>} An array of flat vectors. Each entry corresponds to the residual
     * traction vectors of a [[Surface]].
     * @warning The returned array comprises all [[Surface]]. This is why the return type is an array
     * of [[FlatVectors]] (one entry for each [[Surface]]) and **not** a [[FlatVectors]]. The order of
     * the corresponding surface is the same as the addition in the model.
     * @example
     * Display the resisual traction vectors for the first [[Surface]]
     * ```ts
     * ...
     * const solution = solver.run()
     * 
     * const resT = solution.residualTractions()[0] // first surface
     * 
     * const it = new arch.VectorIt(resT)
     * it.forEach( t => console.log(t) )
     * ```
     */
    // residualTractions(): Array<FlatVectors>

    /**
     * Set the callback function to call to notify the advance of the post-process.
     * @example
     * ```ts
     * const solution = solver.run()
     * solution.onProgress( (i,p) => {
     *   console.log(`nb-pts so far: ${i}, realized: ${p.toFixed(0)}%`))
     * }
     * solution.displ(positions)
     * ```
     * will display
     * ```ts
     * nb-pts so far:    0, realized:  0%
     * nb-pts so far: 2000, realized:  5%
     * nb-pts so far: 4000, realized: 10%
     * nb-pts so far: 6000, realized: 15%
     * ...
     * ```
     */
    onProgress(cb: SolutionProgressCB): void ;

    /**
     * Triggered when a post-process (displ, strain or stress) is done or stopped.
     * @param cb Callback of type `cb(): void`
     */
    onEnd(cb: Function): void ;

    /**
     * Set the callback function to call to khnow if the user want to stop the
     * computation.
     * @param cb The callback to pass with signature `cb(): boolean`
     */
    stopRequested(cb: Function): void ;

    /**
     * @brief Compute the displacement field at points given in the flat array `position`.
     * @returns The array of displacement in flat array
     * @param {FlatVectors} position
     */
    displ(position: FlatVectors): FlatVectors

    /**
     * @brief Compute the strain field at points given in the flat array `position`.
     * @returns The array of strains in flat array
     * @param {FlatVectors} position
     */
    strain(position: FlatVectors): FlatTensors

    /**
     * @brief Compute the stress field at points given in the flat array `position`.
     * @returns The array of strains in flat array
     * @param {FlatVectors} position
     */
    stress(position: FlatVectors): FlatTensors

    /**
     * @brief Get the displacement at one observation point
     */
    // displAt (x: number, y: number, z: number): Vector

    /**
     * @brief Get the strain at one observation point
     */
    // strainAt(x: number, y: number, z: number): Tensor

    /**
     * @brief Get the stress at one observation point
     */
    // stressAt(x: number, y: number, z: number): Tensor

    /**
     * Notification when a message is sent by this class
     * @param cb Signature is `cb(msg: string): void`
     */
    onMessage(cb: Function): void ;

    /**
     * Create a [[Solution]] given a model and the computed burgers vectors
     * for each discontinuities.
     * @param burgers An array of [[FlatVectors]], where each entry of the array represents the
     * burger's vector of a surface discontinuity in the model.
     * @example
     * ```js
     * ...
     * const burgers = solution.burgers(true, true)
     * 
     * // In a web-worker
     * const sol = arch.Solution.create(model, burgers)
     * 
     * sol.onProgress( (i,p) => console.log(`nb-pts so far: ${i},\trealized: ${p.toFixed(0)}%`))
     * sol.onMessage( m => console.log('arch-Message :', m) )
     * 
     * const U = sol.displ (pos)
     * const S = sol.stress(pos)
     * ```
     * Will display
     * ```txt
     * arch-Message : performing displacement post-process
     * nb-pts so far: 0,       realized: 0%
     * nb-pts so far: 12500,   realized: 5%
     * nb-pts so far: 25000,   realized: 10%
     * ...
     * arch-Message : performing stress post-process
     * nb-pts so far: 0,       realized: 0%
     * nb-pts so far: 12500,   realized: 5%
     * nb-pts so far: 25000,   realized: 10%
     * ...
     * ```
     */
    // static create(model: Model, burgers: Array<FlatVectors>): Solution
}
