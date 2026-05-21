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

const RegularExpressions = {
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
     * @throws {Error} - StringUtility is a static class and cannot be instantiated.
     * @private
     */
    private constructor() {
        throw new Error('StringUtility is a static class and cannot be instantiated.');
    }

    /**
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line lowercase strings.
     *
     * @since 0.1.0
     */
    public static get singleLineLowercaseTrimmedPattern(): RegExp {
        return RegularExpressions.singleLineLowercaseTrimmed;
    }

    /**
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line uppercase strings.
     *
     * @since 0.1.0
     */
    public static get singleLineUppercaseTrimmedPattern(): RegExp {
        return RegularExpressions.singleLineUppercaseTrimmed;
    }

    /**
     * @remarks This expression does not allow tab breaks, new lines, leading whitespace, trailing whitespace, or consecutive spaces within the string.
     *
     * @returns {RegExp} Regular expression pattern for validating single-line mixed-case strings.
     *
     * @since 0.1.0
     */
    public static get singleLineTrimmedPattern(): RegExp {
        return RegularExpressions.singleLineTrimmed;
    }

    /**
     * Is the given input a string?
     *
     * @param {unknown} input
     * @returns {input is string}
     * @since 0.1.0
     */
    public static isString(input: unknown): input is string {
        return typeof input === 'string';
    }

    /**
     * Is the given input a non-empty string?
     * Non-empty strings must contain at least one non-whitespace character.
     *
     * @param {unknown} input
     *
     * @returns {boolean}
     */
    public static isNonEmptyString(input: unknown): boolean {
        return StringUtility.isString(input) && (input.trim().length > 0);
    }

    /**
     * Is the given input a single-line lowercase string that is trimmed (no leading or trailing whitespace)?
     *
     * @see {@link StringUtility.singleLineLowercaseTrimmedPattern}
     *
     * @param {unknown} input
     *
     * @returns {boolean}
     */
    public static isSingleLineLowercaseTrimmedString(input: unknown): boolean {
        return StringUtility.isString(input) && (StringUtility.singleLineLowercaseTrimmedPattern.test(input));
    }

    /**
     * Is the given input a single-line uppercase string that is trimmed (no leading or trailing whitespace)?
     *
     * @see {@link StringUtility.singleLineUppercaseTrimmedPattern}
     *
     * @param {unknown} input
     *
     * @returns {boolean}
     */
    public static isSingleLineUppercaseTrimmedString(input: unknown): boolean {
        return StringUtility.isString(input) && (StringUtility.singleLineUppercaseTrimmedPattern.test(input));
    }

    /**
     * Is the given input a single-line string that is trimmed (no leading or trailing whitespace)?
     *
     * @see {@link StringUtility.singleLineTrimmedPattern}
     *
     * @param {unknown} input
     *
     * @returns {boolean}
     */
    public static isSingleLineTrimmedString(input: unknown): boolean {
        return StringUtility.isString(input) && (StringUtility.singleLineTrimmedPattern.test(input));
    }
}
