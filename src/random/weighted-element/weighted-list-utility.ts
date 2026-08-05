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

import { SchemaTypeError, StaticInstanceError } from '../../error';

import { WeightedElement, WeightedList } from './weighted-element';
import { WeightedElementUtility } from './weighted-element-utility';

/**
 * Static methods and properties for validating {@link WeightedList} objects.
 *
 * @since 0.1.0
 */
export class WeightedListUtility {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link WeightedListUtility} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('WeightedListUtility is a static class and cannot be instantiated.');
    }

    /**
     * Is the given input a generic {@link WeightedList} object?
     *
     * @remarks This method does not enforce type checking for the {@link WeightedElement.value} property of the list elements.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {unknown} input The input to check.
     *
     * @returns {input is WeightedList<unknown>} `true` if the given input is a valid {@link WeightedList} object; `false` otherwise.
     * For a {@link WeightedList} to be valid, it must be a non-empty array of {@link WeightedElement} objects, where the sum of {@link WeightedElement.weight} properties in the array is equal to 1.
     *
     * @public
     * @since 0.1.0
     */
    public static isGenericWeightedList(input: unknown): input is WeightedList<unknown> {
        if (!input || !Array.isArray(input) || input.length === 0) {
            return false;
        }

        const allWeightedElements: boolean = input.every((element: unknown): boolean => {
            return WeightedElementUtility.isGenericWeightedElement(element);
        });

        if (!allWeightedElements) {
            return false;
        }

        const weightSum: number = input.reduce((sum: number, element: unknown): number => sum + (element as WeightedElement<unknown>).weight, 0);
        const precisionSum: number = Number.parseFloat(weightSum.toFixed(4));
        return precisionSum === 1;
    }

    /**
     * Validate and assert that the given input is a generic {@link WeightedList} object.
     *
     * @remarks This method does not enforce type checking for the {@link WeightedElement.value} property of the given elements in the list.
     *
     * @see {@link WeightedListUtility.isGenericWeightedList}
     *
     * @param {unknown} input - The input to validate.
     *
     * @returns {asserts input is WeightedList<unknown>} Asserts that the given input is a valid {@link WeightedList}.
     *
     * @throws {SchemaTypeError} When the given input is not a valid {@link WeightedList}.
     *
     * @public
     * @since 0.1.0
     */
    public static assertGenericWeightedList(input: unknown): asserts input is WeightedList<unknown> {
        if (!WeightedListUtility.isGenericWeightedList(input)) {
            throw new SchemaTypeError('Input does not match schema requirements for generic WeightedList');
        }
    }
}
