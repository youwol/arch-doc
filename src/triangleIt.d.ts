import { Vector } from "."
import { Surface } from "./surface"

/**
 * Allows to access to triangle features.
 * 
 * Example:
 * ```js
 * let area = 0
 * for (const it = new arch.TriangleIt(surface); it.more(); it.next()) {
 *      area += it.area()
 * }
 * console.log('total area', area)
 * ```
 */
export class TriangleIt {
    constructor(surface: Surface)

    /**
     * Reset the iteration from the beginning
     */
    begin(): void

    /**
     * Check if there's more triangles
     */
    more(): boolean

    /**
     * Jump to the next triangle
     */
    next(): void

    /**
     * Get the current iteration
     */
    curId(): number

    /**
     * Get the number of triangles making the surface
     */
    length(): number

    /**
         * @brief Set the boundary type and value.
         * 
         * For instance, in Okada convention, setting, for the x-axis, the boundary condition type to
         * traction and its value > 0 is equivalent to applying a "pressure".
         * 
         * @param {number|string} axis The axis index or the axis name.
         * For axis index it can be either 0 for the normal direction,
         * 1 for the strike direction or 2 for the dip direction.
         * For the string value, it can be either `x` or `normal`, `y` or `strike`, `z` or `dip`.
         * @param {string} type The type of boundary condition for the considered axis. For traction condition,
         * value can be either `t`, `0`, `free`, `traction`, `neumann` or `unknown`. All these values have the same 
         * meaning. For displacement condition, value can be either `b`, `1`, `displ`, `displacement`, `fixed`,
         * `dirichlet`, `locked` or `imposed`. All these values have the same meaning.
         * When an axis is free, it means that the provided boundary value will a traction component (along the axis)
         * since the displacement is unknown. Similarly, when the boundary condition is `locked`, the
         * provided value is an imposed displacement along the axis.
         * @param {number} value The boundary value for the considered axis,
         *
         * @default Normal axis: type = `locked` and value = `0`
         * @default Strike axis: type = `free` and value = `0`
         * @default Dip axis: type = `free` and value = `0`
         * @example
         * ```javascript
         * for (const it = new arch.TriangleIt(surface); it.more(); it.next()) {
         *      it.setBc("dip", "free", 0)
         * }
         * ```
         */
    setBc(axis: string, type: string, value: number): void

    /**
     * Set the displacement.
     * @param axis See [[setBc]] for the axis format
     */
    setDispl(axis: string, value: number): void

    /**
     * Get the center at triangle with id i.
     * If no argument, get the center for the current triangle
     */
    center(i: number): Vector
    center(): Vector

    normal(i: number): Vector
    normal(): Vector

    area(i: number): number
    area(): number

    bc(i: number): Vector
    bc(): Vector

    bcType(i: number): Vector
    bcType(): Vector

    displ(i: number): Vector
    displ(): Vector

    displInGlobal(i: number): Vector
    displInGlobal(): Vector

    toLocal(i: number, v: Vector): Vector
    toLocal(v: Vector): Vector

    toGlobal(i: number, v: Vector): Vector
    toGlobal(v: Vector): Vector
}
