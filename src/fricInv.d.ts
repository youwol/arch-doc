import { Model, UserRemote, Vectord } from ".";

/**
 * Allows to perform anisotopic friction and cohesion distribution inversion
 * using multiple type of dataset on complex fault geometries.
 * 
 * @example
 * ```javascript
 * const model = new arch.Model()
 * // --> add surface discontinuities
 * // --> setup surface boundary conditions and values
 * 
 * const algo = new arch.FrictionInversion(model)
 * algo.setRemote( remoteFromStressInversion )
 * algo.setBurgers( displFromSlipInversion )
 * algo.run()
 * 
 * const friction = algo.getDipFriction()
 * ```
 * 
 * @category Solvers
 */
export class FrictionInversion {
    constructor(model: Model)

    /**
     * Set the displacement on triangular elements making the faults.
     * These burgers come from, for example, [[SlipInversion]].
     * @param burgers 
     */
    setBurgers(burgers: Vectord): void

    /**
     * Set the estimated far field stress.
     * This come from stress inversion using the same model and data as for
     * [[SlipInversion]].
     * @param remote 
     * @see [[setBurgers]]
     */
    setRemote(remote: UserRemote): void

    /**
     * If the algo have to perform the inversion along the dip and strike
     * axis.
     * @param u True to use anisotropy
     * @default false
     */
    useAnisotropy(u: boolean): void

    /**
     * For convenience, return the residual tractions from the imposed burger vectors
     */
    influences(): Vectord

    /**
     * For convenience, return the remote tractions
     */
    tractions(): Vectord

    /**
     * @brief Run the friction inversion on the provided model using the remote stress and burgers
     */
    run(): void

    /**
     * Get the computed friction distribution along the dip axis
     */
    dipFriction(): Vectord

    /**
     * Get the computed friction distribution along the strike axis.
     * If anisotropy was set to false, [[dipFriction]] and [[strikeFriction]]
     * return the same array.
     */
    strikeFriction(): Vectord
}
