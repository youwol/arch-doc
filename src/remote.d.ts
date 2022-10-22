import { Surface } from './surface'
import { FlatVectors, Tensor, Vector, Vectord } from './types'

/**
 * The signature of the stress function for [[UserRemote]] and [[UserRemoteCB]]
 * @category Remotes
 */
export type UserRemoteCB = (x: number, y: number, z: number) => Tensor

/**
 * The callback as parameter for [[forEachStep]] in [[UserRemoteCB]]
 * @hidden
 */
export type IncrementalUserRemoteCB = (stress: Tensor, step: number) => void

/**
 * Base class for the remotes (user or pre-defined)
 * 
 * @category Remotes
 */
export interface Remote {
    /**
     * @brief Evaluate the remote at pos(x,y,z)
     * @param pos The position in 3D
     * @returns {Tensor} The remote at pos. The returned array is in the form
     * `[xx, xy, xz, yy, yz, zz]`
     */
    valueAt(pos: Vector): Tensor

    /**
     * @brief Evaluate the traction at pos(x,y,z) with normal n(x,y,z)
     * @param pos The position in 3D (e.g., center of a triangle)
     * @param normal The normal at point pos
     * @returns {Vector} The traction vector in the form `[x, y, z]`
     */
    tractionAt(pos: Vector, normal: Vector): Vector

    /**
     * @brief Get the resolved stress at a surface's triangles
     * @param surface 
     * @return A flat array of tractions, one for each triangle making the surface
     */
    tractionAtSurface(surface: Surface): FlatVectors
}

/**
 * A user-defined remote using an arrow function.
 * 
 * Example for defining a gradient Andersonian remote stress
 * @example
 * ```javascript
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
 *   const Sv   = rho*9.81*z // z is negatif, so is Sv
 *   const Sh   = Sv * Rh
 *   const SH   = Sv * RH
 *   // Order is [xx, xy, xz, yy, yz, zz]
 *   return [cos2*Sh + sin2*SH, cos*sin*(SH-Sh), 0, sin2*Sh + cos2*SH, 0, Sv]
 * })
 * ```
 * @category Remotes
 */
export class UserRemote implements Remote {
    /**
     * Construct a User remote without any arrow function
     */
    constructor()

    /**
     * Construct a User remote with an arrow function
     * @see [[func]]
     */
    constructor(cb: UserRemoteCB)

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
     * 
     * Example for defining an Andersonian remote stress
     * @example
     * ```javascript
     * const remote = new arch.UserRemote( (x,y,z) => [1, 0, 0, 2, 0, -3] )
     * model.addRemote(remote)
     * 
     * model.run()
     * ...
     * r.setFunction( (x, y, z) => [0, 0, 0, 0, 0, 1] )
     * model.run()
     * ...
     * ```
     * @param {UserRemoteCB} cb The callback
     */
    setFunction(cb: UserRemoteCB)

    /**
     * @brief Evaluate the remote at pos(x,y,z)
     * @param pos The position in 3D
     * @returns {Tensor} The remote at pos. The returned array is in the form
     * `[xx, xy, xz, yy, yz, zz]`
     */
    valueAt(pos: Vector): Tensor

    /**
     * @brief Evaluate the traction at pos(x,y,z) with normal n(x,y,z)
     * @param pos The position in 3D (e.g., center of a triangle)
     * @param normal The normal at point pos
     * @returns {Vector} The traction vector in the form `[x, y, z]`
     */
    tractionAt(pos: Vector, normal: Vector): Vector

    /**
     * @brief Get the resolved stress at a surface's triangles
     * @param surface 
     * @return A flat array of tractions, one for each triangle making the surface
     */
    tractionAtSurface(surface: Surface): FlatVectors

    /**
     * @brief If stress = true (default value), set the remote as a remote stress.
     * Otherwise the remote is a remote strain.
     * @default true
     * @note The strain is not yet implemented
     */
    //stress: boolean
}

