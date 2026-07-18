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
     * @throws {Error} - MathUtility is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new Error('MathUtility is a static class and cannot be instantiated.');
    }

    /**
     * Constrain the given value between the given min and max.
     *
     * @param {number} value - The value to constrain.
     * @param {number} min - The minimum value to constrain to.
     * @param {number} max - The maximum value to constrain to.
     *
     * @returns {number} - `min` if `value` is less than `min`, `max` if `value` is greater than `max`, `value` otherwise.
     *
     * @throws {TypeError} - When `value` `min`, `max` are not all finite numbers.
     * @throws {RangeError} - When `min` is not less than `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static constrain(value: number, min: number, max: number): number {
        if (!(Number.isFinite(value) && Number.isFinite(min) && Number.isFinite(max))) {
            throw new TypeError('All arguments must be finite numbers.');
        }

        if (min > max) {
            throw new RangeError(`Min value ${min} cannot be greater than max value ${max}.`);
        }

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
     * @returns {number} - The one-dimensional index for the given (x, y) coordinates.
     *
     * @throws {TypeError} - When `x` or `y` are not positive integers.
     * @throws {TypeError} - When `columns` or `rows` are not positive integers greater than 0.
     * @throws {RangeError} - When the calculated index is out of bounds for the given columns and rows.
     *
     * @public
     * @since 0.1.0
     */
    public static toFlatIndex(x: number, y: number, columns: number, rows: number): number {
        if (!(NumberUtility.isPositiveInteger(x, true)
            && NumberUtility.isPositiveInteger(y, true))) {
            throw new TypeError('x and y must be positive integers.');
        }

        if (!(NumberUtility.isPositiveInteger(columns, false)
            && NumberUtility.isPositiveInteger(rows, false))) {
            throw new TypeError('columns and rows must be positive integers greater than 0.');
        }

        const index: number = (y * columns) + x;
        const arrayLength: number = columns * rows;

        if (index >= arrayLength) {
            throw new RangeError(`Calculated index (${index}) is out of bounds for array length (${arrayLength})`);
        }

        return index;
    }
}
