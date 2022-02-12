/**
 * A simple example using the Arch API
 *
 * ```ts
 * const arch = require('arch')
 * const io   = require('@youwol/io')
 *
 * const model = new arch.Model()
 * model.setHalfSpace( false )
 * model.setMaterial ( 0.25, 1, 1000 )
 *
 * const surfaces = io.decodeGocadTS( fs.readFileSync('surfaces.ts', 'utf8') )
 * surfaces.forEach( surf => {
 *     const surface = new arch.Surface(surf.series.positions.array, surf.series.indices.array)
 *     surface.setBC("dip",    "free", 0)
 *     surface.setBC("strike", "free", 0)
 *     surface.setBC("normal", "free", (x,y,z) => alpha[4]*9.81*Math.abs(z) + alpha[5] )
 *     model.addSurface( surface )
 * })
 *
 * const remote = new arch.UserRemote()
 * remote.setFunction( (x,y,z) => {
 *     const Z = Math.abs(z)
 *     return [0, 0, 0, 0, 0, -Z]
 * })
 * model.addRemote( remote )
 *
 * const solver   = new arch.Solver(model)
 * solver.select("parallel")
 * solver.setNbCores(10)
 * solver.setMaxIter(2000)
 * solver.setEps(1e-9)
 * solver.run()
 *
 * // Post-process
 * const solution = new arch.Solution(model)
 * //solution.setNbCores(10) // not needed since point by point
 *
 * const stresses = new Array(100)
 *     .fill([0,0,0])
 *     .map( v => [Math.random(), Math.random(), 0])    // generate 100 obs random points at z=0
 *     .map( p => solution.stressAt(p[0], p[1], p[2]))  // compute the stress at each point
 *     .map (s => console.log(s))                       // display ths stress at each point
 * ```
 */
export declare namespace Example_1 {
}
