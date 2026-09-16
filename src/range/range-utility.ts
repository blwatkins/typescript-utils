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

import Value from 'typebox/value';

import { SchemaTypeError, StaticInstanceError, ValueRangeError } from '../error';
import { NumberUtility } from '../number';
import { StringUtility } from '../string';

import { Range, rangeSchema } from './range';

// TODO - Random float and int from range

/**
 * Static methods and properties for validating {@link Range} objects.
 *
 * @since 0.1.0
 */
export class RangeUtility {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link RangeUtility} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('RangeUtility is a static class and cannot be instantiated.');
    }

    /**
     * Assert that `input` is a valid {@link Range} object.
     *
     * @remarks For a {@link Range} object to be valid, its `min` property must be less than or equal to its `max` property.
     *
     * @see {@link RangeUtility.isRange}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a valid {@link Range} object.
     *
     * @returns {asserts input is Range}
     *
     * @throws {SchemaTypeError} When `input` is not a valid {@link Range} object.
     *
     * @public
     * @since 0.1.0
     */
    public static assertRange(input: unknown, message?: string): asserts input is Range {
        if (!RangeUtility.isRange(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new SchemaTypeError(message);
            }

            throw new SchemaTypeError('Input does not match schema requirements for Range.');
        }
    }

    /**
     * Assert that `value` is within `range`.
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max` bounds of `range` are within the range.
     * Each property defaults to `true` when it is `undefined`.
     * When `isMinInclusive` is `false`, `value` must be greater than `range.min`.
     * When `isMaxInclusive` is `false`, `value` must be less than `range.max`.
     *
     * @see {@link RangeUtility.isIn}
     *
     * @param {number} value - The value to check.
     * @param {Range} range - The {@link Range} object to check against.
     * @param {string | undefined} message - Optional message for the error thrown when `value` is not within `range`.
     *
     * @returns {void}
     *
     * @throws {PrimitiveTypeError} When `value` is not a finite number.
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     * @throws {ValueRangeError} When `value` is not within `range`.
     *
     * @public
     * @since 0.1.0
     */
    public static assertIn(value: number, range: Range, message?: string): void {
        if (!RangeUtility.isIn(value, range)) {
            if (StringUtility.isSingleLine(message)) {
                throw new ValueRangeError(message);
            }

            throw new ValueRangeError('value must be within range.');
        }
    }

    /**
     * Is `input` a valid {@link Range} object?
     *
     * @remarks For a {@link Range} object to be valid, its `min` property must be less than or equal to its `max` property.
     *
     * @see {@link NumberUtility.isValidRange}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is Range} `true` if `input` is a valid {@link Range} object; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isRange(input: unknown): input is Range {
        const validSchema: boolean = Value.Check(rangeSchema, input);

        if (validSchema) {
            const range: Range = input as Range;
            return NumberUtility.isValidRange(range.min, range.max);
        }

        return false;
    }

    /**
     * Is `value` within `range`?
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max` bounds of `range` are within the range.
     * Each property defaults to `true` when it is `undefined`.
     * When `isMinInclusive` is `false`, `value` must be greater than `range.min`.
     * When `isMaxInclusive` is `false`, `value` must be less than `range.max`.
     *
     * @see {@link RangeUtility.assertRange}
     *
     * @param {number} value - The value to check.
     * @param {Range} range - The {@link Range} object to check against.
     *
     * @returns {boolean} `true` if the number is within the range based on the inclusivity settings; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `value` is not a finite number.
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     *
     * @public
     * @since 0.1.0
     */
    public static isIn(value: number, range: Range): boolean {
        NumberUtility.assertFinite(value);
        RangeUtility.assertRange(range);
        const isMinInclusive: boolean = range.isMinInclusive ?? true;
        const isMaxInclusive: boolean = range.isMaxInclusive ?? true;

        if (isMinInclusive && isMaxInclusive) {
            return NumberUtility.isInRange(value, range.min, range.max);
        } else if (isMinInclusive) {
            return NumberUtility.isInRange(value, range.min, range.max) && value !== range.max;
        } else if (isMaxInclusive) {
            return NumberUtility.isInRange(value, range.min, range.max) && value !== range.min;
        } else {
            return NumberUtility.isInRange(value, range.min, range.max) && value !== range.min && value !== range.max;
        }
    }
}
