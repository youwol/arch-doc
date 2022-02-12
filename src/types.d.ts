
/**
 * @brief An array of number of any size
 * 
 * @category Math
 */
export type Vectord = Array<number>

/**
 * @brief Represent a vector size 3. It is represented as
 * a flat array of components with the orders `[x, y, z]`
 * 
 * @category Math
 */
export type Vector   = [number,number,number]

/**
 * @brief Represent a vector size 3 of boolean.
 * 
 * @category Math
 */
export type Vectorb  = [boolean,boolean,boolean]

/**
 * @brief Represent a rank 2 symmetric tensor of size 3 (mostly to represent stress and strain). It is represented as
 * a flat array of components with the orders `[xx, xy, xz, yy, yz, zz]`
 * 
 * The representation is
 * <center><img style="width:20%; height:20%;" src="media://tens-sym.png"></center>
 * 
 * @category Math
 */
export type Tensor   = [number,number,number,number,number,number]

/**
 * @brief Represent a rank 2 non-symmetric tensor of size 3 (mostly to represent traction or displscement influence matrices).
 * It is represented as a flat array of components with the orders `[xx, xy, xz, yx, yy, yz, zx, zy, zz]`
 * 
 * The representation is
 * <center><img style="width:20%; height:20%;" src="media://tens-full.png"></center>
 * 
 * @category Math
 */
export type FullTensor   = [number,number,number,number,number,number,number,number,number]

/**
 * @brief An array of [[Vector]], i.e., `[[x,y,z] ... [x,y,z]]`
 * 
 * @category Math
 */
export type Vectors   = Array<Vector>

/**
 * @brief An array of [[Tensor]], i.e., `[[xx, xy, xz, yy, yz, zz] ... [xx, xy, xz, yy, yz, zz]]`
 * 
 * @category Math
 */
export type Tensors   = Array<Tensor>

/**
 * @brief A [flat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/flat) array of [[Vector]], meaning the array is represented as
 * `[x, y, z ... x, y, z]`
 * 
 * <br><br>
 * The number of [[Vector]] is given by
 * ```javascript
 * const n = vectors.length/3
 * ```
 * <br>
 * 
 * There's multiple ways to iterate over all [[Vector]]:
 * ```javascript
 * for (let i=0; i<vectors.length; i += 3) {
 *     const x = vectors[i  ]
 *     const y = vectors[i+1]
 *     const z = vectors[i+2]
 * }
 * ```
 * or
 * ```javascript
 * for (let i=0; i<vectors.length/3; i++) {
 *     const x = vectors[3*i  ]
 *     const y = vectors[3*i+1]
 *     const z = vectors[3*i+2]
 * }
 * ```
 * 
 * @category Math
 */
export type FlatVectors   = Array<number>

/**
 * @brief A [flat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/flat) array of [[Tensor]], meaning the array is represented as
 * `[xx, xy, xz, yy, yz, zz ... xx, xy, xz, yy, yz, zz]`
 * 
 * <br><br>
 * The number of [[Tensor]] is given by
 * ```javascript
 * const n = tensors.length/6
 * ```
 * <br>
 * 
 * There's multiple ways to iterate over all [[Tensor]]:
 * ```javascript
 * for (let i=0; i<tensors.length; i += 6) {
 *     const xx = vectors[i  ]
 *     const xy = vectors[i+1]
 *     const xz = vectors[i+2]
 *     const yy = vectors[i+3]
 *     const yz = vectors[i+4]
 *     const zz = vectors[i+5]
 * }
 * ```
 * or
 * ```javascript
 * for (let i=0; i<tensors.length/6; i++) {
 *     const xx = vectors[6*i  ]
 *     const xy = vectors[6*i+1]
 *     const xz = vectors[6*i+2]
 *     const yy = vectors[6*i+3]
 *     const yz = vectors[6*i+4]
 *     const zz = vectors[6*i+5]
 * }
 * ```
 * 
 * @category Math
 */
export type FlatTensors   = Array<number>
