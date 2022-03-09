import { Model } from './model'
import { FlatVectors, FlatTensors, Vector, Tensor, Vectord, Vectorb } from './types'
import { UserRemote } from './remote'

/*
 * Provides some solvers for
 * 1. Forward modeling ([[Forward]])
 * 2. Slip inversion ([[SlipInversion]]) using any types of data
 * 3. Friction and Cohesion inversion ([[FrictionInversion]]) using any types of data
 * 4. Far field stress inversion (coming very soon...) using any types of data. This part will be done in a separate JavaScript library directly
 */




/**
 * Function callback for the `onProgress` method on [[Forward]]
 * @param position The current iteration
 * @param value The current residual
 * @param context The context. 1 is for the matrix building. 2 is for the system solving.
 * @example
 * ```ts
 * const solver = new arch.Forward(model, 'seidel', 1e-9, 200)
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
 * const solver = arch.Forward(model)
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
export class Forward {
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
    constructor(model: Model, tol: number)
    /**
     * Default solver is `seidel`
     */
    constructor(model: Model, tol: number, maxIter: number)

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
    constructor(model: Model, solverName: string, tol: number, maxIter: number)

    // * @returns {Solution} A [[Solution]] object in order to get the computed displacement
    //  * on surface discontnuities and to perform the post-process at some points.
     
    /**
     * @brief Compute the solution by running the solver. To access the [[Solution]], use the
     * following code
     * ```js
     * solver.run()
     * const solution = new arch.Solution(model)
     * ```
     * @see [[Solution]]
     */
    run(): void

    /**
     * Set the memory of the system to be released after each run or not
     * (default is true)
     */
    setAutoReleaseMemory(b: boolean): void

    /**
     * Force the memory to be release
     */
    releaseMemory(): void

    /**
     * Set the callback function to call to notify (i) the progress on the matrix allocation
     * and construction, and (ii) the convergence of the solver.
     * @example
     * ```ts
     * const solver = new arch.Forward(model, 'seidel', 1e-9, 200)
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
     * const solver = new Forward(model)
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
    setDirty(b: boolean)

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
