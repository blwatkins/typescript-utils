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

import { PrimitiveTypeError, StaticInstanceError } from '../error';
import { StringUtility } from '../string';

/**
 * Static methods and properties for validating arrays.
 *
 * @since 0.1.0
 */
export class ArrayUtility {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link ArrayUtility} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('ArrayUtility is a static class and cannot be instantiated.');
    }

    /**
     * Assert that `input` is an array.
     *
     * @remarks This method does not enforce size requirements, density requirements, or type checking for any array elements.
     *
     * @see {@link ArrayUtility.isArray}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not an array.
     *
     * @returns {asserts input is unknown[]}
     *
     * @throws {PrimitiveTypeError} When `input` is not an array.
     *
     * @public
     * @since 0.1.0
     */
    public static assertArray(input: unknown, message?: string): asserts input is unknown[] {
        if (!ArrayUtility.isArray(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected an array.');
        }
    }

    /**
     * Assert that `input` is a dense array.
     *
     * @remarks A dense array has an element at every index.
     * An array with a hole at any index, such as `[1, , 3]` or `new Array(3)`, is a sparse array and is rejected.
     * An element that is explicitly `undefined` is not a hole, so `[undefined, 1]` is a dense array.
     * An empty array is a dense array.
     * This method does not enforce size requirements or type checking for any array elements.
     *
     * @see {@link ArrayUtility.isDenseArray}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a dense array.
     *
     * @returns {asserts input is unknown[]}
     *
     * @throws {PrimitiveTypeError} When `input` is not a dense array.
     *
     * @public
     * @since 0.1.0
     */
    public static assertDenseArray(input: unknown, message?: string): asserts input is unknown[] {
        if (!ArrayUtility.isDenseArray(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a dense array.');
        }
    }

    /**
     * Is `input` an array?
     *
     * @remarks This method does not enforce size requirements, density requirements, or type checking for any array elements.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is unknown[]} `true` if `input` is an array; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isArray(input: unknown): input is unknown[] {
        return Array.isArray(input);
    }

    /**
     * Is `input` a dense array?
     *
     * @remarks A dense array has an element at every index.
     * An array with a hole at any index, such as `[1, , 3]` or `new Array(3)`, is a sparse array and is rejected.
     * An element that is explicitly `undefined` is not a hole, so `[undefined, 1]` is a dense array.
     * An empty array is a dense array.
     * This method does not enforce size requirements or type checking for any array elements.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is unknown[]} `true` if `input` is a dense array; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isDenseArray(input: unknown): input is unknown[] {
        if (!ArrayUtility.isArray(input)) {
            return false;
        }

        for (let index: number = 0; index < input.length; index++) {
            if (!Object.hasOwn(input, index)) {
                return false;
            }
        }

        return true;
    }
}
