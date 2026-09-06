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
     * @see {@link NumberUtility.isFiniteNumber}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a finite number.
     *
     * @returns {asserts input is number} Asserts that `input` is a finite number.
     *
     * @throws {PrimitiveTypeError} When `input` is not a finite number.
     *
     * @public
     * @since 0.1.0
     */
    public static assertFinite(input: unknown, message?: string): asserts input is number {
        if (!NumberUtility.isFiniteNumber(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected a finite number, but received: ${typeof input}.`);
        }
    }

    /**
     * Assert that `input` is an integer.
     *
     * @see {@link NumberUtility.isInteger}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not an integer.
     *
     * @returns {asserts input is number} Asserts that `input` is an integer.
     *
     * @throws {PrimitiveTypeError} When `input` is not an integer.
     *
     * @public
     * @since 0.1.0
     */
    public static assertInteger(input: unknown, message?: string): asserts input is number {
        if (!NumberUtility.isInteger(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected an integer, but received: ${typeof input}.`);
        }
    }

    /**
     * Assert that `input` is a positive integer.
     *
     * @see {@link NumberUtility.isPositiveInteger}
     *
     * @param {unknown} input - The input to check.
     * @param {boolean} zeroInclusive - `true` if zero should be considered a valid input.
     * `false` if zero should be considered an invalid input.
     * Default value is `false`.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a positive integer.
     *
     * @returns {asserts input is number} Asserts that `input` is a positive integer.
     *
     * @throws {PrimitiveTypeError} When `input` is not a positive integer.
     *
     * @public
     * @since 0.1.0
     */
    public static assertPositiveInteger(input: unknown, zeroInclusive: boolean = false, message?: string): asserts input is number {
        if (!NumberUtility.isPositiveInteger(input, zeroInclusive)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected a positive integer (zeroInclusive=${zeroInclusive}), but received: ${typeof input}.`);
        }
    }

    /**
     * Assert that `value` is greater than, or equal to, `min` and less than, or equal to, `max`.
     *
     * @see {@link NumberUtility.isInRange}
     *
     * @param {number} value - The value to check. Must be a finite number.
     * @param {number} min - The minimum value (inclusive). Must be a finite number less than, or equal to, `max`.
     * @param {number} max - The maximum value (inclusive). Must be a finite number greater than, or equal to, `min`.
     * @param {string | undefined} message - Optional message for the error thrown when `value` is not within the range [`min`, `max`] (inclusive).
     *
     * @returns {void}
     *
     * @throws {PrimitiveTypeError} When `value` is not a finite number.
     * @throws {PrimitiveTypeError} When `min` is not a finite number.
     * @throws {PrimitiveTypeError} When `max` is not a finite number.
     * @throws {ValueRangeError} When `min` is not less than, or equal to, `max`.
     * @throws {ValueRangeError} When `value` is not in the range [`min`, `max`] (inclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static assertInRange(value: number, min: number, max: number, message?: string): void {
        if (!NumberUtility.isInRange(value, min, max)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new ValueRangeError(message);
            }

            throw new ValueRangeError('value must be in the range [min, max] (inclusive).');
        }
    }

    /**
     * Assert that `min` and `max` are finite numbers, where `min` is less than, or equal to, `max`.
     *
     * @see {@link NumberUtility.isValidRange}
     *
     * @param {number} min - Minimum value to check.
     * @param {number} max - Maximum value to check.
     * @param {string | undefined} message - Optional message for the error thrown when `min` is not less than, or equal to, `max`.
     *
     * @returns {void}
     *
     * @throws {PrimitiveTypeError} When `min` is not a finite number.
     * @throws {PrimitiveTypeError} When `max` is not a finite number.
     * @throws {ValueRangeError} When `min` is not less than, or equal to, `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static assertValidRange(min: number, max: number, message?: string): void {
        if (!NumberUtility.isValidRange(min, max)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
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
     * Is `input` an integer?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is number} `true` when `input` is an integer; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isInteger(input: unknown): input is number {
        return Number.isInteger(input);
    }

    /**
     * Is `input` a positive integer?
     *
     * @param {unknown} input - The input to check.
     * @param {boolean} zeroInclusive - `true` if zero should be considered a valid input.
     * `false` if zero should be considered an invalid input.
     * Default value is `false`.
     *
     * @returns {input is number} `true` if `input` is a positive integer, or zero when `zeroInclusive` is `true`; `false` otherwise.
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
     * Is `value` greater than, or equal to, `min` and less than, or equal to, `max`?
     *
     * @param {number} value - The value to check. Must be a finite number.
     * @param {number} min - The minimum value (inclusive). Must be a finite number less than, or equal to, `max`.
     * @param {number} max - The maximum value (inclusive). Must be a finite number greater than, or equal to, `min`.
     *
     * @returns {boolean} `true` if `value` is in the range [`min`, `max`] (inclusive).; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `value` is not a finite number.
     * @throws {PrimitiveTypeError} When `min` is not a finite number.
     * @throws {PrimitiveTypeError} When `max` is not a finite number.
     * @throws {ValueRangeError} When `min` is not less than, or equal to, `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static isInRange(value: number, min: number, max: number): boolean {
        NumberUtility.assertFiniteNumber(min);
        NumberUtility.assertFiniteNumber(max);
        NumberUtility.assertFiniteNumber(value);
        NumberUtility.assertValidRange(min, max);
        return value >= min && value <= max;
    }

    /**
     * Do `min` and `max` form a valid range, where `min` and `max` are finite numbers and `min` is less than, or equal to, `max`?
     *
     * @param {number} min - Minimum value to check.
     * @param {number} max - Maximum value to check.
     *
     * @returns {boolean} `true` if `min` and `max` are finite numbers, and `min` is less than, or equal to, `max`; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `min` is not a finite number.
     * @throws {PrimitiveTypeError} When `max` is not a finite number.
     *
     * @public
     * @since 0.1.0
     */
    public static isValidRange(min: number, max: number): boolean {
        NumberUtility.assertFiniteNumber(min, 'min must be a finite number.');
        NumberUtility.assertFiniteNumber(max, 'max must be a finite number.');
        return min <= max;
    }

    /* ==================== DEPRECATED ==================== */

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
