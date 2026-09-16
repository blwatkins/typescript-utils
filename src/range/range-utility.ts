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
import { Random } from '../random';
import { StringUtility } from '../string';

import { Range, rangeSchema } from './range';

/**
 * The maximum number of times {@link RangeUtility.randomFloat} draws a new value when a draw lands
 * on an excluded bound of the range.
 *
 * @type {number}
 * @private
 */
const maxDrawAttempts: number = 8;

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
     * Additionally, when `min` is equal to `max`, neither `isMinInclusive` nor `isMaxInclusive` may be `false`,
     * because such a range would contain no values.
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
     * Additionally, when `min` is equal to `max`, neither `isMinInclusive` nor `isMaxInclusive` may be `false`,
     * because such a range would contain no values.
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

            return !(range.min === range.max
                && (range.isMinInclusive === false || range.isMaxInclusive === false));
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

    /**
     * Get a random floating-point number within `range`.
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max`
     * bounds may be returned. Each property defaults to `true` when it is `undefined`, matching {@link RangeUtility.isIn}.
     * For floating-point values, inclusivity is a boundary guarantee rather than a change in distribution:
     * an exclusive bound is never returned, while an inclusive bound is merely permitted and may be unreachable.
     * A value returned by this method always satisfies {@link RangeUtility.isIn} for the same `range`.
     * When the endpoints of `range` are adjacent representable numbers, the only candidate values are the
     * bounds themselves, and an included bound is returned. If both bounds are excluded, no representable
     * value satisfies `range` and this method throws rather than returning an excluded bound.
     *
     * @see {@link RangeUtility.isIn}
     * @see {@link Random.randomFloat}
     *
     * @param {Range} range - The {@link Range} object to generate a value from.
     *
     * @returns {number} A random floating-point number within `range`.
     *
     * @throws {SchemaTypeError} When `range` is not a valid {@link Range} object.
     * @throws {ValueRangeError} When `range` contains no representable values.
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

        while (RangeUtility.#isExcludedBound(value, range, isMinInclusive, isMaxInclusive)
            && attempts < maxDrawAttempts) {
            value = range.min + (Random.random() * (range.max - range.min));
            attempts++;
        }

        if (RangeUtility.#isExcludedBound(value, range, isMinInclusive, isMaxInclusive)) {
            const midpoint: number = range.min + ((range.max - range.min) / 2);

            if (!RangeUtility.#isExcludedBound(midpoint, range, isMinInclusive, isMaxInclusive)) {
                return midpoint;
            }

            // The midpoint rounds to a bound, so the bounds are adjacent representable numbers and
            // the only candidate values are the bounds themselves.
            if (isMaxInclusive) {
                return range.max;
            } else if (isMinInclusive) {
                return range.min;
            }

            throw new ValueRangeError('The range contains no representable values.');
        }

        return value;
    }

    /**
     * Get a random integer within `range`.
     *
     * @remarks The `isMinInclusive` and `isMaxInclusive` properties of `range` determine whether the `min` and `max`
     * bounds may be returned. Each property defaults to `true` when it is `undefined`, matching {@link RangeUtility.isIn}.
     * Non-integer bounds are rounded inward, to the smallest and largest integers that `range` contains.
     * A value returned by this method always satisfies {@link RangeUtility.isIn} for the same `range`.
     * Note that {@link Random.randomInt} treats a bare pair of numbers as the half-open range [min, max),
     * so `RangeUtility.randomInteger({ min: 0, max: 10 })` may return `10`, while `Random.randomInt(0, 10)` may not.
     * Set `isMaxInclusive` to `false` to reproduce the behavior of {@link Random.randomInt}.
     *
     * @see {@link RangeUtility.isIn}
     * @see {@link Random.randomInt}
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
     * Does `value` fall on a bound that `range` excludes?
     *
     * @param {number} value - The value to check.
     * @param {Range} range - The {@link Range} object to check against.
     * @param {boolean} isMinInclusive - Is the `min` bound of `range` inclusive?
     * @param {boolean} isMaxInclusive - Is the `max` bound of `range` inclusive?
     *
     * @returns {boolean} `true` if `value` falls on an excluded bound of `range`; `false` otherwise.
     *
     * @private
     */
    static #isExcludedBound(value: number,
                            range: Range,
                            isMinInclusive: boolean,
                            isMaxInclusive: boolean): boolean {
        return (!isMinInclusive && value === range.min)
            || (!isMaxInclusive && value === range.max);
    }
}
