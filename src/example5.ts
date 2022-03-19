/**
 * Example showing how to apply an incremental remote stress.
 * Depending on the remote stress magnitudes, by cumulating deformation
 * at observation grid should be different than applying the remote in
 * one go:
 *
 * ```js
 * const arch = require('arch.node')
 * 
 * const model = new arch.Model()
 * model.setMaterial ( 0.25, 30e9, 2000 )
 * 
 * const fault = new arch.Surface([0,0,0, 1,0,0, 1,1,0], [0,1,2])
 * fault.setBC("dip",    "free", 0)
 * fault.setBC("strike", "free", 0)
 * fault.setBC("normal", "free", 0)
 * model.addSurface( fault )
 * 
 * const remote = new arch.UserRemote()
 * model.addRemote( remote )
 * 
 * const solver = new arch.Forward(model, 'seidel', 1e-8, 200)
 * solver.setAutoReleaseMemory(false)
 * 
 * const points = new Array(9).fill(0).map( v => Math.random() )
 * 
 * // ------------------------------------------------
 * 
 * const n = 10
 * for (let i=0; i<n; ++i) {
 *     // Increment the remote
 *     remote.setFunction( (x,y,z) => [0,0,0,0,0, -1*i/(n-1)] )
 * 
 *     solver.run()
 * 
 *     // Cumulate the deformation at points
 *     const d = solution.displ(points)
 *     displ = displ.map( (v,j) => v+d[j] )
 * }
 * ```
*/
export namespace Example_incremental_remote {}
