import { Model } from "./model"
import { FullTensor } from "./types"

/**
 * @brief Represent a rank 3 non-symmetric tensor of size 3 (mostly to represent traction or displasment influence matrices).
 * It is represented as a flat array of components with the orders `[xx, xy, xz, yx, yy, yz, zx, zy, zz]`
 * ```
 * @category Math
 */
 export type FullTensor3   = [[number,number,number,number,number,number,number,number,number],[number,number,number,number,number,number,number,number,number],[number,number,number,number,number,number,number,number,number]]

/**
 * Allow to get access to influence matrices (e.g., Traction-influence-matrix).
 * This class is mainly used for prototyping algorithm and where low level
 * functionalities are required.
 * @example
 * ```ts
 * const influence = new arch.Influence(model)
 * 
 * // Get the influence from triangle 9 to the center of triangle 2
 * const Tij = influence.traction(2,9) // flatten array [xx, xy, xz, yx, yy, yz, zx, zy, zz]
 * ```
 * <br>
 * Influence matrices can be used for many purposes since they are acting at the 
 * low level of Arch.
 * 
 * Some examples are provided below (screenshot of a paper in preparation 🙂):
 * <br><br>
 * <center><img style="width:60%; height:60%;" src="media://hetero.jpg"></center>
 * 
 * <center><blockquote><i>
 * Usage of the influence tensors for either (i) heterogenity or (ii) slip inversion
 * </i></blockquote></center>
 * 
 * @category Low-Level
 */
export class Influence {

    constructor(model: Model)

    /**
     * Get the traction influence matrix, `T`, at field triangle due to source triangle.
     * Compared to the other methods, here the field is a triangle as we have
     * to rotate the result in th etriangle local coordinate system.
     * @param field  the id of the field triangle 
     * @param source the id of the source triangle
     * @returns The non-symetric influence matrix as an array of size 9:
     * ```js
     * [
     *      x, y, z, // Burger 1
     *      x, y, z, // Burger 2
     *      x, y, z  // Burger 3
     * ]
     * ```
     * Given `T` and the Burger vector `b` at source, the resulting Burger, `a`, at field is given by
     * ```js
     *      a = T.b
     * ```
     */
    traction(field: number, source: number): FullTensor

    /**
     * Get the strain influence matrix, `S`, at field point p due to source triangle.
     * @param field  The position of the field point (e.g., the center of a triangle, an obs point)
     * @param source the id of the source triangle
     * @returns The non-symetric influence matrix as an array of size 27 (tensor rank 3):
     * ```js
     * [
     *      [xx, xy, xz, yx, yy, yz, zx, zy, zz], // Burger 1
     *      [xx, xy, xz, yx, yy, yz, zx, zy, zz], // Burger 2
     *      [xx, xy, xz, yx, yy, yz, zx, zy, zz]  // Burger 3
     * ]
     * ```
     */
    strain(field: [number,number,number], source: number): FullTensor3

     /**
     * Get the stress influence matrix, `S`, at field point p due to source triangle.
     * @param field  The position of the field point (e.g., the center of a triangle, an obs point)
     * @param source the id of the source triangle
     * @returns The non-symetric influence matrix as an array of size 27 (tensor rank 3):
     * ```js
     * [
     *      [xx, xy, xz, yx, yy, yz, zx, zy, zz], // Burger 1
     *      [xx, xy, xz, yx, yy, yz, zx, zy, zz], // Burger 2
     *      [xx, xy, xz, yx, yy, yz, zx, zy, zz]  // Burger 3
     * ]
     * ```
     */
    stress(field: [number,number,number], source: number): FullTensor3

    /**
     * Get the displacement influence matrix, `D`,  at field point p due to source triangle.
     * @param field  The position of the field point (e.g., the center of a triangle, an obs point)
     * @param source the id of the source triangle
     * @returns The non-symetric influence matrix as an array of size 9 (tensor rank 2):
     * ```js
     * [
     *      x, y, z, // Burger 1
     *      x, y, z, // Burger 2
     *      x, y, z  // Burger 3
     * ]
     * ```
     */
    displacement(field: [number,number,number], source: number): FullTensor
}