/**
 * An Andersonian remote stress is a particular remote stress where one principal axis is vertical.
 * Depending on the magnitude of vertical stress compared to the other two axis (maximum, minimum, intermediate),
 * we have a different stress regimes.
 * 
 * All values are given in engineer convention, meaning that compression is negatif.
 * 
 * If the vertical axis corresponds to
 * - the maximum principal stress: the regime is **normal**
 * - the intermediate principal stress: the regime is **strike-slip**
 * - the minimum principal stress: the regime is **reverse**
 * 
 * <center><img style="width:70%; height:70%;" src="media://regimes-anderson.png"></center>
 * <center><blockquote><i>
 * Anderson's faulting theory and stress regimes: a) strike-slip fault movement, when SH > SV > Sh; b) reverse or thrust fault movement, when SH > Sh > SV; and c) normal fault movement, when SV > SH > Sh.
 * </i></blockquote></center>
 * 
 * @example
 * ```javascript
 * const rho   = 2200 // Density of the rock
 * const Rh    = 0.1  // Normalized Sh according to Sv
 * const RH    = 0.6  // Normalized SH according to Sv
 * const g     = 9.81
 * 
 * const r = new arch.AndersoninanRemote()
 * r.setSh( (x,y,z) => Rh*rho*g*z )
 * r.setSH( (x,y,z) => RH*rho*g*z )
 * r.setSv( (x,y,z) => rho*g*z )
 * r.setTheta(35) // in degrees
 *
 * console.log( r.valueAt([0, 0, -1000]) )
 *
 * model.addRemote(r)
 * ```
 * 
 * @category Remotes
 */
export class AndersonianRemote implements Remote {
    /**
     * @brief The magnitude of the minimum horizontal stress (Sigma h) which can be
     * given by a number or a callback.
     * @default 0
     */
    setSh(cb: Function | number)

    /**
     * @brief The magnitude of the maximum horizontal stress (Sigma H) which can be
     * given by a number or a callback.
     * @default 0
     */
    setSH(cb: Function | number)

    /**
     * @brief The magnitude of the vertical stress (Sigma v) which can be given by
     * a number or a callback.
     * @default 0
     */
    setSv(cb: Function | number)

    /**
     * @brief The orientation in degrees of the maximum horizontal stress according to the North
     * (global y-axis) and clock-wise.
     * @default 0
     */
    setTheta(theta: number)

    /**
     * @brief Get the stress ratio in [0, 1], which is (S2-S3)/(S1-S3) with S1 the maximum principal
     * stress (compression is positive), S2 the intermediate and S3 the minimum principal
     * stress. In addition, you have to call [[regime]] to know the the stress regime as there's
     * an ambiguity to use only [[R]] to characterize an Andersoninan stress.
     * @see [[Rb]]
     */
    R(): number

    /**
     * @brief Another representation of the stress ratio and stress regime together using only one
     * parameter in [0, 3]. It is essentially the same as [[R]] except that
     * it includes both the stress ratio and the stress regime
     * - For Rb in [0, 1], we have a `normal` regime.
     * - For Rb in [1, 2], we have a `strike-slip` regime.
     * - For Rb in [2, 3], we have a `reverse` regime.
     * 
     * This stress ratio is define in
     * 
     * - [Maerten, F., Madden, E. H., Pollard, D. D., & Maerten, L. (2016). Incorporating fault
     * mechanics into inversions of aftershock data for the regional remote stress, with
     * application to the 1992 Landers, California earthquake. Tectonophysics, 674, 52-64.](https://www.sciencedirect.com/science/article/abs/pii/S0040195116000731), Eq. 7
     * - [Maerten, L., Maerten, F., Lejri, M., & Gillespie, P. (2016). Geomechanical paleostress
     * inversion using fracture data. Journal of structural Geology, 89, 197-213.](https://www.sciencedirect.com/science/article/abs/pii/S0191814116300839), Eq. 3
     * - [Lejri, M., Maerten, F., Maerten, L., & Soliva, R. (2017). Accuracy evaluation of
     * both Wallace-Bott and BEM-based paleostress inversion methods. Tectonophysics, 694, 130-145.](https://www.sciencedirect.com/science/article/abs/pii/S0040195116305935), Eq. 2
     * @see [[R]]
     */
    Rb(): number

