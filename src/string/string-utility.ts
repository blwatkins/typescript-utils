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
    singleLineLowercase: /^[^\s\p{Lu}]+(?:\u0020[^\s\p{Lu}]+)*$/u,
    singleLineUppercase: /^[^\s\p{Ll}]+(?:\u0020[^\s\p{Ll}]+)*$/u,
    singleLine: /^\S+(?:\u0020\S+)*$/,
    textCharacters: /^(?:[\t\n\r\u0020-\u007E\u00A1-\u00FF\u2022]|\p{RGI_Emoji})+$/v,
    rejectedTextCharacters: /[\u00A6\u00A8\u00AA\u00AC-\u00AD\u00AF\u00B2-\u00BA\u00BC-\u00BE\u00C6\u00D0\u00D7\u00D8\u00DE\u00DF\u00E6\u00F0\u00F8\u00FE]|\r(?!\n)/
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
     * Get the regular expression for single-line mixed-case strings.
     *
     * @remarks This expression assumes the string has already passed {@link StringUtility.isText}.
     * It matches non-whitespace characters separated by single spaces (U+0020).
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @returns {RegExp}
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLine(): RegExp {
        return regularExpressions.singleLine;
    }

    /**
     * Get the regular expression for single-line lowercase strings.
     *
     * @remarks This expression assumes the string has already passed {@link StringUtility.isText}.
     * It matches non-whitespace characters separated by single spaces (U+0020), with no uppercase letters.
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @returns {RegExp}
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineLowercase(): RegExp {
        return regularExpressions.singleLineLowercase;
    }

    /**
     * Get the regular expression for single-line uppercase strings.
     *
     * @remarks This expression assumes the string has already passed {@link StringUtility.isText}.
     * It matches non-whitespace characters separated by single spaces (U+0020), with no lowercase letters.
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @returns {RegExp}
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineUppercase(): RegExp {
        return regularExpressions.singleLineUppercase;
    }

    /**
     * Assert that `input` is a string.
     *
     * @see {@link StringUtility.isString}
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
        if (!StringUtility.isString(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a string.');
        }
    }

    /**
     * Assert that `input` is an empty string.
     *
     * @remarks Empty strings must only contain whitespace characters.
     *
     * @see {@link StringUtility.isEmpty}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not an empty string.
     *
     * @returns {asserts input is string}
     *
     * @throws {PrimitiveTypeError} When `input` is not an empty string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertEmpty(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isEmpty(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected an empty string.');
        }
    }

    /**
     * Assert that `input` is a non-empty string.
     *
     * @remarks Non-empty strings must contain at least one non-whitespace character.
     *
     * @see {@link StringUtility.isNonEmpty}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a non-empty string.
     *
     * @returns {asserts input is string}
     *
     * @throws {PrimitiveTypeError} When `input` is not a non-empty string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertNonEmpty(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isNonEmpty(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a non-empty string.');
        }
    }

    /**
     * Assert that `input` is a text string.
     *
     * @remarks A text string must satisfy all of the following rules:
     * - It must be a string that contains at least one non-whitespace character.
     * - Every character must be a tab, a line feed, a carriage return, printable Basic Latin (U+0020 to U+007E), printable Latin-1 Supplement (U+00A1 to U+00FF), the bullet `•` (U+2022), or part of an emoji sequence recommended for general interchange (RGI).
     * - A line feed must immediately follow every carriage return.
     * - It must not contain any of the following Latin-1 Supplement characters: the soft hyphen (U+00AD), or `¦ ¨ ª ¬ ¯ ² ³ ´ µ ¶ · ¸ ¹ º ¼ ½ ¾ × Æ Ð Ø Þ ß æ ð ø þ`.
     *
     * @see {@link StringUtility.isText}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a text string.
     *
     * @returns {asserts input is string}
     *
     * @throws {PrimitiveTypeError} When `input` is not a text string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertText(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isText(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a text string.');
        }
    }

    /**
     * Assert that `input` is a single-line string.
     *
     * @remarks A single-line string is a text string whose non-whitespace characters are separated by single spaces (U+0020).
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @see {@link StringUtility.isSingleLine}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a single-line string.
     *
     * @returns {asserts input is string}
     *
     * @throws {PrimitiveTypeError} When `input` is not a single-line string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertSingleLine(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isSingleLine(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a single-line string.');
        }
    }

    /**
     * Assert that `input` is a single-line lowercase string.
     *
     * @remarks A single-line string is a text string whose non-whitespace characters are separated by single spaces (U+0020).
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @see {@link StringUtility.isSingleLineLowercase}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a single-line lowercase string.
     *
     * @returns {asserts input is string}
     *
     * @throws {PrimitiveTypeError} When `input` is not a single-line lowercase string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertSingleLineLowercase(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isSingleLineLowercase(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a single-line lowercase string.');
        }
    }

    /**
     * Assert that `input` is a single-line uppercase string.
     *
     * @remarks A single-line string is a text string whose non-whitespace characters are separated by single spaces (U+0020).
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @see {@link StringUtility.isSingleLineUppercase}
     *
     * @param {unknown} input - The input to check.
     * @param {string | undefined} message - Optional message for the error thrown when `input` is not a single-line uppercase string.
     *
     * @returns {asserts input is string}
     *
     * @throws {PrimitiveTypeError} When `input` is not a single-line uppercase string.
     *
     * @public
     * @since 0.1.0
     */
    public static assertSingleLineUppercase(input: unknown, message?: string): asserts input is string {
        if (!StringUtility.isSingleLineUppercase(input)) {
            if (StringUtility.isSingleLine(message)) {
                throw new PrimitiveTypeError(message);
            }

            throw new PrimitiveTypeError('Expected a single-line uppercase string.');
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
     * Is `input` an empty string?
     *
     * @remarks Empty strings must only contain whitespace characters.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is an empty string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isEmpty(input: unknown): input is string {
        return StringUtility.isString(input) && (input.trim().length === 0);
    }

    /**
     * Is `input` a non-empty string?
     *
     * @remarks Non-empty strings must contain at least one non-whitespace character.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a non-empty string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isNonEmpty(input: unknown): input is string {
        return StringUtility.isString(input) && (input.trim().length > 0);
    }

    /**
     * Is `input` a text string?
     *
     * @remarks A text string must satisfy all of the following rules:
     * - It must be a string that contains at least one non-whitespace character.
     * - Every character must be a tab, a line feed, a carriage return, printable Basic Latin (U+0020 to U+007E), printable Latin-1 Supplement (U+00A1 to U+00FF), the bullet `•` (U+2022), or part of an emoji sequence recommended for general interchange (RGI).
     * - A line feed must immediately follow every carriage return.
     * - It must not contain any of the following Latin-1 Supplement characters: the soft hyphen (U+00AD), or `¦ ¨ ª ¬ ¯ ² ³ ´ µ ¶ · ¸ ¹ º ¼ ½ ¾ × Æ Ð Ø Þ ß æ ð ø þ`.
     *
     * @see {@link StringUtility.isNonEmpty}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a text string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isText(input: unknown): input is string {
        return StringUtility.isNonEmpty(input)
            && regularExpressions.textCharacters.test(input)
            && !regularExpressions.rejectedTextCharacters.test(input);
    }

    /**
     * Is `input` a single-line string?
     *
     * @remarks A single-line string is a text string whose non-whitespace characters are separated by single spaces (U+0020).
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @see {@link StringUtility.isText}
     * @see {@link StringUtility.singleLine}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a single-line string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLine(input: unknown): input is string {
        return StringUtility.isText(input) && StringUtility.singleLine.test(input);
    }

    /**
     * Is `input` a single-line lowercase string?
     *
     * @remarks A single-line string is a text string whose non-whitespace characters are separated by single spaces (U+0020).
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @see {@link StringUtility.isText}
     * @see {@link StringUtility.singleLineLowercase}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a single-line lowercase string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineLowercase(input: unknown): input is string {
        return StringUtility.isText(input) && StringUtility.singleLineLowercase.test(input);
    }

    /**
     * Is `input` a single-line uppercase string?
     *
     * @remarks A single-line string is a text string whose non-whitespace characters are separated by single spaces (U+0020).
     * It does not allow tabs, line breaks, leading whitespace, trailing whitespace, or consecutive whitespace.
     *
     * @see {@link StringUtility.isText}
     * @see {@link StringUtility.singleLineUppercase}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a single-line uppercase string; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineUppercase(input: unknown): input is string {
        return StringUtility.isText(input) && StringUtility.singleLineUppercase.test(input);
    }

    /* ******************* TODO: DEPRECATED ******************* */

    /**
     * Get the regular expression for single-line lowercase strings.
     *
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line lowercase strings.
     *
     * @deprecated Replaced by {@link StringUtility.singleLineLowercase}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineLowercaseTrimmedPattern(): RegExp {
        return StringUtility.singleLineLowercase;
    }

    /**
     * Get the regular expression for single-line uppercase strings.
     *
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line uppercase strings.
     *
     * @deprecated Replaced by {@link StringUtility.singleLineUppercase}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineUppercaseTrimmedPattern(): RegExp {
        return StringUtility.singleLineUppercase;
    }

    /**
     * Get the regular expression for single-line mixed-case strings.
     *
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line mixed-case strings.
     *
     * @deprecated Replaced by {@link StringUtility.singleLine}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static get singleLineTrimmedPattern(): RegExp {
        return StringUtility.singleLine;
    }

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
     * @deprecated Replaced by {@link StringUtility.assertSingleLine}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static assertSingleLineTrimmedString(input: unknown, message?: string): asserts input is string {
        StringUtility.assertSingleLine(input, message);
    }

    /**
     * Is `input` a non-empty string?
     * Non-empty strings must contain at least one non-whitespace character.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if `input` is a non-empty string; `false` otherwise.
     *
     * @deprecated Replaced by {@link StringUtility.isNonEmpty}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static isNonEmptyString(input: unknown): input is string {
        return StringUtility.isNonEmpty(input);
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
     * @deprecated Replaced by {@link StringUtility.isSingleLine}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineTrimmedString(input: unknown): input is string {
        return StringUtility.isSingleLine(input);
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
     * @deprecated Replaced by {@link StringUtility.isSingleLineLowercase}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineLowercaseTrimmedString(input: unknown): input is string {
        return StringUtility.isSingleLineLowercase(input);
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
     * @deprecated Replaced by {@link StringUtility.isSingleLineUppercase}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static isSingleLineUppercaseTrimmedString(input: unknown): input is string {
        return StringUtility.isSingleLineUppercase(input);
    }
}
