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

import Value from 'typebox/value';

import { Type } from 'typebox';

import { DiscriminatorRegistry, Discriminators, TypeGuard } from '../../discriminator';

import { WeightedElement, WeightedList, weightedElementSchema } from './weighted-element';

/**
 * Static methods and properties for building and validating {@link WeightedElement} and {@link WeightedList} objects.
 *
 * @since 0.1.0
 */
export class WeightedElementUtility {
    /**
     * @throws {Error} - WeightedElementUtility is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new Error('WeightedElementUtility is a static class and cannot be instantiated.');
    }

    /**
     * A type guard for {@link WeightedElement} objects.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {boolean} `true` if the input is a {@link WeightedElement}, `false` otherwise.
     *
     * @private
     */
    static readonly #isGenericWeightedElement: TypeGuard<WeightedElement<unknown>> = DiscriminatorRegistry.register<WeightedElement<unknown>>({
        discriminator: Discriminators.WeightedElement,
        validator: (input: unknown): input is WeightedElement<unknown> => {
            return Value.Check(Type.Call(weightedElementSchema, [Type.Unknown()]), input);
        }
    });

    /**
     * Builds a {@link WeightedElement} object with a value of the given type.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {{ value: Type; weight: number; }} input - The input to build the {@link WeightedElement} from.
     *
     * @returns {WeightedElement<Type>} A {@link WeightedElement} object with a value of the given type.
     *
     * @throws {TypeError} - When the given input is not an object.
     * @throws {TypeError} - When the given input does not result in a valid {@link WeightedElement}.
     * See {@link weightedElementSchema} for the requirements of a valid {@link WeightedElement}.
     *
     * @public
     * @since 0.1.0
     */
    public static buildWeightedElement<Type>(input: { value: Type; weight: number; }): WeightedElement<Type> {
        WeightedElementUtility.#validateBuildWeightedElementInput(input);

        const weightedElement = {
            ...input,
            discriminator: Discriminators.WeightedElement
        };

        WeightedElementUtility.#validateWeightedElement(weightedElement);
        return weightedElement;
    }

    /**
     * Builds a {@link WeightedList} object from the given elements list.
     *
     * @param {{ value: Type; weight: number }[]} elements - The elements to build the {@link WeightedList} from.
     * Each element will be converted into a {@link WeightedElement} using {@link WeightedElementUtility.buildWeightedElement}.
     *
     * @returns {WeightedList<Type>} A {@link WeightedList} object containing the given elements.
     *
     * @throws {TypeError} - When the given elements are not a non-empty array.
     * @throws {TypeError} - When the given elements do not result in a valid {@link WeightedList}.
     *
     * @public
     * @since 0.1.0
     */
    public static buildWeightedList<Type>(elements: { value: Type; weight: number; }[]): WeightedList<Type> {
        WeightedElementUtility.#validateBuildWeightedListInput(elements);

        const weightedElements: WeightedElement<Type>[] = elements.map((element: { value: Type; weight: number; }): WeightedElement<Type> => {
            return WeightedElementUtility.buildWeightedElement(element);
        });

        WeightedElementUtility.validateWeightedList(weightedElements);
        return weightedElements;
    }

    /**
     * Is the given input a {@link WeightedElement} object?
     * This method does not enforce type checking for {@link WeightedElement.value}.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is WeightedElement<unknown>} - `true` if the given input is a {@link WeightedElement} object; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isGenericWeightedElement(input: unknown): input is WeightedElement<unknown> {
        return WeightedElementUtility.#isGenericWeightedElement(input);
    }

    /**
     * Is the given input a {@link WeightedElement} object, whose {@link WeightedElement.value} property passes the given type guard function?
     *
     * @param {unknown} input - The input to check.
     * @param {(value: unknown) => boolean} valueTypeGuard - The method used to validate the type of {@link WeightedElement.value}.
     * This method should return `true` if the value is of the expected type, and `false` otherwise.
     * The type validated by the function should match the assigned type of the {@link WeightedElement}.
     *
     * @returns {input is WeightedElement<Type>} - `true` if the given input is a {@link WeightedElement} object with a value of the correct type; `false` otherwise.
     *
     * @throws {TypeError} - When the given `valueTypeGuard` is not a function.
     *
     * @public
     * @since 0.1.0
     */
    public static isWeightedElement<Type>(input: unknown, valueTypeGuard: (value: unknown) => value is Type): input is WeightedElement<Type> {
        if (typeof valueTypeGuard !== 'function') {
            throw new TypeError('Value type guard must be a function');
        }

        return WeightedElementUtility.isGenericWeightedElement(input) && valueTypeGuard(input.value);
    }

    /**
     * Is the given input a {@link WeightedList} object?
     * This method does not enforce type checking for the {@link WeightedElement.value} property of the list elements.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is WeightedList<unknown>} - `true` if the given input is a valid {@link WeightedList} object; `false` otherwise.
     * For a {@link WeightedList} to be valid, it must be a non-empty array of {@link WeightedElement} objects, where the sum of {@link WeightedElement.weight} properties in the array is equal to 1.
     *
     * @public
     * @since 0.1.0
     */
    public static isGenericWeightedList(input: unknown): input is WeightedList<unknown> {
        if (!input || !Array.isArray(input) || input.length === 0) {
            return false;
        }

        const containsWeightedElements: boolean = input.every((element: unknown): boolean => {
            return WeightedElementUtility.isGenericWeightedElement(element);
        });

        if (!containsWeightedElements) {
            return false;
        }

        const weightSum: number = input.reduce((sum: number, element: unknown): number => sum + (element as WeightedElement<unknown>).weight, 0);
        const precisionSum: number = Number.parseFloat(weightSum.toFixed(4));
        return precisionSum === 1;
    }

    /**
     * Is the given input a {@link WeightedList} object, where each {@link WeightedElement} object in the array contains a {@link WeightedElement.value} property that passes the given type guard function?
     *
     * @see {@link WeightedElementUtility.isGenericWeightedList}
     *
     * @param {unknown} input - The input to check.
     * @param {(value: unknown) => boolean} valueTypeGuard - The method used to validate the type of each {@link WeightedElement.value} in the array.
     * This method should return `true` if the value is of the expected type, and `false` otherwise.
     * The type validated by the function should match the assigned type of the {@link WeightedList}.
     *
     * @returns {input is WeightedList<Type>} - `true` if the given input is a {@link WeightedList} object with elements of the correct type; `false` otherwise.
     * For a {@link WeightedList} to be valid, it must be a non-empty array of {@link WeightedElement} objects, where the sum of {@link WeightedElement.weight} properties in the array is equal to 1.
     *
     * @throws {TypeError} - When the given `valueTypeGuard` is not a function.
     *
     * @public
     * @since 0.1.0
     */
    public static isWeightedList<Type>(input: unknown, valueTypeGuard: (value: unknown) => value is Type): input is WeightedList<Type> {
        if (typeof valueTypeGuard !== 'function') {
            throw new TypeError('Value type guard must be a function');
        }

        if (!WeightedElementUtility.isGenericWeightedList(input)) {
            return false;
        }

        return input.every((element: unknown): boolean => {
            return WeightedElementUtility.isWeightedElement(element, valueTypeGuard);
        });
    }

    /**
     * Validate that an object is a valid {@link WeightedList}.
     * This method does not enforce type checking for the {@link WeightedElement.value} property of the given elements in the list.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedList}
     *
     * @param {unknown} list - The list to validate.
     *
     * @returns {void}
     *
     * @throws {TypeError} - When the given list is not a valid {@link WeightedList}.
     *
     * @public
     * @since 0.1.0
     */
    public static validateWeightedList(list: unknown): void {
        if (!WeightedElementUtility.isGenericWeightedList(list)) {
            throw new TypeError('Input does not match schema requirements for weighted list');
        }
    }

    /**
     * Validate the input of {@link WeightedElementUtility.buildWeightedElement}.
     *
     * @param {unknown} input - The input to validate.
     *
     * @returns {void}
     *
     * @throws {TypeError} - When the given input is not an object.
     *
     * @private
     */
    static #validateBuildWeightedElementInput(input: unknown): void {
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
            throw new TypeError('Input must be an object');
        }
    }

    /**
     * Validate the input of {@link WeightedElementUtility.buildWeightedList}.
     *
     * @param {unknown} input - The input to validate.
     *
     * @returns {void}
     *
     * @throws {TypeError} - When the given input is not a non-empty array.
     *
     * @private
     */
    static #validateBuildWeightedListInput(input: unknown): void {
        if (!input || !Array.isArray(input) || input.length === 0) {
            throw new TypeError('Input must be an non-empty array');
        }
    }

    /**
     * Validate that an object is a valid {@link WeightedElement}.
     * This method does not enforce type checking for the {@link WeightedElement.value} property of the given element.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {unknown} element - The element to validate.
     *
     * @returns {void}
     *
     * @throws {TypeError} - When the given element is not a valid {@link WeightedElement}.
     *
     * @private
     */
    static #validateWeightedElement(element: unknown): void {
        if (!WeightedElementUtility.isGenericWeightedElement(element)) {
            throw new TypeError(`Element does not match schema requirements for weighted element`);
        }
    }
}
