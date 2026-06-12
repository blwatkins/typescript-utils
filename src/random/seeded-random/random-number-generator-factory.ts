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

import { NumberUtility } from '../../number';
import { StringUtility } from '../../string';

import { SeedVersions } from './seed-versions';
import { SeededRandomNumberGenerator } from './seeded-random-number-generator';

/**
 * @type {TextEncoder}
 */
const textEncoder: TextEncoder = new TextEncoder();

/**
 * @type {Crypto|undefined}
 */
const cryptoApi: Crypto | undefined = globalThis.crypto;

/**
 * A static factory class for creating a {@link SeededRandomNumberGenerator} object.
 *
 * @since 0.1.0
 */
export class RandomNumberGeneratorFactory {
    /**
     * @throws {Error} - RandomNumberGeneratorFactory is a static class and cannot be instantiated.
     *
     * @private
     *
     * @since 0.1.0
     */
    private constructor() {
        throw new Error('RandomNumberGeneratorFactory is a static class and cannot be instantiated.');
    }

    /**
     * Prime number for FNV-1a hashing algorithm.
     * This number is an algorithmic constant; it must not change.
     *
     * @private
     *
     * @returns {number} - 0x01000193
     */
    static get #fnvPrime(): 0x01000193 {
        return 0x01000193;
    }

    /**
     * Build a {@link SeededRandomNumberGenerator} object with the given seed, namespace, and version.
     *
     * @param {string} seed - The primary input to determine the random number sequence.
     * @param {string|undefined} namespace - Namespace to create different sequences from the same seed.
     * @param {number|undefined} version - The {@link SeedVersions} index to use for selecting the offsets for hashing.
     * Changing the version number will result in a different sequence of random numbers for the same seed and namespace.
     *
     * @returns {SeededRandomNumberGenerator}
     *
     * @throws {TypeError} - When the given seed is not a string.
     * @throws {TypeError} - When the given namespace is not a string.
     * @throws {TypeError} - When the given version is not an integer.
     * @throws {RangeError} - When the given version is not a valid {@link SeedVersions} index.
     *
     * @see {@link SeedVersions.size}
     * @see {@link SeedVersions.isValidIndex}
     *
     * @since 0.1.0
     */
    public static build(seed: string, namespace?: string, version?: number): SeededRandomNumberGenerator {
        RandomNumberGeneratorFactory.#validateBuildInputs(seed, namespace, version);
        const input: string = RandomNumberGeneratorFactory.#buildInputString(seed, namespace);
        const state: [number, number, number, number] = RandomNumberGeneratorFactory.#generateFnvHashState(input, version);
        return new SeededRandomNumberGenerator(state, version);
    }

    /**
     * Build a {@link SeededRandomNumberGenerator} object with the given seed and namespace from an asynchronous hashing algorithm.
     *
     * @remarks This method relies on the Web Crypto API via `crypto.subtle`.
     * In Node.js environments, ensure you are using a version where the Web Crypto API is available.
     *
     * @param {string} seed - The primary input to determine the random number sequence.
     * @param {string|undefined} namespace - Namespace to create different sequences from the same seed.
     *
     * @returns {Promise<SeededRandomNumberGenerator>}
     *
     * @throws {Error} - When the Web Crypto API is not available.
     * @throws {TypeError} - When the given seed is not a string.
     * @throws {TypeError} - When the given namespace is not a string.
     *
     * @since 0.1.0
     */
    public static async asyncBuild(seed: string, namespace?: string): Promise<SeededRandomNumberGenerator> {
        const subtle: SubtleCrypto | undefined = cryptoApi?.subtle;
        if (!subtle) {
            throw new Error('Web Crypto API is not available in this environment. asyncBuild requires crypto.subtle.digest support.');
        }

        RandomNumberGeneratorFactory.#validateBuildInputs(seed, namespace);
        const input = RandomNumberGeneratorFactory.#buildInputString(seed, namespace);
        const state = await RandomNumberGeneratorFactory.#generateSha256HashState(input);
        return new SeededRandomNumberGenerator(state);
    }

    /**
     * @param {string} seed - seed to validate
     * @param {string|undefined} namespace - namespace to validate
     * @param {number|undefined} version - version to validate
     *
     * @throws {TypeError} - When the given seed is not a string.
     * @throws {TypeError} - When the given namespace is not a string.
     * @throws {TypeError} - When the given version is not an integer.
     * @throws {RangeError} - When the given version is not a valid {@link SeedVersions} index.
     *
     * @see {@link SeedVersions.isValidIndex}
     *
     * @private
     */
    static #validateBuildInputs(seed: string, namespace?: string, version?: number): void {
        if (!StringUtility.isString(seed)) {
            throw new TypeError('Seed must be a string.');
        }

        if (namespace !== undefined && !StringUtility.isString(namespace)) {
            throw new TypeError('Namespace must be a string.');
        }

        if (version !== undefined && !NumberUtility.isInteger(version)) {
            throw new TypeError('Version must be an integer.');
        }

        if (version !== undefined && !SeedVersions.isValidIndex(version)) {
            throw new RangeError('Version must be a valid seed versions index.');
        }
    }

    /**
     * Build the hash algorithm input string from the given seed and namespace.
     *
     * @param {string} seed
     * @param {string|undefined} namespace - Optional namespace to create different sequences from the same seed.
     *
     * @returns {string}
     *
     * @private
     */
    static #buildInputString(seed: string, namespace?: string): string {
        if (StringUtility.isString(namespace)) {
            return `${namespace}\x00${seed}`;
        } else {
            return seed;
        }
    }

    /**
     * Create a state array from the given input using the FNV-1a hashing algorithm.
     * The state is generated by hashing the input string with four different offsets, which are determined by the given version number.
     *
     * @param {string} input - Input to be hashed and converted into the initial state of the random number generator.
     * @param {number} version - The {@link SeedVersions} index to use for selecting the offsets for hashing.
     * Changing the version number will result in a different sequence of random numbers for the same input.
     * Default value is 0.
     *
     * @returns {[number, number, number, number]}
     *
     * @throws {TypeError} - When the given input is not a string.
     * @throws {TypeError} - When the given version is not an integer.
     * @throws {RangeError} - When the given version is not a valid {@link SeedVersions} index.
     *
     * @see {@link SeedVersions.size}
     * @see {@link SeedVersions.isValidIndex}
     *
     * @private
     */
    static #generateFnvHashState(input: string, version: number = 0): [number, number, number, number] {
        RandomNumberGeneratorFactory.#validateBuildInputs(input, undefined, version);
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
     * Create a state array from the given input using the SHA-256 hashing algorithm.
     *
     * @remarks This method hashes the given input with SHA-256 and folds the 256-bit output into 128 bits by XOR-ing the two 128-bit halves together, fully utilizing all output bits.<hr/>
     * This method relies on the Web Crypto API via `crypto.subtle`.
     * In Node.js environments, ensure you are using a version where the Web Crypto API is available.
     *
     * @param {string} input - Input to be hashed and converted into the initial state of the random number generator.
     *
     * @returns {[number, number, number, number]}
     *
     * @throws {Error} - When the Web Crypto API is not available.
     * @throws {TypeError} - When the given input is not a string.
     *
     * @private
     */
    static async #generateSha256HashState(input: string): Promise<[number, number, number, number]> {
        const subtle: SubtleCrypto | undefined = cryptoApi?.subtle;
        if (!subtle) {
            throw new Error('Web Crypto API is not available in this environment. asyncBuild requires crypto.subtle.digest support.');
        }

        RandomNumberGeneratorFactory.#validateBuildInputs(input);
        const hashBuffer: ArrayBuffer = await subtle.digest('SHA-256', textEncoder.encode(input));
        const v: DataView = new DataView(hashBuffer);

        return [
            (v.getUint32(0, false) ^ v.getUint32(16, false)) >>> 0,
            (v.getUint32(4, false) ^ v.getUint32(20, false)) >>> 0,
            (v.getUint32(8, false) ^ v.getUint32(24, false)) >>> 0,
            (v.getUint32(12, false) ^ v.getUint32(28, false)) >>> 0
        ];
    }
}
