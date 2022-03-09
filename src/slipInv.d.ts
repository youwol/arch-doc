import { FlatVectors, Model, Vector, Vectorb, Vectord } from "."

/**
 * Allow to do slip inversion using multiple type of dataset.
 * This is still a work in progress (optimization, new dataset, ...)
 * 
 * This is almost based on
 * ___
 * [Maerten, F., Resor, P., Pollard, D., & Maerten, L. (2005). Inverting for slip on three-dimensional fault surfaces using angular dislocations. Bulletin of the Seismological Society of America, 95(5), 1654-1665.](https://pubs.geoscienceworld.org/ssa/bssa/article-abstract/95/5/1654/103120/Inverting-for-Slip-on-Three-Dimensional-Fault?redirectedFrom=fulltext)
 * ___
 * except that we use an iterative approach to solve for the unknown burger components on fault surfaces.
 * Consequently, the regularization operator (aka, Tikhonov regularization) is also iterative and is based on the
 * Displacement Inequality Constraint (DIC).
 * 
 * The iterative approach is similar to the **Block Gauss-Seidel**
 * solver ([[Forward]] with '`seidel`' parameter), except that we use a **Block Least-Squares**
 * formulation, with an optimized building process for the underlaying matrices and vectors.
 * 
 * @example
 * ```javascript
 * const model = new arch.Model()
 * // --> add surface discontinuities
 * // --> setup surface boundary conditions and values
 * // --> add DICs on surfaces eventually
 * 
 * const insar     = [0,0,0, 1,0,0, 2,1,0, 3,2, 0 ...] // point position
 * const dataInsar = [0.12, 0,21, 0,22, 0.65 ...]  // insar data, one per point
 * // The same applies for Gps
 * 
 * const inv = new arch.SlipInversion
 * inv.addInsar(insar, dataInsar, satLOS, 1)
 * inv.addGps(gps, dataGps, [true,true,true], 3) // gps is 3x more important than insar
 * inv.setSmooth(0.85)
 * const burgers = inv.run(true, true)
 * ```
 * 
 * <br>
 * 
 * Another example
 * ```js
 * const model = new arch.Model()
 * model.setHalfSpace(false)
 * model.setMaterial( 0.25, 1, 1000 )
 *
 * const surface   = loadSurfaceFromSomewhere(s_filename)
 * surface.setBC("dip"   , "free", 0)
 * surface.setBC("strike", "free", 0)
 * surface.setBC("normal", "locked", 0)
 * model.addSurface(surface)
 *
 * const gps = loadGpsFromSomewhere(g_filename)
 *
 * const slipinv = new arch.SlipInversion(model)
 * slipinv.addGps(pos, gps, [true, true, true], 1)
 * const burgers = slipinv.run(true, true)
 *
 * // For each surface
 * burgers.forEach( burgersForSurface => {
 *     console.log( burgersForSurface )
 * })
 * ```
 * 
 * @category Solvers
 */
export class SlipInversion {
    constructor(model: Model)

    /**
     * @brief Add a new Gps dataset to constrain the slip inversion
     * @param {FlatVectors} position The position of the data points in 3D. The size
     * of the vector should equal to the number of points time three.
     * @param {Vectord} data The data, one for each point. The size of the vector should
     * be equals to the number of points time the number of valid axis.
     * @param valid The validity of each axis
     * @param weight The weight of this dataset
     */
    addGps(position: FlatVectors, gps: Vectord, valid: Vectorb, weight: number)

    /**
     * @brief Add a new InSAR dataset to constrain the slip inversion.
     * @warning Be careful that the InSAR dataset is not tested yet
     * @param {FlatVectors} position The position of the data poinrs in 3D
     * @param {Vectord} insar The data, one for each point
     * @param satellite The line of sight of the satellite
     * @param weight The weight of this dataset
     */
    addInsar(position: FlatVectors, insar: Vectord, satellite: Vector, weight: number)

    /**
     * @brief Run the slip inversion based on (i) the provided model and (ii) the dataset as constraints.
     * @returns An array of Vectord, each entry of the array represents the inverted displ of a surface.
     */
    run(local: boolean, atTriangles: boolean): Array<Vectord>

    /**
     * @brief The smoothing parameter for Thikonov. This correspond to the link between a triangle
     * and its neighbors. The burger vector for a considered triangle will be dependent on its
     * neighbors (smoothness), and the greater the value, the more smooth (more dependent on
     * neighbors).
     * <br><br>
     * For a given computed displacement `u` on triangle `t`, its smoothed value according to the `n`
     * neighbors `f` with displacement `uf` will be: `u = (1. - smooth)u + smooth/n*sum(uf)`
     * 
     * @warning The definition of this parameter is not the same as in [Poly3Dinv](https://pubs.geoscienceworld.org/ssa/bssa/article-abstract/95/5/1654/103120/Inverting-for-Slip-on-Three-Dimensional-Fault?redirectedFrom=fulltext)
     * For instance, here a practical value is aound 0.9, whereas for Poly3Dinv, it is close to 0.1.
     * @default 0.9
     */
    setSmooth(s: number)

    /**
     * @brief The precision of the solver
     * @default 1e-8
     */
    setEps(e: number)

    /**
     * @brief The maximum number of iteration for the solver
     * @default 200
     */
    setMaxIter(m: number)
}