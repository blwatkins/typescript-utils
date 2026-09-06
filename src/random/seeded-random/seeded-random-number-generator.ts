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
 *
 * SPDX-License-Identifier: MIT
 */

import { TypeAssertions } from '../../assert';
import { PrimitiveTypeError, ValueRangeError } from '../../error';
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
     * @type {[number, number, number, number]}
     * @readonly
     * @private
     */
    readonly #state: [number, number, number, number];

    /**
     * Public constructor.
     *
     * @param {[number, number, number, number]} state - Initial 128-bit state.
     * Must be an array with 4 32-bit unsigned integers, where at least one element is greater than 0.
     *
     * @throws {TypeError} When state is not an array with 4 elements.
     * @throws {RangeError} When each element of state is not a 32-bit unsigned integer.
     * @throws {RangeError} When state does not have at least one element that is greater than 0.
     *
     * @public
     * @since 0.1.0
     */
    public constructor(state: [number, number, number, number]) {
        this.#assertState(state);
        this.#state = [state[0], state[1], state[2], state[3]];
    }

    /**
     * Get the next number in the seeded sequence.
     *
     * @remarks This method advances the internal 128-bit xoshiro128** state by one step.
     * Successive calls produce an independent, uniformly distributed sequence.
     *
     * @returns {number} The next pseudorandom float in the range [0, 1).
     *
     * @public
     * @since 0.1.0
     */
    public next(): number {
        // xoshiro128** output: rotl(this.#state[1] * 5, 7) * 9, mapped to [0, 1)
        const result = SeededRandomNumberGenerator.#rotl(Math.imul(this.#state[1], 5), 7);
        const output = (Math.imul(result, 9) >>> 0) / 4294967296;

        // xoshiro128** state advancement
        const t = (this.#state[1] << 9) >>> 0;
        this.#state[2] ^= this.#state[0];
        this.#state[3] ^= this.#state[1];
        this.#state[1] ^= this.#state[2];
        this.#state[0] ^= this.#state[3];
        this.#state[2] ^= t;
        this.#state[3] = SeededRandomNumberGenerator.#rotl(this.#state[3], 11);

        return output;
    }

    /**
     * Rotates the bits of a 32-bit unsigned integer left by k positions.
     *
     * @param {number} x - The number to rotate. Must be a 32-bit unsigned integer.
     * @param {number} k - The number of bits to rotate.
     *
     * @returns {number} The rotated 32-bit unsigned integer.
     *
     * @private
     */
    static #rotl(x: number, k: number): number {
        return ((x << k) | (x >>> (32 - k))) >>> 0;
    }

    /**
     * The maximum valid value in the state array.
     *
     * @returns {number} 0xFFFFFFFF
     *
     * @private
     */
    static get #maxStateValue(): 0xFFFFFFFF {
        return 0xFFFFFFFF;
    }

    /**
     * Assert that the given input is a valid state array.
     *
     * @remarks For a state array to be valid, it must be an array of exactly 4 32-bit unsigned integers, where each integer is less than or equal to 0xFFFFFFFF.
     * Additionally, a valid state array must have at least one element that is greater than zero.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {asserts input is [number, number, number]} Asserts that the given input is a valid state array.
     *
     * @throws {PrimitiveTypeError} When the given input is not an array.
     * @throws {PrimitiveTypeError} When the given input array does not have exactly 4 elements.
     * @throws {ValueRangeError} When all elements of the given input array are not 32-bit unsigned integers less than 0xFFFFFFFF.
     * @throws {ValueRangeError} When all elements of the given input array are equal to zero.
     *
     * @private
     */
    #assertState(input: unknown): asserts input is [number, number, number] {
        TypeAssertions.assertArrayType(input);
        if (input.length !== 4) throw new PrimitiveTypeError('State must have exactly 4 elements.');

        const allValidStateValues: boolean = input.every((value: unknown): boolean => {
            return NumberUtility.isPositiveInteger(value, true) && value <= SeededRandomNumberGenerator.#maxStateValue;
        });

        if (!allValidStateValues) {
            throw new ValueRangeError('All elements of state array must be 32-bit unsigned integers (maximum value 0xFFFFFFFF).');
        }

        const allZeroValues: boolean = input.every((value: unknown): boolean => {
            return NumberUtility.isFiniteNumber(value) && value === 0;
        });

        if (allZeroValues) {
            throw new ValueRangeError('State must have at least one element that is greater than 0.');
        }
    }
}
