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

import { PrimitiveTypeAssertions } from '../../assert';
import { Discriminators } from '../../discriminator';
import { StaticInstanceError } from '../../error';
import { MathUtility } from '../../math';

import { WeightedElement } from './weighted-element';
import { WeightedElementUtility } from './weighted-element-utility';

/**
 * A static utility class for building {@link WeightedElement} objects.
 *
 * @since 0.1.0
 */
export class WeightedElementBuilder {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} - When class is instantiated.
     * {@link WeightedElementBuilder} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('WeightedElementBuilder is a static class and cannot be instantiated');
    }

    /**
     * Builds a {@link WeightedElement} object from the given value and weight.
     *
     * @template TValue - The type of the value of the {@link WeightedElement}.
     *
     * @param {TValue} value - The value of the {@link WeightedElement}.
     * @param {number} weight - The weight of the {@link WeightedElement}.
     *
     * @returns {WeightedElement<TValue>} - A {@link WeightedElement} object with the given value and weight.
     *
     * @public
     * @since 0.1.0
     */
    public static buildFrom<TValue>(value: TValue, weight: number): WeightedElement<TValue> {
        return {
            value: value,
            weight: MathUtility.constrain(weight, WeightedElementUtility.minWeight, WeightedElementUtility.maxWeight),
            discriminator: Discriminators.WeightedElement
        };
    }

    /**
     * Builds a {@link WeightedElement} object from the given input object.
     *
     * @template TValue - The type of the value of the {@link WeightedElement}.
     *
     * @param {{value: TValue, weight: number}} input - The given input object containing the value and weight of the {@link WeightedElement}.
     * @param {TValue} input.value - The value of the {@link WeightedElement}.
     * @param {number} input.weight - The weight of the {@link WeightedElement}.
     *
     * @returns {WeightedElement<TValue>} - A {@link WeightedElement} object with the given value and weight.
     *
     * @public
     * @since 0.1.0
     */
    public static buildFromObject<TValue>(input: { value: TValue; weight: number; }): WeightedElement<TValue> {
        PrimitiveTypeAssertions.assertObjectType(input);
        return WeightedElementBuilder.buildFrom(input.value, input.weight);
    }
}
