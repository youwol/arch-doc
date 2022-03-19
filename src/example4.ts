/**
 * Example showing how to compute solutions to use with the principal
 * of superposition. The generated Gocad TSurf file will export the grid
 * with 8 displacement and stress fields as attributes. They are named:
 * `U1 S1 U2 S2 U3 S3 U4 S4 U5 S5 U6 S6 U7 S7 U8 S8`, where `U`stand for
 * displacement and `S` for stress.
 * 
 * The second script is to use the superposition with the generated file.
 * 
 * ## Pre-computing the 8 simulations
 *
 * ```js
 * const arch = require('arch.node')
 * const io   = require('@youwol/io')
 * const df   = require('@youwol/dataframe')
 * const math = require('@youwol/math')
 * const geom = require('@youwol/geometry')
 * const fs   = require('fs')
 * 
 * const model = new arch.Model()
 * model.setMaterial ( 0.25, 30e9, 2000 )
 * model.setHalfSpace( true )
 * 
 * const dataframe  = io.decodeGocadTS( fs.readFileSync('surface.ts', 'utf8') )[0]
 * 
 * const chamber = new arch.Surface(
 *     dataframe.series.positions.array,
 *     dataframe.series.indices.array
 * )
 * chamber.setBC("dip",    "free", 0)
 * chamber.setBC("strike", "free", 0)
 * chamber.setBC("normal", "free", 0)
 * model.addSurface( chamber )
 * 
 * const remote = new arch.UserRemote() // will be set later on
 * model.addRemote( remote )
 * 
 * const solver = new arch.Forward(model, 'seidel', 1e-8, 200)
 * solver.setAutoReleaseMemory(false)
 * 
 * // ------------------------------------------------
 * 
 * // [minX, minY, minZ, maxX, maxY, maxZ]
 * const bounds = model.bounds()
 * const d = Math.max(bounds[3]-bounds[0], bounds[4]-bounds[1])
 * 
 * const grid = geom.generateRectangle({
 *     a: 2*d,
 *     b: 2*d, 
 *     na: 50, 
 *     nb: 50, 
 *     center: [(bounds[3]+bounds[0])/2, (bounds[4]+bounds[1])/2, 0] // at z=0
 * })
 * const obs = grid.series.positions.array
 * 
 * // [xx, xy, xz, yy, yz, zz, density, shift]
 * const nbSimulations = 8
 * 
 * const doSimulation = index => {
 *     const alpha = new Array(nbSimulations).
 *         fill(0).map( (v,i) => i===(index-1) ? 1 : 0 )
 *     console.log(`=======> Doing simulation  + ${alpha}` )
 * 
 *     remote.setFunction( (x,y,z) => {
 *         return [
 *             alpha[0]*Math.abs(z), // xx
 *             alpha[1]*Math.abs(z), // xy
 *             alpha[2]*Math.abs(z), // xz
 *             alpha[3]*Math.abs(z), // yy
 *             alpha[4]*Math.abs(z), // yz
 *             alpha[5]*Math.abs(z)  // zz
 *         ]
 *     })
 *     // Pressure in the cavity
 *     chamber.setBC( "normal", "free", (x,y,z) => alpha[6]*9.81*Math.abs(z) + alpha[7] )
 * 
 *     solver.run()
 *     const solution = new arch.Solution(model)
 * 
 *     grid.series[`U${index}`] = df.Serie.create({
 *         array: solution.displ(obs),
 *         itemSize: 3
 *     })
 * 
 *     grid.series[`S${index}`] = df.Serie.create({
 *         array: solution.stress(obs),
 *         itemSize: 6
 *     })
 * }
 * 
 * for (let i=1; i<=nbSimulations; ++i) {
 *     doSimulation(i)
 * }
 * 
 * fs.writeFile('simulations.ts', io.encodeGocadTS(grid), 'utf8', err => {})
 * ```
 * 
 * ## Using the superposition for realtime computation
 * 
 * ```js
 * // Note that Arch is no longer necessary :-)
 * const io     = require('@youwol/io')
 * const geo    = require('@youwol/geophysics')
 * const fs     = require('fs')
 * 
 * const dataframe  = io.decodeGocadTS( fs.readFileSync('simulations.ts', 'utf8') )[0]
 * 
 * //             xx   xy   xz   yy    yz   zz   rho pe
 * const alpha = [72,  2,   11,  110,  100, 1,   5,  3 ]
 * 
 * dataframe.series['displ'] = geo.forward.attribute({
 *     simulations: dataframe,
 *     name: 'U',
 *     alpha,
 *     startIndex: 1
 * })
 * 
 * dataframe.series['stress'] = geo.forward.attribute({
 *     simulations: dataframe,
 *     name: 'S',
 *     alpha,
 *     startIndex: 1
 * })
 * 
 * const bufferOut = io.encodeGocadTS(dataframe)
 * fs.writeFile('example.ts', bufferOut, 'utf8', err => {})
 * ```
*/
export namespace Example_superposition {}
