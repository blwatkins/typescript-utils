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

/**
 * A seed version defines a specific set of offsets and a default state value for the seeded random number generator algorithm.
 *
 * @since 0.1.0
 */
export interface SeedVersion {
    /**
     * A collection of offset values that can be utilized in the seeded random number generator algorithm.
     * Each offset value should be a 32-bit unsigned integer.
     */
    readonly offsets: readonly [number, number, number, number];

    /**
     * A default state value to be used when the random number generator reaches a zero-state.
     * This value should <b>NEVER</b> be zero.
     */
    readonly defaultStateValue: number;
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
        offsets: Object.freeze([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a]),
        defaultStateValue: Object.freeze(0x6a09e667)
    },
    {
        offsets: Object.freeze([0x811c9dc5, 0x34f9a34, 0xa1b2c3d4, 0x5e6f7a8b]),
        defaultStateValue: Object.freeze(0x811c9dc5)
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
     * @throws {Error} - SeedVersions is a static class and cannot be instantiated.
     * @private
     */
    private constructor() {
        throw new Error('SeedVersions is a static class and cannot be instantiated.');
    }

    /**
     * @returns {number} - The total number of seed versions that currently exist.
     * @since 0.1.0
     */
    static get size(): number {
        return seedVersions.length;
    }

    /**
     * Is the given index a valid seed version?
     *
     * @param {number} index - The index to check.
     * @returns {boolean}
     * @since 0.1.0
     */
    static isValidIndex(index: number): boolean {
        return Number.isInteger(index) && index >= 0 && index < seedVersions.length;
    }

    /**
     * @param {number} index
     * @returns {SeedVersion} - The seed version with the given index.
     * @throws {Error} - If the index is not a valid seed version index.
     * @since 0.1.0
     */
    static getVersion(index: number): SeedVersion {
        if (!SeedVersions.isValidIndex(index)) {
            throw new RangeError(`SeedVersion ${index} does not exist`);
        }

        return seedVersions[index];
    }
}
