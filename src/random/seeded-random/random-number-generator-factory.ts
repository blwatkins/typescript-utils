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

import { StaticInstanceError } from '../../error';
import { StringUtility } from '../../string';

import { SeedVersions } from './seed-versions';
import { SeededRandomNumberGenerator } from './seeded-random-number-generator';

/**
 * @type {TextEncoder}
 */
const textEncoder: TextEncoder = new TextEncoder();

/**
 * A static factory class for creating a {@link SeededRandomNumberGenerator} object.
 *
 * @since 0.1.0
 */
export class RandomNumberGeneratorFactory {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link RandomNumberGeneratorFactory} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('RandomNumberGeneratorFactory is a static class and cannot be instantiated.');
    }

    /**
     * Prime number for FNV-1a hashing algorithm.
     * This number is an algorithmic constant; it must not change.
     *
     * @returns {number} 0x01000193
     *
     * @private
     */
    static get #fnvPrime(): 0x01000193 {
        return 0x01000193;
    }

    /**
     * Build a {@link SeededRandomNumberGenerator} object.
     *
     * @see {@link SeedVersions.assertValidIndex}
     *
     * @param {string} seed - The primary input to determine the random number sequence.
     * @param {string | undefined} namespace - Namespace to create different sequences from the same seed.
     * @param {number | undefined} version - The {@link SeedVersions} index to use for selecting the offsets for hashing.
     * Changing the version number will result in a different sequence of random numbers for the same seed and namespace.
     *
     * @returns {SeededRandomNumberGenerator} A {@link SeededRandomNumberGenerator} object with the resulting initial state.
     *
     * @throws {PrimitiveTypeError} When `seed` is not a string.
     * @throws {PrimitiveTypeError} When `namespace` is not a string.
     * @throws {PrimitiveTypeError} When `version` is not a positive integer or zero.
     * @throws {ValueRangeError} When `version` is not a valid {@link SeedVersions} index.
     *
     * @public
     * @since 0.1.0
     */
    public static build(seed: string, namespace?: string, version?: number): SeededRandomNumberGenerator {
        StringUtility.assertStringType(seed, 'seed must be a string.');
        if (namespace !== undefined) StringUtility.assertStringType(namespace, 'namespace must be a string.');
        if (version !== undefined) SeedVersions.assertValidIndex(version);

        const input: string = RandomNumberGeneratorFactory.#buildInputString(seed, namespace);
        const state: [number, number, number, number] = RandomNumberGeneratorFactory.#generateFnvHashState(input, version);
        return new SeededRandomNumberGenerator(state);
    }

    /**
     * Build a {@link SeededRandomNumberGenerator} object from an asynchronous hashing algorithm.
     *
     * @remarks This method relies on the Web Crypto API via `crypto.subtle`.
     * In Node.js environments, ensure you are using a version where the Web Crypto API is available.
     *
     * @param {string} seed - The primary input to determine the random number sequence.
     * @param {string | undefined} namespace - Namespace to create different sequences from the same seed.
     *
     * @returns {Promise<SeededRandomNumberGenerator>} A {@link SeededRandomNumberGenerator} object with the resulting initial state.
     *
     * @throws {PrimitiveTypeError} When `seed` is not a string.
     * @throws {PrimitiveTypeError} When `namespace` is not a string.
     *
     * @public
     * @since 0.1.0
     */
    public static async asyncBuild(seed: string, namespace?: string): Promise<SeededRandomNumberGenerator> {
        StringUtility.assertStringType(seed, 'seed must be a string.');
        if (namespace !== undefined) StringUtility.assertStringType(namespace, 'namespace must be a string.');

        const input = RandomNumberGeneratorFactory.#buildInputString(seed, namespace);
        const state = await RandomNumberGeneratorFactory.#generateSha256HashState(input);
        return new SeededRandomNumberGenerator(state);
    }

    /**
     * Build the hash algorithm input string.
     *
     * @param {string} seed - The primary seed input to determine the random number sequence.
     * @param {string | undefined} namespace - Optional namespace to create different sequences from the same seed.
     *
     * @returns {string} The input string for the hash algorithm.
     * If `namespace` is provided, the input string will concatenate `namespace` and `seed` with a null character (`\x00`) separator.
     * If `namespace` is not provided, the input string will be `seed` alone.
     *
     * @throws {PrimitiveTypeError} When `seed` is not a string.
     * @throws {PrimitiveTypeError} When `namespace` is not a string.
     *
     * @private
     */
    static #buildInputString(seed: string, namespace?: string): string {
        StringUtility.assertStringType(seed, 'seed must be a string.');
        if (namespace !== undefined) StringUtility.assertStringType(namespace, 'namespace must be a string.');

        if (namespace === undefined) {
            return seed;
        } else {
            return `${namespace}\x00${seed}`;
        }
    }

    /**
     * Create a state array from `input` using the FNV-1a hashing algorithm.
     * The state is generated by hashing `input` with four different offsets, which are determined by `version`.
     *
     * @see {@link SeedVersions.assertValidIndex}
     *
     * @param {string} input - Input to be hashed and converted into the initial state of the random number generator.
     * @param {number} version - The {@link SeedVersions} index to use for selecting the offsets for hashing.
     * Changing the version number will result in a different sequence of random numbers for the same input.
     * Default value is 0.
     *
     * @returns {[number, number, number, number]} The initial state array for the random number generator.
     *
     * @throws {PrimitiveTypeError} When `input` is not a string.
     * @throws {PrimitiveTypeError} When `version` is not a positive integer or zero.
     * @throws {ValueRangeError} When `version` is not a valid {@link SeedVersions} index.
     *
     * @private
     */
    static #generateFnvHashState(input: string, version: number = 0): [number, number, number, number] {
        StringUtility.assertStringType(input, 'input must be a string.');
        SeedVersions.assertValidIndex(version);

        const bytes = textEncoder.encode(input);
        const offsets: readonly [number, number, number, number] = SeedVersions.getVersion(version).offsets;
        const [o0, o1, o2, o3] = offsets;

        const hash = (offset: number): number => {
            let h = offset;
            for (const byte of bytes) {
                h ^= byte;
                h = Math.imul(h, RandomNumberGeneratorFactory.#fnvPrime);
            }
            return h >>> 0;
        };

        return [
            hash(o0), hash(o1), hash(o2), hash(o3)
        ];
    }

    /**
     * Create a state array using the SHA-256 hashing algorithm.
     *
     * @remarks This method hashes `input` with SHA-256 and folds the 256-bit output into 128 bits by XOR-ing the two 128-bit halves together, fully utilizing all output bits.
     * This method relies on the Web Crypto API via `crypto.subtle`.
     * In Node.js environments, ensure you are using a version where the Web Crypto API is available.
     *
     * @param {string} input - Input to be hashed and converted into the initial state of the random number generator.
     *
     * @returns {Promise<[number, number, number, number]>} The initial state array for the random number generator.
     *
     * @throws {PrimitiveTypeError} When `input` is not a string.
     *
     * @private
     */
    static async #generateSha256HashState(input: string): Promise<[number, number, number, number]> {
        StringUtility.assertStringType(input, 'input must be a string.');
        const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', textEncoder.encode(input));
        const v: DataView = new DataView(hashBuffer);

        return [
            (v.getUint32(0, false) ^ v.getUint32(16, false)) >>> 0,
            (v.getUint32(4, false) ^ v.getUint32(20, false)) >>> 0,
            (v.getUint32(8, false) ^ v.getUint32(24, false)) >>> 0,
            (v.getUint32(12, false) ^ v.getUint32(28, false)) >>> 0
        ];
    }
}
