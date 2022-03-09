/**
 * A simple example using the Arch API
 * 
 * ---
 * ```js
 * const Module = require('arch')
 * 
 * const model = new arch.Model()
 * model.setHalfSpace( false )
 * model.setMaterial ( 0.25, 1, 1000 )
 * model.addSurface  ( new arch.Surface([0,0,0, 1,0,0, 1,1,0], [0,1,2]) )
 * model.addRemote   ( new arch.UserRemote( (x,y,z) => [0,0,0,0,0,-1] ) )
 * 
 * const solver   = new arch.Forward(model, 'seidel', 1e-9, 200)
 * solver.run()
 * 
 * const solution = new arch.Solution(model)
 * const stresses = new Array(100)
 *      .fill([0,0,0])
 *      .map( v => [Math.random(), Math.random(), 0])    // generate 100 random points
 *      .map( p => solution.stressAt(p[0], p[1], p[2]))  // compute the stress
 *      .map (s => console.log(s))                       // display ths stress
 * ```
 * ---
 */
export namespace Example_1 {} 

