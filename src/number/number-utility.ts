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

import { PrimitiveTypeError, StaticInstanceError, ValueRangeError } from '../error';
import { StringUtility } from '../string';

/**
 * Static properties and methods for validating number types.
 *
 * @since 0.1.0
 */
export class NumberUtility {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link NumberUtility} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('NumberUtility is a static class and cannot be instantiated.');
    }

    /**
     * Assert that `input` is a finite number.
     *
     * @see {@link NumberUtility.isFinite}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a finite number.
     *
     * @returns {asserts input is number}
     *
     * @throws {PrimitiveTypeError} When `input` is not a finite number.
     *
     * @public
     * @since 0.1.0
     */
    public static assertFinite(input: unknown, message?: string): asserts input is number {
        if (!NumberUtility.isFinite(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a finite number.');
        }
    }

    /**
     * Assert that `input` is an integer within the safe integer range.
     *
     * @see {@link NumberUtility.isInteger}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not an integer within the safe integer range.
     *
     * @returns {asserts input is number}
     *
     * @throws {PrimitiveTypeError} When `input` is not an integer within the safe integer range.
     *
     * @public
     * @since 0.1.0
     */
    public static assertInteger(input: unknown, message?: string): asserts input is number {
        if (!NumberUtility.isInteger(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected an integer within the safe integer range.');
        }
    }

    /**
     * Assert that `input` is a positive integer within the safe integer range.
     *
     * @see {@link NumberUtility.isPositiveInteger}
     *
     * @param {unknown} input - The input to check.
     * @param {boolean} zeroInclusive - `true` if zero should be considered a valid input.
     * `false` if zero should be considered an invalid input.
     * Default value is `false`.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a positive integer within the safe integer range or zero when `zeroInclusive` is `true`.
     *
     * @returns {asserts input is number}
     *
     * @throws {PrimitiveTypeError} When `input` is not a positive integer within the safe integer range or zero when `zeroInclusive` is `true`.
     *
     * @public
     * @since 0.1.0
     */
    public static assertPositiveInteger(input: unknown, zeroInclusive: boolean = false, message?: string): asserts input is number {
        if (!NumberUtility.isPositiveInteger(input, zeroInclusive)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a positive integer within the safe integer range or zero if zeroInclusive is true.');
        }
    }

    /**
     * Assert that `input` is a number within the safe integer range.
     *
     * @see {@link NumberUtility.isSafe}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a number within the safe integer range.
     *
     * @returns {asserts input is number}
     *
     * @throws {PrimitiveTypeError} When `input` is not a number within the safe integer range.
     *
     * @public
     * @since 0.1.0
     */
    public static assertSafe(input: unknown, message?: string): asserts input is number {
        if (!NumberUtility.isSafe(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a number between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER (inclusive).');
        }
    }

    /**
     * Assert that `a` is less than `b`.
     *
     * @see {@link NumberUtility.isLessThan}
     *
     * @param {number} a - The value that must be the lesser of the two.
     * @param {number} b - The value that must be the greater of the two.
     * @param {string | undefined} message - Optional message for the error thrown when `a` is not less than `b`.
     *
     * @returns {void}
     *
     * @throws {PrimitiveTypeError} When `a` and `b` are not both numbers within the safe integer range.
     * @throws {ValueRangeError} When `a` is not less than `b`.
     *
     * @public
     * @since 0.1.0
     */
    public static assertLessThan(a: number, b: number, message?: string): void {
        if (!NumberUtility.isLessThan(a, b)) {
            if (StringUtility.isSingleLine(message)) {
                throw new ValueRangeError(message);
            }

            throw new ValueRangeError('a must be less than b.');
        }
    }

    /**
     * Assert that `value` is greater than or equal to `min` and less than or equal to `max`.
     *
     * @see {@link NumberUtility.isInRange}
     *
     * @param {number} value - The value to check.
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The inclusive maximum value.
     * @param {string | undefined} message - Optional message for the error thrown when `value` is not within the range [`min`, `max`] (inclusive).
     *
     * @returns {void}
     *
     * @throws {PrimitiveTypeError} When `value`, `min`, or `max` are not all numbers within the safe integer range.
     * @throws {ValueRangeError} When `min` is not less than or equal to `max`.
     * @throws {ValueRangeError} When `value` is not in the range [`min`, `max`] (inclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static assertInRange(value: number, min: number, max: number, message?: string): void {
        if (!NumberUtility.isInRange(value, min, max)) {
            if (StringUtility.isSingleLine(message)) {
                throw new ValueRangeError(message);
            }

            throw new ValueRangeError('value must be in the range [min, max] (inclusive).');
        }
    }

    /**
     * Assert that `min` and `max` are numbers within the safe integer range, where `min` is less than or equal to `max`.
     *
     * @see {@link NumberUtility.isValidRange}
     *
     * @param {number} min - Minimum value to check.
     * @param {number} max - Maximum value to check.
     * @param {string | undefined} message - Optional message for the error thrown when `min` is not less than or equal to `max`.
     *
     * @returns {void}
     *
     * @throws {PrimitiveTypeError} When `min` and `max` are not both numbers within the safe integer range.
     * @throws {ValueRangeError} When `min` is not less than or equal to `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static assertValidRange(min: number, max: number, message?: string): void {
        if (!NumberUtility.isValidRange(min, max)) {
            if (StringUtility.isSingleLine(message)) {
                throw new ValueRangeError(message);
            }

            throw new ValueRangeError('min must be less than or equal to max.');
        }
    }

    /**
     * Is `input` a finite number?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is number} `true` when `input` is a finite number; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isFinite(input: unknown): input is number {
        return Number.isFinite(input);
    }

    /**
     * Is `input` an integer within the safe integer range?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is number} `true` when `input` is an integer within the safe integer range; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isInteger(input: unknown): input is number {
        return Number.isInteger(input) && NumberUtility.isSafe(input);
    }

    /**
     * Is `input` a positive integer within the safe integer range?
     *
     * @see {@link NumberUtility.isInteger}
     *
     * @param {unknown} input - The input to check.
     * @param {boolean} zeroInclusive - `true` if zero should be considered a valid input.
     * `false` if zero should be considered an invalid input.
     * Default value is `false`.
     *
     * @returns {input is number} `true` if `input` is a positive integer within the safe integer range, or zero when `zeroInclusive` is `true`; `false` otherwise.
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

    /**
     * Is `input` a number within the safe integer range?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is number} `true` if `input` is a number within the safe integer range; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isSafe(input: unknown): input is number {
        if (NumberUtility.isFinite(input)) {
            return (input >= Number.MIN_SAFE_INTEGER) && (input <= Number.MAX_SAFE_INTEGER);
        }

        return false;
    }

    /**
     * Is `a` less than `b`?
     *
     * @see {@link NumberUtility.assertSafe}
     *
     * @param {number} a - The value that must be the lesser of the two.
     * @param {number} b - The value that must be the greater of the two.
     *
     * @returns {boolean} `true` if `a` is less than `b`; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `a` and `b` are not both numbers within the safe integer range.
     *
     * @public
     * @since 0.1.0
     */
    public static isLessThan(a: number, b: number): boolean {
        NumberUtility.assertSafe(a, 'a must be within the safe integer range.');
        NumberUtility.assertSafe(b, 'b must be within the safe integer range.');
        return a < b;
    }

    /**
     * Is `value` greater than or equal to `min` and less than, or equal to, `max`?
     *
     * @see {@link NumberUtility.assertSafe}
     * @see {@link NumberUtility.assertValidRange}
     *
     * @param {number} value - The value to check.
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The inclusive maximum value.
     *
     * @returns {boolean} `true` if `value` is in the range [`min`, `max`] (inclusive); `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `value`, `min`, or `max` are not all within the safe integer range.
     * @throws {ValueRangeError} When `min` is not less than or equal to `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static isInRange(value: number, min: number, max: number): boolean {
        NumberUtility.assertSafe(value, 'value must be within the safe integer range.');
        NumberUtility.assertSafe(min, 'min must be within the safe integer range.');
        NumberUtility.assertSafe(max, 'max must be within the safe integer range.');
        NumberUtility.assertValidRange(min, max);
        return value >= min && value <= max;
    }

    /**
     * Do `min` and `max` form a valid range, where `min` and `max` are within the safe integer range and `min` is less than or equal to `max`?
     *
     * @see {@link NumberUtility.assertSafe}
     *
     * @param {number} min - Minimum value to check.
     * @param {number} max - Maximum value to check.
     *
     * @returns {boolean} `true` if `min` and `max` are within the safe integer range, and `min` is less than or equal to `max`; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `min` and `max` are not both within the safe integer range.
     *
     * @public
     * @since 0.1.0
     */
    public static isValidRange(min: number, max: number): boolean {
        NumberUtility.assertSafe(min, 'min must be within the safe integer range.');
        NumberUtility.assertSafe(max, 'max must be within the safe integer range.');
        return min <= max;
    }

    /* ******************* TODO: DEPRECATED ******************* */

    /**
     * Asserts that input is a finite number.
     *
     * @see {@link NumberUtility.isFiniteNumber}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when the input is not a finite number.
     *
     * @returns {asserts input is number} Asserts that input is a finite number.
     *
     * @throws {PrimitiveTypeError} When the input is not a finite number.
     *
     * @deprecated Replaced by {@link NumberUtility.assertFinite}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static assertFiniteNumber(input: unknown, message?: string): asserts input is number {
        NumberUtility.assertFinite(input, message);
    }

    /**
     * Is input a finite number?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is number} `true` when the input is a finite number; `false` otherwise.
     *
     * @deprecated Replaced by {@link NumberUtility.isFinite}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static isFiniteNumber(input: unknown): input is number {
        return NumberUtility.isFinite(input);
    }
}
