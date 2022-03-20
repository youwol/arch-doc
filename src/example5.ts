/**
 * Example showing how to apply an incremental remote stress.
 * Depending on the remote stress magnitudes, by cumulating deformation
 * at observation grid should be different than applying the remote in
 * one go:
 *
 * ```js
 * const arch = require('arch.node')
 * const geom = require('@youwol/geometry')
 * const math = require('@youwol/math')
 * const df   = require('@youwol/dataframe')
 * const io   = require('@youwol/io')
 * const fs   = require('fs')
 * 
 * const model = new arch.Model()
 * model.setMaterial( 0.25, 1, 1 )
 * 
 * const fault = new arch.Surface([0,0,0, 1,0,0, 1,1,-0.5], [0,1,2])
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
 * const grid = geom.generateRectangle({
 *      a: 5, b: 5, 
 *      na: 100, nb: 100, 
 *      center: [0.5,0.5,2]
 * })
 * let points = grid.series.positions.array
 * 
 * // ------------------------------------------------
 * 
 * const n = 10 // nb steps
 * remote.setFunction( (x,y,z) => [0,0,0,0,0, -1000/n] )
 * 
 * for (let i=0; i<n; ++i) {
 *     solver.run()
 * 
 *     // Cumulate the deformation at points
 *     const u = solution.displ(points)
 *     points = points.map( (v,j) => v+u[j])
 * }
 * 
 * grid.series.positions = df.Serie.create({array: points, itemSize: 3})
 * console.log( math.minMax(grid.series.positions) )
 * 
 * fs.writeFile('deformed-grid.gcd', io.encodeGocadTS(grid), 'utf8', err => {})
 * ```
*/
export namespace Example_incremental_remote {}
