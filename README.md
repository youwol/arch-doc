# <center>Arch.node</center>


Our goal is to merge `arch-doc` and `arch-node-doc` into one common API.
<br>
<br>
<br>

**Arch.node** is a [YouWol](https://youwol.com) Javascript package created for [node.js](https://nodejs.org/en/) in order to run **Arch** in C++ (the successor of [**Poly3D**](https://en.wikipedia.org/wiki/David_D._Pollard) and [**iBem3D**](https://www.sciencedirect.com/science/article/pii/S0098300414001496)) in a console using `node.js`.

This version of **Arch** for node.js allows coputation for large models and parallelization of the solver and the post process.

<center><img src="media://arche.jpg" alt="drawing" width="500"/></center>

## Documentation
Have a look [online](https://youwol.github.io/arch-node-doc/dist/docs/index.html).

## References
This [boundary element](https://en.wikipedia.org/wiki/Boundary_element_method) code is based on
___
[Maerten, F., Maerten, L., & Pollard, D. D. (2014). iBem3D, a three-dimensional iterative boundary element method using angular dislocations for modeling geologic structures. Computers & Geosciences, 72, 1-17.](https://www.sciencedirect.com/science/article/pii/S0098300414001496)
___

with corrections for singular points from
___
[Nikkhoo, M., & Walter, T. R. (2015). Triangular dislocation: an analytical, artefact-free solution. Geophysical Journal International, 201(2), 1119-1141.](https://academic.oup.com/gji/article/201/2/1119/572006)
___