    /**
     * @brief Another representation of the stress ratio and stress regime together using only one
     * parameter which is an angle between -90° and +90°. This parameter is usually called **alpha-shape**.
     * An explanation will be given soon to
     * justify this representation.
     * 
     * - for alpha in [-90° ,  0°], we have a `normal` regime
     * - for alpha in [  0° , 45°], we have a `strike-slip` regime
     * - for alpha in [45°  , 90°], we have a `reverse` regime
     * 
     * <center><img style="width:50%; height:50%;" src="media://alpha_half_disc.png"></center>
     * <center><blockquote><i>
     * Representation of the alpha-shape as an angle
     * </i></blockquote></center>
     * 
     * <center><img style="width:50%; height:50%;" src="media://alpha-principal_stresses.png"></center>
     * <center><blockquote><i>
     * Relations between alpha-shape and the three principale stresses
     * </i></blockquote></center>
     */
    alpha(): number

    /**
     * @brief Get the stress regime. Can be either `normal`, `strike-slip` or `reverse`
     */
    regime(): string

    /**
     * @brief Evaluate the remote at pos(x,y,z)
     * @param pos The position in 3D
     * @returns {Tensor} The remote at pos. The returned array is in the form
     * `[xx, xy, xz, yy, yz, zz]`
     */
    valueAt(pos: Vector): Tensor

    /**
     * @brief Evaluate the traction at pos(x,y,z) with normal n(x,y,z)
     * @param pos The position in 3D (e.g., center of a triangle)
     * @param normal The normal at point pos
     * @returns {Vector} The traction vector in the form `[x, y, z]`
     */
    tractionAt(pos: Vector, normal: Vector): Vector

    /**
     * @brief Get the resolved stress at a surface's triangles
     * @param surface 
     * @return A flat array of tractions, one for each triangle making the surface
     */
    tractionAtSurface(surface: Surface): FlatVectors

    /**
     * @brief If stress = true (default value), set the remote as a remote stress.
     * Otherwise the remote is a remote strain.
     * @default true
     * @note The strain is not yet implemented
     */
    // stress: boolean
}

/**
 * A user-defined incremental remote
 * @hidden
 * @category Remotes
 */
export class IncrementalUserRemote implements Remote {
    /**
     * Construct a User remote without any arrow function
     */
    constructor()

    /**
     * Construct a User remote with an arrow function and the number of steps
     * @see [[func]]
     */
    constructor(cb: UserRemoteCB, nbSteps: number)

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
     * 
     * Example for defining an Andersonian remote stress
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
     * 
     * model.run()
     * ...
     * r.setFunction( (x, y, z) => [1, 0, 0, 0, 0, -1] )
     * model.run()
     * ...
     * ```
     * @param {UserRemoteCB} cb The callback
     */
    setFunction(cb: UserRemoteCB)

    /**
     * @brief Evaluate the remote at pos(x,y,z)
     * @param pos The position in 3D
     * @returns {Tensor} The remote at pos. The returned array is in the form
     * `[xx, xy, xz, yy, yz, zz]`
     */
    valueAt(pos: Vector): Tensor

    /**
     * @brief Evaluate the traction at pos(x,y,z) with normal n(x,y,z)
     * @param pos The position in 3D (e.g., center of a triangle)
     * @param normal The normal at point pos
     * @returns {Vector} The traction vector in the form `[x, y, z]`
     */
    tractionAt(pos: Vector, normal: Vector): Vector

    /**
     * @brief Get the resolved stress at a surface's triangles
     * @param surface 
     * @return A flat array of tractions, one for each triangle making the surface
     */
    tractionAtSurface(surface: Surface): FlatVectors

    /**
     * @brief Launch the incremental user remote loading. Received parameters for the
     * callback are (i) the stress evaluated at (0,0,1) and (ii) the step number.
     * @example
     * ```js
     * ...
     * // Apply a vertical loading in 20 steps
     * const remote = new arch.IncrementalUserRemote()
     * remote.setFunction( (x,y,z) => [0,0,0,0,0, -1] )
     * remote.setNbStep( 20 )
     * model.addRemote( remote )
     * 
     * const solution = new arch.Solution( model )
     * const solver   = new arch.Forward( model )
     * 
     * remote.forEachStep( (stress, i) => {
     *      console.log('step', i, ', remote-stress:', stress)
     *      solver.run()
     *      // Cumulate the deformation
     *      displ = solution.displ( points ).map( (v,j) => v+displ[j] )
     * })
     * ```
     */
    forEachStep(cb: IncrementalUserRemoteCB): void

    /**
     * Set the number of increments
     */
    setNbStep(n: number): void
}
