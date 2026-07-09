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

import { Type } from 'typebox';

import { Discriminators, discriminatedSchema } from '../../discriminator';

/**
 * TypeBox schema to validate a {@link WeightedElement} object.
 *
 * @since 0.1.0
 */
export const weightedElementSchema = Type.Generic(
    [Type.Parameter('T')],
    Type.Intersect([
        discriminatedSchema,
        Type.Object(
            {
                /**
                 * The value to be selected from the weighted list.
                 *
                 * @readonly
                 */
                value: Type.Readonly(Type.Ref('T')),

                /**
                 * The probability weight of the element.
                 * Should be a number between 0 and 1, inclusive.
                 *
                 * @readonly
                 * @type {number}
                 */
                weight: Type.Readonly(Type.Number({
                    minimum: 0,
                    maximum: 1
                })),

                /**
                 * The discriminator for the weighted element.
                 *
                 * @readonly
                 * @type {Discriminators.WeightedElement}
                 */
                discriminator: Type.Literal(Discriminators.WeightedElement)
            },
            { additionalProperties: false }
        )
    ])
);

/**
 * Interface for a weighted element, which can be used for non-uniform random selection from a list.
 *
 * @since 0.1.0
 */
export interface WeightedElement<TValue> {
    /**
     * The value to be selected from the weighted list.
     *
     * @readonly
     * @since 0.1.0
     */
    readonly value: TValue;

    /**
     * The probability weight of the element.
     * Should be a number between 0 and 1, inclusive.
     *
     * @readonly
     * @since 0.1.0
     * @type {number}
     */
    readonly weight: number;

    /**
     * The discriminator for the weighted element.
     *
     * @readonly
     * @since 0.1.0
     * @type {Discriminators.WeightedElement}
     */
    readonly discriminator: Discriminators.WeightedElement;
}

/**
 * Type alias for a list of {@link WeightedElement} objects.
 *
 * @see {@link weightedElementSchema}
 *
 * @since 0.1.0
 */
export type WeightedList<TValue> = WeightedElement<TValue>[];
