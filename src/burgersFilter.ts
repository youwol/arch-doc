import { Vectord } from './types'


/**
 * @brief Allows to change the convention of the computed displcement discontinuity (also known
 * as Burger vectors).
 * By default, the convention is as described by Okada. It is possible to use another
 * convention such as the one defined in Poly3D by mean of this class.
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
 * <center><img style="width:60%; height:60%;" src="media://convention.png"></center>
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
