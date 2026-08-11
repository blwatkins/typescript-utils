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

import { TypeAssertions } from '../../assert';
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

    /**
     * Validate and assert that the given input is a {@link WeightedList} object, where the {@link WeightedElement.value} property of each element passes the given type guard function.
     *
     * @see {@link WeightedListUtility.isWeightedList}
     *
     * @template TValue The type of the value property of the {@link WeightedElement} objects in the list.
     *
     * @param {unknown} input - The input to validate.
     * @param {(value: unknown) => value is TValue} valueTypeGuard - The type guard function used to validate the type or schema of the {@link WeightedElement.value} property of each element in the list.
     * This method should return `true` if the value is of the expected type or schema, and `false` otherwise.
     * The type validated by the function should match the assigned type of the {@link WeightedList}.
     *
     * @returns {asserts input is WeightedList<TValue>} Asserts that the given input is a valid {@link WeightedList}, where the {@link WeightedElement.value} property of each element passes the given type guard function.
     *
     * @throws {PrimitiveTypeError} When the given value type guard is not a function.
     * @throws {SchemaTypeError} When the given input is not a valid {@link WeightedList}, or when the {@link WeightedElement.value} property of any element does not pass the given type guard function.
     *
     * @public
     * @since 0.1.0
     */
    public static assertWeightedList<TValue>(input: unknown, valueTypeGuard: (value: unknown) => value is TValue): asserts input is WeightedList<TValue> {
        if (!WeightedListUtility.isWeightedList(input, valueTypeGuard)) {
            throw new SchemaTypeError('Input does not match schema requirements for WeightedList');
        }
    }

    /**
     * Is the given input a generic {@link WeightedList} object?
     *
     * @remarks This method does not enforce type checking for the {@link WeightedElement.value} property of the list elements.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {unknown} input - The input to check.
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
     * Is the given input a {@link WeightedList} object, where the {@link WeightedElement.value} property of each element passes the given type guard function?
     *
     * @see {@link WeightedListUtility.isGenericWeightedList}
     * @see {@link WeightedElementUtility.isWeightedElement}
     *
     * @template TValue The type of the value property of the {@link WeightedElement} objects in the list.
     *
     * @param {unknown} input - The input to check.
     * @param {(value: unknown) => value is TValue} valueTypeGuard - The type guard function used to validate the type or schema of the {@link WeightedElement.value} property of each element in the list.
     * This method should return `true` if the value is of the expected type or schema, and `false` otherwise.
     * The type validated by the function should match the assigned type of the {@link WeightedList}.
     *
     * @returns {input is WeightedList<TValue>} `true` if the given input is a valid {@link WeightedList} object, where the {@link WeightedElement.value} property of each element passes the given type guard function; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When the given value type guard is not a function.
     *
     * @public
     * @since 0.1.0
     */
    public static isWeightedList<TValue>(input: unknown, valueTypeGuard: (value: unknown) => value is TValue): input is WeightedList<TValue> {
        TypeAssertions.assertFunctionType(valueTypeGuard, 'Value type guard must be a function');

        if (!WeightedListUtility.isGenericWeightedList(input)) {
            return false;
        }

        return input.every((element: WeightedElement<unknown>): boolean => {
            return valueTypeGuard(element.value);
        });
    }
}
