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
     * Validate and assert that the given input is an array.
     *
     * @remarks This method does not enforce size requirements or type checking for any array elements.
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when the input is not an array.
     *
     * @returns {asserts input is unknown[]} Asserts that the given input is an array.
     *
     * @throws {PrimitiveTypeError} When the input is not an array.
     *
     * @public
     * @since 0.1.0
     */
    public static assertArrayType(input: unknown, message?: string): asserts input is unknown[] {
        if (!Array.isArray(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected an array, but received: ${typeof input}.`);
        }
    }

    /**
     * Validate and assert that the given input is a callable function.
     *
     * @remarks This method does not enforce type checking for function parameters or return type.
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when the input is not a function.
     *
     * @returns {asserts input is (...args: unknown[]) => unknown} Asserts that the given input is a callable function.
     *
     * @throws {PrimitiveTypeError} When the input is not a callable function.
     *
     * @public
     * @since 0.1.0
     */
    public static assertFunctionType(input: unknown, message?: string): asserts input is (...args: unknown[]) => unknown {
        if (typeof input !== 'function') {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected a function, but received: ${typeof input}.`);
        }
    }

    /**
     * Validate and assert that the given input is a non-array object.
     *
     * @remarks This method does not enforce presence or type checking for any object properties.
     * Additionally, although both are typed as `object` by TypeScript and JavaScript, `null` and arrays are rejected by this method.
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when the input is not a non-array object.
     *
     * @returns {asserts input is object} Asserts that the given input is a non-array object.
     *
     * @throws {PrimitiveTypeError} When the input is not a non-array object.
     *
     * @public
     * @since 0.1.0
     */
    public static assertObjectType(input: unknown, message?: string): asserts input is object {
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected a non-array object, but received: ${typeof input}.`);
        }
    }

    public static assertStringType(input: unknown, message?: string): asserts input is string {
        StringUtility.assertStringType(input, message);
    }
}
