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

import { Type, Static } from 'typebox';

// TODO - unit tests - make sure min and max cannot be NaN or Infinity (finite numbers only).

/**
 * TypeBox schema to validate a {@link Range} object.
 *
 * @since 0.1.0
 */
export const rangeSchema = Type.Object(
    {
        /**
         * The minimum value of the range.
         *
         * @type {number}
         * @readonly
         */
        min: Type.Readonly(
            Type.Number()
        ),

        /**
         * The maximum value of the range.
         *
         * @type {number}
         * @readonly
         */
        max: Type.Readonly(
            Type.Number()
        ),

        /**
         * Should any values generated from the range include the minimum value?
         *
         * @type {boolean}
         * @readonly
         */
        isMinInclusive: Type.Optional(
            Type.Readonly(
                Type.Boolean()
            )
        ),

        /**
         * Should any values generated from the range include the maximum value?
         *
         * @type {boolean}
         * @readonly
         */
        isMaxInclusive: Type.Optional(
            Type.Readonly(
                Type.Boolean()
            )
        )
    },
    { additionalProperties: false }
);

/**
 * Interface for a range of numbers, starting at `min` and ending at `max`.
 *
 * @since 0.1.0
 */
export type Range = Static<typeof rangeSchema>;
