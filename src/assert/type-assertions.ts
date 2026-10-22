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

import { ArrayUtility } from '../array';
import { PrimitiveTypeError, StaticInstanceError } from '../error';
import { StringUtility } from '../string';

/**
 * Static methods and properties for asserting the type of an unknown value.
 *
 * @since 0.1.0
 */
export class TypeAssertions {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link TypeAssertions} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('TypeAssertions is a static class and cannot be instantiated.');
    }

    /**
     * Assert that `input` is an array.
     *
     * @remarks This method does not enforce size requirements, density requirements, or type checking for any array elements.
     *
     * @see {@link ArrayUtility.assertArray}
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
        ArrayUtility.assertArray(input, message);
    }

    /**
     * Assert that `input` is a boolean.
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a boolean.
     *
     * @returns {asserts input is boolean}
     *
     * @throws {PrimitiveTypeError} When `input` is not a boolean.
     *
     * @public
     * @since 0.1.0
     */
    public static assertBoolean(input: unknown, message?: string): asserts input is boolean {
        if (typeof input !== 'boolean') {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a boolean.');
        }
    }

    /**
     * Assert that `input` is a callable function.
     *
     * @remarks This method does not enforce type checking for function parameters or return type.
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a function.
     *
     * @returns {asserts input is (...args: unknown[]) => unknown}
     *
     * @throws {PrimitiveTypeError} When `input` is not a callable function.
     *
     * @public
     * @since 0.1.0
     */
    public static assertFunction(input: unknown, message?: string): asserts input is (...args: unknown[]) => unknown {
        if (typeof input !== 'function') {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a function.');
        }
    }

    /**
     * Assert that `input` is a non-array object.
     *
     * @remarks This method does not enforce presence or type checking for any object properties.
     * Additionally, although both are typed as `object` by TypeScript and JavaScript, `null` and arrays are rejected by this method.
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a non-array object.
     *
     * @returns {asserts input is object}
     *
     * @throws {PrimitiveTypeError} When `input` is not a non-array object.
     *
     * @public
     * @since 0.1.0
     */
    public static assertObject(input: unknown, message?: string): asserts input is object {
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a non-array object.');
        }
    }

    /**
     * Assert that `input` is a string.
     *
     * @see {@link StringUtility.assertString}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a string.
     *
     * @returns {asserts input is string}
     *
     * @throws {PrimitiveTypeError} When `input` is not a string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertString(input: unknown, message?: string): asserts input is string {
        StringUtility.assertString(input, message);
    }
}
