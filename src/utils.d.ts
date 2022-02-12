import { FlatVectors, FlatTensors, Vector, Tensor } from './types'

//export namespace utils {

    /**
     * @brief Helper class to simply iterate over a [[FlatVectors]]
     * @example
     * ```javascript
     * const burgers = solution.value(true, true)
     * 
     * // Simply get the result...
     * const h = new arch.VectorIt(burgers[0]) ; // [0] is for the first Surface
     * h.forEach( u => console.log(u) )
     *
     * // Modify result of the vector iterator by scaling the z-component by 3
     * const u = h.map( u => [u[0], u[1], 3*u[2]] )
     * console.log(u)
     * ```
     */
    export class VectorIt {
        constructor(vectors: FlatVectors) 

        /**
         * @brief Get the number of items
         */
        get count(): number

        /**
         * @param cb The callback with signature
         * ```javascript
         * (u: Vector): void
         * ```
         */
        forEach(cb: Function): void

        /**
         * @param cb The callback with signature
         * ```javascript
         * (u: Vector): Vector
         * ```
         */
        map(cb: Function): FlatVectors

        /**
         * @brief Get the value at a specified index in [0, [[count]]()-1]
         * @param index 
         * @return [[Vector]]
         */
        value(index: number): Vector

        /**
         * @brief Get the x coordinate at a specified index in [0, [[count]]()-1]
         */
        x    (index: number): number

        /**
         * @brief Get the y coordinate at a specified index in [0, [[count]]()-1]
         */
        y    (index: number): number

        /**
         * @brief Get the z coordinate at a specified index in [0, [[count]]()-1]
         */
        z    (index: number): number
    }

    /**
     * @brief Helper class to simply iterate over a [[FlatTensors]]
     * @example
     * ```javascript
     * const stress = solution.stress(position)
     * 
     * const h = new arch.TensorIt(stress) ;
     * h.forEach( s => console.log(s) )
     *
     * const s = h.map( s => {
     *     s[4] *= 10
     *     return s
     * })
     * console.log(s)
     * ```
     */
    export class TensorIt {
        constructor(vectors: FlatTensors) 

        /**
         * @brief Get the number of items
         */
        get count(): number

        /**
         * @param cb The callback with signature
         * ```javascript
         * (u: Tensor): void
         * ```
         */
        forEach(cb: Function): void

        /**
         * @param cb The callback with signature
         * ```javascript
         * (u: Tensor): Tensor
         * ```
         */
        map(cb: Function): FlatTensors

        /**
         * @brief Get the value at a specified index in [0, [[count]]()-1]
         * @param index 
         * @return [[Tensor]]
         */
        value(index: number): Tensor

        /**
         * @brief Get the xx component at a specified index in [0, [[count]]()-1]
         */
        xx(index: number): number

        /**
         * @brief Get the xy component at a specified index in [0, [[count]]()-1]
         */
        xy(index: number): number

        /**
         * @brief Get the xz component at a specified index in [0, [[count]]()-1]
         */
        xz(index: number): number

        /**
         * @brief Get the yy component at a specified index in [0, [[count]]()-1]
         */
        yy(index: number): number

        /**
         * @brief Get the yz component at a specified index in [0, [[count]]()-1]
         */
        yz(index: number): number

        /**
         * @brief Get the zz component at a specified index in [0, [[count]]()-1]
         */
        zz(index: number): number

    }

//}
