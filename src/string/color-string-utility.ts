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
 */

import { StringUtility } from './string-utility';

const regularExpressions = {
    hexColor: /^(#[A-F0-9]{6}(?:[A-F0-9]{2})?|#[a-f0-9]{6}(?:[a-f0-9]{2})?)$/,
    hexColorRGB: /^(#[A-F0-9]{6}|#[a-f0-9]{6})$/,
    hexColorRGBA: /^(#[A-F0-9]{8}|#[a-f0-9]{8})$/
};

/**
 * Static properties and methods for validating formatted color strings.
 *
 * @since 0.1.0
 */
export class ColorStringUtility {
    /**
     * @throws {Error} - ColorStringUtility is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new Error('ColorStringUtility is a static class and cannot be instantiated.');
    }

    /**
     * @returns {RegExp} Regular expression pattern for validating hex color strings in the format `#RRGGBB` or `#RRGGBBAA`.
     * Case must be consistent in hex color strings: either all lowercase or all uppercase.
     *
     * @public
     * @since 0.1.0
     */
    public static get hexColorPattern(): RegExp {
        return regularExpressions.hexColor;
    }

    /**
     * @returns {RegExp} Regular expression pattern for validating hex color strings in the format `#RRGGBB`.
     * Case must be consistent in hex color strings: either all lowercase or all uppercase.
     *
     * @public
     * @since 0.1.0
     */
    public static get hexColorPatternRGB(): RegExp {
        return regularExpressions.hexColorRGB;
    }

    /**
     * @returns {RegExp} Regular expression pattern for validating hex color strings in the format `#RRGGBBAA`.
     * Case must be consistent in hex color strings: either all lowercase or all uppercase.
     *
     * @public
     * @since 0.1.0
     */
    public static get hexColorPatternRGBA(): RegExp {
        return regularExpressions.hexColorRGBA;
    }

    /**
     * Is the given input a string matching the {@link ColorStringUtility.hexColorPattern} pattern?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if the given input matches the {@link ColorStringUtility.hexColorPattern} pattern; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isHexColor(input: unknown): input is string {
        return StringUtility.isString(input) && ColorStringUtility.hexColorPattern.test(input);
    }

    /**
     * Is the given input a string matching the {@link ColorStringUtility.hexColorPatternRGB} pattern?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if the given input matches the {@link ColorStringUtility.hexColorPatternRGB} pattern; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isHexColorRGB(input: unknown): input is string {
        return StringUtility.isString(input) && ColorStringUtility.hexColorPatternRGB.test(input);
    }

    /**
     * Is the given input a string matching the {@link ColorStringUtility.hexColorPatternRGBA} pattern?
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is string} `true` if the given input matches the {@link ColorStringUtility.hexColorPatternRGBA} pattern; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isHexColorRGBA(input: unknown): input is string {
        return StringUtility.isString(input) && ColorStringUtility.hexColorPatternRGBA.test(input);
    }
}
