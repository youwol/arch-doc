/**
 * ## Difference between Arch compiled with node.js and WebAssembly.
 * 
 * In both cases, the API is the same and in the following we assume that
 * a script is launched using `node.js`.
 * 
 * ### Node.js
 * When comiling Arch with node.js, the library is loaded
 * synchronously. As a consequence, a `require` is enough:
 * 
 * ---
 * ```js
 * const arch = require('arch.node')
 * 
 * // YOUR CODE
 * ```
 * ___
 * 
 * ### WebAssembly
 * When compiling Arch with WebAssembly to generate the JS library from C++, the
 * initialization of the library is different:
 * 
 * ---
 * ```js
 * const Module = require('arch')
 * 
 * Module().then( arch => {
 * 
 *      // YOUR CODE
 * 
 * })
 * ```
 * ---
 * 
 * 
 */
export namespace Node_vs_WASM {}
