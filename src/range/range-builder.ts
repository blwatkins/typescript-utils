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

import { TypeAssertions } from '../assert';
import { NumberUtility } from '../number';

import { Range } from './range';
import { RangeUtility } from './range-utility';

/**
 * A builder for creating an {@link Range} object.
 *
 * @since 0.1.0
 */
export class RangeBuilder {
    /**
     * The `min` property of the {@link Range} object.
     *
     * @default {@link Number.MIN_SAFE_INTEGER}
     *
     * @type {number}
     * @private
     */
    #min: number = Number.MIN_SAFE_INTEGER;

    /**
     * The `max` property of the {@link Range} object.
     *
     * @default {@link Number.MAX_SAFE_INTEGER}
     *
     * @type {number}
     * @private
     */
    #max: number = Number.MAX_SAFE_INTEGER;

    /**
     * The `isMinInclusive` property of the {@link Range} object.
     *
     * @default true
     *
     * @type {boolean | undefined}
     * @private
     */
    #isMinInclusive: boolean | undefined = true;

    /**
     * The `isMaxInclusive` property of the {@link Range} object.
     *
     * @default true
     *
     * @type {boolean | undefined}
     * @private
     */
    #isMaxInclusive: boolean | undefined = true;

    /**
     * Set the `min` property of the {@link Range} object.
     * The `min` property should be less than, or equal to, the `max` property.
     *
     * @param {number} min - The minimum value of the range.
     *
     * @returns {this} - The current instance of the {@link RangeBuilder} for method chaining.
     *
     * @throws {PrimitiveTypeError} - When `min` is not a finite number.
     *
     * @public
     * @since 0.1.0
     */
    public setMin(min: number): this {
        NumberUtility.assertFinite(min);
        this.#min = min;
        return this;
    }

    /**
     * Set the `max` property of the {@link Range} object.
     * The `max` property should be greater than, or equal to, the `min` property.
     *
     * @param {number} max - The maximum value of the range.
     *
     * @returns {this} - The current instance of the {@link RangeBuilder} for method chaining.
     *
     * @throws {PrimitiveTypeError} - When `max` is not a finite number.
     *
     * @public
     * @since 0.1.0
     */
    public setMax(max: number): this {
        NumberUtility.assertFinite(max);
        this.#max = max;
        return this;
    }

    /**
     * Set the `isMinInclusive` property of the {@link Range} object.
     *
     * @param {boolean | undefined} isMinInclusive - `true` if any values generated from the range should include the minimum value.
     * `false` if any values generated from the range should not include the minimum value.
     * `undefined` to use the default behavior of the method using the range.
     *
     * @returns {this} - The current instance of the {@link RangeBuilder} for method chaining.
     *
     * @throws {PrimitiveTypeError} - When `isMinInclusive` is not a boolean or undefined.
     *
     * @public
     * @since 0.1.0
     */
    public setMinInclusive(isMinInclusive: boolean | undefined): this {
        if (isMinInclusive !== undefined) {
            TypeAssertions.assertBoolean(isMinInclusive, 'isMinInclusive must be a boolean or undefined.');
        }

        this.#isMinInclusive = isMinInclusive;
        return this;
    }

    /**
     * Set the `isMaxInclusive` property of the {@link Range} object.
     *
     * @param {boolean | undefined} isMaxInclusive - `true` if any values generated from the range should include the maximum value.
     * `false` if any values generated from the range should not include the maximum value.
     * `undefined` to use the default behavior of the method using the range.
     *
     * @returns {this} - The current instance of the {@link RangeBuilder} for method chaining.
     *
     * @throws {PrimitiveTypeError} - When `isMaxInclusive` is not a boolean or undefined.
     *
     * @public
     * @since 0.1.0
     */
    public setMaxInclusive(isMaxInclusive: boolean | undefined): this {
        if (isMaxInclusive !== undefined) {
            TypeAssertions.assertBoolean(isMaxInclusive, 'isMaxInclusive must be a boolean or undefined.');
        }

        this.#isMaxInclusive = isMaxInclusive;
        return this;
    }

    /**
     * Build the {@link Range} object with the current state of the {@link RangeBuilder}.
     *
     * @see {@link RangeUtility.assertRange}
     *
     * @returns {Range} A {@link Range} object.
     *
     * @throws {SchemaTypeError} When the resulting object is not a valid {@link Range}.
     *
     * @public
     * @since 0.1.0
     */
    public build(): Range {
        const range: Range = {
            min: this.#min,
            max: this.#max,
            isMinInclusive: this.#isMinInclusive,
            isMaxInclusive: this.#isMaxInclusive
        };

        RangeUtility.assertRange(range);
        return range;
    }
}
