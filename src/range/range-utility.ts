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
import { MathUtility } from '../math';
import { NumberUtility } from '../number';
import { Random } from '../random';
import { StringUtility } from '../string';

import { Range, rangeSchema } from './range';

/**
 * The maximum number of times {@link RangeUtility.randomFloat} draws a new value when a draw falls
 * outside the range.
 *
 * @default 10
 *
 * @type {number}
 * @private
 */
const maxDrawAttempts: number = 10;

/**
 * Static methods and properties for validating and using {@link Range} objects.
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
     * Both `min` and `max` must be numbers within the safe integer range.
     * Additionally, when `min` is equal to `max`, neither `isMinInclusive` nor `isMaxInclusive` may be `false`; such a range would contain no values.
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
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max` bounds of `range` are within the tested range.
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
     * @throws {PrimitiveTypeError} When `value` is not a number within the safe integer range.
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
     * @remarks For a {@link Range} object to be valid, its `min` property must be less than or equal to its `max` property, and both `min` and `max` must be numbers within the safe integer range.
     * Additionally, the range must contain at least one representable value.
     * When either `isMinInclusive` or `isMaxInclusive` is `false`, `min` must be less than `max`, and the midpoint of the range must be distinct from both `min` and `max`.
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

            if (!NumberUtility.isValidRange(range.min, range.max)) {
                return false;
            }

            if (range.isMinInclusive === false || range.isMaxInclusive === false) {
                const midpoint: number = range.min + ((range.max - range.min) / 2.0);
                const validRange: boolean = range.min < range.max;
                const distinctMidpoint: boolean = RangeUtility.#isIn(midpoint, range.min, range.max, false, false);
                return validRange && distinctMidpoint;
            }

            return true;
        }

        return false;
    }

    /**
     * Is `value` within `range`?
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max` bounds of `range` are within the tested range.
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
     * @throws {PrimitiveTypeError} When `value` is not a number within the safe integer range.
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     *
     * @public
     * @since 0.1.0
     */
    public static isIn(value: number, range: Range): boolean {
        NumberUtility.assertSafe(value, 'value must be within the safe integer range.');
        RangeUtility.assertRange(range);
        const isMinInclusive: boolean = range.isMinInclusive ?? true;
        const isMaxInclusive: boolean = range.isMaxInclusive ?? true;
        return RangeUtility.#isIn(value, range.min, range.max, isMinInclusive, isMaxInclusive);
    }

    /**
     * Constrain `value` to the bounds of `range`.
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` are ignored: the range is treated as inclusive, regardless of their current values.
     *
     * @see {@link MathUtility.constrain}
     *
     * @param {number} value - The value to constrain.
     * @param {Range} range - The {@link Range} object to constrain `value` to.
     *
     * @returns {number} `range.min` if `value` is less than `range.min`, `range.max` if `value` is greater than `range.max`, `value` otherwise.
     *
     * @throws {PrimitiveTypeError} When `value` is not a number within the safe integer range.
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     *
     * @public
     * @since 0.1.0
     */
    public static constrain(value: number, range: Range): number {
        RangeUtility.assertRange(range);
        return MathUtility.constrain(value, range.min, range.max);
    }

    /**
     * Get a random floating-point number within `range`.
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max` bounds may be returned.
     * Each property defaults to `true` when it is `undefined`.
     * A value returned by this method always satisfies {@link RangeUtility.isIn} for the same `range`.
     * This method draws a random floating-point number, then checks to ensure it does not round to a value outside the range.
     * A draw that falls outside the range is discarded and replaced.
     * When no draw succeeds, the midpoint between `min` and `max` is returned.
     *
     * @see {@link RangeUtility.assertRange}
     *
     * @param {Range} range - The {@link Range} object to generate a value from.
     *
     * @returns {number} A random floating-point number within `range`.
     *
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     *
     * @public
     * @since 0.1.0
     */
    public static randomFloat(range: Range): number {
        RangeUtility.assertRange(range);
        const isMinInclusive: boolean = range.isMinInclusive ?? true;
        const isMaxInclusive: boolean = range.isMaxInclusive ?? true;

        let value: number = range.min + (Random.random() * (range.max - range.min));
        let attempts: number = 1;

        while (!RangeUtility.#isIn(value, range.min, range.max, isMinInclusive, isMaxInclusive)
            && attempts < maxDrawAttempts) {
            value = range.min + (Random.random() * (range.max - range.min));
            attempts++;
        }

        if (!RangeUtility.#isIn(value, range.min, range.max, isMinInclusive, isMaxInclusive)) {
            return range.min + ((range.max - range.min) / 2);
        }

        return value;
    }

    /**
     * Get a random integer within `range`.
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max` bounds may be returned.
     * Each property defaults to `true` when it is `undefined`.
     * A value returned by this method always satisfies {@link RangeUtility.isIn} for the same `range`.
     * Non-integer bounds are rounded inward, to the smallest and largest integers that `range` contains.
     * Note that {@link Random.randomInt} and {@link Random.randomInteger} treat a bare pair of numbers as a half-open range [min, max),
     * so `RangeUtility.randomInt({ min: 0, max: 10 })` may return `10`, while `Random.randomInt(0, 10)`  and `Random.randomInteger(0, 10)` may not.
     * Set `isMaxInclusive` to `false` to reproduce the behavior of {@link Random.randomInt} and {@link Random.randomInteger}.
     *
     * @see {@link RangeUtility.randomInteger}
     * @see {@link RangeUtility.assertRange}
     *
     * @param {Range} range - The {@link Range} object to generate a value from.
     *
     * @returns {number} A random integer within `range`.
     *
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     * @throws {ValueRangeError} When `range` contains no integer values.
     *
     * @public
     * @since 0.1.0
     */
    public static randomInt(range: Range): number {
        RangeUtility.assertRange(range);
        const isMinInclusive: boolean = range.isMinInclusive ?? true;
        const isMaxInclusive: boolean = range.isMaxInclusive ?? true;

        let lowest: number;

        if (isMinInclusive) {
            lowest = Math.ceil(range.min);
        } else {
            lowest = Math.floor(range.min) + 1;
        }

        let highest: number;

        if (isMaxInclusive) {
            highest = Math.floor(range.max);
        } else {
            highest = Math.ceil(range.max) - 1;
        }

        if (lowest > highest) {
            throw new ValueRangeError('The range contains no integer values.');
        }

        return Random.randomInt(lowest, highest + 1);
    }

    /**
     * Get a random integer within `range`.
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max` bounds may be returned.
     * Each property defaults to `true` when it is `undefined`.
     * A value returned by this method always satisfies {@link RangeUtility.isIn} for the same `range`.
     * Non-integer bounds are rounded inward, to the smallest and largest integers that `range` contains.
     * Note that {@link Random.randomInt} and {@link Random.randomInteger} treat a bare pair of numbers as a half-open range [min, max),
     * so `RangeUtility.randomInteger({ min: 0, max: 10 })` may return `10`, while `Random.randomInt(0, 10)`  and `Random.randomInteger(0, 10)` may not.
     * Set `isMaxInclusive` to `false` to reproduce the behavior of {@link Random.randomInt} and {@link Random.randomInteger}.
     *
     * @see {@link RangeUtility.randomInt}
     * @see {@link RangeUtility.assertRange}
     *
     * @param {Range} range - The {@link Range} object to generate a value from.
     *
     * @returns {number} A random integer within `range`.
     *
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     * @throws {ValueRangeError} When `range` contains no integer values.
     *
     * @public
     * @since 0.1.0
     */
    public static randomInteger(range: Range): number {
        return RangeUtility.randomInt(range);
    }

    /**
     * Is `value` within the range formed by `min` and `max`?
     *
     * @remarks This method assumes that `value`, `min`, and `max` are all numbers within the safe integer range.
     * This method assumes that `isMinInclusive` and `isMaxInclusive` are both boolean values.
     * Additionally, this method assumes that `min`, `max`, `isMinInclusive`, and `isMaxInclusive` form a valid range with a representable value.
     *
     * @param {number} value - The value to check.
     * @param min - The minimum value of the range.
     * @param max - The maximum value of the range.
     * @param isMinInclusive - Is the minimum value is inclusive?
     * @param isMaxInclusive - Is the maximum value is inclusive?
     *
     * @returns {boolean} `true` if the value is within the range, `false` otherwise.
     *
     * @private
     */
    static #isIn(value: number, min: number, max: number, isMinInclusive: boolean, isMaxInclusive: boolean): boolean {
        let aboveMin: boolean;

        if (isMinInclusive) {
            aboveMin = value >= min;
        } else {
            aboveMin = value > min;
        }

        let belowMax: boolean;

        if (isMaxInclusive) {
            belowMax = value <= max;
        } else {
            belowMax = value < max;
        }

        return aboveMin && belowMax;
    }
}
