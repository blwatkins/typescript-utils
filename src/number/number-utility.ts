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
 * Static properties and methods for validating number types.
 *
 * @since 0.1.0
 */
export class NumberUtility {
    /**
     * Private constructor.
     *
     * @throws {Error} - NumberUtility is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new Error('NumberUtility is a static class and cannot be instantiated.');
    }

    /**
     * Is the given input a finite number?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is number} `true` when the input is a finite number; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isFiniteNumber(input: unknown): input is number {
        return Number.isFinite(input);
    }

    /**
     * Is the given input an integer?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is number} `true` when the input is an integer; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isInteger(input: unknown): input is number {
        return Number.isInteger(input);
    }

    /**
     * Is the given input a positive integer?
     *
     * @param {unknown} input - The input to check.
     * @param {boolean} zeroInclusive - `true` if zero should be considered a valid input.
     * `false` if zero should be considered an invalid input.
     * Default value is `false`.
     *
     * @returns {input is number} `true` if the given input is a positive integer, or zero when `zeroInclusive` is `true`; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isPositiveInteger(input: unknown, zeroInclusive: boolean = false): input is number {
        if (!NumberUtility.isInteger(input)) {
            return false;
        }

        if (zeroInclusive) {
            return input >= 0;
        }

        return input > 0;
    }
}
