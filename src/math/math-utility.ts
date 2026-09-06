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

import { StaticInstanceError, ValueRangeError } from '../error';
import { NumberUtility } from '../number';

/**
 * Static properties and methods for mathematical operations.
 *
 * @since 0.1.0
 */
export class MathUtility {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link MathUtility} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('MathUtility is a static class and cannot be instantiated.');
    }

    /**
     * Constrain the given value between the given min and max.
     *
     * @param {number} value - The value to constrain.
     * @param {number} min - The minimum value to constrain to.
     * @param {number} max - The maximum value to constrain to.
     *
     * @returns {number} `min` if `value` is less than `min`, `max` if `value` is greater than `max`, `value` otherwise.
     *
     * @throws {PrimitiveTypeError} When `value`, `min`, and `max` are not all finite numbers.
     * @throws {ValueRangeError} When `min` is not less than, or equal to, `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static constrain(value: number, min: number, max: number): number {
        NumberUtility.assertFiniteNumber(value, 'Value must be a finite number.');
        NumberUtility.assertFiniteNumber(min, 'Min must be a finite number.');
        NumberUtility.assertFiniteNumber(max, 'Max must be a finite number.');
        NumberUtility.assertValidRange(min, max);

        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    /**
     * Convert the given (x, y) index coordinates to a one-dimensional index for an array with the given columns and rows.
     *
     * @param {number} x - The x-coordinate (column index) of the 2D array.
     * @param {number} y - The y-coordinate (row index) of the 2D array.
     * @param {number} columns - The number of columns in the 2D array.
     * @param {number} rows - The number of rows in the 2D array.
     *
     * @returns {number} The one-dimensional index for the given (x, y) coordinates.
     *
     * @throws {TypeError} When `x` or `y` are not positive integers or zero.
     * @throws {TypeError} When `columns` or `rows` are not positive integers greater than 0.
     * @throws {RangeError} When the total grid size (`columns` * `rows`) exceeds `Number.MAX_SAFE_INTEGER`.
     * @throws {RangeError} When the given (x, y) coordinates are out of bounds for the given grid dimensions.
     *
     * @public
     * @since 0.1.0
     */
    public static toFlatIndex(x: number, y: number, columns: number, rows: number): number {
        NumberUtility.assertPositiveInteger(x, true, 'X must be a positive integer or zero.');
        NumberUtility.assertPositiveInteger(y, true, 'Y must be a positive integer or zero.');
        NumberUtility.assertPositiveInteger(columns, false, 'Columns must be a positive integer greater than 0.');
        NumberUtility.assertPositiveInteger(rows, false, 'Rows must be a positive integer greater than 0.');

        if (columns * rows > Number.MAX_SAFE_INTEGER) {
            throw new ValueRangeError(`The total size of the given grid (${columns} * ${rows}) exceeds the maximum safe integer value in JavaScript.`);
        }

        if (x >= columns || y >= rows) {
            throw new ValueRangeError(`2D index (${x}, ${y}) is out of bounds for array dimensions (${columns}, ${rows})`);
        }

        return ((y * columns) + x);
    }
}
