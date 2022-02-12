import { Tensor, Vector } from './types'



/**
 * A user-defined remote using an arrow function
 * 
 * @category Remotes
 */
export class UserRemote {
    /**
     * Construct a User remote without any arrow function
     */
    constructor()

    /**
     * Construct a User remote with an arrow function
     * @see [[func]]
     */
    constructor(cb: Function)

    /**
     * Set the arrow function of this user-defined remote.
     * The signature is
     * ```typescript
     * cb(x: number, y: number, z: number): Tensor
     * ```
     * The returned Array should be of size 6 with the following order for the 
     * components of the symetric tensor:
     * ```javascript
     * [xx, xy, xz, yy, yz, zz]
     * ```
     * @example
     * ```javascript
     * // Create a remote stress
     * const theta = 45   // Orientation od SH according to the north, between 0° and 180°
     * const rho   = 2200 // Density between 0 and 3000
     * const Rh    = 0.1  // Normalized Sh according to Sv, between 0 and 2 and <= SH
     * const RH    = 0.6  // Normalized SH according to Sv, between 0 and 2 and >= Sh
     * 
     * const remote = new arch.UserRemote( (x,y,z) => {
     *   const ang  = theta *Math.PI / 180
     *   const cos  = Math.cos(ang)
     *   const sin  = Math.sin(ang)
     *   const cos2 = cos**2
     *   const sin2 = sin**2
     *   const Sv   = -rho*9.81*z
     *   const Sh   = Sv * Rh
     *   const SH   = Sv * RH
     *   // Order is [xx, xy, xz, yy, yz, zz]
     *   return [cos2*Sh + sin2*SH, cos*sin*(Sh-SH), 0, sin2*Sh + cos2*SH, 0, Sv]
     * })
     * remote.stress = true // we never know :-)
     * 
     * model.run()
     * ...
     * r.func = (x, y, z) => [1, 0, 0, 0, 0, -1]
     * model.run()
     * ...
     * ```
     * @param {Function} cb The callback
     */
    setFunction(cb: Function )

    /**
     * @brief Evaluate the remote at (x,y,z)
     * @param pos The position in 3D
     * @returns {Tensor} The remote at pos. The returned array is in the form
     * `[xx, xy, xz, yy, yz, zz]`
     */
    evaluate(x: number, y: number, z: number): Tensor

    /**
     * @brief Evaluate the traction at pos(x,y,z) with normal n(x,y,z)
     * @param pos The position in 3D (e.g., center of a triangle)
     * @param normal The normal at point pos
     * @returns {Vector} The traction vector in the form `[x, y, z]`
     */
    //tractionAt(pos: Vector, normal: Vector): Vector

    /**
     * @brief If stress = true (default value), set the remote as a remote stress.
     * Otherwise the remote is a remote strain.
     * @default true
     * @note The strain is not yet implemented
     */
    //stress: boolean
}
