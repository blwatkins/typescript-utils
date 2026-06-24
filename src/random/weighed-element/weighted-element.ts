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

export const weightedElementSchema = Type.Generic(
    [Type.Parameter('T')],
    Type.Intersect([
        discriminatedSchema,
        Type.Object(
            {
                value: Type.Readonly(Type.Ref('T')),
                weight: Type.Readonly(Type.Number({
                    minimum: 0,
                    maximum: 1
                })),
                discriminator: Type.Literal(Discriminators.WeightedElement)
            },
            { additionalProperties: false }
        )
    ])
);

export interface WeightedElement<Type> {
    readonly value: Type,
    readonly weight: number,
    readonly discriminator: Discriminators.WeightedElement
}

export type WeightedList<Type> = WeightedElement<Type>[];
