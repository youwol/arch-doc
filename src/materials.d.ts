// export namespace materials {

    /**
     * @brief A basic homogeneous and isotropic material
     */
    export class Material {
        constructor()
        constructor(poisson: number, young: number, density: number)

        /**
         * @brief The Poisson ratio
         * @default 0.25
         */
        poisson: number

        /**
         * @brief The Young's modulus
         * @default 1
         */
        young: number

        /**
         * @brief The density
         * @default 1
         */
        density: number
    }

// }
