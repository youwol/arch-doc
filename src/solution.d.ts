import { FlatTensors, FlatVectors, Model, Tensor, Vector } from "."

/**
 * Function callback for the `onProgress` method on [[Solution]]
 * @param position The current index
 * @param value The current percentage
 * ```ts
 * solver.run()
 * const solution = new arch.Solution(model)
 * solution.onProgress( (i,p) => {
 *   console.log(`nb-pts so far: ${i}, realized: ${p.toFixed(0)}%`))
 * }
 * solution.displ(positions)
 * ```
 * @category Solvers
 */
export type SolutionProgressCB = (position: number, value: number) => void


/**
 * The object which is returned after calling [[Forward.run]], or created given a [[Model]] and
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
    setDelta(d: number)

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
    burgersPlus(local: boolean, atTriangles: boolean): Array<FlatVectors>

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
    burgersMinus(local: boolean, atTriangles: boolean): Array<FlatVectors>

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
     * solver.run()
     * const solution = new arch.Solution(model)
     * 
     * const resT = solution.residualTractions()[0] // first surface
     * 
     * const it = new arch.VectorIt(resT)
     * it.forEach( t => console.log(t) )
     * ```
     */
    residualTractions(): Array<FlatVectors>

    /**
     * Set the callback function to call to notify the advance of the post-process.
     * @example
     * ```ts
     * solver.run()
     * const solution = new arch.Solution(model)
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
    displAt (x: number, y: number, z: number): Vector

    /**
     * @brief Get the strain at one observation point
     */
    strainAt(x: number, y: number, z: number): Tensor

    /**
     * @brief Get the stress at one observation point
     */
    stressAt(x: number, y: number, z: number): Tensor

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
     * ```
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
    static create(model: Model, burgers: Array<FlatVectors>): Solution
}
