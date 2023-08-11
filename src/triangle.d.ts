import { Vector } from "."
import { Surface } from "./surface"

/**
 * Allows to access to triangle features.
 * 
 * Example using the {@link Model}
 * ```ts
 * let area = 0
 * model.forEachTriangle( (t) => {
 *      area += y.area()
 * })
 * ```
 * Example using the {@link Surface}
 * ```ts
 * let area = 0
 * surface.forEachTriangle( (t) => {
 *      area += y.area()
 * })
 * ```
 * 
 */
export class Triangle {
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
     * ```js
     * model.forEachTriangle( t => t.setBc("dip", "free", 0) )
     * ```
     */
    setBc(axis: string, type: string, value: number): void

    /**
     * Set the displacement.
     * @param axis See [[setBc]] for the axis format
     */
    setDispl(axis: string, value: number): void

    /**
     * Get the degree of freedom, i.e., the number of tractions.
     */
    dof(): number

    /**
     * Get the center at triangle with id i.
     * If no argument, get the center for the current triangle
     */
    center(i: number): Vector
    center(): Vector

    /**
     * Get the normal of a triangle
     */
    normal(i: number): Vector
    normal(): Vector

    /**
     * Get the area of a triangle
     */
    area(i: number): number
    area(): number

    /**
     * Get the boundary condition values of a triangle
     */
    bc(i: number): Vector
    bc(): Vector

    /**
     * Get the boundary condition types of a triangle
     */
    bcType(i: number): Vector
    bcType(): Vector

    /**
     * Get the current Burger's vector (imposed or computed) in local coordinate system.
     * Useful for plotting iso-contours of a Burger's component
     */
    displ(i: number): Vector
    displ(): Vector

    /**
     * Get the current Burger's vector (imposed or computed) in global coordinate system
     * Useful for plotting streamlines or vectors
     */
    displInGlobal(i: number): Vector
    displInGlobal(): Vector

    /**
     * Check if a triangle has slipped
     * @example
     * ```js
     * let nbSlipped = 0
     * model.forEachTriangle( t => t.hasSlipped() ? nbSlipped++ : 0 )
     * console.log('Nb slipped triangles', nbSlipped)
     * ```
     */
    hasSlipped(i: number): boolean


    hasSlipped(): boolean

    /**
     * Transform a vector v in local coordinate system of the considered triangle
     */
    toLocal(i: number, v: Vector): Vector
    toLocal(v: Vector): Vector

    /**
     * Transform a vector v in global coordinate system of the considered triangle
     */
    toGlobal(i: number, v: Vector): Vector
    toGlobal(v: Vector): Vector
}
