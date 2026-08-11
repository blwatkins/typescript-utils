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

/**
 * An error thrown when an input does not match the expected value range.
 * This error is typically used in validation or assertion scenarios where the input value does not conform to the expected range.
 *
 * @since 0.1.0
 */
export class ValueRangeError extends RangeError {
    /**
     * Public constructor.
     *
     * @param {string} message - The error message.
     * Default value is {@link ValueRangeError.defaultMessage}.
     *
     * @public
     * @since 0.1.0
     */
    public constructor(message: string = ValueRangeError.defaultMessage) {
        super(message);
        this.name = 'ValueRangeError';
    }

    /**
     * Get the default error message.
     *
     * @returns {string} The default error message for {@link ValueRangeError}.
     *
     * @public
     * @since 0.1.0
     */
    public static get defaultMessage(): string {
        return 'Input does not match value range requirements';
    }
}
