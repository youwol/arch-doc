import { Vectord } from './types'
import { Surface } from './surface'

/*
 * Allow to interpolate an attribute defined for a [[Surface]] from vertices to triangles,
 * or from triangles to vertices.
 * @example
 * ```ts
 * const surface      = new arch.Surface(vertices, triangles)
 * const attribute    = new Array(vertices.length/3).fill(undefined).map( v => Math.random() )
 * console.assert(attribute.length == vertices.length/3)
 * 
 * const interpolator = new arch.SurfaceAttributeInterpolation(surface)
 * const interpolated = interpolator.fromVerticesToTriangles(attribute)
 * console.assert(interpolated.length == triangles.length/3)
 * ```
 */


/**
 * @brief Allows to interpolate an attribute (scalar, vector3 or matrix33) from vertices to
 * triangles, or from triangles to vertices
 * @example
 * ```ts
 * const s = new arch.Surface(...)
 * const displ = [...] // values at vertices
 * 
 * const I = new arch.SurfaceAttributeInterpolation(s)
 * const displAtT = I.fromVerticesToTriangles(displ)
 * ```
 * @example
 * ```ts
 * const s = new arch.Surface(...)
 * const displ = s.displ(true, true) // displ at T
 * 
 * const I = new arch.SurfaceAttributeInterpolation(s)
 * const displAtV = I.fromTrianglesToVertices(displ)
 * ```
 */
export class SurfaceAttributeInterpolation {

    /**
     * @brief Create a SurfaceAttributeInterpolation
     */
    constructor(surface: Surface)

    /**
     * Interpolate an attribute from vertices to triangles.
     * @param attribute The attribute to interpolate. Its size should be the
     * same as the number of vertices for teh surface
     * @returns The interpolated attribute for which the size is the number
     * of triangles for teh surface
     */
    fromVerticesToTriangles(attribute: Vectord): Vectord

    /**
     * Interpolate an attribute from triangles to vertices.
     * @param attribute The attribute to interpolate. Its size should be the
     * same as the number of triangles for teh surface
     * @returns The interpolated attribute for which the size is the number
     * of vertices for the surface
     */
    fromTrianglesToVertices(attribute: Vectord): Vectord
}
