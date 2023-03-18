// import { Material } from './materials'
import { Surface } from './surface'
import { UserRemote } from './remote'
import { Triangle } from './triangle'

//export namespace model {

/**
 * A **Arch** model comprises a set of active objects ([[Surface]]
 * discontinuities), a [[Material]] and a set of [[Remote]]s.
 */
export class Model {
    /**
     * @brief Set the model to in half-space or whole-space. By default the model is
     * in whole-space.
     * An explanation of whole-space versus half-space is given by the following figure
     * <center><img style="width:60%; height:60%;" src="media://half.jpg"></center>
     * @default false
     */
    setHalfSpace(b: boolean): void

    forEachTriangle(cb: (t: Triangle, i: number) => void): void

    setMaterial(poisson: number, young: number, density: number): void

    /**
     * Add a [[Surface]] discontinuity made of triangles in the model
     * @param {Surface} s The surface
     */
    addSurface(s: Surface): void

    /**
     * @brief Get the number of dof (degree of freedom) of the model
     */
    nbDof(): number

    /**
     * @brief Get the bounds of the model (min/max of each dimension).
     * @returns {Array<number>} An array of size 6 comprising [minX, minY, minZ, maxX, maxY, maxZ]
     */
    bounds(): Array<number>

    /**
     * For each surface, get the traction's vectors for each triangles as a flat array.
     * The return array is therefore `[[x, y, z, x, y, z, ...], ...]`
     */
    //tractions(): Array<number>

    /**
     * @brief Add a remote (strain or stress) to the model
     * @example
     * ```javascript
     * model.addRemote(myRemote)
     * ```
     * @see [[UserRemote]]
     */
    addRemote(remote: UserRemote): void

    /**
     * Check if the model is correctly setup
     */
    check()
}

//}
