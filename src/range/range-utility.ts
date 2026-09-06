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

// TODO - RangeBuilder - static buildFrom(min, max) method

import Value from 'typebox/value';

import { SchemaTypeError, StaticInstanceError } from '../error';
import { NumberUtility } from '../number';
import { StringUtility } from '../string';

import { Range, rangeSchema } from './range';

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
     * Assert that the given input is a valid {@link Range} object.
     *
     * @remarks For a {@link Range} object to be valid, its `min` property must be less than or equal to its `max` property.
     *
     * @see {@link RangeUtility.isRange}
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when the input is not a valid {@link Range} object.
     *
     * @returns {asserts input is Range} Asserts that the given input is a valid {@link Range} object.
     *
     * @throws {SchemaTypeError} When the given input is not a valid {@link Range} object.
     *
     * @public
     * @since 0.1.0
     */
    public assertRange(input: unknown, message?: string): asserts input is Range {
        if (!RangeUtility.isRange(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new SchemaTypeError(message);
            }

            throw new SchemaTypeError('Input does not match schema requirements for Range.');
        }
    }

    /**
     * Is the given input a valid {@link Range} object?
     *
     * @remarks For a {@link Range} object to be valid, its `min` property must be less than or equal to its `max` property.
     *
     * @see {@link NumberUtility.isValidRange}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is Range} `true` is the input is a valid {@link Range} object; `false` otherwise.
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
}
