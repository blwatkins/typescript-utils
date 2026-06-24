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
import Value from 'typebox/schema';

import {Discriminators, discriminatedSchema, DiscriminatorRegistry, TypeGuard} from '../discriminator';

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

export function buildWeightedList<Type>(elements: { value: Type, weight: number }[]): WeightedList<Type> {
    const outOfRangeWeights: {value: Type, weight: number}[] = elements.filter(element => element.weight < 0 || element.weight > 1);

    if (outOfRangeWeights.length > 0) {
        throw new RangeError('Element weights must be between 0 and 1. Out of range weights: ' + JSON.stringify(outOfRangeWeights));
    }

    const weightSum: number = elements.reduce((sum, element) => sum + element.weight, 0);
    const precisionSum = Number.parseFloat(weightSum.toFixed(4));

    if (precisionSum !== 1) {
        throw new RangeError('Sum of element weights must be 1');
    }

    return elements.map(element => {
       return {
           value: element.value,
           weight: element.weight,
           discriminator: Discriminators.WeightedElement
       }
    });
}

export const isGenericWeightedElement: TypeGuard<WeightedElement<unknown>> = DiscriminatorRegistry.register<WeightedElement<unknown>>({
    discriminator: Discriminators.WeightedElement,
    validator: (input: unknown): input is WeightedElement<unknown> => {
        return Value.Check(Type.Call(weightedElementSchema, [Type.Unknown()]), input)
    }
});

export function isWeightedElement<Type>(input: unknown, valueTypeGuard: (value: unknown) => value is Type): input is WeightedElement<Type> {
    return isGenericWeightedElement(input) && valueTypeGuard(input.value);
}

export class WeightedElementUtility {
    public static buildWeightedElement<Type>(input: { value: Type; weight: number; }): WeightedElement<Type> {
        const weightedElement = {
            ...input,
            discriminator: Discriminators.WeightedElement
        };

        if (!isGenericWeightedElement(weightedElement)) {
            throw new TypeError('Input does not match schema requirements for weighted element value and weight');
        }

        return weightedElement;
    }

    // TODO - check for weight sum
    public static isGenericWeightedList(input: unknown): input is WeightedList<unknown> {
        if (!input) {
            return false;
        }

        if (!Array.isArray(input)) {
            return false;
        }

        return input.reduce((accumulator: boolean, element: unknown): boolean => {
            return accumulator && isGenericWeightedElement(element);
        }, true);
    }

    // TODO - check for weight sum
    public static isWeighedList<Type>(input: unknown, valueTypeGuard: (value: unknown) => value is Type): input is WeightedList<Type> {
        if (!input) {
            return false;
        }

        if (!Array.isArray(input)) {
            return false;
        }

        return input.reduce((accumulator: boolean, element: unknown): boolean => {
            return accumulator && isWeightedElement<Type>(element, valueTypeGuard);
        }, true);
    }
}
