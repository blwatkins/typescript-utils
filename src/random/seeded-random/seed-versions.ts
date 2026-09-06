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

import { StaticInstanceError, ValueRangeError } from '../../error';
import { NumberUtility } from '../../number';
import { StringUtility } from '../../string';

/**
 * A seed version defines a specific set of offsets for the FNV-1a hashing algorithm.
 * A different set of offsets results in a different hash for the same input, which results in a different initial state for the seeded random number generator, which results in a different sequence of pseudorandom numbers.
 *
 * @since 0.1.0
 */
export interface SeedVersion {
    /**
     * A collection of offset values for the FNV-1a hashing algorithm.
     * Each offset value should be a 32-bit unsigned integer.
     *
     * @type {[number, number, number, number]}
     * @readonly
     * @since 0.1.0
     */
    readonly offsets: readonly [number, number, number, number];
}

/**
 * @remarks Once a seed version has been published, it should <b>NEVER</b> be changed or updated.
 * The order of seed versions should <b>NEVER</b> be changed.
 * New seed versions can only be added to the end of the array.
 * Each element in the offsets array should be unique.
 *
 * @constant
 */
const seedVersions: readonly SeedVersion[] = [
    {
        offsets: Object.freeze([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a])
    },
    {
        offsets: Object.freeze([0x811c9dc5, 0x34f9a34, 0xa1b2c3d4, 0x5e6f7a8b])
    }
];

/**
 * A static class for accessing different seed versions.
 * Each seed version index is guaranteed to always return the same seed version object, so that the same seed and version will always produce the same sequence of pseudorandom numbers.
 *
 * @since 0.1.0
 */
export class SeedVersions {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link SeedVersions} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('SeedVersions is a static class and cannot be instantiated.');
    }

    /**
     * The number of seed versions.
     *
     * @returns {number} The total number of seed versions that currently exist.
     *
     * @public
     * @since 0.1.0
     */
    static get size(): number {
        return seedVersions.length;
    }

    /**
     * Assert that `input` is a valid seed version index.
     *
     * @see {@link SeedVersions.isValidIndex}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a valid seed version index.
     *
     * @returns {asserts input is number} Asserts that `input` is a valid seed version index.
     *
     * @throws {PrimitiveTypeError} When `input` is not a positive integer or zero.
     * @throws {ValueRangeError} When `input` is not a valid seed version index.
     *
     * @public
     * @since 0.1.0
     */
    static assertValidIndex(input: unknown, message?: string): asserts input is number {
        if (!SeedVersions.isValidIndex(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new ValueRangeError(message);
            }

            throw new ValueRangeError(`Input is out of bounds for valid seed version index [0-${SeedVersions.size - 1}].`);
        }
    }

    /**
     * Is `input` a valid seed version?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {boolean} `true` if `input` is a valid seed version; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `input` is not a positive integer or zero.
     *
     * @public
     * @since 0.1.0
     */
    static isValidIndex(input: unknown): boolean {
        NumberUtility.assertPositiveInteger(input, true);
        return input < seedVersions.length;
    }

    /**
     * Get a {@link SeedVersion} object.
     *
     * @param {number} index - The index of the seed version to retrieve.
     * Must be a valid {@link SeedVersions} index.
     *
     * @returns {SeedVersion} The seed version corresponding to `index`.
     *
     * @throws {PrimitiveTypeError} When `index` is not a positive integer or zero.
     * @throws {ValueRangeError} When `index` is not a valid seed version index.
     *
     * @public
     * @since 0.1.0
     */
    static getVersion(index: number): SeedVersion {
        SeedVersions.assertValidIndex(index);
        return seedVersions[index];
    }
}
