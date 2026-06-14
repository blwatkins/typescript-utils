/*
 * Copyright (c) 2026 Brittni Watkins.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { SeedVersions } from './seed-versions';

import { NumberUtility } from '../../number';

/**
 * Deterministic seeded pseudorandom number generator.
 * This generator utilizes the xoshiro128** algorithm, which is a pseudorandom number generator suitable for general-purpose use.
 *
 * @since 0.1.0
 */
export class SeededRandomNumberGenerator {
    /**
     * Internal xoshiro128** state (4 x 32-bit unsigned integers).
     *
     * @private
     * @readonly
     */
    readonly #state: [number, number, number, number];

    /**
     * @param {[number, number, number, number]} state - Initial 128-bit state.
     * @param {number} version - Seed version index used when repairing a zero-state (each value of state is 0). Default is 0.
     *
     * @throws {TypeError} - When the given version is not an integer.
     * @throws {RangeError} - When the given version is not a valid {@link SeedVersions} index.
     *
     * @see {@link SeedVersions.size}
     * @see {@link SeedVersions.isValidIndex}
     *
     * @since 0.1.0
     */
    public constructor(state: [number, number, number, number], version: number = 0) {
        if (!NumberUtility.isInteger(version)) {
            throw new TypeError('Version must be an integer.');
        }

        if (!SeedVersions.isValidIndex(version)) {
            throw new RangeError('Version must be a valid seed versions index.');
        }

        if (state[0] === 0 && state[1] === 0 && state[2] === 0 && state[3] === 0) {
            this.#state = [SeedVersions.getVersion(version).defaultStateValue, state[1], state[2], state[3]];
        } else {
            this.#state = [state[0], state[1], state[2], state[3]];
        }
    }

    /**
     * @remarks This method advances the internal 128-bit xoshiro128** state by one step.
     * Successive calls produce an independent, uniformly distributed sequence.
     *
     * @returns {number} - The next pseudorandom float in the range [0, 1).
     *
     * @since 0.1.0
     */
    public next(): number {
        const [s0, s1, s2, s3] = this.#state;

        // xoshiro128** output: rotl(s1 * 5, 7) * 9, mapped to [0, 1)
        const result = SeededRandomNumberGenerator.#rotl(Math.imul(s1, 5), 7);
        const output = (Math.imul(result, 9) >>> 0) / 4294967296;

        // xoshiro128** state advancement
        const t = (s1 << 9) >>> 0;
        this.#state[2] ^= s0;
        this.#state[3] ^= s1;
        this.#state[1] ^= s2;
        this.#state[0] ^= s3;
        this.#state[2] ^= t;
        this.#state[3] = SeededRandomNumberGenerator.#rotl(s3, 11);

        return output;
    }

    /**
     * Rotates the bits of a 32-bit unsigned integer left by k positions.
     *
     * @param {number} x - The number to rotate. Must be a 32-bit unsigned integer.
     * @param {number} k - The number of bits to rotate.
     * @returns {number}
     * @private
     */
    static #rotl(x: number, k: number): number {
        return ((x << k) | (x >>> (32 - k))) >>> 0;
    }
}
