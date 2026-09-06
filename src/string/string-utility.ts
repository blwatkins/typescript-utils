/*
 * Copyright (c) 2024-2026 Brittni Watkins.
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

const regularExpressions = {
    singleLineLowercaseTrimmed: /^(?!\s)(?!.*\s$)(?!.*\p{Lu})(?!.* {2})[^\t\r\n]+$/u,
    singleLineUppercaseTrimmed: /^(?!\s)(?!.*\s$)(?!.*\p{Ll})(?!.* {2})[^\t\r\n]+$/u,
    singleLineTrimmed: /^(?!\s)(?!.*\s$)(?!.* {2})[^\t\r\n]+$/
};

/**
 * Static properties and methods for validating string types.
 *
 * @since 0.1.0
 */
export class StringUtility {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link StringUtility} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('StringUtility is a static class and cannot be instantiated.');
    }

    /**
     * Get the regular expression for single-line lowercase strings.
     *
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line lowercase strings.
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineLowercaseTrimmedPattern(): RegExp {
        return regularExpressions.singleLineLowercaseTrimmed;
    }

    /**
     * Get the regular expression for single-line uppercase strings.
     *
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line uppercase strings.
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineUppercaseTrimmedPattern(): RegExp {
        return regularExpressions.singleLineUppercaseTrimmed;
    }

    /**
     * Get the regular expression for single-line mixed-case strings.
     *
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line mixed-case strings.
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineTrimmedPattern(): RegExp {
        return regularExpressions.singleLineTrimmed;
    }

    /**
     * Assert that `input` is a string.
     *
     * @see {@link StringUtility.isString}
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when `input` is not a string.
     *
     * @returns {asserts input is string} Asserts that `input` is a string.
     *
     * @throws {PrimitiveTypeError} When `input` is not a string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertString(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isString(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected a string, but received: ${typeof input}.`);
        }
    }

    /**
     * Assert that `input` is a single-line string that is trimmed (no leading or trailing whitespace).
     *
     * @see {@link StringUtility.isSingleLineTrimmedString}
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when `input` is not a single-line trimmed string.
     *
     * @returns {asserts input is string} Asserts that `input` is a single-line trimmed string.
     *
     * @throws {PrimitiveTypeError} When `input` is not a single-line string that is trimmed.
     *
     * @public
     * @since 0.1.0
     */
    public static assertSingleLineTrimmedString(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isSingleLineTrimmedString(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError(`Expected a single-line trimmed string, but received: ${typeof input}.`);
        }
    }

    /**
     * Is `input` a string?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isString(input: unknown): input is string {
        return typeof input === 'string';
    }

    /**
     * Is `input` a non-empty string?
     * Non-empty strings must contain at least one non-whitespace character.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a non-empty string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isNonEmptyString(input: unknown): input is string {
        return StringUtility.isString(input) && (input.trim().length > 0);
    }

    /**
     * Is `input` a single-line lowercase string that is trimmed (no leading or trailing whitespace)?
     *
     * @see {@link StringUtility.singleLineLowercaseTrimmedPattern}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a single-line lowercase string that is trimmed; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineLowercaseTrimmedString(input: unknown): input is string {
        return StringUtility.isString(input) && StringUtility.singleLineLowercaseTrimmedPattern.test(input);
    }

    /**
     * Is `input` a single-line uppercase string that is trimmed (no leading or trailing whitespace)?
     *
     * @see {@link StringUtility.singleLineUppercaseTrimmedPattern}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a single-line uppercase string that is trimmed; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineUppercaseTrimmedString(input: unknown): input is string {
        return StringUtility.isString(input) && StringUtility.singleLineUppercaseTrimmedPattern.test(input);
    }

    /**
     * Is `input` a single-line string that is trimmed (no leading or trailing whitespace)?
     *
     * @see {@link StringUtility.singleLineTrimmedPattern}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a single-line string that is trimmed; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineTrimmedString(input: unknown): input is string {
        return StringUtility.isString(input) && StringUtility.singleLineTrimmedPattern.test(input);
    }

    /* ==================== DEPRECATED ==================== */

    /**
     * Assert that input is a string.
     *
     * @see {@link StringUtility.isString}
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when the input is not a string.
     *
     * @returns {asserts input is string} Asserts that input is a string.
     *
     * @throws {PrimitiveTypeError} When the input is not a string.
     *
     * @deprecated Replaced by {@link StringUtility.assertString}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static assertStringType(input: unknown, message?: string): asserts input is string {
        StringUtility.assertString(input, message);
    }
}
